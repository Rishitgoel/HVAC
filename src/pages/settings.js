import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';
import { getSettings, saveSettings } from '../utils/storage.js';
import { isAdmin, getErrorMessage } from '../utils/auth.js';
import { showToast } from '../components/toast.js';

// Single source of truth for settings field IDs
const SETTINGS_FIELDS = [
  'unitSystem', 'taxRate', 'aluminumRate', 'giRate', 'puffPanelRate',
  'forwardFanPrice', 'backwardFanPrice', 'plugFanPrice', 'ecFanPrice',
  'coilRate', 'brownPadRate', 'greenPadRate',
  'preFilterPrice', 'fineFilterPrice', 'hepaFilterPrice'
];

export const render = () => `
  ${renderSidebar('#settings')}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <!-- Header -->
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm flex items-center px-4 py-4 md:px-8 md:py-6">
      <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
      <div class="flex-1 flex justify-between items-center">
        <h2 class="text-headline-md md:text-headline-lg font-headline-lg text-on-surface">Global Settings</h2>
        <button id="save-settings-btn" class="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-DEFAULT hover:bg-primary-container transition-colors shadow-sm text-sm font-label-md hidden">
          <span class="material-symbols-outlined text-[18px]">save</span>
          <span class="hidden md:inline">Save Changes</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-[1000px] mx-auto px-4 py-6 md:px-8 md:py-8">
      
      <div id="read-only-banner" class="hidden mb-6 p-4 bg-surface-container-high text-on-surface-variant rounded-xl border border-border-muted flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">info</span>
        <span class="text-body-md">You are viewing the global rates. Only administrators can modify these settings.</span>
      </div>

      <form id="settings-form" class="flex flex-col gap-8">
        
        <!-- General Preferences -->
        <section class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 shadow-sm">
          <h3 class="text-headline-sm font-bold text-on-surface mb-6 border-b border-border-muted pb-2">General Preferences</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Measurement Unit System</label>
              <select id="unitSystem" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option value="sqft">Square Feet (sq.ft)</option>
                <option value="sqm">Square Meters (sq.m)</option>
              </select>
              <p class="text-xs text-on-surface-variant mt-1">Changing this will update labels across all estimation sheets.</p>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Default Tax Rate (%)</label>
              <input type="number" id="taxRate" step="0.1" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            </div>
          </div>
        </section>

        <!-- Architecture Rates -->
        <section class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 shadow-sm">
          <h3 class="text-headline-sm font-bold text-on-surface mb-6 border-b border-border-muted pb-2">Architecture & Structure Rates</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Aluminum Rate (per kg)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="aluminumRate" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">GI Rate (per kg)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="giRate" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Puff Panel Rate (per <span class="unit-label">sq.ft</span>)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="puffPanelRate" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
          </div>
        </section>

        <!-- Fan Rates -->
        <section class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 shadow-sm">
          <h3 class="text-headline-sm font-bold text-on-surface mb-6 border-b border-border-muted pb-2">Air Movement Base Rates</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Forward Curved Fan (per unit)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="forwardFanPrice" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Backward Curved Fan (per unit)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="backwardFanPrice" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Plug Fan (per unit)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="plugFanPrice" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">EC Fan (per unit)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="ecFanPrice" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
          </div>
        </section>

        <!-- Thermodynamics Rates -->
        <section class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 shadow-sm">
          <h3 class="text-headline-sm font-bold text-on-surface mb-6 border-b border-border-muted pb-2">Thermodynamics Rates</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Cooling Coil (per <span class="unit-label">sq.ft</span>)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="coilRate" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Brown Pad (per <span class="unit-label">sq.ft</span>)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="brownPadRate" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Green Pad (per <span class="unit-label">sq.ft</span>)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="greenPadRate" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
          </div>
        </section>

        <!-- Filtration Rates -->
        <section class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 shadow-sm">
          <h3 class="text-headline-sm font-bold text-on-surface mb-6 border-b border-border-muted pb-2">Filtration Rates</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Pre Filter (per unit)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="preFilterPrice" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Fine Filter (per unit)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="fineFilterPrice" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">HEPA Filter (per unit)</label>
              <div class="relative"><span class="absolute left-3 top-2 text-on-surface-variant">₹</span><input type="number" id="hepaFilterPrice" class="w-full rounded-DEFAULT border border-outline-variant bg-surface pl-8 pr-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"></div>
            </div>
          </div>
        </section>

      </form>
    </div>
  </main>
`;

export const mount = async () => {
  mountSidebar('#settings');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

  const admin = isAdmin();
  const form = document.getElementById('settings-form');
  const saveBtn = document.getElementById('save-settings-btn');
  const banner = document.getElementById('read-only-banner');

  if (admin) {
    saveBtn.classList.remove('hidden');
  } else {
    banner.classList.remove('hidden');
    // Disable all inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(el => {
      el.disabled = true;
      el.classList.add('bg-surface-container-low', 'text-on-surface-variant', 'cursor-not-allowed');
    });
  }

  // Load existing settings
  try {
    const settings = await getSettings();

    SETTINGS_FIELDS.forEach(f => {
      const el = document.getElementById(f);
      if (el && settings[f] !== undefined) {
        el.value = settings[f];
      }
    });
    
    // Initial label update
    updateUnitLabels(settings.unitSystem || 'sqft');

  } catch (e) {
    showToast("Error loading settings: " + getErrorMessage(e), "error");
  }

  // Dynamic unit label update
  const unitSelect = document.getElementById('unitSystem');
  unitSelect.addEventListener('change', (e) => updateUnitLabels(e.target.value));

  function updateUnitLabels(sys) {
    const txt = sys === 'sqm' ? 'sq.m' : 'sq.ft';
    document.querySelectorAll('.unit-label').forEach(el => {
      el.textContent = txt;
    });
  }

  // Save handling
  if (admin) {
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<div class="spinner spinner-sm"></div>';
      
      const newSettings = {};

      SETTINGS_FIELDS.forEach(f => {
        const val = document.getElementById(f).value;
        newSettings[f] = f === 'unitSystem' ? val : (parseFloat(val) || 0);
      });

      try {
        await saveSettings(newSettings);
        showToast("Settings saved successfully!");
      } catch (e) {
        showToast("Error saving settings: " + getErrorMessage(e), "error");
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span><span class="hidden md:inline">Save Changes</span>';
      }
    });
  }
};
