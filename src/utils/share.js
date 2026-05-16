// Returns a shareable link for a published sheet
export const generateShareLink = (pid, sid) => {
  const url = new URL(window.location.href);
  url.hash = `#shared/${pid}/${sid}`;
  return url.toString();
};
