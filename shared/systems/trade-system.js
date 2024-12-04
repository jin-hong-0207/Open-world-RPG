import { v4 as uuidv4 } from 'uuid';

class TradeSystem {
    constructor() {
        this.activeTrades = new Map(); // tradeId -> Trade
        this.playerTrades = new Map(); // playerId -> tradeId
        this.tradeRequests = new Map(); // playerId -> Set of pending requests
    }

    // Send trade request
    sendTradeRequest(senderId, targetId) {
        // Check if either player is already trading
        if (this.playerTrades.has(senderId)) {
            return { success: false, error: 'Already in a trade' };
        }
        if (this.playerTrades.has(targetId)) {
            return { success: false, error: 'Target player is already trading' };
        }

        // Add trade request
        if (!this.tradeRequests.has(targetId)) {
            this.tradeRequests.set(targetId, new Set());
        }
        this.tradeRequests.get(targetId).add(senderId);

        return { success: true };
    }

    // Accept trade request
    acceptTradeRequest(playerId, senderId) {
        // Validate request
        const requests = this.tradeRequests.get(playerId);
        if (!requests?.has(senderId)) {
            return { success: false, error: 'Invalid trade request' };
        }

        // Create new trade
        const tradeId = uuidv4();
        const trade = {
            id: tradeId,
            players: [senderId, playerId],
            offers: new Map([
                [senderId, { items: new Map(), gold: 0, confirmed: false }],
                [playerId, { items: new Map(), gold: 0, confirmed: false }]
            ]),
            status: 'active',
            created: Date.now(),
            lastAction: Date.now()
        };

        // Register trade
        this.activeTrades.set(tradeId, trade);
        this.playerTrades.set(senderId, tradeId);
        this.playerTrades.set(playerId, tradeId);

        // Clear requests
        requests.delete(senderId);
        if (requests.size === 0) {
            this.tradeRequests.delete(playerId);
        }

        return { success: true, trade };
    }

    // Add item to trade
    addTradeItem(playerId, itemId, quantity = 1) {
        const trade = this.getPlayerTrade(playerId);
        if (!trade) {
            return { success: false, error: 'Not in a trade' };
        }

        const offer = trade.offers.get(playerId);
        
        // Reset confirmation when offer changes
        offer.confirmed = false;
        trade.offers.get(trade.players.find(p => p !== playerId)).confirmed = false;

        // Add or update item quantity
        const currentQuantity = offer.items.get(itemId) || 0;
        offer.items.set(itemId, currentQuantity + quantity);

        trade.lastAction = Date.now();
        return { success: true, trade };
    }

    // Remove item from trade
    removeTradeItem(playerId, itemId, quantity = 1) {
        const trade = this.getPlayerTrade(playerId);
        if (!trade) {
            return { success: false, error: 'Not in a trade' };
        }

        const offer = trade.offers.get(playerId);
        const currentQuantity = offer.items.get(itemId);
        if (!currentQuantity) {
            return { success: false, error: 'Item not in trade' };
        }

        // Reset confirmation when offer changes
        offer.confirmed = false;
        trade.offers.get(trade.players.find(p => p !== playerId)).confirmed = false;

        // Update or remove item
        const newQuantity = currentQuantity - quantity;
        if (newQuantity <= 0) {
            offer.items.delete(itemId);
        } else {
            offer.items.set(itemId, newQuantity);
        }

        trade.lastAction = Date.now();
        return { success: true, trade };
    }

    // Set gold amount
    setTradeGold(playerId, amount) {
        const trade = this.getPlayerTrade(playerId);
        if (!trade) {
            return { success: false, error: 'Not in a trade' };
        }

        if (amount < 0) {
            return { success: false, error: 'Invalid gold amount' };
        }

        const offer = trade.offers.get(playerId);
        
        // Reset confirmation when offer changes
        offer.confirmed = false;
        trade.offers.get(trade.players.find(p => p !== playerId)).confirmed = false;

        offer.gold = amount;
        trade.lastAction = Date.now();
        return { success: true, trade };
    }

    // Confirm trade offer
    confirmTrade(playerId) {
        const trade = this.getPlayerTrade(playerId);
        if (!trade) {
            return { success: false, error: 'Not in a trade' };
        }

        const offer = trade.offers.get(playerId);
        offer.confirmed = true;

        // Check if both players have confirmed
        if (Array.from(trade.offers.values()).every(o => o.confirmed)) {
            return this.completeTrade(trade);
        }

        trade.lastAction = Date.now();
        return { success: true, trade };
    }

    // Complete trade
    completeTrade(trade) {
        // Validate trade one last time
        if (!this.validateTrade(trade)) {
            return { success: false, error: 'Invalid trade state' };
        }

        // Mark trade as completed
        trade.status = 'completed';
        
        // Clean up
        trade.players.forEach(playerId => {
            this.playerTrades.delete(playerId);
        });
        this.activeTrades.delete(trade.id);

        return { success: true, trade };
    }

    // Cancel trade
    cancelTrade(playerId) {
        const trade = this.getPlayerTrade(playerId);
        if (!trade) {
            return { success: false, error: 'Not in a trade' };
        }

        // Mark trade as cancelled
        trade.status = 'cancelled';
        
        // Clean up
        trade.players.forEach(playerId => {
            this.playerTrades.delete(playerId);
        });
        this.activeTrades.delete(trade.id);

        return { success: true };
    }

    // Validate trade state
    validateTrade(trade) {
        // Check if trade is active
        if (trade.status !== 'active') {
            return false;
        }

        // Check if both players have confirmed
        if (!Array.from(trade.offers.values()).every(o => o.confirmed)) {
            return false;
        }

        // Additional validation could be added here
        // - Check if players still have the items
        // - Check if players have enough inventory space
        // - Check if players have enough gold

        return true;
    }

    // Get player's active trade
    getPlayerTrade(playerId) {
        const tradeId = this.playerTrades.get(playerId);
        return tradeId ? this.activeTrades.get(tradeId) : null;
    }

    // Get pending trade requests
    getTradeRequests(playerId) {
        return Array.from(this.tradeRequests.get(playerId) || []);
    }

    // Clean up expired trades and requests
    cleanup() {
        const TRADE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
        const REQUEST_TIMEOUT = 30 * 1000; // 30 seconds
        const now = Date.now();

        // Clean up expired trades
        for (const [tradeId, trade] of this.activeTrades) {
            if ((now - trade.lastAction) > TRADE_TIMEOUT) {
                trade.status = 'expired';
                trade.players.forEach(playerId => {
                    this.playerTrades.delete(playerId);
                });
                this.activeTrades.delete(tradeId);
            }
        }

        // Clean up expired requests
        for (const [playerId, requests] of this.tradeRequests) {
            for (const senderId of requests) {
                if ((now - this.getPlayerTrade(senderId)?.created || 0) > REQUEST_TIMEOUT) {
                    requests.delete(senderId);
                }
            }
            if (requests.size === 0) {
                this.tradeRequests.delete(playerId);
            }
        }
    }
}

export default TradeSystem;
