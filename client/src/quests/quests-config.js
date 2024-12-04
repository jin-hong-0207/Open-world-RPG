export const QUESTS_CONFIG = {
    PROTECT_VILLAGE: {
        id: 'protect_village',
        name: 'Protect the Village',
        giver: 'elder',
        type: 'combat',
        description: 'Defeat the monsters threatening the village',
        objectives: [
            {
                type: 'kill',
                target: 'monster',
                count: 5,
                description: 'Defeat 5 monsters near the village'
            }
        ],
        rewards: {
            experience: 100,
            gold: 50,
            items: ['health_potion']
        },
        level_requirement: 1
    },
    GATHER_MATERIALS: {
        id: 'gather_materials',
        name: 'Rare Materials',
        giver: 'blacksmith',
        type: 'gathering',
        description: 'Collect special materials for the blacksmith',
        objectives: [
            {
                type: 'gather',
                target: 'iron_ore',
                count: 3,
                description: 'Collect 3 pieces of rare iron ore'
            },
            {
                type: 'gather',
                target: 'magic_crystal',
                count: 1,
                description: 'Find 1 magic crystal'
            }
        ],
        rewards: {
            experience: 150,
            gold: 75,
            items: ['enchanted_sword']
        },
        level_requirement: 2
    },
    LEARN_MAGIC: {
        id: 'learn_magic',
        name: 'Magical Training',
        giver: 'mage',
        type: 'training',
        description: 'Learn the basics of magic',
        objectives: [
            {
                type: 'cast',
                target: 'magic_bolt',
                count: 10,
                description: 'Cast Magic Bolt 10 times'
            },
            {
                type: 'cast',
                target: 'heal',
                count: 5,
                description: 'Cast Heal 5 times'
            }
        ],
        rewards: {
            experience: 200,
            gold: 25,
            items: ['mana_potion', 'spell_book']
        },
        level_requirement: 3
    },
    mainQuests: {
        dragonThreat: {
            id: "main_dragon_threat",
            title: "The Dragon's Shadow",
            description: "A mighty dragon threatens the realm from its lair in the burning cave.",
            level: { min: 30, required: 35 },
            location: "dragon_cave",
            stages: [
                {
                    id: "gather_intel",
                    description: "Gather information about the dragon from the village",
                    objectives: [
                        { type: "talk", target: "village_elder", location: "village_hamlet" },
                        { type: "collect", item: "dragon_scale", amount: 3, location: "dragon_cave" }
                    ]
                },
                {
                    id: "prepare_defense",
                    description: "Help prepare the village's defenses",
                    objectives: [
                        { type: "craft", item: "dragon_ward", amount: 5 },
                        { type: "place", item: "dragon_ward", locations: ["village_hamlet", "castle_district"] }
                    ]
                },
                {
                    id: "confront_dragon",
                    description: "Face the dragon in its lair",
                    objectives: [
                        { type: "defeat", target: "elder_dragon", location: "dragon_cave" }
                    ]
                }
            ],
            rewards: {
                experience: 10000,
                gold: 5000,
                items: [
                    { id: "dragon_slayer_sword", amount: 1 },
                    { id: "dragon_scale_armor", amount: 1 }
                ]
            }
        }
    },

    sideQuests: {
        magicSpringsCleansing: {
            id: "springs_cleansing",
            title: "Cleanse the Springs",
            description: "The magical springs have been tainted by dark forces.",
            level: { min: 5, recommended: 8 },
            location: "magic_springs",
            stages: [
                {
                    id: "investigate",
                    description: "Investigate the source of corruption",
                    objectives: [
                        { type: "explore", target: "spring_source", location: "magic_springs" },
                        { type: "collect", item: "tainted_crystal", amount: 5 }
                    ]
                },
                {
                    id: "purify",
                    description: "Purify the springs",
                    objectives: [
                        { type: "use", item: "purification_spell", target: "spring_source" }
                    ]
                }
            ],
            rewards: {
                experience: 2000,
                gold: 1000,
                items: [
                    { id: "spring_blessed_staff", amount: 1 }
                ]
            }
        },

        frozenSecret: {
            id: "frozen_secret",
            title: "The Frozen Secret",
            description: "Discover the secret hidden within the Ice Castle.",
            level: { min: 20, recommended: 25 },
            location: "frozen_peaks",
            stages: [
                {
                    id: "find_entrance",
                    description: "Find a way into the sealed ice castle",
                    objectives: [
                        { type: "explore", target: "ice_castle_exterior" },
                        { type: "solve", puzzle: "ice_rune_puzzle" }
                    ]
                },
                {
                    id: "explore_castle",
                    description: "Explore the ice castle's chambers",
                    objectives: [
                        { type: "defeat", target: "frost_guardians", amount: 5 },
                        { type: "collect", item: "frozen_artifacts", amount: 3 }
                    ]
                }
            ],
            rewards: {
                experience: 5000,
                gold: 2500,
                items: [
                    { id: "frost_enchanted_ring", amount: 1 }
                ]
            }
        }
    },

    dailyQuests: {
        villageSupplies: {
            id: "daily_supplies",
            title: "Village Supplies",
            description: "Help gather daily supplies for the village.",
            level: { min: 1, recommended: 3 },
            location: "village_hamlet",
            objectives: [
                { type: "gather", item: "herbs", amount: 10 },
                { type: "fish", amount: 5 },
                { type: "hunt", target: "wild_game", amount: 3 }
            ],
            rewards: {
                experience: 500,
                gold: 250,
                reputation: "village_hamlet"
            },
            reset: "daily"
        },

        magicEssence: {
            id: "daily_essence",
            title: "Magical Essence Collection",
            description: "Collect magical essence from the springs.",
            level: { min: 5, recommended: 7 },
            location: "magic_springs",
            objectives: [
                { type: "collect", item: "magic_essence", amount: 15 }
            ],
            rewards: {
                experience: 700,
                gold: 300,
                items: [
                    { id: "minor_mana_potion", amount: 5 }
                ]
            },
            reset: "daily"
        }
    },

    worldEvents: {
        dragonRaid: {
            id: "world_dragon_raid",
            title: "Dragon Raid",
            description: "A group of dragons is attacking multiple locations!",
            level: { min: 25, recommended: 30 },
            locations: ["castle_district", "village_hamlet", "enchanted_forest"],
            objectives: [
                { type: "defeat", target: "raid_dragons", amount: 5 },
                { type: "protect", target: "village_buildings", success_rate: 0.7 }
            ],
            rewards: {
                experience: 8000,
                gold: 4000,
                items: [
                    { id: "dragon_essence", amount: 10 }
                ]
            },
            frequency: {
                type: "random",
                cooldown: "weekly",
                probability: 0.15
            }
        }
    }
};

const QUEST_REQUIREMENTS = {
    levelRequirement: (playerLevel, questLevel) => {
        return playerLevel >= questLevel.min;
    },
    
    prerequisiteQuests: (completedQuests, requiredQuests) => {
        return requiredQuests.every(questId => completedQuests.includes(questId));
    },
    
    reputationRequirement: (playerReputation, requiredReputation) => {
        return playerReputation[requiredReputation.faction] >= requiredReputation.level;
    }
};

const QUEST_REWARDS = {
    calculateExperience: (baseXP, playerLevel, questLevel) => {
        const levelDiff = playerLevel - questLevel.recommended;
        const multiplier = levelDiff > 5 ? 0.1 : levelDiff < -5 ? 1.5 : 1;
        return Math.floor(baseXP * multiplier);
    },
    
    calculateGold: (baseGold, difficulty) => {
        const multipliers = {
            easy: 0.8,
            normal: 1,
            hard: 1.3,
            epic: 1.8
        };
        return Math.floor(baseGold * multipliers[difficulty]);
    }
};

export {
    QUESTS_CONFIG,
    QUEST_REQUIREMENTS,
    QUEST_REWARDS
};
