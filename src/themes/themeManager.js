import { themes } from './presets.js';
import { GameState } from '../engine/state.js';

export const ThemeManager = {
    current: themes.classic,
    
    setTheme(themeKey) {
        if (themes[themeKey]) {
            this.current = themes[themeKey];
            GameState.isDarkMode = ['cyberpunk', 'space', 'dark'].includes(themeKey);
            this.applyCSSVariables();
        }
    },
    
    applyCSSVariables() {
        const root = document.documentElement;
        root.style.setProperty('--bg-color', this.current.backgroundColor);
        root.style.setProperty('--text-color', this.current.textColor);
        
        if (GameState.isDarkMode) {
            root.style.setProperty('--panel-bg', 'rgba(0, 0, 0, 0.8)');
            root.style.setProperty('--panel-border', 'rgba(100, 100, 100, 0.3)');
        } else {
            root.style.setProperty('--panel-bg', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--panel-border', 'rgba(200, 200, 200, 0.3)');
        }
    }
};
