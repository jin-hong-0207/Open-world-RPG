const visualConfigs = {
    characters: {
        healer: {
            model: 'healer_character',
            animations: {
                idle: 'healer_idle',
                walk: 'healer_walk',
                skills: {
                    'Healing Touch': 'healer_cast_single',
                    'Healing Aura': 'healer_cast_aoe'
                },
                emotes: {
                    celebrate: 'healer_celebrate',
                    wave: 'healer_wave'
                }
            },
            defaultScale: { x: 1, y: 1, z: 1 },
            skillEffects: {
                'Healing Touch': {
                    particleEffect: 'healing_particles',
                    lightEffect: 'healing_glow',
                    soundEffect: 'healing_sound'
                },
                'Healing Aura': {
                    particleEffect: 'aura_particles',
                    lightEffect: 'aura_glow',
                    soundEffect: 'aura_sound'
                }
            }
        },
        support: {
            model: 'support_character',
            animations: {
                idle: 'support_idle',
                walk: 'support_walk',
                skills: {
                    'Strength Boost': 'support_cast_boost',
                    'Swift Wind': 'support_cast_speed'
                },
                emotes: {
                    celebrate: 'support_celebrate',
                    wave: 'support_wave'
                }
            },
            defaultScale: { x: 1, y: 1, z: 1 },
            skillEffects: {
                'Strength Boost': {
                    particleEffect: 'boost_particles',
                    lightEffect: 'boost_glow',
                    soundEffect: 'boost_sound'
                },
                'Swift Wind': {
                    particleEffect: 'wind_particles',
                    lightEffect: 'wind_glow',
                    soundEffect: 'wind_sound'
                }
            }
        },
        explorer: {
            model: 'explorer_character',
            animations: {
                idle: 'explorer_idle',
                walk: 'explorer_walk',
                skills: {
                    'Speed Boost': 'explorer_cast_speed',
                    'Nature\'s Call': 'explorer_cast_nature'
                },
                emotes: {
                    celebrate: 'explorer_celebrate',
                    wave: 'explorer_wave'
                }
            },
            defaultScale: { x: 1, y: 1, z: 1 },
            skillEffects: {
                'Speed Boost': {
                    particleEffect: 'speed_particles',
                    lightEffect: 'speed_glow',
                    soundEffect: 'speed_sound'
                },
                'Nature\'s Call': {
                    particleEffect: 'nature_particles',
                    lightEffect: 'nature_glow',
                    soundEffect: 'nature_sound'
                }
            }
        },
        shaper: {
            model: 'shaper_character',
            animations: {
                idle: 'shaper_idle',
                walk: 'shaper_walk',
                skills: {
                    'Earth Shaping': 'shaper_cast_earth',
                    'Nature\'s Call': 'shaper_cast_nature'
                },
                emotes: {
                    celebrate: 'shaper_celebrate',
                    wave: 'shaper_wave'
                }
            },
            defaultScale: { x: 1, y: 1, z: 1 },
            skillEffects: {
                'Earth Shaping': {
                    particleEffect: 'earth_particles',
                    lightEffect: 'earth_glow',
                    soundEffect: 'earth_sound'
                },
                'Nature\'s Call': {
                    particleEffect: 'nature_particles',
                    lightEffect: 'nature_glow',
                    soundEffect: 'nature_sound'
                }
            }
        }
    },
    skills: {
        effectRadius: {
            'Healing Aura': 5,
            'Earth Shaping': 3,
            'Nature\'s Call': 4
        },
        effectDuration: {
            'Strength Boost': 10,
            'Swift Wind': 8,
            'Nature\'s Call': 30
        }
    },
    environment: {
        interactiveObjects: {
            'pressure_plate': {
                model: 'pressure_plate',
                animations: {
                    idle: 'plate_idle',
                    pressed: 'plate_pressed'
                },
                effects: {
                    activated: {
                        particleEffect: 'plate_particles',
                        lightEffect: 'plate_glow',
                        soundEffect: 'plate_sound'
                    }
                }
            },
            'lever': {
                model: 'lever',
                animations: {
                    idle: 'lever_idle',
                    pulled: 'lever_pulled'
                },
                effects: {
                    activated: {
                        particleEffect: 'lever_particles',
                        lightEffect: 'lever_glow',
                        soundEffect: 'lever_sound'
                    }
                }
            }
        }
    }
};

module.exports = visualConfigs;
