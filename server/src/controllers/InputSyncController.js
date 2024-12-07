const { EventEmitter } = require('events');

class InputSyncController extends EventEmitter {
    constructor(io) {
        super();
        this.io = io;
        this.playerInputs = new Map();
        this.inputBuffer = new Map();
        this.lastProcessedInputs = new Map();
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Player connected:', socket.id);
            
            // Initialize player input tracking
            this.playerInputs.set(socket.id, {
                movement: { x: 0, y: 0 },
                camera: { x: 0, y: 0 },
                buttons: new Set(),
                timestamp: Date.now()
            });

            // Handle input updates
            socket.on('playerInput', (data) => {
                this.handlePlayerInput(socket.id, data);
            });

            // Handle skill activation
            socket.on('skillActivated', (data) => {
                this.handleSkillActivation(socket.id, data);
            });

            // Handle puzzle interactions
            socket.on('puzzleInteraction', (data) => {
                this.handlePuzzleInteraction(socket.id, data);
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('Player disconnected:', socket.id);
                this.playerInputs.delete(socket.id);
                this.inputBuffer.delete(socket.id);
                this.lastProcessedInputs.delete(socket.id);
            });
        });
    }

    handlePlayerInput(playerId, data) {
        // Update player's current input state
        const playerInput = this.playerInputs.get(playerId);
        if (!playerInput) return;

        // Update input state
        playerInput.movement = data.movement || playerInput.movement;
        playerInput.camera = data.camera || playerInput.camera;
        playerInput.timestamp = data.timestamp || Date.now();

        // Handle buttons
        if (data.buttons) {
            data.buttons.pressed.forEach(button => playerInput.buttons.add(button));
            data.buttons.released.forEach(button => playerInput.buttons.delete(button));
        }

        // Buffer the input for processing
        if (!this.inputBuffer.has(playerId)) {
            this.inputBuffer.set(playerId, []);
        }
        this.inputBuffer.get(playerId).push({
            ...data,
            serverTimestamp: Date.now()
        });

        // Process input immediately
        this.processPlayerInput(playerId);
    }

    handleSkillActivation(playerId, data) {
        const { skillId, targetPosition, timestamp } = data;
        
        // Validate skill usage
        if (!this.validateSkillUse(playerId, skillId)) {
            return this.sendErrorToPlayer(playerId, 'Invalid skill use');
        }

        // Apply skill effects
        this.applySkillEffects(playerId, skillId, targetPosition);

        // Broadcast skill activation to other players
        this.broadcastSkillActivation(playerId, data);
    }

    handlePuzzleInteraction(playerId, data) {
        const { puzzleId, action, timestamp } = data;
        
        // Validate puzzle interaction
        if (!this.validatePuzzleInteraction(playerId, puzzleId, action)) {
            return this.sendErrorToPlayer(playerId, 'Invalid puzzle interaction');
        }

        // Process puzzle state change
        this.processPuzzleAction(playerId, puzzleId, action);

        // Broadcast puzzle update to all players
        this.broadcastPuzzleUpdate(puzzleId);
    }

    processPlayerInput(playerId) {
        const inputBuffer = this.inputBuffer.get(playerId);
        if (!inputBuffer || inputBuffer.length === 0) return;

        // Get the latest input
        const latestInput = inputBuffer[inputBuffer.length - 1];
        
        // Process movement
        if (latestInput.movement) {
            this.processMovement(playerId, latestInput.movement);
        }

        // Process actions
        if (latestInput.buttons) {
            this.processActions(playerId, latestInput.buttons);
        }

        // Clear processed inputs
        this.lastProcessedInputs.set(playerId, latestInput);
        this.inputBuffer.set(playerId, []);

        // Broadcast state update to all players
        this.broadcastStateUpdate(playerId);
    }

    processMovement(playerId, movement) {
        // Calculate new position based on movement input
        // This is where you'd implement your movement physics/validation
        this.emit('playerMoved', {
            playerId,
            movement,
            timestamp: Date.now()
        });
    }

    processActions(playerId, actions) {
        actions.pressed.forEach(action => {
            this.emit('playerAction', {
                playerId,
                action,
                type: 'pressed',
                timestamp: Date.now()
            });
        });

        actions.released.forEach(action => {
            this.emit('playerAction', {
                playerId,
                action,
                type: 'released',
                timestamp: Date.now()
            });
        });
    }

    validateSkillUse(playerId, skillId) {
        // Implement skill validation logic
        // Check cooldowns, energy costs, etc.
        return true; // Placeholder
    }

    applySkillEffects(playerId, skillId, targetPosition) {
        // Implement skill effects
        this.emit('skillEffectApplied', {
            playerId,
            skillId,
            targetPosition,
            timestamp: Date.now()
        });
    }

    validatePuzzleInteraction(playerId, puzzleId, action) {
        // Implement puzzle interaction validation
        return true; // Placeholder
    }

    processPuzzleAction(playerId, puzzleId, action) {
        // Implement puzzle state changes
        this.emit('puzzleStateChanged', {
            playerId,
            puzzleId,
            action,
            timestamp: Date.now()
        });
    }

    broadcastStateUpdate(playerId) {
        const playerState = this.playerInputs.get(playerId);
        if (!playerState) return;

        this.io.emit('playerStateUpdate', {
            playerId,
            state: {
                movement: playerState.movement,
                buttons: Array.from(playerState.buttons),
                timestamp: playerState.timestamp
            }
        });
    }

    broadcastSkillActivation(playerId, data) {
        this.io.emit('skillActivated', {
            playerId,
            ...data,
            serverTimestamp: Date.now()
        });
    }

    broadcastPuzzleUpdate(puzzleId) {
        // Implement puzzle state broadcast
        this.io.emit('puzzleStateUpdate', {
            puzzleId,
            // Include puzzle state data
            timestamp: Date.now()
        });
    }

    sendErrorToPlayer(playerId, error) {
        this.io.to(playerId).emit('error', {
            message: error,
            timestamp: Date.now()
        });
    }
}

module.exports = InputSyncController;
