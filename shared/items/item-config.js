// Item Configuration System
export const ITEM_TYPES = {
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

export const WEAPON_TYPES = {
    SWORD: 'sword',
    BOW: 'bow',
    WAND: 'wand'
};

export const RARITY_LEVELS = {
    COMMON: { id: 'common', color: '#B0BEC5', multiplier: 1.0 },
    UNCOMMON: { id: 'uncommon', color: '#81C784', multiplier: 1.2 },
    RARE: { id: 'rare', color: '#64B5F6', multiplier: 1.5 },
    EPIC: { id: 'epic', color: '#9575CD', multiplier: 2.0 },
    LEGENDARY: { id: 'legendary', color: '#FFB74D', multiplier: 3.0 }
};

export const ITEMS_CONFIG = {
    // Weapons
    training_sword: {
        id: 'training_sword',
        name: 'Training Sword',
        type: ITEM_TYPES.WEAPON,
        weaponType: WEAPON_TYPES.SWORD,
        rarity: RARITY_LEVELS.COMMON,
        stats: {
            damage: 10,
            speed: 1.0
        },
        upgrades: {
            maxLevel: 5,
            materials: {
                iron_ingot: 2,
                magic_crystal: 1
            }
        },
        model: 'models/weapons/training_sword.glb',
        effects: {
            trail: {
                color: '#FFFFFF',
                duration: 0.5
            }
        }
    },

    crystal_bow: {
        id: 'crystal_bow',
        name: 'Crystal Bow',
        type: ITEM_TYPES.WEAPON,
        weaponType: WEAPON_TYPES.BOW,
        rarity: RARITY_LEVELS.UNCOMMON,
        stats: {
            damage: 8,
            range: 15
        },
        upgrades: {
            maxLevel: 5,
            materials: {
                magic_crystal: 2,
                enchanted_string: 1
            }
        },
        model: 'models/weapons/crystal_bow.glb',
        effects: {
            projectile: {
                type: 'arrow',
                color: '#81D4FA',
                trail: true
            }
        }
    },

    // Armor
    apprentice_robe: {
        id: 'apprentice_robe',
        name: 'Apprentice Robe',
        type: ITEM_TYPES.ARMOR,
        rarity: RARITY_LEVELS.COMMON,
        stats: {
            defense: 5,
            magicResist: 10
        },
        upgrades: {
            maxLevel: 3,
            materials: {
                enchanted_fabric: 2,
                magic_crystal: 1
            }
        },
        model: 'models/armor/apprentice_robe.glb'
    },

    // Consumables
    healing_potion: {
        id: 'healing_potion',
        name: 'Healing Potion',
        type: ITEM_TYPES.CONSUMABLE,
        rarity: RARITY_LEVELS.COMMON,
        effect: {
            type: 'heal',
            value: 50,
            duration: 0
        },
        stackable: true,
        maxStack: 10,
        model: 'models/items/healing_potion.glb',
        useAnimation: 'animations/drink_potion.glb'
    },

    mana_crystal: {
        id: 'mana_crystal',
        name: 'Mana Crystal',
        type: ITEM_TYPES.CRYSTAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        effect: {
            type: 'mana_boost',
            value: 20,
            duration: 300
        },
        stackable: true,
        maxStack: 5,
        model: 'models/items/mana_crystal.glb',
        particles: {
            color: '#B39DDB',
            intensity: 0.5
        }
    },

    // Crafting Materials
    iron_ingot: {
        id: 'iron_ingot',
        name: 'Iron Ingot',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.COMMON,
        stackable: true,
        maxStack: 50,
        model: 'models/materials/iron_ingot.glb'
    },

    magic_crystal: {
        id: 'magic_crystal',
        name: 'Magic Crystal',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        stackable: true,
        maxStack: 20,
        model: 'models/materials/magic_crystal.glb',
        glow: {
            color: '#7E57C2',
            intensity: 0.7
        }
    },

    enchanted_fabric: {
        id: 'enchanted_fabric',
        name: 'Enchanted Fabric',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        stackable: true,
        maxStack: 30,
        model: 'models/materials/enchanted_fabric.glb',
        particles: {
            color: '#90CAF9',
            intensity: 0.3
        }
    },

    // Recipes
    crystal_sword_recipe: {
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
        },
        requiresWorkstation: true,
        workstationType: 'forge',
        craftingTime: 30, // seconds
        model: 'models/items/recipe_scroll.glb'
    },

    // New Items
    ruby_gem: {
        id: 'ruby_gem',
        name: 'Ruby',
        type: ITEM_TYPES.GEM,
        rarity: RARITY_LEVELS.RARE,
        gemType: 'RUBY',
        level: 1,
        stackable: true,
        maxStack: 10,
        model: 'models/gems/ruby.glb',
        glow: {
            color: '#E53935',
            intensity: 0.8
        }
    },

    ancient_dust: {
        id: 'ancient_dust',
        name: 'Ancient Dust',
        type: ITEM_TYPES.MATERIAL,
        rarity: RARITY_LEVELS.UNCOMMON,
        stackable: true,
        maxStack: 100,
        model: 'models/materials/ancient_dust.glb',
        particles: {
            color: '#FFB74D',
            intensity: 0.4
        }
    },

    dragon_mount: {
        id: 'dragon_mount',
        name: 'Dragon Mount',
        type: ITEM_TYPES.MOUNT,
        rarity: RARITY_LEVELS.LEGENDARY,
        stats: {
            speed: 2.0,
            flyingHeight: 50
        },
        model: 'models/mounts/dragon.glb',
        effects: {
            trail: {
                type: 'fire',
                color: '#FF5722'
            }
        }
    },

    companion_wolf: {
        id: 'companion_wolf',
        name: 'Wolf Companion',
        type: ITEM_TYPES.PET,
        rarity: RARITY_LEVELS.RARE,
        stats: {
            damage: 15,
            health: 100
        },
        abilities: {
            hunt: {
                range: 20,
                cooldown: 60
            },
            protect: {
                range: 10,
                duration: 30
            }
        },
        model: 'models/pets/wolf.glb'
    },

    lucky_charm: {
        id: 'lucky_charm',
        name: 'Lucky Charm',
        type: ITEM_TYPES.ACCESSORY,
        rarity: RARITY_LEVELS.RARE,
        stats: {
            luckBonus: 0.1,
            goldFind: 0.15
        },
        model: 'models/accessories/lucky_charm.glb',
        particles: {
            color: '#FFD700',
            intensity: 0.3
        }
    },

    rune_strength: {
        id: 'rune_strength',
        name: 'Rune of Strength',
        type: ITEM_TYPES.RUNE,
        rarity: RARITY_LEVELS.EPIC,
        effect: {
            type: 'buff',
            stat: 'strength',
            value: 20,
            duration: 300
        },
        model: 'models/runes/strength.glb',
        glow: {
            color: '#D32F2F',
            intensity: 1.0
        }
    }
};

