class CharacterController {
    constructor() {
        this.characters = new Map();
    }

    // Character management
    createCharacter(playerId, characterData) {
        const character = {
            id: Math.random().toString(36).substr(2, 9),
            playerId,
            level: 1,
            experience: 0,
            skills: new Map(),
            stats: {
                health: 100,
                energy: 100,
                wisdom: 10,
                agility: 10,
                creativity: 10
            },
            resources: 100,
            ...characterData
        };
        this.characters.set(character.id, character);
        return character;
    }

    getCharacter(characterId) {
        return this.characters.get(characterId);
    }

    // Experience and leveling
    getExperience(characterId) {
        const character = this.getCharacter(characterId);
        return character ? character.experience : 0;
    }

    addExperience(characterId, amount) {
        const character = this.getCharacter(characterId);
        if (character) {
            character.experience += amount;
            this.checkLevelUp(character);
            return true;
        }
        return false;
    }

    getLevel(characterId) {
        const character = this.getCharacter(characterId);
        return character ? character.level : 1;
    }

    setLevel(characterId, level) {
        const character = this.getCharacter(characterId);
        if (character) {
            character.level = level;
            this.updateUnlockedSkills(character);
            return true;
        }
        return false;
    }

    levelUp(characterId) {
        const character = this.getCharacter(characterId);
        if (character) {
            character.level += 1;
            this.increaseStats(character);
            this.updateUnlockedSkills(character);
            return true;
        }
        return false;
    }

    // Skills
    getUnlockedSkills(characterId) {
        const character = this.getCharacter(characterId);
        if (!character) return [];
        
        const allSkills = [
            { id: 'meditation', minLevel: 1 },
            { id: 'puzzle_sense', minLevel: 2 },
            { id: 'nature_speak', minLevel: 3 },
            { id: 'time_shift', minLevel: 5 },
            { id: 'energy_burst', minLevel: 7 }
        ];

        return allSkills.filter(skill => character.level >= skill.minLevel);
    }

    useSkill(characterId, skillId) {
        const character = this.getCharacter(characterId);
        if (!character) return { success: false, message: 'Character not found' };

        const unlockedSkills = this.getUnlockedSkills(characterId);
        const skill = unlockedSkills.find(s => s.id === skillId);

        if (!skill) {
            return { success: false, message: 'Skill not unlocked' };
        }

        // Resource cost calculation
        const resourceCost = this.calculateSkillCost(skill);
        if (character.resources < resourceCost) {
            return { success: false, message: 'Insufficient resources' };
        }

        // Apply skill effects
        character.resources -= resourceCost;
        const effects = this.applySkillEffects(skill, character);

        return {
            success: true,
            effects,
            resourcesRemaining: character.resources
        };
    }

    // Resources
    getResources(characterId) {
        const character = this.getCharacter(characterId);
        return character ? character.resources : 0;
    }

    addResources(characterId, amount) {
        const character = this.getCharacter(characterId);
        if (character) {
            character.resources += amount;
            return true;
        }
        return false;
    }

    // Stats
    getStats(characterId) {
        const character = this.getCharacter(characterId);
        return character ? character.stats : null;
    }

    // Helper methods
    checkLevelUp(character) {
        const expNeeded = this.calculateExpNeeded(character.level);
        if (character.experience >= expNeeded) {
            character.level += 1;
            character.experience -= expNeeded;
            this.increaseStats(character);
            this.updateUnlockedSkills(character);
            return true;
        }
        return false;
    }

    calculateExpNeeded(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    increaseStats(character) {
        character.stats.health += 10;
        character.stats.energy += 5;
        character.stats.wisdom += Math.random() * 2 + 1;
        character.stats.agility += Math.random() * 2 + 1;
        character.stats.creativity += Math.random() * 2 + 1;
    }

    calculateSkillCost(skill) {
        const baseCosts = {
            meditation: 10,
            puzzle_sense: 15,
            nature_speak: 20,
            time_shift: 30,
            energy_burst: 25
        };
        return baseCosts[skill.id] || 10;
    }

    applySkillEffects(skill, character) {
        const effects = {
            meditation: () => ({
                type: 'resource_regen',
                amount: 20,
                duration: 10
            }),
            puzzle_sense: () => ({
                type: 'puzzle_hint',
                radius: 20,
                duration: 30
            }),
            nature_speak: () => ({
                type: 'environment_interaction',
                radius: 15,
                duration: 20
            }),
            time_shift: () => ({
                type: 'time_manipulation',
                amount: 5,
                duration: 15
            }),
            energy_burst: () => ({
                type: 'area_effect',
                radius: 10,
                duration: 5
            })
        };

        return effects[skill.id] ? effects[skill.id]() : null;
    }

    updateUnlockedSkills(character) {
        // This method would update the character's available skills based on level
        // Implementation details would depend on your skill system design
    }

    getCharacterStatus(characterId) {
        const character = this.getCharacter(characterId);
        if (!character) return null;

        return {
            id: character.id,
            level: character.level,
            experience: character.experience,
            stats: character.stats,
            resources: character.resources,
            unlockedSkills: this.getUnlockedSkills(characterId)
        };
    }
}

module.exports = CharacterController;
