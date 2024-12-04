import { v4 as uuidv4 } from 'uuid';

class PartySystem {
    constructor() {
        this.parties = new Map(); // partyId -> Party
        this.playerParties = new Map(); // playerId -> partyId
        this.invites = new Map(); // playerId -> Set of pending invites
    }

    // Create a new party
    createParty(leaderId) {
        const partyId = uuidv4();
        const party = {
            id: partyId,
            leader: leaderId,
            members: new Set([leaderId]),
            maxSize: 5,
            created: Date.now(),
            settings: {
                lootSharing: 'free-for-all', // 'free-for-all', 'round-robin', 'leader'
                experienceSharing: true,
                inviteOnly: true
            }
        };

        this.parties.set(partyId, party);
        this.playerParties.set(leaderId, partyId);

        return party;
    }

    // Send party invite
    sendInvite(senderId, targetId) {
        // Validate sender
        const senderPartyId = this.playerParties.get(senderId);
        if (!senderPartyId) {
            return { success: false, error: 'Sender is not in a party' };
        }

        const party = this.parties.get(senderPartyId);
        if (party.leader !== senderId) {
            return { success: false, error: 'Only party leader can send invites' };
        }

        if (party.members.size >= party.maxSize) {
            return { success: false, error: 'Party is full' };
        }

        // Validate target
        if (this.playerParties.has(targetId)) {
            return { success: false, error: 'Player is already in a party' };
        }

        // Add invite
        if (!this.invites.has(targetId)) {
            this.invites.set(targetId, new Set());
        }
        this.invites.get(targetId).add(senderPartyId);

        return { success: true, partyId: senderPartyId };
    }

    // Accept party invite
    acceptInvite(playerId, partyId) {
        // Validate invite
        const playerInvites = this.invites.get(playerId);
        if (!playerInvites?.has(partyId)) {
            return { success: false, error: 'Invalid invite' };
        }

        const party = this.parties.get(partyId);
        if (!party) {
            return { success: false, error: 'Party no longer exists' };
        }

        if (party.members.size >= party.maxSize) {
            return { success: false, error: 'Party is full' };
        }

        // Join party
        party.members.add(playerId);
        this.playerParties.set(playerId, partyId);

        // Clear invites
        this.invites.delete(playerId);

        return { success: true, party };
    }

    // Leave party
    leaveParty(playerId) {
        const partyId = this.playerParties.get(playerId);
        if (!partyId) {
            return { success: false, error: 'Not in a party' };
        }

        const party = this.parties.get(partyId);
        if (!party) {
            return { success: false, error: 'Party not found' };
        }

        // Remove from party
        party.members.delete(playerId);
        this.playerParties.delete(playerId);

        // If leader leaves, assign new leader or disband
        if (party.leader === playerId) {
            if (party.members.size > 0) {
                party.leader = Array.from(party.members)[0];
            } else {
                this.parties.delete(partyId);
            }
        }

        return { success: true, party };
    }

    // Kick member from party
    kickMember(leaderId, targetId) {
        const partyId = this.playerParties.get(leaderId);
        if (!partyId) {
            return { success: false, error: 'Not in a party' };
        }

        const party = this.parties.get(partyId);
        if (party.leader !== leaderId) {
            return { success: false, error: 'Only leader can kick members' };
        }

        if (!party.members.has(targetId)) {
            return { success: false, error: 'Target is not in party' };
        }

        // Remove member
        party.members.delete(targetId);
        this.playerParties.delete(targetId);

        return { success: true, party };
    }

    // Update party settings
    updatePartySettings(leaderId, settings) {
        const partyId = this.playerParties.get(leaderId);
        if (!partyId) {
            return { success: false, error: 'Not in a party' };
        }

        const party = this.parties.get(partyId);
        if (party.leader !== leaderId) {
            return { success: false, error: 'Only leader can update settings' };
        }

        // Update settings
        party.settings = {
            ...party.settings,
            ...settings
        };

        return { success: true, party };
    }

    // Get party information
    getPartyInfo(partyId) {
        return this.parties.get(partyId);
    }

    // Get player's party
    getPlayerParty(playerId) {
        const partyId = this.playerParties.get(playerId);
        return partyId ? this.parties.get(partyId) : null;
    }

    // Get pending invites
    getPlayerInvites(playerId) {
        return Array.from(this.invites.get(playerId) || []);
    }

    // Check if players are in same party
    areInSameParty(player1Id, player2Id) {
        const party1Id = this.playerParties.get(player1Id);
        const party2Id = this.playerParties.get(player2Id);
        return party1Id && party1Id === party2Id;
    }

    // Distribute experience to party
    distributeExperience(partyId, experience, sourcePlayerId) {
        const party = this.parties.get(partyId);
        if (!party || !party.settings.experienceSharing) {
            return null;
        }

        const memberCount = party.members.size;
        const sharedExperience = Math.floor(experience * 1.2 / memberCount); // 20% bonus for party play

        const distribution = new Map();
        for (const memberId of party.members) {
            distribution.set(memberId, sharedExperience);
        }

        return distribution;
    }

    // Handle loot distribution
    distributeLoot(partyId, loot) {
        const party = this.parties.get(partyId);
        if (!party) return null;

        const distribution = new Map();
        switch (party.settings.lootSharing) {
            case 'round-robin':
                // Implement round-robin distribution
                break;
            case 'leader':
                distribution.set(party.leader, loot);
                break;
            case 'free-for-all':
            default:
                // Let game handle it naturally
                break;
        }

        return distribution;
    }

    // Clean up expired invites
    cleanupInvites() {
        const INVITE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();

        for (const [playerId, invites] of this.invites) {
            for (const partyId of invites) {
                const party = this.parties.get(partyId);
                if (!party || (now - party.created) > INVITE_TIMEOUT) {
                    invites.delete(partyId);
                }
            }

            if (invites.size === 0) {
                this.invites.delete(playerId);
            }
        }
    }
}

export default PartySystem;
