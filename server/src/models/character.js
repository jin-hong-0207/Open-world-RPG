const Skill = require('./skill');
const visualConfigs = require('../config/visualConfigs');

class Character {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = 1;
        this.experience = 0;
        this.skills = new Map();
        this.maxSkills = 5;
        
        // Visual properties
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.currentAnimation = 'idle';
        this.visualConfig = visualConfigs.characters[type];
    }

    // Initialize character with basic skill
    initializeBasicSkill(skillConfig) {
        const basicSkill = new Skill(
            Date.now().toString(),
            skillConfig.name,
            skillConfig.type,
            skillConfig.config
        );
        this.skills.set(basicSkill.id, basicSkill);
        return basicSkill;
    }

    // Add experience points and handle level up
    addExperience(exp) {
        this.experience += exp;
        const oldLevel = this.level;
        // Simple level calculation: each level requires level * 1000 experience
        this.level = Math.floor(1 + Math.sqrt(this.experience / 1000));

        return {
            newExp: this.experience,
            leveledUp: this.level > oldLevel,
            newLevel: this.level
        };
    }

    // Unlock a new skill
    unlockSkill(skillConfig) {
        if (this.skills.size >= this.maxSkills) {
            return {
                success: false,
                error: 'Maximum number of skills reached'
            };
        }

        const newSkill = new Skill(
            Date.now().toString(),
            skillConfig.name,
            skillConfig.type,
            skillConfig.config
        );

        this.skills.set(newSkill.id, newSkill);
        return {
            success: true,
            skill: newSkill
        };
    }

    // Use a skill
    useSkill(skillId, target) {
        const skill = this.skills.get(skillId);
        if (!skill) {
            return {
                success: false,
                error: 'Skill not found'
            };
        }

        return skill.use(target);
    }

    // Level up a specific skill
    levelUpSkill(skillId) {
        const skill = this.skills.get(skillId);
        if (!skill) {
            return {
                success: false,
                error: 'Skill not found'
            };
        }

        return skill.levelUp();
    }

    // Update position and rotation
    updateTransform(position, rotation) {
        this.position = { ...this.position, ...position };
        this.rotation = { ...this.rotation, ...rotation };
    }

    // Update current animation
    setAnimation(animationName) {
        if (this.visualConfig.animations[animationName]) {
            this.currentAnimation = animationName;
            return true;
        }
        return false;
    }

    // Get visual effects for a skill
    getSkillVisualEffects(skillId) {
        const skill = this.skills.get(skillId);
        if (!skill) return null;

        return this.visualConfig.skillEffects[skill.name];
    }

    // Get character stats and skills
    getStatus() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            level: this.level,
            experience: this.experience,
            position: this.position,
            rotation: this.rotation,
            currentAnimation: this.currentAnimation,
            visualConfig: this.visualConfig,
            skills: Array.from(this.skills.values()).map(skill => ({
                id: skill.id,
                name: skill.name,
                type: skill.type,
                level: skill.level,
                cooldown: skill.cooldown,
                remainingCooldown: skill.getRemainingCooldown(),
                effectValue: skill.getCurrentEffectValue(),
                visualEffects: this.visualConfig.skillEffects[skill.name]
            }))
        };
    }
}

module.exports = Character;
