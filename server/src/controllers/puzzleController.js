const Puzzle = require('../models/puzzle');

class PuzzleController {
    constructor() {
        this.puzzles = new Map();
        this.activePuzzleAttempts = new Map();
    }

    // Create a new puzzle instance
    createPuzzle(type, config) {
        const id = Date.now().toString();
        const puzzle = new Puzzle(id, type, config);
        this.puzzles.set(id, puzzle);
        return puzzle;
    }

    // Start a puzzle attempt
    startPuzzleAttempt(puzzleId, playerId) {
        const puzzle = this.puzzles.get(puzzleId);
        if (!puzzle) return null;

        const attempt = {
            startTime: Date.now(),
            players: new Set([playerId]),
            currentState: {},
        };

        this.activePuzzleAttempts.set(puzzleId, attempt);
        return attempt;
    }

    // Add player to cooperative puzzle
    addPlayerToPuzzle(puzzleId, playerId) {
        const attempt = this.activePuzzleAttempts.get(puzzleId);
        if (!attempt) return false;

        attempt.players.add(playerId);
        return true;
    }

    // Submit puzzle solution attempt
    submitSolution(puzzleId, solution, playerId) {
        const puzzle = this.puzzles.get(puzzleId);
        const attempt = this.activePuzzleAttempts.get(puzzleId);

        if (!puzzle || !attempt) return { success: false, error: 'Puzzle not found' };

        // Check if enough players are participating
        if (attempt.players.size < puzzle.requiredPlayers) {
            return { 
                success: false, 
                error: `Need ${puzzle.requiredPlayers} players. Current: ${attempt.players.size}`
            };
        }

        // Check time limit
        if (!puzzle.checkTimeLimit(attempt.startTime)) {
            return { success: false, error: 'Time limit exceeded' };
        }

        // Check solution
        const isCorrect = puzzle.checkSolution(solution);
        if (isCorrect) {
            puzzle.solve();
            this.activePuzzleAttempts.delete(puzzleId);
        }

        return { 
            success: isCorrect, 
            message: isCorrect ? 'Puzzle solved!' : 'Incorrect solution'
        };
    }

    // Update puzzle state (for environmental puzzles)
    updatePuzzleState(puzzleId, newState) {
        const attempt = this.activePuzzleAttempts.get(puzzleId);
        if (!attempt) return false;

        attempt.currentState = { ...attempt.currentState, ...newState };
        return true;
    }

    // Get puzzle state
    getPuzzleState(puzzleId) {
        const puzzle = this.puzzles.get(puzzleId);
        const attempt = this.activePuzzleAttempts.get(puzzleId);

        if (!puzzle) return null;

        return {
            id: puzzle.id,
            type: puzzle.type,
            solved: puzzle.solved,
            requiredPlayers: puzzle.requiredPlayers,
            timeLimit: puzzle.timeLimit,
            currentAttempt: attempt ? {
                players: Array.from(attempt.players),
                startTime: attempt.startTime,
                currentState: attempt.currentState
            } : null
        };
    }
}

module.exports = PuzzleController;
