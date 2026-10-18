import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultsPage } from './pages/ResultsPage';
import { View3DPage } from './pages/View3DPage';
import { HistoryPage } from './pages/HistoryPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { CalibrationPage } from './pages/CalibrationPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const handleNavigate = (tab: string, id?: string) => {
    if (id) setSelectedAnalysisId(id);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'analyze':
        return <AnalyzePage onNavigate={handleNavigate} />;
      case 'results':
        return selectedAnalysisId ? (
          <ResultsPage analysisId={selectedAnalysisId} onNavigate={handleNavigate} />
        ) : (
          <DashboardPage onNavigate={handleNavigate} />
        );
      case '3d':
        return selectedAnalysisId ? (
          <View3DPage analysisId={selectedAnalysisId} onNavigate={handleNavigate} />
        ) : (
          <DashboardPage onNavigate={handleNavigate} />
        );
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
      case 'evaluation':
        return <EvaluationPage />;
      case 'calibration':
        return <CalibrationPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentPage()}
      </main>
      <footer className="border-t border-slate-800 bg-dark-900/80 py-4 text-center text-xs font-mono text-slate-500">
        STEREOVISION CROWD ANALYTICS • Computer-Vision Pipeline v1.0.0
      </footer>
    </div>
  );
};

export default App;
