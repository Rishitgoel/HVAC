import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';
import { renderStepper } from '../components/stepper.js';
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
    <!-- Header & Stepper -->
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>
        ${renderStepper(2)}
      </div>
    </div>

    <!-- Form Canvas -->
    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 relative items-start">
      <!-- Loading Overlay -->
      <div id="step-loading-overlay" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
        <span class="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        <p class="text-body-md text-on-surface-variant font-medium">Loading architecture specifications...</p>
      </div>

      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Architecture Specifications</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Define structural components and casing dimensions.</p>
            </div>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <!-- Casing & Structure -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">view_in_ar</span> Casing & Structure</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Aluminum Profile Weight</label>
                  <div class="relative">
                    <input type="number" id="alumWeight" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Puff Panels -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">layers</span> Puff Panels</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Total Length</label>
                  <div class="relative">
                    <input type="number" id="puffLength" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">m</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Total Width</label>
                  <div class="relative">
                    <input type="number" id="puffWidth" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">m</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Hardware & Fittings -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">hardware</span> Hardware & Fittings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pulley Assembly Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                    <input type="number" id="pulleyPrice" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Hardware Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                    <input type="number" id="hardwarePrice" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- GI Internal -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">developer_board</span> GI Internal Structure</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">GI Weight</label>
                  <div class="relative">
                    <input type="number" id="giWeight" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${currentPid}/sheet/${currentSid}/step/1" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>Next: Air Movement</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0">
        <!-- Rendered by JS -->
      </div>
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
    alum: document.getElementById('alumWeight'),
    puffL: document.getElementById('puffLength'),
    puffW: document.getElementById('puffWidth'),
    pulley: document.getElementById('pulleyPrice'),
    hardware: document.getElementById('hardwarePrice'),
    gi: document.getElementById('giWeight'),
  };
  
  try {
    settings = await getSettings();
    sheetData = await getSheet(currentPid, currentSid);
    
    if (sheetData && sheetData.architecture) {
      const arch = sheetData.architecture;
      inputs.alum.value = arch.aluminumWeight || '';
      inputs.puffL.value = arch.puffLength || '';
      inputs.puffW.value = arch.puffWidth || '';
      inputs.pulley.value = arch.pulleyPrice || '';
      inputs.hardware.value = arch.hardwarePrice || '';
      inputs.gi.value = arch.giWeight || '';
    }
  } catch (e) {
    showToast("Error loading data: " + getErrorMessage(e), "error");
  }

  const updateEstimate = () => {
    // build temp sheet state
    const tempSheet = { ...sheetData };
    tempSheet.architecture = {
      aluminumWeight: parseFloat(inputs.alum.value) || 0,
      puffLength: parseFloat(inputs.puffL.value) || 0,
      puffWidth: parseFloat(inputs.puffW.value) || 0,
      pulleyPrice: parseFloat(inputs.pulley.value) || 0,
      hardwarePrice: parseFloat(inputs.hardware.value) || 0,
      giWeight: parseFloat(inputs.gi.value) || 0
    };
    
    const totals = calculateTotals(tempSheet, settings);
    document.getElementById('estimate-container').innerHTML = renderRunningEstimate(totals);
  };

  // Bind input events to update estimate live
  document.querySelectorAll('.input-trigger').forEach(el => {
    el.addEventListener('input', updateEstimate);
  });

  // Initial render
  updateEstimate();

  const loadingOverlay = document.getElementById('step-loading-overlay');
  if (loadingOverlay) loadingOverlay.classList.add('hidden');

  const saveForm = async () => {
    const architecture = {
      aluminumWeight: parseFloat(inputs.alum.value) || 0,
      puffLength: parseFloat(inputs.puffL.value) || 0,
      puffWidth: parseFloat(inputs.puffW.value) || 0,
      pulleyPrice: parseFloat(inputs.pulley.value) || 0,
      hardwarePrice: parseFloat(inputs.hardware.value) || 0,
      giWeight: parseFloat(inputs.gi.value) || 0
    };

    try {
      await updateSheet(currentPid, currentSid, { 
        architecture,
        currentStep: Math.max(sheetData.currentStep || 1, 3)
      });
      sheetData.architecture = architecture;
      return true;
    } catch (e) {
      showToast("Failed to save draft: " + getErrorMessage(e), "error");
      return false;
    }
  };

  document.getElementById('save-draft-btn').addEventListener('click', async () => {
    if (await saveForm()) {
      showToast("Draft saved successfully");
    }
  });

  document.getElementById('next-btn').addEventListener('click', async () => {
    if (await saveForm()) {
      window.location.hash = `#project/${currentPid}/sheet/${currentSid}/step/3`;
    }
  });
};
