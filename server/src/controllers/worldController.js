const World = require('../models/world');

class WorldController {
    constructor() {
        this.world = new World();
        this.lastUpdate = Date.now();
        this.startWorldLoop();
    }

    // Start the world update loop
    startWorldLoop() {
        setInterval(() => {
            const now = Date.now();
            const deltaSeconds = (now - this.lastUpdate) / 1000;
            const deltaMinutes = deltaSeconds * (1 / this.world.config.worldSettings.timeScale);
            
            this.world.updateTime(deltaMinutes);
            this.lastUpdate = now;
        }, 1000); // Update every second
    }

    // Get current world state
    getWorldState() {
        return this.world.getWorldState();
    }

    // Get biome information at position
    getBiomeAt(position) {
        return this.world.getBiomeAt(position);
    }

    // Interactive object methods
    addInteractiveObject(type, position) {
        const id = Date.now().toString();
        return this.world.addInteractiveObject(id, type, position);
    }

    interactWithObject(objectId, interaction, data) {
        return this.world.interactWithObject(objectId, interaction, data);
    }

    // Collectible methods
    spawnCollectible(type, subtype, position) {
        return this.world.spawnCollectible(type, subtype, position);
    }

    collectItem(collectibleId, playerId) {
        return this.world.collectItem(collectibleId, playerId);
    }

    // Weather methods
    getCurrentWeather() {
        return {
            current: this.world.currentWeather,
            effects: this.world.config.weather.types[this.world.currentWeather].effects,
            nextChange: this.world.nextWeatherChange - this.world.time
        };
    }

    // Time methods
    getTimeInfo() {
        return {
            time: this.world.time,
            dayNightCycle: this.world.getDayNightCycle()
        };
    }

    // World configuration
    getWorldConfig() {
        return this.world.config;
    }
}

module.exports = WorldController;
