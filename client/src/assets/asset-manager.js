import ASSET_CONFIG from '../../../shared/assets/asset-config';

class AssetManager {
    constructor() {
        this.loadedModels = new Map();
        this.loadedAnimations = new Map();
        this.loadedTextures = new Map();
        this.loadedSounds = new Map();
        this.activeEffects = new Map();
    }

    // Initialize asset loading
    async initialize() {
        try {
            await Promise.all([
                this.preloadCharacterAssets(),
                this.preloadWorldAssets(),
                this.preloadCreatureAssets()
            ]);
            return true;
        } catch (error) {
            console.error('Failed to initialize assets:', error);
            return false;
        }
    }

    // Preload character assets
    async preloadCharacterAssets() {
        const { characters } = ASSET_CONFIG;

        // Load base models
        for (const [modelId, modelData] of Object.entries(characters.baseModels)) {
            await this.loadModel(modelId, modelData.model);
        }

        // Load character animations
        for (const category of Object.values(characters.animations)) {
            for (const animation of Object.values(category)) {
                await this.loadAnimation(animation.file);
            }
        }
    }

    // Preload world assets
    async preloadWorldAssets() {
        const { worldObjects } = ASSET_CONFIG;

        // Load nature objects
        for (const category of Object.values(worldObjects.nature)) {
            for (const [objectId, objectData] of Object.entries(category)) {
                await this.loadModel(objectId, objectData.model);
            }
        }

        // Load interactive objects
        for (const category of Object.values(worldObjects.interactive)) {
            for (const [objectId, objectData] of Object.entries(category)) {
                await this.loadModel(objectId, objectData.model);
                if (objectData.animations) {
                    for (const animPath of Object.values(objectData.animations)) {
                        await this.loadAnimation(animPath);
                    }
                }
                if (objectData.effects?.sound) {
                    for (const soundPath of Object.values(objectData.effects.sound)) {
                        await this.loadSound(soundPath);
                    }
                }
            }
        }

        // Load buildings
        for (const [buildingId, buildingData] of Object.entries(worldObjects.buildings)) {
            await this.loadModel(buildingId, buildingData.model);
        }
    }

    // Preload creature assets
    async preloadCreatureAssets() {
        const { creatures } = ASSET_CONFIG;

        for (const category of Object.values(creatures)) {
            for (const [creatureId, creatureData] of Object.entries(category)) {
                // Load model
                await this.loadModel(creatureId, creatureData.model);

                // Load animations
                for (const animPath of Object.values(creatureData.animations)) {
                    await this.loadAnimation(animPath);
                }

                // Load sounds
                if (creatureData.sound) {
                    for (const soundPath of Object.values(creatureData.sound)) {
                        await this.loadSound(soundPath);
                    }
                }
            }
        }
    }

    // Load 3D model
    async loadModel(modelId, modelPath) {
        if (this.loadedModels.has(modelId)) return;

        try {
            const model = await this.loadGLTF(modelPath);
            this.loadedModels.set(modelId, model);
        } catch (error) {
            console.error(`Failed to load model ${modelId}:`, error);
        }
    }

    // Load animation
    async loadAnimation(animationPath) {
        if (this.loadedAnimations.has(animationPath)) return;

        try {
            const animation = await this.loadGLTF(animationPath);
            this.loadedAnimations.set(animationPath, animation);
        } catch (error) {
            console.error(`Failed to load animation ${animationPath}:`, error);
        }
    }

    // Load sound
    async loadSound(soundPath) {
        if (this.loadedSounds.has(soundPath)) return;

        try {
            const sound = await this.loadAudio(soundPath);
            this.loadedSounds.set(soundPath, sound);
        } catch (error) {
            console.error(`Failed to load sound ${soundPath}:`, error);
        }
    }

    // Create visual effect
    createEffect(effectConfig, position) {
        const effectId = crypto.randomUUID();
        
        const effect = {
            config: effectConfig,
            position,
            particles: this.createParticleSystem(effectConfig.particles),
            lights: this.createLightSystem(effectConfig.glow)
        };

        this.activeEffects.set(effectId, effect);
        return effectId;
    }

    // Update effects
    updateEffects(deltaTime) {
        for (const [effectId, effect] of this.activeEffects) {
            // Update particle systems
            if (effect.particles) {
                this.updateParticleSystem(effect.particles, deltaTime);
            }

            // Update light effects
            if (effect.lights) {
                this.updateLightSystem(effect.lights, deltaTime);
            }

            // Remove completed effects
            if (this.isEffectComplete(effect)) {
                this.removeEffect(effectId);
            }
        }
    }

    // Create particle system
    createParticleSystem(config) {
        if (!config) return null;

        return {
            type: config.type,
            color: config.color,
            particles: Array(config.count).fill(null).map(() => ({
                position: { x: 0, y: 0, z: 0 },
                velocity: { x: 0, y: 0, z: 0 },
                size: this.getRandomRange(config.size),
                life: 1.0
            }))
        };
    }

    // Create light system
    createLightSystem(config) {
        if (!config) return null;

        return {
            color: config.color,
            intensity: config.intensity,
            pulse: config.pulse ? {
                ...config.pulse,
                phase: 0
            } : null
        };
    }

    // Update particle system
    updateParticleSystem(system, deltaTime) {
        system.particles.forEach(particle => {
            // Update position
            particle.position.x += particle.velocity.x * deltaTime;
            particle.position.y += particle.velocity.y * deltaTime;
            particle.position.z += particle.velocity.z * deltaTime;

            // Update life
            particle.life -= deltaTime;

            // Respawn dead particles
            if (particle.life <= 0) {
                this.respawnParticle(particle);
            }
        });
    }

    // Update light system
    updateLightSystem(system, deltaTime) {
        if (system.pulse) {
            system.pulse.phase += system.pulse.speed * deltaTime;
            const pulseFactor = Math.sin(system.pulse.phase) * 0.5 + 0.5;
            system.intensity = system.pulse.min + (system.pulse.max - system.pulse.min) * pulseFactor;
        }
    }

    // Helper: Get random range
    getRandomRange({ min, max }) {
        return min + Math.random() * (max - min);
    }

    // Helper: Respawn particle
    respawnParticle(particle) {
        particle.life = 1.0;
        particle.position = { x: 0, y: 0, z: 0 };
        particle.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * 2,
            z: (Math.random() - 0.5) * 2
        };
    }

    // Helper: Check if effect is complete
    isEffectComplete(effect) {
        // Add your effect completion logic here
        return false;
    }

    // Remove effect
    removeEffect(effectId) {
        const effect = this.activeEffects.get(effectId);
        if (effect) {
            // Cleanup effect resources
            if (effect.particles) {
                // Cleanup particle system
            }
            if (effect.lights) {
                // Cleanup light system
            }
            this.activeEffects.delete(effectId);
        }
    }

    // Get loaded model
    getModel(modelId) {
        return this.loadedModels.get(modelId);
    }

    // Get loaded animation
    getAnimation(animationPath) {
        return this.loadedAnimations.get(animationPath);
    }

    // Get loaded sound
    getSound(soundPath) {
        return this.loadedSounds.get(soundPath);
    }

    // Load GLTF model or animation
    async loadGLTF(path) {
        // Implement your GLTF loading logic here
        // This will depend on your 3D engine (Three.js, Babylon.js, etc.)
        return null;
    }

    // Load audio file
    async loadAudio(path) {
        // Implement your audio loading logic here
        return null;
    }
}

export default AssetManager;
