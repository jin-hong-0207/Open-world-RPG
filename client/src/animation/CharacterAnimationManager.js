import * as THREE from 'three';
import { AnimationMixer } from 'three';

export default class CharacterAnimationManager {
    constructor(character, animations) {
        this.character = character;
        this.mixer = new AnimationMixer(character.model);
        this.animations = new Map();
        this.currentAction = null;
        this.previousAction = null;
        this.transitionDuration = 0.5;
        
        // Initialize animations
        this.initializeAnimations(animations);
        
        // States
        this.isMoving = false;
        this.isJumping = false;
        this.isCasting = false;
    }

    initializeAnimations(animations) {
        // Base animations
        this.addAnimation('idle', animations.idle, true);
        this.addAnimation('walk', animations.walk, true);
        this.addAnimation('run', animations.run, true);
        this.addAnimation('jump', animations.jump, false);
        this.addAnimation('land', animations.land, false);
        
        // Interaction animations
        this.addAnimation('interact', animations.interact, false);
        this.addAnimation('wave', animations.wave, false);
        this.addAnimation('sit', animations.sit, false);
        
        // Skill animations
        this.addAnimation('cast_start', animations.cast_start, false);
        this.addAnimation('cast_loop', animations.cast_loop, true);
        this.addAnimation('cast_end', animations.cast_end, false);
        
        // Emotive animations
        this.addAnimation('celebrate', animations.celebrate, false);
        this.addAnimation('disappointed', animations.disappointed, false);
        
        // Start with idle animation
        this.playAnimation('idle');
    }

    addAnimation(name, clip, loop = false) {
        if (!clip) return;
        
        const action = this.mixer.clipAction(clip);
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
        action.clampWhenFinished = !loop;
        
        this.animations.set(name, {
            action: action,
            clip: clip,
            loop: loop
        });
    }

    playAnimation(name, transitionDuration = this.transitionDuration) {
        const animation = this.animations.get(name);
        if (!animation) return;

        const action = animation.action;
        
        if (this.currentAction === action) return;
        
        this.previousAction = this.currentAction;
        this.currentAction = action;
        
        if (this.previousAction) {
            this.previousAction.fadeOut(transitionDuration);
        }
        
        action.reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(transitionDuration)
            .play();
            
        // Handle one-shot animations
        if (!animation.loop) {
            action.getMixer().addEventListener('finished', () => {
                this.onAnimationComplete(name);
            });
        }
    }

    onAnimationComplete(name) {
        switch (name) {
            case 'jump':
                this.playAnimation('land');
                break;
            case 'land':
                this.isJumping = false;
                this.updateMovementState();
                break;
            case 'cast_start':
                this.playAnimation('cast_loop');
                break;
            case 'cast_end':
                this.isCasting = false;
                this.updateMovementState();
                break;
            case 'interact':
            case 'wave':
            case 'celebrate':
            case 'disappointed':
                this.updateMovementState();
                break;
        }
    }

    updateMovementState() {
        if (this.isJumping || this.isCasting) return;
        
        if (this.isMoving) {
            this.playAnimation(this.isRunning ? 'run' : 'walk');
        } else {
            this.playAnimation('idle');
        }
    }

    startMoving(running = false) {
        this.isMoving = true;
        this.isRunning = running;
        if (!this.isJumping && !this.isCasting) {
            this.playAnimation(running ? 'run' : 'walk');
        }
    }

    stopMoving() {
        this.isMoving = false;
        this.isRunning = false;
        if (!this.isJumping && !this.isCasting) {
            this.playAnimation('idle');
        }
    }

    jump() {
        if (this.isJumping) return;
        
        this.isJumping = true;
        this.playAnimation('jump', 0.1);
    }

    startCasting() {
        if (this.isCasting) return;
        
        this.isCasting = true;
        this.playAnimation('cast_start', 0.2);
    }

    endCasting() {
        if (!this.isCasting) return;
        
        this.playAnimation('cast_end', 0.2);
    }

    playEmote(emoteName) {
        const validEmotes = ['wave', 'celebrate', 'disappointed'];
        if (validEmotes.includes(emoteName)) {
            this.playAnimation(emoteName, 0.2);
        }
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    // Advanced animation blending
    blendAnimations(fromName, toName, blendFactor) {
        const from = this.animations.get(fromName);
        const to = this.animations.get(toName);
        
        if (!from || !to) return;
        
        from.action.enabled = true;
        to.action.enabled = true;
        
        from.action.setEffectiveWeight(1 - blendFactor);
        to.action.setEffectiveWeight(blendFactor);
        
        if (!from.action.isRunning()) from.action.play();
        if (!to.action.isRunning()) to.action.play();
    }

    // Add procedural animation
    addProceduralAnimation(boneName, animationData) {
        const bone = this.findBone(boneName);
        if (!bone) return;
        
        const originalRotation = bone.rotation.clone();
        const targetRotation = new THREE.Euler(
            originalRotation.x + animationData.rotationX,
            originalRotation.y + animationData.rotationY,
            originalRotation.z + animationData.rotationZ
        );
        
        new TWEEN.Tween(bone.rotation)
            .to(targetRotation, animationData.duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .yoyo(animationData.yoyo)
            .repeat(animationData.repeat)
            .start();
    }

    findBone(name) {
        let result = null;
        this.character.model.traverse((bone) => {
            if (bone.isBone && bone.name === name) {
                result = bone;
            }
        });
        return result;
    }

    // IK system integration
    updateIK(targetPosition, chainLength = 3) {
        // Implement inverse kinematics for precise limb positioning
        // This is a placeholder for IK implementation
    }
}
