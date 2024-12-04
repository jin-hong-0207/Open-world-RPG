import { SKILL_CONFIG, CONTROL_CONFIG, PROGRESSION_CONFIG } from '../../../shared/skills/skill-config';
import { CHARACTERS, WEAPON_TYPES } from '../../../shared/characters/character-config.js';

export const SKILL_TYPES = {
    ACTIVE: 'active',
    PASSIVE: 'passive',
    ULTIMATE: 'ultimate'
};

export const SKILL_EFFECTS = {
    HEAL: 'heal',
    SHIELD: 'shield',
    BUFF: 'buff',
    UTILITY: 'utility'
};

export const SKILLS_CONFIG = {
    // Base Weapon Skills
    energy_slash: {
        id: 'energy_slash',
        name: 'Energy Slash',
        type: SKILL_TYPES.ACTIVE,
        description: 'Release a wave of light energy',
        weaponType: WEAPON_TYPES.SWORD.id,
        effects: {
            type: SKILL_EFFECTS.UTILITY,
            range: 5,
            width: 2,
            duration: 0.5
        },
        animation: 'animations/skills/energy_slash.glb',
        particles: {
            type: 'wave',
            color: '#64B5F6',
            scale: 1.0
        },
        cooldown: 3,
        energyCost: 20,
        unlockLevel: 1
    },

    healing_arrow: {
        id: 'healing_arrow',
        name: 'Healing Arrow',
        type: SKILL_TYPES.ACTIVE,
        description: 'Shoot an arrow that heals allies',
        weaponType: WEAPON_TYPES.BOW.id,
        effects: {
            type: SKILL_EFFECTS.HEAL,
            value: 30,
            range: 15,
            radius: 2
        },
        animation: 'animations/skills/healing_arrow.glb',
        projectile: {
            model: 'models/projectiles/healing_arrow.glb',
            speed: 20,
            trail: {
                color: '#81C784',
                duration: 0.3
            }
        },
        cooldown: 5,
        energyCost: 25,
        unlockLevel: 1
    },

    magic_shield: {
        id: 'magic_shield',
        name: 'Magic Shield',
        type: SKILL_TYPES.ACTIVE,
        description: 'Create a protective shield',
        weaponType: WEAPON_TYPES.WAND.id,
        effects: {
            type: SKILL_EFFECTS.SHIELD,
            value: 50,
            duration: 5
        },
        animation: 'animations/skills/magic_shield.glb',
        particles: {
            type: 'shield',
            color: '#9575CD',
            scale: 1.2
        },
        cooldown: 8,
        energyCost: 30,
        unlockLevel: 1
    },

    // Advanced Skills
    group_heal: {
        id: 'group_heal',
        name: 'Group Heal',
        type: SKILL_TYPES.ACTIVE,
        description: 'Heal all nearby allies',
        weaponType: WEAPON_TYPES.WAND.id,
        effects: {
            type: SKILL_EFFECTS.HEAL,
            value: 40,
            radius: 8
        },
        animation: 'animations/skills/group_heal.glb',
        particles: {
            type: 'burst',
            color: '#81C784',
            scale: 2.0
        },
        cooldown: 12,
        energyCost: 45,
        unlockLevel: 10
    },

    power_boost: {
        id: 'power_boost',
        name: 'Power Boost',
        type: SKILL_TYPES.ACTIVE,
        description: 'Boost an ally\'s capabilities',
        weaponType: WEAPON_TYPES.SWORD.id,
        effects: {
            type: SKILL_EFFECTS.BUFF,
            stats: {
                moveSpeed: 1.3,
                energy: 50
            },
            duration: 8
        },
        animation: 'animations/skills/power_boost.glb',
        particles: {
            type: 'aura',
            color: '#FFB74D',
            scale: 1.0
        },
        cooldown: 15,
        energyCost: 35,
        unlockLevel: 15
    },

    teleport: {
        id: 'teleport',
        name: 'Teleport',
        type: SKILL_TYPES.ACTIVE,
        description: 'Instantly move to a target location',
        weaponType: WEAPON_TYPES.WAND.id,
        effects: {
            type: SKILL_EFFECTS.UTILITY,
            range: 10
        },
        animation: 'animations/skills/teleport.glb',
        particles: {
            type: 'blink',
            color: '#9575CD',
            scale: 1.0
        },
        cooldown: 20,
        energyCost: 40,
        unlockLevel: 20
    },

    // Ultimate Skills
    rain_of_life: {
        id: 'rain_of_life',
        name: 'Rain of Life',
        type: SKILL_TYPES.ULTIMATE,
        description: 'Create a healing rain in target area',
        weaponType: WEAPON_TYPES.BOW.id,
        effects: {
            type: SKILL_EFFECTS.HEAL,
            value: 20,
            radius: 10,
            duration: 5,
            tickRate: 1
        },
        animation: 'animations/skills/rain_of_life.glb',
        particles: {
            type: 'rain',
            color: '#81C784',
            scale: 2.0
        },
        cooldown: 60,
        energyCost: 100,
        unlockLevel: 30
    },

    protective_dome: {
        id: 'protective_dome',
        name: 'Protective Dome',
        type: SKILL_TYPES.ULTIMATE,
        description: 'Create a large protective shield',
        weaponType: WEAPON_TYPES.WAND.id,
        effects: {
            type: SKILL_EFFECTS.SHIELD,
            value: 100,
            radius: 8,
            duration: 8
        },
        animation: 'animations/skills/protective_dome.glb',
        particles: {
            type: 'dome',
            color: '#9575CD',
            scale: 2.5
        },
        cooldown: 90,
        energyCost: 100,
        unlockLevel: 30
    }
};

