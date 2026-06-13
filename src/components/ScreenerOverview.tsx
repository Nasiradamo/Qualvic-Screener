import React from 'react';
import { Info, ShieldAlert, BadgeHelp, CheckCircle, BarChart, Settings, Users, ArrowRight } from 'lucide-react';
import { ScreenerData } from '../types';

interface ScreenerOverviewProps {
  screener: ScreenerData;
  onUpdateScreener: (updated: ScreenerData) => void;
  onSelectTab: (index: number) => void;
}

export default function ScreenerOverview({
  screener,
  onUpdateScreener,
  onSelectTab,
}: ScreenerOverviewProps) {
  // Calculations for summary indicators
  const totalQuestions = screener.questions.length;
  const validationQuestions = screener.validationBranch.verificationQuestions.length;
  const rulesCount = screener.rules.length;

  // Let's calculate the percentage balance between direct paths and validation paths
  // If sensitivity is High, validation paths represent more share.
  const sensitivityWeight = 
    screener.fraudSensitivity === 'high' ? 45 : 
    screener.fraudSensitivity === 'medium' ? 25 : 10;
  
  const validationPathPercent = Math.min(95, Math.max(5, sensitivityWeight + (validationQuestions * 10)));
  const directPathPercent = 100 - validationPathPercent;

  // Math variables for Donut Chart
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validationPathPercent / 100) * circumference;

  const handleSensitivityChange = (level: 'low' | 'medium' | 'high') => {
    onUpdateScreener({
      ...screener,
      fraudSensitivity: level,
    });
  };

  const handleMetadataChange = (field: 'name', value: string) => {
    onUpdateScreener({
      ...screener,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 leading-relaxed">
      {/* Main Content (70% width proportional) */}
      <div className="space-y-6 lg:col-span-2">
        
        {/* Core Screener Details Card */}
        <div id="screener-details-card" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm min-h-[220px]">
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-teal-600">Screener Profile</span>
            <h2 className="text-lg font-bold text-gray-900 mt-1">Study Context & Basic Details</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Study Title
              </label>
              <input
                type="text"
                value={screener.name}
                id="study-name-input"
                onChange={(e) => handleMetadataChange('name', e.target.value)}
                placeholder="E.g., Q2 Hybrid UX & Design Systems Research"
                className="w-full rounded-lg border-transparent hover:border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-transparent py-2.5 text-lg font-semibold text-gray-900 placeholder-gray-300 outline-none transition-all"
              />
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Target Participant Pool Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[100, 250, 500].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="flex flex-col items-center justify-center p-3.5 border border-gray-200 hover:border-teal-600 bg-gray-50/50 hover:bg-teal-50/20 rounded-md text-center transition-all cursor-pointer group"
                  >
                    <span className="text-base font-bold text-gray-800 group-hover:text-teal-700">{size}</span>
                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">Respondents</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fraud Sensitivity Selection */}
        <div
          id="fraud-sensitivity-card"
          className={`rounded-lg border bg-white p-6 transition-all duration-300 ${
            screener.fraudSensitivity === 'high'
              ? 'border-amber-400 bg-amber-50/5 ring-4 ring-amber-400/10 shadow-sm'
              : 'border-gray-200 shadow-sm'
          }`}
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 font-mono">Anti-Fraud Engine</span>
                {screener.fraudSensitivity === 'high' && (
                  <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 tracking-wider">
                    MAXIMUM SECURITY
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-1">Fraud Sensitivity Threshold</h3>
            </div>
            <ShieldAlert className={`h-5 w-5 ${screener.fraudSensitivity === 'high' ? 'text-amber-500 animate-pulse' : 'text-gray-400'}`} />
          </div>

          <p className="text-xs text-gray-500 leading-relaxed mb-5">
            Controls how aggressively suspected participants (VPN users, high response velocity, mismatching browser signatures) are intercepted and diverted into verification micro-tasks.
          </p>

          {/* Segmented Control */}
          <div className="grid grid-cols-3 gap-1 rounded-md bg-gray-100 p-1">
            {(['low', 'medium', 'high'] as const).map((level) => {
              const isSelected = screener.fraudSensitivity === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleSensitivityChange(level)}
                  className={`capitalize py-2 rounded text-[11px] font-semibold select-none transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? level === 'high'
                        ? 'bg-white text-gray-950 shadow-sm font-bold ring-1 ring-amber-200'
                        : 'bg-white text-gray-950 shadow-sm font-bold ring-1 ring-teal-200'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {/* Info Card beneath */}
          <div className="mt-5 flex items-start space-x-3 rounded-lg bg-blue-50/50 border border-blue-100/50 p-4 text-xs text-blue-800">
            <Info className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">Adaptive Validation Routing</p>
              <p className="text-blue-700/80 mt-0.5 leading-relaxed">
                Fraud sensitivity determines how aggressively suspicious participants are routed into validation branches. Setting this to 
                <span className="font-semibold"> High</span> enables double risk scores, verification twin enforcement, and interactive anti-spoof checks.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Builder Walkthrough */}
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-5 flex items-center justify-between">
          <div className="max-w-[420px]">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Need to design questions?</h4>
            <p className="text-xs text-gray-500 mt-1">
              Jump straight into the Canvas Question Editor to create conditional variables, qualification checkpoints, and automatic twin validators.
            </p>
          </div>
          <button 
            onClick={() => onSelectTab(1)}
            className="flex items-center space-x-1 py-1.5 px-3.5 bg-white border border-gray-200 hover:border-teal-600 rounded-lg text-xs font-semibold text-gray-700 hover:text-teal-600 transition-all cursor-pointer"
          >
            <span>Open Canvas</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>

      {/* Side Panel (30% width proportional) */}
      <div className="space-y-6">
        
        {/* Real-time Summary Card */}
        <div id="sticky-real-time-summary-panel" className="sticky top-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-6">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Real-time Summary</h3>
          </div>

          {/* Technical stats elements */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block">Total Questions</span>
              <p className="font-mono text-2xl font-bold text-gray-900">{totalQuestions}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block">Branch Rules</span>
              <p className="font-mono text-2xl font-bold text-gray-900">{rulesCount}</p>
            </div>
            <div className="space-y-1 pt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block">Verification Pools</span>
              <p className="font-mono text-2xl font-bold text-gray-900">{validationQuestions}</p>
            </div>
            <div className="space-y-1 pt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block">Possible Paths</span>
              <p className="font-mono text-2xl font-bold text-gray-900">{totalQuestions * 2 - 1}</p>
            </div>
          </div>

          {/* Path Indicator Donut Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Path Distribution Balance</span>
              <span className="text-[10px] font-mono text-gray-400 font-semibold uppercase">{directPathPercent}% Safe / {validationPathPercent}% Secure</span>
            </div>

            {/* Donut graphic SVG representation */}
            <div className="flex items-center justify-center py-2">
              <div className="relative h-28 w-28">
                <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 80 80">
                  {/* Background Circle representing Direct Paths */}
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="transparent"
                    stroke="#0d9488" // Teal 600
                    strokeWidth="8"
                  />
                  {/* Foreground Segments representing Validation Paths */}
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="transparent"
                    stroke="#f59e0b" // Amber 500
                    strokeWidth="8.2"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                {/* Center text representing live stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-mono font-bold text-gray-800">{screener.fraudSensitivity === 'high' ? 'High' : 'Normal'}</span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold font-sans">Security</span>
                </div>
              </div>
            </div>

            {/* Legend for Chart */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-600 block" />
                  <span>Direct Validation Paths</span>
                </div>
                <span className="font-mono font-bold text-gray-850">{directPathPercent}%</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 block" />
                  <span>Risk Verification Branches</span>
                </div>
                <span className="font-mono font-bold text-gray-850">{validationPathPercent}%</span>
              </div>
            </div>
          </div>

          {/* Quick Warning Check indicator */}
          <div className="bg-gray-50 rounded-md p-3 border border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-teal-500" />
              <span>Diagnostic Check: Passed</span>
            </div>
            <button 
              onClick={() => onSelectTab(6)}
              className="text-teal-600 font-semibold hover:underline"
            >
              Analyze
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
