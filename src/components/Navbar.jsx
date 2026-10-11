import React from 'react';
import { Coffee, RotateCcw, Plus, Users, Clock } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentScenario,
  onSwitchScenario,
  scenarios,
  onOpenNewOrder,
  onOpenGeminiSettings,
  onReset,
  loading
}) {
  return (
    <header className="bg-white border-b border-[#eddcd2] sticky top-0 z-40 shadow-[0_2px_12px_-4px_rgba(42,22,14,0.06)]">
      {/* Sub-header announcement bar matching the reference image's 'Coffee Yard Time: 9:00 am - 5:30 pm' */}
      <div className="bg-[#2a170e] text-[#f7efe6] px-4 md:px-6 py-1.5 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#e09355]" />
            <span className="font-medium text-[11px] tracking-wide">
              Barista Counter &bull; Rush Hour Parallel Batching Active
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#d4bca9]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              Queue Sync Live
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-[#e09355] font-semibold">
              ✨ 4 Gemini Agents Active (Free)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#c67c4e] text-white flex items-center justify-center shadow-md shadow-[#c67c4e]/20 shrink-0">
            <Coffee className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-[#2a170e] tracking-tight m-0">
                BrewBatch
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8b532e] bg-[#fbf0e6] border border-[#f3d7c0] px-2 py-0.5 rounded-full">
                Artisan
              </span>
            </div>
            <p className="text-[11px] text-[#8c7465] m-0 font-medium">
              Intelligent Cafe Queue & Steam Batching
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Styled as pill selector directly from reference screenshot */}
        <div className="flex items-center bg-[#f7f1e9] p-1 rounded-full border border-[#eddcd2]">
          <button
            onClick={() => setActiveTab('barista')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'barista'
                ? 'bg-[#c67c4e] text-white shadow-sm'
                : 'text-[#6f5647] hover:text-[#2a170e]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Barista Queue
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-[#c67c4e] text-white shadow-sm'
                : 'text-[#6f5647] hover:text-[#2a170e]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Customer ETA
          </button>
        </div>

        {/* Controls & Add Order */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={currentScenario}
            onChange={(e) => onSwitchScenario(e.target.value)}
            disabled={loading}
            className="bg-[#faf6f0] text-[#3d2518] border border-[#eddcd2] text-xs font-medium rounded-full px-3 py-2 focus:outline-none focus:border-[#c67c4e] cursor-pointer"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.title} ({sc.count} orders)
              </option>
            ))}
          </select>

          <button
            onClick={onOpenGeminiSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#fbf0e6] hover:bg-[#f5e3d3] text-[#8b4f2c] border border-[#f5d9c2] text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Configure Gemini AI Agents"
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Gemini AI</span>
          </button>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c67c4e] hover:bg-[#b86e41] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            title="Add incoming customer order"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Order</span>
          </button>

          <button
            onClick={onReset}
            disabled={loading}
            className="p-2 text-[#7d6557] hover:text-[#2a170e] bg-[#faf6f0] hover:bg-[#eddcd2] rounded-full border border-[#eddcd2] transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}


