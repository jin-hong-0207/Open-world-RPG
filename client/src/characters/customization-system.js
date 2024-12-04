import { CHARACTER_CLASSES, CUSTOMIZATION_OPTIONS, UNLOCKABLE_CONTENT } from '../../../shared/characters/character-config';

class CharacterCustomization {
    constructor() {
        this.activeCustomizations = new Map();
        this.unlockedContent = new Set();
    }

    // Initialize character customization
    initializeCharacter(characterId, baseClass) {
        this.activeCustomizations.set(characterId, {
            class: baseClass,
            appearance: this.getDefaultAppearance(baseClass),
            equipment: this.getDefaultEquipment(baseClass),
            effects: new Map()
        });
    }

    // Get default appearance based on class
    getDefaultAppearance(characterClass) {
        const classData = CHARACTER_CLASSES[characterClass];
        return {
            body: CUSTOMIZATION_OPTIONS.body.types[0],
            height: CUSTOMIZATION_OPTIONS.body.heights.min,
            face: {
                shape: CUSTOMIZATION_OPTIONS.face.shapes[0],
                eyes: CUSTOMIZATION_OPTIONS.face.eyes[0],
                features: []
            },
            hair: {
                style: CUSTOMIZATION_OPTIONS.hair.styles[0],
                color: CUSTOMIZATION_OPTIONS.hair.colors[0]
            }
        };
    }

    // Get default equipment based on class
    getDefaultEquipment(characterClass) {
        const classData = CHARACTER_CLASSES[characterClass];
        return {
            weapon: classData.weapons[0],
            armor: classData.armor[0],
            accessories: {
                cape: null,
                belt: CUSTOMIZATION_OPTIONS.accessories.belts[0],
                gloves: CUSTOMIZATION_OPTIONS.accessories.gloves[0],
                boots: CUSTOMIZATION_OPTIONS.accessories.boots[0]
            }
        };
    }

    // Customize character appearance
    customizeAppearance(characterId, category, feature, value) {
        const character = this.activeCustomizations.get(characterId);
        if (!character) return false;

        switch (category) {
            case 'body':
                if (CUSTOMIZATION_OPTIONS.body.types.includes(value)) {
                    character.appearance.body = value;
                    return true;
                }
                break;
            case 'height':
                const { min, max, step } = CUSTOMIZATION_OPTIONS.body.heights;
                if (value >= min && value <= max) {
                    character.appearance.height = Math.round(value / step) * step;
                    return true;
                }
                break;
            case 'face':
                if (CUSTOMIZATION_OPTIONS.face[feature]?.includes(value)) {
                    character.appearance.face[feature] = value;
                    return true;
                }
                break;
            case 'hair':
                if (CUSTOMIZATION_OPTIONS.hair[feature]?.includes(value)) {
                    character.appearance.hair[feature] = value;
                    return true;
                }
                break;
        }
        return false;
    }

    // Equip items and accessories
    equipItem(characterId, slot, itemId) {
        const character = this.activeCustomizations.get(characterId);
        if (!character) return false;

        const classData = CHARACTER_CLASSES[character.class];
        
        switch (slot) {
            case 'weapon':
                if (classData.weapons.includes(itemId)) {
                    character.equipment.weapon = itemId;
                    return true;
                }
                break;
            case 'armor':
                if (classData.armor.includes(itemId)) {
                    character.equipment.armor = itemId;
                    return true;
                }
                break;
            case 'accessories':
                const accessoryType = Object.keys(CUSTOMIZATION_OPTIONS.accessories)
                    .find(type => CUSTOMIZATION_OPTIONS.accessories[type].includes(itemId));
                if (accessoryType) {
                    character.equipment.accessories[accessoryType] = itemId;
                    return true;
                }
                break;
        }
        return false;
    }

    // Apply visual effects
    applyEffect(characterId, effectType, effectConfig) {
        const character = this.activeCustomizations.get(characterId);
        if (!character) return false;

        character.effects.set(effectType, {
            ...effectConfig,
            timestamp: Date.now()
        });
        return true;
    }

    // Remove visual effects
    removeEffect(characterId, effectType) {
        const character = this.activeCustomizations.get(characterId);
        if (!character) return false;

        return character.effects.delete(effectType);
    }

    // Unlock new customization content
    unlockContent(contentId) {
        if (UNLOCKABLE_CONTENT.outfits[contentId] || UNLOCKABLE_CONTENT.weapons[contentId]) {
            this.unlockedContent.add(contentId);
            return true;
        }
        return false;
    }

    // Check if content is unlocked
    isContentUnlocked(contentId) {
        return this.unlockedContent.has(contentId);
    }

    // Get all available customization options for a character
    getAvailableOptions(characterId) {
        const character = this.activeCustomizations.get(characterId);
        if (!character) return null;

        const classData = CHARACTER_CLASSES[character.class];
        const unlockedOutfits = Array.from(this.unlockedContent)
            .filter(id => UNLOCKABLE_CONTENT.outfits[id]);
        const unlockedWeapons = Array.from(this.unlockedContent)
            .filter(id => UNLOCKABLE_CONTENT.weapons[id]);

        return {
            appearance: CUSTOMIZATION_OPTIONS,
            equipment: {
                weapons: [...classData.weapons, ...unlockedWeapons],
                armor: [...classData.armor, ...unlockedOutfits],
                accessories: CUSTOMIZATION_OPTIONS.accessories
            }
        };
    }

    // Save character customization
    saveCustomization(characterId) {
        const character = this.activeCustomizations.get(characterId);
        if (!character) return null;

        return {
            characterId,
            customization: {
                appearance: character.appearance,
                equipment: character.equipment,
                effects: Array.from(character.effects.entries())
            }
        };
    }

    // Load character customization
    loadCustomization(characterId, savedData) {
        if (!savedData || savedData.characterId !== characterId) return false;

        const character = this.activeCustomizations.get(characterId);
        if (!character) return false;

        character.appearance = savedData.customization.appearance;
        character.equipment = savedData.customization.equipment;
        character.effects = new Map(savedData.customization.effects);

        return true;
    }
}

export default CharacterCustomization;
