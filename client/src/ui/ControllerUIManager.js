import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import TWEEN from '@tweenjs/tween.js';

export default class ControllerUIManager {
    constructor(gameEngine, gamepadManager) {
        this.gameEngine = gameEngine;
        this.gamepadManager = gamepadManager;
        this.prompts = new Map();
        this.activeReticle = null;
        this.tutorialActive = false;
        this.controllerType = 'xbox'; // Default to xbox
        
        // Load button icons
        this.buttonIcons = {
            xbox: {
                A: '/assets/ui/controller/xbox/a.png',
                B: '/assets/ui/controller/xbox/b.png',
                X: '/assets/ui/controller/xbox/x.png',
                Y: '/assets/ui/controller/xbox/y.png',
                LB: '/assets/ui/controller/xbox/lb.png',
                RB: '/assets/ui/controller/xbox/rb.png',
                LT: '/assets/ui/controller/xbox/lt.png',
                RT: '/assets/ui/controller/xbox/rt.png',
                START: '/assets/ui/controller/xbox/start.png',
                SELECT: '/assets/ui/controller/xbox/select.png'
            },
            playstation: {
                X: '/assets/ui/controller/ps/x.png',
                CIRCLE: '/assets/ui/controller/ps/circle.png',
                SQUARE: '/assets/ui/controller/ps/square.png',
                TRIANGLE: '/assets/ui/controller/ps/triangle.png',
                L1: '/assets/ui/controller/ps/l1.png',
                R1: '/assets/ui/controller/ps/r1.png',
                L2: '/assets/ui/controller/ps/l2.png',
                R2: '/assets/ui/controller/ps/r2.png',
                OPTIONS: '/assets/ui/controller/ps/options.png',
                SHARE: '/assets/ui/controller/ps/share.png'
            }
        };

        this.setupEventListeners();
        this.createReticle();
        this.initializeTutorial();
    }

    setupEventListeners() {
        // Listen for controller connection/disconnection
        window.addEventListener('controllerConnected', (e) => {
            this.detectControllerType(e.detail.id);
            this.updateAllPrompts();
        });

        // Listen for input method changes
        this.gamepadManager.on('inputMethodChanged', (method) => {
            this.updateInputMethod(method);
        });

        // Listen for tutorial triggers
        window.addEventListener('showTutorial', () => {
            this.showTutorial();
        });
    }

    detectControllerType(controllerId) {
        const id = controllerId.toLowerCase();
        if (id.includes('xbox') || id.includes('xinput')) {
            this.controllerType = 'xbox';
        } else if (id.includes('playstation') || id.includes('dualshock') || id.includes('dualsense')) {
            this.controllerType = 'playstation';
        }
        this.updateAllPrompts();
    }

    createPrompt(object, action, button) {
        // Create container
        const promptContainer = document.createElement('div');
        promptContainer.className = 'controller-prompt';
        
        // Create icon
        const icon = document.createElement('img');
        icon.src = this.getButtonIcon(button);
        icon.className = 'button-icon';
        promptContainer.appendChild(icon);
        
        // Create label
        const label = document.createElement('span');
        label.textContent = action;
        label.className = 'prompt-label';
        promptContainer.appendChild(label);
        
        // Create 2D object
        const prompt = new CSS2DObject(promptContainer);
        prompt.position.copy(object.position);
        prompt.position.y += object.geometry.parameters.height / 2 + 0.5;
        
        // Add to scene and store reference
        this.gameEngine.scene.add(prompt);
        this.prompts.set(object.uuid, {
            element: prompt,
            action: action,
            button: button
        });
        
        // Add hover animation
        this.addPromptAnimation(prompt);
    }

