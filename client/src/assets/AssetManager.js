import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default class AssetManager {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.gltfLoader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.audioLoader = new THREE.AudioLoader();
        
        // Configure DRACO loader
        this.dracoLoader.setDecoderPath('/draco/');
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
        
        // Asset storage
        this.models = new Map();
        this.textures = new Map();
        this.animations = new Map();
        this.sounds = new Map();
        this.uiElements = new Map();
        
        // Loading tracking
        this.loadingPromises = [];
        this.loadingProgress = 0;
    }

    async loadGameAssets() {
        // Character Models
        await this.loadCharacterAssets();
        
        // Map Assets
        await this.loadMapAssets();
        
        // Skill Effects
        await this.loadSkillAssets();
        
        // UI Elements
        await this.loadUIAssets();
        
        // Sound Effects
        await this.loadSoundAssets();
        
        return Promise.all(this.loadingPromises);
    }

    async loadCharacterAssets() {
        const characterModels = [
            { name: 'player', path: '/assets/models/characters/player.glb' },
            { name: 'npc_healer', path: '/assets/models/characters/healer.glb' },
            { name: 'npc_guide', path: '/assets/models/characters/guide.glb' }
        ];

        for (const model of characterModels) {
            this.loadingPromises.push(
                this.loadModel(model.name, model.path)
                    .then(gltf => {
                        this.models.set(model.name, {
                            model: gltf.scene,
                            animations: gltf.animations
                        });
                        
                        // Setup animations
                        const animations = {
                            idle: gltf.animations.find(a => a.name === 'idle'),
                            walk: gltf.animations.find(a => a.name === 'walk'),
                            run: gltf.animations.find(a => a.name === 'run'),
                            interact: gltf.animations.find(a => a.name === 'interact'),
                            skillCast: gltf.animations.find(a => a.name === 'skillCast')
                        };
                        
                        this.animations.set(model.name, animations);
                    })
            );
        }
    }

    async loadMapAssets() {
        const mapElements = [
            { name: 'terrain', path: '/assets/models/map/terrain.glb' },
            { name: 'trees', path: '/assets/models/map/trees.glb' },
            { name: 'rocks', path: '/assets/models/map/rocks.glb' },
            { name: 'interactive_objects', path: '/assets/models/map/interactive.glb' }
        ];

        for (const element of mapElements) {
            this.loadingPromises.push(
                this.loadModel(element.name, element.path)
                    .then(gltf => {
                        this.models.set(element.name, {
                            model: gltf.scene,
                            colliders: gltf.scene.children.filter(child => 
                                child.name.includes('collider'))
                        });
                    })
            );
        }
    }

    async loadSkillAssets() {
        const skillEffects = [
            { name: 'healing_aura', 
              texture: '/assets/textures/skills/healing_aura.png',
              sound: '/assets/sounds/skills/healing.mp3' },
            { name: 'energy_blast', 
              texture: '/assets/textures/skills/energy_blast.png',
              sound: '/assets/sounds/skills/blast.mp3' }
        ];

        for (const effect of skillEffects) {
            // Load texture
            this.loadingPromises.push(
                this.loadTexture(effect.name, effect.texture)
            );
            
            // Load sound
            this.loadingPromises.push(
                this.loadSound(effect.name, effect.sound)
            );
        }
    }

    async loadUIAssets() {
        const uiElements = [
            { name: 'skill_reticle', path: '/assets/ui/skills/reticle.png' },
            { name: 'health_bar', path: '/assets/ui/hud/health_bar.png' },
            { name: 'energy_bar', path: '/assets/ui/hud/energy_bar.png' },
            { name: 'interaction_prompt', path: '/assets/ui/prompts/interact.png' }
        ];

        for (const element of uiElements) {
            this.loadingPromises.push(
                this.loadTexture(element.name, element.path)
                    .then(texture => {
                        this.uiElements.set(element.name, texture);
                    })
            );
        }
    }

    async loadSoundAssets() {
        const soundEffects = [
            { name: 'button_click', path: '/assets/sounds/ui/click.mp3' },
            { name: 'skill_activate', path: '/assets/sounds/ui/skill_activate.mp3' },
            { name: 'interaction', path: '/assets/sounds/world/interact.mp3' }
        ];

        for (const sound of soundEffects) {
            this.loadingPromises.push(
                this.loadSound(sound.name, sound.path)
            );
        }
    }

    async loadModel(name, path) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                path,
                (gltf) => {
                    this.updateLoadingProgress();
                    resolve(gltf);
                },
                (progress) => {
                    // Handle loading progress
                },
                (error) => {
                    console.error(`Error loading model ${name}:`, error);
                    reject(error);
                }
            );
        });
    }

    async loadTexture(name, path) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                path,
                (texture) => {
                    this.textures.set(name, texture);
                    this.updateLoadingProgress();
                    resolve(texture);
                },
                (progress) => {
                    // Handle loading progress
                },
                (error) => {
                    console.error(`Error loading texture ${name}:`, error);
                    reject(error);
                }
            );
        });
    }

    async loadSound(name, path) {
        return new Promise((resolve, reject) => {
            this.audioLoader.load(
                path,
                (buffer) => {
                    this.sounds.set(name, buffer);
                    this.updateLoadingProgress();
                    resolve(buffer);
                },
                (progress) => {
                    // Handle loading progress
                },
                (error) => {
                    console.error(`Error loading sound ${name}:`, error);
                    reject(error);
                }
            );
        });
    }

    updateLoadingProgress() {
        const totalAssets = this.loadingPromises.length;
        const loadedAssets = [...this.models.size, ...this.textures.size, ...this.sounds.size].length;
        this.loadingProgress = (loadedAssets / totalAssets) * 100;
    }

    getModel(name) {
        return this.models.get(name);
    }

    getTexture(name) {
        return this.textures.get(name);
    }

    getAnimation(modelName, animationName) {
        const modelAnimations = this.animations.get(modelName);
        return modelAnimations ? modelAnimations[animationName] : null;
    }

    getSound(name) {
        return this.sounds.get(name);
    }

    getUIElement(name) {
        return this.uiElements.get(name);
    }

    getLoadingProgress() {
        return this.loadingProgress;
    }
}
