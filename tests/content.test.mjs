import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateProfiles, tagsFor, matches, safeLink, safeAvatar } from '../assets/content.mjs';
const data = JSON.parse(await readFile(new URL('../data/profiles.json', import.meta.url)));
test('the directory contains only Damian', () => {
  assert.deepEqual(validateProfiles(data), []);
  assert.deepEqual(data.profiles.map(p => p.id), ['damian']);
  assert.equal(data.profiles[0].name, 'Damian');
});
test('search matches multiple terms across interests and keywords', () => {
  const profile = {
    name: 'Example',
    bio: 'Example profile',
    interests: [{ answer: 'Lean 4' }, { answer: 'Druid', keywords: ['WoW'] }]
  };
  for (const query of ['lean 4', 'DRUID', 'WoW', 'lean druid']) assert.ok(matches(profile, query));
  assert.ok(!matches(profile, 'ceramics'));
});
test('tags preserve author order, trim and deduplicate; search handles accents', () => {
  const p = { interests:[{ answer:'Café', keywords:['  café  ', 'Coffee'] }, { answer:'Coffee' }] };
  assert.deepEqual(tagsFor(p), ['Café','Coffee']);
  assert.ok(matches(p, 'cafe')); assert.ok(matches(p, ''));
});
test('reject duplicate IDs, malformed fields and executable or credential-bearing links', () => {
  const bad = structuredClone(data); bad.profiles.push(bad.profiles[0]);
  assert.ok(validateProfiles(bad).some(error => error.includes('unique')));
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', '//example.com', 'https://user:pass@example.com']) assert.equal(safeLink(url), false);
  assert.ok(safeLink('https://example.com/path?q=1'));
  assert.equal(safeAvatar('../avatar.svg'), false);
  for (const interests of [[], [null], [{ category:'x',answer:'x',keywords:[3] }]]) {
    const copy = structuredClone(data); copy.profiles[0].interests = interests;
    assert.ok(validateProfiles(copy).length);
  }
  assert.ok(validateProfiles(null).length);
});

test('explicit tags override derived tags for display and search', () => {
  const p = structuredClone(data.profiles[0]);
  p.tags = [' Custom ', 'custom', 'Other'];
  assert.deepEqual(tagsFor(p), ['Custom', 'Other']);
  assert.ok(matches(p, 'custom'));
  assert.ok(!matches(p, p.interests[0].answer));
  p.tags = [];
  assert.deepEqual(tagsFor(p), []);
  p.tags = [3];
  assert.ok(validateProfiles({ version: 1, profiles: [p] }).some(error => error.includes('.tags')));
});
