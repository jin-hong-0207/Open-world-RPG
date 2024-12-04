// World Map Design Configuration
const WORLD_DESIGN = {
    // Visual Theme Configuration
    visualTheme: {
        colorPalette: {
            forest: {
                primary: '#2D5A27',
                accent: '#8FD694',
                glow: '#A8E6AD',
                water: '#4FA4B8'
            },
            mountains: {
                primary: '#6B6B6B',
                accent: '#8C8C8C',
                snow: '#FFFFFF',
                rock: '#4A4A4A'
            },
            magical: {
                primary: '#7B35BD',
                accent: '#B39DDB',
                glow: '#E1BEE7',
                crystal: '#CE93D8'
            },
            village: {
                primary: '#8D6E63',
                accent: '#BCAAA4',
                roof: '#5D4037',
                path: '#D7CCC8'
            }
        },
        lighting: {
            ambient: { intensity: 0.7, color: '#FFFFFF' },
            directional: { intensity: 1.0, color: '#FFF5E6' },
            shadows: true,
            timeOfDay: {
                dawn: { color: '#FFB74D', intensity: 0.8 },
                day: { color: '#FFFFFF', intensity: 1.0 },
                dusk: { color: '#FF9800', intensity: 0.8 },
                night: { color: '#3F51B5', intensity: 0.5 }
            }
        }
    },

    // Map Regions
    regions: {
        enchantedForest: {
            name: "Whispering Woods",
            type: "forest",
            size: { width: 1000, height: 1000 },
            features: {
                trees: {
                    density: 0.7,
                    types: [
                        { id: "glowing_oak", probability: 0.3, scale: { min: 1.0, max: 1.5 } },
                        { id: "crystal_pine", probability: 0.2, scale: { min: 0.8, max: 1.2 } },
                        { id: "ancient_willow", probability: 0.5, scale: { min: 1.2, max: 2.0 } }
                    ],
                    effects: {
                        glow: { color: "#7CB342", intensity: 0.5, radius: 5 },
                        particles: { type: "firefly", density: 0.3 }
                    }
                },
                water: {
                    streams: [
                        {
                            path: [
                                { x: 0, y: 200 },
                                { x: 300, y: 250 },
                                { x: 600, y: 400 }
                            ],
                            width: 10,
                            flow: 0.5,
                            effects: { ripple: true, reflection: true }
                        }
                    ],
                    pools: [
                        {
                            position: { x: 300, y: 300 },
                            radius: 30,
                            effects: { glow: true, heal: true }
                        }
                    ]
                }
            }
        },

        crystalCaves: {
            name: "Crystal Caverns",
            type: "cave",
            size: { width: 800, height: 600 },
            features: {
                crystals: {
                    clusters: [
                        {
                            position: { x: 200, y: 300 },
                            size: 15,
                            color: "#E91E63",
                            glow: { intensity: 0.8, radius: 10 }
                        },
                        {
                            position: { x: 500, y: 400 },
                            size: 20,
                            color: "#2196F3",
                            glow: { intensity: 0.8, radius: 12 }
                        }
                    ],
                    effects: {
                        pulse: { frequency: 2, intensity: { min: 0.7, max: 1.0 } },
                        particles: { type: "sparkle", density: 0.2 }
                    }
                },
                terrain: {
                    stalactites: { density: 0.3, size: { min: 2, max: 5 } },
                    stalagmites: { density: 0.3, size: { min: 2, max: 5 } }
                }
            }
        },

        riverlands: {
            name: "Crystal River Valley",
            type: "river",
            size: { width: 1200, height: 400 },
            features: {
                river: {
                    path: [
                        { x: 0, y: 200 },
                        { x: 400, y: 180 },
                        { x: 800, y: 220 },
                        { x: 1200, y: 200 }
                    ],
                    width: { min: 40, max: 60 },
                    flow: 0.3,
                    effects: {
                        ripple: true,
                        reflection: true,
                        fish: { density: 0.2, types: ["salmon", "trout"] }
                    }
                },
                bridges: [
                    {
                        position: { x: 400, y: 180 },
                        type: "stone",
                        size: { width: 80, height: 20 }
                    },
                    {
                        position: { x: 800, y: 220 },
                        type: "wooden",
                        size: { width: 60, height: 15 }
                    }
                ]
            }
        }
    },

    // Interactive Objects
    interactiveObjects: {
        treasureChests: {
            types: [
                {
                    id: "common_chest",
                    model: "wooden_chest",
                    lootTable: "common_loot",
                    respawnTime: 3600,
                    effects: { glow: { color: "#FFF176", intensity: 0.3 } }
                },
                {
                    id: "rare_chest",
                    model: "golden_chest",
                    lootTable: "rare_loot",
                    respawnTime: 7200,
                    effects: { glow: { color: "#FFD700", intensity: 0.5 } }
                }
            ],
            placement: [
                { type: "common_chest", position: { x: 250, y: 300 } },
                { type: "rare_chest", position: { x: 800, y: 450 } }
            ]
        },
        
        healingFountains: {
            types: [
                {
                    id: "minor_fountain",
                    heal: { amount: 20, interval: 1 },
                    radius: 5,
                    effects: {
                        particles: { type: "heal", color: "#81C784" },
                        glow: { color: "#81C784", intensity: 0.4 }
                    }
                },
                {
                    id: "major_fountain",
                    heal: { amount: 50, interval: 1 },
                    radius: 8,
                    effects: {
                        particles: { type: "heal", color: "#4CAF50" },
                        glow: { color: "#4CAF50", intensity: 0.6 }
                    }
                }
            ],
            placement: [
                { type: "minor_fountain", position: { x: 300, y: 200 } },
                { type: "major_fountain", position: { x: 700, y: 600 } }
            ]
        },

        magicPortals: {
            types: [
                {
                    id: "town_portal",
                    destination: "town_square",
                    cooldown: 300,
                    effects: {
                        particles: { type: "portal", color: "#3F51B5" },
                        sound: "portal_hum",
                        glow: { color: "#3F51B5", intensity: 0.7 }
                    }
                },
                {
                    id: "dungeon_portal",
                    destination: "crystal_caves",
                    cooldown: 600,
                    effects: {
                        particles: { type: "portal", color: "#9C27B0" },
                        sound: "portal_hum",
                        glow: { color: "#9C27B0", intensity: 0.7 }
                    }
                }
            ],
            placement: [
                { type: "town_portal", position: { x: 400, y: 300 } },
                { type: "dungeon_portal", position: { x: 900, y: 500 } }
            ]
        }
    },

    // Points of Interest
    pointsOfInterest: {
        townSquare: {
            name: "Riverside Town",
            type: "settlement",
            position: { x: 500, y: 300 },
            size: { width: 200, height: 200 },
            buildings: [
                {
                    type: "blacksmith",
                    position: { x: 520, y: 320 },
                    npc: { id: "master_smith", schedule: "workday" }
                },
                {
                    type: "inn",
                    position: { x: 480, y: 280 },
                    npc: { id: "innkeeper", schedule: "fullday" }
                },
                {
                    type: "market",
                    position: { x: 500, y: 300 },
                    npcs: [
                        { id: "merchant_1", schedule: "workday" },
                        { id: "merchant_2", schedule: "workday" }
                    ]
                }
            ],
            effects: {
                ambient: { sound: "town_ambience", volume: 0.3 },
                particles: { type: "smoke", sources: ["blacksmith", "inn"] }
            }
        },

        trainingGrounds: {
            name: "Warrior's Circle",
            type: "training",
            position: { x: 600, y: 400 },
            size: { width: 100, height: 100 },
            features: [
                {
                    type: "training_dummy",
                    position: { x: 620, y: 420 },
                    interaction: { type: "combat", difficulty: "easy" }
                },
                {
                    type: "archery_target",
                    position: { x: 580, y: 380 },
                    interaction: { type: "ranged", difficulty: "medium" }
                }
            ],
            npcs: [
                { id: "combat_trainer", schedule: "workday", path: "patrol" }
            ]
        },

        mysticalTower: {
            name: "Wizard's Tower",
            type: "landmark",
            position: { x: 800, y: 200 },
            size: { width: 50, height: 150 },
            features: {
                architecture: {
                    style: "magical",
                    height: 150,
                    effects: {
                        glow: { color: "#7B1FA2", intensity: 0.6 },
                        particles: { type: "magic", density: 0.2 }
                    }
                },
                interactables: [
                    {
                        type: "magic_book",
                        position: { x: 810, y: 210 },
                        interaction: { type: "learn_spell", spell: "fireball" }
                    }
                ]
            },
            npcs: [
                { id: "archmage", schedule: "fullday", location: "tower_top" }
            ]
        }
    }
};

