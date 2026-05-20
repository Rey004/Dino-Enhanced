import { DailyQuests } from '../utils/dailyQuests.js';

let listEl = null;
let progressEl = null;
let fillEl = null;
let widgetEl = null;
let bodyEl = null;

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function renderDailyQuests() {
    if (!listEl) return;

    const { done, total, pct } = DailyQuests.getProgress();
    if (progressEl) progressEl.textContent = `${done}/${total}`;
    if (fillEl) fillEl.style.width = `${pct}%`;

    listEl.innerHTML = DailyQuests.items
        .map(
            (q) => `
        <li class="daily-quests__item${q.done ? ' is-done' : ''}">
            <label class="daily-quests__row">
                <input type="checkbox" class="daily-quests__check" data-id="${q.id}"${q.done ? ' checked' : ''}>
                <span class="daily-quests__box" aria-hidden="true"></span>
                <span class="daily-quests__text">${escapeHtml(q.text)}</span>
            </label>
            <button type="button" class="daily-quests__remove" data-id="${q.id}" title="Remove checkpoint" aria-label="Remove checkpoint">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </li>`
        )
        .join('');

    if (widgetEl) {
        widgetEl.classList.toggle('is-collapsed', DailyQuests.collapsed);
        widgetEl.classList.toggle('is-complete', total > 0 && done === total);
    }

    const toggleBtn = document.getElementById('quests-collapse-toggle');
    if (toggleBtn) {
        const expanded = !DailyQuests.collapsed;
        toggleBtn.setAttribute('aria-expanded', String(expanded));
        toggleBtn.title = expanded ? 'Collapse run' : 'Expand run';
    }
}

export function initDailyQuestsUI() {
    widgetEl = document.getElementById('daily-quests-widget');
    bodyEl = document.getElementById('daily-quests-body');
    listEl = document.getElementById('quests-list');
    progressEl = document.getElementById('quests-progress');
    fillEl = document.getElementById('quests-xp-fill');

    const toggleBtn = document.getElementById('quests-collapse-toggle');
    const addForm = document.getElementById('quests-add-form');
    const addInput = document.getElementById('quests-add-input');

    if (!widgetEl || !listEl) return;

    const toggleCollapse = () => {
        DailyQuests.toggleCollapsed();
        renderDailyQuests();
    };
    const header = widgetEl.querySelector('.daily-quests__header');
    toggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCollapse();
    });
    header?.addEventListener('click', (e) => {
        if (e.target.closest('#quests-collapse-toggle')) return;
        toggleCollapse();
    });

    listEl.addEventListener('change', (e) => {
        const cb = e.target.closest('.daily-quests__check');
        if (!cb) return;
        DailyQuests.toggleQuest(cb.dataset.id);
        renderDailyQuests();
    });

    listEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.daily-quests__remove');
        if (!btn) return;
        DailyQuests.removeQuest(btn.dataset.id);
        renderDailyQuests();
    });

    addForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (DailyQuests.addQuest(addInput?.value || '')) {
            if (addInput) addInput.value = '';
            renderDailyQuests();
        }
    });

    document.addEventListener('click', (e) => {
        if (DailyQuests.collapsed || widgetEl.classList.contains('hidden')) return;
        if (widgetEl.contains(e.target)) return;
        DailyQuests.collapse();
        renderDailyQuests();
    });

    renderDailyQuests();
}

