const PuzzleController = require('../controllers/puzzleController');
const dbHandler = require('./setup');

describe('Puzzle System Tests', () => {
    let puzzleController;

    beforeAll(async () => {
        await dbHandler.connect();
        puzzleController = new PuzzleController();
    });

    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    test('puzzle solution validation works correctly', () => {
        const result = puzzleController.submitSolution('test_puzzle_1', 'correct_solution', 'player1');
        expect(result.success).toBe(true);
    });

    test('incorrect puzzle solution is rejected', () => {
        const result = puzzleController.submitSolution('test_puzzle_1', 'wrong_solution', 'player1');
        expect(result.success).toBe(false);
    });

    test('multiplayer puzzle requires all players', () => {
        const result = puzzleController.submitSolution('multiplayer_puzzle_1', 'solution', 'player1');
        expect(result.success).toBe(false);
        expect(result.message).toContain('requires more players');
    });

    test('time-based puzzle considers time limit', () => {
        const result = puzzleController.submitSolution('timed_puzzle_1', 'solution', 'player1');
        expect(result.timeRemaining).toBeDefined();
    });

    test('environmental puzzle checks player position', () => {
        const result = puzzleController.submitSolution('env_puzzle_1', 'solution', 'player1', {
            position: { x: 0, y: 0, z: 0 }
        });
        expect(result.validPosition).toBeDefined();
    });
});
