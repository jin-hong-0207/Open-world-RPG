import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import GamepadManager from './GamepadManager';
import SkillManager from './SkillManager';
import NavigationManager from './NavigationManager';

export default class CharacterController {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.characters = new Map();
        this.currentCharacter = null;
        this.moveSpeed = 0.1;
        this.jumpForce = 5;
        this.gamepadManager = new GamepadManager();
        this.skillManager = new SkillManager(gameEngine, this);
        this.navigationManager = new NavigationManager(gameEngine, this);
        
        // Initialize default skills
        this.initializeDefaultSkills();
        
        // Add gamepad event listeners
        this.setupGamepadListeners();
    }

    initializeDefaultSkills() {
        // Equip default skills to slots
        this.skillManager.equipSkill('heal', 'R1');
        this.skillManager.equipSkill('shield', 'R2');
        this.skillManager.equipSkill('elementalPulse', 'L1_R1');
        this.skillManager.equipSkill('teleport', 'EXTRA');
    }

    setupGamepadListeners() {
        window.addEventListener('gamepadButtonDown', (e) => {
            this.handleGamepadButton(e.detail.mapping, true);
        });

        window.addEventListener('gamepadButtonUp', (e) => {
            this.handleGamepadButton(e.detail.mapping, false);
        });
    }

    handleGamepadButton(button, isPressed) {
        if (!isPressed) return;

        if (this.skillManager.isTargeting) {
            // Handle targeting mode
            switch (button) {
                case 'R3':
                    // Confirm target
                    this.skillManager.confirmTarget(this.getTargetPosition());
                    break;
                case 'B':
                    // Cancel targeting
                    this.skillManager.cancelTargeting();
                    break;
                default:
                    break;
            }
            return;
        }

        switch (button) {
            case 'R1':
                if (this.gamepadManager.isButtonPressed('L1')) {
                    // Ultimate skill (L1 + R1)
                    const ultimateSkill = this.skillManager.skillSlots.L1_R1;
                    if (ultimateSkill) {
                        this.useSkill(ultimateSkill);
                    }
                } else {
                    // Regular R1 skill
                    const r1Skill = this.skillManager.skillSlots.R1;
                    if (r1Skill) {
                        this.useSkill(r1Skill);
                    }
                }
                break;
            case 'R2':
                const r2Skill = this.skillManager.skillSlots.R2;
                if (r2Skill) {
                    this.useSkill(r2Skill);
                }
                break;
            case 'UP':
            case 'DOWN':
                // Cycle through extra skills
                this.skillManager.cycleSkills(button === 'UP' ? -1 : 1);
                break;
            case 'START':
                this.toggleCharacterMenu();
                break;
        }
    }

    useSkill(skill) {
        if (!this.skillManager.canUseSkill(skill)) return;

        switch (skill.targeting) {
            case 'self':
                skill.effect(this.currentCharacter.position);
                this.skillManager.startCooldown(skill);
                break;
            case 'location':
            case 'ally':
            case 'area':
                this.skillManager.startTargeting(skill);
                break;
        }

        // Provide haptic feedback
        this.gamepadManager.vibrate(200, 0.3, 0.3);
    }

    toggleCharacterMenu() {
        // Dispatch event for UI to handle
        window.dispatchEvent(new CustomEvent('toggleCharacterMenu'));
    }

    update(deltaTime) {
        if (!this.currentCharacter) return;

        // Update gamepad state
        this.gamepadManager.update();

        // Handle movement from gamepad
        const movement = this.gamepadManager.getMovementVector();
        if (movement.x !== 0 || movement.y !== 0) {
            this.handleGamepadMovement(movement, deltaTime);
        }

        // Update navigation manager
        this.navigationManager.update(deltaTime);

        // Handle camera/targeting from right stick
        const rightStick = this.gamepadManager.getCameraVector();
        if (this.skillManager.isTargeting) {
            this.updateSkillTargeting(rightStick, deltaTime);
        } else if (rightStick.x !== 0 || rightStick.y !== 0) {
            this.handleGamepadCamera(rightStick, deltaTime);
        }
    }

    updateSkillTargeting(rightStick, deltaTime) {
        if (!this.currentCharacter) return;

        const targetPos = this.getTargetPosition();
        if (targetPos) {
            // Update targeting indicator position
            this.skillManager.updateTargeting(targetPos);
        }
    }

    handleGamepadMovement(movement, deltaTime) {
        if (!this.currentCharacter) return;

        // Get camera direction for movement relative to camera
        const cameraDirection = new THREE.Vector3();
        this.gameEngine.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();

        // Calculate movement direction relative to camera
        const moveDirection = new THREE.Vector3(movement.x, 0, -movement.y);
        moveDirection.normalize();

        // Rotate movement direction based on camera
        const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
        moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);

        // Apply movement
        const speed = this.currentCharacter.isCrouching ? this.moveSpeed * 0.5 : this.moveSpeed;
        this.currentCharacter.position.add(moveDirection.multiplyScalar(speed * deltaTime));

        // Rotate character to face movement direction
        if (moveDirection.length() > 0.1) {
            const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
            new TWEEN.Tween(this.currentCharacter.rotation)
                .to({ y: targetRotation }, 100)
                .start();
        }

        // Update camera to follow character
        this.updateCameraPosition();
    }

    handleGamepadCamera(movement, deltaTime) {
        if (!this.gameEngine.controls) return;

        const sensitivity = 2;
        this.gameEngine.controls.rotateLeft(-movement.x * sensitivity * deltaTime);
        this.gameEngine.controls.rotateUp(-movement.y * sensitivity * deltaTime);
    }

    updateCameraPosition() {
        if (!this.currentCharacter) return;
        
        // Update camera target
        this.gameEngine.controls.target.copy(this.currentCharacter.position);
        
        // Optional: Smoothly move camera to follow player
        const cameraOffset = new THREE.Vector3(-5, 5, 5);
        const targetCameraPos = this.currentCharacter.position.clone().add(cameraOffset);
        
        new TWEEN.Tween(this.gameEngine.camera.position)
            .to(targetCameraPos, 100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    getTargetPosition() {
        if (!this.currentCharacter) return null;

        // Use right stick input for targeting
        const rightStick = this.gamepadManager.getCameraVector();
        if (rightStick.x === 0 && rightStick.y === 0) {
            return this.currentCharacter.position.clone();
        }

        // Create a ray from the character in the direction of the right stick
        const direction = new THREE.Vector3(rightStick.x, 0, -rightStick.y);
        direction.normalize();

        const raycaster = new THREE.Raycaster(
            this.currentCharacter.position.clone(),
            direction
        );

        const intersects = raycaster.intersectObjects(this.gameEngine.scene.children);
        if (intersects.length > 0) {
            return intersects[0].point;
        }

        // If no intersection, return a point at maximum skill range
        return this.currentCharacter.position.clone().add(
            direction.multiplyScalar(10)
        );
    }

    initializeCharacter(characterData) {
        // Create character mesh
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const character = new THREE.Mesh(geometry, material);
        
        character.position.set(
            characterData.position.x,
            characterData.position.y + 1, // Offset to place on ground
            characterData.position.z
        );
        
        character.castShadow = true;
        character.receiveShadow = true;
        
        // Add character data
        character.userData = {
            id: characterData.id,
            level: characterData.level || 1,
            experience: characterData.experience || 0,
            health: characterData.health || 100,
            energy: characterData.energy || 100,
            skills: characterData.skills || []
        };

        this.gameEngine.addObject(character);
        this.characters.set(characterData.id, character);
        
        if (characterData.isCurrentPlayer) {
            this.currentCharacter = character;
            this.setupCamera(character);
        }

        return character;
    }

    setupCamera(character) {
        // Position camera behind character
        this.gameEngine.camera.position.set(
            character.position.x - 5,
            character.position.y + 5,
            character.position.z + 5
        );
        this.gameEngine.controls.target = character.position;
    }

    moveForward() {
        if (!this.currentCharacter) return;
        
        const moveDistance = this.moveSpeed;
        const direction = new THREE.Vector3();
        this.gameEngine.camera.getWorldDirection(direction);
        
        // Only use x and z components for movement
        direction.y = 0;
        direction.normalize();
        
        this.currentCharacter.position.add(direction.multiplyScalar(moveDistance));
        this.updateCameraPosition();
    }

    moveBackward() {
        if (!this.currentCharacter) return;
        
        const moveDistance = -this.moveSpeed;
        const direction = new THREE.Vector3();
        this.gameEngine.camera.getWorldDirection(direction);
        
        direction.y = 0;
        direction.normalize();
        
        this.currentCharacter.position.add(direction.multiplyScalar(moveDistance));
        this.updateCameraPosition();
    }

    moveLeft() {
        if (!this.currentCharacter) return;
        
        const moveDistance = this.moveSpeed;
        const direction = new THREE.Vector3();
        this.gameEngine.camera.getWorldDirection(direction);
        
        direction.y = 0;
        direction.normalize();
        direction.cross(new THREE.Vector3(0, 1, 0));
        
        this.currentCharacter.position.add(direction.multiplyScalar(moveDistance));
        this.updateCameraPosition();
    }

    moveRight() {
        if (!this.currentCharacter) return;
        
        const moveDistance = -this.moveSpeed;
        const direction = new THREE.Vector3();
        this.gameEngine.camera.getWorldDirection(direction);
        
        direction.y = 0;
        direction.normalize();
        direction.cross(new THREE.Vector3(0, 1, 0));
        
        this.currentCharacter.position.add(direction.multiplyScalar(moveDistance));
        this.updateCameraPosition();
    }

    jump() {
        if (!this.currentCharacter || this.isJumping) return;
        
        this.isJumping = true;
        const initialY = this.currentCharacter.position.y;
        
        new TWEEN.Tween({ y: initialY })
            .to({ y: initialY + this.jumpForce }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((coords) => {
                this.currentCharacter.position.y = coords.y;
                this.updateCameraPosition();
            })
            .chain(
                new TWEEN.Tween({ y: initialY + this.jumpForce })
                    .to({ y: initialY }, 500)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .onUpdate((coords) => {
                        this.currentCharacter.position.y = coords.y;
                        this.updateCameraPosition();
                    })
                    .onComplete(() => {
                        this.isJumping = false;
                    })
            )
            .start();
    }

    updatePlayerPosition(playerId, position, rotation) {
        const character = this.characters.get(playerId);
        if (!character) return;
        
        // Smoothly interpolate to new position
        new TWEEN.Tween(character.position)
            .to(position, 100)
            .easing(TWEEN.Easing.Linear.None)
            .start();
            
        if (rotation) {
            new TWEEN.Tween(character.rotation)
                .to(rotation, 100)
                .easing(TWEEN.Easing.Linear.None)
                .start();
        }
    }

    showSkillEffect(playerId, skillId, target, effects) {
        const character = this.characters.get(playerId);
        if (!character) return;
        
        const skill = this.skills.find(s => s.id === skillId);
        if (skill) {
            skill.effect(target);
        }
    }

    removePlayer(playerId) {
        const character = this.characters.get(playerId);
        if (character) {
            this.gameEngine.removeObject(character.id);
            this.characters.delete(playerId);
        }
    }
}
