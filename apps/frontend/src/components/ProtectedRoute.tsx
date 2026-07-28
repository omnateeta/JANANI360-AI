import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRole } from '../store/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // If loading without cached user profile, show spinner briefly
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400">Authenticating JANANI360 Credentials...</p>
        </div>
      </div>
    );
  }

  // Check if session token or user profile exists in storage or state
  const hasStoredSession = !!token || !!user || !!localStorage.getItem('janani_access_token') || !!localStorage.getItem('janani_user_profile');

  if (!isAuthenticated && !hasStoredSession) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-red-500/30 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 font-bold text-2xl">
            403
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Access Unauthorized</h2>
          <p className="text-sm text-slate-400 mb-6">
            Your current role (<span className="text-indigo-400 font-semibold">{user.role}</span>) does not possess permission to view this clinical portal section.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
