import { GameState } from './state.js';
import { Renderer } from '../rendering/renderer.js';
import { updateDino, drawDino, resetDino } from '../entities/dino.js';
import { updateObstacles, drawObstacles, resetObstacles, checkCollisions } from '../entities/obstacle.js';
import { updateEnvironment, drawEnvironment } from '../entities/environment.js';
import { updateParticles, drawParticles } from '../rendering/particles.js';
import { UIManager } from '../ui/uiManager.js';
import { GameStats } from '../utils/gameStats.js';

let lastTime = 0;
let animationId = null;

export const GameLoop = {
    start() {
        if (!animationId) {
            lastTime = performance.now();
            animationId = requestAnimationFrame(this.loop.bind(this));
        }
    },
    
    stop() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    },
    
    loop(currentTime) {
        if (document.hidden) {
            animationId = null;
            return;
        }

        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        // Cap deltaTime to avoid massive jumps if tab is inactive
        const dt = Math.min(deltaTime, 32); 
        
        this.update(dt);
        this.draw();

        if (GameState.currentPhase === 'playing') {
            animationId = requestAnimationFrame(this.loop.bind(this));
        } else {
            animationId = null;
        }
    },
    
    update(dt) {
        if (GameState.currentPhase === 'playing') {
            // Increase speed slightly
            if (GameState.speed < GameState.MAX_SPEED) {
                GameState.speed += GameState.SPEED_INCREMENT * (dt / 16);
            }
            
            // Score update
            const oldScore = GameState.score;
            GameState.distanceMeter += GameState.speed * (dt / 16) * 0.025;
            GameState.score = Math.floor(GameState.distanceMeter);
            if (GameState.score > oldScore) {
                UIManager.updateScore(GameState.score);
                const prevMilestone = Math.floor(oldScore / 100);
                const currentMilestone = Math.floor(GameState.score / 100);
                if (currentMilestone > prevMilestone && currentMilestone > 0) {
                    window.dispatchEvent(new CustomEvent('dino-score-milestone', {
                        detail: { score: currentMilestone * 100 }
                    }));
                }
            }
            
            updateEnvironment(dt);
            updateObstacles(dt);
            updateDino(dt);
            updateParticles(dt);
            
            if (checkCollisions()) {
                this.gameOver();
            }
        }
    },
    
    draw() {
        Renderer.clear();
        drawEnvironment();
        drawObstacles();
        drawDino();
        drawParticles();
        Renderer.applyPostProcessing();
    },
    
    gameOver() {
        const previousHiScore = GameState.hiScore || 0;
        const isNewHighScore = GameState.score > previousHiScore && GameState.score > 0;

        GameState.currentPhase = 'gameover';
        const durationMs = performance.now() - (GameState.gameStartTime || performance.now());
        GameStats.recordGameEnd(GameState.score, durationMs);
        GameState.hiScore = GameStats.data.hiScore;
        UIManager.updateHiScore(GameState.hiScore);
        UIManager.updateGameStats(GameStats.data);
        UIManager.showGameOver();

        window.dispatchEvent(new CustomEvent('dino-game-over', {
            detail: { score: GameState.score, isNewHighScore }
        }));
    },

    restart() {
        GameStats.recordGameStart();
        UIManager.updateGameStats(GameStats.data);
        GameState.reset();
        resetObstacles();
        resetDino();
        UIManager.hideOverlays();
        window.dispatchEvent(new CustomEvent('dino-game-started'));
        this.start();
    }
};
