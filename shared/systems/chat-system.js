class ChatSystem {
    constructor() {
        this.channels = new Map(); // channelId -> Channel
        this.playerChannels = new Map(); // playerId -> Set of channelIds
        this.messageHistory = new Map(); // channelId -> Array of messages
        this.mutedPlayers = new Map(); // playerId -> Map of mutedPlayerIds -> expiry
        this.channelMutes = new Map(); // channelId -> Map of mutedPlayerIds -> expiry
        this.messageRateLimit = new Map(); // playerId -> last message timestamps
    }

    // Channel types
    static CHANNEL_TYPES = {
        GLOBAL: 'global',
        REGION: 'region',
        PARTY: 'party',
        PRIVATE: 'private',
        TRADE: 'trade',
        SYSTEM: 'system'
    };

    // Create new channel
    createChannel(type, options = {}) {
        const channelId = options.id || `${type}_${Date.now()}`;
        const channel = {
            id: channelId,
            type,
            name: options.name || channelId,
            members: new Set(options.members || []),
            moderators: new Set(options.moderators || []),
            settings: {
                maxMembers: options.maxMembers || 100,
                messageHistory: options.messageHistory || 100,
                rateLimit: options.rateLimit || 1000, // ms between messages
                moderated: options.moderated || false
            }
        };

        this.channels.set(channelId, channel);
        this.messageHistory.set(channelId, []);

        // Add members to channel
        channel.members.forEach(playerId => {
            this.addPlayerToChannel(playerId, channelId);
        });

        return channel;
    }

    // Send message to channel
    sendMessage(playerId, channelId, content, type = 'text') {
        const channel = this.channels.get(channelId);
        if (!channel) {
            return { success: false, error: 'Channel not found' };
        }

        // Check if player is in channel
        if (!channel.members.has(playerId)) {
            return { success: false, error: 'Not a member of channel' };
        }

        // Check if player is muted
        if (this.isPlayerMuted(playerId, channelId)) {
            return { success: false, error: 'You are muted in this channel' };
        }

        // Check rate limit
        if (!this.checkRateLimit(playerId, channel)) {
            return { success: false, error: 'Message rate limit exceeded' };
        }

        // Create message
        const message = {
            id: `${channelId}_${Date.now()}_${playerId}`,
            channelId,
            senderId: playerId,
            content,
            type,
            timestamp: Date.now()
        };

        // Add to history
        this.addMessageToHistory(channelId, message);

        return { success: true, message };
    }

    // Add message to history
    addMessageToHistory(channelId, message) {
        const history = this.messageHistory.get(channelId);
        const channel = this.channels.get(channelId);

        if (history && channel) {
            history.push(message);
            // Trim history if it exceeds limit
            while (history.length > channel.settings.messageHistory) {
                history.shift();
            }
        }
    }

    // Join channel
    joinChannel(playerId, channelId) {
        const channel = this.channels.get(channelId);
        if (!channel) {
            return { success: false, error: 'Channel not found' };
        }

        if (channel.members.size >= channel.settings.maxMembers) {
            return { success: false, error: 'Channel is full' };
        }

        this.addPlayerToChannel(playerId, channelId);
        channel.members.add(playerId);

        return { success: true, channel };
    }

    // Leave channel
    leaveChannel(playerId, channelId) {
        const channel = this.channels.get(channelId);
        if (!channel) {
            return { success: false, error: 'Channel not found' };
        }

        this.removePlayerFromChannel(playerId, channelId);
        channel.members.delete(playerId);

        // Clean up empty channels
        if (channel.members.size === 0 && channel.type !== ChatSystem.CHANNEL_TYPES.GLOBAL) {
            this.channels.delete(channelId);
            this.messageHistory.delete(channelId);
        }

        return { success: true };
    }

    // Mute player
    mutePlayer(moderatorId, targetId, channelId, duration = 300000) { // 5 minutes default
        const channel = this.channels.get(channelId);
        if (!channel) {
            return { success: false, error: 'Channel not found' };
        }

        if (!channel.moderators.has(moderatorId)) {
            return { success: false, error: 'Not a moderator' };
        }

        const expiry = Date.now() + duration;
        
        if (!this.channelMutes.has(channelId)) {
            this.channelMutes.set(channelId, new Map());
        }
        this.channelMutes.get(channelId).set(targetId, expiry);

        return { success: true, expiry };
    }

    // Unmute player
    unmutePlayer(moderatorId, targetId, channelId) {
        const channel = this.channels.get(channelId);
        if (!channel) {
            return { success: false, error: 'Channel not found' };
        }

        if (!channel.moderators.has(moderatorId)) {
            return { success: false, error: 'Not a moderator' };
        }

        const channelMutes = this.channelMutes.get(channelId);
        if (channelMutes) {
            channelMutes.delete(targetId);
        }

        return { success: true };
    }

    // Check if player is muted
    isPlayerMuted(playerId, channelId) {
        const channelMutes = this.channelMutes.get(channelId);
        if (!channelMutes) return false;

        const expiry = channelMutes.get(playerId);
        if (!expiry) return false;

        if (Date.now() > expiry) {
            channelMutes.delete(playerId);
            return false;
        }

        return true;
    }

    // Check message rate limit
    checkRateLimit(playerId, channel) {
        const now = Date.now();
        const playerRates = this.messageRateLimit.get(playerId) || [];
        
        // Clean up old timestamps
        while (playerRates.length > 0 && playerRates[0] < now - channel.settings.rateLimit) {
            playerRates.shift();
        }

        if (playerRates.length >= 5) { // Max 5 messages per rate limit period
            return false;
        }

        playerRates.push(now);
        this.messageRateLimit.set(playerId, playerRates);
        return true;
    }

    // Get channel messages
    getChannelMessages(channelId, limit = 50) {
        const history = this.messageHistory.get(channelId);
        if (!history) return [];

        return history.slice(-limit);
    }

    // Get player channels
    getPlayerChannels(playerId) {
        return Array.from(this.playerChannels.get(playerId) || []);
    }

    // Helper: Add player to channel tracking
    addPlayerToChannel(playerId, channelId) {
        if (!this.playerChannels.has(playerId)) {
            this.playerChannels.set(playerId, new Set());
        }
        this.playerChannels.get(playerId).add(channelId);
    }

    // Helper: Remove player from channel tracking
    removePlayerFromChannel(playerId, channelId) {
        const channels = this.playerChannels.get(playerId);
        if (channels) {
            channels.delete(channelId);
            if (channels.size === 0) {
                this.playerChannels.delete(playerId);
            }
        }
    }

    // Clean up expired mutes and empty channels
    cleanup() {
        const now = Date.now();

        // Clean up channel mutes
        for (const [channelId, mutes] of this.channelMutes) {
            for (const [playerId, expiry] of mutes) {
                if (now > expiry) {
                    mutes.delete(playerId);
                }
            }
            if (mutes.size === 0) {
                this.channelMutes.delete(channelId);
            }
        }

        // Clean up player mutes
        for (const [playerId, mutes] of this.mutedPlayers) {
            for (const [mutedId, expiry] of mutes) {
                if (now > expiry) {
                    mutes.delete(mutedId);
                }
            }
            if (mutes.size === 0) {
                this.mutedPlayers.delete(playerId);
            }
        }

        // Clean up rate limit history
        for (const [playerId, timestamps] of this.messageRateLimit) {
            const oldestAllowed = now - 60000; // 1 minute
            while (timestamps.length > 0 && timestamps[0] < oldestAllowed) {
                timestamps.shift();
            }
            if (timestamps.length === 0) {
                this.messageRateLimit.delete(playerId);
            }
        }
    }
}

export default ChatSystem;
