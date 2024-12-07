import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export default class CameraEffectsManager {
    constructor(camera) {
        this.camera = camera;
        this.initialPosition = camera.position.clone();
        this.initialRotation = camera.rotation.clone();
        this.targetPosition = new THREE.Vector3();
        this.targetRotation = new THREE.Euler();
        
        // Camera states
        this.isShaking = false;
        this.isTransitioning = false;
        this.currentPreset = 'default';
        
        // Shake parameters
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeElapsed = 0;
        this.shakeOffset = new THREE.Vector3();
        
        // Initialize presets
        this.initializePresets();
    }

    initializePresets() {
        this.presets = {
            default: {
                position: new THREE.Vector3(0, 2, 5),
                rotation: new THREE.Euler(-0.2, 0, 0),
                fov: 75
            },
            closeup: {
                position: new THREE.Vector3(0, 1.6, 2),
                rotation: new THREE.Euler(0, 0, 0),
                fov: 50
            },
            wideshot: {
                position: new THREE.Vector3(0, 3, 8),
                rotation: new THREE.Euler(-0.3, 0, 0),
                fov: 90
            },
            overhead: {
                position: new THREE.Vector3(0, 10, 0),
                rotation: new THREE.Euler(-Math.PI/2, 0, 0),
                fov: 60
            },
            dramatic: {
                position: new THREE.Vector3(3, 2, 4),
                rotation: new THREE.Euler(-0.2, 0.5, 0.1),
                fov: 35
            }
        };
    }

    shake(intensity = 0.5, duration = 0.5) {
        if (this.isShaking) return;
        
        this.isShaking = true;
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeElapsed = 0;
        this.shakeOffset.set(0, 0, 0);
    }

    updateShake(delta) {
        if (!this.isShaking) return;

        this.shakeElapsed += delta;
        
        if (this.shakeElapsed >= this.shakeDuration) {
            this.isShaking = false;
            this.camera.position.sub(this.shakeOffset);
            this.shakeOffset.set(0, 0, 0);
            return;
        }

        // Remove previous shake offset
        this.camera.position.sub(this.shakeOffset);

        // Calculate new shake offset
        const progress = this.shakeElapsed / this.shakeDuration;
        const intensity = this.shakeIntensity * (1 - progress);

        this.shakeOffset.set(
            (Math.random() - 0.5) * intensity,
            (Math.random() - 0.5) * intensity,
            (Math.random() - 0.5) * intensity
        );

        // Apply new shake offset
        this.camera.position.add(this.shakeOffset);
    }

    transitionToPreset(presetName, duration = 1000, easing = TWEEN.Easing.Quadratic.InOut) {
        if (this.isTransitioning || !this.presets[presetName]) return;
        
        const preset = this.presets[presetName];
        this.isTransitioning = true;
        this.currentPreset = presetName;

        // Position transition
        new TWEEN.Tween(this.camera.position)
            .to({
                x: preset.position.x,
                y: preset.position.y,
                z: preset.position.z
            }, duration)
            .easing(easing)
            .start();

        // Rotation transition
        new TWEEN.Tween(this.camera.rotation)
            .to({
                x: preset.rotation.x,
                y: preset.rotation.y,
                z: preset.rotation.z
            }, duration)
            .easing(easing)
            .start();

        // FOV transition
        new TWEEN.Tween(this.camera)
            .to({ fov: preset.fov }, duration)
            .easing(easing)
            .onUpdate(() => {
                this.camera.updateProjectionMatrix();
            })
            .onComplete(() => {
                this.isTransitioning = false;
            })
            .start();
    }

    followTarget(target, offset = new THREE.Vector3(0, 2, 5), lookAt = true) {
        const position = target.position.clone().add(offset);
        
        new TWEEN.Tween(this.camera.position)
            .to({
                x: position.x,
                y: position.y,
                z: position.z
            }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        if (lookAt) {
            this.camera.lookAt(target.position);
        }
    }

    orbit(target, radius = 5, height = 2, speed = 1) {
        const time = Date.now() * 0.001 * speed;
        
        this.camera.position.x = Math.cos(time) * radius + target.position.x;
        this.camera.position.z = Math.sin(time) * radius + target.position.z;
        this.camera.position.y = height + target.position.y;
        
        this.camera.lookAt(target.position);
    }

    dollyZoom(targetFOV, duration = 1000) {
        const initialFOV = this.camera.fov;
        const initialZ = this.camera.position.z;
        
        // Calculate the target Z position to maintain subject size
        const targetZ = initialZ * (Math.tan(THREE.MathUtils.degToRad(initialFOV) / 2)) /
                                 (Math.tan(THREE.MathUtils.degToRad(targetFOV) / 2));

        // Animate FOV and Z position simultaneously
        new TWEEN.Tween({
            fov: initialFOV,
            z: initialZ
        })
        .to({
            fov: targetFOV,
            z: targetZ
        }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate((obj) => {
            this.camera.fov = obj.fov;
            this.camera.position.z = obj.z;
            this.camera.updateProjectionMatrix();
        })
        .start();
    }

    addCameraRoll(angle, duration = 500) {
        new TWEEN.Tween(this.camera.rotation)
            .to({ z: angle }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }

    startCinematicMode() {
        // Add letterbox effect
        const letterboxStyle = document.createElement('style');
        letterboxStyle.id = 'cinematicMode';
        letterboxStyle.textContent = `
            body::before, body::after {
                content: '';
                position: fixed;
                left: 0;
                right: 0;
                height: 0;
                background: black;
                transition: height 0.5s ease;
                z-index: 9999;
            }
            body::before { top: 0; }
            body::after { bottom: 0; }
            body.cinematic::before, body.cinematic::after {
                height: 10vh;
            }
        `;
        document.head.appendChild(letterboxStyle);
        document.body.classList.add('cinematic');
    }

    endCinematicMode() {
        document.body.classList.remove('cinematic');
        const style = document.getElementById('cinematicMode');
        if (style) style.remove();
    }

    update(delta) {
        // Update camera shake
        this.updateShake(delta);
        
        // Update tweens
        TWEEN.update();
    }
}
