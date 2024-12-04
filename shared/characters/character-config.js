// Character Configuration System
const CHARACTER_CONFIG = {
    WILLOW: {
        id: 'willow_archer',
        name: 'Willow the Archer',
        type: 'Combat',
        baseStats: {
            health: 100,
            energy: 80,
            speed: 15
        },
        abilities: ['precise_shot', 'rapid_fire', 'eagle_eye']
    },
    LEO: {
        id: 'leo_swordsman',
        name: 'Leo the Swordsman',
        type: 'Combat',
        baseStats: {
            health: 120,
            energy: 100,
            speed: 12
        },
        abilities: ['slash', 'parry', 'charge']
    },
    ARIA: {
        id: 'aria_healer',
        name: 'Aria the Healer',
        type: 'Support',
        baseStats: {
            health: 90,
            energy: 120,
            speed: 10
        },
        abilities: ['heal', 'protect', 'revive']
    },
    KAI: {
        id: 'kai_crafter',
        name: 'Kai the Crafter',
        type: 'Crafter',
        baseStats: {
            health: 95,
            energy: 90,
            speed: 11
        },
        abilities: ['craft', 'analyze', 'enhance']
    },
    MAYA: {
        id: 'maya_explorer',
        name: 'Maya the Explorer',
        type: 'Explorer',
        baseStats: {
            health: 100,
            energy: 100,
            speed: 13
        },
        abilities: ['scout', 'track', 'discover']
    }
};

const CHARACTER_TEMPLATES = {
    // Combat Characters
    leo_swordsman: {
        name: "Leo the Swordsman",
        class: "swordsman",
        description: "A noble knight wielding an energy-infused sword",
        defaultAppearance: {
            body: "athletic",
            hair: "short_blonde",
            face: "determined",
            height: 1.85
        },
        uniqueFeatures: {
            weapon: {
                type: "energy_sword",
                effects: {
                    trail: { color: "#4CAF50", opacity: 0.7 },
                    glow: { color: "#81C784", intensity: 0.5 }
                }
            },
            armor: {
                style: "high_tech_knight",
                highlights: { color: "#4CAF50", intensity: 0.6 }
            }
        }
    },
    willow_archer: {
        name: "Willow the Archer",
        class: "archer",
        description: "A skilled archer with a mystical bow",
        defaultAppearance: {
            body: "athletic",
            hair: "long_brown_braid",
            face: "focused",
            height: 1.75
        },
        uniqueFeatures: {
            weapon: {
                type: "crystal_bow",
                effects: {
                    projectile: { color: "#2196F3", trail: true },
                    glow: { color: "#90CAF9", intensity: 0.4 }
                }
            },
            armor: {
                style: "nature_ranger",
                highlights: { color: "#2196F3", intensity: 0.5 }
            }
        }
    },
    aria_mage: {
        name: "Aria the Mage",
        class: "mage",
        description: "A powerful mage specializing in elemental magic",
        defaultAppearance: {
            body: "slender",
            hair: "flowing_silver",
            face: "mystical",
            height: 1.70
        },
        uniqueFeatures: {
            weapon: {
                type: "crystal_staff",
                effects: {
                    particles: { type: "arcane", color: "#9C27B0" },
                    glow: { color: "#E1BEE7", intensity: 0.6 }
                }
            },
            armor: {
                style: "arcane_robes",
                highlights: { color: "#9C27B0", intensity: 0.5 }
            }
        }
    },
    juno_healer: {
        name: "Juno the Healer",
        class: "healer",
        description: "A compassionate healer with nature-based powers",
        defaultAppearance: {
            body: "graceful",
            hair: "long_white",
            face: "serene",
            height: 1.72
        },
        uniqueFeatures: {
            weapon: {
                type: "nature_staff",
                effects: {
                    heal: { color: "#8BC34A", particles: true },
                    glow: { color: "#C5E1A5", intensity: 0.5 }
                }
            },
            armor: {
                style: "nature_robes",
                highlights: { color: "#8BC34A", intensity: 0.4 }
            }
        }
    },
    // Non-Combat Characters
    finn_craftsman: {
        name: "Finn the Master Smith",
        class: "craftsman",
        description: "A skilled blacksmith known for crafting legendary weapons",
        defaultAppearance: {
            body: "muscular",
            hair: "short_brown",
            face: "focused",
            height: 1.80
        },
        uniqueFeatures: {
            tools: {
                type: "master_hammer",
                effects: {
                    craft: { color: "#FF5722", particles: true }
                }
            },
            outfit: {
                style: "master_smith",
                highlights: { color: "#FF5722", intensity: 0.4 }
            }
        }
    }
};

