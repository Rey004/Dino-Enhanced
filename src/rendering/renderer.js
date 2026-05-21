import { GameState } from '../engine/state.js';
import { ThemeManager } from '../themes/themeManager.js';

export const Renderer = {
    canvas: null,
    ctx: null,
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    },
    
    resize() {
        // Handle High-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        
        GameState.canvasWidth = rect.width;
        GameState.canvasHeight = rect.height;
        GameState.GROUND_Y = rect.height * 0.75;
    },
    
    clear() {
        const theme = ThemeManager.current;
        this.ctx.fillStyle = theme.backgroundColor;
        this.ctx.fillRect(0, 0, GameState.canvasWidth, GameState.canvasHeight);
    },
    
    applyPostProcessing() {
        // Optional overlay effects depending on theme (e.g. scanlines, vignette)
        const theme = ThemeManager.current;
        if (theme.hasGlow) {
            // A basic composite operation or overlay can be added here if needed
        }
    }
};
