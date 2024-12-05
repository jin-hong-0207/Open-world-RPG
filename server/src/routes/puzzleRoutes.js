const express = require('express');
const router = express.Router();
const PuzzleController = require('../controllers/puzzleController');
const puzzleConfigs = require('../config/puzzleConfigs');

const puzzleController = new PuzzleController();

// Initialize some puzzles from configs
Object.entries(puzzleConfigs).forEach(([name, config]) => {
    puzzleController.createPuzzle(config.type, config.config);
});

// Get all available puzzles
router.get('/puzzles', (req, res) => {
    const puzzles = Array.from(puzzleController.puzzles.values()).map(puzzle => ({
        id: puzzle.id,
        type: puzzle.type,
        requiredPlayers: puzzle.requiredPlayers,
        solved: puzzle.solved
    }));
    res.json(puzzles);
});

// Get specific puzzle state
router.get('/puzzles/:puzzleId', (req, res) => {
    const state = puzzleController.getPuzzleState(req.params.puzzleId);
    if (!state) {
        return res.status(404).json({ error: 'Puzzle not found' });
    }
    res.json(state);
});

// Start puzzle attempt
router.post('/puzzles/:puzzleId/start', (req, res) => {
    const { playerId } = req.body;
    const attempt = puzzleController.startPuzzleAttempt(req.params.puzzleId, playerId);
    if (!attempt) {
        return res.status(404).json({ error: 'Puzzle not found' });
    }
    res.json(attempt);
});

// Join cooperative puzzle
router.post('/puzzles/:puzzleId/join', (req, res) => {
    const { playerId } = req.body;
    const success = puzzleController.addPlayerToPuzzle(req.params.puzzleId, playerId);
    if (!success) {
        return res.status(400).json({ error: 'Cannot join puzzle' });
    }
    res.json({ success: true });
});

// Submit puzzle solution
router.post('/puzzles/:puzzleId/solution', (req, res) => {
    const { solution, playerId } = req.body;
    const result = puzzleController.submitSolution(req.params.puzzleId, solution, playerId);
    res.json(result);
});

// Update puzzle state (for environmental puzzles)
router.put('/puzzles/:puzzleId/state', (req, res) => {
    const { newState } = req.body;
    const success = puzzleController.updatePuzzleState(req.params.puzzleId, newState);
    if (!success) {
        return res.status(400).json({ error: 'Cannot update puzzle state' });
    }
    res.json({ success: true });
});

module.exports = router;
