import { WORLD_CONFIG } from '../config/world-config.js';

export class WorldManager {
    constructor(app) {
        if (!app) {
            throw new Error('PlayCanvas app instance is required');
        }
        this.app = app;
        this.regions = new Map();
        this.currentRegion = null;
    }

    async initialize() {
        try {
            console.log('Starting world initialization...');
            await this.setupWorld();
            console.log('World setup complete');
            await this.createRegions();
            console.log('Regions created');
            await this.setupEnvironment();
            console.log('Environment setup complete');
            return true;
        } catch (error) {
            console.error('Failed to initialize world:', error);
            throw error;
        }
    }

    async setupWorld() {
        try {
            // Create the root entity for our world
            this.worldEntity = new pc.Entity('World');
            this.app.root.addChild(this.worldEntity);

            // Create terrain with height variations
            await this.createTerrain();
            
            // Create water features
            await this.createWaterBodies();
            
            // Create paths connecting regions
            await this.createPaths();
            
            console.log('World setup completed successfully');
        } catch (error) {
            console.error('Error in setupWorld:', error);
            throw error;
        }
    }

    async createTerrain() {
        // Create main terrain with height variations
        const terrain = new pc.Entity('Terrain');
        const terrainMaterial = new pc.StandardMaterial();
        terrainMaterial.diffuse = new pc.Color(0.4, 0.6, 0.3); // Base grass color
        terrainMaterial.update();

        // Create a grid of terrain segments for varied height
        const gridSize = 20;
        const segmentSize = 10;
        
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const segment = new pc.Entity(`TerrainSegment_${x}_${z}`);
                const height = this.generateTerrainHeight(x, z);
                
                segment.addComponent('render', {
                    type: 'box',
                    material: terrainMaterial
                });
                
                segment.setLocalPosition(
                    (x - gridSize/2) * segmentSize,
                    height/2,
                    (z - gridSize/2) * segmentSize
                );
                segment.setLocalScale(segmentSize, height, segmentSize);
                
                this.worldEntity.addChild(segment);
            }
        }
    }

    generateTerrainHeight(x, z) {
        // Simple noise function for terrain height
        const frequency = 0.1;
        return Math.abs(Math.sin(x * frequency) * Math.cos(z * frequency) * 5) + 0.5;
    }

    async createWaterBodies() {
        const waterMaterial = new pc.StandardMaterial();
        waterMaterial.diffuse = new pc.Color(0.2, 0.4, 0.8);
        waterMaterial.opacity = 0.8;
        waterMaterial.blendType = pc.BLEND_NORMAL;
        waterMaterial.update();

        // Create main river
        const river = new pc.Entity('River');
        river.addComponent('render', {
            type: 'plane',
            material: waterMaterial
        });
        river.setLocalPosition(0, 0.5, 0);
        river.setLocalScale(100, 1, 10);
        river.setLocalEulerAngles(0, 45, 0);
        this.worldEntity.addChild(river);

        // Create magical fountains
        const fountainPositions = [
            { x: 30, z: 30 },
            { x: -30, z: -30 },
            { x: 30, z: -30 }
        ];

        for (const pos of fountainPositions) {
            const fountain = this.createMagicalFountain(pos.x, pos.z);
            this.worldEntity.addChild(fountain);
        }
    }

    createMagicalFountain(x, z) {
        const fountain = new pc.Entity('MagicalFountain');
        
        // Base of the fountain
        const base = new pc.Entity('FountainBase');
        const baseMaterial = new pc.StandardMaterial();
        baseMaterial.diffuse = new pc.Color(0.7, 0.7, 0.8);
        baseMaterial.update();
        
        base.addComponent('render', {
            type: 'cylinder',
            material: baseMaterial
        });
        base.setLocalScale(5, 1, 5);
        fountain.addChild(base);

        // Create a simple particle texture
        const particleTexture = new pc.Texture(this.app.graphicsDevice, {
            width: 4,
            height: 4,
            format: pc.PIXELFORMAT_R8_G8_B8_A8
        });

        // Magical effect (particle system)
        const particles = new pc.Entity('FountainParticles');
        particles.addComponent('particlesystem', {
            numParticles: 50,
            lifetime: 2,
            rate: 0.1,
            startSize: 0.2,
            endSize: 0,
            colorMap: particleTexture,
            emitterShape: pc.EMITTERSHAPE_SPHERE,
            emitterRadius: 1
        });
        
        particles.setLocalPosition(0, 2, 0);
        fountain.addChild(particles);

        fountain.setLocalPosition(x, 0, z);
        return fountain;
    }

    async createPaths() {
        const pathMaterial = new pc.StandardMaterial();
        pathMaterial.diffuse = new pc.Color(0.6, 0.5, 0.4);
        pathMaterial.update();

        // Create connecting paths between regions
        const paths = [
            { start: { x: -30, z: -30 }, end: { x: 30, z: 30 } },
            { start: { x: -30, z: 30 }, end: { x: 30, z: -30 } }
        ];

        paths.forEach(path => {
            const pathEntity = new pc.Entity('Path');
            pathEntity.addComponent('render', {
                type: 'plane',
                material: pathMaterial
            });

            // Calculate path position and rotation
            const dx = path.end.x - path.start.x;
            const dz = path.end.z - path.start.z;
            const length = Math.sqrt(dx * dx + dz * dz);
            const angle = Math.atan2(dz, dx) * 180 / Math.PI;

            pathEntity.setLocalPosition(
                (path.start.x + path.end.x) / 2,
                0.1,
                (path.start.z + path.end.z) / 2
            );
            pathEntity.setLocalEulerAngles(0, angle, 0);
            pathEntity.setLocalScale(length, 1, 2);

            this.worldEntity.addChild(pathEntity);
        });
    }

    async createRegions() {
        Object.entries(WORLD_CONFIG.REGIONS).forEach(([key, config]) => {
            const region = new pc.Entity(config.name);
            region.setLocalPosition(config.position.x, 0, config.position.z);
            this.addRegionFeatures(region, config);
            this.worldEntity.addChild(region);
            this.regions.set(key, region);
        });
    }

    addRegionFeatures(region, config) {
        // Add region-specific features based on config
        config.features.forEach(feature => {
            const featureEntity = new pc.Entity(feature);
            // Add feature-specific components and properties
            region.addChild(featureEntity);
        });
    }

    async setupEnvironment() {
        // Add environmental effects like fog
        this.app.scene.fogDensity = 0.01;
        this.app.scene.fogColor = new pc.Color(0.8, 0.9, 1);
        
        // Add ambient sound if needed
        // this.setupAmbientSound();
    }
}
