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
    }
};
