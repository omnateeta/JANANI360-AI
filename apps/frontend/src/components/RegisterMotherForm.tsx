import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  User,
  Heart,
  Calendar,
  Building2,
  Save,
  RotateCcw,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  FileCheck2,
  MapPin,
  Stethoscope,
  Sparkles,
  Info,
  Check,
  Scan
} from 'lucide-react';
import {
  ashaService,
  AshaVillageOption,
  AshaFacilityOption,
  AshaOcrResult
} from '../services/ashaService';
import { RootState } from '../store';
import { SmartCardScanner } from './SmartCardScanner';
import { RegistrationSuccessModal } from './RegistrationSuccessModal';

interface RegisterMotherFormProps {
  villages: AshaVillageOption[];
  facilities: AshaFacilityOption[];
  loadingOptions?: boolean;
  onSuccess?: (motherId: string) => void;
  onCancel?: () => void;
}

interface FormState {
  fullName: string;
  husbandName: string;
  dob: string;
  age: string;
  phone: string;
  address: string;
  villageId: string;
  taluk: string;
  district: string;
  facilityId: string;
  lmpDate: string;
  gravida: string;
  parity: string;
  abortions: string;
  heightCm: string;
  weightKg: string;
  bloodGroup: string;
  medicalCondition: string;
}

const initialFormState: FormState = {
  fullName: '',
  husbandName: '',
  dob: '',
  age: '',
  phone: '',
  address: '',
  villageId: '',
  taluk: '',
  district: '',
  facilityId: '',
  lmpDate: '',
  gravida: '1',
  parity: '0',
  abortions: '0',
  heightCm: '',
  weightKg: '',
  bloodGroup: 'O+',
  medicalCondition: 'None'
};

const CardHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; step: string }> = ({
  icon,
  title,
  subtitle,
  step
}) => (
  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          {title}
        </h3>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </div>
    <span className="text-[10px] font-black tracking-wider uppercase bg-slate-800 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
      {step}
    </span>
  </div>
);

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1 font-medium">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </p>
  ) : null;

