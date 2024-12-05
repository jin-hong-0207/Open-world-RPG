import { WorldManager } from './world/WorldManager.js';

// Initialize PlayCanvas
const canvas = document.getElementById('application-canvas');
const app = new pc.Application(canvas);

// Set canvas to fill window
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// Ensure canvas is resized when window changes size
window.addEventListener('resize', () => app.resizeCanvas());

// Create camera entity
const camera = new pc.Entity('camera');
camera.addComponent('camera', {
    clearColor: new pc.Color(0.1, 0.1, 0.1)
});
camera.addComponent('script');
app.root.addChild(camera);

// Position camera
camera.setPosition(0, 100, 100);
camera.lookAt(0, 0, 0);

// Initialize world
const worldManager = new WorldManager(app);
worldManager.initialize();

// Start the application
app.start();

// Hide loading screen once everything is loaded
const loadingScreen = document.getElementById('loading-screen');
loadingScreen.style.display = 'none';
