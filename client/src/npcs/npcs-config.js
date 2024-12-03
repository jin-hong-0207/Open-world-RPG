export const NPCS_CONFIG = {
    TOWN_ELDER: {
        id: 'elder',
        name: 'Elder Marcus',
        position: { x: 10, y: 0, z: 10 },
        type: 'quest_giver',
        dialogue: {
            GREETING: 'Welcome, brave adventurer! Our town needs your help.',
            QUEST_AVAILABLE: 'There are monsters threatening our village. Will you help us?',
            QUEST_ACTIVE: 'Have you defeated the monsters yet?',
            QUEST_COMPLETE: 'Thank you for your help! Here is your reward.'
        },
        quests: ['PROTECT_VILLAGE']
    },
    BLACKSMITH: {
        id: 'blacksmith',
        name: 'Smith Johnson',
        position: { x: -20, y: 0, z: 15 },
        type: 'merchant',
        dialogue: {
            GREETING: 'Need some weapons or armor?',
            QUEST_AVAILABLE: 'I need special materials for forging. Can you help?',
            QUEST_ACTIVE: 'Found those materials yet?',
            QUEST_COMPLETE: 'Perfect! Let me forge something special for you.'
        },
        quests: ['GATHER_MATERIALS']
    },
    MAGE: {
        id: 'mage',
        name: 'Wizard Elena',
        position: { x: 0, y: 0, z: 30 },
        type: 'trainer',
        dialogue: {
            GREETING: 'Seeking magical knowledge?',
            QUEST_AVAILABLE: 'I sense potential in you. Ready to learn?',
            QUEST_ACTIVE: 'Keep practicing those spells!',
            QUEST_COMPLETE: 'Well done! You\'ve mastered the basics.'
        },
        quests: ['LEARN_MAGIC']
    }
};
