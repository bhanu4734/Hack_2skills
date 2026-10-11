import React, { useState } from 'react';
import { Users, Clock, CheckCircle2, Coffee, Search, Sparkles, Send, Bot, MessageCircle } from 'lucide-react';
import { askCustomerConcierge } from '../api';

export default function CustomerEtaBoard({ customerEtas = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Gemini Concierge State
  const [conciergeGuest, setConciergeGuest] = useState('');
  const [conciergeQuestion, setConciergeQuestion] = useState('');
  const [conciergeReply, setConciergeReply] = useState(null);
  const [isAskingConcierge, setIsAskingConcierge] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);

  const readyCount = customerEtas.filter(i => i.status === 'ready_for_pickup').length;
  const brewingCount = customerEtas.filter(i => i.status === 'making_in_batch').length;
  const queuedCount = customerEtas.filter(i => i.status === 'queued_in_batch').length;

  const handleAskConcierge = async (presetGuest, presetQ) => {
    const guest = presetGuest || conciergeGuest || (customerEtas[0]?.customer_name || 'Guest');
    const question = presetQ || conciergeQuestion;
    if (!question.trim()) return;

    setIsAskingConcierge(true);
    try {
      const res = await askCustomerConcierge(guest, question);
      setConciergeReply(res.reply);
    } catch (err) {
      console.warn('Concierge error:', err);
      setConciergeReply('Our baristas are steaming fresh drinks right now! Check back at the pickup counter in a few moments.');
    } finally {
      setIsAskingConcierge(false);
    }
  };

  const filtered = customerEtas.filter((item) => {
    const matchesSearch = 
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.drink_name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'ready') return item.status === 'ready_for_pickup';
    if (statusFilter === 'brewing') return item.status === 'making_in_batch';
    if (statusFilter === 'queued') return item.status === 'queued_in_batch';
    return true;
  });


  return (
    <div className="space-y-5">
      {/* Header and Search matching reference screen 2 search bar */}
      <div className="bg-white border border-[#eddcd2] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fbf0e6] text-[#c67c4e] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-[#2a170e] m-0">
              Guest Pickup & Wait Status
            </h2>
          </div>
          <p className="text-xs text-[#8c7465] mt-1">
            Real-time pickup board for cafe guests and counter baristas.
          </p>
        </div>

        {/* Search Input styled like reference image screen 2 */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#c67c4e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your name or order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#2a170e] placeholder-[#a89282] focus:outline-none transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Gemini AI Guest Concierge Assistant */}
      <div className="bg-white border border-[#eddcd2] rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fbf0e6] text-[#c67c4e] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#2a170e] m-0 flex items-center gap-2">
                Gemini Guest Concierge
                <span className="text-[10px] font-bold text-[#2e7d32] bg-[#eef7ee] border border-[#cce6cc] px-2 py-0.5 rounded-full">
                  Free AI Assistant
                </span>
              </h3>
              <p className="text-[11px] text-[#8c7465] m-0">
                Ask when your ticket will be ready or learn why drinks are steamed in synchronized batches.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConcierge(!showConcierge)}
            className="text-xs font-bold text-[#c67c4e] hover:text-[#b86e41] self-start sm:self-auto cursor-pointer flex items-center gap-1"
          >
            {showConcierge ? 'Hide Assistant' : '✨ Open AI Concierge'}
          </button>
        </div>

        {showConcierge && (
          <div className="mt-3.5 pt-3.5 border-t border-[#eddcd2] space-y-3">
            {/* Quick question presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#8c7465]">Quick Questions:</span>
              <button
                type="button"
                onClick={() => handleAskConcierge(customerEtas[0]?.customer_name, "When will my drink be ready and which batch is it in?")}
                className="text-xs font-semibold bg-[#faf6f0] hover:bg-[#c67c4e] hover:text-white text-[#5c3e2e] border border-[#eddcd2] rounded-full px-3 py-1 transition-all cursor-pointer"
              >
                &ldquo;When will my drink be ready?&rdquo;
              </button>
              <button
                type="button"
                onClick={() => handleAskConcierge("Guest", "Why do you batch drinks instead of one-by-one?")}
                className="text-xs font-semibold bg-[#faf6f0] hover:bg-[#c67c4e] hover:text-white text-[#5c3e2e] border border-[#eddcd2] rounded-full px-3 py-1 transition-all cursor-pointer"
              >
                &ldquo;Why batch drinks?&rdquo;
              </button>
            </div>

            {/* Answer Display */}
            {conciergeReply && (
              <div className="p-3.5 bg-[#faf6f0] border-2 border-[#eddcd2] rounded-2xl text-xs text-[#2a170e] flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-[#c67c4e] shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  {conciergeReply}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Your Name (e.g. Dave K., Alice)"
                value={conciergeGuest}
                onChange={(e) => setConciergeGuest(e.target.value)}
                className="sm:w-44 bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-full px-3.5 py-2 text-xs text-[#2a170e] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Ask Concierge anything about your order..."
                value={conciergeQuestion}
                onChange={(e) => setConciergeQuestion(e.target.value)}
                className="flex-1 bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-full px-4 py-2 text-xs text-[#2a170e] focus:outline-none"
              />
              <button
                type="button"
                disabled={isAskingConcierge || !conciergeQuestion.trim()}
                onClick={() => handleAskConcierge()}
                className="px-4 py-2 bg-[#c67c4e] hover:bg-[#b86e41] disabled:opacity-50 text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Send className={`w-3.5 h-3.5 ${isAskingConcierge ? 'animate-spin' : ''}`} />
                <span>Ask</span>
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Category Pills matching the pill category selector in reference screen 2 */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#c67c4e] text-white shadow-sm'
              : 'bg-white border border-[#eddcd2] text-[#7d6557] hover:border-[#c67c4e] hover:text-[#2a170e]'
          }`}
        >
          All Orders ({customerEtas.length})
        </button>
        <button
          onClick={() => setStatusFilter('ready')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            statusFilter === 'ready'
              ? 'bg-[#2e7d32] text-white shadow-sm'
              : 'bg-white border border-[#eddcd2] text-[#2e7d32] hover:border-[#2e7d32]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Ready for Pickup ({readyCount})
        </button>
        <button
          onClick={() => setStatusFilter('brewing')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            statusFilter === 'brewing'
              ? 'bg-[#c67c4e] text-white shadow-sm'
              : 'bg-white border border-[#eddcd2] text-[#b8632e] hover:border-[#c67c4e]'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Brewing Now ({brewingCount})
        </button>
        <button
          onClick={() => setStatusFilter('queued')}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            statusFilter === 'queued'
              ? 'bg-[#7d6557] text-white shadow-sm'
              : 'bg-white border border-[#eddcd2] text-[#7d6557] hover:border-[#7d6557]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          In Queue ({queuedCount})
        </button>
      </div>

      {/* Grid of Customer Order Status Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#eddcd2] rounded-3xl p-10 text-center text-[#8c7465] text-xs shadow-sm">
          No customer orders found matching this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const isReady = item.status === 'ready_for_pickup';
            const isBrewing = item.status === 'making_in_batch';

            return (
              <div
                key={item.item_id}
                className={`rounded-3xl border-2 p-5 flex flex-col justify-between transition-all bg-white shadow-xs ${
                  isReady
                    ? 'border-[#81c784] hover:shadow-md'
                    : isBrewing
                    ? 'border-[#c67c4e] hover:shadow-md'
                    : 'border-[#eddcd2] hover:border-[#c67c4e]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#6d4d38] bg-[#f7efe6] px-2.5 py-1 rounded-lg">
                      {item.order_id}
                    </span>

                    {isReady ? (
                      <span className="bg-[#eef7ee] text-[#2e7d32] border border-[#cce6cc] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready for Pickup
                      </span>
                    ) : isBrewing ? (
                      <span className="bg-[#faeee2] text-[#b8632e] border border-[#f5d5ba] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5" />
                        Brewing ({item.batch_id})
                      </span>
                    ) : (
                      <span className="bg-[#faf6f0] text-[#7d6557] border border-[#eddcd2] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        In Queue ({item.batch_id})
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-[#2a170e] mb-1">
                    {item.customer_name}
                  </h3>
                  <div className="text-xs font-bold text-[#5c3e2e] flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-[#c67c4e]" />
                    {item.size} {item.milk_type !== 'none' ? `${item.milk_type.toUpperCase()} ` : ''}{item.drink_name}
                  </div>
                  {item.syrup && (
                    <div className="text-[11px] text-[#8b532e] bg-[#fbf0e6] px-2.5 py-0.5 rounded-md mt-2 inline-block font-semibold">
                      +{item.syrup}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#f2e6dc] flex items-center justify-between">
                  <span className="text-xs text-[#8c7465] font-medium">
                    {isReady ? 'Pickup Location' : 'Estimated Wait'}
                  </span>
                  <span className={`text-base font-extrabold ${isReady ? 'text-[#2e7d32]' : 'text-[#c67c4e]'}`}>
                    {isReady ? 'Ready at Bar' : `~${Math.ceil(item.estimated_wait_sec / 60)} mins`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

