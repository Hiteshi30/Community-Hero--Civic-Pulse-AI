import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Layout } from './components/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssue } from './pages/ReportIssue';
import { IssueList } from './pages/IssueList';
import { CommunityForum } from './pages/CommunityForum';
import { ChatAgent } from './pages/ChatAgent';
import { Rewards } from './pages/Rewards';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { HelpCenter } from './pages/HelpCenter';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminIssues } from './pages/AdminIssues';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminDepartments } from './pages/AdminDepartments';
import { AdminAgents } from './pages/AdminAgents';
import { AdminSettings } from './pages/AdminSettings';
import { AIOperationsCenter } from './pages/AIOperationsCenter';

// Fallback Page
import { NotFound } from './pages/NotFound';

// Security Auth Guard for Registered Citizens
const CitizenRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, judgeMode } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070B] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!judgeMode && user.role !== 'citizen') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

// Security Auth Guard for Municipal Officers
const OfficerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, judgeMode } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070B] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!judgeMode && user.role !== 'officer') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070B] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Dynamic Resource Routes */}
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/help" element={<Layout><HelpCenter /></Layout>} />

        {/* Protected Citizen Routes inside Layout */}
        <Route path="/dashboard" element={<CitizenRoute><Layout><CitizenDashboard /></Layout></CitizenRoute>} />
        <Route path="/report" element={<CitizenRoute><Layout><ReportIssue /></Layout></CitizenRoute>} />
        <Route path="/issues" element={<CitizenRoute><Layout><IssueList /></Layout></CitizenRoute>} />
        <Route path="/forum" element={<CitizenRoute><Layout><CommunityForum /></Layout></CitizenRoute>} />
        <Route path="/chat" element={<CitizenRoute><Layout><ChatAgent /></Layout></CitizenRoute>} />
        <Route path="/rewards" element={<CitizenRoute><Layout><Rewards /></Layout></CitizenRoute>} />
        <Route path="/profile" element={<CitizenRoute><Layout><Profile /></Layout></CitizenRoute>} />

        {/* Protected Municipal Officer Routes inside Layout */}
        <Route path="/admin" element={<OfficerRoute><Layout><AdminDashboard /></Layout></OfficerRoute>} />
        <Route path="/admin/issues" element={<OfficerRoute><Layout><AdminIssues /></Layout></OfficerRoute>} />
        <Route path="/admin/analytics" element={<OfficerRoute><Layout><AdminAnalytics /></Layout></OfficerRoute>} />
        <Route path="/admin/departments" element={<OfficerRoute><Layout><AdminDepartments /></Layout></OfficerRoute>} />
        <Route path="/admin/agents" element={<OfficerRoute><Layout><AdminAgents /></Layout></OfficerRoute>} />
        <Route path="/admin/ai-ops" element={<OfficerRoute><Layout><AIOperationsCenter /></Layout></OfficerRoute>} />
        <Route path="/admin/reports" element={<OfficerRoute><Layout><AdminDashboard /></Layout></OfficerRoute>} />
        <Route path="/admin/settings" element={<OfficerRoute><Layout><AdminSettings /></Layout></OfficerRoute>} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