// Character Customization Options
const CUSTOMIZATION_OPTIONS = {
    body: {
        types: ["athletic", "slender", "muscular", "graceful"],
        heights: { min: 1.60, max: 2.00, step: 0.01 }
    },
    face: {
        shapes: ["round", "oval", "angular", "heart"],
        eyes: ["blue", "green", "brown", "purple", "silver"],
        features: ["scars", "tattoos", "markings"]
    },
    hair: {
        styles: ["short", "long", "braided", "flowing", "tied"],
        colors: ["blonde", "brown", "black", "red", "silver", "blue"]
    },
    outfits: {
        armor: {
            light: {
                styles: ["leather", "scale", "chain"],
                patterns: ["plain", "decorated", "runic"]
            },
            medium: {
                styles: ["half_plate", "brigandine", "scale_mail"],
                patterns: ["engraved", "gilded", "damascus"]
            },
            heavy: {
                styles: ["full_plate", "gothic", "ornate"],
                patterns: ["etched", "royal", "dragon"]
            }
        },
        robes: {
            styles: ["mystic", "nature", "royal", "battle"],
            patterns: ["runes", "nature", "celestial", "elemental"]
        }
    },
    accessories: {
        capes: ["short", "long", "tattered", "royal"],
        belts: ["leather", "cloth", "chain", "rope"],
        gloves: ["fingerless", "gauntlets", "bracers", "wrapped"],
        boots: ["light", "heavy", "magical", "combat"]
    }
};

// Unlockable Customization Content
const UNLOCKABLE_CONTENT = {
    outfits: {
        legendary_armor: {
            name: "Dragon Knight Armor",
            requirement: "defeat_dragon_boss",
            features: {
                style: "dragon_plate",
                effects: {
                    particles: { type: "dragon_essence", color: "#FF5722" },
                    glow: { color: "#FF8A65", intensity: 0.6 }
                }
            }
        },
        mystic_robes: {
            name: "Archmage's Vestments",
            requirement: "master_all_elements",
            features: {
                style: "archmage",
                effects: {
                    particles: { type: "arcane_wisdom", color: "#7B1FA2" },
                    glow: { color: "#E1BEE7", intensity: 0.5 }
                }
            }
        }
    },
    weapons: {
        legendary_sword: {
            name: "Dragonslayer",
            requirement: "defeat_dragon_boss",
            effects: {
                trail: { color: "#FF5722", opacity: 0.8 },
                particles: { type: "dragon_essence", color: "#FF8A65" }
            }
        },
        master_bow: {
            name: "Windweaver",
            requirement: "master_archery",
            effects: {
                projectile: { color: "#00BCD4", trail: true },
                particles: { type: "wind_essence", color: "#80DEEA" }
            }
        }
    }
};

const CHARACTER_TYPES = {
    COMBAT: 'combat',
    SUPPORT: 'support',
    CRAFTER: 'crafter',
    EXPLORER: 'explorer'
};

