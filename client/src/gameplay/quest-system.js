const { QUEST_CONFIG, QUEST_REQUIREMENTS, QUEST_REWARDS } = require('../quests/quests-config');

class QuestSystem {
    constructor(world) {
        this.world = world;
        this.activeQuests = new Map();
        this.completedQuests = new Set();
        this.questMarkers = new Map();
        this.questRewards = new Map();
    }

    // Start a new quest
    startQuest(playerId, questId) {
        const questConfig = this.getQuestConfig(questId);
        if (!questConfig) return false;

        // Check requirements
        if (!this.checkQuestRequirements(playerId, questConfig)) {
            return false;
        }

        // Initialize quest progress
        const questProgress = {
            id: questId,
            stages: this.initializeQuestStages(questConfig),
            status: 'active',
            startTime: Date.now()
        };

        // Add to active quests
        this.activeQuests.set(`${playerId}_${questId}`, questProgress);

        // Create quest markers
        this.createQuestMarkers(questConfig);

        // Trigger quest start events
        this.triggerQuestEvent(playerId, questId, 'start');

        return true;
    }

    // Initialize quest stages
    initializeQuestStages(questConfig) {
        if (questConfig.stages) {
            return questConfig.stages.map(stage => ({
                ...stage,
                status: 'pending',
                objectives: stage.objectives.map(obj => ({
                    ...obj,
                    progress: 0,
                    completed: false
                }))
            }));
        } else if (questConfig.objectives) {
            return [{
                id: 'main',
                status: 'active',
                objectives: questConfig.objectives.map(obj => ({
                    ...obj,
                    progress: 0,
                    completed: false
                }))
            }];
        }
    }

    // Update quest progress
    updateQuestProgress(playerId, questId, updateType, data) {
        const questProgress = this.getQuestProgress(playerId, questId);
        if (!questProgress) return;

        const questConfig = this.getQuestConfig(questId);
        let updated = false;

        // Update objectives
        questProgress.stages.forEach(stage => {
            if (stage.status !== 'active') return;

            stage.objectives.forEach(objective => {
                if (objective.completed) return;

                if (this.checkObjectiveUpdate(objective, updateType, data)) {
                    objective.progress++;
                    updated = true;

                    if (objective.progress >= objective.amount) {
                        objective.completed = true;
                        this.triggerQuestEvent(playerId, questId, 'objective_complete', {
                            objective: objective.id
                        });
                    }
                }
            });

            // Check stage completion
            if (stage.objectives.every(obj => obj.completed)) {
                stage.status = 'completed';
                this.triggerQuestEvent(playerId, questId, 'stage_complete', {
                    stage: stage.id
                });
            }
        });

        if (updated) {
            this.checkQuestCompletion(playerId, questId);
            this.updateQuestMarkers(questId);
        }
    }

    // Check objective update
    checkObjectiveUpdate(objective, updateType, data) {
        switch (objective.type) {
            case 'explore':
                return updateType === 'location_visit' && data.location === objective.target;
            case 'collect':
                return updateType === 'item_collect' && data.item === objective.item;
            case 'defeat':
                return updateType === 'creature_defeat' && data.creature === objective.target;
            case 'talk':
                return updateType === 'npc_talk' && data.npc === objective.target;
            case 'solve':
                return updateType === 'puzzle_solve' && data.puzzle === objective.puzzle;
            default:
                return false;
        }
    }

    // Check quest completion
    checkQuestCompletion(playerId, questId) {
        const questProgress = this.getQuestProgress(playerId, questId);
        if (!questProgress) return;

        // Check if all stages are completed
        if (questProgress.stages.every(stage => stage.status === 'completed')) {
            this.completeQuest(playerId, questId);
        }
    }

    // Complete quest
    completeQuest(playerId, questId) {
        const questProgress = this.getQuestProgress(playerId, questId);
        if (!questProgress || questProgress.status === 'completed') return;

        const questConfig = this.getQuestConfig(questId);

        // Calculate rewards
        const rewards = this.calculateQuestRewards(playerId, questConfig);
        this.questRewards.set(`${playerId}_${questId}`, rewards);

        // Update quest status
        questProgress.status = 'completed';
        this.completedQuests.add(`${playerId}_${questId}`);

        // Remove quest markers
        this.removeQuestMarkers(questId);

        // Trigger completion event
        this.triggerQuestEvent(playerId, questId, 'complete', { rewards });
    }

    // Calculate quest rewards
    calculateQuestRewards(playerId, questConfig) {
        const playerLevel = this.world.getPlayerLevel(playerId);
        const baseRewards = questConfig.rewards;

        return {
            experience: QUEST_REWARDS.calculateExperience(
                baseRewards.experience,
                playerLevel,
                questConfig.level.required || questConfig.level.recommended
            ),
            gold: QUEST_REWARDS.calculateGold(
                baseRewards.gold,
                questConfig.level.required || questConfig.level.recommended
            ),
            items: baseRewards.items
        };
    }

