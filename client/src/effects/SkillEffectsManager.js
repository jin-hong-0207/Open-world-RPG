import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export default class SkillEffectsManager {
    constructor(scene, assetManager) {
        this.scene = scene;
        this.assetManager = assetManager;
        this.activeEffects = new Map();
        this.particleSystems = new Map();
        
        // Initialize effect templates
        this.initializeEffectTemplates();
    }

    initializeEffectTemplates() {
        // Healing Aura Effect
        this.effectTemplates = {
            healing_aura: {
                create: (position) => {
                    const geometry = new THREE.CircleGeometry(2, 32);
                    const material = new THREE.MeshBasicMaterial({
                        map: this.assetManager.getTexture('healing_aura'),
                        transparent: true,
                        opacity: 0.6,
                        side: THREE.DoubleSide
                    });
                    
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.copy(position);
                    mesh.position.y += 0.1; // Slightly above ground
                    mesh.rotation.x = -Math.PI / 2; // Lay flat
                    
                    return mesh;
                },
                animate: (mesh) => {
                    const scale = { value: 0 };
                    const opacity = { value: 0 };
                    
                    // Scale up and fade in
                    new TWEEN.Tween(scale)
                        .to({ value: 1 }, 500)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() => {
                            mesh.scale.set(scale.value, scale.value, scale.value);
                        })
                        .start();
                        
                    new TWEEN.Tween(opacity)
                        .to({ value: 0.6 }, 500)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() => {
                            mesh.material.opacity = opacity.value;
                        })
                        .start();
                        
                    // Pulse animation
                    new TWEEN.Tween(scale)
                        .to({ value: 1.2 }, 1000)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .yoyo(true)
                        .repeat(Infinity)
                        .delay(500)
                        .start();
                }
            },
            
            energy_blast: {
                create: (position, direction) => {
                    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
                    const material = new THREE.MeshBasicMaterial({
                        map: this.assetManager.getTexture('energy_blast'),
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.copy(position);
                    
                    // Create particle system for trail
                    const particles = this.createParticleSystem(position);
                    this.particleSystems.set(mesh.uuid, particles);
                    
                    return mesh;
                },
                animate: (mesh, direction) => {
                    const distance = 20;
                    const duration = 1000;
                    
                    const targetPos = new THREE.Vector3()
                        .copy(mesh.position)
                        .add(direction.multiplyScalar(distance));
                    
                    // Move projectile
                    new TWEEN.Tween(mesh.position)
                        .to(targetPos, duration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() => {
                            // Update particle system position
                            const particles = this.particleSystems.get(mesh.uuid);
                            if (particles) {
                                particles.position.copy(mesh.position);
                            }
                        })
                        .onComplete(() => {
                            this.removeEffect(mesh.uuid);
                        })
                        .start();
                        
                    // Rotate projectile
                    new TWEEN.Tween(mesh.rotation)
                        .to({
                            x: Math.PI * 2,
                            y: Math.PI * 2,
                            z: Math.PI * 2
                        }, duration)
                        .repeat(Infinity)
                        .start();
                }
            }
        };
    }

    createParticleSystem(position) {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = position.x;
            positions[i + 1] = position.y;
            positions[i + 2] = position.z;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x88ccff,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        return particles;
    }

    playSkillEffect(skillName, position, direction = null) {
        const template = this.effectTemplates[skillName];
        if (!template) return null;
        
        const effect = template.create(position, direction);
        this.scene.add(effect);
        this.activeEffects.set(effect.uuid, effect);
        
        // Play sound effect
        const sound = this.assetManager.getSound(skillName);
        if (sound) {
            // Play sound using your audio system
        }
        
        // Start animation
        template.animate(effect, direction);
        
        return effect.uuid;
    }

    removeEffect(effectId) {
        const effect = this.activeEffects.get(effectId);
        if (effect) {
            this.scene.remove(effect);
            this.activeEffects.delete(effectId);
            
            // Clean up particle system if exists
            const particles = this.particleSystems.get(effectId);
            if (particles) {
                this.scene.remove(particles);
                this.particleSystems.delete(effectId);
            }
        }
    }

    update(delta) {
        // Update particle systems
        this.particleSystems.forEach((particles) => {
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (Math.random() - 0.5) * 0.1;
                positions[i + 1] += (Math.random() - 0.5) * 0.1;
                positions[i + 2] += (Math.random() - 0.5) * 0.1;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
        });
    }

    dispose() {
        // Clean up all active effects
        this.activeEffects.forEach((effect) => {
            this.removeEffect(effect.uuid);
        });
        
        // Clean up all particle systems
        this.particleSystems.forEach((particles) => {
            this.scene.remove(particles);
            particles.geometry.dispose();
            particles.material.dispose();
        });
        
        this.particleSystems.clear();
    }
}
