const WORLD_MAP = {
    name: "Mystical Realm",
    regions: {
        castleDistrict: {
            id: "castle_district",
            name: "Royal Castle District",
            landmarks: {
                mainCastle: {
                    id: "main_castle",
                    name: "Grand Spire Castle",
                    type: "castle",
                    position: { x: 500, y: 0, z: 500 },
                    features: {
                        questGiver: true,
                        shopkeeper: true,
                        skillTrainer: true
                    },
                    description: "A majestic castle with soaring blue spires, serving as the seat of power"
                }
            },
            level: { min: 1, max: 10 },
            climate: "temperate",
            dangers: "low"
        },

        magicSprings: {
            id: "magic_springs",
            name: "Mystic Springs",
            landmarks: {
                bluePortal: {
                    id: "blue_portal",
                    name: "Arcane Portal",
                    type: "magical",
                    position: { x: 200, y: 0, z: 200 },
                    features: {
                        teleport: true,
                        magicShop: true
                    },
                    description: "A swirling blue portal emanating pure magical energy"
                },
                magicFountain: {
                    id: "magic_fountain",
                    name: "Fountain of Wisdom",
                    type: "magical",
                    position: { x: 300, y: 0, z: 100 },
                    features: {
                        buffStation: true,
                        manaRegeneration: true
                    },
                    description: "A mystical fountain that restores mana and grants temporary buffs"
                }
            },
            level: { min: 5, max: 15 },
            climate: "magical",
            dangers: "medium"
        },

        villageHamlet: {
            id: "village_hamlet",
            name: "Riverside Village",
            landmarks: {
                inn: {
                    id: "cozy_inn",
                    name: "Riverside Inn",
                    type: "building",
                    position: { x: 400, y: 0, z: 300 },
                    features: {
                        rest: true,
                        questGiver: true,
                        shopkeeper: true
                    },
                    description: "A warm and welcoming inn where adventurers gather"
                },
                blacksmith: {
                    id: "master_smithy",
                    name: "Master Blacksmith",
                    type: "building",
                    position: { x: 420, y: 0, z: 320 },
                    features: {
                        crafting: true,
                        repair: true,
                        shop: true
                    },
                    description: "A well-equipped forge for crafting and repairing equipment"
                }
            },
            level: { min: 1, max: 5 },
            climate: "temperate",
            dangers: "low"
        },

        dragonCave: {
            id: "dragon_cave",
            name: "Dragon's Lair",
            landmarks: {
                caveEntrance: {
                    id: "dragon_entrance",
                    name: "Burning Cave",
                    type: "dungeon",
                    position: { x: 800, y: 0, z: 800 },
                    features: {
                        boss: true,
                        treasure: true,
                        questLocation: true
                    },
                    description: "A scorching cave where a mighty dragon resides"
                }
            },
            level: { min: 30, max: 40 },
            climate: "volcanic",
            dangers: "extreme"
        },

        frozenPeaks: {
            id: "frozen_peaks",
            name: "Frozen Peaks",
            landmarks: {
                iceCastle: {
                    id: "ice_castle",
                    name: "Frost Castle",
                    type: "dungeon",
                    position: { x: 900, y: 100, z: 100 },
                    features: {
                        boss: true,
                        treasure: true,
                        questLocation: true
                    },
                    description: "An ancient castle frozen in eternal ice"
                }
            },
            level: { min: 20, max: 30 },
            climate: "frozen",
            dangers: "high"
        },

        enchantedForest: {
            id: "enchanted_forest",
            name: "Whispering Woods",
            landmarks: {
                ancientTree: {
                    id: "world_tree",
                    name: "World Tree Shrine",
                    type: "magical",
                    position: { x: 600, y: 0, z: 400 },
                    features: {
                        questGiver: true,
                        skillTrainer: true,
                        teleport: true
                    },
                    description: "A massive ancient tree radiating magical energy"
                }
            },
            level: { min: 10, max: 20 },
            climate: "magical",
            dangers: "medium"
        }
    },

    waterBodies: {
        mainRiver: {
            id: "crystal_river",
            name: "Crystal River",
            type: "river",
            features: {
                fishing: true,
                boats: true,
                bridges: [
                    { id: "stone_bridge", position: { x: 450, y: 0, z: 450 } },
                    { id: "wooden_bridge", position: { x: 650, y: 0, z: 350 } }
                ]
            },
            description: "A clear blue river winding through the realm"
        }
    },

    fast_travel: {
        portals: [
            {
                id: "castle_portal",
                name: "Castle Portal",
                position: { x: 500, y: 0, z: 500 },
                destinations: ["magic_springs", "village_hamlet", "enchanted_forest"]
            },
            {
                id: "forest_portal",
                name: "Forest Portal",
                position: { x: 600, y: 0, z: 400 },
                destinations: ["castle_district", "magic_springs", "village_hamlet"]
            }
        ]
    },

    resources: {
        herbs: [
            { id: "healing_herb", regions: ["enchanted_forest", "village_hamlet"] },
            { id: "mana_flower", regions: ["magic_springs", "enchanted_forest"] },
            { id: "frost_leaf", regions: ["frozen_peaks"] }
        ],
        minerals: [
            { id: "iron_ore", regions: ["castle_district", "village_hamlet"] },
            { id: "magic_crystal", regions: ["magic_springs", "frozen_peaks"] },
            { id: "dragon_scale", regions: ["dragon_cave"] }
        ],
        fishing_spots: [
            { id: "river_fish", regions: ["village_hamlet", "castle_district"] },
            { id: "magic_fish", regions: ["magic_springs"] }
        ]
    }
};

const WORLD_EVENTS = {
    dayNight: {
        cycle: true,
        duration: {
            day: 20, // minutes
            night: 10 // minutes
        },
        effects: {
            night: {
                spawnRate: 1.5,
                difficulty: 1.2,
                visibility: 0.7
            }
        }
    },
    weather: {
        types: [
            {
                id: "clear",
                probability: 0.4,
                duration: { min: 10, max: 30 } // minutes
            },
            {
                id: "rain",
                probability: 0.3,
                duration: { min: 5, max: 15 },
                effects: {
                    visibility: 0.8,
                    movement: 0.9
                }
            },
            {
                id: "storm",
                probability: 0.1,
                duration: { min: 5, max: 10 },
                effects: {
                    visibility: 0.6,
                    movement: 0.7,
                    combat: 0.8
                }
            },
            {
                id: "snow",
                regions: ["frozen_peaks"],
                probability: 0.8,
                effects: {
                    movement: 0.8,
                    visibility: 0.7
                }
            }
        ]
    }
};

module.exports = {
    WORLD_MAP,
    WORLD_EVENTS
};
