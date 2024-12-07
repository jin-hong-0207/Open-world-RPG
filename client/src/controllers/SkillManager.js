import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export default class SkillManager {
    constructor(gameEngine, characterController) {
        this.gameEngine = gameEngine;
        this.characterController = characterController;
        this.activeSkills = new Map(); // Currently equipped skills
        this.allSkills = this.initializeSkills();
        this.selectedSkillIndex = 0;
        this.isTargeting = false;
        this.targetingSkill = null;
        this.targetingIndicator = this.createTargetingIndicator();
        
        // Skill slots configuration
        this.skillSlots = {
            R1: null,
            R2: null,
            L1_R1: null, // Ultimate skill
            EXTRA: [] // Additional skills that can be cycled through
        };
    }

    initializeSkills() {
        return {
            heal: {
                id: 'heal',
                name: 'Healing Light',
                description: 'Restore health to target ally',
                type: 'support',
                cooldown: 5000,
                energyCost: 20,
                targeting: 'ally',
                level: 1,
                maxLevel: 5,
                effect: (target) => this.castHeal(target),
                getTooltip: (level) => `Heal ${30 + (level * 10)} HP`
            },
            shield: {
                id: 'shield',
                name: 'Energy Shield',
                description: 'Create a protective barrier',
                type: 'defense',
                cooldown: 8000,
                energyCost: 30,
                targeting: 'self',
                level: 1,
                maxLevel: 5,
                effect: (target) => this.castShield(target),
                getTooltip: (level) => `Shield absorbs ${50 + (level * 20)} damage`
            },
            teleport: {
                id: 'teleport',
                name: 'Phase Shift',
                description: 'Teleport to target location',
                type: 'mobility',
                cooldown: 12000,
                energyCost: 40,
                targeting: 'location',
                level: 1,
                maxLevel: 5,
                effect: (target) => this.castTeleport(target),
                getTooltip: (level) => `Range: ${10 + (level * 2)} meters`
            },
            elementalPulse: {
                id: 'elementalPulse',
                name: 'Elemental Pulse',
                description: 'Release a wave of elemental energy',
                type: 'ultimate',
                cooldown: 30000,
                energyCost: 100,
                targeting: 'area',
                level: 1,
                maxLevel: 3,
                effect: (target) => this.castElementalPulse(target),
                getTooltip: (level) => `Affects ${5 + (level * 2)} meter radius`
            }
        };
    }

    createTargetingIndicator() {
        const geometry = new THREE.RingGeometry(0.5, 0.6, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const indicator = new THREE.Mesh(geometry, material);
        indicator.rotation.x = -Math.PI / 2; // Lay flat
        indicator.visible = false;
        this.gameEngine.scene.add(indicator);
        return indicator;
    }

    equipSkill(skillId, slot) {
        const skill = this.allSkills[skillId];
        if (!skill) return false;

        switch (slot) {
            case 'R1':
            case 'R2':
            case 'L1_R1':
                this.skillSlots[slot] = skill;
                break;
            default:
                // Add to extra skills if not a primary slot
                if (!this.skillSlots.EXTRA.includes(skill)) {
                    this.skillSlots.EXTRA.push(skill);
                }
                break;
        }

        this.activeSkills.set(skillId, skill);
        return true;
    }

    cycleSkills(direction) {
        if (this.skillSlots.EXTRA.length === 0) return;

        this.selectedSkillIndex = (this.selectedSkillIndex + direction + this.skillSlots.EXTRA.length) 
            % this.skillSlots.EXTRA.length;
        
        // Update UI to show selected skill
        this.updateSkillUI();
    }

    startTargeting(skill) {
        if (!skill || !skill.targeting) return;

        this.isTargeting = true;
        this.targetingSkill = skill;
        this.targetingIndicator.visible = true;
        this.targetingIndicator.material.color.setHex(
            skill.targeting === 'ally' ? 0x00ff00 : 0xff0000
        );
    }

    updateTargeting(position) {
        if (!this.isTargeting || !this.targetingIndicator) return;

        this.targetingIndicator.position.copy(position);
        
        // Update indicator size based on skill area if applicable
        if (this.targetingSkill.targeting === 'area') {
            const radius = 5 + (this.targetingSkill.level * 2);
            this.targetingIndicator.scale.set(radius, radius, 1);
        }
    }

    confirmTarget(position) {
        if (!this.isTargeting || !this.targetingSkill) return;

        const skill = this.targetingSkill;
        this.isTargeting = false;
        this.targetingIndicator.visible = false;
        
        // Execute the skill
        if (this.canUseSkill(skill)) {
            skill.effect(position);
            this.startCooldown(skill);
        }
    }

    cancelTargeting() {
        this.isTargeting = false;
        this.targetingSkill = null;
        this.targetingIndicator.visible = false;
    }

    canUseSkill(skill) {
        if (!skill) return false;

        const character = this.characterController.currentCharacter;
        if (!character) return false;

        return !skill.onCooldown && 
               character.userData.energy >= skill.energyCost;
    }

    startCooldown(skill) {
        skill.onCooldown = true;
        skill.lastUsed = performance.now();

        // Consume energy
        const character = this.characterController.currentCharacter;
        if (character) {
            character.userData.energy -= skill.energyCost;
        }

        // Start cooldown timer
        setTimeout(() => {
            skill.onCooldown = false;
            // Dispatch event for UI update
            window.dispatchEvent(new CustomEvent('skillCooldownComplete', {
                detail: { skillId: skill.id }
            }));
        }, skill.cooldown);
    }

    updateSkillUI() {
        // Dispatch event for UI update
        window.dispatchEvent(new CustomEvent('skillsUpdated', {
            detail: {
                activeSkills: Array.from(this.activeSkills.values()),
                selectedIndex: this.selectedSkillIndex,
                slots: this.skillSlots
            }
        }));
    }

    levelUpSkill(skillId) {
        const skill = this.allSkills[skillId];
        if (!skill || skill.level >= skill.maxLevel) return false;

        skill.level++;
        this.updateSkillUI();
        return true;
    }

    // Skill effect implementations
    castHeal(target) {
        const skill = this.allSkills.heal;
        const healAmount = 30 + (skill.level * 10);
        
        // Create healing effect
        const healEffect = new THREE.PointLight(0x00ff00, 1, 10);
        healEffect.position.copy(target);
        
        this.gameEngine.addObject(healEffect);
        
        // Animate healing effect
        new TWEEN.Tween({ intensity: 1, scale: 1 })
            .to({ intensity: 0, scale: 2 }, 1000)
            .onUpdate((props) => {
                healEffect.intensity = props.intensity;
                healEffect.scale.set(props.scale, props.scale, props.scale);
            })
            .onComplete(() => {
                this.gameEngine.removeObject(healEffect.id);
            })
            .start();

        return healAmount;
    }

    castShield(target) {
        const skill = this.allSkills.shield;
        const shieldAmount = 50 + (skill.level * 20);
        
        // Create shield effect
        const shieldGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const shieldMaterial = new THREE.MeshPhongMaterial({
            color: 0x4444ff,
            transparent: true,
            opacity: 0.3
        });
        
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        shield.position.copy(target);
        
        this.gameEngine.addObject(shield);
        
        // Animate shield effect
        new TWEEN.Tween({ opacity: 0.3, scale: 1 })
            .to({ opacity: 0, scale: 2 }, 2000)
            .onUpdate((props) => {
                shieldMaterial.opacity = props.opacity;
                shield.scale.set(props.scale, props.scale, props.scale);
            })
            .onComplete(() => {
                this.gameEngine.removeObject(shield.id);
            })
            .start();

        return shieldAmount;
    }

    castTeleport(target) {
        const skill = this.allSkills.teleport;
        const range = 10 + (skill.level * 2);
        
        const character = this.characterController.currentCharacter;
        if (!character) return;

        const startPos = character.position.clone();
        const direction = target.clone().sub(startPos);
        
        // Limit teleport distance to range
        if (direction.length() > range) {
            direction.normalize().multiplyScalar(range);
            target.copy(startPos).add(direction);
        }

        // Create teleport effect
        const particles = new THREE.Points(
            new THREE.BufferGeometry().setFromPoints([startPos, target]),
            new THREE.PointsMaterial({ color: 0xff00ff, size: 0.1 })
        );
        
        this.gameEngine.addObject(particles);
        
        // Animate teleport
        new TWEEN.Tween(character.position)
            .to(target, 500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                this.gameEngine.removeObject(particles.id);
                this.characterController.updateCameraPosition();
            })
            .start();
    }

    castElementalPulse(target) {
        const skill = this.allSkills.elementalPulse;
        const radius = 5 + (skill.level * 2);
        
        // Create pulse effect
        const pulseGeometry = new THREE.RingGeometry(0.1, radius, 32);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulse.position.copy(target);
        pulse.rotation.x = -Math.PI / 2;
        
        this.gameEngine.addObject(pulse);
        
        // Animate pulse effect
        new TWEEN.Tween({ scale: 0.1, opacity: 0.5 })
            .to({ scale: 1, opacity: 0 }, 1000)
            .onUpdate((props) => {
                pulse.scale.set(props.scale, props.scale, 1);
                pulseMaterial.opacity = props.opacity;
            })
            .onComplete(() => {
                this.gameEngine.removeObject(pulse.id);
            })
            .start();
    }
}
