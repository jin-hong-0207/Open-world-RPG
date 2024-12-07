import EventEmitter from 'events';

export default class HUDManager extends EventEmitter {
    constructor(gamepadManager) {
        super();
        this.gamepadManager = gamepadManager;
        this.initializeHUD();
        this.setupEventListeners();
    }

    initializeHUD() {
        // Create main HUD container
        this.hudContainer = document.createElement('div');
        this.hudContainer.className = 'game-hud';
        document.body.appendChild(this.hudContainer);

        // Create player stats panel
        this.createStatsPanel();

        // Create skill hotbar
        this.createSkillHotbar();

        // Initialize update loop
        this.startUpdateLoop();
    }

    createStatsPanel() {
        const statsPanel = document.createElement('div');
        statsPanel.className = 'stats-panel';
        statsPanel.innerHTML = `
            <div class="stat-row">Level: <span id="player-level">1</span></div>
            <div class="stat-row">Experience: <span id="player-exp">0</span></div>
            <div class="stat-row">
                <div class="health-bar-container">
                    Health: <span id="player-health">100</span>/100
                    <div class="health-bar" style="width: 100%"></div>
                </div>
            </div>
            <div class="stat-row">
                <div class="energy-bar-container">
                    Energy: <span id="player-energy">100</span>/100
                    <div class="energy-bar" style="width: 100%"></div>
                </div>
            </div>
        `;
        this.hudContainer.appendChild(statsPanel);
    }

    createSkillHotbar() {
        const hotbar = document.createElement('div');
        hotbar.className = 'skill-hotbar';
        
        // Create skill slots with their respective hotkeys
        const skills = [
            { key: 'Q', id: 'skill1' },
            { key: 'E', id: 'skill2' },
            { key: 'R', id: 'skill3' },
            { key: 'F', id: 'skill4' }
        ];

        skills.forEach(skill => {
            const slot = document.createElement('div');
            slot.className = 'skill-slot';
            slot.innerHTML = `
                <div class="skill-icon" id="${skill.id}-icon"></div>
                <div class="skill-cooldown" id="${skill.id}-cooldown"></div>
                <div class="skill-key">${skill.key}</div>
            `;
            hotbar.appendChild(slot);
        });

        this.hudContainer.appendChild(hotbar);
    }

    setupEventListeners() {
        // Listen for gamepad input
        this.gamepadManager.on('buttonPressed', (button) => {
            this.handleSkillActivation(button);
        });

        // Listen for player stat updates
        window.addEventListener('playerStatsUpdate', (e) => {
            this.updatePlayerStats(e.detail);
        });

        // Listen for skill cooldown updates
        window.addEventListener('skillCooldownUpdate', (e) => {
            this.updateSkillCooldown(e.detail);
        });
    }

    handleSkillActivation(button) {
        // Map gamepad buttons to skill slots
        const buttonToSkill = {
            'LB': 'skill1', // Q
            'RB': 'skill2', // E
            'LT': 'skill3', // R
            'RT': 'skill4'  // F
        };

        const skillId = buttonToSkill[button];
        if (skillId) {
            this.emit('skillActivated', skillId);
            this.showSkillActivationFeedback(skillId);
        }
    }

    updatePlayerStats(stats) {
        // Update level and experience
        document.getElementById('player-level').textContent = stats.level;
        document.getElementById('player-exp').textContent = stats.experience;

        // Update health
        const healthPercent = (stats.health / stats.maxHealth) * 100;
        document.getElementById('player-health').textContent = stats.health;
        document.querySelector('.health-bar').style.width = `${healthPercent}%`;

        // Update energy
        const energyPercent = (stats.energy / stats.maxEnergy) * 100;
        document.getElementById('player-energy').textContent = stats.energy;
        document.querySelector('.energy-bar').style.width = `${energyPercent}%`;
    }

    updateSkillCooldown(skillInfo) {
        const { skillId, cooldownPercent } = skillInfo;
        const cooldownElement = document.getElementById(`${skillId}-cooldown`);
        if (cooldownElement) {
            cooldownElement.style.height = `${cooldownPercent}%`;
        }
    }

    showSkillActivationFeedback(skillId) {
        const iconElement = document.getElementById(`${skillId}-icon`);
        iconElement.classList.add('skill-activated');
        setTimeout(() => {
            iconElement.classList.remove('skill-activated');
        }, 200);
    }

    startUpdateLoop() {
        const update = () => {
            // Add any frame-by-frame updates here
            requestAnimationFrame(update);
        };
        update();
    }
}
