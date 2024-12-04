const { QuestSystem } = require('../client/src/gameplay/quest-system');
const { QUEST_CONFIG } = require('../client/src/quests/quests-config');

describe('Quest System', () => {
  let questSystem;

  beforeEach(() => {
    questSystem = new QuestSystem();
  });

  test('quests have required properties', () => {
    Object.values(QUEST_CONFIG).forEach(quest => {
      expect(quest).toHaveProperty('id');
      expect(quest).toHaveProperty('title');
      expect(quest).toHaveProperty('description');
      expect(quest).toHaveProperty('objectives');
      expect(quest).toHaveProperty('rewards');
    });
  });

  test('quest objectives are valid', () => {
    Object.values(QUEST_CONFIG).forEach(quest => {
      quest.objectives.forEach(objective => {
        expect(objective).toHaveProperty('id');
        expect(objective).toHaveProperty('description');
        expect(objective).toHaveProperty('type');
        expect(objective).toHaveProperty('target');
        expect(objective).toHaveProperty('required');
      });
    });
  });

  test('quest rewards are valid', () => {
    Object.values(QUEST_CONFIG).forEach(quest => {
      expect(quest.rewards).toHaveProperty('experience');
      expect(quest.rewards.experience).toBeGreaterThan(0);
      
      if (quest.rewards.items) {
        quest.rewards.items.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('quantity');
          expect(item.quantity).toBeGreaterThan(0);
        });
      }
    });
  });

  test('quest dependencies are valid', () => {
    Object.values(QUEST_CONFIG).forEach(quest => {
      if (quest.prerequisites) {
        quest.prerequisites.forEach(prereqId => {
          expect(QUEST_CONFIG).toHaveProperty(prereqId);
        });
      }
    });
  });
});
