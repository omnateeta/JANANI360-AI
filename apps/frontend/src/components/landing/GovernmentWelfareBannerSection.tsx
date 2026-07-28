import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  PhoneCall, 
  ExternalLink, 
  CreditCard, 
  Stethoscope, 
  Baby, 
  HeartHandshake,
  FileText
} from 'lucide-react';

export const GovernmentWelfareBannerSection: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isKn = i18n.language === 'kn';

  return (
    <section className="py-16 bg-gradient-to-b from-[#070a12] via-slate-950 to-[#070a12] relative overflow-hidden border-y border-slate-800/80">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-wider shadow-lg">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Public Health & Citizen Service Portal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {isKn ? (
              <>ಸರ್ಕಾರದ ನೈಜ ಆರೋಗ್ಯ ಯೋಜನೆಗಳು ಮತ್ತು <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">ಶಿಶು ಕಲ್ಯಾಣ ಸೌಲಭ್ಯಗಳ ಪೋರ್ಟಲ್</span></>
            ) : (
              <>Discover Verified Government <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Child Healthcare & Welfare Schemes</span></>
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            {isKn 
              ? 'MoHFW, NHM, ABDM ಹಾಗೂ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಯೋಜನೆಗಳ ನೈಜ ಮಾಹಿತಿ, ನಗದು ಸಹಾಯಧನ ಮತ್ತು ಉಚಿತ ಚಿಕಿತ್ಸೆಗಳ ಸಾರ್ವಜನಿಕ ಪೋರ್ಟಲ್.' 
              : 'Direct citizen service portal for mothers and families to discover actual government cash incentives (PMMVY, JSY), 100% free JSSK healthcare, and nearby PHCs.'}
          </p>
        </div>

        {/* Feature Hero Image Banner with Direct Access Buttons */}
        <div className="bg-slate-900/90 border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 group hover:border-emerald-500/60 transition">
          
          {/* Left Column: Visual Government Theme Banner Image */}
          <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] bg-slate-950 overflow-hidden">
            <img 
              src="/assets/govt_welfare_hub_banner.jpg" 
              alt="Government Benefits & Child Welfare Hub Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:hidden" />
            
            {/* Top Emblem Badge Overlay */}
            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-200 flex items-center gap-2 shadow-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MoHFW & Karnataka WCD Verified</span>
            </div>
          </div>

          {/* Right Column: Portal Description & Action Buttons */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/40">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded uppercase">
                  100% Official · Zero Dummy Data
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {isKn ? 'ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಸಿಗುವ ಸೌಲಭ್ಯಗಳನ್ನು ತಕ್ಷಣವೇ ಪರಿಶೀಲಿಸಿ' : 'Find Exact Healthcare & Financial Benefits For Your Child'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Every scheme is dynamically verified against published Government notifications. Check cash transfers up to <strong className="text-amber-300 font-extrabold">₹11,400+</strong> and 100% free hospital treatment.
              </p>

              {/* 3 Key Benefits Bullets */}
              <div className="space-y-2 text-xs text-slate-200 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PMMVY ₹5,000 + JSY ₹1,400 + KMC ₹1,000 Direct DBT</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>JSSK 100% Free Medicines, Diagnostics & 108 Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nearby PHC, CHC & Anganwadi Centre Locator</span>
                </div>
              </div>
            </div>

            {/* Public Access Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              
              <button
                onClick={() => navigate('/child-welfare-hub')}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 border border-amber-300 cursor-pointer"
              >
                <Award className="w-5 h-5 text-slate-950" />
                <span>{isKn ? 'ಸಾರ್ವಜನಿಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಪೋರ್ಟಲ್‌ಗೆ ಹೋಗಿ' : 'Open Public Government Welfare Hub'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>National Health Helpline: <strong>104</strong></span>
                </span>
                <span className="text-emerald-400 font-bold">No Login Required for Public Hub</span>
              </div>

            </div>

          </div>

        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-2 transition shadow-xl cursor-pointer" onClick={() => navigate('/child-welfare-hub')}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">PMMVY 2.0 & JSY</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Up to ₹6,000 cash incentive directly deposited into Aadhaar-seeded bank account for mother and child.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-2 transition shadow-xl cursor-pointer" onClick={() => navigate('/child-welfare-hub')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">JSSK 100% Free Care</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero out-of-pocket expenses for delivery, blood, medicines, and 108 ambulance transport up to 1 year.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-2 transition shadow-xl cursor-pointer" onClick={() => navigate('/child-welfare-hub')}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <Baby className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">RBSK 4Ds & KMC</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Free screening & surgery for 30 child birth defects, plus ₹1,000 LBW KMC thermal protection incentive.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-2 transition shadow-xl cursor-pointer" onClick={() => navigate('/child-welfare-hub')}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Nearby Health Centres</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find nearest Primary Health Centres (PHCs), Anganwadis, and 24x7 emergency hospital desks.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};
