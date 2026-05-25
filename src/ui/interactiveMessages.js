/* src/ui/interactiveMessages.js */

import { getRandomMessage } from './messages.js';

const activeMessages = {};

// Helper to asynchronously fetch stored profile name, fallback to DOM tooltip
async function getProfileName() {
    return new Promise((resolve) => {
        if (chrome.storage?.local) {
            chrome.storage.local.get(['profileName'], (result) => {
                resolve(result.profileName || 'User');
            });
        } else {
            const el = document.getElementById('profile-icon');
            resolve(el && el.dataset.tooltip ? el.dataset.tooltip : 'User');
        }
    });
}

export const InteractiveMessages = {
    init() {
        this.setupEventListeners();
        
        // Welcome greeting on tab startup after a brief delay
        setTimeout(async () => {
            const userName = await getProfileName();
            const greeting = getRandomMessage('greetings', {}, userName);
            this.show(greeting, null, 'upper-center', 'general', 3500);
        }, 800);

        // Ambient system messages timer
        setInterval(async () => {
            // Only trigger ambient messages if the tab is visible and the game is NOT currently running
            if (document.hidden) return;
            
            const gameContainer = document.getElementById('game-container');
            const isPlaying = gameContainer && !gameContainer.classList.contains('blurred');
            if (isPlaying) return;

            // Pick a random anchor widget that is enabled/visible
            const anchors = [
                { id: 'daily-quests-widget', pos: 'left', key: 'dailyQuests' },
                { 
                    id: 'favourite-links-button', 
                    pos: 'right', 
                    key: 'favouriteLinks',
                    getEl: () => {
                        const panel = document.getElementById('favourite-links-panel');
                        const isPanelOpen = panel && !panel.classList.contains('hidden');
                        return isPanelOpen ? panel : document.getElementById('favourite-links-button');
                    }
                },
                { id: 'search-form', pos: 'bottom', key: 'general' }
            ];

            const activeAnchors = anchors.filter(a => {
                const el = a.getEl ? a.getEl() : document.getElementById(a.id);
                return el && !el.classList.contains('hidden') && el.offsetParent !== null;
            });

            if (activeAnchors.length > 0) {
                const anchor = activeAnchors[Math.floor(Math.random() * activeAnchors.length)];
                const el = anchor.getEl ? anchor.getEl() : document.getElementById(anchor.id);
                const userName = await getProfileName();
                const ambientMsg = getRandomMessage('ambient', {}, userName);
                this.show(ambientMsg, el, anchor.pos, anchor.key, 3500);
            }
        }, 45000); // Trigger every 45 seconds
    },

    show(text, targetEl, preferredPosition = 'top', anchorId = 'general', duration = 3000) {
        // Clean up previous message for this widget category immediately
        const existing = activeMessages[anchorId];
        if (existing) {
            if (existing.cleanup) existing.cleanup();
            existing.remove();
        }

        // Generate elements
        const msgBox = document.createElement('div');
        msgBox.className = 'interactive-message-box';
        msgBox.innerHTML = `
            <div class="msg-terminal-header">
                <span class="msg-terminal-dot dot-red"></span>
                <span class="msg-terminal-dot dot-yellow"></span>
                <span class="msg-terminal-dot dot-green"></span>
                <span class="msg-terminal-title">SYS.LOG</span>
            </div>
            <div class="msg-terminal-body">
                <span class="msg-terminal-prompt">&gt;</span>
                <span class="msg-terminal-text"></span><span class="msg-terminal-cursor">█</span>
            </div>
        `;
        document.body.appendChild(msgBox);
        activeMessages[anchorId] = msgBox;

        // Position coordinates logic
        const bubbleWidth = 260;
        const bubbleHeight = 84; // Safe height including multi-line wraps
        const gap = 16; // Increased gap to prevent overlapping borders

        let left = 0;
        let top = 0;

        if (preferredPosition === 'upper-center') {
            left = (window.innerWidth - bubbleWidth) / 2;
            top = 32;
        } else {
            let rect = targetEl ? targetEl.getBoundingClientRect() : null;
            if (!rect || rect.width === 0 || rect.height === 0) {
                // Default center-bottom of screen fallback
                left = (window.innerWidth - bubbleWidth) / 2;
                top = window.innerHeight - bubbleHeight - 40;
            } else {
                if (preferredPosition === 'left') {
                    left = rect.left - bubbleWidth - gap;
                    top = rect.top + (rect.height - bubbleHeight) / 2;
                } else if (preferredPosition === 'right') {
                    left = rect.right + gap;
                    top = rect.top + (rect.height - bubbleHeight) / 2;
                } else if (preferredPosition === 'bottom') {
                    left = rect.left + (rect.width - bubbleWidth) / 2;
                    top = rect.bottom + gap;
                } else if (preferredPosition === 'top') {
                    left = rect.left + (rect.width - bubbleWidth) / 2;
                    top = rect.top - bubbleHeight - gap;
                } else if (preferredPosition === 'inner-top-left') {
                    left = rect.left + gap + 16;
                    top = rect.top + gap + 16;
                } else {
                    left = (window.innerWidth - bubbleWidth) / 2;
                    top = window.innerHeight - bubbleHeight - 40;
                }
            }
        }

        // Clamp coordinates within safe viewport boundaries (prevent edge/corner crowding)
        const margin = 32;
        left = Math.max(margin, Math.min(left, window.innerWidth - bubbleWidth - margin));
        top = Math.max(margin, Math.min(top, window.innerHeight - bubbleHeight - margin));

        msgBox.style.left = `${left}px`;
        msgBox.style.top = `${top}px`;

        // Reflow to register transition entry state
        msgBox.offsetHeight;
        msgBox.classList.add('is-visible');

        const textEl = msgBox.querySelector('.msg-terminal-text');
        const cursorEl = msgBox.querySelector('.msg-terminal-cursor');

        let typingTimer = null;
        let fadeTimer = null;
        let removeTimer = null;

        let charIdx = 0;
        const typingSpeed = 22; // ms per character

        function typeChar() {
            if (charIdx < text.length) {
                textEl.textContent += text.charAt(charIdx);
                charIdx++;
                typingTimer = setTimeout(typeChar, typingSpeed);
            } else {
                // Completed typing, schedule fade-out
                cursorEl.style.animationPlayState = 'paused';
                fadeTimer = setTimeout(fadeOut, duration);
            }
        }

        function fadeOut() {
            msgBox.classList.remove('is-visible');
            removeTimer = setTimeout(() => {
                msgBox.remove();
                if (activeMessages[anchorId] === msgBox) {
                    delete activeMessages[anchorId];
                }
            }, 350);
        }

        msgBox.cleanup = () => {
            clearTimeout(typingTimer);
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };

        // Initialize typing animation
        typeChar();
    },

    setupEventListeners() {
        // Daily Quests events
        window.addEventListener('dino-quest-added', async (e) => {
            const userName = await getProfileName();
            const text = getRandomMessage('questAdded', { text: e.detail.text }, userName);
            this.show(text, document.getElementById('daily-quests-widget'), 'left', 'dailyQuests', 3000);
        });

        window.addEventListener('dino-quest-toggled', async (e) => {
            const userName = await getProfileName();
            const bankKey = e.detail.done ? 'questToggledDone' : 'questToggledUndone';
            const text = getRandomMessage(bankKey, {}, userName);
            this.show(text, document.getElementById('daily-quests-widget'), 'left', 'dailyQuests', 2500);
        });

        window.addEventListener('dino-quest-removed', async () => {
            const userName = await getProfileName();
            const text = getRandomMessage('questRemoved', {}, userName);
            this.show(text, document.getElementById('daily-quests-widget'), 'left', 'dailyQuests', 2500);
        });

        window.addEventListener('dino-quests-completed', async () => {
            const userName = await getProfileName();
            const text = getRandomMessage('questsCompleted', {}, userName);
            this.show(text, document.getElementById('daily-quests-widget'), 'left', 'dailyQuests', 4000);
        });

        // Helper to dynamically locate favourite links anchor (either open panel or button)
        const getLinksAnchor = () => {
            const panel = document.getElementById('favourite-links-panel');
            const isPanelOpen = panel && !panel.classList.contains('hidden');
            return isPanelOpen ? panel : document.getElementById('favourite-links-button');
        };

        // Favourite Links events
        window.addEventListener('dino-links-opened', async () => {
            const userName = await getProfileName();
            const text = getRandomMessage('linksOpened', {}, userName);
            this.show(text, getLinksAnchor(), 'right', 'favouriteLinks', 2500);
        });

        window.addEventListener('dino-folder-added', async (e) => {
            const userName = await getProfileName();
            const text = getRandomMessage('folderAdded', { name: e.detail.folderName }, userName);
            this.show(text, getLinksAnchor(), 'right', 'favouriteLinks', 2500);
        });

        window.addEventListener('dino-folder-deleted', async () => {
            const userName = await getProfileName();
            const text = getRandomMessage('folderDeleted', {}, userName);
            this.show(text, getLinksAnchor(), 'right', 'favouriteLinks', 2500);
        });

        window.addEventListener('dino-link-added', async (e) => {
            const userName = await getProfileName();
            let host = e.detail.title;
            try {
                host = new URL(e.detail.url).hostname.replace(/^www\./, '');
            } catch {}
            const text = getRandomMessage('linkAdded', { title: e.detail.title, host }, userName);
            this.show(text, getLinksAnchor(), 'right', 'favouriteLinks', 3000);
        });

        window.addEventListener('dino-link-deleted', async () => {
            const userName = await getProfileName();
            const text = getRandomMessage('linkDeleted', {}, userName);
            this.show(text, getLinksAnchor(), 'right', 'favouriteLinks', 2500);
        });

        window.addEventListener('dino-link-moved', async (e) => {
            const userName = await getProfileName();
            const text = getRandomMessage('linkMoved', { folderName: e.detail.folderName }, userName);
            this.show(text, getLinksAnchor(), 'right', 'favouriteLinks', 3000);
        });

        // Game Loop events (positioned in the upper center top of the viewport)
        window.addEventListener('dino-game-started', async () => {
            const userName = await getProfileName();
            const text = getRandomMessage('gameStarted', {}, userName);
            this.show(text, null, 'upper-center', 'game', 2500);
        });

        window.addEventListener('dino-score-milestone', async (e) => {
            const userName = await getProfileName();
            const text = getRandomMessage('gameMilestone', { score: e.detail.score }, userName);
            this.show(text, null, 'upper-center', 'game', 3000);
        });

        window.addEventListener('dino-game-over', async (e) => {
            const userName = await getProfileName();
            let bankKey = 'gameOverMed';
            if (e.detail.isNewHighScore) {
                bankKey = 'gameOverHighScore';
            } else if (e.detail.score < 50) {
                bankKey = 'gameOverLow';
            } else if (e.detail.score > 300) {
                bankKey = 'gameOverHigh';
            }
            const text = getRandomMessage(bankKey, { score: e.detail.score }, userName);
            this.show(text, null, 'upper-center', 'game', 3500);
        });

        // Theme Change events
        window.addEventListener('themeassetschange', async (e) => {
            const userName = await getProfileName();
            const prettyThemeNames = {
                dark: 'Dark Valley',
                mysticForest: 'Mystic Forest'
            };
            const themeName = prettyThemeNames[e.detail.theme] || e.detail.theme;
            const text = getRandomMessage('themeChanged', { theme: themeName }, userName);
            this.show(text, document.getElementById('theme-panel'), 'left', 'general', 3000);
        });
    }
};
