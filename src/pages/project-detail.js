import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';
import { getProject, getSheets, createSheet, deleteSheet } from '../utils/storage.js';
import { getCurrentUser, isAdmin, getErrorMessage } from '../utils/auth.js';
import { exportProjectToZip } from '../utils/zip-export.js';
import { showToast } from '../components/toast.js';

let currentPid = null;

export const render = () => `
  ${renderSidebar('#dashboard')}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <!-- Header -->
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm flex items-center px-4 py-4 md:px-8 md:py-6">
      <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
      <div class="flex-1 flex justify-between items-center">
        <div class="flex flex-col">
          <div class="flex items-center gap-2 mb-1">
            <a href="#dashboard" class="text-on-surface-variant hover:text-primary transition-colors flex items-center text-sm">
              <span class="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
              Projects
            </a>
            <span class="text-on-surface-variant text-sm">/</span>
            <span class="text-on-surface-variant text-sm truncate max-w-[150px] md:max-w-none" id="header-client-name">...</span>
          </div>
          <h2 id="header-proj-title" class="text-headline-md md:text-headline-lg font-headline-lg text-on-surface truncate max-w-[250px] md:max-w-none">Loading...</h2>
        </div>
        <div class="flex items-center gap-2 md:gap-3">
          <button id="export-zip-btn" class="hidden md:flex items-center gap-2 bg-surface-container-high text-primary px-4 py-2 rounded-DEFAULT hover:bg-surface-container transition-colors shadow-sm text-sm font-label-md">
            <span class="material-symbols-outlined text-[18px]">folder_zip</span>
            <span>Export ZIP</span>
          </button>
          <button id="new-sheet-btn" class="flex items-center gap-2 bg-primary text-on-primary px-3 md:px-4 py-2 rounded-DEFAULT hover:bg-primary-container transition-colors shadow-sm text-sm font-label-md">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span class="hidden md:inline">New Sheet</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8">
      
      <!-- Filters -->
      <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <button class="filter-btn active px-4 py-1.5 rounded-full text-label-sm font-medium border transition-colors bg-surface-variant border-border-muted text-on-surface-variant" data-filter="all">All Sheets</button>
        <button class="filter-btn px-4 py-1.5 rounded-full text-label-sm font-medium border border-transparent transition-colors text-on-surface-variant hover:bg-surface-container" data-filter="published">Published</button>
        <button class="filter-btn px-4 py-1.5 rounded-full text-label-sm font-medium border border-transparent transition-colors text-on-surface-variant hover:bg-surface-container" data-filter="draft">My Drafts</button>
      </div>

      <div id="sheets-list" class="flex flex-col gap-4">
        <!-- Sheets loaded here -->
        <div class="flex justify-center py-12">
          <span class="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
        </div>
      </div>
    </div>
  </main>

  <!-- New Sheet Modal -->
  <div id="new-sheet-modal" class="fixed inset-0 bg-on-surface/50 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md shadow-lg transform transition-all">
      <h3 class="text-headline-sm font-bold text-on-surface mb-4">Create New HVAC Sheet</h3>
      <form id="new-sheet-form" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-label-sm font-medium text-on-surface" for="sheet-title">Sheet Title</label>
          <input type="text" id="sheet-title" required placeholder="e.g., Server Room AHU-1" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" id="cancel-sheet-btn" class="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-DEFAULT font-label-md">Cancel</button>
          <button type="submit" id="create-sheet-submit" class="px-4 py-2 bg-primary text-on-primary rounded-DEFAULT hover:bg-primary-container font-label-md flex items-center justify-center min-w-[80px]">Create</button>
        </div>
      </form>
    </div>
  </div>
`;

