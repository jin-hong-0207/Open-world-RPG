import { WORLD_CONFIG } from '../config/world-config.js';

export class WorldManager {
    constructor(app) {
        this.app = app;
        this.regions = new Map();
        this.currentRegion = null;
    }

    initialize() {
        this.setupWorld();
        this.createRegions();
        this.setupLighting();
        this.setupEnvironment();
    }

    setupWorld() {
        // Create the root entity for our world
        this.worldEntity = new pc.Entity('World');
        this.app.root.addChild(this.worldEntity);

        // Create ground plane
        const ground = new pc.Entity('Ground');
        ground.addComponent('render', {
            type: 'plane',
            material: this.createGroundMaterial()
        });
        ground.setLocalScale(WORLD_CONFIG.WORLD_SIZE.width, 1, WORLD_CONFIG.WORLD_SIZE.height);
        this.worldEntity.addChild(ground);
    }

    createRegions() {
        Object.entries(WORLD_CONFIG.REGIONS).forEach(([key, config]) => {
            const region = new pc.Entity(config.name);
            
            // Set position
            region.setPosition(
                config.position.x,
                config.position.y,
                config.position.z
            );

            // Add region-specific features
            this.addRegionFeatures(region, config);

            // Add to world and store reference
            this.worldEntity.addChild(region);
            this.regions.set(key, region);
        });
    }

    addRegionFeatures(region, config) {
        switch(config.type) {
            case 'town':
                this.createTownFeatures(region, config);
                break;
            case 'forest':
                this.createForestFeatures(region, config);
                break;
            case 'cave':
                this.createCaveFeatures(region, config);
                break;
            case 'mountain':
                this.createMountainFeatures(region, config);
                break;
        }
    }

    createTownFeatures(region, config) {
        // Create basic town layout
        const buildings = new pc.Entity('Buildings');
        region.addChild(buildings);
        
        // Add placeholder geometry for buildings
        config.features.forEach((feature, index) => {
            const building = new pc.Entity(feature);
            building.addComponent('render', {
                type: 'box',
                material: this.createBuildingMaterial()
            });
            building.setLocalPosition(
                (index - 2) * 20,
                5,
                0
            );
            building.setLocalScale(10, 10, 10);
            buildings.addChild(building);
        });
    }

    createForestFeatures(region, config) {
        // Create forest elements
        const trees = new pc.Entity('Trees');
        region.addChild(trees);

        // Add placeholder trees
        for (let i = 0; i < 50; i++) {
            const tree = new pc.Entity('tree_' + i);
            tree.addComponent('render', {
                type: 'cylinder',
                material: this.createTreeMaterial()
            });
            tree.setLocalPosition(
                Math.random() * config.size.width - config.size.width/2,
                10,
                Math.random() * config.size.width - config.size.width/2
            );
            tree.setLocalScale(2, 20, 2);
            trees.addChild(tree);
        }
    }

    createCaveFeatures(region, config) {
        // Create cave structure
        const cave = new pc.Entity('CaveStructure');
        region.addChild(cave);

        // Add basic cave geometry
        const caveEntrance = new pc.Entity('entrance');
        caveEntrance.addComponent('render', {
            type: 'sphere',
            material: this.createCaveMaterial()
        });
        caveEntrance.setLocalScale(20, 20, 20);
        cave.addChild(caveEntrance);
    }

    createMountainFeatures(region, config) {
        // Create mountain peak
        const mountain = new pc.Entity('MountainPeak');
        region.addChild(mountain);

        // Add basic mountain geometry
        const peak = new pc.Entity('peak');
        peak.addComponent('render', {
            type: 'cone',
            material: this.createMountainMaterial()
        });
        peak.setLocalScale(50, 100, 50);
        mountain.addChild(peak);
    }

    setupLighting() {
        // Create ambient light
        const ambient = new pc.Entity('Ambient');
        ambient.addComponent('light', {
            type: 'ambient',
            color: new pc.Color(0.2, 0.2, 0.2),
            intensity: 0.8
        });
        this.worldEntity.addChild(ambient);

        // Create directional light for sun
        const sun = new pc.Entity('Sun');
        sun.addComponent('light', {
            type: 'directional',
            color: new pc.Color(1, 1, 1),
            castShadows: true,
            intensity: 1,
            shadowDistance: 1000
        });
        sun.setEulerAngles(45, 30, 0);
        this.worldEntity.addChild(sun);
    }

    setupEnvironment() {
        if (WORLD_CONFIG.ENVIRONMENT.skybox) {
            // Add basic skybox
            this.app.scene.skyboxMip = 2;
            this.app.scene.skyboxIntensity = 0.7;
        }

        if (WORLD_CONFIG.ENVIRONMENT.fog.enabled) {
            // Setup fog
            this.app.scene.fog = WORLD_CONFIG.ENVIRONMENT.fog.type;
            this.app.scene.fogDensity = WORLD_CONFIG.ENVIRONMENT.fog.density;
            this.app.scene.fogColor = new pc.Color(
                WORLD_CONFIG.ENVIRONMENT.fog.color.r,
                WORLD_CONFIG.ENVIRONMENT.fog.color.g,
                WORLD_CONFIG.ENVIRONMENT.fog.color.b
            );
        }
    }

    // Material creation helpers
    createGroundMaterial() {
        const material = new pc.StandardMaterial();
        material.diffuse.set(0.5, 0.5, 0.5);
        material.update();
        return material;
    }

    createBuildingMaterial() {
        const material = new pc.StandardMaterial();
        material.diffuse.set(0.8, 0.7, 0.6);
        material.update();
        return material;
    }

    createTreeMaterial() {
        const material = new pc.StandardMaterial();
        material.diffuse.set(0.2, 0.5, 0.2);
        material.update();
        return material;
    }

    createCaveMaterial() {
        const material = new pc.StandardMaterial();
        material.diffuse.set(0.3, 0.3, 0.3);
        material.update();
        return material;
    }

    createMountainMaterial() {
        const material = new pc.StandardMaterial();
        material.diffuse.set(0.7, 0.7, 0.7);
        material.update();
        return material;
    }
}
