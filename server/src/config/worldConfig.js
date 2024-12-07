const worldConfig = {
    // World dimensions and settings
    worldSettings: {
        size: { width: 2000, height: 2000 }, // World size in units
        timeScale: 1, // 1 real second = 1 game minute
        dayNightCycle: 24 * 60, // 24 game hours in minutes
        weatherChangeDuration: 10, // Weather transition time in minutes
        maxPlayers: 50
    },

    // Biomes/Regions configuration
    biomes: {
        mysticalForest: {
            name: "Mystical Forest",
            type: "forest",
            bounds: { x1: 0, y1: 0, x2: 500, y2: 500 },
            features: {
                trees: { density: 0.7, types: ["ancient_oak", "glowing_willow"] },
                waterBodies: { density: 0.3, types: ["pond", "stream"] },
                vegetation: { density: 0.8, types: ["glowing_mushrooms", "magical_flowers"] }
            },
            ambientEffects: {
                particles: "forest_fireflies",
                sounds: ["forest_ambience", "magical_whispers"],
                lighting: "forest_glow"
            },
            weatherEffects: {
                rain: {
                    particleSystem: "rain_particles",
                    soundEffect: "rain_on_leaves",
                    lightingChange: "darker"
                },
                fog: {
                    particleSystem: "fog_particles",
                    visibilityRange: 50,
                    lightingChange: "diffused"
                }
            }
        },

        ancientTown: {
            name: "Ancient Town",
            type: "town",
            bounds: { x1: 500, y1: 0, x2: 1000, y2: 500 },
            features: {
                buildings: { density: 0.5, types: ["shop", "house", "inn"] },
                npcs: { density: 0.3, types: ["merchant", "questgiver", "townsperson"] },
                decorations: { density: 0.4, types: ["fountain", "statue", "streetlight"] }
            },
            ambientEffects: {
                particles: "town_dust",
                sounds: ["town_chatter", "distant_bells"],
                lighting: "warm_town"
            },
            weatherEffects: {
                rain: {
                    particleSystem: "rain_on_cobblestone",
                    soundEffect: "rain_on_roofs",
                    lightingChange: "darker"
                }
            }
        },

        crystalCaves: {
            name: "Crystal Caves",
            type: "cave",
            bounds: { x1: 0, y1: 500, x2: 500, y2: 1000 },
            features: {
                crystals: { density: 0.6, types: ["blue_crystal", "purple_crystal"] },
                stalactites: { density: 0.4, types: ["pointed", "hanging"] },
                waterPools: { density: 0.2, types: ["crystal_pool", "underground_spring"] }
            },
            ambientEffects: {
                particles: "crystal_sparkles",
                sounds: ["cave_drips", "crystal_hum"],
                lighting: "crystal_glow"
            },
            requirements: {
                lightSource: true,
                minimumLevel: 5
            }
        }
    },

    // Interactive objects configuration
    interactiveObjects: {
        movableRock: {
            model: "rock_01",
            physics: {
                mass: 100,
                friction: 0.8,
                restitution: 0.2
            },
            interactions: {
                movable: true,
                breakable: false,
                requiredStrength: 2
            },
            effects: {
                moveSound: "rock_scrape",
                particles: "dust_trail"
            }
        },
        magicCrystal: {
            model: "crystal_01",
            physics: {
                mass: 0,
                isStatic: true
            },
            interactions: {
                activatable: true,
                glows: true,
                connectsTo: ["magicCrystal"]
            },
            effects: {
                activeParticles: "crystal_energy",
                activateSound: "crystal_hum",
                connectBeam: "energy_beam"
            }
        },
        secretDoor: {
            model: "door_01",
            physics: {
                mass: 0,
                isStatic: true
            },
            interactions: {
                openable: true,
                requiresTrigger: true
            },
            effects: {
                openSound: "stone_door",
                particles: "dust_puff",
                revealEffect: "magical_reveal"
            }
        }
    },

    // Collectibles configuration
    collectibles: {
        scrolls: {
            types: {
                lore: { rarity: 0.7, value: 10 },
                spell: { rarity: 0.3, value: 50 }
            },
            effects: {
                pickup: "scroll_pickup",
                glow: "scroll_glow"
            }
        },
        artifacts: {
            types: {
                common: { rarity: 0.6, value: 20 },
                rare: { rarity: 0.3, value: 100 },
                legendary: { rarity: 0.1, value: 500 }
            },
            effects: {
                pickup: "artifact_pickup",
                glow: "artifact_glow"
            }
        }
    },

    // Weather system configuration
    weather: {
        types: {
            clear: {
                probability: 0.4,
                duration: { min: 20, max: 60 }, // in minutes
                effects: {
                    lighting: "bright",
                    ambientSound: "light_breeze"
                }
            },
            rain: {
                probability: 0.3,
                duration: { min: 15, max: 45 },
                effects: {
                    particles: "rain",
                    lighting: "darker",
                    ambientSound: "rain"
                }
            },
            fog: {
                probability: 0.2,
                duration: { min: 10, max: 30 },
                effects: {
                    particles: "fog",
                    lighting: "diffused",
                    ambientSound: "quiet"
                }
            },
            storm: {
                probability: 0.1,
                duration: { min: 5, max: 15 },
                effects: {
                    particles: ["rain_heavy", "lightning"],
                    lighting: "dark",
                    ambientSound: "thunder"
                }
            }
        },
        transitionDuration: 5 // minutes
    }
};

module.exports = worldConfig;
