class NetworkHandler {
    constructor(game) {
        this.game = game;
        this.ws = null;
        this.serverUrl = process.env.SERVER_URL || 'ws://localhost:3000';
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.messageQueue = [];
        this.lastPing = Date.now();
        this.pingInterval = 30000; // 30 seconds
    }

    // Connect to game server
    async connect(playerId, token) {
        try {
            this.ws = new WebSocket(this.serverUrl);
            this.ws.binaryType = 'arraybuffer';

            this.setupEventListeners();
            await this.waitForConnection();

            // Send authentication
            this.send({
                type: 'authenticate',
                playerId,
                token
            });

            // Start ping interval
            this.startPingInterval();

            return true;
        } catch (error) {
            console.error('Failed to connect to server:', error);
            return false;
        }
    }

    // Setup WebSocket event listeners
    setupEventListeners() {
        this.ws.onopen = () => {
            console.log('Connected to game server');
            this.reconnectAttempts = 0;
            this.flushMessageQueue();
        };

        this.ws.onclose = () => {
            console.log('Disconnected from game server');
            this.handleDisconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onmessage = (event) => {
            this.handleMessage(event.data);
        };
    }

    // Wait for connection to establish
    waitForConnection() {
        return new Promise((resolve, reject) => {
            const maxAttempts = 10;
            let attempts = 0;

            const checkConnection = () => {
                attempts++;
                if (this.ws.readyState === WebSocket.OPEN) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Failed to connect to server'));
                } else {
                    setTimeout(checkConnection, 500);
                }
            };

            checkConnection();
        });
    }

    // Handle incoming messages
    handleMessage(data) {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'world_state':
                    this.game.updateWorldState(message.state);
                    break;
                case 'player_move':
                    this.game.updatePlayerPosition(message.playerId, message.position);
                    break;
                case 'action_result':
                    this.game.handleActionResult(message.playerId, message.action, message.result);
                    break;
                case 'chat_message':
                    this.game.addChatMessage(message.playerId, message.content);
                    break;
                case 'trade_request':
                    this.game.handleTradeRequest(message.playerId, message.items);
                    break;
                case 'party_invite':
                    this.game.handlePartyInvite(message.playerId);
                    break;
                case 'pong':
                    this.handlePong();
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    // Send message to server
    send(message) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.messageQueue.push(message);
        }
    }

    // Send player movement
    sendMovement(position) {
        this.send({
            type: 'player_move',
            data: { position }
        });
    }

    // Send player action
    sendAction(action) {
        this.send({
            type: 'player_action',
            data: action
        });
    }

    // Send chat message
    sendChatMessage(type, content, targetId = null) {
        this.send({
            type: 'chat_message',
            data: { type, content, targetId }
        });
    }

    // Send trade request
    sendTradeRequest(targetId, items) {
        this.send({
            type: 'trade_request',
            data: { targetId, items }
        });
    }

    // Send party invite
    sendPartyInvite(targetId) {
        this.send({
            type: 'party_invite',
            data: { targetId }
        });
    }

    // Handle disconnection
    handleDisconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectAttempts));
        } else {
            this.game.handleDisconnect();
        }
    }

    // Flush message queue
    flushMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.send(message);
        }
    }

    // Start ping interval
    startPingInterval() {
        setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
                this.lastPing = Date.now();
            }
        }, this.pingInterval);
    }

    // Handle pong response
    handlePong() {
        const latency = Date.now() - this.lastPing;
        this.game.updateLatency(latency);
    }

    // Clean up
    cleanup() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default NetworkHandler;
