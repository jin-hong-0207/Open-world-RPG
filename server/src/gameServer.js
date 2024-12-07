const socketIo = require('socket.io');
const WorldController = require('./controllers/worldController');
const CharacterController = require('./controllers/characterController');
const PuzzleController = require('./controllers/puzzleController');

class GameServer {
    constructor(httpServer) {
        this.io = socketIo(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.worldController = new WorldController();
        this.characterController = new CharacterController();
        this.puzzleController = new PuzzleController();
        
        this.connectedPlayers = new Map();
        this.playerRooms = new Map();

        this.setupSocketHandlers();
        this.startGameLoop();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Player connected:', socket.id);

            // Handle player join
            socket.on('join_game', (data) => {
                this.handlePlayerJoin(socket, data);
            });

            // Handle player movement
            socket.on('player_move', (data) => {
                this.handlePlayerMove(socket, data);
            });

            // Handle skill use
            socket.on('use_skill', (data) => {
                this.handleSkillUse(socket, data);
            });

            // Handle puzzle interaction
            socket.on('puzzle_interact', (data) => {
                this.handlePuzzleInteraction(socket, data);
            });

            // Handle object interaction
            socket.on('object_interact', (data) => {
                this.handleObjectInteraction(socket, data);
            });

            // Handle disconnect
            socket.on('disconnect', () => {
                this.handlePlayerDisconnect(socket);
            });
        });
    }

    startGameLoop() {
        const TICK_RATE = 60; // 60 times per second
        const TICK_INTERVAL = 1000 / TICK_RATE;

        setInterval(() => {
            this.update();
        }, TICK_INTERVAL);
    }

    update() {
        // Update world state
        const worldState = this.worldController.getWorldState();
        
        // Update each room/area separately
        for (const [roomId, players] of this.playerRooms) {
            const roomState = {
                world: worldState,
                players: this.getPlayersInRoom(roomId),
                time: Date.now()
            };
            
            this.io.to(roomId).emit('game_state_update', roomState);
        }
    }

    handlePlayerJoin(socket, data) {
        const { characterId, position } = data;
        
        // Add player to connected players
        this.connectedPlayers.set(socket.id, {
            characterId,
            position,
            lastUpdate: Date.now()
        });

        // Determine and join room based on position
        const roomId = this.getRoomIdForPosition(position);
        socket.join(roomId);
        
        // Add to room tracking
        if (!this.playerRooms.has(roomId)) {
            this.playerRooms.set(roomId, new Set());
        }
        this.playerRooms.get(roomId).add(socket.id);

        // Send initial game state
        const gameState = {
            world: this.worldController.getWorldState(),
            players: this.getPlayersInRoom(roomId),
            character: this.characterController.getCharacterStatus(characterId)
        };

        socket.emit('game_joined', gameState);
    }

    handlePlayerMove(socket, data) {
        const player = this.connectedPlayers.get(socket.id);
        if (!player) return;

        const { position, rotation } = data;
        
        // Update player position
        player.position = position;
        player.rotation = rotation;
        player.lastUpdate = Date.now();

        // Check if player changed rooms
        const newRoomId = this.getRoomIdForPosition(position);
        const currentRoomId = Array.from(socket.rooms)[1]; // First room is always the socket ID

        if (newRoomId !== currentRoomId) {
            this.handleRoomTransition(socket, currentRoomId, newRoomId);
        }

        // Broadcast movement to players in the same room
        socket.to(newRoomId).emit('player_moved', {
            playerId: socket.id,
            position,
            rotation
        });
    }

    handleSkillUse(socket, data) {
        const player = this.connectedPlayers.get(socket.id);
        if (!player) return;

        const { skillId, target } = data;
        const result = this.characterController.useSkill(player.characterId, skillId, target);

        if (result.success) {
            // Broadcast skill use to players in the same room
            const roomId = Array.from(socket.rooms)[1];
            socket.to(roomId).emit('skill_used', {
                playerId: socket.id,
                skillId,
                target,
                effects: result.effects
            });
        }

        socket.emit('skill_result', result);
    }

    handlePuzzleInteraction(socket, data) {
        const player = this.connectedPlayers.get(socket.id);
        if (!player) return;

        const { puzzleId, solution } = data;
        const result = this.puzzleController.submitSolution(puzzleId, solution, socket.id);

        if (result.success) {
            // Broadcast puzzle completion to players in the same room
            const roomId = Array.from(socket.rooms)[1];
            socket.to(roomId).emit('puzzle_solved', {
                puzzleId,
                playerId: socket.id
            });
        }

        socket.emit('puzzle_result', result);
    }

    handleObjectInteraction(socket, data) {
        const player = this.connectedPlayers.get(socket.id);
        if (!player) return;

        const { objectId, interaction } = data;
        const result = this.worldController.interactWithObject(objectId, interaction, data);

        if (result.success) {
            // Broadcast object interaction to players in the same room
            const roomId = Array.from(socket.rooms)[1];
            socket.to(roomId).emit('object_interaction', {
                objectId,
                playerId: socket.id,
                interaction,
                result
            });
        }

        socket.emit('interaction_result', result);
    }

    handlePlayerDisconnect(socket) {
        const player = this.connectedPlayers.get(socket.id);
        if (!player) return;

        // Remove from room tracking
        for (const [roomId, players] of this.playerRooms) {
            if (players.has(socket.id)) {
                players.delete(socket.id);
                if (players.size === 0) {
                    this.playerRooms.delete(roomId);
                }
                break;
            }
        }

        // Remove from connected players
        this.connectedPlayers.delete(socket.id);

        // Broadcast disconnect to other players
        socket.broadcast.emit('player_disconnected', { playerId: socket.id });
    }

    handleRoomTransition(socket, oldRoomId, newRoomId) {
        // Leave old room
        if (oldRoomId) {
            socket.leave(oldRoomId);
            this.playerRooms.get(oldRoomId)?.delete(socket.id);
        }

        // Join new room
        socket.join(newRoomId);
        if (!this.playerRooms.has(newRoomId)) {
            this.playerRooms.set(newRoomId, new Set());
        }
        this.playerRooms.get(newRoomId).add(socket.id);

        // Send new room data
        socket.emit('room_changed', {
            roomId: newRoomId,
            players: this.getPlayersInRoom(newRoomId)
        });
    }

    getRoomIdForPosition(position) {
        // Divide the world into grid-based rooms
        const ROOM_SIZE = 1000; // Size of each room in world units
        const x = Math.floor(position.x / ROOM_SIZE);
        const y = Math.floor(position.y / ROOM_SIZE);
        return `room_${x}_${y}`;
    }

    getPlayersInRoom(roomId) {
        const players = this.playerRooms.get(roomId);
        if (!players) return [];

        return Array.from(players).map(playerId => {
            const player = this.connectedPlayers.get(playerId);
            return {
                id: playerId,
                characterId: player.characterId,
                position: player.position
            };
        });
    }
}

module.exports = GameServer;
