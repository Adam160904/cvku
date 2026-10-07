import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { PublicProfilePage } from './pages/PublicProfilePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { ConfigMissing } from './components/common/ConfigMissing';
import { isSupabaseConfigured } from './lib/supabase';

// Dashboard Pages
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { EducationPage } from './pages/dashboard/EducationPage';
import { SkillPage } from './pages/dashboard/SkillPage';
import { ExperiencePage } from './pages/dashboard/ExperiencePage';
import { PortfolioPage } from './pages/dashboard/PortfolioPage';
import { HobbyPage } from './pages/dashboard/HobbyPage';
import { SocialPage } from './pages/dashboard/SocialPage';
import { PreviewCVPage } from './pages/dashboard/PreviewCVPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

const App: React.FC = () => {
  if (!isSupabaseConfigured) return <ConfigMissing />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/u/:username" element={<PublicProfilePage />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardOverview />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/education" element={<EducationPage />} />
                <Route path="/dashboard/skills" element={<SkillPage />} />
                <Route path="/dashboard/experience" element={<ExperiencePage />} />
                <Route path="/dashboard/portfolio" element={<PortfolioPage />} />
                <Route path="/dashboard/hobbies" element={<HobbyPage />} />
                <Route path="/dashboard/social" element={<SocialPage />} />
                <Route path="/dashboard/preview" element={<PreviewCVPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
