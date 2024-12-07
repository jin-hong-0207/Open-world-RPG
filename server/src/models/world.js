const worldConfig = require('../config/worldConfig');

class World {
    constructor() {
        this.config = worldConfig;
        this.time = 0; // Minutes since world creation
        this.dayLength = 24 * 60; // 24 hours in minutes
        this.currentWeather = 'clear';
        this.nextWeatherChange = 60; // Minutes until next weather change
        this.interactiveObjects = new Map();
        this.collectibles = new Map();
        this.activeEffects = new Map();
    }

    // Time management
    updateTime(deltaMinutes) {
        this.time += deltaMinutes;
        this.updateDayNightCycle();
        this.updateWeather();
    }

    getDayNightCycle() {
        const dayMinutes = this.time % this.config.worldSettings.dayNightCycle;
        const hour = Math.floor(dayMinutes / 60);
        const minute = Math.floor(dayMinutes % 60);
        const isDaytime = hour >= 6 && hour < 18;

        return {
            hour,
            minute,
            isDaytime,
            lightLevel: this.calculateLightLevel(hour)
        };
    }

    calculateLightLevel(hour) {
        // Returns light level between 0 (darkest) and 1 (brightest)
        if (hour >= 12) hour = 24 - hour; // Mirror the curve after noon
        return Math.sin((hour / 12) * Math.PI) * 0.8 + 0.2;
    }

    updateDayNightCycle() {
        const timeOfDay = this.time % this.dayLength;
        const hour = Math.floor(timeOfDay / 60);
        
        // Update lighting based on time
        if (hour >= 6 && hour < 18) {
            this.isDaytime = true;
            this.lightLevel = this.calculateDaylightLevel(hour);
        } else {
            this.isDaytime = false;
            this.lightLevel = this.calculateNightlightLevel(hour);
        }
    }

    calculateDaylightLevel(hour) {
        // Peak brightness at noon (hour 12)
        const distanceFromNoon = Math.abs(12 - hour);
        return 1 - (distanceFromNoon / 6) * 0.3; // 0.7 to 1.0
    }

    calculateNightlightLevel(hour) {
        // Darkest at midnight (hour 0)
        const adjustedHour = hour < 6 ? hour : hour - 18;
        const distanceFromMidnight = Math.abs(adjustedHour);
        return 0.2 + (distanceFromMidnight / 6) * 0.1; // 0.2 to 0.3
    }

    // Weather system
    updateWeather() {
        if (this.time >= this.nextWeatherChange) {
            this.changeWeather();
        } else {
            this.nextWeatherChange -= 1;
        }
    }

    changeWeather() {
        const weatherTypes = Object.keys(this.config.weather.types);
        const weights = weatherTypes.map(type => this.config.weather.types[type].probability);
        
        // Select new weather based on probability
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        let newWeather = weatherTypes[0];
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                newWeather = weatherTypes[i];
                break;
            }
        }

        const weatherConfig = this.config.weather.types[newWeather];
        const duration = Math.floor(
            weatherConfig.duration.min + 
            Math.random() * (weatherConfig.duration.max - weatherConfig.duration.min)
        );

        this.currentWeather = newWeather;
        this.nextWeatherChange = this.time + duration;

        return {
            type: newWeather,
            duration,
            effects: weatherConfig.effects
        };
    }

    // Biome management
    getBiomeAt(position) {
        for (const [biomeName, biome] of Object.entries(this.config.biomes)) {
            if (position.x >= biome.bounds.x1 && position.x <= biome.bounds.x2 &&
                position.y >= biome.bounds.y1 && position.y <= biome.bounds.y2) {
                return {
                    name: biomeName,
                    ...biome
                };
            }
        }
        return null;
    }

    // Interactive object management
    addInteractiveObject(id, type, position) {
        const objectConfig = this.config.interactiveObjects[type];
        if (!objectConfig) return null;

        const object = {
            id,
            type,
            position,
            state: 'inactive',
            config: objectConfig,
            lastInteraction: null
        };

        this.interactiveObjects.set(id, object);
        return object;
    }

    interactWithObject(objectId, interaction, data = {}) {
        const object = this.interactiveObjects.get(objectId);
        if (!object) return null;

        const interactionConfig = object.config.interactions;
        if (!interactionConfig[interaction]) return null;

        // Handle interaction based on type
        switch (interaction) {
            case 'move':
                if (!interactionConfig.movable) return null;
                object.position = data.newPosition;
                break;
            case 'activate':
                if (!interactionConfig.activatable) return null;
                object.state = object.state === 'active' ? 'inactive' : 'active';
                break;
            case 'open':
                if (!interactionConfig.openable) return null;
                object.state = 'open';
                break;
        }

        object.lastInteraction = this.time;
        return {
            success: true,
            newState: object.state,
            effects: object.config.effects
        };
    }

    // Collectible management
    spawnCollectible(type, subtype, position) {
        const collectibleConfig = this.config.collectibles[type];
        if (!collectibleConfig || !collectibleConfig.types[subtype]) return null;

        const id = Date.now().toString();
        const collectible = {
            id,
            type,
            subtype,
            position,
            config: collectibleConfig,
            collected: false
        };

        this.collectibles.set(id, collectible);
        return collectible;
    }

    collectItem(collectibleId, playerId) {
        const collectible = this.collectibles.get(collectibleId);
        if (!collectible || collectible.collected) return null;

        collectible.collected = true;
        collectible.collectedBy = playerId;
        collectible.collectedAt = this.time;

        return {
            success: true,
            item: collectible,
            effects: collectible.config.effects.pickup
        };
    }

    // Object management
    addObject(object) {
        this.interactiveObjects.set(object.id, object);
    }

    removeObject(objectId) {
        this.interactiveObjects.delete(objectId);
    }

    getObject(objectId) {
        return this.interactiveObjects.get(objectId);
    }

    // State management
    getWorldState() {
        return {
            time: this.time,
            dayNightCycle: this.getDayNightCycle(),
            weather: {
                current: this.currentWeather,
                effects: this.config.weather.types[this.currentWeather].effects,
                nextChange: this.nextWeatherChange - this.time
            },
            interactiveObjects: Array.from(this.interactiveObjects.values()),
            collectibles: Array.from(this.collectibles.values())
                .filter(c => !c.collected)
        };
    }

    getState() {
        return {
            time: this.time,
            isDaytime: this.isDaytime,
            lightLevel: this.lightLevel,
            weather: this.currentWeather,
            objects: Array.from(this.interactiveObjects.values()),
            collectibles: Array.from(this.collectibles.values())
        };
    }
}

module.exports = World;