    // Create quest markers
    createQuestMarkers(questConfig) {
        const markers = [];

        // Add quest giver marker
        if (questConfig.giver) {
            markers.push({
                type: 'quest_giver',
                position: this.world.getNPCPosition(questConfig.giver),
                data: { npc: questConfig.giver }
            });
        }

        // Add objective markers
        questConfig.stages?.forEach(stage => {
            stage.objectives.forEach(objective => {
                if (objective.location) {
                    markers.push({
                        type: 'objective',
                        position: this.world.getLocationPosition(objective.location),
                        data: { objective }
                    });
                }
            });
        });

        this.questMarkers.set(questConfig.id, markers);
    }

    // Update quest markers
    updateQuestMarkers(questId) {
        const markers = this.questMarkers.get(questId);
        if (!markers) return;

        markers.forEach(marker => {
            // Update marker appearance based on objective status
            if (marker.type === 'objective') {
                const objective = this.getObjectiveStatus(questId, marker.data.objective);
                marker.status = objective.completed ? 'completed' : 'active';
            }
        });
    }

    // Remove quest markers
    removeQuestMarkers(questId) {
        this.questMarkers.delete(questId);
    }

    // Check quest requirements
    checkQuestRequirements(playerId, questConfig) {
        const playerLevel = this.world.getPlayerLevel(playerId);
        const playerReputation = this.world.getPlayerReputation(playerId);

        // Check level requirement
        if (!QUEST_REQUIREMENTS.levelRequirement(playerLevel, questConfig.level)) {
            return false;
        }

        // Check prerequisite quests
        if (questConfig.prerequisites) {
            if (!QUEST_REQUIREMENTS.prerequisiteQuests(
                Array.from(this.completedQuests),
                questConfig.prerequisites
            )) {
                return false;
            }
        }

        // Check reputation requirement
        if (questConfig.reputation) {
            if (!QUEST_REQUIREMENTS.reputationRequirement(
                playerReputation,
                questConfig.reputation
            )) {
                return false;
            }
        }

        return true;
    }

    // Helper: Get quest configuration
    getQuestConfig(questId) {
        // Check main quests
        if (QUEST_CONFIG.mainQuests[questId]) {
            return QUEST_CONFIG.mainQuests[questId];
        }
        // Check side quests
        if (QUEST_CONFIG.sideQuests[questId]) {
            return QUEST_CONFIG.sideQuests[questId];
        }
        // Check daily quests
        if (QUEST_CONFIG.dailyQuests[questId]) {
            return QUEST_CONFIG.dailyQuests[questId];
        }
        return null;
    }

    // Helper: Get quest progress
    getQuestProgress(playerId, questId) {
        return this.activeQuests.get(`${playerId}_${questId}`);
    }

    // Helper: Get objective status
    getObjectiveStatus(questId, objective) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return null;

        for (const stage of quest.stages) {
            const obj = stage.objectives.find(o => o.id === objective.id);
            if (obj) return obj;
        }
        return null;
    }

    // Trigger quest event
    triggerQuestEvent(playerId, questId, eventType, data = {}) {
        const event = {
            type: `quest_${eventType}`,
            questId,
            playerId,
            timestamp: Date.now(),
            data
        };

        // Dispatch event to relevant systems
        this.world.eventSystem.dispatch(event);
    }

    // Start a new quest
    startQuest(questId) {
        const quest = QUEST_CONFIG[questId];
        if (!quest) {
            throw new Error(`Quest ${questId} not found`);
        }
        
        if (this.activeQuests.has(questId)) {
            throw new Error(`Quest ${questId} is already active`);
        }

        this.activeQuests.set(questId, {
            quest,
            progress: quest.objectives.map(obj => ({
                ...obj,
                current: 0
            }))
        });
    }

    // Update progress
    updateProgress(questId, objectiveId, amount = 1) {
        const questData = this.activeQuests.get(questId);
        if (!questData) {
            return false;
        }

        const objective = questData.progress.find(obj => obj.id === objectiveId);
        if (!objective) {
            return false;
        }

        objective.current += amount;
        return this.checkQuestCompletion(questId);
    }

    // Check quest completion
    checkQuestCompletion(questId) {
        const questData = this.activeQuests.get(questId);
        if (!questData) {
            return false;
        }

        const completed = questData.progress.every(obj => obj.current >= obj.required);
        if (completed) {
            this.completeQuest(questId);
        }
        return completed;
    }

    // Complete quest
    completeQuest(questId) {
        const questData = this.activeQuests.get(questId);
        if (!questData) {
            return false;
        }

        this.activeQuests.delete(questId);
        this.completedQuests.add(questId);
        return true;
    }

    // Get quest progress
    getQuestProgress(questId) {
        return this.activeQuests.get(questId)?.progress || null;
    }

    // Is quest completed
    isQuestCompleted(questId) {
        return this.completedQuests.has(questId);
    }

    // Get available quests
    getAvailableQuests(playerLevel, playerReputation) {
        return Object.entries(QUEST_CONFIG)
            .filter(([questId, quest]) => {
                if (this.activeQuests.has(questId) || this.completedQuests.has(questId)) {
                    return false;
                }

                return QUEST_REQUIREMENTS.levelRequirement(playerLevel, quest.level_requirement) &&
                    (!quest.reputation_requirement || 
                     QUEST_REQUIREMENTS.reputationRequirement(playerReputation, quest.reputation_requirement));
            })
            .map(([_, quest]) => quest);
    }
}

module.exports = { QuestSystem };
