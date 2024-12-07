class PuzzleController {
    constructor() {
        this.puzzles = new Map();
        this.initializePuzzles();
    }

    initializePuzzles() {
        // Initialize some test puzzles
        this.addPuzzle({
            id: 'test_puzzle_1',
            type: 'logic',
            solution: 'correct_solution',
            minPlayers: 1,
            timeLimit: null,
            positionRestricted: false
        });

        this.addPuzzle({
            id: 'multiplayer_puzzle_1',
            type: 'coordination',
            solution: 'solution',
            minPlayers: 2,
            timeLimit: null,
            positionRestricted: false
        });

        this.addPuzzle({
            id: 'timed_puzzle_1',
            type: 'memory',
            solution: 'solution',
            minPlayers: 1,
            timeLimit: 300, // 5 minutes
            positionRestricted: false
        });

        this.addPuzzle({
            id: 'env_puzzle_1',
            type: 'environmental',
            solution: 'solution',
            minPlayers: 1,
            timeLimit: null,
            positionRestricted: true,
            validPosition: { x: 0, y: 0, z: 0, radius: 5 }
        });
    }

    addPuzzle(puzzle) {
        this.puzzles.set(puzzle.id, {
            ...puzzle,
            activePlayers: new Set(),
            startTime: null,
            completed: false
        });
    }

    submitSolution(puzzleId, solution, playerId, playerData = {}) {
        const puzzle = this.puzzles.get(puzzleId);
        if (!puzzle) {
            return { success: false, message: 'Puzzle not found' };
        }

        // Add player to active players
        puzzle.activePlayers.add(playerId);

        // Check if enough players are present
        if (puzzle.activePlayers.size < puzzle.minPlayers) {
            return {
                success: false,
                message: 'This puzzle requires more players',
                requiredPlayers: puzzle.minPlayers,
                currentPlayers: puzzle.activePlayers.size
            };
        }

        // Start timer if it's a timed puzzle
        if (puzzle.timeLimit && !puzzle.startTime) {
            puzzle.startTime = Date.now();
        }

        // Check time limit if applicable
        if (puzzle.timeLimit) {
            const timeElapsed = (Date.now() - puzzle.startTime) / 1000;
            if (timeElapsed > puzzle.timeLimit) {
                return {
                    success: false,
                    message: 'Time limit exceeded',
                    timeRemaining: 0
                };
            }
        }

        // Check position if required
        if (puzzle.positionRestricted && playerData.position) {
            const distance = this.calculateDistance(playerData.position, puzzle.validPosition);
            if (distance > puzzle.validPosition.radius) {
                return {
                    success: false,
                    message: 'Not in valid position',
                    validPosition: false
                };
            }
        }

        // Check solution
        const isCorrect = this.validateSolution(puzzle, solution);
        const result = {
            success: isCorrect,
            message: isCorrect ? 'Puzzle solved!' : 'Incorrect solution'
        };

        // Add additional information based on puzzle type
        if (puzzle.timeLimit) {
            result.timeRemaining = puzzle.timeLimit - ((Date.now() - puzzle.startTime) / 1000);
        }

        if (puzzle.positionRestricted) {
            result.validPosition = true;
        }

        if (isCorrect) {
            puzzle.completed = true;
            // Additional rewards or effects could be added here
        }

        return result;
    }

    validateSolution(puzzle, solution) {
        // In a real implementation, this would be more complex
        // and specific to each puzzle type
        return puzzle.solution === solution;
    }

    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    getPuzzleState(puzzleId) {
        const puzzle = this.puzzles.get(puzzleId);
        if (!puzzle) return null;

        const state = {
            id: puzzle.id,
            type: puzzle.type,
            minPlayers: puzzle.minPlayers,
            currentPlayers: puzzle.activePlayers.size,
            completed: puzzle.completed
        };

        if (puzzle.timeLimit) {
            state.timeRemaining = puzzle.startTime ?
                Math.max(0, puzzle.timeLimit - ((Date.now() - puzzle.startTime) / 1000)) :
                puzzle.timeLimit;
        }

        return state;
    }

    resetPuzzle(puzzleId) {
        const puzzle = this.puzzles.get(puzzleId);
        if (puzzle) {
            puzzle.activePlayers.clear();
            puzzle.startTime = null;
            puzzle.completed = false;
            return true;
        }
        return false;
    }
}

module.exports = PuzzleController;
