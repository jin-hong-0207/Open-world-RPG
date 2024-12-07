const express = require('express');
const router = express.Router();
const CharacterController = require('../controllers/characterController');
const { skillConfigs } = require('../config/skillConfigs');
const visualConfigs = require('../config/visualConfigs');

const characterController = new CharacterController();

// Create new character
router.post('/characters', (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
    }

    const character = characterController.createCharacter(name, type);
    res.json(character.getStatus());
});

// Get character status
router.get('/characters/:characterId', (req, res) => {
    const status = characterController.getCharacterStatus(req.params.characterId);
    if (!status) {
        return res.status(404).json({ error: 'Character not found' });
    }
    res.json(status);
});

// Add experience to character
router.post('/characters/:characterId/experience', (req, res) => {
    const { experience } = req.body;
    const result = characterController.addExperience(req.params.characterId, experience);
    if (!result.success) {
        return res.status(404).json(result);
    }
    res.json(result);
});

// Unlock new skill
router.post('/characters/:characterId/skills', (req, res) => {
    const { skillKey } = req.body;
    const skillConfig = skillConfigs[skillKey];
    
    if (!skillConfig) {
        return res.status(400).json({ error: 'Invalid skill' });
    }

    const result = characterController.unlockSkill(req.params.characterId, skillConfig);
    if (!result.success) {
        return res.status(400).json(result);
    }
    res.json(result);
});

// Use skill
router.post('/characters/:characterId/skills/:skillId/use', (req, res) => {
    const { target } = req.body;
    const result = characterController.useSkill(
        req.params.characterId,
        req.params.skillId,
        target
    );
    if (!result.success) {
        return res.status(400).json(result);
    }
    res.json(result);
});

// Level up skill
router.post('/characters/:characterId/skills/:skillId/levelup', (req, res) => {
    const result = characterController.levelUpSkill(
        req.params.characterId,
        req.params.skillId
    );
    if (!result.success) {
        return res.status(400).json(result);
    }
    res.json(result);
});

// Update character position and rotation
router.put('/characters/:characterId/transform', (req, res) => {
    const { position, rotation } = req.body;
    const character = characterController.getCharacter(req.params.characterId);
    
    if (!character) {
        return res.status(404).json({ error: 'Character not found' });
    }

    character.updateTransform(position, rotation);
    res.json({ success: true, position: character.position, rotation: character.rotation });
});

// Update character animation
router.put('/characters/:characterId/animation', (req, res) => {
    const { animation } = req.body;
    const character = characterController.getCharacter(req.params.characterId);
    
    if (!character) {
        return res.status(404).json({ error: 'Character not found' });
    }

    const success = character.setAnimation(animation);
    if (!success) {
        return res.status(400).json({ error: 'Invalid animation' });
    }

    res.json({ success: true, currentAnimation: character.currentAnimation });
});

// Get character visual effects for a skill
router.get('/characters/:characterId/skills/:skillId/effects', (req, res) => {
    const character = characterController.getCharacter(req.params.characterId);
    
    if (!character) {
        return res.status(404).json({ error: 'Character not found' });
    }

    const effects = character.getSkillVisualEffects(req.params.skillId);
    if (!effects) {
        return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(effects);
});

// Get available visual configurations
router.get('/visual-configs', (req, res) => {
    res.json(visualConfigs);
});

// Delete character
router.delete('/characters/:characterId', (req, res) => {
    const success = characterController.deleteCharacter(req.params.characterId);
    if (!success) {
        return res.status(404).json({ error: 'Character not found' });
    }
    res.json({ success: true });
});

module.exports = router;
