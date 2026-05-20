import { WIDGET_REGISTRY } from './widgetRegistry.js';
import { WidgetPrefs } from './widgetPrefs.js';

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderTags() {
    const enabled = WIDGET_REGISTRY.filter((w) => WidgetPrefs.isEnabled(w.id));
    const disabled = WIDGET_REGISTRY.filter((w) => !WidgetPrefs.isEnabled(w.id));

    const activeTags = enabled
        .map(
            (w) => `
        <span class="widget-tag widget-tag--active" data-widget-id="${w.id}">
            <span class="widget-tag__label">${escapeHtml(w.label)}</span>
            <button type="button" class="widget-tag__action widget-tag__action--remove" data-widget-action="remove" data-widget-id="${w.id}" aria-label="Remove ${escapeHtml(w.label)}">×</button>
        </span>`
        )
        .join('');

    const inactiveTags = disabled
        .map(
            (w) => `
        <span class="widget-tag widget-tag--inactive" data-widget-id="${w.id}">
            <button type="button" class="widget-tag__action widget-tag__action--add" data-widget-action="add" data-widget-id="${w.id}" aria-label="Add ${escapeHtml(w.label)}">+</button>
            <span class="widget-tag__label">${escapeHtml(w.label)}</span>
        </span>`
        )
        .join('');

    if (!enabled.length && !disabled.length) {
        return '<p class="widget-manage__empty">No widgets registered.</p>';
    }

    return `
        ${enabled.length ? `<div class="widget-tag-group"><span class="widget-tag-group__label">On new tab</span><div class="widget-tag-list">${activeTags}</div></div>` : ''}
        ${disabled.length ? `<div class="widget-tag-group"><span class="widget-tag-group__label">Available</span><div class="widget-tag-list">${inactiveTags}</div></div>` : ''}
        ${!enabled.length ? '<p class="widget-manage__empty">No widgets on your new tab. Add one below.</p>' : ''}
    `;
}

function bindTagActions(container, onChange) {
    container.querySelectorAll('[data-widget-action]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.widgetId;
            const action = btn.dataset.widgetAction;
            WidgetPrefs.setEnabled(id, action === 'add');
            refreshTags(container);
            onChange?.(id, action === 'add');
        });
    });
}

function bindDropdown(root) {
    const trigger = root.querySelector('.widget-manage__trigger');
    const panel = root.querySelector('.widget-manage__panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = panel.classList.toggle('hidden');
        trigger.setAttribute('aria-expanded', String(!isHidden));
    });
}

function refreshTags(container) {
    const tagHost = container.querySelector('[data-widget-tag-host]');
    if (!tagHost) return;
    tagHost.innerHTML = renderTags();
    bindTagActions(container, container._widgetOnChange);
}

/**
 * Mount collapsible widget manager with tag add/remove UI.
 * @param {HTMLElement} container
 * @param {{ onChange?: (id: string, enabled: boolean) => void }} options
 */
export function mountWidgetSettings(container, { onChange } = {}) {
    if (!container) return;

    container._widgetOnChange = onChange;
    container.innerHTML = `
        <div class="widget-manage" data-widget-manage>
            <button type="button" class="widget-manage__trigger" aria-expanded="false">
                <span>Manage widgets</span>
                <svg class="widget-manage__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>
            <div class="widget-manage__panel hidden" role="region" aria-label="Widget management">
                <p class="widget-manage__hint">Use <strong>×</strong> to remove a widget, <strong>+</strong> to add it back.</p>
                <div data-widget-tag-host></div>
            </div>
        </div>`;

    const root = container.querySelector('[data-widget-manage]');
    bindDropdown(root);
    refreshTags(container);
}

/** Refresh tag UI after prefs change from another surface. */
export function syncWidgetSettings(container) {
    if (!container) return;
    refreshTags(container);
}
