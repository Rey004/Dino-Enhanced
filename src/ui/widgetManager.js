import { WIDGET_REGISTRY, getWidgetDef } from '../../shared/widgetRegistry.js';
import { WidgetPrefs } from '../../shared/widgetPrefs.js';
import { mountWidgetSettings, syncWidgetSettings } from '../../shared/widgetSettingsUI.js';

let gameActive = false;
let settingsListEl = null;

export const WidgetManager = {
    async init() {
        await WidgetPrefs.load();
        settingsListEl = document.getElementById('settings-widget-list');
        mountWidgetSettings(settingsListEl, {
            onChange: () => this.refreshAll(),
        });
        this.refreshAll();

        chrome.storage?.onChanged.addListener((changes, namespace) => {
            if (namespace !== 'local' || !changes.widgetPrefs) return;
            WidgetPrefs.mergeSaved(changes.widgetPrefs.newValue);
            syncWidgetSettings(settingsListEl);
            this.refreshAll();
        });
    },

    setGameActive(active) {
        gameActive = active;
        this.refreshAll();
    },

    refreshAll() {
        for (const w of WIDGET_REGISTRY) {
            this.refreshWidget(w.id);
        }
    },

    refreshWidget(id) {
        const def = getWidgetDef(id);
        if (!def) return;

        const enabled = WidgetPrefs.isEnabled(id);
        const show = enabled && (!gameActive || !def.hideDuringPlay);

        for (const elId of def.elementIds) {
            const el = document.getElementById(elId);
            if (el) el.classList.toggle('hidden', !show);
        }

        if (!enabled) {
            for (const elId of def.closeElementIds || []) {
                document.getElementById(elId)?.classList.add('hidden');
            }
            def.elementIds.forEach((elId) => {
                const root = document.getElementById(elId);
                root?.querySelector('#game-stats-panel')?.classList.add('hidden');
                const trigger = root?.querySelector('#stats-button');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        }
    },

    isEnabled(id) {
        return WidgetPrefs.isEnabled(id);
    },
};
