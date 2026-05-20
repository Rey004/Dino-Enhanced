const DEFAULT_QUESTS = [
    { id: 'q1', text: 'Finish portfolio', done: false },
    { id: 'q2', text: '2h focus', done: false },
    { id: 'q3', text: 'Gym', done: false },
];

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function newId() {
    return `q${Date.now().toString(36)}`;
}

export const DailyQuests = {
    date: todayKey(),
    items: [...DEFAULT_QUESTS],
    collapsed: false,

    load() {
        return new Promise((resolve) => {
            if (!chrome.storage?.local) {
                resolve(this);
                return;
            }
            chrome.storage.local.get(['dailyRun'], (result) => {
                const saved = result.dailyRun;
                if (saved?.date === todayKey() && Array.isArray(saved.items) && saved.items.length) {
                    this.date = saved.date;
                    this.items = saved.items;
                    this.collapsed = Boolean(saved.collapsed);
                } else {
                    this.date = todayKey();
                    this.items = DEFAULT_QUESTS.map((q) => ({ ...q, done: false }));
                    this.collapsed = saved?.collapsed ?? false;
                    this.save();
                }
                resolve(this);
            });
        });
    },

    save() {
        if (!chrome.storage?.local) return;
        chrome.storage.local.set({
            dailyRun: {
                date: this.date,
                items: this.items,
                collapsed: this.collapsed,
            },
        });
    },

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.save();
    },

    collapse() {
        if (this.collapsed) return;
        this.collapsed = true;
        this.save();
    },

    toggleQuest(id) {
        const item = this.items.find((q) => q.id === id);
        if (item) {
            item.done = !item.done;
            this.save();
        }
    },

    addQuest(text) {
        const trimmed = text.trim();
        if (!trimmed || this.items.length >= 8) return false;
        this.items.push({ id: newId(), text: trimmed, done: false });
        this.save();
        return true;
    },

    removeQuest(id) {
        this.items = this.items.filter((q) => q.id !== id);
        if (!this.items.length) {
            this.items = DEFAULT_QUESTS.map((q) => ({ ...q, done: false }));
        }
        this.save();
    },

    getProgress() {
        const total = this.items.length;
        const done = this.items.filter((q) => q.done).length;
        return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    },
};
