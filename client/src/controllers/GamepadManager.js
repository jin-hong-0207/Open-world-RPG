import { EventEmitter } from 'events';

export default class GamepadManager extends EventEmitter {
    constructor() {
        super();
        this.controllers = new Map();
        this.activeController = null;
        this.deadzone = 0.1;
        this.buttonStates = new Map();
        this.vibrationActive = false;
        
        // Default button mappings for different controller types
        this.controllerMappings = {
            xbox: {
                A: 0,
                B: 1,
                X: 2,
                Y: 3,
                LB: 4,
                RB: 5,
                LT: 6,
                RT: 7,
                SELECT: 8,
                START: 9,
                L3: 10,
                R3: 11,
                UP: 12,
                DOWN: 13,
                LEFT: 14,
                RIGHT: 15
            },
            playstation: {
                X: 0,
                CIRCLE: 1,
                SQUARE: 2,
                TRIANGLE: 3,
                L1: 4,
                R1: 5,
                L2: 6,
                R2: 7,
                SHARE: 8,
                OPTIONS: 9,
                L3: 10,
                R3: 11,
                UP: 12,
                DOWN: 13,
                LEFT: 14,
                RIGHT: 15
            },
            generic: {
                ACTION_SOUTH: 0,
                ACTION_EAST: 1,
                ACTION_WEST: 2,
                ACTION_NORTH: 3,
                SHOULDER_LEFT: 4,
                SHOULDER_RIGHT: 5,
                TRIGGER_LEFT: 6,
                TRIGGER_RIGHT: 7,
                SELECT: 8,
                START: 9,
                STICK_LEFT: 10,
                STICK_RIGHT: 11,
                DPAD_UP: 12,
                DPAD_DOWN: 13,
                DPAD_LEFT: 14,
                DPAD_RIGHT: 15
            }
        };

        // User's custom button mappings (loaded from settings)
        this.customMapping = this.loadCustomMapping();
        
        // Current active mapping
        this.activeMapping = { ...this.controllerMappings.xbox };
        
        // Initialize gamepad detection
        this.setupGamepadEvents();
        
        // Keyboard fallback mappings
        this.keyboardMapping = {
            KeyW: 'UP',
            KeyS: 'DOWN',
            KeyA: 'LEFT',
            KeyD: 'RIGHT',
            Space: 'A',
            KeyE: 'B',
            KeyQ: 'X',
            KeyR: 'Y',
            ShiftLeft: 'LB',
            ControlLeft: 'RB',
            Tab: 'SELECT',
            Escape: 'START'
        };
        
        // Setup keyboard listeners
        this.setupKeyboardEvents();
    }

    setupGamepadEvents() {
        window.addEventListener('gamepadconnected', (e) => {
            this.handleGamepadConnected(e.gamepad);
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            this.handleGamepadDisconnected(e.gamepad);
        });
    }

    setupKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            const mappedButton = this.keyboardMapping[e.code];
            if (mappedButton && !this.buttonStates.get(mappedButton)) {
                this.buttonStates.set(mappedButton, true);
                this.emit('gamepadButtonDown', { mapping: mappedButton });
            }
        });

        window.addEventListener('keyup', (e) => {
            const mappedButton = this.keyboardMapping[e.code];
            if (mappedButton) {
                this.buttonStates.set(mappedButton, false);
                this.emit('gamepadButtonUp', { mapping: mappedButton });
            }
        });
    }

    handleGamepadConnected(gamepad) {
        this.controllers.set(gamepad.index, gamepad);
        this.activeController = gamepad;
        
        // Detect controller type and set appropriate mapping
        this.detectControllerType(gamepad);
        
        // Emit connection event
        this.emit('controllerConnected', {
            index: gamepad.index,
            id: gamepad.id
        });
    }

    handleGamepadDisconnected(gamepad) {
        this.controllers.delete(gamepad.index);
        if (this.activeController && this.activeController.index === gamepad.index) {
            this.activeController = this.controllers.size > 0 ? 
                this.controllers.values().next().value : null;
        }
        
        // Emit disconnection event
        this.emit('controllerDisconnected', {
            index: gamepad.index
        });
    }

    detectControllerType(gamepad) {
        const id = gamepad.id.toLowerCase();
        
        if (id.includes('xbox') || id.includes('xinput')) {
            this.activeMapping = { ...this.controllerMappings.xbox };
        } else if (id.includes('playstation') || id.includes('dualshock') || id.includes('dualsense')) {
            this.activeMapping = { ...this.controllerMappings.playstation };
        } else {
            this.activeMapping = { ...this.controllerMappings.generic };
        }

        // Apply any custom mappings
        if (this.customMapping) {
            this.activeMapping = { ...this.activeMapping, ...this.customMapping };
        }
    }

    update() {
        // Get the latest gamepad state
        const gamepads = navigator.getGamepads();
        
        for (const gamepad of gamepads) {
            if (!gamepad) continue;
            
            this.controllers.set(gamepad.index, gamepad);
            
            if (this.activeController && gamepad.index === this.activeController.index) {
                this.processButtons(gamepad);
                this.processAxes(gamepad);
            }
        }
    }

    processButtons(gamepad) {
        gamepad.buttons.forEach((button, index) => {
            const mappedButton = this.getMappedButton(index);
            const wasPressed = this.buttonStates.get(mappedButton);
            const isPressed = button.pressed || button.value > 0.5;

            if (isPressed !== wasPressed) {
                this.buttonStates.set(mappedButton, isPressed);
                this.emit(isPressed ? 'gamepadButtonDown' : 'gamepadButtonUp', {
                    mapping: mappedButton,
                    value: button.value
                });
            }
        });
    }

    processAxes(gamepad) {
        // Process left stick
        const leftX = this.applyDeadzone(gamepad.axes[0]);
        const leftY = this.applyDeadzone(gamepad.axes[1]);
        
        // Process right stick
        const rightX = this.applyDeadzone(gamepad.axes[2]);
        const rightY = this.applyDeadzone(gamepad.axes[3]);

        if (leftX !== 0 || leftY !== 0) {
            this.emit('leftStickMove', { x: leftX, y: leftY });
        }

        if (rightX !== 0 || rightY !== 0) {
            this.emit('rightStickMove', { x: rightX, y: rightY });
        }
    }

    getMappedButton(index) {
        // Find the button name from the active mapping
        return Object.entries(this.activeMapping)
            .find(([_, value]) => value === index)?.[0] || `BUTTON${index}`;
    }

    applyDeadzone(value) {
        return Math.abs(value) < this.deadzone ? 0 : value;
    }

    isButtonPressed(button) {
        return this.buttonStates.get(button) || false;
    }

    getMovementVector() {
        if (!this.activeController) {
            // Keyboard fallback
            const up = this.isButtonPressed('UP');
            const down = this.isButtonPressed('DOWN');
            const left = this.isButtonPressed('LEFT');
            const right = this.isButtonPressed('RIGHT');
            
            return {
                x: (right ? 1 : 0) - (left ? 1 : 0),
                y: (down ? 1 : 0) - (up ? 1 : 0)
            };
        }

        return {
            x: this.applyDeadzone(this.activeController.axes[0]),
            y: this.applyDeadzone(this.activeController.axes[1])
        };
    }

    getCameraVector() {
        if (!this.activeController) {
            // No keyboard fallback for camera control
            return { x: 0, y: 0 };
        }

        return {
            x: this.applyDeadzone(this.activeController.axes[2]),
            y: this.applyDeadzone(this.activeController.axes[3])
        };
    }

    vibrate(duration = 200, weakMagnitude = 0.5, strongMagnitude = 0.5) {
        if (!this.activeController || !this.activeController.vibrationActuator) return;
        
        this.activeController.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: duration,
            weakMagnitude: weakMagnitude,
            strongMagnitude: strongMagnitude
        });
    }

    loadCustomMapping() {
        try {
            const savedMapping = localStorage.getItem('gamepadMapping');
            return savedMapping ? JSON.parse(savedMapping) : null;
        } catch (error) {
            console.error('Error loading custom gamepad mapping:', error);
            return null;
        }
    }

    saveCustomMapping(mapping) {
        try {
            localStorage.setItem('gamepadMapping', JSON.stringify(mapping));
            this.customMapping = mapping;
            
            // Update active mapping with custom changes
            this.activeMapping = {
                ...this.activeMapping,
                ...this.customMapping
            };
            
            // Emit mapping updated event
            this.emit('mappingUpdated', this.activeMapping);
        } catch (error) {
            console.error('Error saving custom gamepad mapping:', error);
        }
    }

    resetMapping() {
        localStorage.removeItem('gamepadMapping');
        this.customMapping = null;
        
        // Reset to default mapping based on controller type
        if (this.activeController) {
            this.detectControllerType(this.activeController);
        }
        
        // Emit mapping updated event
        this.emit('mappingUpdated', this.activeMapping);
    }
}
