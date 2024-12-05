class Puzzle {
    constructor(id, type, config) {
        this.id = id;
        this.type = type; // 'environmental', 'logic', 'memory'
        this.config = config;
        this.solved = false;
        this.requiredPlayers = config.requiredPlayers || 1;
        this.timeLimit = config.timeLimit || null;
    }

    // Check if puzzle solution is correct
    checkSolution(attempt) {
        switch (this.type) {
            case 'environmental':
                return this.checkEnvironmentalPuzzle(attempt);
            case 'logic':
                return this.checkLogicPuzzle(attempt);
            case 'memory':
                return this.checkMemoryPuzzle(attempt);
            default:
                return false;
        }
    }

    // Environmental puzzle checking (pressure plates, item placement)
    checkEnvironmentalPuzzle(attempt) {
        const { requiredPositions, currentPositions } = attempt;
        return requiredPositions.every(pos => 
            currentPositions.some(currPos => 
                currPos.x === pos.x && currPos.y === pos.y
            )
        );
    }

    // Logic puzzle checking (symbol matching, riddles)
    checkLogicPuzzle(attempt) {
        return attempt.solution === this.config.solution;
    }

    // Memory puzzle checking (sequence matching)
    checkMemoryPuzzle(attempt) {
        return JSON.stringify(attempt.sequence) === 
               JSON.stringify(this.config.correctSequence);
    }

    // Check if time limit is exceeded
    checkTimeLimit(startTime) {
        if (!this.timeLimit) return true;
        const currentTime = Date.now();
        return (currentTime - startTime) <= this.timeLimit;
    }

    // Mark puzzle as solved
    solve() {
        this.solved = true;
    }
}

module.exports = Puzzle;