class SkillManager {
    constructor() {
        this.activeSkills = new Map(); // playerId -> Map of skillId -> cooldown info
        this.skillLevels = new Map(); // playerId -> Map of skillId -> level
        this.keyBindings = new Map();
    }

    // Initialize character skills
    initializeCharacterSkills(characterId, weaponType) {
        // Assign base skill based on weapon
        const baseSkill = Object.values(SKILL_CONFIG.baseSkills)
            .find(skill => skill.weapon === weaponType);

        if (baseSkill) {
            this.activeSkills.set(characterId, [baseSkill.id]);
            this.skillLevels.set(characterId, new Map([[baseSkill.id, 1]]));
            this.setDefaultKeyBindings(characterId);
        }
    }

    // Set default key bindings
    setDefaultKeyBindings(characterId) {
        const bindings = new Map();
        const skills = this.activeSkills.get(characterId);

        skills.forEach((skillId, index) => {
            const key = Object.values(CONTROL_CONFIG.defaultBindings)[index + 1]; // +1 to skip basic attack
            bindings.set(skillId, key);
        });

        this.keyBindings.set(characterId, bindings);
    }

    // Initialize player skills
    initializePlayerSkills(playerId, characterId) {
        const character = CHARACTERS[characterId];
        if (!character) {
            return { success: false, error: 'Invalid character' };
        }

        // Set up skill tracking
        this.activeSkills.set(playerId, new Map());
        this.skillLevels.set(playerId, new Map());

        // Add base weapon skill
        const baseSkill = character.weaponType.baseSkill;
        if (baseSkill) {
            this.skillLevels.get(playerId).set(baseSkill, 1);
        }

        return { success: true };
    }

    // Use skill
    useSkill(playerId, skillId, targetPosition = null, targetPlayerId = null) {
        const skillConfig = SKILLS_CONFIG[skillId];
        if (!skillConfig) {
            return { success: false, error: 'Invalid skill' };
        }

        // Check cooldown
        const playerSkills = this.activeSkills.get(playerId);
        if (!playerSkills) {
            return { success: false, error: 'Player skills not initialized' };
        }

        const cooldownInfo = playerSkills.get(skillId);
        if (cooldownInfo && Date.now() < cooldownInfo.readyTime) {
            return { success: false, error: 'Skill on cooldown' };
        }

        // Apply skill effects based on type
        let result;
        switch (skillConfig.effects.type) {
            case SKILL_EFFECTS.HEAL:
                result = this.applyHealingEffect(skillConfig, targetPosition, targetPlayerId);
                break;
            case SKILL_EFFECTS.SHIELD:
                result = this.applyShieldEffect(skillConfig, targetPosition, targetPlayerId);
                break;
            case SKILL_EFFECTS.BUFF:
                result = this.applyBuffEffect(skillConfig, targetPlayerId);
                break;
            case SKILL_EFFECTS.UTILITY:
                result = this.applyUtilityEffect(skillConfig, targetPosition, playerId);
                break;
            default:
                result = { success: false, error: 'Unknown effect type' };
        }

        if (result.success) {
            // Start cooldown
            playerSkills.set(skillId, {
                readyTime: Date.now() + (skillConfig.cooldown * 1000)
            });
        }

        return result;
    }

