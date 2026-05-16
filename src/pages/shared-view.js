import { getSheet, getProject, getSettings } from '../utils/storage.js';
import { calculateTotals, formatCurrency } from '../utils/calculations.js';
import { getCurrentUser, getErrorMessage } from '../utils/auth.js';

export const render = () => `
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full min-h-screen">
    <!-- Read Only Header -->
    <div class="w-full bg-primary text-on-primary border-b border-border-muted sticky top-0 z-10 shadow-sm print:hidden">
      <div class="max-w-[1000px] mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img src="/logo.svg" alt="Nabhas Aircon" class="h-8 object-contain filter invert brightness-0">
          <span class="font-bold text-label-md hidden md:inline">Shared Quotation Viewer</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-label-sm bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded-full font-bold">READ ONLY</span>
          <button id="login-btn" class="text-label-sm font-bold hover:underline">Sign In / Dashboard</button>
        </div>
      </div>
    </div>

    <div class="w-full max-w-[800px] mx-auto px-4 py-6 md:px-8 md:py-8">
      
      <!-- Summary Card -->
      <div id="pdf-content" class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 md:p-10 shadow-sm relative">
        <div class="flex justify-between items-start mb-8 pb-6 border-b border-border-muted">
          <div class="flex flex-col gap-1">
            <img src="/logo.svg" alt="Nabhas Aircon" class="h-10 object-contain self-start mb-2">
            <h1 class="text-headline-sm font-bold text-on-surface">HVAC Quotation</h1>
            <p class="text-body-sm text-on-surface-variant" id="quote-date">Date: ...</p>
          </div>
          <div class="flex flex-col items-end text-right">
            <h3 class="text-label-md font-bold text-on-surface" id="client-name-display">...</h3>
            <p class="text-body-sm text-on-surface-variant max-w-[200px]" id="project-title-display">...</p>
            <p class="text-xs text-outline mt-1 font-data-mono" id="sheet-id-display">Ref: ...</p>
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
      <div class="mt-6 md:mt-8 flex justify-end gap-4 print:hidden">
        <button id="download-pdf-btn" class="flex justify-center items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
          <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  </main>
`;

export const mount = async (hash) => {
  const parts = hash.split('/');
  const currentPid = parts[1];
  const currentSid = parts[2];

  document.getElementById('login-btn').addEventListener('click', () => {
    const user = getCurrentUser();
    if (user) {
      window.location.hash = '#dashboard';
    } else {
      window.location.hash = '#login';
    }
  });

  document.getElementById('download-pdf-btn').addEventListener('click', () => {
    window.print();
  });

  try {
    const settings = await getSettings();
    const sheetData = await getSheet(currentPid, currentSid);
    const projectData = await getProject(currentPid);
    
    if (!sheetData || !projectData) {
      document.getElementById('pdf-content').innerHTML = '<div class="p-8 text-center text-error font-headline-md">Quote not found or you do not have permission to view it.</div>';
      return;
    }

    if (sheetData.status !== 'published' && (!getCurrentUser() || (sheetData.ownerUid !== getCurrentUser().uid && !isAdmin()))) {
       document.getElementById('pdf-content').innerHTML = '<div class="p-8 text-center text-error font-headline-md">This quote is not public.</div>';
       return;
    }

    const totals = calculateTotals(sheetData, settings);
    
    // Populate UI
    document.getElementById('quote-date').textContent = `Date: ${new Date(sheetData.updatedAt?.toDate() || new Date()).toLocaleDateString('en-IN')}`;
    document.getElementById('client-name-display').textContent = projectData.clientName;
    document.getElementById('project-title-display').textContent = projectData.title;
    document.getElementById('sheet-id-display').textContent = `Ref: ${currentSid.split('-')[1] || currentSid}`;
    
    document.getElementById('cfm-display').textContent = sheetData.clientInfo?.cfmRequirement || 0;
    document.getElementById('room-display').textContent = sheetData.clientInfo?.roomName || 'General';

    const tbody = document.getElementById('breakdown-body');
    tbody.innerHTML = `
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Architecture & Casing</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.architecture)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Air Movement Systems</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.airMovement)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Thermodynamics (Coil & Pad)</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.thermodynamics)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Filtration Stages</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.filtration)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Labor & Installation</td>
        <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(totals.labor)}</td>
      </tr>
    `;

    document.getElementById('subtotal-display').textContent = formatCurrency(totals.subtotal);
    document.getElementById('tax-label').textContent = `Tax (${settings.taxRate || 18}%)`;
    document.getElementById('tax-display').textContent = formatCurrency(totals.tax);
    document.getElementById('total-display').textContent = formatCurrency(totals.total);

  } catch (e) {
    console.error(e);
    document.getElementById('pdf-content').innerHTML = '<div class="p-8 text-center text-error font-headline-md">Error loading quote: ' + getErrorMessage(e) + '</div>';
  }
};
