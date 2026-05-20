import { WIDGET_REGISTRY, getDefaultWidgetPrefs, getWidgetDef } from './widgetRegistry.js';

const STORAGE_KEY = 'widgetPrefs';

export const WidgetPrefs = {
    enabled: getDefaultWidgetPrefs(),

    load() {
        return new Promise((resolve) => {
            if (!chrome.storage?.local) {
                resolve(this);
                return;
            }
            chrome.storage.local.get([STORAGE_KEY], (result) => {
                this.mergeSaved(result[STORAGE_KEY]);
                resolve(this);
            });
        });
    },

    mergeSaved(saved) {
        const defaults = getDefaultWidgetPrefs();
        this.enabled = { ...defaults };
        if (!saved || typeof saved !== 'object') return;
        for (const w of WIDGET_REGISTRY) {
            if (typeof saved[w.id] === 'boolean') {
                this.enabled[w.id] = saved[w.id];
            }
        }
    },

    save() {
        if (!chrome.storage?.local) return;
        chrome.storage.local.set({ [STORAGE_KEY]: { ...this.enabled } });
    },

    isEnabled(id) {
        return this.enabled[id] !== false;
    },

    setEnabled(id, enabled) {
        if (!getWidgetDef(id)) return;
        this.enabled[id] = enabled;
        this.save();
    },
};