    addPromptAnimation(prompt) {
        const initialY = prompt.position.y;
        
        new TWEEN.Tween({ y: initialY })
            .to({ y: initialY + 0.2 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .onUpdate((coords) => {
                prompt.position.y = coords.y;
            })
            .start();
    }

    createReticle() {
        // Create reticle container
        const reticleContainer = document.createElement('div');
        reticleContainer.className = 'aim-reticle';
        
        // Create reticle elements
        const center = document.createElement('div');
        center.className = 'reticle-center';
        
        const top = document.createElement('div');
        top.className = 'reticle-line top';
        
        const right = document.createElement('div');
        right.className = 'reticle-line right';
        
        const bottom = document.createElement('div');
        bottom.className = 'reticle-line bottom';
        
        const left = document.createElement('div');
        left.className = 'reticle-line left';
        
        reticleContainer.append(center, top, right, bottom, left);
        
        // Create 2D object
        this.activeReticle = new CSS2DObject(reticleContainer);
        this.activeReticle.visible = false;
        this.gameEngine.scene.add(this.activeReticle);
    }

    showReticle(position) {
        if (!this.activeReticle) return;
        
        this.activeReticle.position.copy(position);
        this.activeReticle.visible = true;
        
        // Add subtle animation
        const scale = { value: 1 };
        new TWEEN.Tween(scale)
            .to({ value: 1.2 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .yoyo(true)
            .onUpdate(() => {
                this.activeReticle.scale.set(scale.value, scale.value, scale.value);
            })
            .start();
    }

    hideReticle() {
        if (this.activeReticle) {
            this.activeReticle.visible = false;
        }
    }

    initializeTutorial() {
        // Create tutorial overlay
        const tutorialOverlay = document.createElement('div');
        tutorialOverlay.className = 'tutorial-overlay hidden';
        
        // Add tutorial content
        tutorialOverlay.innerHTML = `
            <div class="tutorial-content">
                <h2>Controller Tutorial</h2>
                <div class="control-section">
                    <h3>Basic Controls</h3>
                    <div class="control-item">
                        <img src="${this.getStickIcon('left')}" alt="Left Stick">
                        <span>Move Character</span>
                    </div>
                    <div class="control-item">
                        <img src="${this.getStickIcon('right')}" alt="Right Stick">
                        <span>Control Camera</span>
                    </div>
                </div>
                <div class="control-section">
                    <h3>Actions</h3>
                    <div class="control-item">
                        <img src="${this.getButtonIcon('A')}" alt="A Button">
                        <span>Interact</span>
                    </div>
                    <div class="control-item">
                        <img src="${this.getButtonIcon('B')}" alt="B Button">
                        <span>Jump/Crouch</span>
                    </div>
                    <div class="control-item">
                        <img src="${this.getButtonIcon('X')}" alt="X Button">
                        <span>Primary Skill</span>
                    </div>
                    <div class="control-item">
                        <img src="${this.getButtonIcon('Y')}" alt="Y Button">
                        <span>Secondary Skill</span>
                    </div>
                </div>
            </div>
            <button class="tutorial-close">Got it!</button>
        `;
        
        document.body.appendChild(tutorialOverlay);
        
        // Add close button listener
        tutorialOverlay.querySelector('.tutorial-close').addEventListener('click', () => {
            this.hideTutorial();
        });
        
        this.tutorialElement = tutorialOverlay;
    }

    showTutorial() {
        if (this.tutorialElement && !this.tutorialActive) {
            this.tutorialElement.classList.remove('hidden');
            this.tutorialActive = true;
            
            // Add fade-in animation
            this.tutorialElement.style.opacity = '0';
            requestAnimationFrame(() => {
                this.tutorialElement.style.opacity = '1';
            });
        }
    }

    hideTutorial() {
        if (this.tutorialElement && this.tutorialActive) {
            // Add fade-out animation
            this.tutorialElement.style.opacity = '0';
            setTimeout(() => {
                this.tutorialElement.classList.add('hidden');
                this.tutorialActive = false;
            }, 300);
        }
    }

    getButtonIcon(button) {
        return this.buttonIcons[this.controllerType][button] || 
               this.buttonIcons.xbox[button]; // Fallback to Xbox icons
    }

    getStickIcon(stick) {
        return `/assets/ui/controller/${this.controllerType}/${stick}_stick.png`;
    }

    updateAllPrompts() {
        this.prompts.forEach((prompt, objectId) => {
            const icon = prompt.element.element.querySelector('.button-icon');
            if (icon) {
                icon.src = this.getButtonIcon(prompt.button);
            }
        });
    }

    updateInputMethod(method) {
        document.body.classList.toggle('using-controller', method === 'gamepad');
        this.updateAllPrompts();
    }

    removePrompt(objectId) {
        const prompt = this.prompts.get(objectId);
        if (prompt) {
            this.gameEngine.scene.remove(prompt.element);
            this.prompts.delete(objectId);
        }
    }

    update() {
        // Update prompt positions based on camera
        this.prompts.forEach((prompt) => {
            const distance = this.gameEngine.camera.position.distanceTo(prompt.element.position);
            const scale = Math.max(0.5, Math.min(1, 1 - (distance - 5) / 10));
            prompt.element.scale.set(scale, scale, scale);
        });

        // Update reticle if visible
        if (this.activeReticle && this.activeReticle.visible) {
            // Update reticle position based on aim direction
            const aimTarget = this.gameEngine.getAimTarget();
            if (aimTarget) {
                this.activeReticle.position.copy(aimTarget);
            }
        }
    }
}
