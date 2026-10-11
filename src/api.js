/**
 * API client for BrewBatch Backend with transparent fallback
 */

const BASE_URL = 'http://localhost:8000';

export async function fetchState() {
  const res = await fetch(`${BASE_URL}/api/state`);
  if (!res.ok) throw new Error('Failed to fetch state');
  return res.json();
}

export async function setFairnessThreshold(seconds) {
  const res = await fetch(`${BASE_URL}/api/settings/fairness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fairness_threshold_sec: seconds }),
  });
  if (!res.ok) throw new Error('Failed to update fairness threshold');
  return res.json();
}

export async function switchScenario(scenarioId) {
  const res = await fetch(`${BASE_URL}/api/scenario/${scenarioId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to switch scenario');
  return res.json();
}

export async function startBatch(batchId) {
  const res = await fetch(`${BASE_URL}/api/batches/${batchId}/start`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to start batch');
  return res.json();
}

export async function completeBatch(batchId) {
  const res = await fetch(`${BASE_URL}/api/batches/${batchId}/complete`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to complete batch');
  return res.json();
}

export async function addNewOrder(orderData) {
  const res = await fetch(`${BASE_URL}/api/orders/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to add order');
  return res.json();
}

export async function resetSimulation() {
  const res = await fetch(`${BASE_URL}/api/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset simulation');
  return res.json();
}

// ============================================================================
// GEMINI AI AGENT API CLIENTS
// ============================================================================

export async function fetchGeminiStatus() {
  const res = await fetch(`${BASE_URL}/api/gemini/status`);
  if (!res.ok) throw new Error('Failed to fetch Gemini status');
  return res.json();
}

export async function updateGeminiConfig(apiKey) {
  const res = await fetch(`${BASE_URL}/api/gemini/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) throw new Error('Failed to update Gemini config');
  return res.json();
}

export async function askBaristaCopilot(query = null) {
  const res = await fetch(`${BASE_URL}/api/gemini/barista-advisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Failed to query Barista Copilot');
  return res.json();
}

export async function parseOrderWithGemini(text) {
  const res = await fetch(`${BASE_URL}/api/gemini/parse-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to parse order with Gemini');
  return res.json();
}

export async function askCustomerConcierge(customerName, inquiry) {
  const res = await fetch(`${BASE_URL}/api/gemini/customer-concierge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_name: customerName, inquiry }),
  });
  if (!res.ok) throw new Error('Failed to ask Customer Concierge');
  return res.json();
}

export async function fetchShiftAudit() {
  const res = await fetch(`${BASE_URL}/api/gemini/shift-audit`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to fetch shift audit');
  return res.json();
}

