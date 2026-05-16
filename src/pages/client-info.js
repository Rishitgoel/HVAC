import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';
import { renderStepper } from '../components/stepper.js';
import { getSheet, updateSheet, getProject } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { getErrorMessage } from '../utils/auth.js';

let currentPid = null;
let currentSid = null;
let sheetData = null;

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
        ${renderStepper(1)}
      </div>
    </div>

    <!-- Form Canvas -->
    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 relative">
      <!-- Loading Overlay -->
      <div id="step-loading-overlay" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
        <span class="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        <p class="text-body-md text-on-surface-variant font-medium">Loading client & project details...</p>
      </div>

      <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
        <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
          <div>
            <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Client & Project Details</h3>
            <p class="text-body-sm text-on-surface-variant mt-1">Establish the foundational metadata for this estimation.</p>
          </div>
          <span id="status-badge" class="text-label-sm px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full border border-border-muted hidden md:inline-block">Loading...</span>
        </div>

        <form id="step-form" class="flex flex-col gap-6 md:gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Client Organization Name</label>
              <input type="text" id="clientName" disabled class="w-full rounded-DEFAULT border border-border-muted bg-surface-container-low px-4 py-2 text-body-md text-on-surface-variant cursor-not-allowed">
              <span class="text-xs text-on-surface-variant mt-1">Set at the project level</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Project Reference / Sheet ID</label>
              <input type="text" id="sheetId" disabled class="w-full rounded-DEFAULT border border-border-muted bg-surface-container-low px-4 py-2 text-data-mono text-on-surface-variant cursor-not-allowed">
            </div>
          </div>

          <div class="h-px bg-border-muted w-full"></div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface" for="cfmReq">CFM Requirement <span class="text-error">*</span></label>
              <input type="number" id="cfmReq" required min="0" placeholder="e.g., 5000" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface" for="roomName">Room Name / Location (Optional)</label>
              <input type="text" id="roomName" placeholder="e.g., Server Room A" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            </div>
          </div>
        </form>
      </div>

      <!-- Action Bar -->
      <div class="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
        <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
          Save as Draft
        </button>
        <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
          <span>Next: Architecture</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  </main>
`;

export const mount = async (hash) => {
  mountSidebar();
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

  const parts = hash.split('/');
  currentPid = parts[1];
  currentSid = parts[3];

  const cfmInput = document.getElementById('cfmReq');
  const roomInput = document.getElementById('roomName');
  const clientInput = document.getElementById('clientName');
  const sheetIdInput = document.getElementById('sheetId');
  
  try {
    const project = await getProject(currentPid);
    sheetData = await getSheet(currentPid, currentSid);
    
    if (project) clientInput.value = project.clientName || 'Unknown Client';
    if (sheetData) {
      sheetIdInput.value = sheetData.id;
      cfmInput.value = sheetData.clientInfo?.cfmRequirement || '';
      roomInput.value = sheetData.clientInfo?.roomName || '';
      
      const badge = document.getElementById('status-badge');
      if (badge) {
        badge.textContent = `${sheetData.status === 'published' ? 'Published' : 'Draft'} • By ${sheetData.ownerName || 'Unknown'}`;
      }
    }
  } catch (e) {
    showToast("Error loading data: " + getErrorMessage(e), "error");
  } finally {
    const loadingOverlay = document.getElementById('step-loading-overlay');
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
  }

  const saveForm = async () => {
    if (!cfmInput.checkValidity()) {
      cfmInput.reportValidity();
      return false;
    }
    
    const clientInfo = {
      cfmRequirement: parseFloat(cfmInput.value) || 0,
      roomName: roomInput.value
    };

    try {
      await updateSheet(currentPid, currentSid, { 
        clientInfo,
        currentStep: Math.max(sheetData.currentStep || 1, 2)
      });
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
      window.location.hash = `#project/${currentPid}/sheet/${currentSid}/step/2`;
    }
  });
};
