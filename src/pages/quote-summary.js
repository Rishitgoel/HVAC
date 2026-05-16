import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';
import { renderStepper } from '../components/stepper.js';
import { getSheet, updateSheet, getSettings, getProject } from '../utils/storage.js';
import { calculateTotals, formatCurrency } from '../utils/calculations.js';
import { showToast } from '../components/toast.js';
import { generatePDF } from '../utils/pdf-generator.js';
import { getErrorMessage } from '../utils/auth.js';

let currentPid = null;
let currentSid = null;
let sheetData = null;
let projectData = null;
let settings = null;
let totals = null;

export const render = () => `
  ${renderSidebar()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm print:hidden">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Summary</h2>
        </div>
        ${renderStepper(7)}
      </div>
    </div>

    <div class="w-full max-w-[800px] mx-auto px-4 py-6 md:px-8 md:py-8">
      
      <!-- Summary Card -->
      <div id="pdf-content" class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 md:p-10 shadow-sm relative">
        <!-- Logo for PDF (hidden normally, or shown styling differently) -->
        <div class="flex justify-between items-start mb-8 pb-6 border-b border-border-muted">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-3 mb-2 print:gap-2">
              <img src="/src/assets/logo.svg" alt="Nabhas Aircon" class="h-10 object-contain self-start">
              <span class="text-headline-md font-headline-md font-bold text-[#05412B] tracking-tight">NABHAS AIRCON</span>
            </div>
            <h1 class="text-headline-sm font-bold text-on-surface">HVAC Quotation</h1>
            <p class="text-body-sm text-on-surface-variant" id="quote-date">Date: ...</p>
          </div>
          <div class="flex flex-col items-end text-right">
            <h3 class="text-label-md font-bold text-on-surface" id="client-name-display">...</h3>
            <p class="text-body-sm text-on-surface-variant max-w-[200px]" id="project-title-display">...</p>
            <p class="text-xs text-outline mt-1 font-data-mono" id="sheet-id-display">Ref: ...</p>
            <p class="text-xs text-outline mt-1 font-data-mono" id="author-display">Prepared by: ...</p>
          </div>
        </div>

        <div class="flex items-center justify-between bg-surface-container-low p-4 rounded-lg mb-8 border border-border-muted">
          <div class="flex flex-col">
            <span class="text-label-sm text-on-surface-variant">Requirement</span>
            <span class="text-headline-sm font-bold text-primary" id="cfm-display">... CFM</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-label-sm text-on-surface-variant">Location</span>
            <span class="text-body-md font-medium text-on-surface" id="room-display">...</span>
          </div>
        </div>

        <table class="w-full text-left border-collapse mb-8">
          <thead>
            <tr class="border-b-2 border-border-muted text-label-sm text-on-surface-variant font-bold uppercase tracking-wide">
              <th class="py-3 px-2">Description</th>
              <th class="py-3 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody id="breakdown-body">
            <!-- Populated via JS -->
          </tbody>
        </table>

        <div class="flex flex-col items-end gap-2 border-t-2 border-border-muted pt-4 mb-12">
          <div class="flex justify-between w-[250px] text-body-md text-on-surface-variant">
            <span>Subtotal</span>
            <span class="font-data-mono" id="subtotal-display">...</span>
          </div>
          <div class="flex justify-between w-[250px] text-body-md text-on-surface-variant">
            <span id="tax-label">Tax (18%)</span>
            <span class="font-data-mono" id="tax-display">...</span>
          </div>
          <div class="flex justify-between w-[250px] text-headline-sm font-bold text-primary mt-2">
            <span>Total</span>
            <span class="font-data-mono" id="total-display">...</span>
          </div>
        </div>

        <div class="text-center text-xs text-on-surface-variant border-t border-border-muted pt-4 mt-8">
          <p>Nabhas Aircon Industrial Intelligence System</p>
          <p>This is a system generated quotation. Rates are valid for 30 days.</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm print:hidden">
        <a href="#project/${currentPid}/sheet/${currentSid}/step/6" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
          Back to Edit
        </a>
        <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
          <button id="download-pdf-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 md:py-2 border border-primary text-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
            <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Download PDF</span>
          </button>
          <button id="publish-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
            <span class="material-symbols-outlined text-[18px]">public</span>
            <span>Publish Quote</span>
          </button>
        </div>
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

  try {
    settings = await getSettings();
    sheetData = await getSheet(currentPid, currentSid);
    projectData = await getProject(currentPid);
    
    if (!sheetData || !projectData) {
      window.location.hash = '#dashboard';
      return;
    }

    totals = calculateTotals(sheetData, settings);
    
    // Populate UI
    document.getElementById('quote-date').textContent = `Date: ${new Date().toLocaleDateString('en-IN')}`;
    document.getElementById('client-name-display').textContent = projectData.clientName;
    document.getElementById('project-title-display').textContent = projectData.title;
    document.getElementById('sheet-id-display').textContent = `Ref: ${currentSid.split('-')[1] || currentSid}`;
    document.getElementById('author-display').textContent = `Prepared by: ${sheetData.ownerName || 'Unknown'}`;
    
    document.getElementById('cfm-display').textContent = sheetData.clientInfo?.cfmRequirement || 0;
    document.getElementById('room-display').textContent = sheetData.clientInfo?.roomName || 'General';

    const tbody = document.getElementById('breakdown-body');
    tbody.innerHTML = `
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Architecture & Casing</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.architecture)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Air Movement Systems</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.airMovement)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Thermodynamics (Coil & Pad)</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.thermodynamics)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Filtration Stages</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.filtration)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Labor & Installation</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.labor)}</td>
      </tr>
    `;

    document.getElementById('subtotal-display').textContent = formatCurrency(totals.subtotal);
    document.getElementById('tax-label').textContent = `Tax (${settings.taxRate || 18}%)`;
    document.getElementById('tax-display').textContent = formatCurrency(totals.tax);
    document.getElementById('total-display').textContent = formatCurrency(totals.total);

    // If already published, adjust UI
    const publishBtn = document.getElementById('publish-btn');
    if (sheetData.status === 'published') {
      publishBtn.disabled = true;
      publishBtn.classList.replace('bg-primary', 'bg-surface-variant');
      publishBtn.classList.replace('text-on-primary', 'text-on-surface-variant');
      publishBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span><span>Published</span>';
    }

  } catch (e) {
    showToast("Error generating summary: " + getErrorMessage(e), "error");
    console.error(e);
  }

  document.getElementById('publish-btn').addEventListener('click', async () => {
    if (sheetData.status === 'published') return;
    
    if (confirm('Are you sure you want to publish this quote? It will become visible to all users.')) {
      try {
        await updateSheet(currentPid, currentSid, { status: 'published' });
        showToast("Quote published successfully!");
        window.location.reload(); // Quick refresh to update state
      } catch (e) {
        showToast("Failed to publish quote: " + getErrorMessage(e), "error");
      }
    }
  });

  document.getElementById('download-pdf-btn').addEventListener('click', () => {
    generatePDF(projectData, sheetData);
  });
};
