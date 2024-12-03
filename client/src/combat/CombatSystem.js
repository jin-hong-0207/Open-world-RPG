export class CombatSystem {
    constructor(app) {
        this.app = app;
        this.activeSkills = new Map();
        this.cooldowns = new Map();
        
        // Bind methods
        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        
        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Mouse click for movement and basic attacks
        this.app.mouse.on('mousedown', this.handleMouseClick);
        
        // Keyboard for skills
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleMouseClick(event) {
        if (event.button === 0) { // Left click
            const ray = this.createMouseRay(event);
            const hit = this.raycastGround(ray);
            
            if (hit) {
                if (this.isTargetEnemy(hit)) {
                    this.performBasicAttack(hit.entity);
                } else {
                    this.moveCharacter(hit.point);
                }
            }
        }
    }

    handleKeyPress(event) {
        const skillKeys = {
            'Q': 0,
            'W': 1,
            'E': 2,
            'R': 3,
            'T': 4,
            'F': 5
        };

        const key = event.key.toUpperCase();
        if (skillKeys.hasOwnProperty(key)) {
            this.activateSkill(skillKeys[key]);
        }
    }

    createMouseRay(event) {
        // Convert screen coordinates to world ray
        const camera = this.app.root.findByName('camera');
        const screenPoint = new pc.Vec3(event.x, event.y, 1);
        return camera.camera.screenToWorld(screenPoint.x, screenPoint.y, camera.camera.farClip);
    }

    raycastGround(ray) {
        // Implement ground plane intersection
        return this.app.systems.rigidbody.raycastFirst(ray.origin, ray.direction);
    }

    moveCharacter(position) {
        // Implement character movement
        const character = this.app.root.findByName('player');
        if (character) {
            character.script.movement.setTargetPosition(position);
        }
    }

    performBasicAttack(target) {
        const character = this.app.root.findByName('player');
        if (character && character.script.combat) {
            character.script.combat.basicAttack(target);
        }
    }

    activateSkill(skillIndex) {
        const character = this.app.root.findByName('player');
        if (!character || !character.script.combat) return;

        const weapon = character.script.combat.getCurrentWeapon();
        if (!weapon) return;

        const skill = this.getSkillByIndex(weapon, skillIndex);
        if (!skill) return;

        if (this.isSkillOnCooldown(skill.name)) {
            console.log(`${skill.name} is on cooldown!`);
            return;
        }

        this.executeSkill(skill);
        this.startCooldown(skill);
    }

    getSkillByIndex(weapon, index) {
        const skills = Object.values(weapon.skills);
        return skills[index];
    }

    isSkillOnCooldown(skillName) {
        return this.cooldowns.has(skillName) && 
               Date.now() < this.cooldowns.get(skillName);
    }

    executeSkill(skill) {
        const character = this.app.root.findByName('player');
        if (character && character.script.combat) {
            character.script.combat.useSkill(skill);
        }
    }

    startCooldown(skill) {
        this.cooldowns.set(skill.name, Date.now() + (skill.cooldown * 1000));
    }

    update(dt) {
        // Update active skills and effects
        this.updateActiveSkills(dt);
        this.updateCooldowns();
    }

    updateActiveSkills(dt) {
        this.activeSkills.forEach((skill, id) => {
            skill.duration -= dt;
            if (skill.duration <= 0) {
                this.activeSkills.delete(id);
            }
        });
    }

    updateCooldowns() {
        const now = Date.now();
        for (const [skill, endTime] of this.cooldowns.entries()) {
            if (now >= endTime) {
                this.cooldowns.delete(skill);
            }
        }
    }
}
