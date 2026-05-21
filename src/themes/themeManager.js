import { themes } from './presets.js';
import { GameState } from '../engine/state.js';
import { AssetLoader } from '../utils/assetLoader.js';
export const ThemeManager = {
    current: themes.dark,
    activeThemeName: 'dark',
    
    async setTheme(themeKey) {
        const resolvedThemeKey = themes[themeKey] ? themeKey : 'dark';
        this.current = themes[resolvedThemeKey];
        this.activeThemeName = resolvedThemeKey;
        GameState.isDarkMode = true;
        this.applyCSSVariables();

        if (themes[resolvedThemeKey].hasThemeAssets) {
            await AssetLoader.loadThemeAssets(resolvedThemeKey);
        }

        return resolvedThemeKey;
    },
    
    applyCSSVariables() {
        const t    = this.current;
        const root = document.documentElement;

        // Stamp theme name on body for CSS attribute selectors
        document.body.setAttribute('data-theme', this.activeThemeName);

        // Base colors
        root.style.setProperty('--bg-color',       t.backgroundColor);
        root.style.setProperty('--text-color',      t.textColor);

        // UI accent + glow
        root.style.setProperty('--accent-color',    t.uiAccent);
        root.style.setProperty('--accent-soft',     t.uiAccentSoft);
        root.style.setProperty('--ui-glow',         t.uiGlow);

        // Logo
        root.style.setProperty('--logo-gradient',   t.logoGradient);
        root.style.setProperty('--logo-bg-color',   t.logoBg || '#ffffff');
        root.style.setProperty('--logo-char-color', t.logoChar || '#191a14');

        // Panels / surfaces
        root.style.setProperty('--panel-bg',        t.panelBg);
        root.style.setProperty('--panel-border',    t.panelBorder);
        root.style.setProperty('--input-bg',        t.inputBg);
        root.style.setProperty('--select-bg',       t.selectBg);

        // Buttons
        root.style.setProperty('--button-bg',       t.buttonBg);
        root.style.setProperty('--button-text',     t.buttonText);
    }
};

ThemeManager.applyCSSVariables();
