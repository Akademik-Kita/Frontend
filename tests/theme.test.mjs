import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const script = readFileSync(new URL('../public/theme.js', import.meta.url), 'utf8');

for (const [name, saved, systemDark, expected] of [
  ['uses the system light preference', null, false, 'light'],
  ['uses the system dark preference', null, true, 'dark'],
  ['keeps saved light mode over system dark mode', 'light', true, 'light'],
  ['keeps saved dark mode over system light mode', 'dark', false, 'dark'],
  ['ignores an invalid saved preference', 'invalid', true, 'dark'],
]) {
  test(name, () => {
    const root = { dataset: {} };
    vm.runInNewContext(script, {
      document: { documentElement: root },
      localStorage: { getItem: () => saved },
      window: { matchMedia: () => ({ matches: systemDark }) },
    });
    assert.equal(root.dataset.theme, expected);
  });
}

test('renders safely when storage is blocked', () => {
  const root = { dataset: {} };
  vm.runInNewContext(script, {
    document: { documentElement: root },
    localStorage: { getItem: () => { throw new Error('Storage blocked'); } },
  });
  assert.equal(root.dataset.theme, 'light');
});
