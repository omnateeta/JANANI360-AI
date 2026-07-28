import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { MotherProfileHub } from './pages/MotherProfileHub';
import { MotherPortalPage } from './pages/MotherPortalPage';
import { AshaDataEntryPage } from './pages/AshaDataEntryPage';
import { AshaDashboardPage } from './pages/AshaDashboardPage';
import { CasualtyErRadarPage } from './pages/CasualtyErRadarPage';
import { FamilyTrackingPage } from './pages/FamilyTrackingPage';
import { LaborRoomDashboardPage } from './pages/LaborRoomDashboardPage';
import { ChildProfileHubPage } from './pages/ChildProfileHubPage';
import { GovernmentChildWelfareHubPage } from './pages/GovernmentChildWelfareHubPage';
import { DistrictCommandCenterPage } from './pages/DistrictCommandCenterPage';
import { MotherPublicProfilePage } from './pages/MotherPublicProfilePage';
import { QrScannerPage } from './pages/QrScannerPage';
import { VerifyCardPage } from './pages/VerifyCardPage';
import { PhcDoctorModulePage } from './pages/PhcDoctorModulePage';
import { LogoutPage } from './pages/LogoutPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { SessionExpiredPage } from './pages/SessionExpiredPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardRouter } from './components/DashboardRouter';
import { fetchCurrentUser } from './store/authSlice';
import { AppDispatch, RootState } from './store';

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/session-expired" element={<SessionExpiredPage />} />
        <Route path="/track/:code" element={<FamilyTrackingPage />} />
        <Route path="/track" element={<FamilyTrackingPage />} />
        <Route path="/mother/:id" element={<MotherPublicProfilePage />} />
        <Route path="/scan-qr" element={<QrScannerPage />} />
        <Route path="/verify-card" element={<VerifyCardPage />} />
        <Route path="/verify/:id" element={<VerifyCardPage />} />
        <Route path="/verify" element={<VerifyCardPage />} />
        <Route 
          path="/phc-doctor" 
          element={
            <ProtectedRoute>
              <PhcDoctorModulePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-checkup" 
          element={
            <ProtectedRoute>
              <PhcDoctorModulePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/asha-entry" 
          element={
            <ProtectedRoute>
              <AshaDataEntryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/asha-dashboard" 
          element={
            <ProtectedRoute>
              <AshaDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register-mother" 
          element={
            <ProtectedRoute>
              <AshaDataEntryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register-mother/new" 
          element={
            <ProtectedRoute>
              <AshaDataEntryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mother-profile" 
          element={
            <ProtectedRoute>
              <MotherPortalPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mother-portal" 
          element={
            <ProtectedRoute>
              <MotherPortalPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mother-hub" 
          element={
            <ProtectedRoute>
              <MotherProfileHub />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/casualty-radar" 
          element={
            <ProtectedRoute>
              <CasualtyErRadarPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/labor-dashboard" 
          element={
            <ProtectedRoute>
              <LaborRoomDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/phc-dashboard" 
          element={
            <ProtectedRoute>
              <LaborRoomDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute>
              <LaborRoomDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/child-profile/:id" 
          element={
            <ProtectedRoute>
              <ChildProfileHubPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/child-profile" 
          element={
            <ProtectedRoute>
              <ChildProfileHubPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/child-welfare-hub/:id" element={<GovernmentChildWelfareHubPage />} />
        <Route path="/child-welfare-hub" element={<GovernmentChildWelfareHubPage />} />
        <Route 
          path="/command-center" 
          element={
            <ProtectedRoute>
              <DistrictCommandCenterPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
