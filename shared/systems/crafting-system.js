import { ITEMS_CONFIG, CRAFTING_STATIONS, UPGRADE_EFFECTS, ENCHANT_TYPES, GEM_TYPES } from '../items/item-config.js';

class CraftingSystem {
    constructor(inventorySystem) {
        this.inventorySystem = inventorySystem;
        this.activeCrafting = new Map(); // playerId -> { recipeId, startTime, stationId }
        this.knownRecipes = new Map(); // playerId -> Set of recipeIds
        this.craftingStations = new Map(); // stationId -> { type, position, inUse }
    }

    // Initialize crafting station
    initCraftingStation(stationId, type, position) {
        if (!CRAFTING_STATIONS[type]) {
            return { success: false, error: 'Invalid station type' };
        }

        this.craftingStations.set(stationId, {
            type,
            position,
            inUse: false
        });

        return { success: true, stationId };
    }

    // Start crafting process
    startCrafting(playerId, recipeId, stationId) {
        // Check if player is already crafting
        if (this.activeCrafting.has(playerId)) {
            return { success: false, error: 'Already crafting' };
        }

        // Validate recipe
        const recipe = ITEMS_CONFIG[recipeId];
        if (!recipe || recipe.type !== 'recipe') {
            return { success: false, error: 'Invalid recipe' };
        }

        // Check if player knows the recipe
        if (!this.knownRecipes.get(playerId)?.has(recipeId)) {
            return { success: false, error: 'Recipe not known' };
        }

        // Check crafting station
        if (recipe.requiresWorkstation) {
            const station = this.craftingStations.get(stationId);
            if (!station) {
                return { success: false, error: 'Invalid station' };
            }

            if (station.inUse) {
                return { success: false, error: 'Station in use' };
            }

            if (station.type !== recipe.workstationType) {
                return { success: false, error: 'Wrong station type' };
            }

            station.inUse = true;
        }

        // Check materials
        const materials = recipe.materials;
        for (const [itemId, amount] of Object.entries(materials)) {
            if (!this.inventorySystem.hasItem(playerId, itemId, amount)) {
                return { success: false, error: `Missing material: ${ITEMS_CONFIG[itemId].name}` };
            }
        }

        // Remove materials
        for (const [itemId, amount] of Object.entries(materials)) {
            const result = this.inventorySystem.removeItem(playerId, itemId, amount);
            if (!result.success) {
                return { success: false, error: 'Failed to remove materials' };
            }
        }

        // Start crafting
        this.activeCrafting.set(playerId, {
            recipeId,
            startTime: Date.now(),
            stationId
        });

        return {
            success: true,
            craftingTime: recipe.craftingTime,
            product: recipe.product
        };
    }

    // Complete crafting process
    completeCrafting(playerId) {
        const crafting = this.activeCrafting.get(playerId);
        if (!crafting) {
            return { success: false, error: 'No active crafting' };
        }

        const recipe = ITEMS_CONFIG[crafting.recipeId];
        const timePassed = (Date.now() - crafting.startTime) / 1000;

        if (timePassed < recipe.craftingTime) {
            return { success: false, error: 'Crafting not complete' };
        }

        // Free crafting station
        if (crafting.stationId) {
            const station = this.craftingStations.get(crafting.stationId);
            if (station) {
                station.inUse = false;
            }
        }

        // Add crafted item to inventory
        const result = this.inventorySystem.addItem(
            playerId,
            recipe.product.itemId,
            recipe.product.amount
        );

        this.activeCrafting.delete(playerId);

        return result;
    }

    // Cancel crafting process
    cancelCrafting(playerId) {
        const crafting = this.activeCrafting.get(playerId);
        if (!crafting) {
            return { success: false, error: 'No active crafting' };
        }

        // Free crafting station
        if (crafting.stationId) {
            const station = this.craftingStations.get(crafting.stationId);
            if (station) {
                station.inUse = false;
            }
        }

        // Return materials
        const recipe = ITEMS_CONFIG[crafting.recipeId];
        for (const [itemId, amount] of Object.entries(recipe.materials)) {
            this.inventorySystem.addItem(playerId, itemId, amount);
        }

        this.activeCrafting.delete(playerId);
        return { success: true };
    }

