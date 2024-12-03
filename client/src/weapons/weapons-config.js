export const WEAPONS_CONFIG = {
    SWORD: {
        name: 'Sword',
        type: 'melee',
        baseDamage: 10,
        range: 2,
        attackSpeed: 1.0,
        skills: {
            BASIC_SLASH: {
                name: 'Basic Slash',
                key: 'Q',
                damage: 10,
                cooldown: 0,
                level: 1,
                description: 'Basic melee attack'
            },
            WHIRLWIND: {
                name: 'Whirlwind',
                key: 'W',
                damage: 20,
                cooldown: 5,
                level: 2,
                description: 'Spin attack hitting all nearby enemies'
            },
            CHARGE: {
                name: 'Charge',
                key: 'E',
                damage: 15,
                cooldown: 8,
                level: 3,
                description: 'Rush forward, damaging enemies in path'
            },
            SHIELD_BASH: {
                name: 'Shield Bash',
                key: 'R',
                damage: 10,
                cooldown: 12,
                level: 4,
                description: 'Stun enemies and reduce their defense'
            },
            ULTIMATE_STRIKE: {
                name: 'Ultimate Strike',
                key: 'F',
                damage: 50,
                cooldown: 30,
                level: 5,
                description: 'Powerful single-target attack'
            }
        }
    },
    BOW: {
        name: 'Bow',
        type: 'ranged',
        baseDamage: 8,
        range: 15,
        attackSpeed: 1.2,
        skills: {
            QUICK_SHOT: {
                name: 'Quick Shot',
                key: 'Q',
                damage: 8,
                cooldown: 0,
                level: 1,
                description: 'Basic ranged attack'
            },
            POISON_ARROW: {
                name: 'Poison Arrow',
                key: 'W',
                damage: 15,
                cooldown: 8,
                level: 2,
                description: 'Arrow that deals damage over time'
            },
            MULTI_SHOT: {
                name: 'Multi Shot',
                key: 'E',
                damage: 20,
                cooldown: 10,
                level: 3,
                description: 'Fire multiple arrows at once'
            },
            ICE_ARROW: {
                name: 'Ice Arrow',
                key: 'R',
                damage: 12,
                cooldown: 15,
                level: 4,
                description: 'Freezes target and deals damage'
            },
            RAIN_OF_ARROWS: {
                name: 'Rain of Arrows',
                key: 'F',
                damage: 40,
                cooldown: 25,
                level: 5,
                description: 'Area damage attack from above'
            }
        }
    },
    WAND: {
        name: 'Magical Wand',
        type: 'magic',
        baseDamage: 12,
        range: 10,
        attackSpeed: 0.8,
        skills: {
            MAGIC_BOLT: {
                name: 'Magic Bolt',
                key: 'Q',
                damage: 12,
                cooldown: 0,
                level: 1,
                description: 'Basic magic attack'
            },
            HEAL: {
                name: 'Heal',
                key: 'W',
                healing: 20,
                cooldown: 10,
                level: 2,
                description: 'Heal self or ally'
            },
            POWER_BOOST: {
                name: 'Power Boost',
                key: 'E',
                boost: 25,
                cooldown: 15,
                level: 3,
                description: 'Increase damage for a short time'
            },
            TELEPORT: {
                name: 'Teleport',
                key: 'R',
                cooldown: 20,
                level: 4,
                description: 'Short-range teleport'
            },
            METEOR_STRIKE: {
                name: 'Meteor Strike',
                key: 'F',
                damage: 60,
                cooldown: 40,
                level: 5,
                description: 'Massive area damage attack'
            }
        }
    }
};
