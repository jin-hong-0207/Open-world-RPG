// Asset Configuration System
const ASSET_CONFIG = {
    // Character Models and Animations
    characters: {
        // Base Character Assets
        baseModels: {
            humanoid: {
                model: "models/characters/base_humanoid.glb",
                scale: { x: 1, y: 1, z: 1 },
                skeleton: "humanoid_rig",
                hitbox: { width: 1, height: 2, depth: 1 },
                attachPoints: {
                    rightHand: { x: 0.5, y: 1.2, z: 0 },
                    leftHand: { x: -0.5, y: 1.2, z: 0 },
                    back: { x: 0, y: 1.3, z: -0.3 },
                    head: { x: 0, y: 1.7, z: 0 }
                }
            }
        },

        // Character Animations
        animations: {
            // Movement Animations
            movement: {
                idle: {
                    file: "animations/characters/idle.glb",
                    duration: 2.0,
                    loop: true,
                    blendTime: 0.2
                },
                walk: {
                    file: "animations/characters/walk.glb",
                    duration: 1.2,
                    loop: true,
                    blendTime: 0.2
                },
                run: {
                    file: "animations/characters/run.glb",
                    duration: 0.8,
                    loop: true,
                    blendTime: 0.2
                },
                jump: {
                    file: "animations/characters/jump.glb",
                    duration: 0.8,
                    loop: false,
                    blendTime: 0.1
                }
            },

            // Skill Animations
            skills: {
                // Sword Animations
                sword: {
                    slash: {
                        file: "animations/skills/sword_slash.glb",
                        duration: 0.5,
                        loop: false,
                        blendTime: 0.1
                    },
                    whirlwind: {
                        file: "animations/skills/sword_whirlwind.glb",
                        duration: 1.2,
                        loop: true,
                        blendTime: 0.1
                    }
                },
                // Bow Animations
                bow: {
                    draw: {
                        file: "animations/skills/bow_draw.glb",
                        duration: 0.8,
                        loop: false,
                        blendTime: 0.1
                    },
                    shoot: {
                        file: "animations/skills/bow_release.glb",
                        duration: 0.4,
                        loop: false,
                        blendTime: 0.1
                    }
                },
                // Wand Animations
                wand: {
                    cast: {
                        file: "animations/skills/wand_cast.glb",
                        duration: 0.6,
                        loop: false,
                        blendTime: 0.1
                    },
                    channel: {
                        file: "animations/skills/wand_channel.glb",
                        duration: 2.0,
                        loop: true,
                        blendTime: 0.2
                    }
                }
            },

            // Emote Animations
            emotes: {
                wave: {
                    file: "animations/emotes/wave.glb",
                    duration: 1.5,
                    loop: false,
                    blendTime: 0.2
                },
                dance: {
                    file: "animations/emotes/dance.glb",
                    duration: 4.0,
                    loop: true,
                    blendTime: 0.2
                },
                sit: {
                    file: "animations/emotes/sit.glb",
                    duration: 1.0,
                    loop: true,
                    blendTime: 0.3
                }
            }
        }
    },

    // World Objects and Environment
    worldObjects: {
        // Nature Objects
        nature: {
            trees: {
                crystal_tree: {
                    model: "models/environment/crystal_tree.glb",
                    scale: { x: 2, y: 3, z: 2 },
                    collision: "cylinder",
                    effects: {
                        glow: {
                            color: "#81C784",
                            intensity: 0.5,
                            pulse: { min: 0.4, max: 0.6, speed: 1 }
                        },
                        particles: {
                            type: "sparkle",
                            color: "#A5D6A7",
                            count: 5,
                            size: { min: 0.1, max: 0.2 }
                        }
                    }
                },
                magic_willow: {
                    model: "models/environment/magic_willow.glb",
                    scale: { x: 3, y: 4, z: 3 },
                    collision: "cylinder",
                    effects: {
                        glow: {
                            color: "#9575CD",
                            intensity: 0.4,
                            pulse: { min: 0.3, max: 0.5, speed: 0.8 }
                        },
                        particles: {
                            type: "firefly",
                            color: "#B39DDB",
                            count: 8,
                            size: { min: 0.05, max: 0.15 }
                        }
                    }
                }
            },

            crystals: {
                mana_crystal: {
                    model: "models/environment/mana_crystal.glb",
                    scale: { x: 1, y: 2, z: 1 },
                    collision: "box",
                    effects: {
                        glow: {
                            color: "#5C6BC0",
                            intensity: 0.7,
                            pulse: { min: 0.6, max: 0.8, speed: 1.2 }
                        },
                        particles: {
                            type: "energy",
                            color: "#7986CB",
                            count: 10,
                            size: { min: 0.1, max: 0.3 }
                        }
                    }
                }
            }
        },

        // Interactive Objects
        interactive: {
            portals: {
                magic_portal: {
                    model: "models/interactive/magic_portal.glb",
                    scale: { x: 2, y: 3, z: 1 },
                    collision: "box",
                    effects: {
                        glow: {
                            color: "#7B1FA2",
                            intensity: 0.8,
                            pulse: { min: 0.7, max: 0.9, speed: 1.5 }
                        },
                        particles: {
                            type: "portal",
                            color: "#9C27B0",
                            count: 50,
                            size: { min: 0.2, max: 0.4 }
                        },
                        sound: {
                            idle: "sounds/portal_hum.ogg",
                            activate: "sounds/portal_activate.ogg"
                        }
                    }
                }
            },

            chests: {
                treasure_chest: {
                    model: "models/interactive/treasure_chest.glb",
                    scale: { x: 1, y: 1, z: 1 },
                    collision: "box",
                    animations: {
                        idle: "animations/chest_idle.glb",
                        open: "animations/chest_open.glb"
                    },
                    effects: {
                        glow: {
                            color: "#FFD700",
                            intensity: 0.4,
                            pulse: { min: 0.3, max: 0.5, speed: 1 }
                        },
                        particles: {
                            type: "sparkle",
                            color: "#FFF176",
                            count: 20,
                            size: { min: 0.1, max: 0.2 }
                        },
                        sound: {
                            open: "sounds/chest_open.ogg",
                            close: "sounds/chest_close.ogg"
                        }
                    }
                }
            }
        },

        // Buildings
        buildings: {
            magical_house: {
                model: "models/buildings/magical_house.glb",
                scale: { x: 4, y: 4, z: 4 },
                collision: "complex",
                effects: {
                    windows: {
                        glow: {
                            color: "#FFB74D",
                            intensity: 0.6,
                            timeOfDay: true
                        }
                    },
                    chimney: {
                        particles: {
                            type: "smoke",
                            color: "#BDBDBD",
                            count: 10,
                            size: { min: 0.3, max: 0.6 }
                        }
                    }
                }
            }
        }
    },

    // Friendly Creatures
    creatures: {
        // Small Creatures
        small: {
            crystal_slime: {
                model: "models/creatures/crystal_slime.glb",
                scale: { x: 0.8, y: 0.8, z: 0.8 },
                hitbox: { width: 0.8, height: 0.8, depth: 0.8 },
                animations: {
                    idle: "animations/slime_idle.glb",
                    move: "animations/slime_bounce.glb",
                    happy: "animations/slime_happy.glb"
                },
                effects: {
                    body: {
                        transparency: 0.7,
                        glow: {
                            color: "#4FC3F7",
                            intensity: 0.4
                        }
                    },
                    particles: {
                        type: "drip",
                        color: "#81D4FA",
                        count: 3,
                        size: { min: 0.05, max: 0.1 }
                    }
                },
                sound: {
                    idle: "sounds/slime_idle.ogg",
                    move: "sounds/slime_bounce.ogg",
                    happy: "sounds/slime_happy.ogg"
                }
            }
        },

        // Medium Creatures
        medium: {
            light_golem: {
                model: "models/creatures/light_golem.glb",
                scale: { x: 1.5, y: 1.5, z: 1.5 },
                hitbox: { width: 1.5, height: 2, depth: 1.5 },
                animations: {
                    idle: "animations/golem_idle.glb",
                    walk: "animations/golem_walk.glb",
                    puzzle: "animations/golem_puzzle.glb"
                },
                effects: {
                    core: {
                        glow: {
                            color: "#FFE082",
                            intensity: 0.6,
                            pulse: { min: 0.5, max: 0.7, speed: 0.8 }
                        }
                    },
                    runes: {
                        emissive: {
                            color: "#FFF176",
                            intensity: 0.4
                        }
                    }
                },
                sound: {
                    idle: "sounds/golem_idle.ogg",
                    walk: "sounds/golem_walk.ogg",
                    puzzle: "sounds/golem_puzzle.ogg"
                }
            }
        },

        // Boss Creatures
        boss: {
            wisdom_dragon: {
                model: "models/creatures/wisdom_dragon.glb",
                scale: { x: 4, y: 4, z: 4 },
                hitbox: { width: 4, height: 3, depth: 6 },
                animations: {
                    idle: "animations/dragon_idle.glb",
                    fly: "animations/dragon_fly.glb",
                    puzzle: "animations/dragon_puzzle.glb",
                    success: "animations/dragon_happy.glb"
                },
                effects: {
                    body: {
                        glow: {
                            color: "#81C784",
                            intensity: 0.5,
                            areas: ["wings", "crest"]
                        }
                    },
                    particles: {
                        type: "wisdom",
                        color: "#A5D6A7",
                        count: 20,
                        size: { min: 0.2, max: 0.4 }
                    },
                    aura: {
                        color: "#C8E6C9",
                        radius: 8,
                        intensity: 0.3
                    }
                },
                sound: {
                    idle: "sounds/dragon_idle.ogg",
                    fly: "sounds/dragon_fly.ogg",
                    puzzle: "sounds/dragon_puzzle.ogg",
                    success: "sounds/dragon_happy.ogg"
                }
            }
        }
    }
};

export default ASSET_CONFIG;
