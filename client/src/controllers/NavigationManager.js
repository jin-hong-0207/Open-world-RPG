import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export default class NavigationManager {
    constructor(gameEngine, characterController) {
        this.gameEngine = gameEngine;
        this.characterController = characterController;
        this.minimapVisible = false;
        this.fastTravelPoints = new Map();
        this.currentCameraMode = 'follow'; // 'follow', 'fixed', 'orbit'
        this.cameraPresets = {
            default: { position: new THREE.Vector3(-5, 5, 5), target: new THREE.Vector3(0, 0, 0) },
            puzzle: { position: new THREE.Vector3(0, 10, 0), target: new THREE.Vector3(0, 0, 0) },
            cinematic: { position: new THREE.Vector3(-10, 3, 10), target: new THREE.Vector3(0, 1, 0) }
        };
        
        this.setupEventListeners();
        this.initializeFastTravelPoints();
    }

    setupEventListeners() {
        window.addEventListener('gamepadButtonDown', (e) => {
            this.handleGamepadButton(e.detail.mapping, true);
        });

        window.addEventListener('gamepadButtonUp', (e) => {
            this.handleGamepadButton(e.detail.mapping, false);
        });
    }

    handleGamepadButton(button, isPressed) {
        if (!isPressed) return;

        switch (button) {
            case 'A':
                this.handleInteraction();
                break;
            case 'B':
                this.handleMovementAction();
                break;
            case 'L1':
                this.cycleCameraPreset(-1);
                break;
            case 'R1':
                this.cycleCameraPreset(1);
                break;
            case 'SELECT':
                this.toggleMinimap();
                break;
        }
    }

    handleInteraction() {
        const interactiveObject = this.findNearestInteractiveObject();
        if (!interactiveObject) return;

        switch (interactiveObject.userData.type) {
            case 'npc':
                this.triggerDialog(interactiveObject);
                break;
            case 'door':
                this.toggleDoor(interactiveObject);
                break;
            case 'fastTravel':
                this.activateFastTravel(interactiveObject);
                break;
            case 'secret':
                this.discoverSecret(interactiveObject);
                break;
            default:
                this.genericInteraction(interactiveObject);
        }
    }

    handleMovementAction() {
        const character = this.characterController.currentCharacter;
        if (!character) return;

        // Check for obstacles or special movement areas
        const obstacles = this.detectObstacles();
        
        if (obstacles.needsJump) {
            this.performJump();
        } else if (obstacles.needsCrouch) {
            this.performCrouch();
        }
    }

    detectObstacles() {
        const character = this.characterController.currentCharacter;
        if (!character) return { needsJump: false, needsCrouch: false };

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(character.quaternion);

        const raycaster = new THREE.Raycaster(
            character.position,
            forward,
            0,
            2 // Detection range
        );

        const obstacles = raycaster.intersectObjects(this.gameEngine.scene.children);
        
        return {
            needsJump: obstacles.some(o => o.object.userData.jumpable),
            needsCrouch: obstacles.some(o => o.object.userData.crouchable)
        };
    }

    performJump() {
        const character = this.characterController.currentCharacter;
        if (!character || character.isJumping) return;

        character.isJumping = true;
        
        // Jump animation
        new TWEEN.Tween(character.position)
            .to({ y: character.position.y + 2 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .chain(
                new TWEEN.Tween(character.position)
                    .to({ y: character.position.y }, 500)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .onComplete(() => {
                        character.isJumping = false;
                    })
            )
            .start();

        // Haptic feedback
        this.characterController.gamepadManager.vibrate(200, 0.3, 0.3);
    }

    performCrouch() {
        const character = this.characterController.currentCharacter;
        if (!character || character.isCrouching) return;

        character.isCrouching = true;
        
        // Crouch animation
        new TWEEN.Tween(character.scale)
            .to({ y: 0.5 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                setTimeout(() => {
                    new TWEEN.Tween(character.scale)
                        .to({ y: 1 }, 200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {
                            character.isCrouching = false;
                        })
                        .start();
                }, 1000); // Stay crouched for 1 second
            })
            .start();
    }

    cycleCameraPreset(direction) {
        const presets = Object.keys(this.cameraPresets);
        const currentIndex = presets.indexOf(this.currentCameraMode);
        const nextIndex = (currentIndex + direction + presets.length) % presets.length;
        const nextPreset = presets[nextIndex];

        this.setCameraPreset(nextPreset);
    }

    setCameraPreset(presetName) {
        const preset = this.cameraPresets[presetName];
        if (!preset) return;

        this.currentCameraMode = presetName;

        // Smoothly transition camera
        new TWEEN.Tween(this.gameEngine.camera.position)
            .to(preset.position, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        new TWEEN.Tween(this.gameEngine.controls.target)
            .to(preset.target, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }

    toggleMinimap() {
        this.minimapVisible = !this.minimapVisible;
        // Dispatch event for UI to handle
        window.dispatchEvent(new CustomEvent('toggleMinimap', {
            detail: { visible: this.minimapVisible }
        }));
    }

    initializeFastTravelPoints() {
        // Add some default fast travel points
        this.addFastTravelPoint('town', {
            position: new THREE.Vector3(0, 0, 0),
            name: 'Town Square',
            description: 'The central hub of activity'
        });

        this.addFastTravelPoint('forest', {
            position: new THREE.Vector3(100, 0, 100),
            name: 'Mystic Forest',
            description: 'A mysterious woodland filled with ancient secrets'
        });

        this.addFastTravelPoint('mountain', {
            position: new THREE.Vector3(-100, 50, -100),
            name: 'Mountain Peak',
            description: 'The highest point in the realm'
        });
    }

    addFastTravelPoint(id, data) {
        this.fastTravelPoints.set(id, {
            ...data,
            unlocked: false
        });

        // Create visual marker in the world
        const marker = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 2, 8),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        marker.position.copy(data.position);
        marker.userData = {
            type: 'fastTravel',
            id: id
        };

        this.gameEngine.scene.add(marker);
    }

    activateFastTravel(point) {
        const fastTravelPoint = this.fastTravelPoints.get(point.userData.id);
        if (!fastTravelPoint || !fastTravelPoint.unlocked) {
            // First time discovery
            if (!fastTravelPoint.unlocked) {
                fastTravelPoint.unlocked = true;
                this.characterController.gamepadManager.vibrate(500, 0.5, 0.5);
                // Dispatch discovery event
                window.dispatchEvent(new CustomEvent('discoveredFastTravel', {
                    detail: { id: point.userData.id, name: fastTravelPoint.name }
                }));
            }
            return;
        }

        // Perform fast travel
        const character = this.characterController.currentCharacter;
        if (!character) return;

        // Fade out
        this.gameEngine.fadeScreen(true, () => {
            // Teleport character
            character.position.copy(fastTravelPoint.position);
            this.characterController.updateCameraPosition();

            // Fade in
            this.gameEngine.fadeScreen(false);
        });
    }

    findNearestInteractiveObject() {
        const character = this.characterController.currentCharacter;
        if (!character) return null;

        const maxDistance = 3; // Maximum interaction distance
        let nearest = null;
        let minDistance = maxDistance;

        this.gameEngine.scene.traverse((object) => {
            if (object.userData && (object.userData.type === 'npc' || 
                                  object.userData.type === 'door' || 
                                  object.userData.type === 'fastTravel' ||
                                  object.userData.type === 'secret')) {
                const distance = character.position.distanceTo(object.position);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = object;
                }
            }
        });

        return nearest;
    }

    discoverSecret(secret) {
        // Visual effect for secret discovery
        const particles = new THREE.Points(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, -1, 0)
            ]),
            new THREE.PointsMaterial({ color: 0xffff00, size: 0.2 })
        );
        particles.position.copy(secret.position);

        this.gameEngine.scene.add(particles);

        // Strong haptic feedback for discovery
        this.characterController.gamepadManager.vibrate(1000, 0.7, 0.7);

        // Animate particles
        new TWEEN.Tween(particles.material)
            .to({ size: 0.5, opacity: 0 }, 1000)
            .onComplete(() => {
                this.gameEngine.scene.remove(particles);
            })
            .start();

        // Dispatch event for UI/sound effects
        window.dispatchEvent(new CustomEvent('secretDiscovered', {
            detail: { id: secret.userData.id }
        }));
    }

    update(deltaTime) {
        // Update any continuous animations or effects
        TWEEN.update();

        // Update camera based on current mode
        if (this.currentCameraMode === 'follow') {
            this.characterController.updateCameraPosition();
        }
    }
}