    // Learn new recipe
    learnRecipe(playerId, recipeId) {
        if (!this.knownRecipes.has(playerId)) {
            this.knownRecipes.set(playerId, new Set());
        }

        const recipes = this.knownRecipes.get(playerId);
        if (recipes.has(recipeId)) {
            return { success: false, error: 'Recipe already known' };
        }

        const recipe = ITEMS_CONFIG[recipeId];
        if (!recipe || recipe.type !== 'recipe') {
            return { success: false, error: 'Invalid recipe' };
        }

        recipes.add(recipeId);
        return { success: true };
    }

    // Upgrade item
    upgradeItem(playerId, itemId, slotIndex) {
        const inventory = this.inventorySystem.getInventory(playerId);
        if (!inventory) {
            return { success: false, error: 'Inventory not found' };
        }

        const itemSlot = inventory.slots[slotIndex];
        if (!itemSlot || itemSlot.itemId !== itemId) {
            return { success: false, error: 'Item not found' };
        }

        const itemConfig = ITEMS_CONFIG[itemId];
        if (!itemConfig.upgrades) {
            return { success: false, error: 'Item cannot be upgraded' };
        }

        const currentLevel = itemSlot.upgradeLevel || 0;
        if (currentLevel >= itemConfig.upgrades.maxLevel) {
            return { success: false, error: 'Item at max level' };
        }

        // Check upgrade materials
        for (const [materialId, amount] of Object.entries(itemConfig.upgrades.materials)) {
            if (!this.inventorySystem.hasItem(playerId, materialId, amount)) {
                return { success: false, error: `Missing material: ${ITEMS_CONFIG[materialId].name}` };
            }
        }

        // Remove materials
        for (const [materialId, amount] of Object.entries(itemConfig.upgrades.materials)) {
            const result = this.inventorySystem.removeItem(playerId, materialId, amount);
            if (!result.success) {
                return { success: false, error: 'Failed to remove materials' };
            }
        }

        // Apply upgrade
        itemSlot.upgradeLevel = currentLevel + 1;

        // Update item stats
        if (itemConfig.type === 'weapon' || itemConfig.type === 'armor') {
            itemSlot.stats = this.calculateUpgradedStats(itemConfig, currentLevel + 1);
        }

        return {
            success: true,
            level: currentLevel + 1,
            stats: itemSlot.stats
        };
    }

    // Calculate upgraded stats
    calculateUpgradedStats(itemConfig, level) {
        const stats = {};
        const effectType = itemConfig.type.toUpperCase();

        for (const [stat, baseValue] of Object.entries(itemConfig.stats)) {
            if (UPGRADE_EFFECTS[effectType] && UPGRADE_EFFECTS[effectType][stat]) {
                stats[stat] = UPGRADE_EFFECTS[effectType][stat](baseValue, level);
            } else {
                stats[stat] = baseValue;
            }
        }

        return stats;
    }

    // Get crafting progress
    getCraftingProgress(playerId) {
        const crafting = this.activeCrafting.get(playerId);
        if (!crafting) {
            return null;
        }

        const recipe = ITEMS_CONFIG[crafting.recipeId];
        const timePassed = (Date.now() - crafting.startTime) / 1000;
        const progress = Math.min(timePassed / recipe.craftingTime, 1);

        return {
            recipeId: crafting.recipeId,
            progress,
            timeRemaining: Math.max(0, recipe.craftingTime - timePassed)
        };
    }

    // Get known recipes
    getKnownRecipes(playerId) {
        return Array.from(this.knownRecipes.get(playerId) || []);
    }

    // Get available crafting stations
    getAvailableStations() {
        const available = [];
        for (const [stationId, station] of this.craftingStations) {
            if (!station.inUse) {
                available.push({
                    id: stationId,
                    type: station.type,
                    position: station.position
                });
            }
        }
        return available;
    }

