const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
    characterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        required: true
    },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    rotation: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    inventory: [{
        itemId: String,
        itemType: String,
        quantity: Number
    }],
    completedPuzzles: [{
        puzzleId: String,
        completedAt: Date
    }],
    unlockedAreas: [String],
    activeQuests: [{
        questId: String,
        progress: Number,
        started: Date
    }],
    skillProgress: [{
        skillId: String,
        level: Number,
        experience: Number
    }],
    lastSaved: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GameState', gameStateSchema);
