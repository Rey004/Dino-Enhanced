document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('enhancement-toggle');

    // Load current state
    chrome.storage.local.get(['enhancementsEnabled'], (result) => {
        if (result.enhancementsEnabled !== undefined) {
            toggle.checked = result.enhancementsEnabled;
        } else {
            toggle.checked = true; // Default to true
        }
    });

    // Save state on change
    toggle.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        chrome.storage.local.set({ enhancementsEnabled: isEnabled });
        
        // If we are currently on a new tab page, reload it to reflect the change immediately
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const currentTab = tabs[0];
            if (currentTab) {
                const url = currentTab.url || '';
                // Check if current tab is our extension's new tab or the default chrome new tab
                if (url.includes('chrome://newtab/') || url.includes('chrome://new-tab-page/') || url.includes('src/index.html')) {
                    if (isEnabled) {
                        chrome.tabs.update(currentTab.id, { url: 'chrome://newtab/' });
                    } else {
                        chrome.tabs.update(currentTab.id, { url: 'chrome://new-tab-page/' });
                    }
                }
            }
        });
    });
});
