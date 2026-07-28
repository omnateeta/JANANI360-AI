import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LogOut, ShieldCheck, Heart, LayoutDashboard, Baby, Ambulance, Award, Stethoscope } from 'lucide-react';
import { logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-50 backdrop-blur-md px-6 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-emerald-500/20">
            J
          </div>
          <div>
            <span className="text-base font-bold text-slate-100 flex items-center gap-2">
              JANANI360 AI
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {t('common.officialOs')}
              </span>
            </span>
            <span className="text-[11px] text-slate-400 block -mt-0.5">
              {t('common.karnatakaGovt')}
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex items-center gap-1 text-xs">
          <button
            onClick={() => navigate('/dashboard')}
            className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              isActive('/dashboard') || isActive('/mother-profile')
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-emerald-400" />
            {t('common.motherHub')}
          </button>

          <button
            onClick={() => navigate('/casualty-radar')}
            className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              isActive('/casualty-radar')
                ? 'bg-slate-800 text-red-400 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5 text-red-400" />
            {t('common.erRadar')}
          </button>

          <button
            onClick={() => navigate('/labor-dashboard')}
            className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              isActive('/labor-dashboard')
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Baby className="w-3.5 h-3.5 text-amber-400" />
            {t('common.laborWard')}
          </button>

          <button
            onClick={() => navigate('/child-profile')}
            className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              isActive('/child-profile')
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t('common.childHealth')}
          </button>

          <button
            onClick={() => navigate('/child-welfare-hub')}
            className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              isActive('/child-welfare-hub')
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Welfare Hub</span>
          </button>

          <button
            onClick={() => navigate('/phc-doctor')}
            className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              isActive('/phc-doctor') || isActive('/doctor-checkup')
                ? 'bg-slate-800 text-teal-400 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span>PHC Doctor</span>
          </button>

          <button
            onClick={() => navigate('/command-center')}
            className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              isActive('/command-center')
                ? 'bg-slate-800 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
            {t('common.commandCenter')}
          </button>
        </nav>

        {/* Global Language Selector & User Profile & Logout */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <LanguageSelector variant="navbar" />

          <div className="text-right text-xs">
            <span className="font-bold text-slate-100 block">{user?.name || 'Authorized Official'}</span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
              {user?.role || 'ASHA_WORKER'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-950/50"
            title="Logout of JANANI360 OS"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            {t('common.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};
