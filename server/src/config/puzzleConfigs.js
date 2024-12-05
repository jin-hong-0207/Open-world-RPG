const puzzleConfigs = {
    // Environmental puzzle example: Pressure plate puzzle
    pressurePlates: {
        type: 'environmental',
        config: {
            requiredPlayers: 2,
            requiredPositions: [
                { x: 100, y: 100 },
                { x: 200, y: 200 }
            ],
            timeLimit: 60000, // 60 seconds
            description: 'Two players must stand on pressure plates simultaneously'
        }
    },

    // Logic puzzle example: Symbol matching
    symbolMatching: {
        type: 'logic',
        config: {
            requiredPlayers: 1,
            solution: 'WATER-FIRE-EARTH-AIR',
            hints: [
                'The first element gives life',
                'The second transforms',
                'The third supports all',
                'The last connects all'
            ],
            timeLimit: 300000, // 5 minutes
            description: 'Match the elements in the correct order based on the hints'
        }
    },

    // Memory puzzle example: Sequence matching
    sequenceMemory: {
        type: 'memory',
        config: {
            requiredPlayers: 1,
            correctSequence: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
            displayTime: 5000, // Time to show sequence
            timeLimit: 10000, // Time to input sequence
            description: 'Remember and repeat the color sequence'
        }
    },

    // Cooperative puzzle example: Team coordination
    teamLever: {
        type: 'environmental',
        config: {
            requiredPlayers: 3,
            requiredPositions: [
                { x: 100, y: 100 }, // Lever 1
                { x: 200, y: 200 }, // Lever 2
                { x: 300, y: 300 }  // Lever 3
            ],
            timeLimit: 30000, // 30 seconds
            description: 'Three players must pull levers simultaneously'
        }
    }
};

module.exports = puzzleConfigs;
