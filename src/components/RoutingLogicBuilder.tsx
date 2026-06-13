import React from 'react';
import { Plus, Trash2, HelpCircle, ArrowRight, ShieldAlert, Split, Terminal, CheckCircle2, XCircle } from 'lucide-react';
import { ScreenerData, RoutingRule, RuleAction, Question } from '../types';

interface RoutingLogicBuilderProps {
  screener: ScreenerData;
  onUpdateScreener: (updated: ScreenerData) => void;
}

export default function RoutingLogicBuilder({
  screener,
  onUpdateScreener,
}: RoutingLogicBuilderProps) {
  
  const handleUpdateRule = (ruleId: string, updatedFields: Partial<RoutingRule>) => {
    const updatedRules = screener.rules.map((rule) =>
      rule.id === ruleId ? { ...rule, ...updatedFields } as RoutingRule : rule
    );
    onUpdateScreener({
      ...screener,
      rules: updatedRules,
    });
  };

  const handleAddRuleForQuestion = (qId: string) => {
    // Find the first option for this question
    const q = screener.questions.find((quest) => quest.id === qId);
    if (!q) return;
    const defaultOptionId = q.options[0]?.id || '';

    const newRule: RoutingRule = {
      id: `rule_${Date.now()}`,
      questionId: qId,
      answerOptionId: defaultOptionId,
      action: 'continue',
      targetQuestionId: screener.questions.find((quest) => quest.id !== qId)?.id || '',
    };

    onUpdateScreener({
      ...screener,
      rules: [...screener.rules, newRule],
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = screener.rules.filter((rule) => rule.id !== ruleId);
    onUpdateScreener({
      ...screener,
      rules: updatedRules,
    });
  };

  return (
    <div className="space-y-6 leading-relaxed">
      
      {/* Intro section */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900">Adaptive Routing & Path Trees</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Define condition-based jumps that skip irrelevant categories. Rather than linear queues, participants are dynamically routed depending on real-time option status indicators.
        </p>
      </div>

      {/* Group Rules by Question Block */}
      <div className="space-y-6">
        {screener.questions.map((question) => {
          // Find rules belonging to this question
          const questionRules = screener.rules.filter((r) => r.questionId === question.id);

          return (
            <div key={question.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
              
              {/* Question group header */}
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 border border-teal-200 text-teal-700 uppercase tracking-wider font-mono">
                    {question.id} OUTCOMES
                  </span>
                  <span className="text-xs text-gray-700 font-semibold truncate max-w-[400px]">
                    "{question.text}"
                  </span>
                </div>

                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {questionRules.length} Logic {questionRules.length === 1 ? 'Condition' : 'Conditions'}
                </span>
              </div>

              {/* Rules rows list */}
              <div className="p-5 space-y-4">
                {questionRules.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400">
                    No custom routing branches defined. Respondents will fall back to sequential progression.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questionRules.map((rule) => {
                      return (
                        <div
                          key={rule.id}
                          className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3 p-4 rounded-md border-l-4 border-l-teal-600 border border-gray-200 bg-white hover:bg-gray-50/50 transition-all shadow-xs"
                        >
                          {/* Prefix */}
                          <span className="text-xs font-bold text-teal-600 font-mono shrink-0 select-none">
                            WHEN ANSWER
                          </span>

                          {/* Options trigger dropdown */}
                          <select
                            value={rule.answerOptionId}
                            onChange={(e) => handleUpdateRule(rule.id, { answerOptionId: e.target.value })}
                            className="bg-white border border-gray-200 text-xs font-semibold text-gray-750 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-100 cursor-pointer max-w-[220px]"
                          >
                            {question.options.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.text} ({opt.status})
                              </option>
                            ))}
                          </select>

                          <span className="text-xs font-bold text-teal-600 font-mono shrink-0 select-none">
                            THEN ACTION IS
                          </span>

                          {/* Action output selector */}
                          <select
                            value={rule.action}
                            onChange={(e) => {
                              const newAction = e.target.value as RuleAction;
                              // Default first question that isn't this one
                              const defaultTargetQ = screener.questions.find((quest) => quest.id !== question.id)?.id || '';
                              handleUpdateRule(rule.id, {
                                action: newAction,
                                targetQuestionId: newAction === 'continue' ? defaultTargetQ : undefined,
                              });
                            }}
                            className="bg-white border border-gray-200 text-xs font-semibold text-gray-755 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-100 cursor-pointer"
                          >
                            <option value="continue">📚 Go to Next Question...</option>
                            <option value="qualify">❇️ Qualify and Complete Survey</option>
                            <option value="disqualify">🛑 Disqualify Immediately</option>
                            <option value="validation_branch">🛡️ Divert to validation checkpoint</option>
                          </select>

                          {/* Conditional target input */}
                          {rule.action === 'continue' && (
                            <>
                              <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
                              <select
                                value={rule.targetQuestionId || ''}
                                onChange={(e) => handleUpdateRule(rule.id, { targetQuestionId: e.target.value })}
                                className="bg-white border border-gray-200 text-xs font-semibold text-teal-700 py-1.5 px-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-100 cursor-pointer"
                              >
                                {screener.questions
                                  .filter((quest) => quest.id !== question.id)
                                  .map((quest) => (
                                    <option key={quest.id} value={quest.id}>
                                      Load {quest.id} ({quest.text.slice(0, 20)}...)
                                    </option>
                                  ))}
                              </select>
                            </>
                          )}

                          {/* Spacer to push actions content to far right */}
                          <div className="flex-1" />

                          {/* Delete rule button */}
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-500 rounded-md hover:bg-rose-50 transition-colors self-end md:self-auto cursor-pointer"
                            title="Remove logic rule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Dashed placeholder template action */}
                <button
                  onClick={() => handleAddRuleForQuestion(question.id)}
                  className="w-full py-2.5 border border-dashed border-gray-200 hover:border-blue-500 rounded-lg flex items-center justify-center space-x-1.5 text-xs text-gray-500 hover:text-blue-600 bg-gray-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Configure New Jump Rule Condition</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Validation Logic Card: distinct orange-bordered card */}
      <div className="rounded-xl border border-l-4 border-l-amber-500 border-gray-150 bg-white overflow-hidden shadow-sm">
        <div className="p-5">
          <div className="flex items-center space-x-2.5 mb-3">
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <ShieldAlert className="h-4 w-4 text-amber-650" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Automatic VPN, Proxy & Device-fingerprint Override Logic</h4>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-100/50 px-1.5 py-0.5 rounded">Security Firewall Act</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            This card represents the automated network intelligence override routing branch. It ensures suspicious headers and low integrity scores bypass standard sequence pipelines immediately.
          </p>

          {/* Logic Sentence */}
          <div className="p-4 rounded-lg border border-amber-100 bg-amber-50/10 flex flex-col sm:flex-row sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3 text-xs">
            <span className="font-mono font-bold text-amber-700">WHEN</span>
            <div className="font-semibold text-gray-800 bg-amber-50 px-2 py-1 rounded border border-amber-200/50">
              🛡️ Location Integrity Confidence Score
            </div>
            <span className="font-mono font-bold text-amber-700">IS DETECTED AS</span>
            <div className="font-bold text-amber-800 bg-amber-100/50 px-2 py-1 rounded border border-amber-200">
              Low Confidence / Suspicious Proxy
            </div>
            <span className="font-mono font-bold text-amber-700">THEN</span>
            <div className="font-bold text-white bg-amber-600 px-2.5 py-1 rounded shadow-sm">
              Divert to Security Validation Verification Branch
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
