class NetworkManager {
    constructor(wss) {
        this.wss = wss;
        this.connections = new Map(); // playerId -> WebSocket
        this.regions = new Map(); // regionId -> Set of playerIds
        this.parties = new Map(); // partyId -> Set of playerIds
    }

    handleNewConnection(ws, playerId) {
        this.connections.set(playerId, ws);
    }

    handleDisconnection(playerId) {
        this.connections.delete(playerId);
        
        // Remove from regions
        for (const [regionId, players] of this.regions) {
            players.delete(playerId);
        }

        // Remove from parties
        for (const [partyId, players] of this.parties) {
            players.delete(playerId);
            if (players.size === 0) {
                this.parties.delete(partyId);
            }
        }
    }

    // Send message to specific player
    sendToPlayer(playerId, message) {
        const ws = this.connections.get(playerId);
        if (ws && ws.readyState === 1) { // WebSocket.OPEN
            ws.send(JSON.stringify(message));
        }
    }

    // Broadcast to all players
    broadcastToAll(message) {
        for (const ws of this.connections.values()) {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify(message));
            }
        }
    }

    // Broadcast to players in the same region
    broadcastToRegion(regionId, message, excludePlayerId = null) {
        const players = this.regions.get(regionId);
        if (!players) return;

        for (const playerId of players) {
            if (playerId !== excludePlayerId) {
                this.sendToPlayer(playerId, message);
            }
        }
    }

    // Broadcast to nearby players
    broadcastToNearby(playerId, message, radius = 50) {
        const playerRegions = this.getPlayerRegions(playerId);
        
        for (const regionId of playerRegions) {
            this.broadcastToRegion(regionId, message, playerId);
        }
    }

    // Broadcast to party members
    broadcastToParty(partyId, message, excludePlayerId = null) {
        const players = this.parties.get(partyId);
        if (!players) return;

        for (const playerId of players) {
            if (playerId !== excludePlayerId) {
                this.sendToPlayer(playerId, message);
            }
        }
    }

    // Broadcast to affected players
    broadcastToAffected(playerIds, message) {
        for (const playerId of playerIds) {
            this.sendToPlayer(playerId, message);
        }
    }

    // Update player's region
    updatePlayerRegion(playerId, newRegions, oldRegions = []) {
        // Remove from old regions
        for (const regionId of oldRegions) {
            const players = this.regions.get(regionId);
            if (players) {
                players.delete(playerId);
            }
        }

        // Add to new regions
        for (const regionId of newRegions) {
            if (!this.regions.has(regionId)) {
                this.regions.set(regionId, new Set());
            }
            this.regions.get(regionId).add(playerId);
        }
    }

    // Get player's current regions
    getPlayerRegions(playerId) {
        const playerRegions = new Set();
        
        for (const [regionId, players] of this.regions) {
            if (players.has(playerId)) {
                playerRegions.add(regionId);
            }
        }

        return playerRegions;
    }

    // Add player to party
    addToParty(partyId, playerId) {
        if (!this.parties.has(partyId)) {
            this.parties.set(partyId, new Set());
        }
        this.parties.get(partyId).add(playerId);
    }

    // Remove player from party
    removeFromParty(partyId, playerId) {
        const party = this.parties.get(partyId);
        if (party) {
            party.delete(playerId);
            if (party.size === 0) {
                this.parties.delete(partyId);
            }
        }
    }

    // Get party members
    getPartyMembers(partyId) {
        return Array.from(this.parties.get(partyId) || []);
    }

    // Send batch update
    sendBatchUpdate(updates) {
        for (const [playerId, playerUpdates] of updates) {
            if (playerUpdates.length > 0) {
                this.sendToPlayer(playerId, {
                    type: 'batch_update',
                    updates: playerUpdates
                });
            }
        }
    }

    // Handle connection errors
    handleConnectionError(playerId, error) {
        console.error(`Connection error for player ${playerId}:`, error);
        this.handleDisconnection(playerId);
    }
}

export default NetworkManager;
