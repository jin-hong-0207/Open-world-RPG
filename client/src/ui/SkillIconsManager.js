export default class SkillIconsManager {
    constructor() {
        this.skillIcons = {
            'healing_aura': {
                background: 'radial-gradient(circle, #4ade80 0%, #22c55e 100%)',
                symbol: `
                    <svg viewBox="0 0 24 24" class="skill-icon-svg">
                        <path d="M12 2L8 6h3v6H5v3h6v6h2v-6h6v-3h-6V6h3L12 2z" 
                              fill="white" class="skill-icon-path"/>
                    </svg>
                `,
                color: '#4ade80'
            },
            'energy_blast': {
                background: 'radial-gradient(circle, #60a5fa 0%, #3b82f6 100%)',
                symbol: `
                    <svg viewBox="0 0 24 24" class="skill-icon-svg">
                        <path d="M13 3L4 14h7v7l9-11h-7V3z" 
                              fill="white" class="skill-icon-path"/>
                    </svg>
                `,
                color: '#60a5fa'
            },
            'shield': {
                background: 'radial-gradient(circle, #f472b6 0%, #ec4899 100%)',
                symbol: `
                    <svg viewBox="0 0 24 24" class="skill-icon-svg">
                        <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" 
                              fill="white" class="skill-icon-path"/>
                    </svg>
                `,
                color: '#f472b6'
            },
            'speed_boost': {
                background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 100%)',
                symbol: `
                    <svg viewBox="0 0 24 24" class="skill-icon-svg">
                        <path d="M13.75 22c0 0-3.75-5.5-3.75-10.5S13.75 2 13.75 2s3.75 4.5 3.75 9.5S13.75 22 13.75 22z" 
                              fill="white" class="skill-icon-path"/>
                    </svg>
                `,
                color: '#fbbf24'
            }
        };

        this.createStyleSheet();
    }

    createStyleSheet() {
        const style = document.createElement('style');
        style.textContent = `
            .skill-icon-container {
                width: 100%;
                height: 100%;
                position: relative;
                border-radius: 8px;
                overflow: hidden;
            }

            .skill-icon-background {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0.8;
            }

            .skill-icon-svg {
                width: 60%;
                height: 60%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
            }

            .skill-icon-path {
                transform-origin: center;
                transition: transform 0.2s ease;
            }

            .skill-icon-container:hover .skill-icon-path {
                transform: scale(1.1);
            }

            .skill-icon-glow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .skill-icon-container:hover .skill-icon-glow {
                opacity: 0.3;
            }

            .skill-active .skill-icon-glow {
                opacity: 0.5;
                animation: pulse 1s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.3; }
                100% { transform: scale(1); opacity: 0.5; }
            }

            .skill-cooldown-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                font-size: 12px;
                text-align: center;
                padding: 2px 0;
                transform: translateY(100%);
                transition: transform 0.2s ease;
            }

            .skill-icon-container:hover .skill-cooldown-overlay {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    createSkillIcon(skillType) {
        const iconData = this.skillIcons[skillType];
        if (!iconData) return null;

        const container = document.createElement('div');
        container.className = 'skill-icon-container';

        // Background
        const background = document.createElement('div');
        background.className = 'skill-icon-background';
        background.style.background = iconData.background;
        container.appendChild(background);

        // SVG Icon
        container.insertAdjacentHTML('beforeend', iconData.symbol);

        // Glow effect
        const glow = document.createElement('div');
        glow.className = 'skill-icon-glow';
        glow.style.background = `radial-gradient(circle, ${iconData.color}66 0%, transparent 70%)`;
        container.appendChild(glow);

        // Cooldown overlay
        const cooldown = document.createElement('div');
        cooldown.className = 'skill-cooldown-overlay';
        cooldown.textContent = '0.0s';
        container.appendChild(cooldown);

        return container;
    }

    updateCooldown(container, remainingCooldown) {
        const cooldownOverlay = container.querySelector('.skill-cooldown-overlay');
        if (cooldownOverlay) {
            cooldownOverlay.textContent = `${remainingCooldown.toFixed(1)}s`;
            container.classList.toggle('skill-active', remainingCooldown > 0);
        }
    }

    setSkillActive(container, active) {
        container.classList.toggle('skill-active', active);
    }
}
