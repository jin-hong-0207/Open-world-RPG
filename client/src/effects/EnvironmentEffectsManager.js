import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';

export default class EnvironmentEffectsManager {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.effects = new Map();
        this.clock = new THREE.Clock();
        
        // Environment states
        this.timeOfDay = 12; // 24-hour format
        this.weather = 'clear';
        this.season = 'summer';
        
        this.initializeEnvironment();
    }

    initializeEnvironment() {
        // Initialize sky
        this.initializeSky();
        
        // Initialize water
        this.initializeWater();
        
        // Initialize weather systems
        this.initializeWeatherSystems();
        
        // Initialize ambient particles
        this.initializeAmbientParticles();
    }

    initializeSky() {
        this.sky = new Sky();
        this.sky.scale.setScalar(450000);
        this.scene.add(this.sky);

        this.sun = new THREE.Vector3();
        
        this.skyUniforms = this.sky.material.uniforms;
        this.skyUniforms['turbidity'].value = 10;
        this.skyUniforms['rayleigh'].value = 2;
        this.skyUniforms['mieCoefficient'].value = 0.005;
        this.skyUniforms['mieDirectionalG'].value = 0.8;
    }

    initializeWater() {
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined
        });
        this.water.rotation.x = -Math.PI / 2;
        this.scene.add(this.water);
    }

    initializeWeatherSystems() {
        // Rain system
        this.rainSystem = this.createParticleSystem({
            count: 15000,
            size: 0.1,
            velocity: new THREE.Vector3(0, -10, 0),
            lifetime: 1,
            color: 0xaaaaaa,
            opacity: 0.6,
            texture: 'textures/rain.png'
        });

        // Snow system
        this.snowSystem = this.createParticleSystem({
            count: 10000,
            size: 0.2,
            velocity: new THREE.Vector3(0, -2, 0),
            lifetime: 5,
            color: 0xffffff,
            opacity: 0.8,
            texture: 'textures/snowflake.png'
        });

        // Fog system
        this.fog = new THREE.FogExp2(0xcccccc, 0.002);
    }

    createParticleSystem({ count, size, velocity, lifetime, color, opacity, texture }) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const lifetimes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = Math.random() * 1000 - 500;
            positions[i3 + 1] = Math.random() * 500;
            positions[i3 + 2] = Math.random() * 1000 - 500;

            velocities[i3] = velocity.x + (Math.random() - 0.5) * 0.1;
            velocities[i3 + 1] = velocity.y + (Math.random() - 0.5) * 0.1;
            velocities[i3 + 2] = velocity.z + (Math.random() - 0.5) * 0.1;

            lifetimes[i] = Math.random() * lifetime;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

        const material = new THREE.PointsMaterial({
            size: size,
            color: color,
            opacity: opacity,
            transparent: true,
            map: new THREE.TextureLoader().load(texture),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        return new THREE.Points(geometry, material);
    }

    initializeAmbientParticles() {
        // Dust particles
        this.dustSystem = this.createParticleSystem({
            count: 5000,
            size: 0.05,
            velocity: new THREE.Vector3(0, 0.1, 0),
            lifetime: 10,
            color: 0xffffcc,
            opacity: 0.3,
            texture: 'textures/dust.png'
        });

        // Fireflies (evening/night only)
        this.fireflySystem = this.createParticleSystem({
            count: 200,
            size: 0.2,
            velocity: new THREE.Vector3(0, 0, 0),
            lifetime: 4,
            color: 0xffff00,
            opacity: 0.8,
            texture: 'textures/glow.png'
        });
    }

    updateSky() {
        const phi = THREE.MathUtils.degToRad(90 - this.timeOfDay * 7.5);
        const theta = THREE.MathUtils.degToRad(0);

        this.sun.setFromSphericalCoords(1, phi, theta);
        this.skyUniforms['sunPosition'].value.copy(this.sun);
        this.water.material.uniforms['sunDirection'].value.copy(this.sun).normalize();
    }

    updateWeather(delta) {
        switch (this.weather) {
            case 'rain':
                this.updateParticleSystem(this.rainSystem, delta);
                this.scene.fog = this.fog;
                this.fog.density = 0.003;
                break;
            case 'snow':
                this.updateParticleSystem(this.snowSystem, delta);
                this.scene.fog = this.fog;
                this.fog.density = 0.002;
                break;
            case 'foggy':
                this.scene.fog = this.fog;
                this.fog.density = 0.005;
                break;
            default:
                this.scene.fog = null;
                break;
        }
    }

    updateParticleSystem(system, delta) {
        const positions = system.geometry.attributes.position.array;
        const velocities = system.geometry.attributes.velocity.array;
        const lifetimes = system.geometry.attributes.lifetime.array;

        for (let i = 0; i < positions.length; i += 3) {
            // Update position
            positions[i] += velocities[i] * delta;
            positions[i + 1] += velocities[i + 1] * delta;
            positions[i + 2] += velocities[i + 2] * delta;

            // Update lifetime
            const idx = i / 3;
            lifetimes[idx] -= delta;

            // Reset particle if lifetime expired
            if (lifetimes[idx] <= 0) {
                positions[i] = Math.random() * 1000 - 500;
                positions[i + 1] = 500;
                positions[i + 2] = Math.random() * 1000 - 500;
                lifetimes[idx] = Math.random() * system.material.lifetime;
            }
        }

        system.geometry.attributes.position.needsUpdate = true;
        system.geometry.attributes.lifetime.needsUpdate = true;
    }

    updateAmbientParticles(delta) {
        // Update dust particles
        this.updateParticleSystem(this.dustSystem, delta);

        // Update fireflies (only visible during evening/night)
        if (this.timeOfDay < 6 || this.timeOfDay > 18) {
            this.updateFireflies(delta);
        }
    }

    updateFireflies(delta) {
        const positions = this.fireflySystem.geometry.attributes.position.array;
        const lifetimes = this.fireflySystem.geometry.attributes.lifetime.array;

        for (let i = 0; i < positions.length; i += 3) {
            // Random movement
            positions[i] += (Math.random() - 0.5) * delta;
            positions[i + 1] += (Math.random() - 0.5) * delta;
            positions[i + 2] += (Math.random() - 0.5) * delta;

            // Pulsing glow
            const idx = i / 3;
            lifetimes[idx] -= delta;
            this.fireflySystem.material.opacity = 0.5 + Math.sin(lifetimes[idx] * 2) * 0.3;

            // Reset firefly if lifetime expired
            if (lifetimes[idx] <= 0) {
                positions[i] = Math.random() * 200 - 100;
                positions[i + 1] = Math.random() * 50 + 10;
                positions[i + 2] = Math.random() * 200 - 100;
                lifetimes[idx] = Math.random() * 4;
            }
        }

        this.fireflySystem.geometry.attributes.position.needsUpdate = true;
        this.fireflySystem.geometry.attributes.lifetime.needsUpdate = true;
    }

    setTimeOfDay(hour) {
        this.timeOfDay = hour;
        this.updateSky();
    }

    setWeather(weather) {
        this.weather = weather;
    }

    setSeason(season) {
        this.season = season;
        // Update environment based on season
        switch (season) {
            case 'summer':
                this.skyUniforms['turbidity'].value = 10;
                this.water.material.uniforms.waterColor.value.setHex(0x001e0f);
                break;
            case 'autumn':
                this.skyUniforms['turbidity'].value = 15;
                this.water.material.uniforms.waterColor.value.setHex(0x003366);
                break;
            case 'winter':
                this.skyUniforms['turbidity'].value = 20;
                this.water.material.uniforms.waterColor.value.setHex(0x0a5f5f);
                break;
            case 'spring':
                this.skyUniforms['turbidity'].value = 12;
                this.water.material.uniforms.waterColor.value.setHex(0x001e0f);
                break;
        }
    }

    update(delta) {
        // Update environment effects
        this.updateWeather(delta);
        this.updateAmbientParticles(delta);
        
        // Update water animation
        this.water.material.uniforms['time'].value += delta;
    }
}
