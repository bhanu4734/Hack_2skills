import React from 'react';
import { Layers, ArrowUpRight, Coffee } from 'lucide-react';

export default function BatchQueueList({ batches, onSelectHero, activeHeroId }) {
  if (!batches || batches.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#eddcd2] rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-extrabold text-[#2a170e] flex items-center gap-2 m-0">
            <Layers className="w-4 h-4 text-[#c67c4e]" />
            Upcoming Queued Batches
          </h2>
          <p className="text-xs text-[#8c7465] mt-0.5">
            Auto-grouped by milk type and recipe to eliminate wand purges.
          </p>
        </div>
        <span className="text-xs font-bold text-[#8b4f2c] bg-[#fbf0e6] border border-[#f5d9c2] px-3 py-1 rounded-full">
          {batches.length} Batches
        </span>
      </div>

      <div className="space-y-3.5">
        {batches.map((batch) => {
          const isHero = batch.batch_id === activeHeroId;
          const count = batch.items.length;

          return (
            <div
              key={batch.batch_id}
              className={`p-4.5 rounded-2xl border-2 transition-all ${
                isHero
                  ? 'bg-[#faf6f0] border-[#c67c4e] shadow-sm'
                  : 'bg-white border-[#eddcd2] hover:border-[#dbc2b2]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-[#2a170e] bg-[#f7efe6] border border-[#eddcd2] px-2.5 py-1 rounded-lg">
                    {batch.batch_id}
                  </span>
                  <span className="font-extrabold text-[#2a170e] text-base">
                    {batch.display_title}
                  </span>
                  <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full bg-[#f7efe6] text-[#5c3e2e] border border-[#eddcd2]">
                    {batch.milk_type} Milk
                  </span>
                  {count > 1 && (
                    <span className="text-[11px] font-bold bg-[#fbf0e6] text-[#8b4f2c] border border-[#f5d9c2] px-3 py-1 rounded-full">
                      Group of {count}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {batch.time_saved_sec > 0 && (
                    <span className="text-xs font-bold text-[#2e7d32] bg-[#eef7ee] border border-[#cce6cc] px-2.5 py-1 rounded-full">
                      -{batch.time_saved_sec}s saved
                    </span>
                  )}
                  {!isHero && (
                    <button
                      onClick={() => onSelectHero(batch)}
                      className="text-xs text-white font-bold flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c67c4e] hover:bg-[#b86e41] rounded-full transition-all shadow-xs cursor-pointer"
                    >
                      Focus <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Members of this batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-2">
                {batch.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#faf6f0] border border-[#eddcd2] rounded-xl p-2.5 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#2a170e] flex items-center gap-1">
                        <Coffee className="w-3 h-3 text-[#c67c4e]" />
                        {item.customer_name}
                      </div>
                      <div className="text-[11px] text-[#6b4e3d] mt-0.5">
                        {item.size} {item.drink_name} {item.syrup ? `(+${item.syrup})` : ''}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#8c7465] bg-white border border-[#eddcd2] px-2 py-0.5 rounded-full">
                      +{item.arrival_time_offset_sec}s
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats Footer */}
              <div className="mt-3 pt-2.5 border-t border-[#f2e6dc] flex items-center justify-between text-xs text-[#8c7465]">
                <span className="font-semibold text-[#5c3e2e]">
                  Prep cycle: {batch.batch_prep_time_sec}s
                </span>
                <span>
                  Delay offset: +{batch.fairness_delay_sec}s
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

