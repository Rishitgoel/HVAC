import { signIn, signUp, signInWithGoogle, linkGoogleAccount, getAuthErrorMessage, resetPassword } from '../utils/auth.js';

export const render = () => `
  <div class="flex-1 flex flex-col justify-center items-center p-4 bg-background w-full h-full">
    <div class="w-full max-w-md bg-surface-container-lowest border border-border-muted rounded-xl p-8 shadow-sm">
      <div class="flex flex-col items-center mb-8">
        <img src="/logo.svg" alt="Nabhas Aircon" class="h-12 mb-4 object-contain">
        <h2 class="text-headline-md font-headline-md text-primary font-bold">Nabhas Aircon</h2>
        <p class="text-body-sm text-on-surface-variant text-center">HVAC Estimation Engine</p>
      </div>

      <div id="error-message" class="hidden mb-4 p-3 bg-error-container text-on-error-container rounded-DEFAULT text-sm"></div>

      <div id="normal-auth-section" class="flex flex-col">
        <form id="login-form" class="flex flex-col gap-4">
          <div id="name-field" class="hidden flex-col gap-1">
            <label class="text-label-sm font-label-sm text-on-surface font-medium" for="name">Full Name</label>
            <input type="text" id="name" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
          </div>
          
          <div class="flex flex-col gap-1">
            <label class="text-label-sm font-label-sm text-on-surface font-medium" for="email">Email Address</label>
            <input type="email" id="email" required class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center">
              <label class="text-label-sm font-label-sm text-on-surface font-medium" for="password">Password</label>
              <button type="button" id="forgot-password-link" class="text-label-sm font-label-sm text-primary hover:underline font-medium">Forgot Password?</button>
            </div>
            <input type="password" id="password" required class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
          </div>

          <button type="submit" id="submit-btn" class="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-DEFAULT hover:bg-primary-container transition-colors duration-200 font-label-md">
            Sign In
          </button>
        </form>

        <div class="flex items-center my-6">
          <div class="flex-1 border-t border-border-muted"></div>
          <span class="px-4 text-body-sm text-on-surface-variant">Or continue with</span>
          <div class="flex-1 border-t border-border-muted"></div>
        </div>

        <button type="button" id="google-signin-btn" class="w-full flex items-center justify-center gap-3 bg-surface border border-outline-variant text-on-surface py-3 rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-200 font-label-md shadow-sm">
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Sign in with Google
        </button>

        <div class="mt-6 text-center text-body-sm">
          <span id="toggle-text" class="text-on-surface-variant">Don't have an account?</span>
          <button id="toggle-mode-btn" class="text-primary font-medium hover:underline ml-1">Sign Up</button>
        </div>
      </div>

      <div id="link-account-section" class="hidden flex-col gap-4">
        <div class="p-4 bg-primary-container text-on-primary-container rounded-lg text-body-sm mb-2">
          An account already exists with <span id="link-email-display" class="font-bold"></span>. To merge your Google account with your existing account, please verify your password.
        </div>
        <form id="link-form" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-label-sm font-label-sm text-on-surface font-medium" for="link-password">Password</label>
            <input type="password" id="link-password" required class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
          </div>
          <div class="flex gap-3 mt-2">
            <button type="button" id="link-cancel-btn" class="flex-1 bg-surface border border-outline-variant text-on-surface py-3 rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-200 font-label-md">
              Cancel
            </button>
            <button type="submit" id="link-submit-btn" class="flex-1 bg-primary text-on-primary py-3 rounded-DEFAULT hover:bg-primary-container transition-colors duration-200 font-label-md">
              Link Account
            </button>
          </div>
        </form>
      </div>

      <div id="forgot-password-section" class="hidden flex-col gap-4">
        <div class="flex flex-col mb-2">
          <h3 class="text-headline-sm font-headline-sm text-primary font-bold mb-1">Reset Password</h3>
          <p class="text-body-sm text-on-surface-variant">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        <div id="forgot-success-message" class="hidden p-4 bg-primary-container text-on-primary-container rounded-lg text-body-sm mb-2"></div>
        <form id="forgot-form" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-label-sm font-label-sm text-on-surface font-medium" for="forgot-email">Email Address</label>
            <input type="email" id="forgot-email" required class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
          </div>
          <div class="flex gap-3 mt-2">
            <button type="button" id="forgot-cancel-btn" class="flex-1 bg-surface border border-outline-variant text-on-surface py-3 rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-200 font-label-md">
              Back to Login
            </button>
            <button type="submit" id="forgot-submit-btn" class="flex-1 bg-primary text-on-primary py-3 rounded-DEFAULT hover:bg-primary-container transition-colors duration-200 font-label-md">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

export const mount = () => {
  let isLoginMode = true;
  let pendingCred = null;
  let linkingEmail = null;

  const form = document.getElementById('login-form');
  const nameField = document.getElementById('name-field');
  const toggleBtn = document.getElementById('toggle-mode-btn');
  const toggleText = document.getElementById('toggle-text');
  const submitBtn = document.getElementById('submit-btn');
  const errorDiv = document.getElementById('error-message');

  const googleBtn = document.getElementById('google-signin-btn');
  const normalSection = document.getElementById('normal-auth-section');
  const linkSection = document.getElementById('link-account-section');
  const linkForm = document.getElementById('link-form');
  const linkEmailDisplay = document.getElementById('link-email-display');
  const linkSubmitBtn = document.getElementById('link-submit-btn');
  const linkCancelBtn = document.getElementById('link-cancel-btn');

  const forgotLink = document.getElementById('forgot-password-link');
  const forgotSection = document.getElementById('forgot-password-section');
  const forgotForm = document.getElementById('forgot-form');
  const forgotEmailInput = document.getElementById('forgot-email');
  const forgotCancelBtn = document.getElementById('forgot-cancel-btn');
  const forgotSubmitBtn = document.getElementById('forgot-submit-btn');
  const forgotSuccessMsg = document.getElementById('forgot-success-message');

  toggleBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    errorDiv.classList.add('hidden');
    form.reset();

    if (isLoginMode) {
      nameField.classList.add('hidden');
      nameField.querySelector('input').required = false;
      forgotLink.classList.remove('hidden');
      submitBtn.textContent = 'Sign In';
      toggleText.textContent = "Don't have an account?";
      toggleBtn.textContent = 'Sign Up';
    } else {
      nameField.classList.remove('hidden');
      nameField.classList.add('flex');
      nameField.querySelector('input').required = true;
      forgotLink.classList.add('hidden');
      submitBtn.textContent = 'Create Account';
      toggleText.textContent = "Already have an account?";
      toggleBtn.textContent = 'Sign In';
    }
  });

  forgotLink.addEventListener('click', () => {
    errorDiv.classList.add('hidden');
    normalSection.classList.add('hidden');
    normalSection.classList.remove('flex');
    forgotSection.classList.remove('hidden');
    forgotSection.classList.add('flex');
    forgotSuccessMsg.classList.add('hidden');
    forgotForm.reset();
    const currentEmail = document.getElementById('email').value;
    if (currentEmail) {
      forgotEmailInput.value = currentEmail;
    }
  });

  forgotCancelBtn.addEventListener('click', () => {
    forgotSection.classList.add('hidden');
    forgotSection.classList.remove('flex');
    normalSection.classList.remove('hidden');
    normalSection.classList.add('flex');
    errorDiv.classList.add('hidden');
  });

  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    forgotSuccessMsg.classList.add('hidden');
    forgotSubmitBtn.disabled = true;
    forgotSubmitBtn.innerHTML = '<div class="spinner spinner-sm"></div>';

    try {
      const email = forgotEmailInput.value;
      await resetPassword(email);
      forgotSuccessMsg.textContent = 'Password reset link sent! Please check your email inbox (and spam folder) to reset your password.';
      forgotSuccessMsg.classList.remove('hidden');
      forgotForm.reset();
    } catch (error) {
      errorDiv.textContent = getAuthErrorMessage(error);
      errorDiv.classList.remove('hidden');
    } finally {
      forgotSubmitBtn.disabled = false;
      forgotSubmitBtn.textContent = 'Send Reset Link';
    }
  });

  googleBtn.addEventListener('click', async () => {
    errorDiv.classList.add('hidden');
    googleBtn.disabled = true;
    const originalContent = googleBtn.innerHTML;
    googleBtn.innerHTML = '<div class="spinner spinner-sm"></div><span class="ml-2">Connecting...</span>';

    try {
      const result = await signInWithGoogle();
      if (result?.needsLinking) {
        pendingCred = result.pendingCred;
        linkingEmail = result.email;
        linkEmailDisplay.textContent = linkingEmail;
        normalSection.classList.add('hidden');
        normalSection.classList.remove('flex');
        linkSection.classList.remove('hidden');
        linkSection.classList.add('flex');
      }
      // app.js listener will handle redirect if successful directly
    } catch (error) {
      errorDiv.textContent = getAuthErrorMessage(error);
      errorDiv.classList.remove('hidden');
      googleBtn.disabled = false;
      googleBtn.innerHTML = originalContent;
    }
  });

  linkCancelBtn.addEventListener('click', () => {
    pendingCred = null;
    linkingEmail = null;
    linkForm.reset();
    linkSection.classList.add('hidden');
    linkSection.classList.remove('flex');
    normalSection.classList.remove('hidden');
    normalSection.classList.add('flex');
    googleBtn.disabled = false;
    googleBtn.innerHTML = `
      <svg class="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c..87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
      Sign in with Google
    `;
  });

  linkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    linkSubmitBtn.disabled = true;
    linkSubmitBtn.innerHTML = '<div class="spinner spinner-sm"></div>';

    try {
      const password = document.getElementById('link-password').value;
      await linkGoogleAccount(linkingEmail, password, pendingCred);
      // app.js listener will handle redirect
    } catch (error) {
      errorDiv.textContent = getAuthErrorMessage(error);
      errorDiv.classList.remove('hidden');
      linkSubmitBtn.disabled = false;
      linkSubmitBtn.textContent = 'Link Account';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner spinner-sm"></div>';

    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (isLoginMode) {
        await signIn(email, password);
      } else {
        const name = document.getElementById('name').value;
        await signUp(email, password, name);
      }
      // app.js listener will handle redirect
    } catch (error) {
      errorDiv.textContent = getAuthErrorMessage(error);
      errorDiv.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = isLoginMode ? 'Sign In' : 'Create Account';
    }
  });
};
