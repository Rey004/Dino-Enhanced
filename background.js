// background.js — service worker
import { toolbarIconPaths } from './shared/brand.js';

function applyToolbarIcon() {
    if (!chrome.action?.setIcon) return;
    chrome.action.setIcon({ path: toolbarIconPaths() });
}

chrome.runtime.onInstalled.addListener((details) => {
    console.log('DinoDash extension installed');
    applyToolbarIcon();

    if (details.reason === 'install') {
        chrome.storage?.local.set({ enhancementsEnabled: false });
    }
});

chrome.runtime.onStartup.addListener(() => {
    applyToolbarIcon();
});