export const mount = async (hash) => {
  mountSidebar();
  
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

  // Parse PID from hash e.g., #project/123
  currentPid = hash.split('/')[1];
  if (!currentPid) {
    window.location.hash = '#dashboard';
    return;
  }

  const list = document.getElementById('sheets-list');
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();
  
  let allSheets = [];
  let currentFilter = 'all';

  // Modal logic
  const modal = document.getElementById('new-sheet-modal');
  const form = document.getElementById('new-sheet-form');
  const cancelBtn = document.getElementById('cancel-sheet-btn');
  const mainBtn = document.getElementById('new-sheet-btn');
  const submitBtn = document.getElementById('create-sheet-submit');

  const openModal = () => {
    modal.classList.remove('hidden');
    document.getElementById('sheet-title').focus();
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    form.reset();
  };

  mainBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>';
    
    try {
      const title = document.getElementById('sheet-title').value;
      const sid = await createSheet(currentPid, title, user.uid, user.name || user.email);
      closeModal();
      window.location.hash = `#project/${currentPid}/sheet/${sid}/step/1`;
    } catch (error) {
      showToast("Error creating sheet: " + getErrorMessage(error), "error");
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create';
    }
  });

  const renderSheets = () => {
    let filtered = allSheets;
    if (currentFilter === 'published') {
      filtered = allSheets.filter(s => s.status === 'published');
    } else if (currentFilter === 'draft') {
      filtered = allSheets.filter(s => s.status === 'draft' && s.ownerUid === user.uid);
    }

    // Filter out drafts owned by others (if they somehow sneaked in, though rules prevent it)
    filtered = filtered.filter(s => s.status === 'published' || s.ownerUid === user.uid || userIsAdmin);

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 text-on-surface-variant border-2 border-dashed border-border-muted rounded-xl bg-surface-container-lowest">
          <span class="material-symbols-outlined text-[48px] mb-4 opacity-50">article</span>
          <h3 class="text-headline-sm font-bold mb-2">No sheets found</h3>
          <p class="text-body-sm text-center max-w-sm mb-6">Create a sheet to start estimating HVAC costs.</p>
          <button class="new-sheet-trigger bg-surface-container-high text-primary px-4 py-2 rounded-DEFAULT hover:bg-surface-container transition-colors font-label-md">
            New Sheet
          </button>
        </div>
      `;
      const trigger = list.querySelector('.new-sheet-trigger');
      if(trigger) trigger.addEventListener('click', openModal);
      return;
    }

    list.innerHTML = filtered.map(s => {
      const isOwner = s.ownerUid === user.uid;
      const canEdit = isOwner || userIsAdmin;
      const date = s.updatedAt ? new Date(s.updatedAt.toDate()).toLocaleDateString() : 'Just now';
      const statusClass = s.status === 'published' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-variant text-on-surface-variant';
      
      // Determine link: if canEdit go to currentStep, else go to summary (read only)
      const linkTarget = canEdit ? `#project/${currentPid}/sheet/${s.id}/step/${s.currentStep || 1}` : `#project/${currentPid}/sheet/${s.id}/step/7`;

      return `
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <h3 class="text-headline-sm font-bold text-on-surface truncate"><a href="${linkTarget}" class="hover:text-primary transition-colors">${s.title}</a></h3>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusClass}">${s.status}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-on-surface-variant">
              <div class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">person</span> ${s.ownerName}</div>
              <div class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">calendar_today</span> ${date}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-border-muted">
            ${(isOwner || userIsAdmin) ? `
              <button class="delete-sheet-btn text-on-surface-variant hover:text-error hover:bg-error-container p-2 rounded-full transition-colors flex items-center justify-center" data-id="${s.id}" title="Delete Sheet">
                <span class="material-symbols-outlined text-[20px]">delete</span>
              </button>
            ` : ''}
            <a href="${linkTarget}" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-container text-primary font-label-md px-4 py-2 rounded-DEFAULT hover:bg-surface-container-high transition-colors">
              <span>${canEdit ? 'Edit' : 'View'}</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      `;
    }).join('');

    // Attach delete listeners
    list.querySelectorAll('.delete-sheet-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sid = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this sheet? This action cannot be undone.')) {
          try {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>';
            btn.disabled = true;
            await deleteSheet(currentPid, sid);
            await loadData();
          } catch (err) {
            console.error("Error deleting sheet:", err);
            showToast("Failed to delete sheet: " + getErrorMessage(err), "error");
            btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">delete</span>';
            btn.disabled = false;
          }
        }
      });
    });
  };

  const loadData = async () => {
    try {
      const project = await getProject(currentPid);
      if (!project) {
        window.location.hash = '#dashboard';
        return;
      }
      document.getElementById('header-proj-title').textContent = project.title;
      document.getElementById('header-client-name').textContent = project.clientName;

      allSheets = await getSheets(currentPid);
      renderSheets();
    } catch (error) {
      list.innerHTML = `<div class="text-error p-4">Error loading project: ${getErrorMessage(error)}</div>`;
    }
  };

  await loadData();

  // Filter logic
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-surface-variant', 'border-border-muted');
        b.classList.add('border-transparent');
      });
      btn.classList.add('active', 'bg-surface-variant', 'border-border-muted');
      btn.classList.remove('border-transparent');
      currentFilter = btn.getAttribute('data-filter');
      renderSheets();
    });
  });


  // Export ZIP
  const exportBtn = document.getElementById('export-zip-btn');
  exportBtn.addEventListener('click', async () => {
    exportBtn.disabled = true;
    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>Exporting...</span>';
    try {
      await exportProjectToZip(currentPid);
      showToast("ZIP Export successful");
    } catch (e) {
      showToast("Error exporting ZIP: " + getErrorMessage(e), "error");
    } finally {
      exportBtn.disabled = false;
      exportBtn.innerHTML = originalHTML;
    }
  });
};
