const SKILL_CONFIG = {
    ENERGY_SLASH: {
        id: 'energy_slash',
        name: 'Energy Slash',
        type: 'Active',
        description: 'Release a wave of energy that damages enemies in a line',
        cooldown: 6,
        energyCost: 20
    },
    HEALING_WAVE: {
        id: 'healing_wave',
        name: 'Healing Wave',
        type: 'Active',
        description: 'Heal yourself and nearby allies',
        cooldown: 10,
        energyCost: 30
    },
    STEALTH: {
        id: 'stealth',
        name: 'Stealth',
        type: 'Active',
        description: 'Become invisible to enemies',
        cooldown: 15,
        energyCost: 25
    },
    ENHANCED_CRAFTING: {
        id: 'enhanced_crafting',
        name: 'Enhanced Crafting',
        type: 'Passive',
        description: 'Increases crafting success rate and quality',
    },
    NATURE_SENSE: {
        id: 'nature_sense',
        name: 'Nature Sense',
        type: 'Passive',
        description: 'Detect hidden resources and treasures',
    }
};

const CONTROL_CONFIG = {
    defaultBindings: {
        basic_attack: "LEFT_CLICK",
        skill_1: "Q",
        skill_2: "W",
        skill_3: "E",
        skill_4: "R",
        utility: "F"
    },
    
    modifiers: {
        shift: "SHIFT",
        alt: "ALT",
        ctrl: "CTRL"
    },

    quickCast: {
        enabled: true,
        exceptions: ["teleport", "dragon_strike"]
    }
};

const PROGRESSION_CONFIG = {
    levelRequirements: {
        basic: 1,
        advanced: 5,
        expert: 10,
        master: 15
    },

    skillPoints: {
        perLevel: 1,
        maxPoints: 5
    },

    upgradeEffects: {
        damage: { base: 1.1, max: 2.0 },
        healing: { base: 1.1, max: 2.0 },
        cooldown: { base: 0.95, min: 0.5 },
        range: { base: 1.05, max: 1.5 }
    }
};

module.exports = {
    SKILL_CONFIG,
    CONTROL_CONFIG,
    PROGRESSION_CONFIG
};
