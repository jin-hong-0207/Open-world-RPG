const { SKILL_CONFIG } = require('../shared/skills/skill-config');

describe('Skill System', () => {
  test('skills have correct types', () => {
    Object.values(SKILL_CONFIG).forEach(skill => {
      expect(['Active', 'Passive', 'Ultimate']).toContain(skill.type);
    });
  });

  test('skill cooldowns are valid', () => {
    Object.values(SKILL_CONFIG).forEach(skill => {
      if (skill.cooldown) {
        expect(skill.cooldown).toBeGreaterThan(0);
      }
    });
  });

  test('skill energy costs are valid', () => {
    Object.values(SKILL_CONFIG).forEach(skill => {
      if (skill.energyCost) {
        expect(skill.energyCost).toBeGreaterThan(0);
        expect(skill.energyCost).toBeLessThanOrEqual(100);
      }
    });
  });
});
