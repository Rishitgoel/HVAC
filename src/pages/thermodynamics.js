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
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full min-w-0">
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
        <div class="spinner spinner-md text-primary"></div>
        <p class="text-body-md text-on-surface-variant font-medium">Loading thermodynamics data...</p>
      </div>

      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Thermodynamics</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Cooling coils and evaporative pad configurations.</p>
            </div>
            <span id="unit-badge" class="text-label-sm px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-bold hidden md:inline-block">Loading Unit...</span>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <!-- Cooling Coil -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">ac_unit</span> Cooling Coil</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Finned Length</label>
                  <div class="relative">
                    <input type="number" id="coilLength" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">mm</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Finned Breadth</label>
                  <div class="relative">
                    <input type="number" id="coilBreadth" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">mm</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Rows</label>
                  <input type="number" id="coilRows" min="1" step="1" value="1" placeholder="1" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Evaporative Pad -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">water_drop</span> Evaporative Pad</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pad Type</label>
                  <select id="padType" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <option value="brown">Brown Cellulose Pad</option>
                    <option value="green">Green Anti-algae Pad</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Thickness</label>
                  <div class="relative">
                    <input type="number" id="padThickness" min="0" step="any" value="100" placeholder="100" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">mm</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pad Length (<span class="unit-label">ft</span>)</label>
                  <div class="relative">
                    <input type="number" id="padLength" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono unit-label">ft</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pad Width (<span class="unit-label">ft</span>)</label>
                  <div class="relative">
                    <input type="number" id="padWidth" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono unit-label">ft</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a id="prev-btn" href="#" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>Next: Filtration</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0 min-w-0"></div>
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
    coilL: document.getElementById('coilLength'),
    coilB: document.getElementById('coilBreadth'),
    coilR: document.getElementById('coilRows'),
    padType: document.getElementById('padType'),
    padT: document.getElementById('padThickness'),
    padL: document.getElementById('padLength'),
    padW: document.getElementById('padWidth'),
  };
  
  try {
    settings = await getSettings();
    sheetData = await getSheet(currentPid, currentSid);
    
    // Set UI unit labels based on settings
    const unitBadge = document.getElementById('unit-badge');
    if (settings.unitSystem === 'sqm') {
      unitBadge.textContent = 'Using Sq Meters';
      document.querySelectorAll('.unit-label').forEach(el => el.textContent = 'm');
    } else {
      unitBadge.textContent = 'Using Sq Feet';
      document.querySelectorAll('.unit-label').forEach(el => el.textContent = 'ft');
    }

    if (sheetData && sheetData.thermodynamics) {
      const thermo = sheetData.thermodynamics;
      inputs.coilL.value = thermo.coilLength || '';
      inputs.coilB.value = thermo.coilBreadth || '';
      inputs.coilR.value = thermo.coilRows || 1;
      inputs.padType.value = thermo.padType || 'brown';
      inputs.padT.value = thermo.padThickness || 100;
      inputs.padL.value = thermo.padLength || '';
      inputs.padW.value = thermo.padWidth || '';
    }
  } catch (e) {
    showToast("Error loading data: " + getErrorMessage(e), "error");
  }

  const updateEstimate = () => {
    const tempSheet = { ...sheetData };
    tempSheet.thermodynamics = {
      coilLength: parseFloat(inputs.coilL.value) || 0,
      coilBreadth: parseFloat(inputs.coilB.value) || 0,
      coilRows: parseInt(inputs.coilR.value) || 1,
      padType: inputs.padType.value,
      padThickness: parseFloat(inputs.padT.value) || 0,
      padLength: parseFloat(inputs.padL.value) || 0,
      padWidth: parseFloat(inputs.padW.value) || 0
    };
    
    const totals = calculateTotals(tempSheet, settings);
    document.getElementById('estimate-container').innerHTML = renderRunningEstimate(totals);
  };

  document.querySelectorAll('.input-trigger').forEach(el => {
    el.addEventListener('input', updateEstimate);
  });
  inputs.padType.addEventListener('change', updateEstimate);

  // Initial render
  updateEstimate();

  const loadingOverlay = document.getElementById('step-loading-overlay');
  if (loadingOverlay) loadingOverlay.classList.add('hidden');

  const prevBtn = document.getElementById('prev-btn');
  if (prevBtn) prevBtn.href = `#project/${currentPid}/sheet/${currentSid}/step/3`;

  const saveForm = async () => {
    const thermodynamics = {
      coilLength: parseFloat(inputs.coilL.value) || 0,
      coilBreadth: parseFloat(inputs.coilB.value) || 0,
      coilRows: parseInt(inputs.coilR.value) || 1,
      padType: inputs.padType.value,
      padThickness: parseFloat(inputs.padT.value) || 0,
      padLength: parseFloat(inputs.padL.value) || 0,
      padWidth: parseFloat(inputs.padW.value) || 0
    };

    try {
      await updateSheet(currentPid, currentSid, { 
        thermodynamics,
        currentStep: Math.max(sheetData.currentStep || 1, 5)
      });
      sheetData.thermodynamics = thermodynamics;
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
      window.location.hash = `#project/${currentPid}/sheet/${currentSid}/step/5`;
    }
  });
};
