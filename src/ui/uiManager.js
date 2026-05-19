import { ThemeManager } from '../themes/themeManager.js';

export const UIManager = {
    scoreLabel: null,
    hiScoreLabel: null,
    fpsLabel: null,
    menuPanel: null,
    gameOverPanel: null,
    settingsPanel: null,
    
    init() {
        this.scoreLabel = document.getElementById('current-score');
        this.hiScoreLabel = document.getElementById('hi-score');
        this.fpsLabel = document.querySelector('#fps-counter span');
        this.menuPanel = document.getElementById('main-menu');
        this.gameOverPanel = document.getElementById('game-over-panel');
        this.settingsPanel = document.getElementById('settings-panel');
        
        document.getElementById('settings-button').addEventListener('click', () => {
            this.settingsPanel.classList.toggle('hidden');
        });
        
        document.getElementById('close-settings').addEventListener('click', () => {
            this.settingsPanel.classList.add('hidden');
        });
        
        document.getElementById('theme-select').addEventListener('change', (e) => {
            ThemeManager.setTheme(e.target.value);
            chrome.storage?.local.set({ theme: e.target.value });
        });
        
        document.getElementById('toggle-particles').addEventListener('change', (e) => {
            chrome.storage?.local.set({ particles: e.target.checked });
        });
        
        document.getElementById('toggle-audio').addEventListener('change', (e) => {
            chrome.storage?.local.set({ audio: e.target.checked });
        });
        
        document.getElementById('toggle-fps').addEventListener('change', (e) => {
            const fpsCounter = document.getElementById('fps-counter');
            if (e.target.checked) {
                fpsCounter.classList.remove('hidden');
            } else {
                fpsCounter.classList.add('hidden');
            }
        });
    },
    
    updateScore(score) {
        this.scoreLabel.textContent = score.toString().padStart(5, '0');
    },
    
    updateHiScore(score) {
        this.hiScoreLabel.textContent = score.toString().padStart(5, '0');
    },
    
    updateFPS(dt) {
        if (dt > 0) {
            const fps = Math.round(1000 / dt);
            this.fpsLabel.textContent = fps;
        }
    },
    
    hideOverlays() {
        this.menuPanel.classList.add('hidden');
        this.gameOverPanel.classList.add('hidden');
        this.settingsPanel.classList.add('hidden');
    },
    
    showGameOver() {
        this.gameOverPanel.classList.remove('hidden');
    }
};
