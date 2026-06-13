import React, { useState, useEffect } from 'react';
import { INITIAL_SCREENER, LIST_OF_PERSONAS } from './data';
import { ScreenerData, SimPersona } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Importing Tab Components
import CommandBar from './components/CommandBar';
import ScreenerOverview from './components/ScreenerOverview';
import QuestionBuilder from './components/QuestionBuilder';
import RoutingLogicBuilder from './components/RoutingLogicBuilder';
import ValidationBranchBuilder from './components/ValidationBranchBuilder';
import FlowVisualization from './components/FlowVisualization';
import ParticipantSimulator from './components/ParticipantSimulator';
import AnalyticsReview from './components/AnalyticsReview';
import PublishScreener from './components/PublishScreener';

// Icon library imports
import {
  Search,
  Sparkles,
  Command,
  Save,
  CheckCircle,
  Eye,
  FileText,
  Settings,
  GitBranch,
  Shield,
  Map,
  PlayCircle,
  Activity,
  Send,
  ExternalLink,
  Info,
  ChevronDown,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Users
} from 'lucide-react';

export default function App() {
  const [screener, setScreener] = useState<ScreenerData>(INITIAL_SCREENER);
  const [personas, setPersonas] = useState<SimPersona[]>(LIST_OF_PERSONAS);
  const [activeTab, setActiveTab] = useState(1); // Default to Question Builder (Screener Builder) to match user image!
  const [selectedQuestionId, setSelectedQuestionId] = useState('Q1');
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dynamic conditions based on current state
  const step1Done = !!screener.name.trim();
  const step2Done = screener.questions.length >= 4;
  const step3Done = screener.rules.length >= 8;
  const step4Done = screener.validationBranch.verificationQuestions.length >= 2;
  const step5Done = screener.status === 'live';

  const completedStepsCount = [step1Done, step2Done, step3Done, step4Done, step5Done].filter(Boolean).length;
  const progressPercentage = Math.round((completedStepsCount / 5) * 100);

  // Command+K listener trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleUpdateScreener = (updated: ScreenerData) => {
    setScreener(updated);
  };

  const tabsInfo = [
    { label: 'Project Dashboard', icon: LayoutDashboard, short: 'Dashboard', desc: 'High-level project summary, details, and diagnostic parameters of the survey.' },
    { label: 'Screener Builder', icon: Settings, short: 'Screener', desc: 'Design the questions that decide who joins your study.' },
    { label: 'Adaptive Routing', icon: GitBranch, short: 'Routing', desc: 'Define condition-based jumps that route participants around irrelevant categories.' },
    { label: 'Security Gateway', icon: Shield, short: 'Gateway', desc: 'Configure defense anti-fraud triggers, verification checkpoints and risk thresholds.' },
    { label: 'Flow Visualizer', icon: Map, short: 'Flow Map', desc: 'Visualize the real-time branching logic paths and outcomes.' },
    { label: 'Simulator Sandbox', icon: PlayCircle, short: 'Simulator', desc: 'Animate a live sandbox run or custom persona journey to verify routing and security outcomes.' },
    { label: 'Diagnostics Console', icon: Activity, short: 'Review', desc: 'Review criteria validation records, automated analytics, and diagnostics parameters.' },
    { label: 'Publish & Launch', icon: Send, short: 'Publish', desc: 'Deploy your interactive screener and activate live tracker configurations.' },
  ];

  // Helper selector badge color based on active screener status
  const getStatusBadge = () => {
    switch (screener.status) {
      case 'live':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200">
            {screener.status}
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wider border border-amber-200">
            {screener.status}
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider border border-gray-200">
            {screener.status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-950 flex flex-row antialiased">
      
      {/* Global Cmd+K Search Overlay */}
      <CommandBar
        screener={screener}
        personas={personas}
        onSelectTab={(idx) => setActiveTab(idx)}
        onSelectQuestion={(qId) => setSelectedQuestionId(qId)}
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
      />

      {/* LEFT SIDEBAR (STRIPE/AIRTABLE QUALITY) */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 bg-white flex-col h-screen sticky top-0 shrink-0 z-30 select-none">
        
        {/* LOGO CONTAINER */}
        <div className="h-16 flex items-center px-6 border-b border-gray-150 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-md bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-1.5 w-1.5 bg-white rounded-xs"></div>
                <div className="h-1.5 w-1.5 bg-emerald-300 rounded-sm"></div>
                <div className="h-1.5 w-1.5 bg-emerald-300 rounded-sm"></div>
                <div className="h-1.5 w-1.5 bg-white rounded-xs"></div>
              </div>
            </div>
            <span className="font-extrabold text-sm tracking-wider text-gray-900 font-sans">QUALVIQ</span>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION LIST */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          <div>
            <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase px-3 block mb-3">Menu</span>
            <nav className="space-y-1">
              {tabsInfo.map((tab, idx) => {
                const isActive = activeTab === idx;
                const IconComponent = tab.icon;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#EDF7ED] text-[#1E5D3E] font-bold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 ${isActive ? 'text-[#1E5D3E]' : 'text-gray-400'}`} />
                    <span className="flex-grow">{tab.short}</span>
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-650" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* SIDEBAR FOOTER METRICS */}
        <div className="p-4 border-t border-gray-150 shrink-0 bg-gray-50/50">
          <div className="flex items-center space-x-2 px-2 text-[10px] text-gray-400 font-bold tracking-wider uppercase">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Console</span>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 md:hidden shadow-xl"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-150 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="h-7 w-7 rounded-md bg-emerald-600 flex items-center justify-center text-white">
                    <span className="font-bold text-sm">Q</span>
                  </div>
                  <span className="font-extrabold text-sm tracking-wider text-gray-900 font-sans">QUALVIQ</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 px-1.5 rounded-md text-gray-400 hover:text-gray-750 hover:bg-gray-50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Menus on mobile */}
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-3 block mb-3">Menu</span>
                <nav className="space-y-1">
                  {tabsInfo.map((tab, idx) => {
                    const isActive = activeTab === idx;
                    const IconComponent = tab.icon;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(idx);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#EDF7ED] text-[#1E5D3E] font-bold'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                        }`}
                      >
                        <IconComponent className={`h-4 w-4 ${isActive ? 'text-[#1E5D3E]' : 'text-gray-400'}`} />
                        <span>{tab.short}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CORE CONTENT LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP BRAND HEADER (STRIPE STYLE) */}
        <header className="sticky top-0 z-20 h-16 w-full border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-xs">
          <div className="flex items-center space-x-4">
            
            {/* Hamburger for mobile screens */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb timeline trace to make screen clear */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-gray-400">
              <span className="hover:text-gray-800 transition-colors cursor-pointer">Studies</span>
              <span>/</span>
              <span className="hover:text-gray-800 transition-colors truncate max-w-[140px]">{screener.name || 'Qualvic Customer Survey'}</span>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{tabsInfo[activeTab].short}</span>
            </div>

            <div className="h-4 w-px bg-gray-200 hidden sm:block" />

            {/* Active Screener Badges */}
            {getStatusBadge()}
          </div>

          {/* Quick Spotlight Trigger & Actions */}
          <div className="flex items-center space-x-3.5">
            
            <button
              onClick={() => setIsCommandBarOpen(true)}
              className="hidden lg:flex items-center space-x-2 w-56 rounded-md border border-gray-200 bg-gray-50/80 px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-100/50 hover:border-gray-300 transition-all text-left relative"
            >
              <Search className="h-3 w-3 text-gray-400" />
              <span className="flex-grow text-[11px] font-semibold text-gray-400">Quick Search (⌘K)...</span>
            </button>

            {/* Quick Saves Control */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleSaveDraft}
                disabled={saveStatus === 'saving'}
                className="px-2.5 py-1.5 border border-gray-250 hover:border-teal-600 bg-white rounded-md text-xs font-bold text-teal-600 hover:teal-700 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5 text-teal-600" />
                <span className="text-[11px] font-bold hidden sm:inline">
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Save'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab(5)} 
                className="px-2.5 py-1.5 border border-gray-250 hover:bg-gray-50 rounded-md text-xs font-medium text-gray-600 flex items-center space-x-1 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-[11px] font-bold hidden sm:inline">Simulation Run</span>
              </button>
            </div>

            <div className="h-4 w-px bg-gray-250" />

            {/* Notification triggers */}
            <button className="relative p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-all select-none">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            </button>

            {/* User credentials */}
            <div className="flex items-center space-x-2 pl-1">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                className="h-7 w-7 rounded-full object-cover border border-gray-150"
                alt="Stanley Craig"
              />
              <div className="hidden xl:block text-left select-none leading-none">
                <p className="text-[11px] font-extrabold text-gray-800 block">Stanley Craig</p>
                <span className="text-[9px] text-gray-400 font-semibold block mt-0.5 uppercase tracking-wider font-mono">Qualviq Survey</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden xl:block" />
            </div>

          </div>
        </header>

        {/* WORKSPACE MAIN SCROLL BLOCK */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Elegant Header Title Section matching the user reference design */}
            <div className="border-b border-gray-200 pb-5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                {tabsInfo[activeTab].label}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed max-w-4xl">
                {tabsInfo[activeTab].desc}
              </p>
            </div>

            {/* ONBOARDING PROGRESS SYSTEM (STRIPE STYLE) */}
            <AnimatePresence>
              {showOnboarding && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-800 tracking-wider font-mono uppercase">
                            WORKSPACE PROGRESS
                          </span>
                          <span className="text-xs text-gray-405 font-mono">
                            Deploy checklist
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mt-1">
                          Complete quality checks to activate study targeting
                        </h3>
                        <p className="text-xs text-gray-500 max-w-3xl">
                          Ensure adaptive nodes, qualification parameters, and anti-fraud filters are valid. Checks will instantly turn green as configurations apply in respective workspace tabs.
                        </p>
                      </div>

                      {/* Right checklist counter */}
                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-gray-850 block">
                            {progressPercentage}% Completed
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">
                            {completedStepsCount} of 5 Completed
                          </span>
                        </div>
                        <div className="w-20 h-2 bg-gray-150 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <button
                          onClick={() => setShowOnboarding(false)}
                          className="text-[11px] text-gray-400 hover:text-gray-700 font-semibold px-2 py-1 rounded bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>

                    {/* Progressive milestones step blocks */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                      {/* Step 1 */}
                      <button
                        onClick={() => setActiveTab(0)}
                        className={`p-3 rounded-md border text-left transition-all ${
                          step1Done 
                            ? 'border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Step 1</span>
                          <span className={`text-[11px] font-bold ${step1Done ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {step1Done ? '✓' : '◌'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800">Basic Details</h4>
                        <span className="text-[10px] text-gray-400 block truncate mt-0.5">Define study context</span>
                      </button>

                      {/* Step 2 */}
                      <button
                        onClick={() => setActiveTab(1)}
                        className={`p-3 rounded-md border text-left transition-all ${
                          step2Done 
                            ? 'border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Step 2</span>
                          <span className={`text-[11px] font-bold ${step2Done ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {step2Done ? '✓' : '◌'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800">Screener Qs</h4>
                        <span className="text-[10px] text-gray-400 block truncate mt-0.5">Draft survey questions</span>
                      </button>

                      {/* Step 3 */}
                      <button
                        onClick={() => setActiveTab(2)}
                        className={`p-3 rounded-md border text-left transition-all ${
                          step3Done 
                            ? 'border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Step 3</span>
                          <span className={`text-[11px] font-bold ${step3Done ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {step3Done ? '✓' : '◌'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800">Branching Rules</h4>
                        <span className="text-[10px] text-gray-400 block truncate mt-0.5">Define adaptive jumps</span>
                      </button>

                      {/* Step 4 */}
                      <button
                        onClick={() => setActiveTab(3)}
                        className={`p-3 rounded-md border text-left transition-all ${
                          step4Done 
                            ? 'border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Step 4</span>
                          <span className={`text-[11px] font-bold ${step4Done ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {step4Done ? '✓' : '◌'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800">Security gates</h4>
                        <span className="text-[10px] text-gray-400 block truncate mt-0.5">Validation checkpoints</span>
                      </button>

                      {/* Step 5 */}
                      <button
                        onClick={() => setActiveTab(7)}
                        className={`p-3 rounded-md border text-left transition-all ${
                          step5Done 
                            ? 'border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Step 5</span>
                          <span className={`text-[11px] font-bold ${step5Done ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {step5Done ? '✓' : '◌'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800">Live deploy</h4>
                        <span className="text-[10px] text-gray-400 block truncate mt-0.5">Activate campaign</span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB-RENDERING ROUTER BLOCK */}
            <main className="w-full">
              {activeTab === 0 && (
                <ScreenerOverview
                  screener={screener}
                  onUpdateScreener={handleUpdateScreener}
                  onSelectTab={(idx) => setActiveTab(idx)}
                />
              )}
              {activeTab === 1 && (
                <QuestionBuilder
                  screener={screener}
                  onUpdateScreener={handleUpdateScreener}
                  selectedQuestionId={selectedQuestionId}
                  onSelectQuestion={setSelectedQuestionId}
                />
              )}
              {activeTab === 2 && (
                <RoutingLogicBuilder
                  screener={screener}
                  onUpdateScreener={handleUpdateScreener}
                />
              )}
              {activeTab === 3 && (
                <ValidationBranchBuilder
                  screener={screener}
                  onUpdateScreener={handleUpdateScreener}
                />
              )}
              {activeTab === 4 && (
                <FlowVisualization screener={screener} />
              )}
              {activeTab === 5 && (
                <ParticipantSimulator
                  screener={screener}
                  personas={personas}
                />
              )}
              {activeTab === 6 && (
                <AnalyticsReview screener={screener} />
              )}
              {activeTab === 7 && (
                <PublishScreener
                  screener={screener}
                  onUpdateScreener={handleUpdateScreener}
                />
              )}
            </main>

            {/* INTEGRATED WEB DESKTOP FOOTER */}
            <footer className="border-t border-gray-200 pt-6 pb-2 text-center text-xs text-gray-400 select-none">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                <span className="font-semibold text-gray-400 uppercase tracking-widest font-mono">QUALVIQ PLATFORM CORE INTEGRATIONS</span>
                <div className="flex items-center space-x-1.5 font-bold uppercase tracking-widest">
                  <span className="text-gray-400">v1.4.0 Live Sandbox Engine</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-emerald-700">All Nodes Operational</span>
                </div>
              </div>
            </footer>

          </div>

        </div>

      </div>

    </div>
  );
}