    // Enchant item
    enchantItem(playerId, itemId, slotIndex, enchantType) {
        const inventory = this.inventorySystem.getInventory(playerId);
        if (!inventory) {
            return { success: false, error: 'Inventory not found' };
        }

        const itemSlot = inventory.slots[slotIndex];
        if (!itemSlot || itemSlot.itemId !== itemId) {
            return { success: false, error: 'Item not found' };
        }

        const itemConfig = ITEMS_CONFIG[itemId];
        const enchantConfig = ENCHANT_TYPES[enchantType];

        if (!enchantConfig) {
            return { success: false, error: 'Invalid enchant type' };
        }

        // Check if item can be enchanted
        if (itemConfig.type !== 'weapon' && itemConfig.type !== 'armor') {
            return { success: false, error: 'Item cannot be enchanted' };
        }

        // Check current enchant level
        const currentLevel = itemSlot.enchantLevel?.[enchantType] || 0;
        if (currentLevel >= 5) { // Max enchant level
            return { success: false, error: 'Maximum enchant level reached' };
        }

        // Check materials
        for (const [materialId, amount] of Object.entries(enchantConfig.materials)) {
            if (!this.inventorySystem.hasItem(playerId, materialId, amount)) {
                return { success: false, error: `Missing material: ${ITEMS_CONFIG[materialId].name}` };
            }
        }

        // Remove materials
        for (const [materialId, amount] of Object.entries(enchantConfig.materials)) {
            const result = this.inventorySystem.removeItem(playerId, materialId, amount);
            if (!result.success) {
                return { success: false, error: 'Failed to remove materials' };
            }
        }

        // Apply enchantment
        if (!itemSlot.enchantLevel) {
            itemSlot.enchantLevel = {};
        }
        itemSlot.enchantLevel[enchantType] = currentLevel + 1;

        // Apply enchant effects
        if (!itemSlot.enchantEffects) {
            itemSlot.enchantEffects = {};
        }
        itemSlot.enchantEffects[enchantType] = enchantConfig.effect(currentLevel + 1);

        return {
            success: true,
            level: currentLevel + 1,
            effects: itemSlot.enchantEffects[enchantType]
        };
    }

    // Socket gem
    socketGem(playerId, itemId, slotIndex, gemId, gemSlotIndex) {
        const inventory = this.inventorySystem.getInventory(playerId);
        if (!inventory) {
            return { success: false, error: 'Inventory not found' };
        }

        const itemSlot = inventory.slots[slotIndex];
        if (!itemSlot || itemSlot.itemId !== itemId) {
            return { success: false, error: 'Item not found' };
        }

        const gemSlot = inventory.slots[gemSlotIndex];
        if (!gemSlot || gemSlot.itemId !== gemId) {
            return { success: false, error: 'Gem not found' };
        }

        const itemConfig = ITEMS_CONFIG[itemId];
        const gemConfig = ITEMS_CONFIG[gemId];

        // Check if item can have gems
        if (itemConfig.type !== 'weapon' && itemConfig.type !== 'armor') {
            return { success: false, error: 'Item cannot have gems' };
        }

        // Check if gem slots are available
        if (!itemSlot.gemSlots) {
            itemSlot.gemSlots = [];
        }

        if (itemSlot.gemSlots.length >= 3) { // Max 3 gem slots
            return { success: false, error: 'No gem slots available' };
        }

        // Remove gem from inventory
        const removeResult = this.inventorySystem.removeItem(playerId, gemId, 1);
        if (!removeResult.success) {
            return { success: false, error: 'Failed to remove gem' };
        }

        // Add gem to item
        itemSlot.gemSlots.push({
            gemId,
            gemType: gemConfig.gemType,
            level: gemConfig.level
        });

        // Apply gem effects
        if (!itemSlot.gemEffects) {
            itemSlot.gemEffects = {};
        }
        const gemType = GEM_TYPES[gemConfig.gemType];
        itemSlot.gemEffects[gemConfig.gemType] = gemType.effect(gemConfig.level);

        // Check for gem combinations
        this.checkGemCombinations(itemSlot);

        return {
            success: true,
            gemSlots: itemSlot.gemSlots,
            effects: itemSlot.gemEffects
        };
    }

    // Check and apply gem combinations
    checkGemCombinations(itemSlot) {
        if (!itemSlot.gemSlots || itemSlot.gemSlots.length < 3) {
            return;
        }

        const gemTypes = itemSlot.gemSlots.map(gem => gem.gemType);
        
        for (const [type, config] of Object.entries(GEM_TYPES)) {
            if (this.arraysEqual(gemTypes.sort(), config.combination.sort())) {
                // Apply combination bonus
                const combinedLevel = itemSlot.gemSlots.reduce((sum, gem) => sum + gem.level, 0);
                const averageLevel = Math.floor(combinedLevel / 3);
                
                itemSlot.gemEffects[`${type}_COMBINED`] = config.effect(averageLevel * 2); // Double effect for combination
                break;
            }
        }
    }

    // Helper: Compare arrays
    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }
}

export default CraftingSystem;
