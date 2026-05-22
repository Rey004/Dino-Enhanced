import { themes } from '../themes/presets.js';

export function themeHasAssets(themeName) {
    return themes[themeName]?.hasThemeAssets === true;
}

function themeAssetUrl(themeName, fileName) {
    const assetPath = themes[themeName]?.assetPath || themeName;
    const path = `assets/themes/${assetPath}/${fileName}`;
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
        return chrome.runtime.getURL(path);
    }
    return `../${path}`;
}

export const AssetLoader = {
    images: {},

    unloadOtherThemes(activeThemeName) {
        Object.keys(this.images).forEach((key) => {
            if (key.startsWith(`${activeThemeName}_`)) return;
            const img = this.images[key];
            if (img) {
                img.onload = null;
                img.onerror = null;
                img.removeAttribute?.('src');
            }
            delete this.images[key];
        });
    },

    async loadThemeAssets(themeName) {
        if (!themeHasAssets(themeName)) return;

        const assets = themes[themeName].assets || [
            'idle', 'run-1', 'run-2', 'duck', 'dead',
            'small-obstacle', 'large-obstacle', 'small-fly', 'large-fly',
            'ground', 'background',
        ];

        const promises = assets.map((asset) => {
            return new Promise((resolve) => {
                const key = `${themeName}_${asset}`;

                if (this.images[key]) {
                    resolve();
                    return;
                }

                const img = new Image();
                img.decoding = 'async';
                img.src = themeAssetUrl(themeName, `${asset}.webp`);

                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };

                img.onerror = () => {
                    const fallbackImg = new Image();
                    fallbackImg.decoding = 'async';
                    fallbackImg.src = themeAssetUrl(themeName, `${asset}.png`);
                    fallbackImg.onload = () => {
                        this.images[key] = fallbackImg;
                        resolve();
                    };
                    fallbackImg.onerror = () => {
                        this.images[key] = null;
                        resolve();
                    };
                };
            });
        });

        await Promise.all(promises);
    },

    getSprite(themeName, asset) {
        if (!themeHasAssets(themeName)) return null;
        return this.images[`${themeName}_${asset}`] || null;
    },
};
