export default class QuestTrackerManager {
    constructor() {
        this.activeQuests = new Map();
        this.initializeTracker();
    }

    initializeTracker() {
        // Create quest tracker container
        this.container = document.createElement('div');
        this.container.className = 'quest-tracker';
        
        // Create header
        this.header = document.createElement('div');
        this.header.className = 'quest-tracker-header';
        this.header.innerHTML = `
            <h3>Active Quests</h3>
            <div class="quest-tracker-toggle">▼</div>
        `;
        
        // Create quest list
        this.questList = document.createElement('div');
        this.questList.className = 'quest-list';
        
        // Assemble tracker
        this.container.appendChild(this.header);
        this.container.appendChild(this.questList);
        document.body.appendChild(this.container);
        
        // Add styles
        this.addStyles();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .quest-tracker {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 300px;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                color: white;
                font-family: 'Arial', sans-serif;
                z-index: 1000;
                transition: transform 0.3s ease;
            }

            .quest-tracker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
            }

            .quest-tracker-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .quest-tracker-toggle {
                font-size: 12px;
                transition: transform 0.3s ease;
            }

            .quest-tracker.collapsed .quest-tracker-toggle {
                transform: rotate(-90deg);
            }

            .quest-list {
                max-height: 400px;
                overflow-y: auto;
                transition: max-height 0.3s ease;
            }

            .quest-tracker.collapsed .quest-list {
                max-height: 0;
                overflow: hidden;
            }

            .quest-item {
                padding: 12px 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                transition: background-color 0.2s ease;
            }

            .quest-item:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .quest-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 5px;
                color: #4ade80;
            }

            .quest-description {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 8px;
            }

            .quest-objectives {
                margin-left: 15px;
            }

            .quest-objective {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 4px;
                display: flex;
                align-items: center;
            }

            .objective-checkbox {
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 3px;
                margin-right: 8px;
                position: relative;
            }

            .objective-complete .objective-checkbox::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #4ade80;
                font-size: 10px;
            }

            .objective-complete {
                color: rgba(255, 255, 255, 0.5);
                text-decoration: line-through;
            }

            .quest-rewards {
                margin-top: 8px;
                font-size: 12px;
                color: #fbbf24;
            }

            /* Scrollbar styling */
            .quest-list::-webkit-scrollbar {
                width: 6px;
            }

            .quest-list::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
            }

            .quest-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 3px;
            }

            .quest-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.4);
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        this.header.addEventListener('click', () => {
            this.container.classList.toggle('collapsed');
        });
    }

    addQuest(quest) {
        const questElement = document.createElement('div');
        questElement.className = 'quest-item';
        questElement.innerHTML = `
            <div class="quest-title">${quest.title}</div>
            <div class="quest-description">${quest.description}</div>
            <div class="quest-objectives">
                ${quest.objectives.map(objective => `
                    <div class="quest-objective ${objective.complete ? 'objective-complete' : ''}">
                        <div class="objective-checkbox"></div>
                        ${objective.description}
                    </div>
                `).join('')}
            </div>
            <div class="quest-rewards">
                Rewards: ${quest.rewards.join(', ')}
            </div>
        `;

        this.questList.appendChild(questElement);
        this.activeQuests.set(quest.id, {
            element: questElement,
            data: quest
        });
    }

    updateQuest(questId, updates) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return;

        if (updates.objectives) {
            const objectiveElements = quest.element.querySelectorAll('.quest-objective');
            updates.objectives.forEach((objective, index) => {
                if (objective.complete) {
                    objectiveElements[index].classList.add('objective-complete');
                }
            });
        }

        if (updates.completed) {
            setTimeout(() => {
                quest.element.style.opacity = '0';
                setTimeout(() => {
                    quest.element.remove();
                    this.activeQuests.delete(questId);
                }, 300);
            }, 1000);
        }
    }

    removeQuest(questId) {
        const quest = this.activeQuests.get(questId);
        if (quest) {
            quest.element.remove();
            this.activeQuests.delete(questId);
        }
    }

    setVisible(visible) {
        this.container.style.display = visible ? 'block' : 'none';
    }
}