const WEAPON_TYPES = {
    SWORD: {
        id: 'sword',
        name: 'Sword',
        baseSkill: 'energy_slash',
        model: 'models/weapons/sword.glb',
        effects: {
            trail: {
                color: '#64B5F6',
                duration: 0.5
            }
        }
    },
    BOW: {
        id: 'bow',
        name: 'Bow',
        baseSkill: 'healing_arrow',
        model: 'models/weapons/bow.glb',
        effects: {
            projectile: {
                type: 'arrow',
                color: '#81C784',
                trail: true
            }
        }
    },
    WAND: {
        id: 'wand',
        name: 'Wand',
        baseSkill: 'magic_shield',
        model: 'models/weapons/wand.glb',
        effects: {
            glow: {
                color: '#9575CD',
                intensity: 0.8
            }
        }
    }
};

const CHARACTERS = {
    willow_archer: {
        id: 'willow_archer',
        name: 'Willow the Archer',
        type: CHARACTER_TYPES.COMBAT,
        description: 'A young adventurer with exceptional archery skills',
        weaponType: WEAPON_TYPES.BOW,
        baseStats: {
            health: 100,
            energy: 100,
            moveSpeed: 1.2,
            range: 15
        },
        abilities: {
            passive: 'nature_affinity', // Increased movement speed in forests
            ultimate: 'rain_of_life' // Area healing ability
        },
        model: 'models/characters/willow.glb',
        animations: {
            idle: 'animations/willow/idle.glb',
            walk: 'animations/willow/walk.glb',
            skill: 'animations/willow/skill.glb'
        },
        customization: {
            outfits: ['default', 'forest_guardian', 'crystal_archer'],
            colors: ['#81C784', '#64B5F6', '#FFB74D']
        },
        unlockRequirements: {
            level: 1,
            quest: null
        }
    },

    aria_mage: {
        id: 'aria_mage',
        name: 'Aria the Mage',
        type: CHARACTER_TYPES.SUPPORT,
        description: 'A mystic who harnesses magical energy to protect allies',
        weaponType: WEAPON_TYPES.WAND,
        baseStats: {
            health: 80,
            energy: 150,
            moveSpeed: 1.0,
            range: 12
        },
        abilities: {
            passive: 'mana_surge', // Energy regeneration boost
            ultimate: 'protective_dome' // Large area shield
        },
        model: 'models/characters/aria.glb',
        animations: {
            idle: 'animations/aria/idle.glb',
            walk: 'animations/aria/walk.glb',
            skill: 'animations/aria/skill.glb'
        },
        customization: {
            outfits: ['default', 'crystal_mage', 'time_weaver'],
            colors: ['#9575CD', '#4FC3F7', '#F06292']
        },
        unlockRequirements: {
            level: 1,
            quest: null
        }
    },

    leo_knight: {
        id: 'leo_knight',
        name: 'Leo the Swordsman',
        type: CHARACTER_TYPES.COMBAT,
        description: 'A noble knight who wields an energy sword',
        weaponType: WEAPON_TYPES.SWORD,
        baseStats: {
            health: 120,
            energy: 100,
            moveSpeed: 1.0,
            range: 3
        },
        abilities: {
            passive: 'guardian_spirit', // Damage reduction aura
            ultimate: 'energy_burst' // Area energy wave
        },
        model: 'models/characters/leo.glb',
        animations: {
            idle: 'animations/leo/idle.glb',
            walk: 'animations/leo/walk.glb',
            skill: 'animations/leo/skill.glb'
        },
        customization: {
            outfits: ['default', 'royal_knight', 'crystal_warrior'],
            colors: ['#64B5F6', '#FFB74D', '#90A4AE']
        },
        unlockRequirements: {
            level: 1,
            quest: null
        }
    },

    juno_healer: {
        id: 'juno_healer',
        name: 'Juno the Healer',
        type: CHARACTER_TYPES.SUPPORT,
        description: 'A kind spirit dedicated to helping others',
        weaponType: WEAPON_TYPES.WAND,
        baseStats: {
            health: 90,
            energy: 130,
            moveSpeed: 1.1,
            range: 10
        },
        abilities: {
            passive: 'healing_aura', // Passive healing to nearby allies
            ultimate: 'revival_light' // Area heal and energy restore
        },
        model: 'models/characters/juno.glb',
        animations: {
            idle: 'animations/juno/idle.glb',
            walk: 'animations/juno/walk.glb',
            skill: 'animations/juno/skill.glb'
        },
        customization: {
            outfits: ['default', 'crystal_healer', 'nature_spirit'],
            colors: ['#81C784', '#F06292', '#FFB74D']
        },
        unlockRequirements: {
            level: 5,
            quest: 'healing_initiation'
        }
    },

    maya_explorer: {
        id: 'maya_explorer',
        name: 'Maya the Explorer',
        type: CHARACTER_TYPES.EXPLORER,
        description: 'An adventurous soul who discovers hidden treasures',
        weaponType: WEAPON_TYPES.BOW,
        baseStats: {
            health: 100,
            energy: 110,
            moveSpeed: 1.3,
            range: 8
        },
        abilities: {
            passive: 'treasure_sense', // Detect nearby treasures
            ultimate: 'path_finder' // Reveal hidden paths
        },
        model: 'models/characters/maya.glb',
        animations: {
            idle: 'animations/maya/idle.glb',
            walk: 'animations/maya/walk.glb',
            skill: 'animations/maya/skill.glb'
        },
        customization: {
            outfits: ['default', 'treasure_hunter', 'crystal_seeker'],
            colors: ['#FFB74D', '#81C784', '#64B5F6']
        },
        unlockRequirements: {
            level: 10,
            quest: 'explorer_journey'
        }
    },

    kai_crafter: {
        id: 'kai_crafter',
        name: 'Kai the Crafter',
        type: CHARACTER_TYPES.CRAFTER,
        description: 'A skilled artisan who creates magical items',
        weaponType: WEAPON_TYPES.SWORD,
        baseStats: {
            health: 110,
            energy: 120,
            moveSpeed: 1.0,
            range: 5
        },
        abilities: {
            passive: 'resource_finder', // Better gathering yields
            ultimate: 'master_craft' // Temporary crafting boost
        },
        model: 'models/characters/kai.glb',
        animations: {
            idle: 'animations/kai/idle.glb',
            walk: 'animations/kai/walk.glb',
            skill: 'animations/kai/skill.glb'
        },
        customization: {
            outfits: ['default', 'master_artisan', 'crystal_smith'],
            colors: ['#90A4AE', '#FFB74D', '#64B5F6']
        },
        unlockRequirements: {
            level: 8,
            quest: 'crafting_mastery'
        }
    }
};

