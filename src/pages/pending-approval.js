import { getUserStatus, signOut, getCurrentUser, resendVerificationEmail } from '../utils/auth.js';

export const render = () => {
  const status = getUserStatus();
  const isRejected = status === 'rejected';
  const user = getCurrentUser();
  const isEmailUnverified = user && !user.emailVerified;

  return `
  <div class="flex-1 flex flex-col justify-center items-center p-4 bg-background w-full h-full min-h-screen">
    <div class="w-full max-w-md text-center">
      
      <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-8 shadow-sm">
        <img src="/logo.svg" alt="Nabhas Aircon" class="h-14 mb-4 object-contain mx-auto">
        <h2 class="text-headline-md font-headline-md text-primary font-bold mb-1">Nabhas Aircon</h2>
        <p class="text-body-sm text-on-surface-variant mb-8">HVAC Estimation Engine</p>

        ${isRejected ? `
          <!-- Rejected State -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
              <span class="material-symbols-outlined text-error text-[32px]">block</span>
            </div>
            <h3 class="text-headline-sm font-bold text-error">Access Denied</h3>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-sm">
              Your access request has been declined by an administrator. If you believe this is a mistake, please contact your company admin.
            </p>
          </div>
        ` : `
          <!-- Pending State -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-tertiary text-[32px]">hourglass_top</span>
            </div>
            <h3 class="text-headline-sm font-bold text-on-surface">Awaiting Approval</h3>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-sm">
              Your account has been created successfully. An administrator needs to approve your access before you can use the application.
            </p>
            <div class="mt-2 p-3 bg-surface-container-low rounded-lg border border-border-muted w-full">
              <div class="flex items-center gap-2 justify-center text-body-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                <span>You will be notified once your access is approved.</span>
              </div>
            </div>

            ${isEmailUnverified ? `
            <div class="mt-4 p-4 bg-primary-container text-on-primary-container rounded-lg border border-primary/20 text-left w-full shadow-sm">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-0.5">mark_email_unread</span>
                <div class="flex-1">
                  <h4 class="font-bold text-sm mb-1">Verify Your Email Address</h4>
                  <p class="text-xs text-on-primary-container/90 mb-3 leading-relaxed">
                    We've sent a verification link to your email. Verifying your email prevents account conflicts if you use Google Sign-In later.
                  </p>
                  <button id="resend-verification-btn" class="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-surface/50 px-3 py-1.5 rounded-md border border-primary/20 hover:bg-surface transition-colors">
                    <span>Resend verification email</span>
                  </button>
                  <div id="verification-toast" class="hidden text-xs text-primary font-bold mt-2 bg-surface px-3 py-1.5 rounded-md border border-primary/20">Verification email sent! Please check your inbox.</div>
                </div>
              </div>
            </div>
            ` : ''}
          </div>
        `}

        <div class="mt-8 pt-6 border-t border-border-muted flex flex-col gap-3">
          <button id="refresh-status-btn" class="w-full flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface py-3 rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-200 font-label-md">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Check Status
          </button>
          <button id="signout-btn" class="w-full flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface-variant py-3 rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-200 font-label-md">
            <span class="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>

      <p class="mt-6 text-xs text-on-surface-variant">
        This is a private application. Access is restricted to authorized personnel only.
      </p>
    </div>
  </div>
  `;
};

export const mount = () => {
  document.getElementById('signout-btn').addEventListener('click', async () => {
    await signOut();
    window.location.hash = '#login';
  });

  document.getElementById('refresh-status-btn').addEventListener('click', () => {
    // Full reload to re-trigger onAuthChange which re-fetches the user's status
    window.location.reload();
  });

  const resendBtn = document.getElementById('resend-verification-btn');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      resendBtn.disabled = true;
      const toast = document.getElementById('verification-toast');
      try {
        await resendVerificationEmail();
        toast.textContent = 'Verification email sent! Please check your inbox (and spam folder).';
        toast.classList.remove('hidden');
      } catch (err) {
        toast.textContent = 'Error sending verification email. Please try again later.';
        toast.classList.remove('hidden');
        resendBtn.disabled = false;
      }
    });
  }
};
