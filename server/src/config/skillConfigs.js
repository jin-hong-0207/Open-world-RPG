const skillConfigs = {
    // Healing Skills
    basicHeal: {
        name: 'Healing Touch',
        type: 'healing',
        config: {
            baseEffectValue: 50, // Base healing amount
            effectScaling: 1.2,  // 20% increase per level
            cooldown: 10,        // 10 seconds
            maxLevel: 5,
            description: 'A basic healing spell that restores health to a single target.'
        }
    },

    groupHeal: {
        name: 'Healing Aura',
        type: 'healing',
        config: {
            baseEffectValue: 30,  // Base healing per target
            effectScaling: 1.15,  // 15% increase per level
            cooldown: 20,         // 20 seconds
            maxLevel: 5,
            radius: 10,           // Affects allies within 10 units
            description: 'Heals all allies within range.'
        }
    },

    // Boost Skills
    powerBoost: {
        name: 'Strength Boost',
        type: 'boost',
        config: {
            baseEffectValue: 25,  // 25% boost
            effectScaling: 1.1,   // 10% increase per level
            cooldown: 15,         // 15 seconds
            duration: 10,         // 10 seconds
            maxLevel: 5,
            description: 'Temporarily increases target\'s strength.'
        }
    },

    speedBoost: {
        name: 'Swift Wind',
        type: 'movement',
        config: {
            baseEffectValue: 30,  // 30% speed increase
            effectScaling: 1.1,   // 10% increase per level
            cooldown: 12,         // 12 seconds
            duration: 8,          // 8 seconds
            maxLevel: 5,
            description: 'Temporarily increases movement speed.'
        }
    },

    // Environmental Skills
    earthShaping: {
        name: 'Earth Shaping',
        type: 'environmental',
        config: {
            baseEffectValue: 5,   // Size of affected area
            effectScaling: 1.2,   // 20% increase per level
            cooldown: 8,          // 8 seconds
            maxLevel: 5,
            description: 'Manipulate the terrain to create paths or solve puzzles.'
        }
    },

    natureCalling: {
        name: 'Nature\'s Call',
        type: 'environmental',
        config: {
            baseEffectValue: 2,   // Number of creatures
            effectScaling: 1.1,   // 1 additional creature per 2 levels
            cooldown: 25,         // 25 seconds
            duration: 30,         // 30 seconds
            maxLevel: 5,
            description: 'Summon friendly creatures to help solve puzzles.'
        }
    }
};

// Starter skills for different character types
const starterSkills = {
    healer: skillConfigs.basicHeal,
    support: skillConfigs.powerBoost,
    explorer: skillConfigs.speedBoost,
    shaper: skillConfigs.earthShaping
};

module.exports = {
    skillConfigs,
    starterSkills
};