const CHARACTER_PROGRESSION = {
    maxLevel: 50,
    experienceTable: Array.from({ length: 50 }, (_, i) => Math.floor(100 * Math.pow(1.2, i))),
    unlockables: {
        5: {
            type: 'character',
            id: 'juno_healer',
            name: 'Juno the Healer'
        },
        8: {
            type: 'character',
            id: 'kai_crafter',
            name: 'Kai the Crafter'
        },
        10: {
            type: 'character',
            id: 'maya_explorer',
            name: 'Maya the Explorer'
        },
        15: {
            type: 'outfit',
            characterId: 'willow_archer',
            outfitId: 'crystal_archer'
        },
        20: {
            type: 'outfit',
            characterId: 'aria_mage',
            outfitId: 'time_weaver'
        }
    },
    statGrowth: {
        health: (level, base) => base + (level * 5),
        energy: (level, base) => base + (level * 4),
        moveSpeed: (level, base) => base + (level * 0.01)
    }
};

module.exports = {
    CHARACTER_CONFIG,
    CHARACTER_TEMPLATES,
    CUSTOMIZATION_OPTIONS,
    UNLOCKABLE_CONTENT,
    CHARACTER_TYPES,
    WEAPON_TYPES,
    CHARACTERS,
    CHARACTER_PROGRESSION
};
