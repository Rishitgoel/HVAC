import { getCurrentUser, isAdmin, signOut } from '../utils/auth.js';
import { getPendingUserCount } from '../utils/storage.js';

export const renderSidebar = (currentHash) => {
  const user = getCurrentUser();
  const admin = isAdmin();
  
  // Extract base route
  const hash = currentHash || window.location.hash || '#dashboard';
  
  const isDashboard = hash === '#dashboard' || hash === '';
  const isSettings = hash === '#settings';
  const isUsers = hash === '#users';
  const isProject = hash.startsWith('#project') && !hash.includes('/step/');
  const isWizard = hash.includes('/step/');

  let navItems = '';

  if (isWizard) {
    // Wizard mode: extract pid and sid
    const parts = hash.split('/');
    const pid = parts[1];
    const sid = parts[3];
    const step = parts[5]; // might be undefined if just showing summary
    
    const steps = [
      { id: 1, label: 'Client Info', icon: 'person', path: `#project/${pid}/sheet/${sid}/step/1` },
      { id: 2, label: 'Architecture', icon: 'architecture', path: `#project/${pid}/sheet/${sid}/step/2` },
      { id: 3, label: 'Air Movement', icon: 'airwave', path: `#project/${pid}/sheet/${sid}/step/3` },
      { id: 4, label: 'Thermodynamics', icon: 'thermostat', path: `#project/${pid}/sheet/${sid}/step/4` },
      { id: 5, label: 'Filtration', icon: 'filter_alt', path: `#project/${pid}/sheet/${sid}/step/5` },
      { id: 6, label: 'Rates', icon: 'payments', path: `#project/${pid}/sheet/${sid}/step/6` },
      { id: 7, label: 'Quote Summary', icon: 'description', path: `#project/${pid}/sheet/${sid}/step/7` }
    ];

    navItems = `
      <a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary transition-colors duration-200 rounded-DEFAULT mb-4" href="#project/${pid}">
        <span class="material-symbols-outlined">arrow_back</span>
        <span class="text-label-md font-label-md">Back to Project</span>
      </a>
      <div class="text-xs uppercase text-outline font-bold px-4 mb-2">Quote Steps</div>
      ${steps.map(s => {
        const isActive = s.path === hash;
        const currentStepNum = parseInt(step) || 7;
        const isPast = s.id < currentStepNum;
        
        let iconHtml;
        if (isPast) {
          iconHtml = `<span class="material-symbols-outlined text-[18px] text-primary">check_circle</span>`;
        } else if (isActive) {
          iconHtml = `<div class="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">${s.id}</div>`;
        } else {
          iconHtml = `<div class="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs border border-border-muted">${s.id}</div>`;
        }

        return `
          <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-l-DEFAULT ${isActive ? 'text-primary font-bold bg-surface-container-high border-r-4 border-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}" href="${s.path}">
            ${iconHtml}
            <span class="text-label-md font-label-md">${s.label}</span>
          </a>
        `;
      }).join('')}
    `;
  } else {
    // App level nav
    navItems = `
      <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-l-DEFAULT ${isDashboard || isProject ? 'text-primary font-bold bg-surface-container-high border-r-4 border-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}" href="#dashboard">
        <span class="material-symbols-outlined ${isDashboard || isProject ? 'filled' : ''}">dashboard</span>
        <span class="text-label-md font-label-md">Projects</span>
      </a>
      ${admin ? `
      <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-l-DEFAULT ${isUsers ? 'text-primary font-bold bg-surface-container-high border-r-4 border-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}" href="#users">
        <span class="material-symbols-outlined ${isUsers ? 'filled' : ''}">group</span>
        <span class="text-label-md font-label-md">User Management</span>
        <span id="pending-badge" class="hidden ml-auto text-[10px] font-bold bg-tertiary text-on-tertiary px-1.5 py-0.5 rounded-full min-w-[18px] text-center"></span>
      </a>
      ` : ''}
    `;
  }

  return `
    <aside class="h-screen sticky top-0 left-0 w-72 bg-surface-container-lowest border-r border-border-muted flex flex-col py-base gap-2 flex-shrink-0 z-20 transition-transform duration-300 md:translate-x-0 -translate-x-full absolute md:relative" id="app-sidebar">
      <!-- Header -->
      <div class="px-6 py-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <img alt="Nabhas Aircon Logo" class="h-10 w-auto object-contain self-start" src="/logo.svg"/>
          <button id="close-sidebar-btn" class="md:hidden text-on-surface-variant p-2 -mr-2"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div>
          <h1 class="text-headline-md font-headline-md font-bold tracking-tight text-primary">Nabhas Aircon</h1>
          <p class="text-label-sm font-label-sm text-on-surface-variant">Estimation Engine</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex-1 overflow-y-auto px-2 mt-4 flex flex-col gap-1">
        ${navItems}
      </nav>

      <!-- Footer Tabs -->
      <div class="px-2 mt-auto border-t border-border-muted pt-2 flex flex-col gap-1">
        <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-DEFAULT ${isSettings ? 'text-primary font-bold bg-surface-container-high scale-95' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}" href="#settings">
          <span class="material-symbols-outlined ${isSettings ? 'filled' : ''}">settings</span>
          <span class="text-label-md font-label-md">Settings ${admin ? '' : '(View Only)'}</span>
        </a>
        
        <div class="flex items-center justify-between px-4 py-3 mt-2 bg-surface-container-low rounded-DEFAULT border border-border-muted">
          <div class="flex flex-col truncate">
            <span class="text-label-sm font-bold text-on-surface truncate">${user?.name || 'User'}</span>
            <span class="text-xs text-on-surface-variant truncate">${user?.email || ''}</span>
          </div>
          <button id="signout-btn" class="text-error hover:bg-error-container p-2 rounded-full transition-colors flex items-center justify-center" title="Sign Out">
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
    <!-- Mobile overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-on-surface/50 z-10 hidden md:hidden"></div>
  `;
};

export const mountSidebar = () => {
  const signoutBtn = document.getElementById('signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      await signOut();
      window.location.hash = '#login';
    });
  }

  // Load pending badge count for admins
  const pendingBadge = document.getElementById('pending-badge');
  if (pendingBadge) {
    getPendingUserCount().then(count => {
      if (count > 0) {
        pendingBadge.textContent = count;
        pendingBadge.classList.remove('hidden');
      }
    }).catch(() => { /* silent fail for badge */ });
  }

  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('close-sidebar-btn');

  if (closeBtn && sidebar && overlay) {
    const closeSidebar = () => {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    };
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
  }
};

export const toggleSidebar = () => {
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
};
