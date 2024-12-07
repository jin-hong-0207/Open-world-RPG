import { io } from 'socket.io-client';
import GameEngine from './engine/GameEngine';
import CharacterController from './controllers/CharacterController';
import UIManager from './ui/UIManager';
import WorldManager from './world/WorldManager';

class Game {
    constructor() {
        this.gameEngine = new GameEngine(document.getElementById('game-container'));
        this.characterController = new CharacterController(this.gameEngine);
        this.uiManager = new UIManager();
        this.worldManager = new WorldManager(this.gameEngine);
        
        this.lastFrameTime = performance.now();
        this.setupNetworking();
        this.setupInputHandlers();
        this.startGameLoop();
    }

    setupNetworking() {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.joinGame();
        });

        this.socket.on('game_joined', (data) => {
            this.handleGameJoined(data);
        });

        this.socket.on('game_state_update', (data) => {
            this.handleGameState(data);
        });

        this.socket.on('player_moved', (data) => {
            this.handlePlayerMoved(data);
        });

        this.socket.on('skill_used', (data) => {
            this.handleSkillUsed(data);
        });

        this.socket.on('puzzle_solved', (data) => {
            this.handlePuzzleSolved(data);
        });

        this.socket.on('player_disconnected', (data) => {
            this.handlePlayerDisconnected(data);
        });
    }

    setupInputHandlers() {
        // Movement
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                    this.characterController.moveForward();
                    break;
                case 's':
                    this.characterController.moveBackward();
                    break;
                case 'a':
                    this.characterController.moveLeft();
                    break;
                case 'd':
                    this.characterController.moveRight();
                    break;
                case 'space':
                    this.characterController.jump();
                    break;
            }
        });

        // Skills
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'q':
                    this.useSkill(0);
                    break;
                case 'e':
                    this.useSkill(1);
                    break;
                case 'r':
                    this.useSkill(2);
                    break;
                case 'f':
                    this.useSkill(3);
                    break;
            }
        });

        // Mouse interaction
        document.addEventListener('click', (e) => {
            const intersects = this.gameEngine.raycast(e);
            if (intersects.length > 0) {
                this.handleWorldInteraction(intersects[0]);
            }
        });
    }

    startGameLoop() {
        const gameLoop = () => {
            const currentTime = performance.now();
            const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
            this.lastFrameTime = currentTime;

            // Update game state
            this.update(deltaTime);

            // Request next frame
            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }

    update(deltaTime) {
        // Update character controller (includes gamepad handling)
        this.characterController.update(deltaTime);

        // Update world state
        this.worldManager.update(deltaTime);

        // Update UI
        this.updateUI();
    }

    updateUI() {
        // Update skill cooldowns
        this.skills.forEach((skill, index) => {
            if (skill.lastUsed) {
                const cooldownProgress = Math.min(
                    1,
                    (performance.now() - skill.lastUsed) / skill.cooldown
                );
                this.uiManager.updateSkillCooldown(index, (1 - cooldownProgress) * 100);
            }
        });

        // Update player stats if they've changed
        if (this.characterController.currentCharacter) {
            this.uiManager.updatePlayerStats(this.characterController.currentCharacter.userData);
        }
    }

    joinGame() {
        // TODO: Add character selection screen
        const defaultCharacter = {
            characterId: 'test_char_1',
            position: { x: 0, y: 0, z: 0 }
        };

        this.socket.emit('join_game', defaultCharacter);
    }

    handleGameJoined(data) {
        this.worldManager.initializeWorld(data.world);
        this.characterController.initializeCharacter(data.character);
        this.uiManager.updatePlayerStats(data.character);

        // Provide haptic feedback on game join
        this.characterController.gamepadManager.vibrate(200, 0.5, 0.5);
    }

    handleGameState(data) {
        this.worldManager.updateWorld(data.world);
        this.characterController.updateOtherPlayers(data.players);
        this.uiManager.updateWorldState(data);
    }

    handlePlayerMoved(data) {
        this.characterController.updatePlayerPosition(data.playerId, data.position, data.rotation);
    }

    handleSkillUsed(data) {
        this.characterController.showSkillEffect(data.playerId, data.skillId, data.target, data.effects);
    }

    handlePuzzleSolved(data) {
        this.worldManager.updatePuzzleState(data.puzzleId);
        this.uiManager.showPuzzleCompletion(data.puzzleId);

        // Provide strong haptic feedback on puzzle completion
        this.characterController.gamepadManager.vibrate(500, 0.8, 0.8);
    }

    handlePlayerDisconnected(data) {
        this.characterController.removePlayer(data.playerId);
    }

    useSkill(skillIndex) {
        const skill = this.characterController.getSkill(skillIndex);
        if (skill) {
            this.socket.emit('use_skill', {
                skillId: skill.id,
                target: this.characterController.getTargetPosition()
            });
        }
    }

    handleWorldInteraction(intersection) {
        const object = intersection.object;
        if (object.isInteractive) {
            this.socket.emit('object_interact', {
                objectId: object.id,
                interaction: 'activate'
            });
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
