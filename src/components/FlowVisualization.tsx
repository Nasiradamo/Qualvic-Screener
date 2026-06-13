import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Map, Shield, Flame, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { ScreenerData } from '../types';

interface FlowVisualizationProps {
  screener: ScreenerData;
}

export default function FlowVisualization({ screener }: FlowVisualizationProps) {
  const [zoom, setZoom] = useState(100);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(150, z + 10));
  const handleZoomOut = () => setZoom((z) => Math.max(70, z - 10));
  const handleResetZoom = () => setZoom(100);

  // Helper to determine if a node is target of currently hovered question node
  const isTargetOfHovered = (qId: string) => {
    if (!hoveredNodeId) return false;
    const rules = screener.rules.filter((r) => r.questionId === hoveredNodeId);
    return rules.some((r) => r.action === 'continue' && r.targetQuestionId === qId);
  };

  const isValidationTargetOfHovered = () => {
    if (!hoveredNodeId) return false;
    const rules = screener.rules.filter((r) => r.questionId === hoveredNodeId);
    return rules.some((r) => r.action === 'validation_branch');
  };

  // Helper to determine the target path for an option based on rules
  const getOptionRouteDetails = (qId: string, optId: string) => {
    const rule = screener.rules.find((r) => r.questionId === qId && r.answerOptionId === optId);
    if (!rule) {
      // Default fallback
      return {
        action: 'continue' as const,
        label: 'Next Question (Sequential)',
        colorClass: 'bg-teal-50 text-teal-800 border-teal-100',
        textColor: 'text-teal-600',
      };
    }

    switch (rule.action) {
      case 'qualify':
        return {
          action: 'qualify' as const,
          label: 'Success / Qualify ❇️',
          colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
          textColor: 'text-emerald-600',
        };
      case 'disqualify':
        return {
          action: 'disqualify' as const,
          label: 'Disqualify immediately 🛑',
          colorClass: 'bg-rose-50 text-rose-800 border-rose-100',
          textColor: 'text-rose-600',
        };
      case 'validation_branch':
        return {
          action: 'validation_branch' as const,
          label: 'Security validation check 🛡️',
          colorClass: 'bg-amber-50 text-amber-800 border-amber-100',
          textColor: 'text-amber-600',
        };
      case 'continue':
      default:
        return {
          action: 'continue' as const,
          label: rule.targetQuestionId ? `Goes to ${rule.targetQuestionId}` : 'Next Question',
          colorClass: 'bg-blue-50 text-blue-800 border-blue-100',
          textColor: 'text-blue-600',
          targetId: rule.targetQuestionId,
        };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top action layout bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-150 p-4 rounded-xl shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Visual Flow & Logic Canvas</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Spatial representation of conditional branching paths, verification tunnels, and exit points.
          </p>
        </div>

        {/* Heatmap controller toggle */}
        <button
          onClick={() => setHeatmapMode(!heatmapMode)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
            heatmapMode
              ? 'bg-amber-500 text-white shadow-sm font-bold scale-102'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Show expected drop-off dropouts matching logic rules"
        >
          <Flame className={`h-4.5 w-4.5 ${heatmapMode ? 'fill-white animate-bounce' : 'text-gray-500'}`} />
          <span>{heatmapMode ? 'Overlay Exit Heatmap: Active' : 'Show Traffic Heatmap'}</span>
        </button>
      </div>

      {/* Main Canvas Node View */}
      <div className="relative min-h-[550px] border border-gray-150 rounded-xl overflow-hidden bg-gray-50 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:16px_16px]">
        
        {/* Dynamic Zoom container */}
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          className="p-8 space-y-8 transition-transform duration-200 ease-out flex flex-col md:flex-row md:space-y-0 md:space-x-8 items-start flex-wrap w-full"
        >
          {screener.questions.map((q) => {
            const isSelfHovered = hoveredNodeId === q.id;
            const isTargetNode = isTargetOfHovered(q.id);
            const isDimmed = hoveredNodeId !== null && !isSelfHovered && !isTargetNode;

            return (
              <div
                key={q.id}
                id={`node-${q.id}`}
                onMouseEnter={() => setHoveredNodeId(q.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`w-full md:w-[280px] shrink-0 bg-white border-2 rounded-xl shadow-md p-4 relative space-y-3 transition-all duration-300 ${
                  isSelfHovered
                    ? 'border-blue-600 ring-4 ring-blue-500/20 scale-102 z-20'
                    : isTargetNode
                      ? 'border-teal-500 ring-4 ring-teal-500/20 scale-[1.01] z-20'
                      : isDimmed
                        ? 'border-gray-200 opacity-30 select-none scale-[0.98] blur-[0.2px]'
                        : 'border-blue-500 hover:border-blue-600'
                }`}
              >
                {/* Node Top label */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      {q.id} NODE
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Question</span>
                  </div>
                  {heatmapMode && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1 rounded-sm">
                      🔥 Max Drop
                    </span>
                  )}
                </div>

                {/* Question title text */}
                <p className="text-xs font-bold text-gray-800 leading-tight">
                  {q.text}
                </p>

                {/* Option targets rendering */}
                <div className="space-y-2 pt-1 text-[11px]">
                  {q.options.map((opt) => {
                    const routing = getOptionRouteDetails(q.id, opt.id);
                    // Mock dropout ratios depending on option status
                    const dropSimValue =
                      opt.status === 'disqualify' ? '92%' :
                      opt.status === 'neutral' ? '35%' : '4%';

                    return (
                      <div
                        key={opt.id}
                        className="p-2 rounded bg-gray-50/50 border border-gray-100/50 flex flex-col space-y-1.5 relative group"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-gray-700 font-medium">{opt.text}</span>
                          {heatmapMode && (
                            <span className="text-[10px] font-mono font-bold text-red-500 bg-red-50 px-1 rounded animate-pulse">
                              {dropSimValue} exit
                            </span>
                          )}
                        </div>

                        {/* Connected path link pill */}
                        <div className={`mt-1 py-0.5 px-2 rounded-full border text-[9px] font-bold self-start flex items-center space-x-1 ${routing.colorClass}`}>
                          <span>➔ {routing.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic connection indicator dot */}
                <div className="absolute right-0 top-1/2 -mr-1.5 h-3.5 w-3.5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center text-white" />
              </div>
            );
          })}

          {/* Validation Security Branch Node Block */}
          <div
            id="node-validation-branch"
            onMouseEnter={() => setHoveredNodeId('validation-branch')}
            onMouseLeave={() => setHoveredNodeId(null)}
            className={`w-full md:w-[280px] shrink-0 bg-white border-2 rounded-xl shadow-md p-4 space-y-3 relative overflow-hidden transition-all duration-300 ${
              hoveredNodeId === 'validation-branch'
                ? 'border-amber-600 ring-4 ring-amber-500/25 scale-102 z-20'
                : isValidationTargetOfHovered()
                  ? 'border-amber-400 ring-4 ring-amber-500/20 scale-[1.01] z-20'
                  : hoveredNodeId !== null
                    ? 'border-gray-200 opacity-30 select-none scale-[0.98] blur-[0.2px]'
                    : 'border-amber-500 hover:border-amber-600'
            }`}
          >
            {/* Background pattern mask */}
            <div className="absolute top-0 right-0 p-1.5 bg-amber-500 text-white rounded-bl-lg shadow-sm">
              <Shield className="h-4.5 w-4.5" />
            </div>

            <div className="flex items-center space-x-1.5 border-b border-gray-100 pb-2">
              <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                SEC_GATEWAY
              </span>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Validation Vault</span>
            </div>

            <p className="text-xs font-bold text-gray-800 leading-tight">
              Location Confidence, VPN, & Device Fingerprint Anti-Fraud Branch.
            </p>

            <div className="space-y-1.5 text-[10px] text-gray-600 pt-1">
              <div className="flex items-center justify-between">
                <span>Verification Pool:</span>
                <span className="font-semibold font-mono text-gray-800">{screener.validationBranch.verificationQuestions.length} Questions</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Safety Threshold:</span>
                <span className="font-semibold font-mono text-amber-700 bg-amber-100/55 px-1 rounded">{screener.validationBranch.riskThreshold} PTS</span>
              </div>
            </div>

            {/* Simulated verification outcomes */}
            <div className="bg-amber-50/50 rounded p-2 text-[10px] border border-amber-100 text-amber-800 space-y-1">
              <div className="flex items-center justify-between">
                <span>Pass Path (Score &lt; {screener.validationBranch.riskThreshold} PTS) ➔</span>
                <span className="font-bold text-emerald-600">Qualified</span>
              </div>
              <div className="flex items-center justify-between border-t border-amber-150 pt-1 mt-1">
                <span>Fail Path (Score &gt; {screener.validationBranch.riskThreshold} PTS) ➔</span>
                <span className="font-bold text-rose-600">Quarantine</span>
              </div>
            </div>

          </div>

        </div>

        {/* Floating bottom-left widgets panel */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1.5 bg-white border border-gray-200/80 rounded-xl p-1.5 shadow-md">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-650 font-semibold cursor-pointer"
            title="Screener Canvas Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <span className="text-xs font-mono font-bold text-gray-700 px-1">
            {zoom}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-650 font-semibold cursor-pointer"
            title="Screener Canvas Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <div className="h-4.5 w-px bg-gray-250 mx-1" />

          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-650 font-semibold cursor-pointer"
            title="Reset Fit Viewport"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowMiniMap(!showMiniMap)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showMiniMap ? 'bg-teal-50 text-teal-700 font-bold' : 'hover:bg-gray-100 text-gray-650'
            }`}
            title="Toggle Mini-map Outline"
          >
            <Map className="h-4 w-4" />
          </button>
        </div>

        {/* Floating Mini-Map panel preview in bottom-right */}
        {showMiniMap && (
          <div className="absolute bottom-4 right-4 z-10 w-[140px] h-[95px] bg-white/95 border border-gray-200 rounded-xl shadow-lg p-2 flex flex-col justify-between backdrop-blur-xs select-none">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block border-b pb-0.5 mb-1">
              Canvas Mini-map
            </span>
            {/* Tiny schematic outline */}
            <div className="flex-grow grid grid-cols-5 gap-1 items-center px-1">
              <span className="h-2 rounded bg-blue-500 w-full" />
              <span className="h-2 rounded bg-blue-500 w-full" />
              <span className="h-2 rounded bg-blue-500 w-full" />
              <span className="h-2 rounded bg-blue-500 w-full" />
              <span className="h-2.5 rounded bg-amber-500 w-full" />
            </div>
            <span className="text-[8px] text-gray-400 text-right mt-1 font-mono">
              Viewport: Fit
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
