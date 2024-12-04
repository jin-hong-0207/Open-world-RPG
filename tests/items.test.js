const { ITEM_CONFIG } = require('../shared/items/item-config');

describe('Item System', () => {
  test('items have required properties', () => {
    Object.values(ITEM_CONFIG).forEach(item => {
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('rarity');
    });
  });

  test('item rarities are valid', () => {
    const validRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    Object.values(ITEM_CONFIG).forEach(item => {
      expect(validRarities).toContain(item.rarity);
    });
  });

  test('equipment items have proper stats', () => {
    const equipmentItems = Object.values(ITEM_CONFIG).filter(item => 
      ['Weapon', 'Armor', 'Accessory'].includes(item.type)
    );
    
    equipmentItems.forEach(item => {
      expect(item).toHaveProperty('stats');
      expect(typeof item.stats).toBe('object');
    });
  });
});
