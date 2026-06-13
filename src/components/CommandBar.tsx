import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, HelpCircle, Terminal, FileText, Settings, Play, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenerData, SimPersona } from '../types';

interface CommandBarProps {
  screener: ScreenerData;
  personas: SimPersona[];
  onSelectTab: (screenIndex: number) => void;
  onSelectQuestion: (questionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandBar({
  screener,
  personas,
  onSelectTab,
  onSelectQuestion,
  isOpen,
  onClose,
}: CommandBarProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle keys inside Command Bar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    }
  };

  const handleSelectItem = (item: any) => {
    if (item.type === 'tab') {
      onSelectTab(item.value);
    } else if (item.type === 'question') {
      onSelectTab(1); // Question screen index
      onSelectQuestion(item.value);
    } else if (item.type === 'rule') {
      onSelectTab(2); // Routing screen index
    } else if (item.type === 'persona') {
      onSelectTab(5); // Simulator screen index
    } else if (item.type === 'action') {
      item.action();
    }
    onClose();
  };

  // Build searchable items list
  const items = [
    // Tabs
    { type: 'tab', label: 'Go to Screener Overview', category: 'Navigation', icon: FileText, value: 0 },
    { type: 'tab', label: 'Go to Question Builder', category: 'Navigation', icon: FileText, value: 1 },
    { type: 'tab', label: 'Go to Routing Logic Editor', category: 'Navigation', icon: FileText, value: 2 },
    { type: 'tab', label: 'Go to Validation Branch Builder', category: 'Navigation', icon: Settings, value: 3 },
    { type: 'tab', label: 'Go to Flow Visualization Canvas', category: 'Navigation', icon: Terminal, value: 4 },
    { type: 'tab', label: 'Go to Participant Simulator', category: 'Navigation', icon: Play, value: 5 },
    { type: 'tab', label: 'Go to Screener Metrics & Pre-flight Diagnostics', category: 'Navigation', icon: HelpCircle, value: 6 },
    { type: 'tab', label: 'Go to Publish and Active Screener', category: 'Navigation', icon: CheckCircle, value: 7 },

    // Questions
    ...screener.questions.map((q) => ({
      type: 'question',
      label: `Edit ${q.id}: ${q.text}`,
      category: 'Questions',
      icon: Sparkles,
      value: q.id,
    })),

    // Personas
    ...personas.map((p) => ({
      type: 'persona',
      label: `Simulate Persona: ${p.name} (${p.role})`,
      category: 'Simulations',
      icon: Play,
      value: p.id,
    })),
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-center border-b border-gray-100 px-4 py-3.5">
              <Search className="mr-3 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search queries, questions, personas, or actions... (Esc to quit)"
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
              <span className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 select-none">
                ESC
              </span>
            </div>

            <div className="max-h-[380px] overflow-y-auto py-2">
              {filteredItems.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No matching results for "<span className="text-gray-600 font-medium">{query}</span>"
                </div>
              ) : (
                Object.entries(
                  filteredItems.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, typeof filteredItems>)
                ).map(([category, catItems]) => (
                  <div key={category}>
                    <div className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                      {category}
                    </div>
                    <div>
                      {catItems.map((item, idx) => {
                        // Global flat index across all filtered list
                        const flatIdx = filteredItems.indexOf(item);
                        const isSelected = flatIdx === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <div
                            key={flatIdx}
                            onClick={() => handleSelectItem(item)}
                            className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                              isSelected
                                ? 'bg-teal-50 text-teal-900 border-l-4 border-teal-600 pl-3'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />
                              <span className="truncate font-medium">{item.label}</span>
                            </div>
                            {isSelected && (
                              <span className="text-xs text-teal-600 font-medium bg-teal-100/50 px-1.5 py-0.5 rounded">
                                Return ↵
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-400 select-none">
              <span>Use <kbd className="font-semibold text-gray-500">↑↓</kbd> arrows to navigate, <kbd className="font-semibold text-gray-500">Enter</kbd> to select.</span>
              <span>Linear Style HUD</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
