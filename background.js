// background.js
// A minimal service worker for the extension lifecycle.
chrome.runtime.onInstalled.addListener(() => {
  console.log('Dino Enhanced Extension installed');
});
