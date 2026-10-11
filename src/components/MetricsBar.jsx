import React from 'react';
import { Timer, Zap, ShieldCheck, Flame, Sparkles } from 'lucide-react';

export default function MetricsBar({ optimization, fairnessThresholdSec }) {
  if (!optimization) return null;

  const {
    prep_time_reduction_percent = 0,
    total_time_saved_sec = 0,
    avg_customer_wait_batched_sec = 0,
    throughput_drinks_per_hour_batched = 0,
    wand_purges_saved = 0
  } = optimization;

  const savedMinutes = Math.floor(total_time_saved_sec / 60);
  const savedSecRemainder = total_time_saved_sec % 60;
  const timeSavedFormatted = savedMinutes > 0 
    ? `${savedMinutes}m ${savedSecRemainder}s` 
    : `${savedSecRemainder}s`;

  return (
    <div className="bg-[#f7f1e9] border-b border-[#eddcd2] px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Prep Time Saved */}
        <div className="bg-white border border-[#eddcd2] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7d6557] font-semibold">
            <span>Time Saved</span>
            <div className="w-7 h-7 rounded-full bg-[#fcf2ea] text-[#c67c4e] flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xl font-extrabold text-[#2a170e] tracking-tight">
              -{prep_time_reduction_percent}%
            </span>
            <span className="text-[11px] text-[#8c7465] ml-1 font-medium">
              ({timeSavedFormatted})
            </span>
          </div>
          <div className="text-[10px] text-[#2e7d32] mt-1 font-semibold">
            Parallel steam & grind
          </div>
        </div>

        {/* Metric 2: Average Wait Time */}
        <div className="bg-white border border-[#eddcd2] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7d6557] font-semibold">
            <span>Avg Wait</span>
            <div className="w-7 h-7 rounded-full bg-[#fcf2ea] text-[#c67c4e] flex items-center justify-center">
              <Timer className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xl font-extrabold text-[#2a170e] tracking-tight">
              {(avg_customer_wait_batched_sec / 60).toFixed(1)} min
            </span>
          </div>
          <div className="text-[10px] text-[#8c7465] mt-1 font-medium">
            From arrival to cup
          </div>
        </div>

        {/* Metric 3: Hourly Speed */}
        <div className="bg-white border border-[#eddcd2] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7d6557] font-semibold">
            <span>Rush Speed</span>
            <div className="w-7 h-7 rounded-full bg-[#fcf2ea] text-[#c67c4e] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-[#2a170e] tracking-tight">
              {throughput_drinks_per_hour_batched}
            </span>
            <span className="text-[11px] text-[#8c7465]">drinks/hr</span>
          </div>
          <div className="text-[10px] text-[#8c7465] mt-1 font-medium">
            Peak bar flow rate
          </div>
        </div>

        {/* Metric 4: Wand Purges Saved */}
        <div className="bg-white border border-[#eddcd2] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7d6557] font-semibold">
            <span>Wand Cleans</span>
            <div className="w-7 h-7 rounded-full bg-[#fcf2ea] text-[#c67c4e] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-[#2a170e] tracking-tight">
              {wand_purges_saved}
            </span>
            <span className="text-[11px] text-[#8c7465]">saved</span>
          </div>
          <div className="text-[10px] text-[#8c7465] mt-1 font-medium">
            Zero milk cross-mix
          </div>
        </div>

        {/* Metric 5: Fairness Guardrail */}
        <div className="col-span-2 sm:col-span-1 bg-white border border-[#eddcd2] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#7d6557] font-semibold">
            <span>Max Wait SLA</span>
            <div className="w-7 h-7 rounded-full bg-[#fcf2ea] text-[#c67c4e] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xl font-extrabold text-[#2a170e] tracking-tight">
              &le; {(fairnessThresholdSec / 60).toFixed(1)}m
            </span>
          </div>
          <div className="text-[10px] text-[#2e7d32] mt-1 font-semibold">
            Customer guarantee
          </div>
        </div>
      </div>
    </div>
  );
}

