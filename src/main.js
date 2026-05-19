import { GameLoop } from './engine/gameLoop.js';
import { GameState } from './engine/state.js';
import { Renderer } from './rendering/renderer.js';
import { UIManager } from './ui/uiManager.js';
import { ThemeManager } from './themes/themeManager.js';
import { setupInput } from './utils/input.js';
import { initDino } from './entities/dino.js';

function init() {
    // Load saved data
    chrome.storage?.local.get(['enhancementsEnabled', 'hiScore', 'theme', 'particles', 'audio'], (result) => {
        if (result.enhancementsEnabled === false) {
            chrome.tabs.getCurrent((tab) => {
                if (tab) {
                    chrome.tabs.update(tab.id, { url: 'chrome://new-tab-page/' });
                } else {
                    window.location.href = 'chrome://new-tab-page/';
                }
            });
            return; // Stop initialization
        }
        
        // Show game UI
        document.body.style.opacity = '1';

        if (result.hiScore) {
            GameState.hiScore = result.hiScore;
            UIManager.updateHiScore(result.hiScore);
        }
        if (result.theme) {
            ThemeManager.setTheme(result.theme);
            document.getElementById('theme-select').value = result.theme;
        } else {
            ThemeManager.setTheme('classic');
        }
        if (result.particles !== undefined) {
            document.getElementById('toggle-particles').checked = result.particles;
        }
        if (result.audio !== undefined) {
            document.getElementById('toggle-audio').checked = result.audio;
        }
    });

    // Listen for changes from the popup
    chrome.storage?.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.enhancementsEnabled) {
            if (changes.enhancementsEnabled.newValue === false) {
                chrome.tabs.getCurrent((tab) => {
                    if (tab) {
                        chrome.tabs.update(tab.id, { url: 'chrome://new-tab-page/' });
                    }
                });
            }
        }
    });

    Renderer.init();
    UIManager.init();
    setupInput();
    initDino();
    
    // Start rendering even in menu state
    GameLoop.start();
}

window.addEventListener('load', init);