export const ENCHANT_TYPES = {
    DAMAGE: {
        name: 'Damage',
        effect: (level) => ({ damage: 5 + (level * 2) }),
        materials: { magic_crystal: 2, ancient_dust: 1 }
    },
    CRITICAL: {
        name: 'Critical',
        effect: (level) => ({ criticalChance: 0.05 + (level * 0.02) }),
        materials: { magic_crystal: 2, lucky_essence: 1 }
    },
    SPEED: {
        name: 'Speed',
        effect: (level) => ({ speed: 0.1 + (level * 0.05) }),
        materials: { magic_crystal: 2, wind_essence: 1 }
    },
    DEFENSE: {
        name: 'Defense',
        effect: (level) => ({ defense: 3 + (level * 1.5) }),
        materials: { magic_crystal: 2, iron_essence: 1 }
    },
    HEALTH: {
        name: 'Health',
        effect: (level) => ({ health: 20 + (level * 10) }),
        materials: { magic_crystal: 2, life_essence: 1 }
    },
    MANA: {
        name: 'Mana',
        effect: (level) => ({ mana: 15 + (level * 8) }),
        materials: { magic_crystal: 2, mana_essence: 1 }
    }
};

export const GEM_TYPES = {
    RUBY: {
        name: 'Ruby',
        color: '#E53935',
        effect: (level) => ({ damage: 3 + (level * 1.5) }),
        combination: ['RUBY', 'RUBY', 'RUBY']
    },
    SAPPHIRE: {
        name: 'Sapphire',
        color: '#1E88E5',
        effect: (level) => ({ mana: 10 + (level * 5) }),
        combination: ['SAPPHIRE', 'SAPPHIRE', 'SAPPHIRE']
    },
    EMERALD: {
        name: 'Emerald',
        color: '#43A047',
        effect: (level) => ({ health: 15 + (level * 7) }),
        combination: ['EMERALD', 'EMERALD', 'EMERALD']
    },
    DIAMOND: {
        name: 'Diamond',
        color: '#90A4AE',
        effect: (level) => ({ criticalChance: 0.03 + (level * 0.01) }),
        combination: ['DIAMOND', 'DIAMOND', 'DIAMOND']
    }
};

