const QUEST_CONFIG = {
    PROTECT_VILLAGE: {
        id: 'protect_village',
        title: 'Protect the Village',
        description: 'Help defend the village from threats',
        objectives: [
            {
                id: 'scout_perimeter',
                type: 'explore',
                target: 'village_perimeter',
                description: 'Scout the village perimeter',
                required: 1
            },
            {
                id: 'set_traps',
                type: 'craft',
                target: 'defensive_trap',
                required: 3,
                description: 'Set up defensive traps'
            }
        ],
        rewards: {
            experience: 200,
            gold: 100,
            items: [
                {
                    id: 'village_defender_badge',
                    quantity: 1
                }
            ]
        }
    },
    GATHER_RESOURCES: {
        id: 'gather_resources',
        title: 'Resource Gathering',
        description: 'Collect essential resources for the village',
        objectives: [
            {
                id: 'collect_herbs',
                type: 'gather',
                target: 'medicinal_herbs',
                required: 5,
                description: 'Collect medicinal herbs'
            },
            {
                id: 'find_crystals',
                type: 'gather',
                target: 'power_crystal',
                required: 2,
                description: 'Find power crystals'
            }
        ],
        rewards: {
            experience: 150,
            gold: 75,
            items: [
                {
                    id: 'resource_pouch',
                    quantity: 1
                }
            ]
        }
    },
    DRAGON_THREAT: {
        id: 'dragon_threat',
        title: 'The Dragon\'s Shadow',
        description: 'A mighty dragon threatens the realm from its lair in the burning cave.',
        objectives: [
            {
                id: 'gather_intel',
                type: 'talk',
                target: 'village_elder',
                required: 1,
                description: 'Gather information about the dragon from the village'
            },
            {
                id: 'collect_scales',
                type: 'collect',
                target: 'dragon_scale',
                required: 3,
                description: 'Collect dragon scales from the cave'
            },
            {
                id: 'craft_wards',
                type: 'craft',
                target: 'dragon_ward',
                required: 5,
                description: 'Craft dragon wards for village defense'
            }
        ],
        rewards: {
            experience: 10000,
            gold: 5000,
            items: [
                {
                    id: 'dragon_slayer_sword',
                    quantity: 1
                },
                {
                    id: 'dragon_scale_armor',
                    quantity: 1
                }
            ]
        }
    },
    MAGIC_SPRINGS_CLEANSING: {
        id: 'springs_cleansing',
        title: 'Cleanse the Springs',
        description: 'The magical springs have been tainted by dark forces.',
        objectives: [
            {
                id: 'investigate',
                type: 'explore',
                target: 'spring_source',
                required: 1,
                description: 'Investigate the source of corruption'
            },
            {
                id: 'collect_crystals',
                type: 'collect',
                target: 'tainted_crystal',
                required: 5,
                description: 'Collect tainted crystals'
            },
            {
                id: 'purify',
                type: 'use',
                target: 'purification_spell',
                required: 1,
                description: 'Purify the springs'
            }
        ],
        rewards: {
            experience: 2000,
            gold: 1000,
            items: [
                {
                    id: 'spring_blessed_staff',
                    quantity: 1
                }
            ]
        }
    },
    FROZEN_SECRET: {
        id: 'frozen_secret',
        title: 'The Frozen Secret',
        description: 'Discover the secret hidden within the Ice Castle.',
        objectives: [
            {
                id: 'find_entrance',
                type: 'explore',
                target: 'ice_castle_exterior',
                required: 1,
                description: 'Find a way into the sealed ice castle'
            },
            {
                id: 'solve_puzzle',
                type: 'solve',
                target: 'ice_rune_puzzle',
                required: 1,
                description: 'Solve the ice rune puzzle'
            },
            {
                id: 'explore_castle',
                type: 'explore',
                target: 'ice_castle_interior',
                required: 1,
                description: 'Explore the ice castle\'s chambers'
            },
            {
                id: 'defeat_guardians',
                type: 'defeat',
                target: 'frost_guardians',
                required: 5,
                description: 'Defeat the frost guardians'
            },
            {
                id: 'collect_artifacts',
                type: 'collect',
                target: 'frozen_artifacts',
                required: 3,
                description: 'Collect frozen artifacts'
            }
        ],
        rewards: {
            experience: 5000,
            gold: 2500,
            items: [
                {
                    id: 'frost_enchanted_ring',
                    quantity: 1
                }
            ]
        }
    },
    VILLAGE_SUPPLIES: {
        id: 'village_supplies',
        title: 'Village Supplies',
        description: 'Help gather daily supplies for the village.',
        objectives: [
            {
                id: 'gather_herbs',
                type: 'gather',
                target: 'herbs',
                required: 10,
                description: 'Gather herbs'
            },
            {
                id: 'fish',
                type: 'fish',
                target: 'fish',
                required: 5,
                description: 'Fish'
            },
            {
                id: 'hunt',
                type: 'hunt',
                target: 'wild_game',
                required: 3,
                description: 'Hunt wild game'
            }
        ],
        rewards: {
            experience: 500,
            gold: 250,
            reputation: 'village_hamlet'
        },
        reset: 'daily'
    },
    MAGIC_ESSENCE: {
        id: 'magic_essence',
        title: 'Magical Essence Collection',
        description: 'Collect magical essence from the springs.',
        objectives: [
            {
                id: 'collect_essence',
                type: 'collect',
                target: 'magic_essence',
                required: 15,
                description: 'Collect magical essence'
            }
        ],
        rewards: {
            experience: 700,
            gold: 300,
            items: [
                {
                    id: 'minor_mana_potion',
                    quantity: 5
                }
            ]
        },
        reset: 'daily'
    },
    DRAGON_RAID: {
        id: 'dragon_raid',
        title: 'Dragon Raid',
        description: 'A group of dragons is attacking multiple locations!',
        objectives: [
            {
                id: 'defeat_dragons',
                type: 'defeat',
                target: 'raid_dragons',
                required: 5,
                description: 'Defeat the raid dragons'
            },
            {
                id: 'protect_buildings',
                type: 'protect',
                target: 'village_buildings',
                required: 1,
                description: 'Protect the village buildings'
            }
        ],
        rewards: {
            experience: 8000,
            gold: 4000,
            items: [
                {
                    id: 'dragon_essence',
                    quantity: 10
                }
            ]
        },
        frequency: {
            type: 'random',
            cooldown: 'weekly',
            probability: 0.15
        }
    }
};

const QUEST_REQUIREMENTS = {
    levelRequirement(playerLevel, questLevel) {
        return playerLevel >= questLevel;
    },
    
    prerequisiteQuests(completedQuests, requiredQuests) {
        return requiredQuests.every(quest => completedQuests.includes(quest));
    },
    
    reputationRequirement(playerReputation, requiredReputation) {
        return playerReputation >= requiredReputation;
    }
};

const QUEST_REWARDS = {
    calculateExperience(baseXP, playerLevel, questLevel) {
        const levelDiff = questLevel - playerLevel;
        const modifier = levelDiff > 0 ? 1 + (levelDiff * 0.1) : 1;
        return Math.round(baseXP * modifier);
    },

    calculateGold(baseGold, difficulty) {
        const difficultyModifiers = {
            easy: 1,
            medium: 1.5,
            hard: 2,
            epic: 3
        };
        return Math.round(baseGold * (difficultyModifiers[difficulty] || 1));
    }
};

module.exports = {
    QUEST_CONFIG,
    QUEST_REQUIREMENTS,
    QUEST_REWARDS
};
