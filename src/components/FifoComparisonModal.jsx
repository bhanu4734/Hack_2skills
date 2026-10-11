import React from 'react';
import { 
  BarChart3, CheckCircle2, XCircle, ArrowRight, TrendingUp, 
  Clock, Flame, ShieldAlert, Award, Coffee, Sparkles 
} from 'lucide-react';

export default function FifoComparisonModal({ optimization }) {
  if (!optimization) return null;

  const {
    fifo_total_prep_sec,
    batched_total_prep_sec,
    total_time_saved_sec,
    prep_time_reduction_percent,
    avg_customer_wait_fifo_sec,
    avg_customer_wait_batched_sec,
    wait_time_reduction_percent,
    throughput_drinks_per_hour_fifo,
    throughput_drinks_per_hour_batched,
    wand_purges_saved,
    fairness_threshold_sec
  } = optimization;

  return (
    <div className="space-y-6">
      {/* Hero Benchmark Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <BarChart3 className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-black text-white m-0">
                Benchmark: Traditional FIFO vs BrewBatch
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              In a traditional FIFO queue, baristas repeat identical grinds, shots, and pitcher steams 1-by-1.
              BrewBatch groups compatible drinks into consolidated cycles with guaranteed fairness bounds.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-5 text-center shrink-0">
            <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-1">
              Prep Time Reduction
            </div>
            <div className="text-4xl font-black text-emerald-300 font-mono">
              -{prep_time_reduction_percent}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Target was 15-20% &bull; <span className="text-emerald-400 font-bold">Goal Exceeded!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional FIFO Card */}
        <div className="bg-slate-900 border border-rose-950/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-white m-0">Traditional FIFO Queue</h3>
              </div>
              <span className="text-xs font-semibold bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20">
                Legacy First-Come-First-Served
              </span>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Barista Prep Time</span>
                <span className="font-mono text-base font-bold text-slate-200">
                  {Math.round(fifo_total_prep_sec / 60)} min {fifo_total_prep_sec % 60}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Average Customer Wait</span>
                <span className="font-mono text-base font-bold text-rose-300">
                  {(avg_customer_wait_fifo_sec / 60).toFixed(1)} mins
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Drink Throughput</span>
                <span className="font-mono text-base font-bold text-slate-200">
                  {throughput_drinks_per_hour_fifo} drinks / hr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Steaming Wand Purges Required</span>
                <span className="font-mono text-base font-bold text-slate-200">
                  1 per drink (Full friction)
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-xs text-rose-300/90 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Operational Bottlenecks:
              </div>
              <div>&bull; Barista grinds and steams identical oat milk 3 separate times.</div>
              <div>&bull; Steaming wand purged & wiped 3 times consecutively.</div>
              <div>&bull; Peak morning queues cascade out of control.</div>
            </div>
          </div>
        </div>

        {/* BrewBatch Card */}
        <div className="bg-slate-900 border border-emerald-950/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white m-0">BrewBatch Grouping</h3>
              </div>
              <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Batch-Aware + Fairness SLA
              </span>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Barista Prep Time</span>
                <span className="font-mono text-base font-bold text-emerald-300">
                  {Math.round(batched_total_prep_sec / 60)} min {batched_total_prep_sec % 60}s ({total_time_saved_sec}s saved!)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Average Customer Wait</span>
                <span className="font-mono text-base font-bold text-emerald-300">
                  {(avg_customer_wait_batched_sec / 60).toFixed(1)} mins (-{wait_time_reduction_percent}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Drink Throughput</span>
                <span className="font-mono text-base font-bold text-emerald-300">
                  {throughput_drinks_per_hour_batched} drinks / hr (+{(throughput_drinks_per_hour_batched - throughput_drinks_per_hour_fifo).toFixed(0)} drinks!)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Wand Purges Saved</span>
                <span className="font-mono text-base font-bold text-emerald-300">
                  {wand_purges_saved} cycles eliminated
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-300/90 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Key Architectural Wins:
              </div>
              <div>&bull; 1 pitcher steam cycle (650ml) handles 3 lattes at once.</div>
              <div>&bull; Dual-portafilter espresso parallel extraction.</div>
              <div>&bull; Fairness SLA (&le; {fairness_threshold_sec}s) guarantees early tickets never wait too long.</div>
            </div>
          </div>
        </div>
      </div>

      {/* The Mathematics of Batching & Pitch */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          The Secret: How Batching Beats First-Come-First-Served
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-300 mb-1">1. Setup Cost Amortization</div>
            <p className="text-slate-400 leading-relaxed">
              Pulling shots and foaming milk has fixed overhead (grind, tamp, purge steam wand, wipe). Doing 3 together reduces setup steps from 3x to 1x.
            </p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-300 mb-1">2. Hardware Capacity Alignment</div>
            <p className="text-slate-400 leading-relaxed">
              Commercial espresso machines already have 2 group heads and large steam boilers. Independent tickets under-utilize capacity; BrewBatch maximizes boiler duty cycle.
            </p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-300 mb-1">3. Strict Fairness Bounding</div>
            <p className="text-slate-400 leading-relaxed">
              If an order waits more than 120s without a match, the algorithm immediately force-flushes it. No early customer is ever sacrificed for the sake of batching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
