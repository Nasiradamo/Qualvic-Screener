import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clipboard, Copy, ArrowRight, Sparkles, Send, Globe, Code, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenerData } from '../types';

interface PublishScreenerProps {
  screener: ScreenerData;
  onUpdateScreener: (updated: ScreenerData) => void;
}

export default function PublishScreener({
  screener,
  onUpdateScreener,
}: PublishScreenerProps) {
  const [isPublished, setIsPublished] = useState(screener.status === 'live');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const [checkQuestions, setCheckQuestions] = useState(false);
  const [checkLogic, setCheckLogic] = useState(false);
  const [checkSecurity, setCheckSecurity] = useState(false);

  // Staggered loading checklist items
  useEffect(() => {
    if (screener.status !== 'live') {
      const t1 = setTimeout(() => setCheckQuestions(true), 400);
      const t2 = setTimeout(() => setCheckLogic(true), 800);
      const t3 = setTimeout(() => setCheckSecurity(true), 1200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setCheckQuestions(true);
      setCheckLogic(true);
      setCheckSecurity(true);
    }
  }, [screener.status]);

  const handlePublish = () => {
    setIsPublished(true);
    onUpdateScreener({
      ...screener,
      status: 'live',
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://survey.research.io/s/q2_ux_screener_9281');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText('<iframe src="https://survey.research.io/s/q2_ux_screener_9281" width="100%" height="600" frameborder="0"></iframe>');
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const allChecksReady = checkQuestions && checkLogic && checkSecurity;

  return (
    <div className="max-w-[700px] mx-auto leading-relaxed">
      
      {/* Inline styles for confetti particles */}
      <style>{`
        @keyframes float-confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(250px) rotate(360deg); opacity: 0; }
        }
        .confetti-particle {
          position: absolute;
          width: 8px;
          height: 12px;
          border-radius: 2px;
          top: -20px;
          animation: float-confetti 3.2s linear infinite;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {!isPublished ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            key="pre-publish"
            className="space-y-6"
          >
            {/* Title / Description */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Pre-flight Verification checklist</h3>
              <p className="text-sm text-gray-500 max-w-[500px] mx-auto">
                Review compiler results, targeting rules and billing balances before going live with the Q2 survey.
              </p>
            </div>

            {/* Checklist Box */}
            <div className="rounded-xl border border-gray-150 bg-white p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Compiling Assets</span>

              <div className="space-y-3.5">
                
                {/* Rule A */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-2.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${
                      checkQuestions ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-200'
                    }`}>
                      {checkQuestions ? '✓' : '...'}
                    </div>
                    <span className={checkQuestions ? 'text-gray-800' : 'text-gray-400'}>
                      Compiling standard screener question attributes
                    </span>
                  </div>
                  {checkQuestions && <span className="text-[10px] text-emerald-600">Compiled ({screener.questions.length} blocks)</span>}
                </div>

                {/* Rule B */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-2.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${
                      checkLogic ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-200'
                    }`}>
                      {checkLogic ? '✓' : '...'}
                    </div>
                    <span className={checkLogic ? 'text-gray-800' : 'text-gray-400'}>
                      Validating conditional path matrix & routing tables
                    </span>
                  </div>
                  {checkLogic && <span className="text-[10px] text-emerald-600">Jumps Safe</span>}
                </div>

                {/* Rule C */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-2.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${
                      checkSecurity ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-gray-200'
                    }`}>
                      {checkSecurity ? '✓' : '...'}
                    </div>
                    <span className={checkSecurity ? 'text-gray-800' : 'text-gray-400'}>
                      Instantiating Shield verification micro-queries
                    </span>
                  </div>
                  {checkSecurity && <span className="text-[10px] text-emerald-600">Shield Pools Armed</span>}
                </div>

              </div>
            </div>

            {/* Centered Manifest Billing Box */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 space-y-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block text-center">
                Screener Performance Manifest
              </span>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white border border-gray-150 rounded-lg">
                  <span className="block text-[9px] uppercase font-bold text-gray-400 tracking-wider">Target Aud.</span>
                  <span className="font-mono text-base font-bold text-gray-800">500 Resp.</span>
                </div>
                <div className="p-3 bg-white border border-gray-150 rounded-lg">
                  <span className="block text-[9px] uppercase font-bold text-gray-400 tracking-wider">Est. Budget</span>
                  <span className="font-mono text-base font-bold text-gray-800">$2,500 USD</span>
                </div>
                <div className="p-3 bg-white border border-gray-150 rounded-lg">
                  <span className="block text-[9px] uppercase font-bold text-gray-400 tracking-wider">Inc. Guard</span>
                  <span className="font-mono text-base font-bold text-teal-650 capitalize">{screener.fraudSensitivity} Sec</span>
                </div>
              </div>
            </div>

            {/* Launch Publish actions */}
            <button
              onClick={handlePublish}
              disabled={!allChecksReady}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold rounded-lg text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Send className="h-4.5 w-4.5 fill-white" />
              <span>Publish, Activate and Deploy Screener</span>
            </button>

          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key="success-celebrate"
            className="space-y-6 relative overflow-hidden"
          >
            {/* Embedded Confetti Spray */}
            <div className="absolute inset-0 pointer-events-none select-none h-[220px]">
              {[...Array(24)].map((_, i) => {
                const randomLeft = Math.random() * 100;
                const randomDelay = Math.random() * 2.5;
                const randomColor = ['#0d9488', '#3b82f6', '#f59e0b', '#10b981', '#ec4899'][i % 5];
                return (
                  <span
                    key={i}
                    className="confetti-particle"
                    style={{
                      left: `${randomLeft}%`,
                      animationDelay: `${randomDelay}s`,
                      backgroundColor: randomColor,
                    }}
                  />
                );
              })}
            </div>

            {/* Large centered Success Shield card checkmark */}
            <div className="text-center space-y-4 pt-4 relative z-10">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Screener Built and Deployed Successfully</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Active in Live tracking state. Standard APIs are routing telemetry metrics recursively.
                </p>
              </div>
            </div>

            {/* Sharing interface panel */}
            <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-md space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                Screener Distribution Hub
              </h4>

              {/* Share url */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Globe className="h-3.5 w-3.5 text-teal-650" />
                  <span>Respondent Embed URL</span>
                </span>

                <div className="flex rounded-lg border border-gray-150 bg-gray-50 overflow-hidden items-center text-xs">
                  <span className="px-3 text-gray-400 select-none font-mono">Live Link</span>
                  <input
                    type="text"
                    readOnly
                    value="https://survey.research.io/s/q2_ux_screener_9281"
                    className="flex-grow bg-transparent p-2.5 font-mono text-gray-800 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 hover:bg-gray-100 border-l border-gray-150 text-teal-600 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Embed code */}
              <div className="space-y-1.5 pt-1.5">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                  <Code className="h-3.5 w-3.5 text-blue-500" />
                  <span>Integration IFrame Embed Script</span>
                </span>

                <div className="flex rounded-lg border border-gray-150 bg-gray-50 overflow-hidden items-center text-xs">
                  <span className="px-3 text-gray-400 select-none font-mono">HTML Embed</span>
                  <input
                    type="text"
                    readOnly
                    value='<iframe src="https://survey.research.io/s/q2_ux_screener_9281" width="100%" height="600" frameborder="0"></iframe>'
                    className="flex-grow bg-transparent p-2.5 font-mono text-gray-800 outline-none"
                  />
                  <button
                    onClick={handleCopyEmbed}
                    className="px-3.5 py-2 hover:bg-gray-100 border-l border-gray-150 text-teal-600 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedEmbed ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Sandbox controller reset */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsPublished(false);
                  onUpdateScreener({ ...screener, status: 'draft' });
                }}
                className="text-xs text-gray-400 hover:text-teal-650 cursor-pointer font-semibold underline"
              >
                Reset Screener state to Draft (Edit survey logic)
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
