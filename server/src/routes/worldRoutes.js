const express = require('express');
const router = express.Router();
const WorldController = require('../controllers/worldController');

const worldController = new WorldController();

// Get world state
router.get('/world/state', (req, res) => {
    const state = worldController.getWorldState();
    res.json(state);
});

// Get world configuration
router.get('/world/config', (req, res) => {
    const config = worldController.getWorldConfig();
    res.json(config);
});

// Get biome information
router.get('/world/biome', (req, res) => {
    const { x, y } = req.query;
    if (!x || !y) {
        return res.status(400).json({ error: 'Position coordinates required' });
    }

    const biome = worldController.getBiomeAt({ x: parseFloat(x), y: parseFloat(y) });
    if (!biome) {
        return res.status(404).json({ error: 'No biome found at specified position' });
    }

    res.json(biome);
});

// Get current weather
router.get('/world/weather', (req, res) => {
    const weather = worldController.getCurrentWeather();
    res.json(weather);
});

// Get current time info
router.get('/world/time', (req, res) => {
    const timeInfo = worldController.getTimeInfo();
    res.json(timeInfo);
});

// Add interactive object
router.post('/world/objects', (req, res) => {
    const { type, position } = req.body;
    if (!type || !position) {
        return res.status(400).json({ error: 'Type and position required' });
    }

    const object = worldController.addInteractiveObject(type, position);
    if (!object) {
        return res.status(400).json({ error: 'Invalid object type' });
    }

    res.json(object);
});

// Interact with object
router.post('/world/objects/:objectId/interact', (req, res) => {
    const { interaction, data } = req.body;
    if (!interaction) {
        return res.status(400).json({ error: 'Interaction type required' });
    }

    const result = worldController.interactWithObject(req.params.objectId, interaction, data);
    if (!result) {
        return res.status(400).json({ error: 'Invalid interaction' });
    }

    res.json(result);
});

// Spawn collectible
router.post('/world/collectibles', (req, res) => {
    const { type, subtype, position } = req.body;
    if (!type || !subtype || !position) {
        return res.status(400).json({ error: 'Type, subtype, and position required' });
    }

    const collectible = worldController.spawnCollectible(type, subtype, position);
    if (!collectible) {
        return res.status(400).json({ error: 'Invalid collectible type' });
    }

    res.json(collectible);
});

// Collect item
router.post('/world/collectibles/:collectibleId/collect', (req, res) => {
    const { playerId } = req.body;
    if (!playerId) {
        return res.status(400).json({ error: 'Player ID required' });
    }

    const result = worldController.collectItem(req.params.collectibleId, playerId);
    if (!result) {
        return res.status(400).json({ error: 'Item not found or already collected' });
    }

    res.json(result);
});

module.exports = router;
