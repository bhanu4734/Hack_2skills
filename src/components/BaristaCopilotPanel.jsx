import React, { useState } from 'react';
import { Sparkles, Send, Coffee, Flame, ShieldAlert, BarChart3, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { askBaristaCopilot, fetchShiftAudit } from '../api';

export default function BaristaCopilotPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [adviceText, setAdviceText] = useState(null);
  const [sourceTag, setSourceTag] = useState(null);

  const quickPrompts = [
    { label: 'Rush Strategy', icon: Flame, text: 'Provide a tactical workflow strategy for the current active batches.' },
    { label: 'Wand & Milk Tips', icon: Coffee, text: 'How should I sequence milk steaming to eliminate steam wand cross-contamination?' },
    { label: 'Bottleneck Audit', icon: ShieldAlert, text: 'Are any customers approaching the maximum wait SLA threshold?' },
    { label: 'Shift Audit', icon: BarChart3, isAudit: true }
  ];

  const handleAsk = async (customPrompt) => {
    const promptToSend = customPrompt || query;
    if (!promptToSend && !customPrompt) return;

    setLoading(true);
    try {
      const res = await askBaristaCopilot(promptToSend);
      setAdviceText(res.advice);
      setSourceTag(res.source);
    } catch (err) {
      console.warn('Copilot error:', err);
      setAdviceText('Could not contact Gemini Copilot. Operating on built-in barista heuristics.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetchShiftAudit();
      setAdviceText(res.report);
      setSourceTag(res.source);
    } catch (err) {
      console.warn('Audit error:', err);
      setAdviceText('Shift audit unavailable. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#eddcd2] rounded-3xl overflow-hidden shadow-sm transition-all">
      {/* Header bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 bg-[#fbf7f2] border-b border-[#eddcd2] flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fbf0e6] text-[#c67c4e] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#2a170e] m-0">
                Gemini Barista Copilot
              </h3>
              <span className="text-[10px] font-bold text-[#2e7d32] bg-[#eef7ee] border border-[#cce6cc] px-2 py-0.5 rounded-full">
                Gemini 2.5 Flash &bull; Free
              </span>
            </div>
            <p className="text-[11px] text-[#8c7465] m-0">
              Live AI shift advisor for pitcher sizing, allergen isolation, and wait optimization.
            </p>
          </div>
        </div>

        <button className="text-[#8c7465] hover:text-[#2a170e] p-1.5 rounded-full bg-white border border-[#eddcd2]">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div className="p-5 md:p-6 space-y-4">
          {/* Quick Action Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#8c7465] mr-1">Tactical Prompts:</span>
            {quickPrompts.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => p.isAudit ? handleRunAudit() : handleAsk(p.text)}
                  className="text-xs font-bold bg-[#faf6f0] hover:bg-[#c67c4e] hover:text-white text-[#5c3e2e] border border-[#eddcd2] rounded-full px-3.5 py-1.5 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Advice Result Box */}
          {adviceText && (
            <div className="bg-[#faf6f0] border-2 border-[#eddcd2] rounded-2xl p-4.5 text-xs text-[#2a170e] leading-relaxed shadow-xs">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#eddcd2]">
                <span className="font-bold text-[#c67c4e] flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  Barista Shift Recommendation
                </span>
                {sourceTag && (
                  <span className="text-[10px] font-mono text-[#8c7465] bg-white px-2 py-0.5 rounded-md border border-[#eddcd2]">
                    Engine: {sourceTag}
                  </span>
                )}
              </div>
              <div className="whitespace-pre-line font-medium text-[#3b2316]">
                {adviceText}
              </div>
            </div>
          )}

          {/* Custom Prompt Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot: e.g. 'Can I steam oat and whole milk back-to-back?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-full px-4 py-2.5 text-xs text-[#2a170e] placeholder-[#a89282] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-[#c67c4e] hover:bg-[#b86e41] disabled:opacity-50 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
