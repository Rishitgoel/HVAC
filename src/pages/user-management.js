import { renderSidebar, mountSidebar, toggleSidebar } from '../components/sidebar.js';
import { getAllUsers, updateUserStatus } from '../utils/storage.js';
import { isAdmin, getErrorMessage } from '../utils/auth.js';
import { showToast } from '../components/toast.js';
import { escapeHtml } from '../utils/helpers.js';

let allUsers = [];
let currentFilter = 'all';

export const render = () => `
  ${renderSidebar('#users')}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <!-- Header -->
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm flex items-center px-4 py-4 md:px-8 md:py-6">
      <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
      <div class="flex-1">
        <h2 class="text-headline-md md:text-headline-lg font-headline-lg text-on-surface">User Management</h2>
        <p class="text-body-sm text-on-surface-variant mt-1">Approve or reject access requests for your team</p>
      </div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-[1000px] mx-auto px-4 py-6 md:px-8 md:py-8">
      
      <!-- Loading Overlay -->
      <div id="users-loading" class="flex flex-col items-center justify-center gap-3 py-16">
        <div class="spinner spinner-md text-primary"></div>
        <p class="text-body-md text-on-surface-variant font-medium">Loading users...</p>
      </div>

      <!-- Access Denied (non-admin) -->
      <div id="access-denied" class="hidden p-8 text-center">
        <span class="material-symbols-outlined text-error text-[48px]">admin_panel_settings</span>
        <p class="text-headline-sm font-bold text-error mt-4">Admin Access Required</p>
        <p class="text-body-md text-on-surface-variant mt-2">Only administrators can manage user access.</p>
      </div>

      <!-- User Management Content -->
      <div id="users-content" class="hidden flex flex-col gap-6">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center shadow-sm">
            <span class="text-headline-md font-bold text-on-surface" id="stat-total">0</span>
            <p class="text-label-sm text-on-surface-variant mt-1">Total Users</p>
          </div>
          <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center shadow-sm">
            <span class="text-headline-md font-bold text-tertiary" id="stat-pending">0</span>
            <p class="text-label-sm text-on-surface-variant mt-1">Pending</p>
          </div>
          <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center shadow-sm">
            <span class="text-headline-md font-bold text-primary" id="stat-approved">0</span>
            <p class="text-label-sm text-on-surface-variant mt-1">Approved</p>
          </div>
          <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 text-center shadow-sm">
            <span class="text-headline-md font-bold text-error" id="stat-rejected">0</span>
            <p class="text-label-sm text-on-surface-variant mt-1">Rejected</p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 border-b border-border-muted pb-1">
          <button data-filter="all" class="filter-tab px-4 py-2 text-label-md font-medium rounded-t-lg transition-colors">All</button>
          <button data-filter="pending" class="filter-tab px-4 py-2 text-label-md font-medium rounded-t-lg transition-colors">Pending</button>
          <button data-filter="approved" class="filter-tab px-4 py-2 text-label-md font-medium rounded-t-lg transition-colors">Approved</button>
          <button data-filter="rejected" class="filter-tab px-4 py-2 text-label-md font-medium rounded-t-lg transition-colors">Rejected</button>
        </div>

        <!-- User List -->
        <div id="users-list" class="flex flex-col gap-3"></div>

        <!-- Empty State -->
        <div id="empty-state" class="hidden py-12 text-center">
          <span class="material-symbols-outlined text-on-surface-variant text-[48px]">group_off</span>
          <p class="text-body-md text-on-surface-variant mt-3">No users match this filter.</p>
        </div>
      </div>
    </div>
  </main>
`;

const getStatusBadge = (status, role) => {
  if (role === 'admin') {
    return '<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary text-on-primary">Admin</span>';
  }
  switch (status) {
    case 'approved':
      return '<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">Approved</span>';
    case 'rejected':
      return '<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-error-container text-on-error-container">Rejected</span>';
    default:
      return '<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">Pending</span>';
  }
};

