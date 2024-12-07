# Open World RPG

A multiplayer open-world RPG game with real-time combat, character progression, and interactive environments, built with PlayCanvas and modern web technologies.

## 🎮 Game Overview
An immersive 3D RPG experience running in web browsers, featuring:
- Multiplayer open-world exploration
- Real-time combat system
- Character progression and skill trees
- Dynamic environment with day/night cycle
- Quest system with NPCs

## 🚀 Features

### World Exploration
- Multiple diverse regions (forests, towns, caves)
- Hidden treasures and secret areas
- Interactive NPCs and quest system
- Dynamic environment with day-night cycle

### Combat System
- Real-time combat mechanics
- Three weapon types:
  - Swords (melee combat)
  - Magical Bows (ranged combat)
  - Wands (spell casting)
- Skill-based character progression
- Cooperative and competitive multiplayer

### Character System
- 20-30 unique playable characters
- Individual ability sets and skill trees
- Character progression and leveling
- Customizable loadouts

## 🛠️ Technical Stack
- **Game Engine:** PlayCanvas
- **Frontend:** HTML5, JavaScript, WebGL
- **Backend:** Node.js, Express
- **Multiplayer:** Socket.IO
- **3D Assets:** Blender

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser with WebGL support

### Installation
1. Clone the repository:
```bash
git clone https://github.com/jin-hong-0207/Open-world-RPG.git
cd Open-world-RPG
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 🤝 Contributing
We welcome contributions! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 Game Controls
- Movement: Mouse click or WASD keys
- Combat: Q, W, E, R, T, F keys for abilities
- Interaction: E key
- Camera: Right mouse button + drag

## 🔄 Development Status
Currently in active development. See [Projects](https://github.com/jin-hong-0207/Open-world-RPG/projects) tab for current progress.

## 📅 Development Updates

### Day 1
- Set up world configuration system
- Working on client-side configuration settings
- Repository connected to GitHub for version control

### Day 2
- Implemented core game systems (inventory, crafting, and loot systems)
- Added GitHub Actions workflow for automated testing
- Restructured test files and added network handler tests
- Updated project configuration (package.json, jest config)
- Improved client-side structure with network handling
- Added Vercel deployment configuration

### Day 3
- Implemented puzzle system with server-side logic
- Added puzzle models, controllers, and routes
- Restructured server architecture
- Streamlined client-side code
- Updated Vercel deployment configuration

### Day 4
- Implemented comprehensive gamepad control system with multi-controller support
- Added advanced character animation system with blending and procedural animations
- Integrated dynamic environment effects (weather, day/night cycle, seasons)
- Enhanced visual effects with particle systems and post-processing
- Implemented cinematic camera system with multiple presets and effects
- Added HUD elements (minimap, quest tracker, skill icons)
- Improved UI responsiveness and controller integration

Key Updates:
1. **Controller Integration**
   - Multi-controller support (Xbox, PlayStation, Generic)
   - Customizable button mappings
   - Deadzone handling
   - Keyboard fallback input

2. **Animation System**
   - Advanced character animations with blending
   - Procedural animation support
   - Emotive animations
   - IK system integration

3. **Visual Effects**
   - Dynamic weather system (rain, snow, fog)
   - Day/night cycle
   - Seasonal changes
   - Particle effects (dust, fireflies)
   - Water simulation

4. **Camera System**
   - Multiple camera presets
   - Smooth transitions
   - Cinematic effects
   - Dynamic following and orbiting

5. **UI Enhancements**
   - Interactive minimap
   - Quest tracking system
   - Custom skill icons
   - Controller-adaptive UI
