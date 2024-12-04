const ITEM_TYPES = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    CONSUMABLE: 'consumable',
    MATERIAL: 'material',
    CRYSTAL: 'crystal',
    QUEST: 'quest',
    RECIPE: 'recipe',
    ACCESSORY: 'accessory',
    GEM: 'gem',
    RUNE: 'rune',
    MOUNT: 'mount',
    PET: 'pet'
};

const RARITY_LEVELS = {
    COMMON: 'Common',
    UNCOMMON: 'Uncommon',
    RARE: 'Rare',
    EPIC: 'Epic',
    LEGENDARY: 'Legendary'
};

const ITEM_CONFIG = {
    TRAINING_SWORD: {
        id: 'training_sword',
        name: 'Training Sword',
        type: ITEM_TYPES.WEAPON,
        rarity: RARITY_LEVELS.COMMON,
        stats: {
            damage: 10,
            speed: 1.2
        }
    },
    CRYSTAL_BOW: {
        id: 'crystal_bow',
        name: 'Crystal Bow',
        type: ITEM_TYPES.WEAPON,
        rarity: RARITY_LEVELS.UNCOMMON,
        stats: {
            damage: 8,
            range: 15
        }
    },
    APPRENTICE_ROBE: {
        id: 'apprentice_robe',
        name: 'Apprentice Robe',
        type: ITEM_TYPES.ARMOR,
        rarity: RARITY_LEVELS.COMMON,
        stats: {
            defense: 5,
            magicResist: 10
        }
    },
    HEALING_POTION: {
        id: 'healing_potion',
        name: 'Healing Potion',
        type: ITEM_TYPES.CONSUMABLE,
        rarity: RARITY_LEVELS.COMMON,
        effect: {
            type: 'heal',
            value: 50
        }
    },
    MANA_CRYSTAL: {
        id: 'mana_crystal',
        name: 'Mana Crystal',
        type: ITEM_TYPES.CRYSTAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        effect: {
            type: 'mana_boost',
            value: 20,
            duration: 300
        }
    },
    IRON_INGOT: {
        id: 'iron_ingot',
        name: 'Iron Ingot',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.COMMON,
        stackable: true,
        maxStack: 50
    },
    MAGIC_CRYSTAL: {
        id: 'magic_crystal',
        name: 'Magic Crystal',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        stackable: true,
        maxStack: 20
    },
    ENCHANTED_FABRIC: {
        id: 'enchanted_fabric',
        name: 'Enchanted Fabric',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        stackable: true,
        maxStack: 30
    },
    CRYSTAL_SWORD_RECIPE: {
        id: 'crystal_sword_recipe',
        name: 'Crystal Sword Recipe',
        type: ITEM_TYPES.RECIPE,
        rarity: RARITY_LEVELS.RARE,
        product: {
            itemId: 'crystal_sword',
            amount: 1
        },
        materials: {
            iron_ingot: 3,
            magic_crystal: 2,
            pure_crystal: 1
        }
    },
    RUBY_GEM: {
        id: 'ruby_gem',
        name: 'Ruby',
        type: ITEM_TYPES.GEM,
        rarity: RARITY_LEVELS.RARE,
        gemType: 'RUBY',
        level: 1,
        stackable: true,
        maxStack: 10
    },
    ANCIENT_DUST: {
        id: 'ancient_dust',
        name: 'Ancient Dust',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        stackable: true,
        maxStack: 100
    },
    DRAGON_MOUNT: {
        id: 'dragon_mount',
        name: 'Dragon Mount',
        type: ITEM_TYPES.MOUNT,
        rarity: RARITY_LEVELS.LEGENDARY,
        stats: {
            speed: 2.0,
            flyingHeight: 50
        }
    },
    COMPANION_WOLF: {
        id: 'companion_wolf',
        name: 'Wolf Companion',
        type: ITEM_TYPES.PET,
        rarity: RARITY_LEVELS.RARE,
        stats: {
            damage: 15,
            health: 100
        }
    },
    LUCKY_CHARM: {
        id: 'lucky_charm',
        name: 'Lucky Charm',
        type: ITEM_TYPES.ACCESSORY,
        rarity: RARITY_LEVELS.RARE,
        stats: {
            luckBonus: 0.1,
            goldFind: 0.15
        }
    },
    RUNE_STRENGTH: {
        id: 'rune_strength',
        name: 'Rune of Strength',
        type: ITEM_TYPES.RUNE,
        rarity: RARITY_LEVELS.EPIC,
        effect: {
            type: 'buff',
            stat: 'strength',
            value: 20,
            duration: 300
        }
    }
};

module.exports = {
    ITEM_TYPES,
    RARITY_LEVELS,
    ITEM_CONFIG
};
