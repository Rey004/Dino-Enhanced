import { Renderer } from './renderer.js';
import { GameState } from '../engine/state.js';
import { ThemeManager } from '../themes/themeManager.js';

let particles = [];
const MAX_PARTICLES = 120;

function trimParticles() {
    if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
    }
}

export function emitDust(x, y, amount = 5) {
    if (!document.getElementById('toggle-particles').checked) return;
    
    const theme = ThemeManager.current;
    
    for (let i = 0; i < amount; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y,
            vx: (Math.random() - 0.5) * 2 - GameState.speed,
            vy: (Math.random() * -2) - 1,
            life: 1.0,
            color: theme.particleColor,
            size: Math.random() * 4 + 2
        });
    }
    trimParticles();
}

export function emitExplosion(x, y) {
    if (!document.getElementById('toggle-particles').checked) return;
    const theme = ThemeManager.current;
    
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            color: theme.obstacleColor,
            size: Math.random() * 6 + 2
        });
    }
    trimParticles();
}

export function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.life -= 0.02 * (dt / 16);
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

export function drawParticles() {
    if (particles.length === 0) return;
    
    const ctx = Renderer.ctx;
    const theme = ThemeManager.current;
    
    // Use lighter composite operation for cool themes
    if (theme.hasGlow) {
        ctx.globalCompositeOperation = 'screen';
    }
    
    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
}
