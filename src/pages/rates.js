import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';

import { getSheet, updateSheet, getSettings } from '../utils/storage.js';
import { calculateTotals } from '../utils/calculations.js';
import { renderRunningEstimate } from '../components/running-estimate.js';
import { showToast } from '../components/toast.js';
import { getErrorMessage } from '../utils/auth.js';

let currentPid = null;
let currentSid = null;
let sheetData = null;
let settings = null;

export const render = () => `
  ${renderSidebar()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>

      </div>
    </div>

    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 relative items-start">
      <!-- Loading Overlay -->
      <div id="step-loading-overlay" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
        <span class="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        <p class="text-body-md text-on-surface-variant font-medium">Loading labor & implementation costs...</p>
      </div>

      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Labor & Implementation</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Manual overrides and variable costs.</p>
            </div>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              <div class="flex flex-col gap-1">
                <label class="text-label-sm font-medium text-on-surface">Labor & Installation Cost</label>
                <div class="relative">
                  <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                  <input type="number" id="laborCost" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-label-sm font-medium text-on-surface">Electrical & Wiring Cost</label>
                <div class="relative">
                  <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                  <input type="number" id="elecCost" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>

            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${currentPid}/sheet/${currentSid}/step/5" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>View Summary</span>
              <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0"></div>
    </div>
  </main>
`;

export const mount = async (hash) => {
  mountSidebar(hash);
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

  const parts = hash.split('/');
  currentPid = parts[1];
  currentSid = parts[3];

  const inputs = {
    labor: document.getElementById('laborCost'),
    elec: document.getElementById('elecCost')
  };
  
  try {
    settings = await getSettings();
    sheetData = await getSheet(currentPid, currentSid);
    
    if (sheetData && sheetData.rates) {
      inputs.labor.value = sheetData.rates.laborCost || '';
      inputs.elec.value = sheetData.rates.electricityCost || '';
    }
  } catch (e) {
    showToast("Error loading data: " + getErrorMessage(e), "error");
  }

  const updateEstimate = () => {
    const tempSheet = { ...sheetData };
    tempSheet.rates = {
      laborCost: parseFloat(inputs.labor.value) || 0,
      electricityCost: parseFloat(inputs.elec.value) || 0
    };
    
    const totals = calculateTotals(tempSheet, settings);
    document.getElementById('estimate-container').innerHTML = renderRunningEstimate(totals);
  };

  document.querySelectorAll('.input-trigger').forEach(el => {
    el.addEventListener('input', updateEstimate);
  });

  // Initial render
  updateEstimate();

  const loadingOverlay = document.getElementById('step-loading-overlay');
  if (loadingOverlay) loadingOverlay.classList.add('hidden');

  const saveForm = async () => {
    const rates = {
      laborCost: parseFloat(inputs.labor.value) || 0,
      electricityCost: parseFloat(inputs.elec.value) || 0
    };

    try {
      await updateSheet(currentPid, currentSid, { 
        rates,
        currentStep: Math.max(sheetData.currentStep || 1, 7)
      });
      sheetData.rates = rates;
      return true;
    } catch (e) {
      showToast("Failed to save draft: " + getErrorMessage(e), "error");
      return false;
    }
  };

  document.getElementById('save-draft-btn').addEventListener('click', async () => {
    if (await saveForm()) showToast("Draft saved successfully");
  });

  document.getElementById('next-btn').addEventListener('click', async () => {
    if (await saveForm()) {
      window.location.hash = `#project/${currentPid}/sheet/${currentSid}/step/7`;
    }
  });
};
