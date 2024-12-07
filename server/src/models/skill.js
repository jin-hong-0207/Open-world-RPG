class Skill {
    constructor(id, name, type, config) {
        this.id = id;
        this.name = name;
        this.type = type; // 'healing', 'boost', 'movement', 'environmental'
        this.level = 1;
        this.maxLevel = config.maxLevel || 5;
        this.cooldown = config.cooldown; // in seconds
        this.lastUsed = null;
        this.config = {
            ...config,
            baseEffectValue: config.baseEffectValue,
            effectScaling: config.effectScaling || 1.2, // 20% increase per level
            duration: config.duration || null
        };
    }

    // Calculate current effect value based on skill level
    getCurrentEffectValue() {
        return this.config.baseEffectValue * 
               Math.pow(this.config.effectScaling, this.level - 1);
    }

    // Check if skill is ready to use
    isReady() {
        if (!this.lastUsed) return true;
        const currentTime = Date.now();
        return (currentTime - this.lastUsed) >= (this.cooldown * 1000);
    }

    // Use the skill
    use() {
        if (!this.isReady()) {
            return {
                success: false,
                error: 'Skill is on cooldown'
            };
        }

        this.lastUsed = Date.now();
        return {
            success: true,
            effect: {
                value: this.getCurrentEffectValue(),
                duration: this.config.duration,
                type: this.type
            }
        };
    }

    // Level up the skill
    levelUp() {
        if (this.level >= this.maxLevel) {
            return {
                success: false,
                error: 'Skill is already at max level'
            };
        }

        this.level++;
        return {
            success: true,
            newLevel: this.level,
            newEffectValue: this.getCurrentEffectValue()
        };
    }

    // Get remaining cooldown in seconds
    getRemainingCooldown() {
        if (!this.lastUsed) return 0;
        const currentTime = Date.now();
        const remainingTime = (this.cooldown * 1000) - (currentTime - this.lastUsed);
        return Math.max(0, remainingTime / 1000);
    }
}

module.exports = Skill;
