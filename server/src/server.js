import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { GameWorld } from './world/game-world.js';
import { PlayerManager } from './players/player-manager.js';
import { NetworkManager } from './network/network-manager.js';

class GameServer {
    constructor(port = 3000) {
        this.port = port;
        this.app = express();
        this.httpServer = createServer(this.app);
        this.wss = new WebSocketServer({ server: this.httpServer });
        
        // Game systems
        this.gameWorld = new GameWorld();
        this.playerManager = new PlayerManager();
        this.networkManager = new NetworkManager(this.wss);

        this.setupExpress();
        this.setupWebSocket();
        this.setupGameLoop();
    }

    setupExpress() {
        this.app.use(cors());
        this.app.use(express.json());

        // REST endpoints
        this.app.post('/api/join', (req, res) => {
            const { username } = req.body;
            const playerId = uuidv4();
            const token = this.playerManager.createPlayer(playerId, username);
            
            res.json({ playerId, token });
        });

        this.app.get('/api/worlds', (req, res) => {
            const worlds = this.gameWorld.getActiveWorlds();
            res.json({ worlds });
        });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            const playerId = this.authenticateConnection(req);
            if (!playerId) {
                ws.close();
                return;
            }

            this.networkManager.handleNewConnection(ws, playerId);

            ws.on('message', (data) => {
                this.handleWebSocketMessage(playerId, data);
            });

            ws.on('close', () => {
                this.networkManager.handleDisconnection(playerId);
                this.playerManager.removePlayer(playerId);
            });
        });
    }

    authenticateConnection(req) {
        const token = req.headers['authorization'];
        return this.playerManager.validateToken(token);
    }

    handleWebSocketMessage(playerId, data) {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'player_move':
                    this.handlePlayerMove(playerId, message.data);
                    break;
                case 'player_action':
                    this.handlePlayerAction(playerId, message.data);
                    break;
                case 'chat_message':
                    this.handleChatMessage(playerId, message.data);
                    break;
                case 'trade_request':
                    this.handleTradeRequest(playerId, message.data);
                    break;
                case 'party_invite':
                    this.handlePartyInvite(playerId, message.data);
                    break;
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    }

    handlePlayerMove(playerId, moveData) {
        // Validate movement
        if (!this.gameWorld.isValidMove(moveData)) {
            return;
        }

        // Update player position
        this.playerManager.updatePlayerPosition(playerId, moveData.position);

        // Broadcast to nearby players
        this.networkManager.broadcastToNearby(playerId, {
            type: 'player_move',
            playerId,
            position: moveData.position
        });
    }

    handlePlayerAction(playerId, actionData) {
        // Validate action
        if (!this.gameWorld.isValidAction(actionData)) {
            return;
        }

        // Process action
        const result = this.gameWorld.processAction(playerId, actionData);

        // Broadcast result to affected players
        this.networkManager.broadcastToAffected(result.affectedPlayers, {
            type: 'action_result',
            playerId,
            action: actionData,
            result: result
        });
    }

    handleChatMessage(playerId, messageData) {
        const { type, content, targetId } = messageData;

        switch (type) {
            case 'global':
                this.networkManager.broadcastToAll({
                    type: 'chat_message',
                    playerId,
                    content
                });
                break;
            case 'party':
                const party = this.playerManager.getPlayerParty(playerId);
                if (party) {
                    this.networkManager.broadcastToParty(party.id, {
                        type: 'chat_message',
                        playerId,
                        content
                    });
                }
                break;
            case 'private':
                this.networkManager.sendToPlayer(targetId, {
                    type: 'chat_message',
                    playerId,
                    content
                });
                break;
        }
    }

    handleTradeRequest(playerId, tradeData) {
        const { targetId, items } = tradeData;

        // Validate trade request
        if (!this.playerManager.canTrade(playerId, targetId, items)) {
            return;
        }

        // Send trade request to target player
        this.networkManager.sendToPlayer(targetId, {
            type: 'trade_request',
            playerId,
            items
        });
    }

    handlePartyInvite(playerId, inviteData) {
        const { targetId } = inviteData;

        // Validate party invite
        if (!this.playerManager.canInviteToParty(playerId, targetId)) {
            return;
        }

        // Send party invite to target player
        this.networkManager.sendToPlayer(targetId, {
            type: 'party_invite',
            playerId
        });
    }

    setupGameLoop() {
        const TICK_RATE = 60; // 60 updates per second
        const TICK_INTERVAL = 1000 / TICK_RATE;

        setInterval(() => {
            this.gameLoop();
        }, TICK_INTERVAL);
    }

    gameLoop() {
        // Update game state
        this.gameWorld.update();

        // Sync player states
        this.playerManager.update();

        // Send world updates to players
        this.broadcastWorldState();
    }

    broadcastWorldState() {
        const worldState = this.gameWorld.getState();
        
        // Send relevant state to each player
        for (const player of this.playerManager.getActivePlayers()) {
            const relevantState = this.gameWorld.getRelevantState(player.id);
            this.networkManager.sendToPlayer(player.id, {
                type: 'world_state',
                state: relevantState
            });
        }
    }

    start() {
        this.httpServer.listen(this.port, () => {
            console.log(`Game server running on port ${this.port}`);
        });
    }
}

export default GameServer;
