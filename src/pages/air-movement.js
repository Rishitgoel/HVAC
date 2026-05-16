import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';
import { renderStepper } from '../components/stepper.js';
import { getSheet, updateSheet, getSettings } from '../utils/storage.js';
import { calculateTotals, formatCurrency } from '../utils/calculations.js';
import { renderRunningEstimate } from '../components/running-estimate.js';
import { showToast } from '../components/toast.js';

let currentPid = null;
let currentSid = null;
let sheetData = null;
let settings = null;
let fansList = [];

export const render = () => `
  ${renderSidebar()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>
        ${renderStepper(3)}
      </div>
    </div>

    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 relative items-start">
      
      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Air Movement Systems</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Configure fans and motor requirements.</p>
            </div>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <!-- Fans -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-label-md font-bold text-primary flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">mode_fan</span> Fan Configuration</h4>
                <button type="button" id="add-fan-btn" class="text-primary hover:bg-surface-container px-3 py-1.5 rounded-DEFAULT text-sm font-label-md flex items-center gap-1 transition-colors border border-primary">
                  <span class="material-symbols-outlined text-[16px]">add</span> Add Fan
                </button>
              </div>
              
              <div id="fans-container" class="flex flex-col gap-4">
                <!-- Fan rows inserted here -->
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Motor -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">settings</span> Motor Requirements</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Motor Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                    <input type="number" id="motorPrice" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${currentPid}/sheet/${currentSid}/step/2" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>Next: Thermodynamics</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
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

  const motorInput = document.getElementById('motorPrice');
  const fansContainer = document.getElementById('fans-container');
  
  try {
    settings = await getSettings();
    sheetData = await getSheet(currentPid, currentSid);
    
    if (sheetData && sheetData.airMovement) {
      fansList = sheetData.airMovement.fans || [];
      motorInput.value = sheetData.airMovement.motorPrice || '';
    }
  } catch (e) {
    showToast("Error loading data", "error");
  }

  const renderFans = () => {
    if (fansList.length === 0) {
      fansContainer.innerHTML = `<div class="text-sm text-on-surface-variant p-4 bg-surface-container-low rounded-DEFAULT border border-dashed border-border-muted text-center">No fans added. Click "Add Fan" to configure.</div>`;
      return;
    }

    fansContainer.innerHTML = fansList.map((fan, index) => {
      const typePrice = settings[`${fan.type}FanPrice`] || 0;
      const lineTotal = (fan.quantity || 0) * typePrice;

      return `
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-end p-4 border border-border-muted rounded-DEFAULT bg-surface-container-lowest">
          <div class="flex-1 w-full flex flex-col gap-1">
            <label class="text-label-sm font-medium text-on-surface">Fan Type</label>
            <select class="fan-type w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger" data-index="${index}">
              <option value="forward" ${fan.type === 'forward' ? 'selected' : ''}>Forward Curved</option>
              <option value="backward" ${fan.type === 'backward' ? 'selected' : ''}>Backward Curved</option>
              <option value="plug" ${fan.type === 'plug' ? 'selected' : ''}>Plug Fan</option>
              <option value="ec" ${fan.type === 'ec' ? 'selected' : ''}>EC Fan</option>
            </select>
          </div>
          <div class="w-full md:w-32 flex flex-col gap-1">
            <label class="text-label-sm font-medium text-on-surface">Quantity</label>
            <input type="number" min="1" value="${fan.quantity}" class="fan-qty w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger" data-index="${index}">
          </div>
          <div class="w-full md:w-32 flex flex-col gap-1">
            <label class="text-label-sm font-medium text-on-surface">Unit Price</label>
            <div class="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-DEFAULT font-data-mono">${formatCurrency(typePrice)}</div>
          </div>
          <button type="button" class="remove-fan text-error hover:bg-error-container p-2 rounded-DEFAULT transition-colors w-full md:w-auto mt-2 md:mt-0 flex justify-center items-center" data-index="${index}">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      `;
    }).join('');

    // Rebind events
    fansContainer.querySelectorAll('.fan-type').forEach(el => {
      el.addEventListener('change', (e) => {
        fansList[e.target.dataset.index].type = e.target.value;
        renderFans();
        updateEstimate();
      });
    });
    fansContainer.querySelectorAll('.fan-qty').forEach(el => {
      el.addEventListener('input', (e) => {
        fansList[e.target.dataset.index].quantity = parseInt(e.target.value) || 0;
        updateEstimate();
      });
    });
    fansContainer.querySelectorAll('.remove-fan').forEach(el => {
      el.addEventListener('click', (e) => {
        fansList.splice(e.currentTarget.dataset.index, 1);
        renderFans();
        updateEstimate();
      });
    });
  };

  const updateEstimate = () => {
    const tempSheet = { ...sheetData };
    tempSheet.airMovement = {
      fans: fansList,
      motorPrice: parseFloat(motorInput.value) || 0
    };
    
    const totals = calculateTotals(tempSheet, settings);
    document.getElementById('estimate-container').innerHTML = renderRunningEstimate(totals);
  };

  document.getElementById('add-fan-btn').addEventListener('click', () => {
    fansList.push({ type: 'forward', quantity: 1 });
    renderFans();
    updateEstimate();
  });

  motorInput.addEventListener('input', updateEstimate);

  // Initial render
  renderFans();
  updateEstimate();

  const saveForm = async () => {
    const airMovement = {
      fans: fansList,
      motorPrice: parseFloat(motorInput.value) || 0
    };

    try {
      await updateSheet(currentPid, currentSid, { 
        airMovement,
        currentStep: Math.max(sheetData.currentStep || 1, 4)
      });
      sheetData.airMovement = airMovement;
      return true;
    } catch (e) {
      showToast("Failed to save draft", "error");
      return false;
    }
  };

  document.getElementById('save-draft-btn').addEventListener('click', async () => {
    if (await saveForm()) showToast("Draft saved successfully");
  });

  document.getElementById('next-btn').addEventListener('click', async () => {
    if (await saveForm()) {
      window.location.hash = `#project/${currentPid}/sheet/${currentSid}/step/4`;
    }
  });
};
