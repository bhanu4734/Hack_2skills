import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, ShieldCheck, Coffee, Sparkles } from 'lucide-react';

export default function HeroBatchCard({
  batch,
  isInProgress,
  onStart,
  onComplete,
  fairnessThresholdSec,
  totalQueuedBatches
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (isInProgress && batch) {
      setSecondsRemaining(batch.batch_prep_time_sec);
      setTimerActive(true);
    } else {
      setTimerActive(false);
      setSecondsRemaining(0);
    }
  }, [isInProgress, batch?.batch_id]);

  useEffect(() => {
    let interval = null;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (secondsRemaining === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsRemaining]);

  if (!batch) {
    return (
      <div className="bg-white border border-[#eddcd2] rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#fbf0e6] text-[#c67c4e] flex items-center justify-center mb-3.5 shadow-xs">
          <Coffee className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#2a170e] mb-1">Queue Clear & Calm</h3>
        <p className="text-xs text-[#8c7465] max-w-sm">
          All orders have been prepared and served to guests. Place a new order or switch scenarios to continue brewing.
        </p>
      </div>
    );
  }

  const {
    batch_id,
    display_title,
    category,
    milk_type,
    items,
    batch_prep_time_sec,
    time_saved_sec,
    savings_percent,
    fairness_delay_sec,
    prep_instructions
  } = batch;

  const count = items.length;
  const isMultiple = count > 1;

  const progressPercent = isInProgress && batch_prep_time_sec > 0
    ? Math.min(100, Math.round(((batch_prep_time_sec - secondsRemaining) / batch_prep_time_sec) * 100))
    : 0;

  return (
    <div className="bg-white border border-[#eddcd2] rounded-3xl overflow-hidden shadow-sm">
      {/* Top Status Ribbon */}
      <div className="px-6 py-3 bg-[#fcf8f2] border-b border-[#eddcd2] flex flex-wrap items-center justify-between text-xs font-semibold gap-2">
        <div className="flex items-center gap-2.5">
          {isInProgress ? (
            <span className="flex items-center gap-2 text-[#b8632e] bg-[#faeee2] border border-[#f5d5ba] px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#c67c4e] animate-pulse inline-block" />
              Brewing Now &bull; {batch_id}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-[#684a37] bg-white border border-[#eddcd2] px-3 py-1 rounded-full text-xs font-bold">
              <Coffee className="w-3.5 h-3.5 text-[#c67c4e]" />
              Up Next &bull; {batch_id}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[#8c7465] text-xs">
          <span className="font-medium">{totalQueuedBatches} batches in queue</span>
          <span>&bull;</span>
          <span>Fairness wait: +{fairness_delay_sec}s (limit {fairnessThresholdSec}s)</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          {/* Left Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#2a170e] tracking-tight m-0">
                {display_title}
              </h2>
              {isMultiple && (
                <span className="bg-[#fbf0e6] text-[#8b4f2c] border border-[#f5d9c2] text-xs font-bold px-3 py-1 rounded-full">
                  Batch of {count} Drinks
                </span>
              )}
            </div>

            {/* Tags matching category pills from reference image */}
            <div className="flex items-center gap-2 flex-wrap text-xs mb-5">
              <span className="bg-[#f7efe6] border border-[#eddcd2] text-[#5c3e2e] px-3 py-1 rounded-full font-bold">
                {milk_type.toUpperCase()} MILK
              </span>
              <span className="bg-[#f7efe6] border border-[#eddcd2] text-[#5c3e2e] px-3 py-1 rounded-full font-bold">
                {category.replace(/_/g, ' ').toUpperCase()}
              </span>
              {milk_type !== 'none' && (
                <span className="bg-white border border-[#eddcd2] text-[#8c7465] px-3 py-1 rounded-full font-semibold">
                  Pitcher: {count * 200}ml / 700ml
                </span>
              )}
            </div>

            {/* Time / Efficiency Box - Styled like the dark mocha promo banner from reference image */}
            <div className="bg-[#2a170e] text-[#f7efe6] rounded-2xl p-4.5 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c67c4e] text-white flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#d4bca9] block font-medium">Batch Preparation Cycle</span>
                  <span className="text-2xl font-black text-white tracking-tight">{batch_prep_time_sec}s</span>
                </div>
              </div>

              <div className="h-8 w-px bg-[#4e2f1e] hidden sm:block" />

              <div>
                <span className="text-[11px] text-[#d4bca9] block font-medium">Total Time Saved</span>
                <span className="text-base font-bold text-[#e09355]">
                  {time_saved_sec}s faster ({savings_percent}% reduction)
                </span>
              </div>

              <div className="h-8 w-px bg-[#4e2f1e] hidden sm:block" />

              <div>
                <span className="text-[11px] text-[#d4bca9] block font-medium">Parallel Efficiency</span>
                <span className="text-xs text-[#fbf0e6] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#e09355]" />
                  Single wand steam
                </span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mb-6">
              <div className="text-xs font-bold text-[#8c7465] uppercase tracking-wider mb-2.5">
                Barista Preparation Workflow
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {prep_instructions.map((step, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#faf6f0] border border-[#eddcd2] rounded-xl p-3 text-[#3a2216] flex items-start gap-2.5 font-medium"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#c67c4e] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Cups Breakdown - Styled like the Choose Sizes cards in reference screen 3 */}
            <div>
              <div className="text-xs font-bold text-[#8c7465] uppercase tracking-wider mb-2.5">
                Customer Cups Lineup ({count} guests)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-[#eddcd2] hover:border-[#c67c4e] rounded-2xl p-3.5 flex flex-col justify-between transition-all shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-[#2a170e]">{item.customer_name}</span>
                        <span className="text-[10px] font-mono font-bold text-[#8c7465] bg-[#f7efe6] px-2 py-0.5 rounded-full">
                          {item.order_id}
                        </span>
                      </div>
                      <div className="text-xs text-[#5c3e2e] font-semibold flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-[#c67c4e]" />
                        {item.size} {item.drink_name}
                      </div>
                      {item.syrup && (
                        <div className="text-[11px] text-[#8b532e] bg-[#fbf0e6] px-2 py-0.5 rounded-md mt-1.5 inline-block font-medium">
                          +{item.syrup}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#f2e6dc] text-[11px] text-[#8c7465] flex items-center justify-between">
                      <span>Wait Time:</span>
                      <span className="font-bold text-[#2a170e]">{item.arrival_time_offset_sec}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action & Timer Column */}
          <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#eddcd2] pt-6 lg:pt-0 lg:pl-8">
            {isInProgress ? (
              <div className="flex flex-col items-center justify-center py-6 bg-[#faf6f0] border border-[#eddcd2] rounded-3xl p-5 text-center shadow-xs">
                <div className="text-xs text-[#8c7465] font-bold tracking-wider mb-1">
                  BREWING TIMER
                </div>
                <div className="text-5xl font-black text-[#2a170e] my-2 tracking-tight">
                  {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                </div>
                
                {/* Caramel progress track */}
                <div className="w-full bg-[#ebd9cb] h-2.5 rounded-full overflow-hidden my-3">
                  <div
                    className="bg-[#c67c4e] h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-xs text-[#8c7465] font-medium">
                  {progressPercent}% completed
                </div>

                <button
                  onClick={() => onComplete(batch_id)}
                  className="w-full mt-5 py-3.5 px-4 bg-[#2e7d32] hover:bg-[#256629] text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark All {count} Served
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 bg-[#faf6f0] border border-[#eddcd2] rounded-3xl p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#fbf0e6] text-[#c67c4e] flex items-center justify-center mx-auto mb-1">
                  <Play className="w-5 h-5 fill-[#c67c4e] ml-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2a170e] m-0">Ready to Pull</h4>
                  <p className="text-xs text-[#8c7465] mt-1 leading-relaxed">
                    Grinds beans and steams milk in one synchronized pass for {count} drinks.
                  </p>
                </div>

                <button
                  onClick={() => onStart(batch_id)}
                  className="w-full py-3.5 px-4 bg-[#c67c4e] hover:bg-[#b86e41] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Start Batch Timer
                </button>
              </div>
            )}

            <div className="mt-5 p-3.5 bg-[#fcf8f2] border border-[#eddcd2] rounded-2xl text-xs text-[#7d6557] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#2a170e]">Fairness Guardrail:</span> {fairnessThresholdSec}s max limit guarantees early customer {items[0]?.customer_name} is served promptly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

