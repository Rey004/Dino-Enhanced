import { GameState } from '../engine/state.js';
import { ThemeManager } from '../themes/themeManager.js';

const MAX_CANVAS_DPR = 1.5;

export const Renderer = {
    canvas: null,
    ctx: null,
    dpr: 1,
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    },
    
    resize() {
        // Cap the backing-store scale so fullscreen canvas memory stays reasonable.
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.dpr = dpr;

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
