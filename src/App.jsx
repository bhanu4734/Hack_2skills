import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import MetricsBar from './components/MetricsBar';
import HeroBatchCard from './components/HeroBatchCard';
import BatchQueueList from './components/BatchQueueList';
import FairnessSlider from './components/FairnessSlider';
import CustomerEtaBoard from './components/CustomerEtaBoard';
import NewOrderModal from './components/NewOrderModal';
import BaristaCopilotPanel from './components/BaristaCopilotPanel';
import GeminiSettingsModal from './components/GeminiSettingsModal';
import { 
  fetchState, setFairnessThreshold, switchScenario, 
  startBatch, completeBatch, addNewOrder, resetSimulation 
} from './api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('barista');
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHeroBatch, setActiveHeroBatch] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isGeminiSettingsOpen, setIsGeminiSettingsOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadCurrentState = useCallback(async () => {
    try {
      const data = await fetchState();
      setStateData(data);
      setError(null);

      // Set active hero batch to either the in-progress one or the first queued one
      const batches = data.optimization?.batches || [];
      const inProgress = batches.find((b) => b.batch_id === data.in_progress_batch_id);
      if (inProgress) {
        setActiveHeroBatch(inProgress);
      } else if (batches.length > 0) {
        setActiveHeroBatch((prev) => {
          const stillExists = batches.find((b) => b.batch_id === prev?.batch_id);
          return stillExists || batches[0];
        });
      } else {
        setActiveHeroBatch(null);
      }
    } catch (err) {
      console.warn('API error:', err);
      setError('Could not connect to BrewBatch backend on localhost:8000. Please ensure python backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentState();
    const interval = setInterval(loadCurrentState, 4000);
    return () => clearInterval(interval);
  }, [loadCurrentState]);

  const handleFairnessChange = async (seconds) => {
    try {
      await setFairnessThreshold(seconds);
      await loadCurrentState();
      showToast(`Fairness threshold set to ${seconds}s`);
    } catch (err) {
      showToast('Failed to update fairness threshold', 'error');
    }
  };

  const handleSwitchScenario = async (scenarioId) => {
    try {
      setLoading(true);
      await switchScenario(scenarioId);
      await loadCurrentState();
      showToast(`Scenario changed: ${scenarioId}`);
    } catch (err) {
      showToast('Failed to switch scenario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBatch = async (batchId) => {
    try {
      await startBatch(batchId);
      await loadCurrentState();
      showToast(`Batch ${batchId} started.`);
    } catch (err) {
      showToast('Failed to start batch', 'error');
    }
  };

  const handleCompleteBatch = async (batchId) => {
    try {
      const res = await completeBatch(batchId);
      await loadCurrentState();
      showToast(`Batch ${batchId} completed (${res.items_completed} drinks).`);
    } catch (err) {
      showToast('Failed to complete batch', 'error');
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      await addNewOrder(orderData);
      await loadCurrentState();
      showToast(`Added order for ${orderData.customer_name}.`);
    } catch (err) {
      showToast('Failed to add order', 'error');
    }
  };

  const handleReset = async () => {
    try {
      await resetSimulation();
      await loadCurrentState();
      showToast('Simulation reset.');
    } catch (err) {
      showToast('Failed to reset simulation', 'error');
    }
  };

  const batches = stateData?.optimization?.batches || [];
  const queuedBatches = batches.filter((b) => b.status !== 'completed');

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#2b1810] flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-[#eddcd2] rounded-2xl px-5 py-3 flex items-center gap-3 text-xs font-semibold text-[#2a170e] shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Error banner if backend disconnected */}
      {error && (
        <div className="bg-[#fff1f0] border-b border-[#ffccc7] text-[#a8071a] px-4 py-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#f5222d]" />
            <span className="font-medium">{error}</span>
          </div>
          <button 
            onClick={loadCurrentState}
            className="underline font-bold hover:text-black cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScenario={stateData?.current_scenario || 'morning_peak'}
        onSwitchScenario={handleSwitchScenario}
        scenarios={stateData?.scenarios || [
          { id: 'oat_rush', title: 'The 3x Oat Latte Scenario', count: 3 },
          { id: 'morning_peak', title: 'Morning Rush Hour', count: 12 },
          { id: 'mixed_variety', title: 'Mixed Specialty Wave', count: 7 }
        ]}
        onOpenNewOrder={() => setIsOrderModalOpen(true)}
        onOpenGeminiSettings={() => setIsGeminiSettingsOpen(true)}
        onReset={handleReset}
        loading={loading}
      />

      {/* Metrics Strip */}
      <MetricsBar
        optimization={stateData?.optimization}
        fairnessThresholdSec={stateData?.fairness_threshold_sec || 120}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'barista' && (
          <div className="space-y-6">
            {/* Gemini AI Barista Copilot Panel */}
            <BaristaCopilotPanel />

            {/* Hero Batch Card */}
            <HeroBatchCard
              batch={activeHeroBatch || queuedBatches[0]}
              isInProgress={activeHeroBatch?.batch_id === stateData?.in_progress_batch_id}
              onStart={handleStartBatch}
              onComplete={handleCompleteBatch}
              fairnessThresholdSec={stateData?.fairness_threshold_sec || 120}
              totalQueuedBatches={queuedBatches.length}
            />

            {/* Upcoming Batches Queue */}
            <BatchQueueList
              batches={queuedBatches}
              activeHeroId={activeHeroBatch?.batch_id}
              onSelectHero={(batch) => setActiveHeroBatch(batch)}
            />

            {/* Fairness Threshold Control */}
            <FairnessSlider
              value={stateData?.fairness_threshold_sec || 120}
              onChange={handleFairnessChange}
              disabled={loading}
            />
          </div>
        )}

        {activeTab === 'customer' && (
          <CustomerEtaBoard customerEtas={stateData?.customer_etas || []} />
        )}
      </main>

      {/* Order Modal with Gemini NLP */}
      <NewOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onAddOrder={handleAddOrder}
      />

      {/* Gemini Settings Modal */}
      <GeminiSettingsModal
        isOpen={isGeminiSettingsOpen}
        onClose={() => setIsGeminiSettingsOpen(false)}
      />

      {/* Warm Artisan Footer */}
      <footer className="border-t border-[#eddcd2] bg-white py-4 px-6 text-center text-xs text-[#8c7465]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#2a170e]">BrewBatch</span>
            <span>&bull;</span>
            <span>Intelligent Artisan Cafe Batching & Queue Engine</span>
          </div>
          <div className="text-[#a89282] font-medium">
            4 Free Gemini AI Agents &bull; Live Barista Console
          </div>
        </div>
      </footer>
    </div>
  );
}


