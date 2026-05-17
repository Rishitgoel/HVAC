/**
 * Escapes HTML special characters to prevent XSS when injecting user-provided text.
 */
export const escapeHtml = (str) => {
  if (!str) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generic error message formatter — strips Firebase-specific prefixes.
 * Moved out of auth.js since it's used throughout the app for non-auth errors too.
 */
export const getErrorMessage = (error, defaultMsg = 'An error occurred') => {
  if (!error) return defaultMsg;
  const msg = error.message || error.toString();
  return msg.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/[^\)]+\)\.?$/i, '').replace(/\s*\(firestore\/[^\)]+\)\.?$/i, '');
};
