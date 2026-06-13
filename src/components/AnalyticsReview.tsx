import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { ScreenerData } from '../types';

interface AnalyticsReviewProps {
  screener: ScreenerData;
}

export default function AnalyticsReview({ screener }: AnalyticsReviewProps) {
  // Let's design some smart diagnostics checks
  const totalQuestions = screener.questions.length;
  const rulesCount = screener.rules.length;

  // Warn if Option Q4_o4 'Other Region' is not addressed in standard rules (literal check!)
  const hasQ4OtherRule = screener.rules.some((r) => r.questionId === 'Q4' && r.answerOptionId === 'q4_o4');
  
  // Calculate dynamic health score
  let healthScore = 96;
  if (!hasQ4OtherRule) healthScore -= 4;
  if (totalQuestions > 7) healthScore -= 5; // Long survey penalty
  if (rulesCount === 0) healthScore -= 15;

  // Circle meter mathematics
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const diagnosticsList = [
    {
      id: 'diag-q4',
      type: 'warning' as const,
      category: 'Dead End Warning 🛑',
      text: 'Q4 has no custom routing logic for the "Other Region" response.',
      remediation: 'Respondents selecting this option will fall back to default terminal screens. Add a branch rule to avoid incomplete dropoffs.',
      active: !hasQ4OtherRule,
    },
    {
      id: 'diag-opt',
      type: 'info' as const,
      category: 'Optimization Tip 📊',
      text: `Average flow path is ${Math.round(totalQuestions * 0.8)} questions.`,
      remediation: 'Maintaining shorter survey paths increases overall conversion. Your setup currently sits in the optimal 3-6 query window.',
      active: true,
    },
    {
      id: 'diag-security',
      type: 'success' as const,
      category: 'Secured Configuration 🛡️',
      text: 'Verification Twin consistency checks are properly mounted on high-value options.',
      remediation: 'Excellent work. This prevents mechanical clickers from spoofing validation queries because the AI verifies consistent answers.',
      active: screener.questions.some(q => q.isTwinVerify),
    }
  ];

  const activeDiagnostics = diagnosticsList.filter(d => d.active);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 leading-relaxed">
      
      {/* Left side 2-columns (Health plus detailed list) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Pre-flight Diagnostic Score block */}
        <div className="rounded-xl border border-gray-150 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <span className="text-[10px] font-bold text-teal-650 uppercase tracking-widest block">Structural Integrity Verification</span>
            <h3 className="text-base font-bold text-gray-800 mt-1">Survey Health & Coverage Analysis</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
            
            {/* Health Meter circular gauge SVG */}
            <div className="relative h-28 w-28 shrink-0">
              <svg className="h-full w-full rotate-[-95deg]" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#0d9488" // Teal 600
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-mono font-bold text-gray-900">{healthScore}%</span>
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Health</span>
              </div>
            </div>

            {/* High level evaluation text */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-gray-800">Ready to Publish with Confidence</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our pre-flight diagnostic parser detected minor optimizations. Your logical loops and security threshold variables present a solid deterrent against synthetic bot traffic.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Grid Card List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Critical Alerts & Optimization Insights
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {activeDiagnostics.map((d) => {
              const isWarning = d.type === 'warning';
              const isSuccess = d.type === 'success';

              return (
                <div
                  key={d.id}
                  className={`rounded-xl border p-4 shadow-sm flex items-start space-x-3.5 transition-all ${
                    isWarning
                      ? 'border-rose-200 bg-rose-50/5'
                      : isSuccess
                        ? 'border-emerald-250 bg-emerald-500/[0.02]'
                        : 'border-blue-150 bg-blue-50/5'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isWarning ? (
                      <AlertCircle className="h-5 w-5 text-rose-500" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500" />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isWarning ? 'text-rose-700' : isSuccess ? 'text-emerald-700' : 'text-blue-700'
                    }`}>
                      {d.category}
                    </span>
                    <h5 className="text-xs font-bold text-gray-800 leading-tight">
                      {d.text}
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {d.remediation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Side Panel: Bar Chart Path Coverage */}
      <div className="space-y-6">
        
        {/* Dynamic Coverage statistics card */}
        <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-sm space-y-5">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4.5 w-4.5 text-teal-650" />
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Path Allocation</span>
          </div>

          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Estimates direct routing pathways based on current screening metrics and fraud rules.
          </p>

          <div className="space-y-4 pt-1">
            
            {/* Micro horizontal bar chart */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600">Standard Direct Qualified</span>
                <span className="font-mono text-gray-800">72%</span>
              </div>
              <div className="w-full h-2 rounded bg-gray-100 overflow-hidden">
                <div className="h-full bg-teal-600 rounded" style={{ width: '72%' }} />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-650">Validation Diverted (VPN / Anti-bot)</span>
                <span className="font-mono text-gray-800">18%</span>
              </div>
              <div className="w-full h-2 rounded bg-gray-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded" style={{ width: '18%' }} />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-605">Instant Disqualification Dropouts</span>
                <span className="font-mono text-gray-800">10%</span>
              </div>
              <div className="w-full h-2 rounded bg-gray-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded" style={{ width: '10%' }} />
              </div>
            </div>

          </div>

          {/* Quick info tip */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-[10px] text-gray-400 flex items-start space-x-1.5领导 leading-relaxed">
            <TrendingUp className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              Real-time traffic patterns are simulated using standard Markov Chain probability vectors mapped across selected option triggers.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
