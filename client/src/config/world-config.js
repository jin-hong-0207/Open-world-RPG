export const WORLD_CONFIG = {
    // World dimensions
    WORLD_SIZE: {
        width: 1000,  // width in meters
        height: 1000  // length in meters
    },

    // Regions configuration
    REGIONS: {
        TOWN: {
            name: 'Eldervale Town',
            position: { x: 0, y: 0, z: 0 },
            size: { width: 200, height: 200 },
            type: 'town',
            description: 'A bustling medieval town with merchants, blacksmiths, and quest-giving NPCs',
            features: [
                'marketplace',
                'blacksmith',
                'inn',
                'town_hall',
                'training_grounds'
            ],
            ambientLight: { r: 0.7, g: 0.7, b: 0.7 }
        },
        FOREST: {
            name: 'Mystic Woods',
            position: { x: 250, y: 0, z: 0 },
            size: { width: 300, height: 300 },
            type: 'forest',
            description: 'Dense forest with magical creatures and hidden treasures',
            features: [
                'ancient_trees',
                'magical_grove',
                'hidden_paths',
                'creature_nests',
                'sacred_shrine'
            ],
            ambientLight: { r: 0.5, g: 0.6, b: 0.4 }
        },
        CAVES: {
            name: 'Crystal Caverns',
            position: { x: 0, y: 0, z: 250 },
            size: { width: 250, height: 250 },
            type: 'cave',
            description: 'Underground network of caves with glowing crystals and ancient secrets',
            features: [
                'crystal_chambers',
                'underground_river',
                'monster_lairs',
                'treasure_rooms',
                'ancient_ruins'
            ],
            ambientLight: { r: 0.3, g: 0.3, b: 0.5 }
        },
        SPECIAL: {
            name: 'Dragon\'s Peak',
            position: { x: 250, y: 50, z: 250 },
            size: { width: 200, height: 200 },
            type: 'mountain',
            description: 'A mystical mountain peak where ancient dragons reside',
            features: [
                'dragon_nest',
                'ancient_temple',
                'sky_bridges',
                'magical_portals',
                'treasure_vault'
            ],
            ambientLight: { r: 0.6, g: 0.6, b: 0.8 }
        }
    },

    // Environment settings
    ENVIRONMENT: {
        skybox: true,
        fog: {
            enabled: true,
            density: 0.1,
            color: { r: 0.5, g: 0.5, b: 0.5 }
        },
        lighting: {
            shadows: true,
            timeOfDay: true
        }
    }
};