export const UPGRADE_EFFECTS = {
    WEAPON: {
        damage: (base, level) => base * (1 + 0.2 * level),
        speed: (base, level) => base * (1 + 0.1 * level),
        range: (base, level) => base * (1 + 0.15 * level)
    },
    ARMOR: {
        defense: (base, level) => base * (1 + 0.15 * level),
        magicResist: (base, level) => base * (1 + 0.15 * level)
    }
};

export const CRAFTING_STATIONS = {
    forge: {
        name: 'Forge',
        type: 'forge',
        allowedTypes: [ITEM_TYPES.WEAPON, ITEM_TYPES.ARMOR],
        model: 'models/stations/forge.glb',
        effects: {
            particles: {
                type: 'sparks',
                color: '#FF5722'
            },
            light: {
                color: '#FF9800',
                intensity: 1.5
            },
            sound: 'sounds/forge_ambient.ogg'
        }
    },
    alchemy_table: {
        name: 'Alchemy Table',
        type: 'alchemy',
        allowedTypes: [ITEM_TYPES.CONSUMABLE, ITEM_TYPES.CRYSTAL],
        model: 'models/stations/alchemy_table.glb',
        effects: {
            particles: {
                type: 'bubbles',
                color: '#4CAF50'
            },
            light: {
                color: '#8BC34A',
                intensity: 0.8
            },
            sound: 'sounds/bubbling.ogg'
        }
    },
    enchanting_table: {
        name: 'Enchanting Table',
        type: 'enchanting',
        allowedTypes: [ITEM_TYPES.WEAPON, ITEM_TYPES.ARMOR],
        model: 'models/stations/enchanting_table.glb',
        effects: {
            particles: {
                type: 'runes',
                color: '#9C27B0'
            },
            light: {
                color: '#E1BEE7',
                intensity: 1.2
            },
            sound: 'sounds/enchanting.ogg'
        }
    }
};

export const LOOT_TABLES = {
    treasure_chest_common: {
        guaranteed: [
            { itemId: 'healing_potion', amount: { min: 1, max: 3 }, chance: 1.0 }
        ],
        random: [
            { itemId: 'iron_ingot', amount: { min: 1, max: 3 }, chance: 0.7 },
            { itemId: 'magic_crystal', amount: { min: 1, max: 2 }, chance: 0.3 },
            { itemId: 'enchanted_fabric', amount: { min: 1, max: 2 }, chance: 0.3 }
        ],
        rare: [
            { itemId: 'crystal_sword_recipe', amount: 1, chance: 0.05 }
        ]
    },
    treasure_chest_rare: {
        guaranteed: [
            { itemId: 'healing_potion', amount: { min: 2, max: 4 }, chance: 1.0 },
            { itemId: 'magic_crystal', amount: { min: 1, max: 3 }, chance: 1.0 }
        ],
        random: [
            { itemId: 'mana_crystal', amount: { min: 1, max: 2 }, chance: 0.5 },
            { itemId: 'enchanted_fabric', amount: { min: 2, max: 4 }, chance: 0.6 }
        ],
        rare: [
            { itemId: 'crystal_bow', amount: 1, chance: 0.1 }
        ]
    }
};
