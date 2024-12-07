import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

export default class GameEngine {
    constructor(container) {
        this.container = container;
        this.objects = new Map();
        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game-canvas'),
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
        
        // Add fog for atmosphere
        this.scene.fog = new THREE.Fog(0x87ceeb, 20, 100);

        // Add ground
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x33aa33,
            roughness: 0.8,
            metalness: 0.2
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
    }

    setupLights() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);

        // Directional light (sun)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.position.set(50, 50, 50);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 500;
        this.scene.add(this.sunLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addObject(object) {
        this.objects.set(object.id, object);
        this.scene.add(object);
    }

    removeObject(objectId) {
        const object = this.objects.get(objectId);
        if (object) {
            this.scene.remove(object);
            this.objects.delete(objectId);
        }
    }

    updateDayNightCycle(timeOfDay) {
        // Time of day is between 0 (midnight) and 1 (next midnight)
        const sunRotation = timeOfDay * Math.PI * 2;
        const sunHeight = Math.sin(sunRotation);
        const sunDistance = 50;

        this.sunLight.position.x = Math.cos(sunRotation) * sunDistance;
        this.sunLight.position.y = sunHeight * sunDistance;
        this.sunLight.position.z = Math.sin(sunRotation) * sunDistance;

        // Update ambient light based on time of day
        const ambientIntensity = Math.max(0.1, (sunHeight + 1) / 2);
        this.ambientLight.intensity = ambientIntensity;

        // Update sky color
        const skyHue = 210; // Blue
        const skySaturation = 80;
        const skyLightness = Math.max(20, 60 * ambientIntensity);
        this.scene.background.setHSL(skyHue / 360, skySaturation / 100, skyLightness / 100);

        // Update fog
        this.scene.fog.color.copy(this.scene.background);
    }

    updateWeather(weatherType) {
        switch (weatherType) {
            case 'clear':
                this.scene.fog.near = 20;
                this.scene.fog.far = 100;
                break;
            case 'fog':
                this.scene.fog.near = 5;
                this.scene.fog.far = 30;
                break;
            case 'rain':
                // Add rain particle system here
                break;
            case 'cloudy':
                this.scene.fog.near = 10;
                this.scene.fog.far = 50;
                break;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        TWEEN.update();
        this.controls.update();
        
        // Update all game objects
        this.objects.forEach(object => {
            if (object.update) {
                object.update();
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}
