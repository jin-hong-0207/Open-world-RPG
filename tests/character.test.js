const { CHARACTER_CONFIG } = require('../shared/characters/character-config');

describe('Character System', () => {
  test('all characters have required properties', () => {
    Object.values(CHARACTER_CONFIG).forEach(character => {
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('type');
      expect(character).toHaveProperty('baseStats');
      expect(character).toHaveProperty('abilities');
    });
  });

  test('character types are valid', () => {
    const validTypes = ['Combat', 'Support', 'Crafter', 'Explorer'];
    Object.values(CHARACTER_CONFIG).forEach(character => {
      expect(validTypes).toContain(character.type);
    });
  });

  test('character base stats are within valid ranges', () => {
    Object.values(CHARACTER_CONFIG).forEach(character => {
      expect(character.baseStats.health).toBeGreaterThan(0);
      expect(character.baseStats.energy).toBeGreaterThan(0);
      expect(character.baseStats.speed).toBeGreaterThan(0);
    });
  });
});
