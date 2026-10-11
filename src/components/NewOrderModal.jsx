import React, { useState } from 'react';
import { X, Coffee, Sparkles, Wand2, Plus, Check } from 'lucide-react';
import { parseOrderWithGemini } from '../api';

export default function NewOrderModal({ isOpen, onClose, onAddOrder }) {
  const [activeTab, setActiveTab] = useState('gemini_nlp'); // 'gemini_nlp' or 'manual'
  
  // Manual Form State
  const [customerName, setCustomerName] = useState('');
  const [drinkName, setDrinkName] = useState('Latte');
  const [category, setCategory] = useState('hot_espresso_milk');
  const [milkType, setMilkType] = useState('oat');
  const [size, setSize] = useState('12oz');
  const [temperature, setTemperature] = useState('hot');
  const [syrup, setSyrup] = useState('');
  const [notes, setNotes] = useState('');

  // Gemini NLP Order State
  const [nlpInput, setNlpInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedOrders, setParsedOrders] = useState([]);
  const [parseError, setParseError] = useState(null);

  if (!isOpen) return null;

  const quickVoiceExamples = [
    "Two 12oz iced vanilla oat lattes for Dave and Sarah",
    "One 8oz flat white with whole milk for Marcus and an iced americano for Noah",
    "Three large cold brews for the morning rush team",
    "One cortado for Elena with whole milk and extra shot"
  ];

  const handleParseWithGemini = async (textToParse) => {
    const query = textToParse || nlpInput;
    if (!query.trim()) return;

    setIsParsing(true);
    setParseError(null);
    try {
      const res = await parseOrderWithGemini(query);
      if (res.orders && res.orders.length > 0) {
        setParsedOrders(res.orders);
      } else {
        setParseError('No drinks detected. Try mentioning a drink name like Latte, Flat White, or Cold Brew.');
      }
    } catch (err) {
      console.warn('Gemini Parse error:', err);
      setParseError('Failed to parse with Gemini. You can switch to manual entry.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleAddAllParsed = () => {
    parsedOrders.forEach((ord) => {
      onAddOrder({
        customer_name: ord.customer_name || 'Guest',
        drink_name: ord.drink_name || 'Latte',
        category: ord.category || 'hot_espresso_milk',
        milk_type: ord.milk_type || 'whole',
        size: ord.size || '12oz',
        temperature: ord.temperature || 'hot',
        shots: ord.shots || 2,
        syrup: ord.syrup || null,
        notes: ord.notes || null
      });
    });
    setParsedOrders([]);
    setNlpInput('');
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    onAddOrder({
      customer_name: customerName.trim(),
      drink_name: drinkName,
      category: category,
      milk_type: milkType,
      size: size,
      temperature: temperature,
      shots: 2,
      syrup: syrup.trim() || null,
      notes: notes.trim() || null
    });

    onClose();
  };

  const sizeOptions = [
    { id: '8oz', label: 'Small', volume: '8oz' },
    { id: '12oz', label: 'Medium', volume: '12oz' },
    { id: '16oz', label: 'Large', volume: '16oz' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#eddcd2] rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8c7465] hover:text-[#2a170e] p-2 rounded-full bg-[#faf6f0] hover:bg-[#eddcd2] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#fbf0e6] text-[#c67c4e] flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-extrabold text-[#2a170e] m-0">Add Customer Drink</h3>
          </div>
          <p className="text-xs text-[#8c7465] m-0">Inject drinks into the batch queue via Gemini NLP or manual setup.</p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-[#faf6f0] p-1 rounded-full border border-[#eddcd2] mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('gemini_nlp')}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'gemini_nlp'
                ? 'bg-[#c67c4e] text-white shadow-xs'
                : 'text-[#7d6557] hover:text-[#2a170e]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Smart Transcriber
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-[#c67c4e] text-white shadow-xs'
                : 'text-[#7d6557] hover:text-[#2a170e]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Manual Builder
          </button>
        </div>

        {/* TAB 1: GEMINI NLP ORDER TRANSCRIBER */}
        {activeTab === 'gemini_nlp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5c3e2e] mb-1.5">
                Spoken or Typed Natural Language Order
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 'Two 12oz iced oat lattes with vanilla for Dave and Chloe, and an 8oz whole milk flat white for Marcus'"
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                className="w-full bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-2xl p-3.5 text-xs text-[#2a170e] font-medium focus:outline-none transition-colors"
              />
            </div>

            {/* Quick 1-click examples */}
            <div>
              <span className="text-[11px] font-bold text-[#8c7465] uppercase tracking-wider block mb-1.5">
                1-Click Voice Transcriptions:
              </span>
              <div className="flex flex-col gap-1.5">
                {quickVoiceExamples.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNlpInput(ex);
                      handleParseWithGemini(ex);
                    }}
                    className="text-left text-xs bg-[#fdfaf6] hover:bg-[#faeee2] text-[#5c3e2e] border border-[#eddcd2] rounded-xl px-3 py-1.5 transition-all cursor-pointer font-medium"
                  >
                    &ldquo;{ex}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={isParsing || !nlpInput.trim()}
              onClick={() => handleParseWithGemini()}
              className="w-full py-3 bg-[#c67c4e] hover:bg-[#b86e41] disabled:opacity-50 text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isParsing ? 'animate-spin' : ''}`} />
              {isParsing ? 'Gemini Agent Parsing...' : 'Parse Order with Gemini Agent'}
            </button>

            {parseError && (
              <div className="text-xs text-[#b3261e] bg-[#fdf2f2] p-2.5 rounded-xl border border-[#f5c6cb]">
                {parseError}
              </div>
            )}

            {/* Parsed Orders Preview Cards */}
            {parsedOrders.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#eddcd2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2e7d32] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Detected {parsedOrders.length} Drink Ticket(s):
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {parsedOrders.map((ord, idx) => (
                    <div key={idx} className="bg-[#faf6f0] border border-[#eddcd2] rounded-2xl p-3 text-xs">
                      <div className="font-bold text-[#2a170e] flex items-center justify-between">
                        <span>{ord.customer_name}</span>
                        <span className="text-[10px] uppercase font-bold bg-[#fbf0e6] text-[#8b4f2c] px-2 py-0.5 rounded-full">
                          {ord.size}
                        </span>
                      </div>
                      <div className="text-[#5c3e2e] mt-1 font-semibold">
                        {ord.temperature === 'iced' ? '🧊 Iced ' : '☕ '}{ord.drink_name}
                      </div>
                      <div className="text-[11px] text-[#8c7465] mt-0.5">
                        {ord.milk_type.toUpperCase()} Milk {ord.syrup ? `&bull; ${ord.syrup}` : ''}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddAllParsed}
                  className="w-full py-3.5 bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Inject All {parsedOrders.length} Drinks into Batch Queue
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANUAL BUILDER */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5c3e2e] mb-1.5">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chloe, Dave, Sarah"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-2xl px-4 py-2.5 text-xs text-[#2a170e] font-medium focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5c3e2e] mb-1.5">
                  Coffee Selection
                </label>
                <select
                  value={drinkName}
                  onChange={(e) => setDrinkName(e.target.value)}
                  className="w-full bg-[#faf6f0] border border-[#eddcd2] rounded-2xl px-3.5 py-2.5 text-xs text-[#2a170e] font-medium focus:outline-none focus:border-[#c67c4e] cursor-pointer"
                >
                  <option value="Latte">Latte</option>
                  <option value="Flat White">Flat White</option>
                  <option value="Cappuccino">Cappuccino</option>
                  <option value="Cold Brew">Cold Brew</option>
                  <option value="Iced Americano">Iced Americano</option>
                  <option value="Cortado">Cortado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3e2e] mb-1.5">
                  Milk Choice
                </label>
                <select
                  value={milkType}
                  onChange={(e) => setMilkType(e.target.value)}
                  className="w-full bg-[#faf6f0] border border-[#eddcd2] rounded-2xl px-3.5 py-2.5 text-xs text-[#2a170e] font-medium focus:outline-none focus:border-[#c67c4e] cursor-pointer"
                >
                  <option value="oat">Oat Milk</option>
                  <option value="whole">Whole Milk</option>
                  <option value="almond">Almond Milk</option>
                  <option value="skim">Skim Milk</option>
                  <option value="none">Black / Direct</option>
                </select>
              </div>
            </div>

            {/* Choose Sizes Cards styled exactly like reference screen 3 */}
            <div>
              <label className="block text-xs font-bold text-[#5c3e2e] mb-2">
                Choose Sizes
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {sizeOptions.map((opt) => {
                  const isSelected = size === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSize(opt.id)}
                      className={`rounded-2xl p-3 text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-between ${
                        isSelected
                          ? 'bg-[#7a4328] text-white border-[#7a4328] shadow-sm'
                          : 'bg-[#faf6f0] text-[#5c3e2e] border-[#eddcd2] hover:border-[#c67c4e]'
                      }`}
                    >
                      <Coffee className={`w-5 h-5 mb-1 ${isSelected ? 'text-white' : 'text-[#c67c4e]'}`} />
                      <span className="text-xs font-bold">{opt.label}</span>
                      <span className={`text-[11px] mt-0.5 ${isSelected ? 'text-[#f5d5ba]' : 'text-[#8c7465]'}`}>
                        {opt.volume}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5c3e2e] mb-1.5">
                  Temperature
                </label>
                <select
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full bg-[#faf6f0] border border-[#eddcd2] rounded-2xl px-3.5 py-2.5 text-xs text-[#2a170e] font-medium focus:outline-none focus:border-[#c67c4e] cursor-pointer"
                >
                  <option value="hot">Hot</option>
                  <option value="iced">Iced</option>
                  <option value="extra_hot">Extra Hot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3e2e] mb-1.5">
                  Syrup (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Vanilla, Caramel"
                  value={syrup}
                  onChange={(e) => setSyrup(e.target.value)}
                  className="w-full bg-[#faf6f0] border border-[#eddcd2] focus:border-[#c67c4e] rounded-2xl px-3.5 py-2.5 text-xs text-[#2a170e] font-medium focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-[#c67c4e] hover:bg-[#b86e41] text-white font-bold text-sm rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Add to Queue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