    // Apply healing effect
    applyHealingEffect(skillConfig, position, targetId) {
        // Implementation would handle actual healing logic
        return { success: true, effect: 'heal' };
    }

    // Apply shield effect
    applyShieldEffect(skillConfig, position, targetId) {
        // Implementation would handle shield application
        return { success: true, effect: 'shield' };
    }

    // Apply buff effect
    applyBuffEffect(skillConfig, targetId) {
        // Implementation would handle buff application
        return { success: true, effect: 'buff' };
    }

    // Apply utility effect
    applyUtilityEffect(skillConfig, position, playerId) {
        // Implementation would handle utility effects like teleport
        return { success: true, effect: 'utility' };
    }

    // Unlock new skill
    unlockSkill(characterId, skillId) {
        const character = this.activeSkills.get(characterId);
        if (!character) return false;

        const skill = this.findSkill(skillId);
        if (!skill) return false;

        // Check if character has reached max skills
        if (character.length >= 5) return false;

        // Add skill and initialize level
        character.push(skillId);
        this.skillLevels.get(characterId).set(skillId, 1);

        // Update key bindings
        this.updateKeyBindings(characterId);

        return true;
    }

    // Update key bindings after unlocking new skill
    updateKeyBindings(characterId) {
        const bindings = this.keyBindings.get(characterId);
        const skills = this.activeSkills.get(characterId);

        skills.forEach((skillId, index) => {
            if (!bindings.has(skillId)) {
                const key = Object.values(CONTROL_CONFIG.defaultBindings)[index + 1];
                bindings.set(skillId, key);
            }
        });
    }

    // Get skill cooldown
    getSkillCooldown(playerId, skillId) {
        const playerSkills = this.activeSkills.get(playerId);
        if (!playerSkills) {
            return null;
        }

        const cooldownInfo = playerSkills.get(skillId);
        if (!cooldownInfo) {
            return 0;
        }

        const remaining = cooldownInfo.readyTime - Date.now();
        return Math.max(0, remaining / 1000);
    }

    // Level up skill
    levelUpSkill(playerId, skillId) {
        const playerLevels = this.skillLevels.get(playerId);
        if (!playerLevels) {
            return { success: false, error: 'Player skills not initialized' };
        }

        const currentLevel = playerLevels.get(skillId) || 0;
        if (currentLevel >= 5) { // Max skill level
            return { success: false, error: 'Skill already at max level' };
        }

        playerLevels.set(skillId, currentLevel + 1);
        return { success: true, level: currentLevel + 1 };
    }

    // Get available skills for character
    getAvailableSkills(characterId, playerLevel) {
        const character = CHARACTERS[characterId];
        if (!character) {
            return [];
        }

        return Object.values(SKILLS_CONFIG).filter(skill => 
            skill.weaponType === character.weaponType.id && 
            skill.unlockLevel <= playerLevel
        );
    }

    // Find skill in config
    findSkill(skillId) {
        return Object.values(SKILL_CONFIG.baseSkills)
            .concat(Object.values(SKILL_CONFIG.advancedSkills))
            .concat(Object.values(SKILL_CONFIG.ultimateSkills))
            .find(skill => skill.id === skillId);
    }

    // Change key binding
    changeKeyBinding(characterId, skillId, newKey) {
        const bindings = this.keyBindings.get(characterId);
        if (!bindings) return false;

        // Check if key is already in use
        for (const [existingSkill, key] of bindings) {
            if (key === newKey) return false;
        }

        bindings.set(skillId, newKey);
        return true;
    }

    // Get key binding for skill
    getKeyBinding(characterId, skillId) {
        return this.keyBindings.get(characterId)?.get(skillId);
    }
}

export default SkillManager;
