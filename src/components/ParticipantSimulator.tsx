import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Shield, CheckCircle, AlertTriangle, Eye, ShieldAlert, Wifi, Clock, Locate } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenerData, SimPersona } from '../types';

interface ParticipantSimulatorProps {
  screener: ScreenerData;
  personas: SimPersona[];
}

export default function ParticipantSimulator({
  screener,
  personas,
}: ParticipantSimulatorProps) {
  const [selectedPersona, setSelectedPersona] = useState<SimPersona>(personas[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [traceHistory, setTraceHistory] = useState<string[]>([]);
  const [simOutcome, setSimOutcome] = useState<'idle' | 'qualified' | 'disqualified' | 'validation' | 'flagged'>('idle');
  const [riskPointsAccumulated, setRiskPointsAccumulated] = useState(0);

  // Restart trace anytime the persona changes
  useEffect(() => {
    handleReset();
  }, [selectedPersona]);

  const handleReset = () => {
    setIsSimulating(false);
    setCurrentStepIndex(-1);
    setTraceHistory([]);
    setSimOutcome('idle');
    setRiskPointsAccumulated(0);
  };

  const startSimulation = () => {
    handleReset();
    setIsSimulating(true);
    setCurrentStepIndex(0);
    setTraceHistory(['Q1']);
    setRiskPointsAccumulated(0);
  };

  // Simulation State Machine Core Tick Loop
  useEffect(() => {
    if (!isSimulating || currentStepIndex === -1) return;

    const currentId = traceHistory[currentStepIndex];
    if (!currentId) return;

    // Is it a terminal state?
    if (currentId === 'QUALIFIED' || currentId === 'DISQUALIFIED' || currentId === 'VALIDATION' || currentId === 'FLAGGED') {
      setIsSimulating(false);
      setSimOutcome(
        currentId === 'QUALIFIED' ? 'qualified' :
        currentId === 'DISQUALIFIED' ? 'disqualified' :
        currentId === 'VALIDATION' ? 'validation' : 'flagged'
      );
      return;
    }

    const timer = setTimeout(() => {
      // 1. Process current question
      const isVQ = currentId.startsWith('VQ');
      let question = isVQ 
        ? screener.validationBranch.verificationQuestions.find(v => v.id === currentId)
        : screener.questions.find(q => q.id === currentId);

      if (!question) {
        // Fallback sequentially or finish
        setTraceHistory(prev => [...prev, 'QUALIFIED']);
        setCurrentStepIndex(prev => prev + 1);
        return;
      }

      // Check for security override mismatch
      // Let's accumulate risk score based on persona settings
      let stepRiskMultiplier = 0;
      if (selectedPersona.vpn && screener.validationBranch.smartTriggers.vpnDetected) {
        stepRiskMultiplier += 25;
      }
      if (selectedPersona.ipMismatch && screener.validationBranch.smartTriggers.ipMismatch) {
        stepRiskMultiplier += 35;
      }
      if (selectedPersona.rapid && screener.validationBranch.smartTriggers.rapidResponse) {
        stepRiskMultiplier += 20;
      }

      // 2. Identify selected option
      const chosenOptionId = selectedPersona.answers[currentId];
      const optionObject = question.options.find(o => o.id === chosenOptionId);

      // If they failed verification question, accumulate lots of risk weight
      if (isVQ && optionObject && optionObject.status === 'disqualify') {
        stepRiskMultiplier += question.fraudWeight;
      }

      // Check current accumulated points
      const updatedAccumulatedRisk = riskPointsAccumulated + (optionObject?.status === 'disqualify' ? question.fraudWeight : 0) + stepRiskMultiplier;
      setRiskPointsAccumulated(updatedAccumulatedRisk);

      // 3. Routing Rules logic decision
      // Is there matching custom rule?
      const rule = screener.rules.find(r => r.questionId === currentId && r.answerOptionId === chosenOptionId);

      // If cumulative risk exceeds the validation branch threshold limits, we route them immediately
      if (updatedAccumulatedRisk >= screener.validationBranch.riskThreshold && !isVQ) {
        // If they trigger security limit and VPN is on, send to Security Validation Gateway!
        if (selectedPersona.vpn || selectedPersona.ipMismatch) {
          setTraceHistory(prev => [...prev, 'VALIDATION']);
          setCurrentStepIndex(prev => prev + 1);
          return;
        } else {
          setTraceHistory(prev => [...prev, 'FLAGGED']);
          setCurrentStepIndex(prev => prev + 1);
          return;
        }
      }

      let nextStepStr = '';
      if (rule) {
        if (rule.action === 'qualify') {
          nextStepStr = 'QUALIFIED';
        } else if (rule.action === 'disqualify') {
          nextStepStr = 'DISQUALIFIED';
        } else if (rule.action === 'validation_branch') {
          nextStepStr = 'VALIDATION';
        } else if (rule.action === 'continue' && rule.targetQuestionId) {
          nextStepStr = rule.targetQuestionId;
        }
      } else {
        // Sequentially search next question
        if (isVQ) {
          const currentVQIndex = screener.validationBranch.verificationQuestions.findIndex(v => v.id === currentId);
          if (currentVQIndex < screener.validationBranch.verificationQuestions.length - 1) {
            nextStepStr = screener.validationBranch.verificationQuestions[currentVQIndex + 1].id;
          } else {
            // Evaluated VQ pool completely. Are they safe?
            if (updatedAccumulatedRisk >= screener.validationBranch.riskThreshold) {
              nextStepStr = 'FLAGGED';
            } else {
              nextStepStr = 'QUALIFIED';
            }
          }
        } else {
          const currentIndex = screener.questions.findIndex(q => q.id === currentId);
          if (currentIndex < screener.questions.length - 1) {
            nextStepStr = screener.questions[currentIndex + 1].id;
          } else {
            nextStepStr = 'QUALIFIED';
          }
        }
      }

      // If we are currently entering validation branch queue (redirecting)
      if (nextStepStr === 'VALIDATION' && screener.validationBranch.verificationQuestions.length > 0) {
        // Start load VQ1 instead of instant TERMINAL VALIDATION
        setTraceHistory(prev => [...prev, screener.validationBranch.verificationQuestions[0].id]);
      } else {
        setTraceHistory(prev => [...prev, nextStepStr]);
      }

      setCurrentStepIndex(prev => prev + 1);

    }, 1500); // Step timer tick in simulated state machine

    return () => clearTimeout(timer);
  }, [isSimulating, currentStepIndex, traceHistory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">
      
      {/* Left Persona selection panel */}
      <div className="lg:col-span-4 space-y-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Persona Selection Panels
        </h4>

        <div className="space-y-3">
          {personas.map((persona) => {
            const isSelected = selectedPersona.id === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/20 shadow-sm'
                    : 'border-gray-250 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{persona.avatar}</span>
                  <div>
                    <h5 className="text-sm font-bold text-gray-800">{persona.name}</h5>
                    <span className="text-[11px] text-gray-400 font-semibold">{persona.role}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                  {persona.description}
                </p>

                {/* Tags mapping */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {persona.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase border border-gray-150"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Trace Canvas animation */}
      <div className="lg:col-span-8 flex flex-col justify-between rounded-xl border border-gray-150 bg-white p-5 shadow-sm min-h-[500px]">
        
        {/* Sub-header controls */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Live Sandbox Trace</span>
            <h4 className="text-base font-bold text-gray-800">
              Active Runner: {selectedPersona.name}
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className="flex items-center space-x-1 py-1.5 px-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Simulate Journey</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-650 cursor-pointer"
              title="Reset state machine"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Panel Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Path Trace Map Visual */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Route Sequence Logs</span>
            
            <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-0.5 before:bg-gray-200">
              {traceHistory.map((stepId, index) => {
                const isActive = index === currentStepIndex && isSimulating;
                const isCompleted = index < currentStepIndex;
                const isTerminal = stepId === 'QUALIFIED' || stepId === 'DISQUALIFIED' || stepId === 'VALIDATION' || stepId === 'FLAGGED';

                // Answer chosen representation
                const answerOptionChosen = selectedPersona.answers[stepId];
                let questionTitle = stepId;
                let optionText = '';

                if (!isTerminal) {
                  const isVQ = stepId.startsWith('VQ');
                  const qObj = isVQ 
                    ? screener.validationBranch.verificationQuestions.find(v => v.id === stepId)
                    : screener.questions.find(q => q.id === stepId);
                  
                  if (qObj) {
                    questionTitle = `${qObj.id}: ${qObj.text.slice(0, 30)}...`;
                    const optObj = qObj.options.find(o => o.id === answerOptionChosen);
                    if (optObj) {
                      optionText = `"${optObj.text}"`;
                    }
                  }
                }

                return (
                  <div
                    key={stepId + '-' + index}
                    className={`flex items-start space-x-3.5 relative transition-all ${
                      isActive ? 'translate-x-1.5' : ''
                    }`}
                  >
                    {/* Ring Indicator */}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 z-10 border-2 transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white border-teal-600 animate-pulse-ring'
                          : isCompleted
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : 'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {stepId === 'QUALIFIED' ? '❇️' : stepId === 'DISQUALIFIED' ? '🛑' : stepId === 'VALIDATION' ? '🛡️' : stepId === 'FLAGGED' ? '⚠️' : stepId}
                    </div>

                    {/* Step specifics metadata bubble */}
                    <div className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 flex-1 min-w-0 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 tracking-tight truncate">
                          {isTerminal ? `TERMINAL: ${stepId}` : questionTitle}
                        </span>
                        {isActive && (
                          <span className="text-[9px] text-teal-600 font-bold uppercase tracking-widest animate-pulse">Running</span>
                        )}
                      </div>

                      {optionText && (
                        <p className="text-[11px] text-gray-500 italic mt-1 bg-white p-1 rounded border border-gray-100/50 truncate">
                          Provided response: {optionText}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {currentStepIndex === -1 && (
                <div className="py-8 px-4 text-center text-xs text-gray-400 font-sans flex flex-col items-center border border-dashed border-gray-200 rounded-lg bg-gray-50/30">
                  <Play className="h-8 w-8 text-teal-600/70 mb-2.5 animate-pulse" />
                  <span className="font-bold text-gray-700 block mb-1">State Machine Ready</span>
                  <p className="max-w-[280px] text-[11px] text-gray-400 mx-auto leading-normal">
                    Click <strong className="text-teal-650">"Simulate Journey"</strong> to generate a real-time logical trace of <span className="font-semibold text-gray-600">{selectedPersona.name}</span>'s answers.
                  </p>

                  {/* Micro stylized ledger mockup */}
                  <div className="w-full mt-5 space-y-2 border-t border-gray-100 pt-5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-300 block text-left">Expected Pipeline Timeline</span>
                    <div className="flex items-center space-x-3 opacity-40">
                      <div className="h-5 w-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-mono text-[9px] font-bold">1</div>
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-4 bg-gray-100 rounded flex-1" />
                    </div>
                    <div className="flex items-center space-x-3 opacity-25">
                      <div className="h-5 w-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-mono text-[9px] font-bold">2</div>
                      <div className="h-4 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-100 rounded flex-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Intelligent Verification Exception Sidebar (Dynamic Fraud report) */}
          <div className="rounded-xl border border-gray-150 p-4 bg-gray-50/50 space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Geotrigger Security Diagnostics</span>

            {/* Simulated Live telemetry stats */}
            <div className="space-y-2 text-xs">
              
              <div className="flex items-center space-x-2.5 p-2 bg-white rounded border border-neutral-100">
                <Locate className="h-4 w-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] text-gray-400 uppercase font-semibold">Stated Region Context</span>
                  <span className="font-bold text-gray-800">{selectedPersona.detectDetails.claimed}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-2 bg-white rounded border border-neutral-100">
                <Locate className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] text-gray-400 uppercase font-semibold">Autodetected Physical ISP Node</span>
                  <span className={`font-bold ${selectedPersona.ipMismatch ? 'text-amber-700' : 'text-gray-800'}`}>
                    {selectedPersona.detectDetails.detected}
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block pt-2">Exception Signals</span>

              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded border text-center ${selectedPersona.vpn ? 'bg-amber-100/50 border-amber-300' : 'bg-gray-100/50 border-gray-150'}`}>
                  <Wifi className={`h-4 w-4 mx-auto mb-1 ${selectedPersona.vpn ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className="text-[9px] font-semibold block">VPN Detected</span>
                  <span className="text-[10px] font-bold uppercase">{selectedPersona.vpn ? 'TRUE (HIGH)' : 'FALSE'}</span>
                </div>
                <div className={`p-2 rounded border text-center ${selectedPersona.rapid ? 'bg-amber-100/50 border-amber-300' : 'bg-gray-100/50 border-gray-150'}`}>
                  <Clock className={`h-4 w-4 mx-auto mb-1 ${selectedPersona.rapid ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className="text-[9px] font-semibold block">Rapid Response</span>
                  <span className="text-[10px] font-bold uppercase">{selectedPersona.rapid ? 'TRUE' : 'FALSE'}</span>
                </div>
              </div>

            </div>

            {/* Fraud Exception Sidebar Report */}
            {selectedPersona.expectedOutcome === 'validation_branch' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border-2 border-amber-500 bg-amber-500/[0.03] p-3.5 space-y-2.5"
              >
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 animate-pulse" />
                  <span className="text-xs font-bold text-amber-805 uppercase tracking-wider">Risk Alarm Report</span>
                </div>

                <div className="text-[11px] text-amber-900 font-medium">
                  <p className="font-bold">Reason: Geo-location Mismatch & Server Proxy.</p>
                  <p className="text-amber-800/80 mt-1">
                    Detected Munich proxy servers claiming residency in Lagos (IP mismatch: Conf. Score &lt; {screener.validationBranch.riskThreshold}%). Diverting to shield gate verification vault node stack.
                  </p>
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