const renderUserCard = (user) => {
  const status = user.role === 'admin' ? 'approved' : (user.status || 'pending');
  const date = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('en-IN') : 'Unknown';
  const isAdminUser = user.role === 'admin';

  return `
    <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-shadow hover:shadow-md">
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span class="text-label-md font-bold text-on-primary-container">${escapeHtml((user.name || 'U')[0].toUpperCase())}</span>
        </div>
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-label-md font-bold text-on-surface truncate">${escapeHtml(user.name || 'Unknown')}</span>
            ${getStatusBadge(status, user.role)}
          </div>
          <span class="text-body-sm text-on-surface-variant truncate">${escapeHtml(user.email)}</span>
          <span class="text-xs text-outline mt-0.5">Joined: ${date}</span>
        </div>
      </div>
      
      ${!isAdminUser ? `
        <div class="flex gap-2 flex-shrink-0">
          ${status !== 'approved' ? `
            <button class="approve-btn flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors text-sm shadow-sm" data-uid="${user.uid}">
              <span class="material-symbols-outlined text-[16px]">check</span>
              Approve
            </button>
          ` : ''}
          ${status !== 'rejected' ? `
            <button class="reject-btn flex items-center gap-1 px-4 py-2 border border-error text-error rounded-DEFAULT font-label-md hover:bg-error-container transition-colors text-sm" data-uid="${user.uid}">
              <span class="material-symbols-outlined text-[16px]">close</span>
              Reject
            </button>
          ` : ''}
        </div>
      ` : `
        <div class="text-xs text-on-surface-variant italic">System administrator</div>
      `}
    </div>
  `;
};

const renderUsers = () => {
  const filtered = currentFilter === 'all' 
    ? allUsers 
    : allUsers.filter(u => {
        const status = u.role === 'admin' ? 'approved' : (u.status || 'pending');
        return status === currentFilter;
      });

  const listEl = document.getElementById('users-list');
  const emptyEl = document.getElementById('empty-state');

  if (filtered.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
  } else {
    emptyEl.classList.add('hidden');
    listEl.innerHTML = filtered.map(renderUserCard).join('');
  }

  // Update stats
  const pending = allUsers.filter(u => u.role !== 'admin' && (!u.status || u.status === 'pending')).length;
  const approved = allUsers.filter(u => u.role === 'admin' || u.status === 'approved').length;
  const rejected = allUsers.filter(u => u.status === 'rejected').length;

  document.getElementById('stat-total').textContent = allUsers.length;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-approved').textContent = approved;
  document.getElementById('stat-rejected').textContent = rejected;

  // Update filter tab styles
  document.querySelectorAll('.filter-tab').forEach(tab => {
    const f = tab.dataset.filter;
    if (f === currentFilter) {
      tab.className = 'filter-tab px-4 py-2 text-label-md font-bold rounded-t-lg transition-colors text-primary border-b-2 border-primary bg-surface-container-lowest';
    } else {
      tab.className = 'filter-tab px-4 py-2 text-label-md font-medium rounded-t-lg transition-colors text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low';
    }
  });
};

export const mount = async () => {
  mountSidebar('#users');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

  const loadingEl = document.getElementById('users-loading');
  const contentEl = document.getElementById('users-content');
  const deniedEl = document.getElementById('access-denied');

  if (!isAdmin()) {
    loadingEl.classList.add('hidden');
    deniedEl.classList.remove('hidden');
    return;
  }

  try {
    allUsers = await getAllUsers();
    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
    renderUsers();
  } catch (e) {
    loadingEl.classList.add('hidden');
    showToast("Error loading users: " + getErrorMessage(e), "error");
    console.error(e);
    return;
  }

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentFilter = tab.dataset.filter;
      renderUsers();
    });
  });

  // Approve / Reject actions (event delegation)
  contentEl.addEventListener('click', async (e) => {
    const approveBtn = e.target.closest('.approve-btn');
    const rejectBtn = e.target.closest('.reject-btn');
    const btn = approveBtn || rejectBtn;
    if (!btn) return;

    const uid = btn.dataset.uid;
    const newStatus = approveBtn ? 'approved' : 'rejected';
    const action = approveBtn ? 'Approve' : 'Reject';

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner spinner-sm"></div>';

    try {
      await updateUserStatus(uid, newStatus);
      // Update local data
      const user = allUsers.find(u => u.uid === uid);
      if (user) user.status = newStatus;
      renderUsers();
      showToast(`User ${action === 'Approve' ? 'approved' : 'rejected'} successfully`);
    } catch (e) {
      showToast(`Failed to ${action.toLowerCase()} user: ` + getErrorMessage(e), "error");
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">${approveBtn ? 'check' : 'close'}</span> ${action}`;
    }
  });
};
