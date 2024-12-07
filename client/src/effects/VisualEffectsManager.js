import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import TWEEN from '@tweenjs/tween.js';

export default class VisualEffectsManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        
        this.setupPostProcessing();
        this.setupParticleSystems();
    }

    setupPostProcessing() {
        // Create effect composer
        this.composer = new EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom effect
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // Strength
            0.4, // Radius
            0.85  // Threshold
        );
        this.composer.addPass(this.bloomPass);
        
        // Add outline effect
        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );
        this.outlinePass.edgeStrength = 3;
        this.outlinePass.edgeGlow = 0.7;
        this.outlinePass.edgeThickness = 1;
        this.outlinePass.visibleEdgeColor.set('#ffffff');
        this.outlinePass.hiddenEdgeColor.set('#190a05');
        this.composer.addPass(this.outlinePass);
    }

    setupParticleSystems() {
        this.particleSystems = {
            levelUp: this.createLevelUpParticles(),
            healing: this.createHealingParticles(),
            energyRestore: this.createEnergyParticles(),
            skillActivation: this.createSkillParticles()
        };
    }

    createLevelUpParticles() {
        const geometry = new THREE.BufferGeometry();
        const particles = 100;
        
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        
        for (let i = 0; i < particles * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2;
            positions[i + 1] = Math.random() * 3;
            positions[i + 2] = (Math.random() - 0.5) * 2;
            
            colors[i] = 1;  // R
            colors[i + 1] = 0.8;  // G
            colors[i + 2] = 0.2;  // B
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        return new THREE.Points(geometry, material);
    }

    createHealingParticles() {
        const geometry = new THREE.BufferGeometry();
        const particles = 50;
        
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        
        for (let i = 0; i < particles * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2;
            positions[i + 1] = Math.random() * 2;
            positions[i + 2] = (Math.random() - 0.5) * 2;
            
            colors[i] = 0.2;  // R
            colors[i + 1] = 0.8;  // G
            colors[i + 2] = 0.2;  // B
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        return new THREE.Points(geometry, material);
    }

    createEnergyParticles() {
        const geometry = new THREE.BufferGeometry();
        const particles = 60;
        
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        
        for (let i = 0; i < particles * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2;
            positions[i + 1] = Math.random() * 2;
            positions[i + 2] = (Math.random() - 0.5) * 2;
            
            colors[i] = 0.2;  // R
            colors[i + 1] = 0.4;  // G
            colors[i + 2] = 0.8;  // B
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        return new THREE.Points(geometry, material);
    }

    createSkillParticles() {
        const geometry = new THREE.BufferGeometry();
        const particles = 80;
        
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        
        for (let i = 0; i < particles * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2;
            positions[i + 1] = Math.random() * 2;
            positions[i + 2] = (Math.random() - 0.5) * 2;
            
            colors[i] = 0.8;  // R
            colors[i + 1] = 0.4;  // G
            colors[i + 2] = 0.8;  // B
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.07,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        return new THREE.Points(geometry, material);
    }

    playLevelUpEffect(position) {
        const particles = this.particleSystems.levelUp.clone();
        particles.position.copy(position);
        this.scene.add(particles);
        
        // Animate particles
        const initialPositions = particles.geometry.attributes.position.array.slice();
        const duration = 2000;
        
        new TWEEN.Tween({ progress: 0 })
            .to({ progress: 1 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                const positions = particles.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] = initialPositions[i] + (Math.random() - 0.5) * obj.progress;
                    positions[i + 1] = initialPositions[i + 1] + obj.progress * 2;
                    positions[i + 2] = initialPositions[i + 2] + (Math.random() - 0.5) * obj.progress;
                }
                particles.geometry.attributes.position.needsUpdate = true;
                particles.material.opacity = 1 - obj.progress;
            })
            .onComplete(() => {
                this.scene.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
            })
            .start();
    }

    playHealEffect(position) {
        const particles = this.particleSystems.healing.clone();
        particles.position.copy(position);
        this.scene.add(particles);
        
        // Animate healing particles rising
        const duration = 1500;
        
        new TWEEN.Tween({ y: position.y, opacity: 0.6 })
            .to({ y: position.y + 2, opacity: 0 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                particles.position.y = obj.y;
                particles.material.opacity = obj.opacity;
            })
            .onComplete(() => {
                this.scene.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
            })
            .start();
    }

    playEnergyEffect(position) {
        const particles = this.particleSystems.energyRestore.clone();
        particles.position.copy(position);
        this.scene.add(particles);
        
        // Animate energy particles spiraling
        const duration = 1200;
        
        new TWEEN.Tween({ angle: 0, opacity: 0.7 })
            .to({ angle: Math.PI * 2, opacity: 0 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                particles.position.x = position.x + Math.cos(obj.angle) * 0.5;
                particles.position.z = position.z + Math.sin(obj.angle) * 0.5;
                particles.material.opacity = obj.opacity;
            })
            .onComplete(() => {
                this.scene.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
            })
            .start();
    }

    playSkillEffect(position, skillType) {
        const particles = this.particleSystems.skillActivation.clone();
        particles.position.copy(position);
        
        // Customize particles based on skill type
        switch(skillType) {
            case 'healing':
                particles.material.color.setRGB(0.2, 0.8, 0.2);
                break;
            case 'attack':
                particles.material.color.setRGB(0.8, 0.2, 0.2);
                break;
            case 'buff':
                particles.material.color.setRGB(0.2, 0.2, 0.8);
                break;
            default:
                particles.material.color.setRGB(0.8, 0.4, 0.8);
        }
        
        this.scene.add(particles);
        
        // Animate skill particles
        const duration = 1000;
        
        new TWEEN.Tween({ scale: 0, opacity: 0.7 })
            .to({ scale: 2, opacity: 0 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                particles.scale.set(obj.scale, obj.scale, obj.scale);
                particles.material.opacity = obj.opacity;
            })
            .onComplete(() => {
                this.scene.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
            })
            .start();
    }

    highlightObject(object) {
        this.outlinePass.selectedObjects = [object];
    }

    clearHighlight() {
        this.outlinePass.selectedObjects = [];
    }

    update(delta) {
        // Update particle systems
        Object.values(this.particleSystems).forEach(system => {
            if (system.visible) {
                const positions = system.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += (Math.random() - 0.5) * 0.01;
                    positions[i + 1] += Math.random() * 0.02;
                    positions[i + 2] += (Math.random() - 0.5) * 0.01;
                }
                system.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        // Update post-processing effects
        this.composer.render();
        
        // Update tweens
        TWEEN.update();
    }
}
