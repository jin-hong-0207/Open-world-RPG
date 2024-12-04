class InteractionSystem {
    constructor(world) {
        this.world = world;
        this.activeInteractions = new Map();
        this.interactiveObjects = new Map();
        this.highlightedObjects = new Set();
    }

    // Initialize interactive object
    registerInteractiveObject(objectId, config) {
        const interactiveObject = {
            id: objectId,
            type: config.type,
            position: config.position,
            radius: config.radius || 2,
            highlight: config.highlight || {
                color: '#4CAF50',
                intensity: 0.5
            },
            interactions: config.interactions || [],
            state: 'idle',
            cooldown: 0
        };

        this.interactiveObjects.set(objectId, interactiveObject);
        this.createInteractionTrigger(interactiveObject);
    }

    // Create interaction trigger zone
    createInteractionTrigger(object) {
        // Create collision trigger for interaction radius
        const trigger = {
            position: object.position,
            radius: object.radius,
            onEnter: (entity) => this.onTriggerEnter(object.id, entity),
            onExit: (entity) => this.onTriggerExit(object.id, entity)
        };

        // Register trigger with physics system
        this.world.physicsSystem.addTrigger(trigger);
    }

    // Handle trigger enter
    onTriggerEnter(objectId, entity) {
        if (entity.type === 'player') {
            // Highlight object
            this.highlightObject(objectId);

            // Show interaction prompt
            this.showInteractionPrompt(objectId, entity.id);
        }
    }

    // Handle trigger exit
    onTriggerExit(objectId, entity) {
        if (entity.type === 'player') {
            // Remove highlight
            this.removeHighlight(objectId);

            // Hide interaction prompt
            this.hideInteractionPrompt(objectId, entity.id);
        }
    }

    // Highlight interactive object
    highlightObject(objectId) {
        const object = this.interactiveObjects.get(objectId);
        if (!object || this.highlightedObjects.has(objectId)) return;

        // Create highlight effect
        const highlight = {
            color: object.highlight.color,
            intensity: object.highlight.intensity,
            pulse: {
                speed: 1,
                min: 0.8,
                max: 1.2
            }
        };

        // Add highlight effect
        this.world.effectSystem.addEffect('highlight', {
            targetId: objectId,
            effect: highlight
        });

        this.highlightedObjects.add(objectId);
    }

    // Remove highlight
    removeHighlight(objectId) {
        if (!this.highlightedObjects.has(objectId)) return;

        // Remove highlight effect
        this.world.effectSystem.removeEffect('highlight', objectId);

        this.highlightedObjects.delete(objectId);
    }

    // Show interaction prompt
    showInteractionPrompt(objectId, playerId) {
        const object = this.interactiveObjects.get(objectId);
        if (!object) return;

        // Get available interactions
        const interactions = this.getAvailableInteractions(object, playerId);
        if (interactions.length === 0) return;

        // Create prompt UI
        const prompt = {
            targetId: objectId,
            position: object.position,
            interactions: interactions.map(interaction => ({
                id: interaction.id,
                label: interaction.label,
                icon: interaction.icon,
                keybind: interaction.keybind
            }))
        };

        // Show prompt UI
        this.world.uiSystem.showPrompt('interaction', prompt);
    }

    // Hide interaction prompt
    hideInteractionPrompt(objectId, playerId) {
        this.world.uiSystem.hidePrompt('interaction', objectId);
    }

    // Get available interactions
    getAvailableInteractions(object, playerId) {
        return object.interactions.filter(interaction => {
            // Check cooldown
            if (interaction.cooldown && object.cooldown > Date.now()) {
                return false;
            }

            // Check requirements
            if (interaction.requirements) {
                return this.checkInteractionRequirements(interaction.requirements, playerId);
            }

            return true;
        });
    }

    // Check interaction requirements
    checkInteractionRequirements(requirements, playerId) {
        const player = this.world.getPlayer(playerId);
        if (!player) return false;

        // Check level requirement
        if (requirements.level && player.level < requirements.level) {
            return false;
        }

        // Check item requirements
        if (requirements.items) {
            for (const [itemId, amount] of Object.entries(requirements.items)) {
                if (!player.inventory.hasItem(itemId, amount)) {
                    return false;
                }
            }
        }

        // Check quest requirements
        if (requirements.quests) {
            for (const questId of requirements.quests) {
                if (!this.world.questSystem.isQuestCompleted(playerId, questId)) {
                    return false;
                }
            }
        }

        return true;
    }

    // Handle interaction
    handleInteraction(playerId, objectId, interactionId) {
        const object = this.interactiveObjects.get(objectId);
        if (!object) return false;

        const interaction = object.interactions.find(i => i.id === interactionId);
        if (!interaction) return false;

        // Check if interaction is available
        if (!this.getAvailableInteractions(object, playerId).includes(interaction)) {
            return false;
        }

        // Execute interaction
        switch (interaction.type) {
            case 'dialog':
                return this.startDialog(playerId, object, interaction);
            case 'quest':
                return this.handleQuestInteraction(playerId, object, interaction);
            case 'collect':
                return this.handleCollectInteraction(playerId, object, interaction);
            case 'puzzle':
                return this.startPuzzle(playerId, object, interaction);
            default:
                return false;
        }
    }

    // Start dialog
    startDialog(playerId, object, interaction) {
        const dialog = {
            id: interaction.dialogId,
            npc: object.id,
            player: playerId
        };

        // Start dialog sequence
        this.world.dialogSystem.startDialog(dialog);
        return true;
    }

    // Handle quest interaction
    handleQuestInteraction(playerId, object, interaction) {
        const questId = interaction.questId;

        if (interaction.action === 'start') {
            return this.world.questSystem.startQuest(playerId, questId);
        } else if (interaction.action === 'complete') {
            return this.world.questSystem.completeQuest(playerId, questId);
        }

        return false;
    }

    // Handle collect interaction
    handleCollectInteraction(playerId, object, interaction) {
        const player = this.world.getPlayer(playerId);
        if (!player) return false;

        // Add items to player inventory
        for (const [itemId, amount] of Object.entries(interaction.items)) {
            player.inventory.addItem(itemId, amount);
        }

        // Update object state
        object.state = 'collected';
        object.cooldown = Date.now() + (interaction.cooldown || 0);

        // Create collection effect
        this.world.effectSystem.addEffect('collect', {
            targetId: object.id,
            effect: interaction.collectEffect
        });

        return true;
    }

    // Start puzzle
    startPuzzle(playerId, object, interaction) {
        const puzzle = {
            id: interaction.puzzleId,
            player: playerId,
            object: object.id
        };

        // Start puzzle sequence
        this.world.puzzleSystem.startPuzzle(puzzle);
        return true;
    }

    // Update system
    update(deltaTime) {
        // Update interaction prompts
        for (const [objectId, object] of this.interactiveObjects) {
            if (object.state === 'collected' && object.cooldown <= Date.now()) {
                object.state = 'idle';
            }
        }

        // Update highlight effects
        for (const objectId of this.highlightedObjects) {
            const object = this.interactiveObjects.get(objectId);
            if (object) {
                // Pulse highlight effect
                const time = Date.now() / 1000;
                const pulse = Math.sin(time * 2) * 0.2 + 0.8;
                this.world.effectSystem.updateEffect('highlight', {
                    targetId: objectId,
                    intensity: object.highlight.intensity * pulse
                });
            }
        }
    }
}

export default InteractionSystem;
