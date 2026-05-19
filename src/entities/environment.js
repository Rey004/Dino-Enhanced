import { GameState } from '../engine/state.js';
import { Renderer } from '../rendering/renderer.js';
import { ThemeManager } from '../themes/themeManager.js';
import { randomInt } from '../utils/math.js';

let backgroundItems = [];

export function updateEnvironment(dt) {
    // Generate clouds/stars occasionally
    if (Math.random() < 0.01) {
        backgroundItems.push({
            x: GameState.canvasWidth,
            y: randomInt(20, GameState.GROUND_Y - 50),
            width: randomInt(40, 80),
            height: randomInt(15, 30),
            speed: randomInt(1, 3) * 0.1
        });
    }
    
    // Move
    for (let i = backgroundItems.length - 1; i >= 0; i--) {
        let item = backgroundItems[i];
        item.x -= GameState.speed * item.speed * (dt / 16);
        if (item.x + item.width < 0) {
            backgroundItems.splice(i, 1);
        }
    }
}

export function drawEnvironment() {
    const ctx = Renderer.ctx;
    const theme = ThemeManager.current;
    
    // Draw ground line
    ctx.fillStyle = theme.groundColor;
    ctx.fillRect(0, GameState.GROUND_Y, GameState.canvasWidth, 2);
    
    // Draw background items (clouds etc)
    ctx.fillStyle = theme.obstacleColor;
    ctx.globalAlpha = 0.3;
    
    for (let item of backgroundItems) {
        // Draw a simple cloud placeholder
        ctx.beginPath();
        ctx.arc(item.x + 10, item.y + 10, item.height/2, 0, Math.PI * 2);
        ctx.arc(item.x + item.width - 10, item.y + 10, item.height/2, 0, Math.PI * 2);
        ctx.fillRect(item.x + 10, item.y + 10 - item.height/2, item.width - 20, item.height);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
}
