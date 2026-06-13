import React from 'react';
import { ToggleLeft, Shield, Sliders, AlertTriangle, Play, HelpCircle, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ScreenerData, Question, AnswerOption } from '../types';

interface ValidationBranchBuilderProps {
  screener: ScreenerData;
  onUpdateScreener: (updated: ScreenerData) => void;
}

export default function ValidationBranchBuilder({
  screener,
  onUpdateScreener,
}: ValidationBranchBuilderProps) {
  const { smartTriggers, riskThreshold, verificationQuestions } = screener.validationBranch;

  const handleToggleTrigger = (field: 'vpnDetected' | 'rapidResponse' | 'ipMismatch') => {
    onUpdateScreener({
      ...screener,
      validationBranch: {
        ...screener.validationBranch,
        smartTriggers: {
          ...smartTriggers,
          [field]: !smartTriggers[field],
        },
      },
    });
  };

  const handleUpdateRiskThreshold = (value: number) => {
    onUpdateScreener({
      ...screener,
      validationBranch: {
        ...screener.validationBranch,
        riskThreshold: value,
      },
    });
  };

  const handleUpdateVQ = (updatedQ: Question) => {
    const updatedVQs = verificationQuestions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
    onUpdateScreener({
      ...screener,
      validationBranch: {
        ...screener.validationBranch,
        verificationQuestions: updatedVQs,
      },
    });
  };

  const handleAddVQOption = (qId: string) => {
    const vq = verificationQuestions.find((q) => q.id === qId);
    if (!vq) return;
    const nextOptNum = vq.options.length + 1;
    const newOpt: AnswerOption = {
      id: `${qId.toLowerCase()}_o${Date.now()}`,
      text: `Option ${nextOptNum}`,
      status: 'disqualify',
    };

    handleUpdateVQ({
      ...vq,
      options: [...vq.options, newOpt],
    });
  };

  const handleToggleVQOptionStatus = (qId: string, optionId: string) => {
    const vq = verificationQuestions.find((q) => q.id === qId);
    if (!vq) return;

    const updatedOptions = vq.options.map((opt) => {
      if (opt.id === optionId) {
        // Toggle qualify vs disqualify
        const nextStatus: 'qualify' | 'disqualify' | 'neutral' = opt.status === 'qualify' ? 'disqualify' : 'qualify';
        return { ...opt, status: nextStatus };
      }
      return opt;
    });

    handleUpdateVQ({
      ...vq,
      options: updatedOptions,
    });
  };

  const handleUpdateVQOptionText = (qId: string, optionId: string, text: string) => {
    const vq = verificationQuestions.find((q) => q.id === qId);
    if (!vq) return;
    const updatedOptions = vq.options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt));
    handleUpdateVQ({
      ...vq,
      options: updatedOptions,
    });
  };

  const handleDeleteVQOption = (qId: string, optionId: string) => {
    const vq = verificationQuestions.find((q) => q.id === qId);
    if (!vq || vq.options.length <= 1) return;
    const updatedOptions = vq.options.filter((opt) => opt.id !== optionId);
    handleUpdateVQ({
      ...vq,
      options: updatedOptions,
    });
  };

  const handleAddVerificationQuestion = () => {
    const newId = `VQ${verificationQuestions.length + 1}`;
    const newVQ: Question = {
      id: newId,
      type: 'single_choice',
      text: 'Sample Security Verification: Select the proper answer response.',
      isTwinVerify: false,
      fraudWeight: 80,
      isVerificationQuestion: true,
      shieldIcon: true,
      options: [
        { id: `${newId.toLowerCase()}_o1`, text: 'Fraudulent Choice A', status: 'disqualify' as const },
        { id: `${newId.toLowerCase()}_o2`, text: 'Genuine Verification Choice B', status: 'qualify' as const },
      ],
    };

    onUpdateScreener({
      ...screener,
      validationBranch: {
        ...screener.validationBranch,
        verificationQuestions: [...verificationQuestions, newVQ],
      },
    });
  };

  const handleDeleteVQ = (id: string) => {
    if (verificationQuestions.length <= 1) return;
    const filtered = verificationQuestions.filter((q) => q.id !== id);
    onUpdateScreener({
      ...screener,
      validationBranch: {
        ...screener.validationBranch,
        verificationQuestions: filtered,
      },
    });
  };

  return (
    <div className="space-y-6 leading-relaxed">
      
      {/* Top Banner introducing Safety Orange palette */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-5 flex items-center space-x-4">
        <div className="p-3 bg-amber-500 rounded text-white shadow-sm shrink-0">
          <Shield className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-950">Security Gateways & Risk Thresholds</h3>
          <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
            Configure defensive checkpoints. Participants who fail these validation barriers are automatically quarantined, flagged, and barred from reward disbursements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left 2 Column Blocks: Smart Triggers + Risk Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Smart Trigger Switches container */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Real-time Intelligent Signal Interceptors
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Trigger Option A: VPN */}
              <div
                onClick={() => handleToggleTrigger('vpnDetected')}
                className={`p-4 rounded-md border cursor-pointer select-none transition-all ${
                  smartTriggers.vpnDetected
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${smartTriggers.vpnDetected ? 'bg-amber-100 text-amber-805' : 'bg-gray-100 text-gray-500'}`}>
                    {smartTriggers.vpnDetected ? 'FLAG VPN' : 'INACTIVE'}
                  </span>
                  <div className={`h-4 w-7 rounded-full p-0.5 transition-colors duration-205 ${smartTriggers.vpnDetected ? 'bg-amber-500' : 'bg-gray-200'}`}>
                    <div className={`h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform duration-205 ${smartTriggers.vpnDetected ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                </div>
                <h5 className="text-xs font-bold text-gray-800">VPN / Server Proxy Signal</h5>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Triggers redirection when residential IP verification ranges are breached.
                </p>
              </div>

              {/* Trigger Option B: Velocity */}
              <div
                onClick={() => handleToggleTrigger('rapidResponse')}
                className={`p-4 rounded-md border cursor-pointer select-none transition-all ${
                  smartTriggers.rapidResponse
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${smartTriggers.rapidResponse ? 'bg-amber-100 text-amber-805' : 'bg-gray-100 text-gray-500'}`}>
                    {smartTriggers.rapidResponse ? 'FLAG VELOCITY' : 'INACTIVE'}
                  </span>
                  <div className={`h-4 w-7 rounded-full p-0.5 transition-colors duration-205 ${smartTriggers.rapidResponse ? 'bg-amber-500' : 'bg-gray-200'}`}>
                    <div className={`h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform duration-205 ${smartTriggers.rapidResponse ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                </div>
                <h5 className="text-xs font-bold text-gray-800">Velocity Limit (&lt; 2s)</h5>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Intercepts rapid clicking bots selecting options blindly in rapid succession.
                </p>
              </div>

              {/* Trigger Option C: IP Mismatch */}
              <div
                onClick={() => handleToggleTrigger('ipMismatch')}
                className={`p-4 rounded-md border cursor-pointer select-none transition-all ${
                  smartTriggers.ipMismatch
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${smartTriggers.ipMismatch ? 'bg-amber-100 text-amber-805' : 'bg-gray-100 text-gray-500'}`}>
                    {smartTriggers.ipMismatch ? 'FLAG MISMATCH' : 'INACTIVE'}
                  </span>
                  <div className={`h-4 w-7 rounded-full p-0.5 transition-colors duration-205 ${smartTriggers.ipMismatch ? 'bg-amber-500' : 'bg-gray-200'}`}>
                    <div className={`h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform duration-205 ${smartTriggers.ipMismatch ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                </div>
                <h5 className="text-xs font-bold text-gray-800">Geographic IP Mismatch</h5>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Flags users boasting divergent browser languages vs actual physical nodes.
                </p>
              </div>

            </div>
          </div>

          {/* Verification Pools Question Stack */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Shield Verification Pool
              </h4>
              <button
                onClick={handleAddVerificationQuestion}
                className="flex items-center space-x-1 py-1.5 px-3 bg-amber-500 text-white rounded text-xs font-semibold hover:bg-amber-600 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Verification Node</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {verificationQuestions.map((q) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-gray-200 hover:border-amber-400 bg-white p-5 shadow-xs relative overflow-hidden group transition-all"
                >
                  {/* Safety Orange Corner Shield Badge */}
                  <div className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center bg-amber-500 text-white rounded-bl shadow-sm">
                    <Shield className="h-4 w-4 fill-white/20" />
                  </div>

                  <div className="mb-3">
                    <span className="font-mono text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                      {q.id} SHIELD GATE
                    </span>
                    <button
                      onClick={() => handleDeleteVQ(q.id)}
                      disabled={verificationQuestions.length <= 1}
                      className="ml-3 text-gray-400 hover:text-rose-500 disabled:opacity-20 cursor-pointer text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Verification Text</span>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => handleUpdateVQ({ ...q, text: e.target.value })}
                        className="w-full text-sm font-semibold text-gray-800 bg-transparent border-b border-gray-100 pb-1 outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Options & Validation Checkbox</span>
                      
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex items-center space-x-2.5 p-2 rounded-md border border-gray-200 bg-gray-50/50 hover:bg-white text-xs transition-all"
                        >
                          {/* Option text */}
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleUpdateVQOptionText(q.id, opt.id, e.target.value)}
                            className="bg-transparent text-gray-700 font-medium py-0.5 outline-none flex-grow text-xs"
                          />

                          {/* Qualify/Disqualify selector toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleVQOptionStatus(q.id, opt.id)}
                            className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-all ${
                              opt.status === 'qualify'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {opt.status === 'qualify' ? 'VALID (PASS)' : 'FLAG / FAIL'}
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteVQOption(q.id, opt.id)}
                            disabled={q.options.length <= 1}
                            className="text-gray-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => handleAddVQOption(q.id)}
                        className="text-[10px] font-bold text-amber-600 hover:text-amber-700 mt-1 flex items-center space-x-0.5 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Verification Response Option</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Sticky Logic Panel: Risk Threshold slider */}
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-300 bg-amber-500/[0.02] p-5 shadow-sm space-y-5">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4.5 w-4.5 text-amber-500" />
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Risk Score Diagnostics</h4>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">Flag Verification Limit</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {riskThreshold} PTS
                </span>
              </div>

              {/* Threshold Slider slider */}
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={riskThreshold}
                onChange={(e) => handleUpdateRiskThreshold(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Structured Logic sentence */}
            <div className="rounded-lg bg-white border border-amber-200 p-4 text-xs space-y-1.5 leading-relaxed shadow-sm">
              <span className="font-mono text-[10px] font-bold text-amber-600 block">THRESHOLD RULE SPECIFICATION</span>
              <p className="text-gray-700">
                IF total participant cumulative <strong>Risk Index &gt; {riskThreshold} Points</strong>,
              </p>
              <p className="font-semibold text-amber-800">
                THEN Flag Session immediately for review and freeze downstream routing locks.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg text-[10px] text-amber-800 leading-relaxed border border-amber-100 flex items-start space-x-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0 stroke-[2] mt-0.5" />
              <span>
                Safety features prevent bots from earning rewards. Automated GeoIP filters matching local browser headers flag active proxies.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
