import { ITEMS_CONFIG, RARITY_LEVELS, LOOT_TABLES } from '../items/item-config.js';

class LootSystem {
    constructor(inventorySystem) {
        this.inventorySystem = inventorySystem;
        this.activeLootRolls = new Map(); // playerId -> { lootId, expiryTime }
        this.lootHistory = new Map(); // playerId -> Array of past loots
    }

    // Generate loot from table
    generateLoot(tableId, playerLevel = 1, luckBonus = 0) {
        const table = LOOT_TABLES[tableId];
        if (!table) {
            return { success: false, error: 'Invalid loot table' };
        }

        const loot = [];

        // Add guaranteed items
        if (table.guaranteed) {
            for (const entry of table.guaranteed) {
                if (Math.random() <= entry.chance) {
                    const amount = this.rollAmount(entry.amount);
                    loot.push({
                        itemId: entry.itemId,
                        amount
                    });
                }
            }
        }

        // Roll for random items
        if (table.random) {
            for (const entry of table.random) {
                if (Math.random() <= (entry.chance + luckBonus)) {
                    const amount = this.rollAmount(entry.amount);
                    loot.push({
                        itemId: entry.itemId,
                        amount
                    });
                }
            }
        }

        // Roll for rare items
        if (table.rare) {
            const rareChance = 0.05 + (playerLevel * 0.01) + luckBonus; // Base 5% + 1% per level + luck
            for (const entry of table.rare) {
                if (Math.random() <= (entry.chance * rareChance)) {
                    const amount = this.rollAmount(entry.amount);
                    loot.push({
                        itemId: entry.itemId,
                        amount
                    });
                }
            }
        }

        return { success: true, loot };
    }

    // Generate quest reward
    generateQuestReward(questId, playerLevel, performance = 1) {
        const baseReward = {
            gold: Math.floor(50 * playerLevel * performance),
            experience: Math.floor(100 * playerLevel * performance),
            items: []
        };

        // Add reward items based on quest type and performance
        const rewardTable = this.getQuestRewardTable(questId, performance);
        if (rewardTable) {
            const { success, loot } = this.generateLoot(rewardTable, playerLevel);
            if (success) {
                baseReward.items = loot;
            }
        }

        return baseReward;
    }

    // Distribute loot to player
    distributeLoot(playerId, loot, source = 'general') {
        const results = {
            success: true,
            distributed: [],
            failed: [],
            gold: 0
        };

        // Add items to inventory
        for (const item of loot) {
            const result = this.inventorySystem.addItem(
                playerId,
                item.itemId,
                item.amount
            );

            if (result.success) {
                results.distributed.push(item);
            } else {
                results.failed.push(item);
                results.success = false;
            }
        }

        // Record in history
        this.recordLootHistory(playerId, {
            timestamp: Date.now(),
            source,
            items: results.distributed
        });

        return results;
    }

    // Roll loot for a group
    rollGroupLoot(groupId, tableId, participants) {
        const { success, loot } = this.generateLoot(tableId);
        if (!success) {
            return { success: false, error: 'Failed to generate loot' };
        }

        // Create loot roll session
        const lootId = `${groupId}_${Date.now()}`;
        const expiryTime = Date.now() + 60000; // 1 minute to roll

        // Initialize roll tracking for each participant
        for (const playerId of participants) {
            this.activeLootRolls.set(playerId, {
                lootId,
                expiryTime,
                hasRolled: false,
                rollValue: 0
            });
        }

        return {
            success: true,
            lootId,
            loot,
            expiryTime
        };
    }

    // Roll for item
    rollForItem(playerId, lootId) {
        const rollInfo = this.activeLootRolls.get(playerId);
        if (!rollInfo || rollInfo.lootId !== lootId) {
            return { success: false, error: 'Invalid loot roll' };
        }

        if (rollInfo.hasRolled) {
            return { success: false, error: 'Already rolled' };
        }

        if (Date.now() > rollInfo.expiryTime) {
            return { success: false, error: 'Roll expired' };
        }

        // Generate roll value (1-100)
        const rollValue = Math.floor(Math.random() * 100) + 1;
        rollInfo.hasRolled = true;
        rollInfo.rollValue = rollValue;

        return {
            success: true,
            rollValue
        };
    }

    // Helper: Roll amount within range
    rollAmount(amount) {
        if (typeof amount === 'number') {
            return amount;
        }
        if (amount.min && amount.max) {
            return Math.floor(Math.random() * (amount.max - amount.min + 1)) + amount.min;
        }
        return 1;
    }

    // Helper: Get quest reward table
    getQuestRewardTable(questId, performance) {
        // Example quest reward table mapping
        const questRewards = {
            'quest_kill_boss': performance >= 1 ? 'treasure_chest_rare' : 'treasure_chest_common',
            'quest_explore': 'treasure_chest_common',
            'quest_gather': 'treasure_chest_common'
        };

        return questRewards[questId];
    }

    // Helper: Record loot history
    recordLootHistory(playerId, entry) {
        if (!this.lootHistory.has(playerId)) {
            this.lootHistory.set(playerId, []);
        }

        const history = this.lootHistory.get(playerId);
        history.push(entry);

        // Keep only last 100 entries
        while (history.length > 100) {
            history.shift();
        }
    }

    // Get player's loot history
    getLootHistory(playerId) {
        return this.lootHistory.get(playerId) || [];
    }

    // Clean up expired loot rolls
    cleanup() {
        const now = Date.now();
        for (const [playerId, rollInfo] of this.activeLootRolls) {
            if (now > rollInfo.expiryTime) {
                this.activeLootRolls.delete(playerId);
            }
        }
    }
}

export default LootSystem;
