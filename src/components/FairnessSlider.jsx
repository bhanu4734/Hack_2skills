import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function FairnessSlider({ value, onChange, disabled }) {
  const presets = [60, 90, 120, 180, 240];

  return (
    <div className="bg-white border border-[#eddcd2] rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2e7d32]" />
            <h3 className="text-base font-extrabold text-[#2a170e] m-0">
              Maximum Customer Wait Limit
            </h3>
          </div>
          <p className="text-xs text-[#8c7465] mt-1">
            Safety SLA threshold: Flushes the batch immediately if any guest waits longer than this limit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8c7465] font-semibold">Active Limit:</span>
          <span className="text-xs font-bold text-[#8b4f2c] bg-[#fbf0e6] border border-[#f5d9c2] px-3 py-1 rounded-full">
            {value}s ({(value / 60).toFixed(1)} mins)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="range"
          min="45"
          max="300"
          step="15"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2.5 bg-[#f0e4d8] rounded-full appearance-none cursor-pointer accent-[#c67c4e]"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#8c7465] font-semibold mr-1">Quick Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`text-xs px-3.5 py-1.5 rounded-full border font-bold transition-all cursor-pointer ${
                value === preset
                  ? 'bg-[#c67c4e] text-white border-[#c67c4e] shadow-xs'
                  : 'bg-[#faf6f0] text-[#7d6557] border-[#eddcd2] hover:border-[#c67c4e] hover:text-[#2a170e]'
              }`}
            >
              {preset}s ({preset / 60}m)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

