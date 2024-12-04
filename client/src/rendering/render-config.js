// Rendering Configuration for Game World
const RENDER_CONFIG = {
    engine: {
        type: "WebGL",
        antialias: true,
        resolution: 1,
        backgroundColor: 0x1099bb,
        roundPixels: true
    },

    style: {
        // Art style configuration
        general: {
            outlineWidth: 2,
            outlineColor: 0x000000,
            shadowQuality: "high",
            shadowDistance: 100
        },

        // Similar to League of Legends style
        terrain: {
            textureFiltering: "linear",
            normalMapping: true,
            tessellation: {
                enabled: true,
                detail: 16
            },
            materials: {
                grass: {
                    baseColor: "#4CAF50",
                    roughness: 0.8,
                    normalStrength: 0.5,
                    windEffect: {
                        strength: 0.2,
                        frequency: 0.5
                    }
                },
                water: {
                    baseColor: "#2196F3",
                    transparency: 0.8,
                    reflectivity: 0.5,
                    wavesEnabled: true,
                    caustics: true
                },
                stone: {
                    baseColor: "#757575",
                    roughness: 0.9,
                    normalStrength: 0.7
                }
            }
        },

        // Character rendering similar to Starcraft style
        characters: {
            outlineEnabled: true,
            outlineWidth: 2,
            cellShading: {
                enabled: true,
                levels: 3
            },
            animation: {
                interpolation: "smooth",
                frameSkipping: false
            }
        },

        // Effects and particles
        effects: {
            particles: {
                maxParticles: 10000,
                blendMode: "add",
                softParticles: true
            },
            postProcessing: {
                bloom: {
                    enabled: true,
                    strength: 0.5,
                    radius: 0.4,
                    threshold: 0.8
                },
                ambientOcclusion: {
                    enabled: true,
                    radius: 0.5,
                    intensity: 0.5
                },
                colorGrading: {
                    enabled: true,
                    saturation: 1.2,
                    contrast: 1.1,
                    brightness: 1.0
                }
            }
        }
    },

    // Performance optimization
    optimization: {
        culling: {
            enabled: true,
            maxObjects: 1000,
            threshold: 0.7
        },
        lod: {
            enabled: true,
            levels: [
                { distance: 50, detail: 1.0 },
                { distance: 100, detail: 0.7 },
                { distance: 200, detail: 0.4 }
            ]
        },
        instancing: {
            enabled: true,
            batchSize: 100
        },
        textures: {
            maxSize: 2048,
            compression: "high",
            mipmaps: true
        }
    },

    // Camera configuration
    camera: {
        type: "perspective",
        fov: 60,
        near: 0.1,
        far: 1000,
        controls: {
            zoom: {
                min: 5,
                max: 15,
                speed: 0.1
            },
            rotation: {
                enabled: true,
                speed: 0.5,
                smoothing: 0.1
            },
            pan: {
                enabled: true,
                speed: 0.8,
                boundaries: {
                    enabled: true,
                    padding: 50
                }
            }
        }
    },

    // Lighting configuration
    lighting: {
        ambient: {
            intensity: 0.3,
            color: "#FFFFFF"
        },
        directional: {
            intensity: 0.7,
            color: "#FFF5E6",
            shadows: {
                enabled: true,
                type: "PCF",
                resolution: 2048,
                bias: 0.0001
            }
        },
        point: {
            maxLights: 50,
            shadowsEnabled: true
        }
    }
};

// Visual Effects Presets
const VISUAL_EFFECTS = {
    magic: {
        glow: {
            color: "#7B1FA2",
            intensity: 0.8,
            radius: 10
        },
        particles: {
            type: "sparkle",
            color: "#E1BEE7",
            size: { min: 0.1, max: 0.3 },
            lifetime: { min: 0.5, max: 1.5 },
            emission: { rate: 20, burst: 50 }
        }
    },
    
    nature: {
        leaves: {
            color: "#81C784",
            size: { min: 0.2, max: 0.4 },
            lifetime: { min: 2, max: 4 },
            emission: { rate: 5, burst: 20 }
        },
        fireflies: {
            color: "#FFF176",
            size: { min: 0.1, max: 0.2 },
            lifetime: { min: 4, max: 8 },
            emission: { rate: 2, burst: 10 }
        }
    },
    
    combat: {
        hit: {
            particles: {
                type: "spark",
                color: "#FF5722",
                size: { min: 0.2, max: 0.4 },
                lifetime: { min: 0.2, max: 0.4 },
                emission: { rate: 0, burst: 30 }
            },
            flash: {
                color: "#FFFFFF",
                duration: 0.1
            }
        },
        critical: {
            particles: {
                type: "explosion",
                color: "#FF9800",
                size: { min: 0.3, max: 0.6 },
                lifetime: { min: 0.3, max: 0.6 },
                emission: { rate: 0, burst: 50 }
            },
            flash: {
                color: "#FFFFFF",
                duration: 0.2
            }
        }
    }
};

export { RENDER_CONFIG, VISUAL_EFFECTS };
