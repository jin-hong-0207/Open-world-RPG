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
camera.setPosition(0, 10, 15);
camera.lookAt(0, 0, 0);

// Create directional light
const light = new pc.Entity('light');
light.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1, 1, 1),
    castShadows: true,
    shadowDistance: 30,
    shadowResolution: 1024,
    shadowBias: 0.2
});
app.root.addChild(light);
light.setEulerAngles(45, 30, 0);

// Start the application
app.start();

// Hide loading screen once everything is loaded
const loadingScreen = document.getElementById('loading-screen');
loadingScreen.style.display = 'none';
