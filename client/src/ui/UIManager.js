export default class UIManager {
    constructor() {
        this.initializeUI();
    }

    initializeUI() {
        // Cache UI elements
        this.playerStats = {
            level: document.getElementById('player-level'),
            exp: document.getElementById('player-exp'),
            health: document.getElementById('player-health'),
            energy: document.getElementById('player-energy')
        };

        this.skillBar = document.getElementById('skill-bar');
        this.minimap = document.getElementById('minimap');
        this.minimapCtx = this.minimap.getContext('2d');

        // Initialize minimap
        this.setupMinimap();
    }

    setupMinimap() {
        // Set minimap size
        this.minimap.width = 200;
        this.minimap.height = 200;

        // Initial render
        this.renderMinimap();
    }

    renderMinimap() {
        const ctx = this.minimapCtx;
        
        // Clear minimap
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.minimap.width, this.minimap.height);
        
        // Draw border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.minimap.width, this.minimap.height);
    }

    updatePlayerStats(character) {
        if (!character) return;

        // Update stats display
        this.playerStats.level.textContent = character.level;
        this.playerStats.exp.textContent = character.experience;
        this.playerStats.health.textContent = character.health;
        this.playerStats.energy.textContent = character.energy;

        // Update health/energy bars if they exist
        this.updateStatBar('health', character.health);
        this.updateStatBar('energy', character.energy);
    }

    updateStatBar(statType, value) {
        const bar = document.querySelector(`.${statType}-bar .progress`);
        if (bar) {
            const percentage = Math.max(0, Math.min(100, value));
            bar.style.width = `${percentage}%`;
        }
    }

    updateSkillCooldown(skillIndex, cooldownPercentage) {
        const skillSlot = this.skillBar.children[skillIndex];
        if (skillSlot) {
            // Update cooldown overlay
            let cooldownOverlay = skillSlot.querySelector('.cooldown-overlay');
            if (!cooldownOverlay) {
                cooldownOverlay = document.createElement('div');
                cooldownOverlay.className = 'cooldown-overlay';
                skillSlot.appendChild(cooldownOverlay);
            }

            if (cooldownPercentage > 0) {
                cooldownOverlay.style.height = `${cooldownPercentage}%`;
                cooldownOverlay.style.display = 'block';
            } else {
                cooldownOverlay.style.display = 'none';
            }
        }
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.createElement('div');
        messageContainer.className = `game-message ${type}`;
        messageContainer.textContent = message;

        document.body.appendChild(messageContainer);

        // Animate message
        messageContainer.style.animation = 'fadeInOut 3s forwards';

        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 3000);
    }

    showPuzzleCompletion(puzzleId) {
        this.showMessage('Puzzle Completed!', 'success');
        
        // Add visual feedback
        const flash = document.createElement('div');
        flash.className = 'puzzle-complete-flash';
        document.body.appendChild(flash);

        // Remove flash effect
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 1000);
    }

    updateWorldState(data) {
        // Update minimap with world state
        this.renderMinimap();

        // Update any world state indicators
        if (data.timeOfDay !== undefined) {
            this.updateTimeOfDay(data.timeOfDay);
        }

        if (data.weather !== undefined) {
            this.updateWeather(data.weather);
        }
    }

    updateTimeOfDay(timeOfDay) {
        // Update time of day indicator
        const skyColor = this.getSkyColorForTime(timeOfDay);
        document.body.style.backgroundColor = skyColor;
    }

    updateWeather(weather) {
        // Remove any existing weather effects
        const existingWeather = document.querySelector('.weather-effect');
        if (existingWeather) {
            existingWeather.remove();
        }

        // Add new weather effect
        const weatherEffect = document.createElement('div');
        weatherEffect.className = `weather-effect ${weather}`;
        document.body.appendChild(weatherEffect);
    }

    getSkyColorForTime(time) {
        // time is between 0 (midnight) and 1 (next midnight)
        const colors = {
            dawn: '#FF7F50',
            day: '#87CEEB',
            dusk: '#4B0082',
            night: '#191970'
        };

        if (time < 0.25) { // Night to dawn
            return this.interpolateColor(colors.night, colors.dawn, time * 4);
        } else if (time < 0.5) { // Dawn to day
            return this.interpolateColor(colors.dawn, colors.day, (time - 0.25) * 4);
        } else if (time < 0.75) { // Day to dusk
            return this.interpolateColor(colors.day, colors.dusk, (time - 0.5) * 4);
        } else { // Dusk to night
            return this.interpolateColor(colors.dusk, colors.night, (time - 0.75) * 4);
        }
    }

    interpolateColor(color1, color2, factor) {
        const result = color1.match(/\w\w/g).map((c, i) => {
            const a = parseInt(color1.match(/\w\w/g)[i], 16);
            const b = parseInt(color2.match(/\w\w/g)[i], 16);
            return Math.round(a + (b - a) * factor).toString(16).padStart(2, '0');
        });
        return '#' + result.join('');
    }
}
