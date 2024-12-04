// Skill System Configuration
const SKILL_CONFIG = {
    // Base weapon skills
    baseSkills: {
        // Sword Skills
        energy_slash: {
            id: "energy_slash",
            name: "Energy Slash",
            type: "offensive",
            weapon: "sword",
            description: "Release a wave of energy that damages enemies in a line",
            defaultKey: "Q",
            levelRequirement: 1,
            mechanics: {
                damage: { base: 50, scaling: 0.6 },
                range: 8,
                width: 2,
                castTime: 0.3,
                cooldown: 6
            },
            effects: {
                animation: "slash_forward",
                projectile: {
                    type: "energy_wave",
                    color: "#4CAF50",
                    trail: true
                },
                sound: "energy_slash",
                impact: {
                    visual: "energy_burst",
                    sound: "energy_impact"
                }
            }
        },

        // Bow Skills
        healing_arrow: {
            id: "healing_arrow",
            name: "Healing Arrow",
            type: "support",
            weapon: "bow",
            description: "Fire an arrow that heals allies in its path",
            defaultKey: "Q",
            levelRequirement: 1,
            mechanics: {
                healing: { base: 40, scaling: 0.5 },
                range: 15,
                width: 1,
                castTime: 0.5,
                cooldown: 8
            },
            effects: {
                animation: "draw_bow",
                projectile: {
                    type: "healing_arrow",
                    color: "#81C784",
                    trail: true
                },
                sound: "healing_arrow",
                impact: {
                    visual: "heal_burst",
                    sound: "heal_chime"
                }
            }
        },

        // Wand Skills
        magic_shield: {
            id: "magic_shield",
            name: "Magic Shield",
            type: "defensive",
            weapon: "wand",
            description: "Create a protective bubble that absorbs damage",
            defaultKey: "Q",
            levelRequirement: 1,
            mechanics: {
                shield: { base: 100, scaling: 0.8 },
                duration: 5,
                radius: 3,
                castTime: 0.2,
                cooldown: 12
            },
            effects: {
                animation: "raise_wand",
                shield: {
                    type: "bubble",
                    color: "#7B1FA2",
                    opacity: 0.4
                },
                sound: "shield_cast",
                impact: {
                    visual: "shield_form",
                    sound: "shield_up"
                }
            }
        }
    },

    // Advanced skills unlocked through progression
    advancedSkills: {
        // Sword Advanced Skills
        whirlwind_blade: {
            id: "whirlwind_blade",
            name: "Whirlwind Blade",
            type: "offensive",
            weapon: "sword",
            description: "Spin rapidly, dealing damage to all nearby enemies",
            defaultKey: "W",
            levelRequirement: 5,
            mechanics: {
                damage: { base: 70, scaling: 0.7 },
                radius: 5,
                duration: 2,
                castTime: 0.1,
                cooldown: 15
            },
            effects: {
                animation: "spin_attack",
                visual: {
                    type: "energy_spiral",
                    color: "#4CAF50"
                },
                sound: "whirlwind",
                impact: {
                    visual: "energy_ripple",
                    sound: "slash_impact"
                }
            }
        },

        // Bow Advanced Skills
        multishot: {
            id: "multishot",
            name: "Multishot",
            type: "offensive",
            weapon: "bow",
            description: "Fire multiple arrows in a spread pattern",
            defaultKey: "W",
            levelRequirement: 5,
            mechanics: {
                damage: { base: 40, scaling: 0.4 },
                arrows: 3,
                spread: 30,
                range: 12,
                castTime: 0.7,
                cooldown: 12
            },
            effects: {
                animation: "multi_draw",
                projectile: {
                    type: "arrow",
                    color: "#2196F3",
                    trail: true
                },
                sound: "multi_arrow",
                impact: {
                    visual: "arrow_impact",
                    sound: "arrow_hit"
                }
            }
        },

        // Wand Advanced Skills
        teleport: {
            id: "teleport",
            name: "Teleport",
            type: "utility",
            weapon: "wand",
            description: "Instantly teleport to a target location",
            defaultKey: "W",
            levelRequirement: 5,
            mechanics: {
                range: 10,
                castTime: 0.1,
                cooldown: 20
            },
            effects: {
                animation: "teleport",
                visual: {
                    type: "blink",
                    color: "#9C27B0"
                },
                sound: "teleport",
                impact: {
                    visual: "teleport_arrive",
                    sound: "teleport_end"
                }
            }
        }
    },

    // Ultimate abilities unlocked at higher levels
    ultimateSkills: {
        dragon_strike: {
            id: "dragon_strike",
            name: "Dragon Strike",
            type: "offensive",
            weapon: "sword",
            description: "Transform your sword into a dragon of pure energy",
            defaultKey: "R",
            levelRequirement: 15,
            mechanics: {
                damage: { base: 200, scaling: 1.2 },
                range: 15,
                width: 4,
                castTime: 1,
                cooldown: 60
            },
            effects: {
                animation: "dragon_stance",
                visual: {
                    type: "dragon_energy",
                    color: "#FF5722"
                },
                sound: "dragon_roar",
                impact: {
                    visual: "dragon_explosion",
                    sound: "dragon_impact"
                }
            }
        },

        rain_of_healing: {
            id: "rain_of_healing",
            name: "Rain of Healing",
            type: "support",
            weapon: "bow",
            description: "Create a healing rain that restores allies' health over time",
            defaultKey: "R",
            levelRequirement: 15,
            mechanics: {
                healing: { base: 30, scaling: 0.4 },
                duration: 8,
                radius: 10,
                tickRate: 1,
                castTime: 0.8,
                cooldown: 90
            },
            effects: {
                animation: "skyward_shot",
                visual: {
                    type: "healing_rain",
                    color: "#81C784"
                },
                sound: "healing_rain",
                impact: {
                    visual: "heal_droplets",
                    sound: "rain_healing"
                }
            }
        }
    }
};

// Skill Controls Configuration
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

// Skill Progression System
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

export { SKILL_CONFIG, CONTROL_CONFIG, PROGRESSION_CONFIG };