// Environment Effects Configuration
const ENVIRONMENT_EFFECTS = {
    weather: {
        types: {
            clear: {
                probability: 0.5,
                effects: {
                    lighting: { intensity: 1.0 },
                    particles: null
                }
            },
            rain: {
                probability: 0.2,
                effects: {
                    lighting: { intensity: 0.7 },
                    particles: {
                        type: "rain",
                        density: 0.5,
                        sound: "rain_ambient"
                    }
                }
            },
            storm: {
                probability: 0.1,
                effects: {
                    lighting: { intensity: 0.4 },
                    particles: {
                        type: "rain",
                        density: 0.8,
                        sound: "storm_ambient"
                    },
                    lightning: {
                        frequency: 0.2,
                        intensity: 1.0
                    }
                }
            }
        }
    },
    
    timeOfDay: {
        cycle: {
            duration: 24, // minutes
            phases: {
                dawn: {
                    start: 0.25,
                    duration: 0.1,
                    effects: {
                        fog: { density: 0.3, color: "#FFB74D" },
                        lighting: { intensity: 0.7, color: "#FFB74D" }
                    }
                },
                day: {
                    start: 0.35,
                    duration: 0.3,
                    effects: {
                        lighting: { intensity: 1.0, color: "#FFFFFF" }
                    }
                },
                dusk: {
                    start: 0.65,
                    duration: 0.1,
                    effects: {
                        fog: { density: 0.2, color: "#FF9800" },
                        lighting: { intensity: 0.7, color: "#FF9800" }
                    }
                },
                night: {
                    start: 0.75,
                    duration: 0.25,
                    effects: {
                        lighting: { intensity: 0.3, color: "#3F51B5" },
                        stars: { density: 0.8, twinkle: true }
                    }
                }
            }
        }
    }
};

export { WORLD_DESIGN, ENVIRONMENT_EFFECTS };
