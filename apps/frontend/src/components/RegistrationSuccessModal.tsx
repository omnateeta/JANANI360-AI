import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  Download,
  CreditCard,
  FileText,
  ExternalLink,
  X,
  Sparkles,
  Send,
  Loader2,
  Check,
  Stethoscope
} from 'lucide-react';
import { DigitalMotherCard, MotherCardData } from './DigitalMotherCard';
import { RegistrationAcknowledgement, AcknowledgementData } from './RegistrationAcknowledgement';

interface RegistrationSuccessModalProps {
  motherId: string; // e.g. JAN-KA-HVR-000001
  ancNumber: string;
  motherData: {
    fullName: string;
    husbandName: string;
    age: number | string;
    phone: string;
    address?: string;
    village: string;
    taluk: string;
    district: string;
    assignedPhc: string;
    lmpDate: string;
    eddDate: string;
    gravida: number | string;
    parity?: number | string;
    abortions?: number | string;
    bloodGroup?: string;
    heightCm?: number | string;
    weightKg?: number | string;
    medicalCondition?: string;
    ashaWorkerName?: string;
  };
  onClose: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  motherId,
  ancNumber,
  motherData,
  onClose
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'card' | 'receipt'>('card');
  const [sentToPhc, setSentToPhc] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('janani360_phc_referrals') || '[]');
      if (existing.some((item: any) => item.id === motherId)) {
        setSentToPhc(true);
      }
    } catch (e) {}
  }, [motherId]);

  const cardPayload: MotherCardData = {
    motherId,
    fullName: motherData.fullName,
    husbandName: motherData.husbandName,
    age: motherData.age,
    phone: motherData.phone,
    village: motherData.village,
    assignedPhc: motherData.assignedPhc,
    bloodGroup: motherData.bloodGroup || 'O+'
  };

  const acknowledgementPayload: AcknowledgementData = {
    registrationNo: ancNumber,
    motherId,
    motherName: motherData.fullName,
    dob: `${2026 - Number(motherData.age || 24)}-01-15`,
    age: motherData.age,
    husbandName: motherData.husbandName,
    mobile: motherData.phone,
    address: motherData.address,
    village: motherData.village,
    taluk: motherData.taluk,
    district: motherData.district,
    assignedPhc: motherData.assignedPhc,
    lmp: motherData.lmpDate,
    edd: motherData.eddDate,
    pregnancyNumber: motherData.gravida,
    parity: motherData.parity,
    abortions: motherData.abortions,
    bloodGroup: motherData.bloodGroup,
    heightCm: motherData.heightCm,
    weightKg: motherData.weightKg,
    medicalCondition: motherData.medicalCondition,
    registrationDate: new Date().toISOString().split('T')[0],
    ashaWorkerName: motherData.ashaWorkerName || 'Sanveeka Gowda (ASHA)'
  };

  const handleSendToPhcDoctor = () => {
    setSending(true);
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('janani360_phc_referrals') || '[]');
        if (!existing.some((item: any) => item.id === motherId)) {
          existing.unshift({
            id: motherId,
            fullName: motherData.fullName,
            rchId: ancNumber,
            village: motherData.village,
            assignedPhc: motherData.assignedPhc,
            medicalCondition: motherData.medicalCondition || 'Anemia Surveillance',
            edd: motherData.eddDate,
            transmittedAt: new Date().toISOString(),
            status: 'URGENT_PHC_REVIEW'
          });
          localStorage.setItem('janani360_phc_referrals', JSON.stringify(existing));
        }
        setSentToPhc(true);
      } catch (e) {
        console.error('Error saving PHC referral:', e);
      } finally {
        setSending(false);
      }
    }, 900);
  };

  const handleViewProfile = () => {
    navigate(`/mother-profile?id=${motherId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative my-6 mx-auto sm:my-10 print:p-0 print:border-none print:bg-white print:max-w-none print:my-0 animate-fadeIn">
        {/* Top Title & Close (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                  NHM Karnataka · Verified Digital Record
                </span>
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                ✅ Mother Registration &amp; Case Generation Successful
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Official Maternal Credentials generated. Download PDF Receipt, scan Smart ID QR, or refer directly to PHC Doctor below.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent PHC Referral Action Banner (Hidden in Print) */}
        <div className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden ${
          sentToPhc
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : 'bg-gradient-to-r from-slate-850 to-slate-900 border-2 border-rose-500/40 shadow-xl shadow-rose-500/10'
        }`}>
          <div className="flex items-center gap-3 text-left">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${
              sentToPhc ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
            }`}>
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">
                {sentToPhc ? '⚡ Case Successfully Transmitted to PHC Doctor Review' : '🚀 Send Case to Primary Health Care (PHC) Doctor Review'}
              </h4>
              <p className="text-xs text-slate-300">
                {sentToPhc
                  ? `Vitals for ${motherData.fullName} are active on the PHC Medical Officer queue & district command radar.`
                  : `Transmit maternal clinical evaluation directly to the assigned Primary Health Care (${motherData.assignedPhc || 'PHC'}) Doctor.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {sentToPhc ? (
              <button
                type="button"
                onClick={() => navigate('/phc-dashboard')}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow"
              >
                Inspect in PHC Portal →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendToPhcDoctor}
                disabled={sending}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{sending ? 'Transmitting...' : 'Send to PHC Doctor'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher: Smart ID Card vs Acknowledgement Receipt (Hidden in Print) */}
        <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800 print:hidden shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'card'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Smart Mother ID Card</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'receipt'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Registration Acknowledgement</span>
          </button>
        </div>

        {/* Active Content Preview */}
        <div className="py-2">
          {activeTab === 'card' ? (
            <DigitalMotherCard data={cardPayload} />
          ) : (
            <RegistrationAcknowledgement data={acknowledgementPayload} />
          )}
        </div>

        {/* Bottom Bar (Hidden in Print) */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="text-xs text-slate-300 font-mono">
            Mother Code: <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg ml-1">{motherId}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Print Document</span>
            </button>
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Mother Profile</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessModal;
