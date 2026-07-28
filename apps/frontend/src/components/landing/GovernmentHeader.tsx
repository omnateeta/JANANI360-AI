import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, ShieldCheck, UserCheck, Menu, X, HeartPulse, Award } from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';

interface GovernmentHeaderProps {
  onOpenLogin: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({ onOpenLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-2xl bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80">
      {/* Topmost Government Official Banner Bar */}
      <div className="govt-banner-bg border-b border-slate-800/80 text-[11px] text-slate-300 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* State & Department Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="text-slate-100 font-semibold">{t('header.stateGovt', 'Government of Karnataka')}</span>
              <span className="text-slate-500 font-light">|</span>
              <span className="hidden sm:inline text-slate-300">{t('header.department', 'Health & Family Welfare Dept')}</span>
              <span className="hidden lg:inline text-slate-500 font-light">|</span>
              <span className="hidden lg:inline text-emerald-400 font-semibold">{t('header.mission', 'National Health Mission (NHM)')}</span>
            </div>
          </div>

          {/* Right Header Actions: Emergency Helpline & Language Switcher & Google Translate */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-950/70 border border-red-500/30 text-red-300 font-bold text-[10px] shadow-sm">
              <PhoneCall className="w-3 h-3 text-red-400 animate-bounce shrink-0" />
              <span>{t('header.helpline', '104 / 108 Emergency Telemetry')}</span>
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="header" />
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Emblem */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20 border border-emerald-300/30 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  JANANI360 AI
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden xs:inline-block">
                  {t('common.officialOs', 'AI MCH OS')}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-medium tracking-wide">
                {t('common.karnatakaGovt', 'Govt. of Karnataka RCH Ecosystem')}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-300">
            <button 
              onClick={() => scrollToSection('overview')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition-all"
            >
              {t('header.nav.overview', 'Overview')}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition-all"
            >
              {t('header.nav.features', 'Capabilities')}
            </button>
            <button 
              onClick={() => scrollToSection('ai-support')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition-all"
            >
              {t('header.nav.aiSupport', 'AI Clinical Engine')}
            </button>
            <button 
              onClick={() => scrollToSection('referral-radar')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition-all"
            >
              {t('header.nav.referralRadar', 'Referral Radar')}
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition-all"
            >
              {t('header.nav.impact', 'State Impact')}
            </button>
            <button 
              onClick={() => scrollToSection('initiatives')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition-all"
            >
              {t('header.nav.initiatives', 'Initiatives')}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate('/child-welfare-hub')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm hover:border-amber-400 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Govt Welfare Hub</span>
            </button>

            <button
              onClick={() => navigate('/track')}
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t('header.motherPortal', 'Mother Portal')}</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{t('header.officialAccess', 'Login / Official Portal')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/98 border-b border-slate-800 px-4 py-4 space-y-4 animate-fade-in shadow-2xl">
          <nav className="flex flex-col gap-1.5 text-xs font-bold text-slate-200">
            <button 
              onClick={() => scrollToSection('overview')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition-colors text-slate-200"
            >
              {t('header.nav.overview', 'Overview')}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition-colors text-slate-200"
            >
              {t('header.nav.features', 'Capabilities')}
            </button>
            <button 
              onClick={() => scrollToSection('ai-support')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition-colors text-slate-200"
            >
              {t('header.nav.aiSupport', 'AI Clinical Engine')}
            </button>
            <button 
              onClick={() => scrollToSection('referral-radar')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition-colors text-slate-200"
            >
              {t('header.nav.referralRadar', 'Referral Radar')}
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition-colors text-slate-200"
            >
              {t('header.nav.impact', 'State Impact')}
            </button>
            <button 
              onClick={() => scrollToSection('initiatives')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 transition-colors text-slate-200"
            >
              {t('header.nav.initiatives', 'Initiatives')}
            </button>
          </nav>
          <div className="pt-3 border-t border-slate-900 flex flex-col gap-2.5">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/child-welfare-hub'); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Govt Benefits & Welfare Hub</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/track'); }}
              className="w-full py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              {t('header.motherPortal', 'Mother Portal')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <UserCheck className="w-4 h-4 text-slate-950 shrink-0" />
              {t('header.officialAccess', 'Login / Official Portal')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