export const RegisterMotherForm: React.FC<RegisterMotherFormProps> = ({
  villages,
  facilities,
  loadingOptions = false,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [successData, setSuccessData] = useState<{ motherId: string; ancNumber: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // AI OCR extracted fields and confidence scores state
  const [extractedFields, setExtractedFields] = useState<Set<string>>(new Set());
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>({});
  const [showOcrVerifyBanner, setShowOcrVerifyBanner] = useState(false);

  // Registration date auto-filled to today's date
  const registrationDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Auto-generate preview ANC Number
  const autoAncPreview = useMemo(() => `KAR-ANC-2026-${Math.floor(10000 + Math.random() * 90000)}`, []);

  // Auto-calculate Expected Delivery Date (EDD = LMP + 280 days / 40 weeks)
  const calculatedEdd = useMemo(() => {
    if (!form.lmpDate) return '';
    const lmp = new Date(form.lmpDate);
    if (isNaN(lmp.getTime())) return '';
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    return edd.toISOString().split('T')[0];
  }, [form.lmpDate]);

  // Derived location details based on selected village
  const selectedVillageInfo = useMemo(() => {
    if (!form.villageId) return { taluk: form.taluk || '', district: form.district || '' };
    const found = villages.find((v) => v.id === form.villageId);
    if (!found) return { taluk: form.taluk || '', district: form.district || '' };
    return {
      taluk: found.hobli?.taluk?.nameEn || form.taluk || 'Mahadevapura',
      district: found.hobli?.taluk?.district?.nameEn || form.district || 'Bengaluru Urban'
    };
  }, [form.villageId, form.taluk, form.district, villages]);

  const getInputClass = (fieldName: string) => {
    const isAutoFilled = extractedFields.has(fieldName);
    const base =
      'w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all';
    if (isAutoFilled) {
      return `${base} bg-emerald-950/40 border-2 border-emerald-500/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 shadow-sm shadow-emerald-500/10`;
    }
    return `${base} bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`;
  };

  const renderConfidenceBadge = (fieldName: string) => {
    const score = confidenceScores[fieldName];
    if (!extractedFields.has(fieldName) || score === undefined) return null;
    return (
      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
        <Check className="w-3 h-3 text-emerald-400" />
        ✓ {score}% confidence
      </span>
    );
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      // Handle DOB <-> Age sync
      if (field === 'dob' && value) {
        const dobDate = new Date(value);
        if (!isNaN(dobDate.getTime())) {
          const ageCalculated = new Date().getFullYear() - dobDate.getFullYear();
          next.age = String(Math.max(12, Math.min(60, ageCalculated)));
        }
      } else if (field === 'age' && value) {
        const ageNum = parseInt(value, 10);
        if (!isNaN(ageNum) && ageNum >= 12 && ageNum <= 60) {
          const calculatedBirthYear = 2026 - ageNum;
          next.dob = `${calculatedBirthYear}-01-15`;
        }
      }

      if (field === 'gravida') {
        const gNum = parseInt(value, 10) || 1;
        const currentP = parseInt(next.parity, 10) || 0;
        if (currentP >= gNum) {
          next.parity = Math.max(0, gNum - 1).toString();
        }
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Bind AI OCR Result to Form
  const handleOcrComplete = (ocrData: AshaOcrResult & Record<string, any>, scores: Record<string, number>) => {
    const updatedForm = { ...form };
    const filledKeys = new Set<string>();

    const isValidVal = (v: any) => v !== null && v !== undefined && v !== 'null' && v !== 'undefined' && String(v).trim() !== '';

    // 1. Mother Full Name
    const nameVal = ocrData.fullName || ocrData.motherName;
    if (isValidVal(nameVal)) {
      updatedForm.fullName = String(nameVal).replace(/\s*\([^)]*\)/g, '').trim();
      filledKeys.add('fullName');
    }

    // 2. Husband Name
    if (isValidVal(ocrData.husbandName)) {
      updatedForm.husbandName = String(ocrData.husbandName).replace(/\s*\([^)]*\)/g, '').trim();
      filledKeys.add('husbandName');
    }

    // 3. Age & Date of Birth
    const ageVal = ocrData.age;
    if (isValidVal(ageVal)) {
      updatedForm.age = String(ageVal).trim();
      const calculatedYear = 2026 - (Number(ageVal) || 24);
      updatedForm.dob = `${calculatedYear}-01-15`;
      filledKeys.add('age');
      filledKeys.add('dob');
    }

    if (isValidVal(ocrData.dateOfBirth)) {
      updatedForm.dob = String(ocrData.dateOfBirth).trim();
      filledKeys.add('dob');
    }

    // 4. Mobile Phone Number
    const mobileVal = ocrData.mobileNumber || ocrData.mobile;
    if (isValidVal(mobileVal)) {
      updatedForm.phone = String(mobileVal).trim();
      filledKeys.add('phone');
    }

    // 5. Door / Street Address
    if (isValidVal(ocrData.address)) {
      updatedForm.address = String(ocrData.address).trim();
      filledKeys.add('address');
    }

    // 6. LMP Date
    if (isValidVal(ocrData.lmp)) {
      updatedForm.lmpDate = String(ocrData.lmp).trim();
      filledKeys.add('lmpDate');
    }

    // 7. Gravida / Pregnancy Number
    const gravidaVal = ocrData.pregnancyNumber || ocrData.gravida;
    if (isValidVal(gravidaVal)) {
      updatedForm.gravida = String(gravidaVal).trim();
      filledKeys.add('gravida');
    }

    // 8. Parity
    if (isValidVal(ocrData.parity)) {
      updatedForm.parity = String(ocrData.parity).trim();
      filledKeys.add('parity');
    }

    // 9. Abortions
    if (isValidVal(ocrData.abortions)) {
      updatedForm.abortions = String(ocrData.abortions).trim();
      filledKeys.add('abortions');
    }

    // 10. Blood Group
    if (isValidVal(ocrData.bloodGroup)) {
      updatedForm.bloodGroup = String(ocrData.bloodGroup).trim();
      filledKeys.add('bloodGroup');
    }

    // 11. Height (cm)
    const heightVal = ocrData.heightCm || ocrData.height;
    if (isValidVal(heightVal)) {
      updatedForm.heightCm = String(heightVal).trim();
      filledKeys.add('heightCm');
    }

    // 12. Weight (kg)
    const weightVal = ocrData.weightKg || ocrData.weight;
    if (isValidVal(weightVal)) {
      updatedForm.weightKg = String(weightVal).trim();
      filledKeys.add('weightKg');
    }

    // 13. Medical Condition / Clinical Risk
    const conditionVal = ocrData.existingMedicalCondition || ocrData.medicalCondition;
    if (isValidVal(conditionVal)) {
      updatedForm.medicalCondition = String(conditionVal).trim();
      filledKeys.add('medicalCondition');
    }

    // 14. Taluk
    if (isValidVal(ocrData.taluk)) {
      updatedForm.taluk = String(ocrData.taluk).trim();
      filledKeys.add('taluk');
    }

    // 15. District
    if (isValidVal(ocrData.district)) {
      updatedForm.district = String(ocrData.district).trim();
      filledKeys.add('district');
    }

    // Match Village dropdown by name if available
    if (ocrData.village && villages.length > 0) {
      const match = villages.find(
        (v) =>
          v.nameEn.toLowerCase().includes(ocrData.village!.toLowerCase()) ||
          (v.nameKn && v.nameKn.includes(ocrData.village!))
      );
      if (match) {
        updatedForm.villageId = match.id;
        filledKeys.add('villageId');
      } else if (villages[0]) {
        updatedForm.villageId = villages[0].id;
        filledKeys.add('villageId');
      }
    } else if (villages.length > 0 && !updatedForm.villageId) {
      updatedForm.villageId = villages[0].id;
      filledKeys.add('villageId');
    }

    if (facilities.length > 0 && !updatedForm.facilityId) {
      updatedForm.facilityId = facilities[0].id;
      filledKeys.add('facilityId');
    }

    setForm(updatedForm);
    setExtractedFields(filledKeys);
    setConfidenceScores(scores);
    setShowOcrVerifyBanner(true);

    window.scrollTo({ top: 450, behavior: 'smooth' });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      errs.fullName = 'Full Name is required (minimum 2 characters)';
    }

    if (!form.husbandName.trim() || form.husbandName.trim().length < 2) {
      errs.husbandName = "Husband's Name is required";
    }

    if (!form.dob) {
      errs.dob = 'Date of Birth is required';
    }

    const ageNum = Number(form.age);
    if (!form.age || isNaN(ageNum) || ageNum < 12 || ageNum > 60) {
      errs.age = 'Enter a valid age between 12 and 60';
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!form.villageId) {
      errs.villageId = 'Village selection is required';
    }

    if (!form.facilityId) {
      errs.facilityId = 'Assigned PHC is required';
    }

    if (!form.lmpDate) {
      errs.lmpDate = 'Last Menstrual Period (LMP) date is required';
    } else if (new Date(form.lmpDate) > new Date()) {
      errs.lmpDate = 'LMP date cannot be in the future';
    }

    const gravidaNum = Number(form.gravida);
    if (isNaN(gravidaNum) || gravidaNum < 1) {
      errs.gravida = 'Gravida must be G1 or higher';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleClearForm = () => {
    setForm(initialFormState);
    setErrors({});
    setServerError(null);
    setExtractedFields(new Set());
    setConfidenceScores({});
    setShowOcrVerifyBanner(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleClearForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        husbandName: form.husbandName.trim(),
        age: Number(form.age),
        phone: form.phone.trim(),
        address: form.address.trim() || undefined,
        villageId: form.villageId,
        facilityId: form.facilityId,
        lmpDate: form.lmpDate,
        gravida: Number(form.gravida),
        parity: Number(form.parity),
        abortions: Number(form.abortions),
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        bloodGroup: form.bloodGroup,
        medicalCondition: form.medicalCondition
      };

      const res = await ashaService.registerMother(payload);

      if (res.success) {
        const uniqueTimestamp = Date.now().toString().slice(-4);
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const generatedId = res.motherId || res.mother?.rchId || `JAN-KA-HVR-${uniqueTimestamp}${randomCode}`;
        const generatedAnc = res.ancNumber || autoAncPreview || `RCH-${Math.floor(100000 + Math.random() * 900000)}`;
        setSuccessData({ motherId: generatedId, ancNumber: generatedAnc });

        // Save to client local storage for instant PHC Doctor lookup
        try {
          const existingRaw = localStorage.getItem('janani_registered_mothers');
          const existingList = existingRaw ? JSON.parse(existingRaw) : [];
          const selectedVillageObj = villages.find((v) => v.id === form.villageId);
          const selectedFacilityObj = facilities.find((f) => f.id === form.facilityId);

          const lmpTime = new Date(form.lmpDate).getTime();
          const calculatedEdd = !isNaN(lmpTime)
            ? new Date(lmpTime + 280 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : '2026-09-07';

          const newMotherEntry = {
            id: res.mother?.id || `m-${generatedId}`,
            rchId: generatedId,
            motherId: generatedId,
            fullName: form.fullName,
            husbandName: form.husbandName,
            age: form.age,
            phone: form.phone,
            bloodGroup: form.bloodGroup || 'O+',
            villageName: selectedVillageObj?.nameEn || 'Varthur Village',
            facilityName: selectedFacilityObj?.nameEn || 'Varthur Primary Health Centre (PHC)',
            assignedAsha: 'Vimala (ASHA Worker)',
            gravida: form.gravida,
            parity: form.parity,
            lmpDate: form.lmpDate,
            eddDate: calculatedEdd
          };
          localStorage.setItem('janani_registered_mothers', JSON.stringify([newMotherEntry, ...existingList]));
        } catch (e) {
          console.warn('Could not cache registered mother in local storage', e);
        }

        if (onSuccess) {
          onSuccess(generatedId);
        }
      } else {
        setServerError(res.message || 'Failed to register mother profile.');
      }
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Server error during mother registration. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Antenatal Card Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <FileCheck2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  ಕರ್ನಾಟಕ ಸರ್ಕಾರ / Govt of Karnataka
                </span>
                <span className="text-[10px] font-bold text-slate-400">RCH Portal</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Mother Registration
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Register a pregnant mother by scanning the Antenatal Card or entering details manually.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl px-4 py-2 flex items-center gap-3 text-xs self-stretch sm:self-auto justify-between">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">ANC Reg No.</span>
              <span className="font-mono font-bold text-emerald-400">{autoAncPreview}</span>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SMART SCAN SECTION (TOP OF PAGE)                          */}
      {/* ========================================================= */}
      <SmartCardScanner
        onScanComplete={handleOcrComplete}
        onScanError={(msg) => setServerError(msg)}
      />

      {/* OCR Verification Notice Banner */}
      {showOcrVerifyBanner && (
        <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-[20px] p-4 text-xs text-emerald-300 flex items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-black text-sm">
              ✔
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-300">
                ✔ AI detected this information successfully.
              </h4>
              <p className="text-slate-300">
                All detected values have been auto-filled into the form below. Please review before submitting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowOcrVerifyBanner(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Modal Overlay with PVC Card & Acknowledgement Receipt */}
      {successData && (
        <RegistrationSuccessModal
          motherId={successData.motherId}
          ancNumber={successData.ancNumber}
          motherData={{
            fullName: form.fullName,
            husbandName: form.husbandName,
            age: form.age,
            phone: form.phone,
            address: form.address,
            village: selectedVillageInfo.taluk ? (villages.find((v) => v.id === form.villageId)?.nameEn || 'Varthur') : 'Varthur',
            taluk: selectedVillageInfo.taluk || 'Mahadevapura',
            district: selectedVillageInfo.district || 'Bengaluru Urban',
            assignedPhc: facilities.find((f) => f.id === form.facilityId)?.nameEn || 'Varthur Primary Health Centre (PHC)',
            lmpDate: form.lmpDate,
            eddDate: calculatedEdd,
            gravida: form.gravida,
            parity: form.parity,
            abortions: form.abortions,
            bloodGroup: form.bloodGroup,
            heightCm: form.heightCm,
            weightKg: form.weightKg,
            medicalCondition: form.medicalCondition,
            ashaWorkerName: user?.name
          }}
          onClose={() => setSuccessData(null)}
        />
      )}

      {/* Global Server Error Banner */}
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 text-xs text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1 font-semibold">{serverError}</div>
          <button type="button" onClick={() => setServerError(null)} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* MANUAL REGISTRATION FORM (ON SAME PAGE DIRECTLY BELOW SCAN) */}
      {/* ========================================================= */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* SECTION 1: Personal Information */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <CardHeader
            icon={<User className="w-5 h-5" />}
            title="1. Personal Information"
            subtitle="Mother's demographic and contact details"
            step="Section 1 of 4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('fullName')}
              </div>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Lakshmi Devi"
                className={getInputClass('fullName')}
              />
              <FieldError msg={errors.fullName} />
            </div>

            {/* Husband Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Husband Name <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('husbandName')}
              </div>
              <input
                type="text"
                value={form.husbandName}
                onChange={(e) => handleChange('husbandName', e.target.value)}
                placeholder="e.g. Manjunath Gowda"
                className={getInputClass('husbandName')}
              />
              <FieldError msg={errors.husbandName} />
            </div>

            {/* Date of Birth */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('dob')}
              </div>
              <input
                type="date"
                value={form.dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleChange('dob', e.target.value)}
                className={getInputClass('dob')}
              />
              <FieldError msg={errors.dob} />
            </div>

            {/* Age */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Age (Years) <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('age')}
              </div>
              <input
                type="number"
                inputMode="numeric"
                min={12}
                max={60}
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 24"
                className={getInputClass('age')}
              />
              <FieldError msg={errors.age} />
            </div>

            {/* Mobile Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('phone')}
              </div>
              <input
                type="tel"
                inputMode="tel"
                maxLength={10}
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 9845012345"
                className={getInputClass('phone')}
              />
              <FieldError msg={errors.phone} />
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Address</label>
                {renderConfidenceBadge('address')}
              </div>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Door No, Street Name, Landmark"
                className={getInputClass('address')}
              />
            </div>

            {/* Village */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Village <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('villageId')}
              </div>
              <select
                value={form.villageId}
                onChange={(e) => handleChange('villageId', e.target.value)}
                className={getInputClass('villageId')}
                disabled={loadingOptions}
              >
                <option value="">{loadingOptions ? 'Loading villages...' : 'Select Village'}</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nameEn} {v.nameKn ? `(${v.nameKn})` : ''}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.villageId} />
            </div>

            {/* Taluk */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Taluk <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('taluk')}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={selectedVillageInfo.taluk}
                  onChange={(e) => handleChange('taluk', e.target.value)}
                  placeholder="e.g. Mahadevapura"
                  className={getInputClass('taluk')}
                />
                <MapPin className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* District */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  District <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('district')}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={selectedVillageInfo.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="e.g. Bengaluru Urban"
                  className={getInputClass('district')}
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Pregnancy Information */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <CardHeader
            icon={<Heart className="w-5 h-5" />}
            title="2. Pregnancy Information"
            subtitle="Obstetric history and pregnancy dates"
            step="Section 2 of 4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ANC Registration Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>ANC Registration Number</span>
                <span className="text-[10px] text-emerald-400 font-bold">Auto-Generated</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={autoAncPreview}
                  className="w-full bg-slate-950 text-emerald-400 font-mono font-bold cursor-not-allowed border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm border"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Pregnancy Number (Gravida) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Pregnancy Number (G1 / G2 / G3...) <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('gravida')}
              </div>
              <select
                value={form.gravida}
                onChange={(e) => handleChange('gravida', e.target.value)}
                className={getInputClass('gravida')}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                  <option key={g} value={g}>
                    G{g} ({g === 1 ? 'First Pregnancy / Primi' : `Pregnancy #${g}`})
                  </option>
                ))}
              </select>
              <FieldError msg={errors.gravida} />
            </div>

            {/* Last Menstrual Period (LMP) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Last Menstrual Period (LMP) <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('lmpDate')}
              </div>
              <input
                type="date"
                value={form.lmpDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleChange('lmpDate', e.target.value)}
                className={getInputClass('lmpDate')}
              />
              <FieldError msg={errors.lmpDate} />
            </div>

            {/* Expected Delivery Date (Auto Calculated) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Expected Delivery Date (EDD)</label>
                <span className="text-[10px] text-teal-400 font-bold">Automatically calculated from LMP</span>
              </div>
              <div className="relative">
                <input
                  type="date"
                  readOnly
                  value={calculatedEdd}
                  placeholder="Select LMP to calculate"
                  className="w-full bg-slate-950 text-teal-300 font-bold cursor-not-allowed border-teal-500/30 rounded-xl px-3.5 py-2.5 text-sm border"
                />
                <Calendar className="w-4 h-4 text-teal-400 absolute right-3 top-3" />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">Calculated as LMP + 280 days (40 gestational weeks)</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Basic Health Information */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <CardHeader
            icon={<Stethoscope className="w-5 h-5" />}
            title="3. Basic Health Information"
            subtitle="Essential baseline measurements and medical history"
            step="Section 3 of 4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blood Group */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Blood Group</label>
                {renderConfidenceBadge('bloodGroup')}
              </div>
              <select
                value={form.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                className={getInputClass('bloodGroup')}
              >
                {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-', 'Unknown'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Height (cm) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Height (cm)</label>
                {renderConfidenceBadge('heightCm')}
              </div>
              <input
                type="number"
                inputMode="decimal"
                min={100}
                max={220}
                value={form.heightCm}
                onChange={(e) => handleChange('heightCm', e.target.value)}
                placeholder="e.g. 154"
                className={getInputClass('heightCm')}
              />
            </div>

            {/* Weight (kg) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Weight (kg)</label>
                {renderConfidenceBadge('weightKg')}
              </div>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min={30}
                max={150}
                value={form.weightKg}
                onChange={(e) => handleChange('weightKg', e.target.value)}
                placeholder="e.g. 52"
                className={getInputClass('weightKg')}
              />
            </div>

            {/* Existing Medical Condition */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Existing Medical Condition</label>
                {renderConfidenceBadge('medicalCondition')}
              </div>
              <select
                value={form.medicalCondition}
                onChange={(e) => handleChange('medicalCondition', e.target.value)}
                className={getInputClass('medicalCondition')}
              >
                <option value="None">None</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: ASHA Details */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <CardHeader
            icon={<Building2 className="w-5 h-5" />}
            title="4. ASHA Information"
            subtitle="Registrar identification and assigned health facility"
            step="Section 4 of 4"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assigned PHC (Dropdown) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Assigned Primary Health Centre (PHC) <span className="text-red-400">*</span>
                </label>
                {renderConfidenceBadge('facilityId')}
              </div>
              <select
                value={form.facilityId}
                onChange={(e) => handleChange('facilityId', e.target.value)}
                className={getInputClass('facilityId')}
                disabled={loadingOptions}
              >
                <option value="">{loadingOptions ? 'Loading health facilities...' : 'Select Assigned PHC'}</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nameEn} {f.nameKn ? `(${f.nameKn})` : ''} [{f.tier}]
                  </option>
                ))}
              </select>
              <FieldError msg={errors.facilityId} />
            </div>

            {/* Registration Date (Auto Fill) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Registration Date</span>
                <span className="text-[10px] text-emerald-400 font-bold">Auto Fill</span>
              </label>
              <input
                type="date"
                readOnly
                value={registrationDate}
                className="w-full bg-slate-950 text-slate-300 font-semibold cursor-not-allowed border-slate-800 rounded-xl px-3.5 py-2.5 text-sm border"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* UNIFIED ACTION BUTTONS                                    */}
        {/* ========================================================= */}
        <div className="sticky bottom-4 z-20 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 hidden sm:block">
            Fields marked with <span className="text-red-400 font-bold">*</span> are required
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Green: Submit Registration Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Submit Registration
                </>
              )}
            </button>

            {/* Gray: Reset Form Button */}
            <button
              type="button"
              onClick={handleClearForm}
              disabled={saving}
              className="flex-1 sm:flex-none px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </button>

            {/* Red: Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 sm:flex-none px-5 py-3.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl border border-red-500/40 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <X className="w-4 h-4 text-red-400" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
