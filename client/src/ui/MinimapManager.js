export default class MinimapManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.minimapSize = 200;
        this.scale = 20; // World units to minimap pixels
        this.markers = new Map();
        
        this.initializeMinimap();
        this.setupEventListeners();
    }

    initializeMinimap() {
        // Create minimap container
        this.container = document.createElement('div');
        this.container.className = 'minimap-container';
        
        // Create minimap canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.minimapSize;
        this.canvas.height = this.minimapSize;
        this.ctx = this.canvas.getContext('2d');
        
        // Create markers layer
        this.markersContainer = document.createElement('div');
        this.markersContainer.className = 'minimap-markers';
        
        // Create player marker
        this.playerMarker = document.createElement('div');
        this.playerMarker.className = 'minimap-player-marker';
        
        // Create compass
        this.compass = document.createElement('div');
        this.compass.className = 'minimap-compass';
        this.compass.innerHTML = `
            <div class="compass-marker north">N</div>
            <div class="compass-marker east">E</div>
            <div class="compass-marker south">S</div>
            <div class="compass-marker west">W</div>
        `;
        
        // Assemble minimap
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.markersContainer);
        this.container.appendChild(this.playerMarker);
        this.container.appendChild(this.compass);
        document.body.appendChild(this.container);
        
        // Add styles
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .minimap-container {
                position: fixed;
                top: 20px;
                right: 20px;
                width: ${this.minimapSize}px;
                height: ${this.minimapSize}px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.7);
                border: 2px solid rgba(255, 255, 255, 0.3);
                overflow: hidden;
                z-index: 1000;
            }

            .minimap-markers {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .minimap-marker {
                position: absolute;
                width: 8px;
                height: 8px;
                margin: -4px 0 0 -4px;
                border-radius: 50%;
                background: #fff;
                transition: transform 0.2s ease;
            }

            .minimap-marker:hover {
                transform: scale(1.5);
            }

            .minimap-player-marker {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 12px;
                height: 12px;
                margin: -6px 0 0 -6px;
                background: #4ade80;
                border-radius: 50%;
                border: 2px solid #fff;
                transform-origin: center;
                transition: transform 0.1s ease;
            }

            .minimap-compass {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .compass-marker {
                position: absolute;
                color: rgba(255, 255, 255, 0.7);
                font-size: 12px;
                font-weight: bold;
                text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            }

            .compass-marker.north { top: 5px; left: 50%; transform: translateX(-50%); }
            .compass-marker.south { bottom: 5px; left: 50%; transform: translateX(-50%); }
            .compass-marker.east { right: 5px; top: 50%; transform: translateY(-50%); }
            .compass-marker.west { left: 5px; top: 50%; transform: translateY(-50%); }

            .minimap-container::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.4) 100%);
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Listen for player movement
        if (this.player.on) {
            this.player.on('move', () => this.updatePlayerPosition());
        }
        
        // Listen for camera rotation
        window.addEventListener('cameraRotate', (e) => {
            this.updateCompassRotation(e.detail.angle);
        });
    }

    updatePlayerPosition() {
        const x = this.player.position.x;
        const z = this.player.position.z;
        
        // Update player marker rotation
        const angle = Math.atan2(this.player.velocity.z, this.player.velocity.x);
        this.playerMarker.style.transform = `rotate(${angle}rad)`;
        
        // Update minimap center
        this.drawMinimap(x, z);
    }

    drawMinimap(centerX, centerZ) {
        this.ctx.clearRect(0, 0, this.minimapSize, this.minimapSize);
        
        // Draw terrain and obstacles
        this.ctx.fillStyle = '#1f2937';
        this.scene.traverse((object) => {
            if (object.isMesh && object.userData.minimapVisible) {
                const screenX = (object.position.x - centerX) * this.scale + this.minimapSize / 2;
                const screenZ = (object.position.z - centerZ) * this.scale + this.minimapSize / 2;
                
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenZ, 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    addMarker(id, position, type = 'default') {
        const marker = document.createElement('div');
        marker.className = 'minimap-marker';
        marker.classList.add(`marker-type-${type}`);
        
        this.markersContainer.appendChild(marker);
        this.markers.set(id, marker);
        
        this.updateMarkerPosition(id, position);
    }

    updateMarkerPosition(id, position) {
        const marker = this.markers.get(id);
        if (marker) {
            const screenX = (position.x - this.player.position.x) * this.scale + this.minimapSize / 2;
            const screenZ = (position.z - this.player.position.z) * this.scale + this.minimapSize / 2;
            
            marker.style.left = `${screenX}px`;
            marker.style.top = `${screenZ}px`;
        }
    }

    removeMarker(id) {
        const marker = this.markers.get(id);
        if (marker) {
            marker.remove();
            this.markers.delete(id);
        }
    }

    updateCompassRotation(angle) {
        this.compass.style.transform = `rotate(${-angle}rad)`;
    }

    setVisible(visible) {
        this.container.style.display = visible ? 'block' : 'none';
    }

    resize(size) {
        this.minimapSize = size;
        this.canvas.width = size;
        this.canvas.height = size;
        this.container.style.width = `${size}px`;
        this.container.style.height = `${size}px`;
        this.updatePlayerPosition();
    }
}
