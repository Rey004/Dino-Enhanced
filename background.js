// background.js — service worker
import { toolbarIconPaths } from './shared/brand.js';

function applyToolbarIcon() {
    if (!chrome.action?.setIcon) return;
    chrome.action.setIcon({ path: toolbarIconPaths() });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log('DinoDash extension installed');
    applyToolbarIcon();
});

chrome.runtime.onStartup.addListener(() => {
    applyToolbarIcon();
});
