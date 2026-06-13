import React, { useState } from 'react';
import { 
  AlignLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  ShieldAlert, 
  BadgeInfo,
  Briefcase,
  Radio,
  CheckSquare,
  Type,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ScreenerData, Question, AnswerOption, QuestionType } from '../types';

interface QuestionBuilderProps {
  screener: ScreenerData;
  onUpdateScreener: (updated: ScreenerData) => void;
  selectedQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
}

export default function QuestionBuilder({
  screener,
  onUpdateScreener,
  selectedQuestionId,
  onSelectQuestion,
}: QuestionBuilderProps) {
  
  // Track which questions are expanded for configuration
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    Q1: true,
    Q2: true,
  });

  const toggleExpand = (qId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleUpdateQuestion = (updatedQ: Question) => {
    const updatedQuestions = screener.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
    onUpdateScreener({
      ...screener,
      questions: updatedQuestions,
    });
  };

  const handleAddQuestionOfType = (type: QuestionType) => {
    const newId = `Q${screener.questions.length + 1}`;
    
    let defaultLabel = 'Sample Question';
    if (type === 'single_choice') defaultLabel = 'Single Choice Selection';
    if (type === 'multi_choice') defaultLabel = 'Multi-Choice Multiple Selection';
    if (type === 'text') defaultLabel = 'Short Qualitative Text Input';

    const newQuestion: Question = {
      id: newId,
      type: type,
      text: `${defaultLabel} Question Text`,
      fraudWeight: 20,
      isTwinVerify: false,
      options: type !== 'text' ? [
        { id: `${newId.toLowerCase()}_o1`, text: 'Response Option A', status: 'neutral' },
        { id: `${newId.toLowerCase()}_o2`, text: 'Response Option B', status: 'neutral' },
        { id: `${newId.toLowerCase()}_o3`, text: 'Response Option C', status: 'neutral' },
      ] : [],
    };

    onUpdateScreener({
      ...screener,
      questions: [...screener.questions, newQuestion],
    });

    // Auto-expand and select the newly added question
    setExpandedQuestions(prev => ({
      ...prev,
      [newId]: true
    }));
    onSelectQuestion(newId);
  };

  const handleDeleteQuestion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (screener.questions.length <= 1) return; // Keep at least one

    const remainingQuestions = screener.questions.filter((q) => q.id !== id);
    onUpdateScreener({
      ...screener,
      questions: remainingQuestions,
    });
  };

  const handleUpdateOptionText = (question: Question, optionId: string, newText: string) => {
    const updatedOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, text: newText } : opt
    );
    handleUpdateQuestion({
      ...question,
      options: updatedOptions,
    });
  };

  const handleToggleOptionStatus = (question: Question, optionId: string, statusType: 'qualify' | 'disqualify') => {
    const updatedOptions = question.options.map((opt) => {
      if (opt.id === optionId) {
        const currentStatus = opt.status;
        let nextStatus: 'qualify' | 'disqualify' | 'neutral' = statusType;
        if (currentStatus === statusType) {
          nextStatus = 'neutral';
        }
        return { ...opt, status: nextStatus };
      }
      return opt;
    });

    handleUpdateQuestion({
      ...question,
      options: updatedOptions,
    });
  };

  const handleAddOption = (question: Question) => {
    const nextOptNum = question.options.length + 1;
    const newOpt: AnswerOption = {
      id: `${question.id.toLowerCase()}_o${Date.now()}`,
      text: `Option ${nextOptNum}`,
      status: 'neutral',
    };

    handleUpdateQuestion({
      ...question,
      options: [...question.options, newOpt],
    });
  };

  const handleDeleteOption = (question: Question, optionId: string) => {
    if (question.options.length <= 1) return;
    const filteredOptions = question.options.filter((opt) => opt.id !== optionId);
    handleUpdateQuestion({
      ...question,
      options: filteredOptions,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: 30% Width (Bento-styled Cards matching user design pattern) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Project Context Metadata Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex items-start space-x-4">
            
            {/* Elegant Briefcase icon in custom deep green background */}
            <div className="h-10 w-10 shrink-0 bg-[#EDF7ED] rounded-lg flex items-center justify-center text-[#1E5D3E]">
              <Briefcase className="h-5 w-5" />
            </div>

            <div className="space-y-1 select-none">
              <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase block">
                Active Study Frame
              </span>
              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                {screener.name || "Qualvic Customer Survey"}
              </h3>
              <div className="flex flex-wrap gap-2 items-center mt-2.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-50 text-gray-500 border border-gray-200">
                  ID: Q2_TECH_2026
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                  Target: 450 Verified
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Question Types Palette Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h4 className="text-xs font-black text-gray-400 tracking-wider uppercase mb-3 px-1">
            Question Types Palette
          </h4>
          <p className="text-[11px] text-gray-500 mb-4 px-1 leading-relaxed">
            Quickly inject customizable layout modules into your screener logic by clicking any node category below:
          </p>

          <div className="space-y-2.5">
            {/* Single Choice radio */}
            <button
              onClick={() => handleAddQuestionOfType('single_choice')}
              className="w-full flex items-center space-x-3.5 p-3 rounded-lg border border-gray-150 hover:border-[#1E5D3E] hover:bg-[#EDF7ED]/15 text-left transition-all group cursor-pointer"
            >
              <div className="h-8 w-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#EDF7ED] group-hover:text-[#1E5D3E] transition-colors shrink-0">
                <Radio className="h-4.5 w-4.5" />
              </div>
              <div className="leading-snug min-w-0">
                <div className="text-xs font-bold text-gray-800 group-hover:text-[#1E5D3E]">
                  Single Choice Question
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  Radio selections, exactly one answer permitted
                </div>
              </div>
              <Plus className="h-3.5 w-3.5 text-gray-400 ml-auto group-hover:text-[#1E5D3E] shrink-0" />
            </button>

            {/* Multi Choice check */}
            <button
              onClick={() => handleAddQuestionOfType('multi_choice')}
              className="w-full flex items-center space-x-3.5 p-3 rounded-lg border border-gray-150 hover:border-[#1E5D3E] hover:bg-[#EDF7ED]/15 text-left transition-all group cursor-pointer"
            >
              <div className="h-8 w-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#EDF7ED] group-hover:text-[#1E5D3E] transition-colors shrink-0">
                <CheckSquare className="h-4.5 w-4.5" />
              </div>
              <div className="leading-snug min-w-0">
                <div className="text-xs font-bold text-gray-800 group-hover:text-[#1E5D3E]">
                  Multiple Choice Question
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  Checkboxes, supports multiple responses
                </div>
              </div>
              <Plus className="h-3.5 w-3.5 text-gray-400 ml-auto group-hover:text-[#1E5D3E] shrink-0" />
            </button>

            {/* Short text input */}
            <button
              onClick={() => handleAddQuestionOfType('text')}
              className="w-full flex items-center space-x-3.5 p-3 rounded-lg border border-gray-150 hover:border-[#1E5D3E] hover:bg-[#EDF7ED]/15 text-left transition-all group cursor-pointer"
            >
              <div className="h-8 w-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#EDF7ED] group-hover:text-[#1E5D3E] transition-colors shrink-0">
                <Type className="h-4.5 w-4.5" />
              </div>
              <div className="leading-snug min-w-0">
                <div className="text-xs font-bold text-gray-800 group-hover:text-[#1E5D3E]">
                  Short Text Response
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  Qualitative fields, free text explanations
                </div>
              </div>
              <Plus className="h-3.5 w-3.5 text-gray-400 ml-auto group-hover:text-[#1E5D3E] shrink-0" />
            </button>
          </div>

          <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-start space-x-2 text-[10px] text-gray-400 leading-relaxed font-semibold">
            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-gray-350" />
            <span>Click any layout card above to instantly append a query block into the live active survey node stack.</span>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: 70% Width (Primary Workspace Stack) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Workspace Title bar */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Screener Questions
            </h2>
            <p className="text-xs text-gray-400">
              Set conditional filters on question outcomes.
            </p>
          </div>
          <span className="text-[10px] font-bold font-mono text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded">
            TOTAL: {screener.questions.length} ACTIVE NODES
          </span>
        </div>

        {/* List of custom questions */}
        <div className="space-y-4">
          {screener.questions.map((q, idx) => {
            const isExpanded = expandedQuestions[q.id] !== false;
            
            return (
              <div 
                key={q.id} 
                onClick={() => onSelectQuestion(q.id)}
                className={`bg-white border rounded-xl shadow-xs overflow-hidden transition-all duration-200 ${
                  selectedQuestionId === q.id 
                    ? 'border-teal-500 ring-1 ring-teal-50/50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                
                {/* Expandable question header strip */}
                <div 
                  onClick={() => toggleExpand(q.id)}
                  className="px-5 py-4 flex items-center justify-between cursor-pointer select-none bg-gray-50/30 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <GripVertical className="h-4 w-4 text-gray-300 cursor-grab hover:text-gray-400 shrink-0" />
                    
                    {/* Node code label badge */}
                    <span className="px-2 py-0.5 rounded font-mono text-[10.5px] font-black bg-gray-150 text-gray-700 tracking-wider">
                      {q.id}
                    </span>

                    {/* Question summary / preview */}
                    <span className="text-xs font-bold text-gray-800 truncate pr-3">
                      {q.text || <span className="text-gray-400">Untouched Question prompt...</span>}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {/* Tiny Type label */}
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wide bg-[#EDF7ED] text-[#1E5D3E] px-2 py-0.5 rounded border border-emerald-100">
                      {q.type === 'single_choice' ? 'Single Choice' : q.type === 'multi_choice' ? 'Multi Choice' : 'Text Input'}
                    </span>

                    {/* Expand toggler */}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}

                    {/* Delete button option */}
                    <button
                      onClick={(e) => handleDeleteQuestion(q.id, e)}
                      disabled={screener.questions.length <= 1}
                      className="p-1.5 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-20 cursor-pointer"
                      title="Remove question block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Editing Canvas Area nested when expanded */}
                {isExpanded && (
                  <div className="p-6 border-t border-gray-100 space-y-5">
                    
                    {/* Prompt input field */}
                    <div className="space-y-1.5">
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-gray-400">
                        Prompt Text
                      </label>
                      <textarea
                        rows={2}
                        value={q.text}
                        onChange={(e) => handleUpdateQuestion({ ...q, text: e.target.value })}
                        placeholder="Type survey question prompt here..."
                        className="w-full text-sm font-semibold text-gray-800 border-b border-gray-150 focus:border-emerald-600 bg-transparent py-1.5 outline-none resize-none transition-colors leading-relaxed"
                      />
                    </div>

                    {/* Dynamic answer option pills if not standard text */}
                    {q.type !== 'text' && (
                      <div className="space-y-3 pt-1">
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">
                            Response Options Logic
                          </span>
                          <button
                            onClick={() => handleAddOption(q)}
                            className="flex items-center space-x-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Option</span>
                          </button>
                        </div>

                        {/* List of selectable answer option widgets */}
                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const isQualify = opt.status === 'qualify';
                            const isDisqualify = opt.status === 'disqualify';

                            return (
                              <div
                                key={opt.id}
                                className="flex items-center justify-between p-2 rounded-lg border border-gray-150/50 hover:bg-gray-50/20 transition-all bg-gray-50/10"
                              >
                                <div className="flex items-center space-x-2.5 flex-1 mr-4">
                                  <GripVertical className="h-3.5 w-3.5 text-gray-300 cursor-grabbing shrink-0" />
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => handleUpdateOptionText(q, opt.id, e.target.value)}
                                    className="bg-transparent text-xs text-gray-800 font-bold py-1 outline-none w-full border-b border-transparent focus:border-gray-200"
                                  />
                                </div>

                                <div className="flex items-center space-x-1.5 shrink-0">
                                  {/* Qualify pill button */}
                                  <button
                                    onClick={() => handleToggleOptionStatus(q, opt.id, 'qualify')}
                                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                      isQualify
                                        ? 'bg-[#EDF7ED] text-[#1E5D3E] border border-emerald-200'
                                        : 'bg-gray-50 text-gray-400 hover:bg-[#EDF7ED] hover:text-[#1E5D3E] hover:border-emerald-100 border border-transparent'
                                    }`}
                                  >
                                    Qualify
                                  </button>

                                  {/* Disqualify pill button */}
                                  <button
                                    onClick={() => handleToggleOptionStatus(q, opt.id, 'disqualify')}
                                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                      isDisqualify
                                        ? 'bg-rose-50 text-rose-700 border border-rose-205'
                                        : 'bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-750 hover:border-rose-100 border border-transparent'
                                    }`}
                                  >
                                    Disqualify
                                  </button>

                                  {/* Delete option pill */}
                                  <button
                                    onClick={() => handleDeleteOption(q, opt.id)}
                                    disabled={q.options.length <= 1}
                                    className="text-gray-350 hover:text-rose-500 p-1 rounded transition-colors disabled:opacity-20 cursor-pointer"
                                    title="Delete answer row"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    )}

                    {/* Threat / Fraud Parameter settings directly inside card */}
                    <div className="border-t border-gray-100 pt-4 mt-2 space-y-4 bg-gray-50/50 -mx-6 -mb-6 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Threat Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-650">
                            <span className="flex items-center space-x-1 font-bold text-[10.5px] uppercase tracking-wider text-gray-400">
                              <ShieldAlert className="h-4 w-4 text-[#1E5D3E] shrink-0" />
                              <span>Fraud Signal Flag Weight</span>
                            </span>
                            <span className="font-mono text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded border border-red-100">
                              {q.fraudWeight} / 100 PTS
                            </span>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={q.fraudWeight}
                            onChange={(e) => handleUpdateQuestion({ ...q, fraudWeight: parseInt(e.target.value, 10) })}
                            className="w-full accent-teal-600 cursor-pointer mt-1"
                          />
                        </div>

                        {/* Verification Twin Parameter Toggle */}
                        <div className="flex items-start justify-between space-x-3">
                          <div className="leading-tight">
                            <span className="text-[11px] font-bold text-gray-700 block">
                              Generate Verification Twin
                            </span>
                            <span className="text-[9.5px] text-gray-400 mt-1 leading-normal block">
                              Automatically generates dual-matching validation inquiries down-stream during simulation.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUpdateQuestion({ ...q, isTwinVerify: !q.isTwinVerify })}
                            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                              q.isTwinVerify ? 'bg-teal-600' : 'bg-gray-250'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                q.isTwinVerify ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                      </div>

                      {/* Display warning details for twin verification if ticked */}
                      {q.isTwinVerify && (
                        <div className="bg-emerald-50 text-emerald-800 p-3 rounded border border-emerald-100 text-[10px] flex items-start space-x-1.5 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-[#1E5D3E] shrink-0 mt-0.5 animate-pulse" />
                          <span>
                            Twin response comparison active. System generates a twin answer matching anchor linked to <strong>"{q.id}"</strong>. The Participant Sandbox will flags inconsistencies as high risk.
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* DAShed interactive empty state zone matching the reference image layout exactly */}
        <div className="border-2 border-dashed border-gray-250 hover:border-emerald-600 rounded-xl p-8 bg-gray-50/10 hover:bg-[#EDF7ED]/5 transition-all text-center flex flex-col items-center justify-center select-none group">
          <button
            onClick={() => handleAddQuestionOfType('single_choice')}
            className="h-12 w-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#1E5D3E] group-hover:border-[#1E5D3E] hover:scale-105 transition-all mb-4 cursor-pointer"
          >
            <Plus className="h-6 w-6" />
          </button>
          
          <h4 className="text-xs font-bold text-gray-800 group-hover:text-emerald-900 transition-colors">
            Create New Question Node
          </h4>
          <p className="text-[11px] text-gray-400 max-w-sm mt-1 mb-2 leading-relaxed">
            Append questions dynamically by clicking the "+" button above, or by choosing categories from the <strong>Question Types Palette</strong> menu in the left sideboard column.
          </p>
        </div>

      </div>

    </div>
  );
}
