import { WorldManager } from './world/WorldManager.js';

// Wait for DOM and PlayCanvas to be ready
window.addEventListener('load', async () => {
    const canvas = document.getElementById('application-canvas');
    const loadingScreen = document.getElementById('loading-screen');
    const errorMessage = document.getElementById('error-message');

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    try {
        // Hide error message initially
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        
        // Show loading screen
        if (loadingScreen) {
            loadingScreen.style.display = 'block';
            loadingScreen.textContent = 'Initializing game engine...';
        }

        // Create the PlayCanvas application
        const app = new pc.Application(canvas);
        
        // Initialize input devices
        app.keyboard = new pc.Keyboard(window);
        app.mouse = new pc.Mouse(canvas);
        app.touch = new pc.TouchDevice(canvas);

        // Configure app settings
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);

        // Create camera entity
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1),
            farClip: 1000
        });
        
        // Position camera for isometric view
        camera.setPosition(50, 50, 50);
        camera.setEulerAngles(-30, 45, 0);
        app.root.addChild(camera);

        // Create light entity
        const light = new pc.Entity('light');
        light.addComponent('light', {
            type: 'directional',
            color: new pc.Color(1, 1, 1),
            castShadows: true,
            shadowDistance: 100,
            intensity: 2
        });
        light.setEulerAngles(45, 30, 0);
        app.root.addChild(light);

        // Add ambient light
        const ambient = new pc.Entity('ambient');
        ambient.addComponent('light', {
            type: 'ambient',
            color: new pc.Color(0.2, 0.2, 0.2),
            intensity: 1
        });
        app.root.addChild(ambient);

        if (loadingScreen) {
            loadingScreen.textContent = 'Initializing world...';
        }

        // Initialize world manager
        const worldManager = new WorldManager(app);
        
        // Start the application before initializing the world
        app.start();
        
        // Now initialize the world
        await worldManager.initialize();

        // Handle window resize
        window.addEventListener('resize', () => {
            app.resizeCanvas();
        });

        // Hide loading screen
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

    } catch (error) {
        console.error('Failed to initialize game:', error);
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Failed to initialize game. Please refresh the page. Error: ' + error.message;
        }
    }
});
