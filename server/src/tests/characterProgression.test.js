const CharacterController = require('../controllers/characterController');
const dbHandler = require('./setup');

describe('Character Progression Tests', () => {
    let characterController;

    beforeAll(async () => {
        await dbHandler.connect();
        characterController = new CharacterController();
    });

    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    test('character gains experience correctly', async () => {
        const characterId = 'test_char_1';
        const initialExp = await characterController.getExperience(characterId);
        await characterController.addExperience(characterId, 100);
        const finalExp = await characterController.getExperience(characterId);
        expect(finalExp - initialExp).toBe(100);
    });

    test('character levels up at experience threshold', async () => {
        const characterId = 'test_char_2';
        const initialLevel = await characterController.getLevel(characterId);
        await characterController.addExperience(characterId, 1000); // Assuming this is enough to level up
        const finalLevel = await characterController.getLevel(characterId);
        expect(finalLevel).toBeGreaterThan(initialLevel);
    });

    test('skills unlock at appropriate levels', async () => {
        const characterId = 'test_char_3';
        await characterController.setLevel(characterId, 5);
        const unlockedSkills = await characterController.getUnlockedSkills(characterId);
        expect(unlockedSkills.length).toBeGreaterThan(0);
    });

    test('skill usage consumes appropriate resources', async () => {
        const characterId = 'test_char_4';
        const skillId = 'meditation';
        const initialResources = await characterController.getResources(characterId);
        await characterController.useSkill(characterId, skillId);
        const finalResources = await characterController.getResources(characterId);
        expect(finalResources).toBeLessThan(initialResources);
    });

    test('character stats increase with level', async () => {
        const characterId = 'test_char_5';
        const initialStats = await characterController.getStats(characterId);
        await characterController.levelUp(characterId);
        const finalStats = await characterController.getStats(characterId);
        expect(finalStats.some(stat => stat > initialStats[stat])).toBe(true);
    });
});
