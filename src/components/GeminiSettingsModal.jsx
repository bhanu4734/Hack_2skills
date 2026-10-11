import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Key, ExternalLink } from 'lucide-react';
import { fetchGeminiStatus, updateGeminiConfig } from '../api';

export default function GeminiSettingsModal({ isOpen, onClose }) {
  const [status, setStatus] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchGeminiStatus()
        .then((data) => setStatus(data))
        .catch(() => setStatus(null));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateGeminiConfig(apiKey);
      const updated = await fetchGeminiStatus();
      setStatus(updated);
      setToast('Gemini API key updated successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast('Failed to update Gemini API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#eddcd2] rounded-3xl max-w-md w-full p-6 md:p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8c7465] hover:text-[#2a170e] p-2 rounded-full bg-[#faf6f0] hover:bg-[#eddcd2] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#fbf0e6] text-[#c67c4e] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-extrabold text-[#2a170e] m-0">Gemini AI Configuration</h3>
          </div>
          <p className="text-xs text-[#8c7465] m-0">Google Gemini Free-Tier Agent Management</p>
        </div>

        {/* Status Chip */}
        <div className="p-3.5 bg-[#faf6f0] border border-[#eddcd2] rounded-2xl mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#5c3e2e]">Free Tier Model:</span>
            <span className="font-mono text-[#c67c4e] font-bold">gemini-2.5-flash</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#5c3e2e]">Live API Key Status:</span>
            {status?.has_api_key ? (
              <span className="text-[#2e7d32] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Google AI Key
              </span>
            ) : (
              <span className="text-[#c67c4e] font-semibold">
                Operating on Built-in Free Agent
              </span>
            )}
          </div>
        </div>

        {/* AI Agents Active List */}
        <div className="mb-5">
          <span className="text-[11px] font-bold text-[#8c7465] uppercase tracking-wider block mb-2">
            Active Free Gemini Agents:
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-[#fdfaf6] border border-[#eddcd2] rounded-xl flex items-center justify-between">
              <span className="font-bold text-[#2a170e]">1. Barista Shift Copilot</span>
              <span className="text-[10px] bg-[#eef7ee] text-[#2e7d32] font-bold px-2 py-0.5 rounded-full">Ready</span>
            </div>
            <div className="p-2 bg-[#fdfaf6] border border-[#eddcd2] rounded-xl flex items-center justify-between">
              <span className="font-bold text-[#2a170e]">2. Smart Order NLP Transcriber</span>
              <span className="text-[10px] bg-[#eef7ee] text-[#2e7d32] font-bold px-2 py-0.5 rounded-full">Ready</span>
            </div>
            <div className="p-2 bg-[#fdfaf6] border border-[#eddcd2] rounded-xl flex items-center justify-between">
              <span className="font-bold text-[#2a170e]">3. Guest ETA Concierge</span>
              <span className="text-[10px] bg-[#eef7ee] text-[#2e7d32] font-bold px-2 py-0.5 rounded-full">Ready</span>
            </div>
            <div className="p-2 bg-[#fdfaf6] border border-[#eddcd2] rounded-xl flex items-center justify-between">
              <span className="font-bold text-[#2a170e]">4. Rush Hour Operations Auditor</span>
              <span className="text-[10px] bg-[#eef7ee] text-[#2e7d32] font-bold px-2 py-0.5 rounded-full">Ready</span>
            </div>
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#5c3e2e] mb-1">
              Custom Google Gemini API Key (Optional)
            </label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-[#8c7465] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-xl pl-8 pr-3 py-2 text-xs text-[#2a170e] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-[#8c7465] mt-1 flex items-center gap-1">
              Free with no credit card required at{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#c67c4e] underline font-bold flex items-center gap-0.5"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {toast && (
            <div className="text-xs text-[#2e7d32] font-bold text-center bg-[#eef7ee] py-1.5 rounded-lg border border-[#cce6cc]">
              {toast}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !apiKey.trim()}
            className="w-full py-3 bg-[#c67c4e] hover:bg-[#b86e41] disabled:opacity-50 text-white font-bold text-xs rounded-full transition-all shadow-md cursor-pointer"
          >
            {saving ? 'Updating...' : 'Save Gemini API Key'}
          </button>
        </form>
      </div>
    </div>
  );
}
