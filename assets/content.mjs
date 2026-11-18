// Shared by the browser and the optional Node validation command. No dependencies.
const text = value => typeof value === 'string' && value.trim().length > 0;
export function safeLink(value) {
  if (!text(value)) return false;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}
export function safeAvatar(value) {
  return typeof value === 'string' && /^assets\/avatars\/[a-zA-Z0-9_-]+\.(svg|png|jpe?g|webp)$/.test(value);
}
export function tagsFor(profile) {
  const tags = profile.interests.flatMap(interest => [interest.answer, ...(interest.keywords || [])]);
  const unique = new Map();
  for (const tag of tags) {
    const key = tag.trim().toLocaleLowerCase('en');
    if (!unique.has(key)) unique.set(key, tag.trim());
  }
  return [...unique.values()];
}
const normalize = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en');
export function matches(profile, query) {
  const tags = normalize(tagsFor(profile).join(' '));
  return normalize(query).trim().split(/\s+/).every(term => tags.includes(term));
}
export function validateProfiles(data) {
  const errors = [];
  const issue = (path, message) => errors.push(`${path}: ${message}`);
  const known = (object, keys, path) => Object.keys(object).forEach(key => { if (!keys.includes(key)) issue(`${path}.${key}`, 'unknown field'); });
  const links = (value, path) => {
    if (value === undefined) return;
    if (!Array.isArray(value)) return issue(path, 'must be an array');
    value.forEach((link, i) => {
      if (!link || typeof link !== 'object' || Array.isArray(link)) return issue(`${path}[${i}]`, 'must be an object');
      known(link, ['label','url'], `${path}[${i}]`);
      if (!text(link.label) || !safeLink(link.url)) issue(`${path}[${i}]`, 'needs a label and an absolute HTTP(S) URL without credentials');
    });
  };
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['root: must be an object'];
  known(data, ['version','profiles'], 'root');
  if (data.version !== 1) issue('version', 'must be 1');
  if (!Array.isArray(data.profiles)) return [...errors, 'profiles: must be an array'];
  const ids = new Set();
  data.profiles.forEach((p, i) => {
    const path = `profiles[${i}]`;
    if (!p || typeof p !== 'object' || Array.isArray(p)) return issue(path, 'must be an object');
    known(p, ['id','name','bio','avatar','links','interests'], path);
    if (!text(p.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id) || ids.has(p.id)) issue(`${path}.id`, 'must be a unique lowercase slug');
    ids.add(p.id);
    for (const key of ['name','bio']) if (!text(p[key])) issue(`${path}.${key}`, 'must be nonempty text');
    if (p.avatar !== undefined && !safeAvatar(p.avatar)) issue(`${path}.avatar`, 'must be a local assets/avatars/ image path');
    links(p.links, `${path}.links`);
    if (!Array.isArray(p.interests) || !p.interests.length) return issue(`${path}.interests`, 'needs at least one interest');
    p.interests.forEach((interest, j) => {
      const at = `${path}.interests[${j}]`;
      if (!interest || typeof interest !== 'object' || Array.isArray(interest)) return issue(at, 'must be an object');
      known(interest, ['category','answer','description','keywords','links'], at);
      for (const key of ['category','answer']) if (!text(interest[key])) issue(`${at}.${key}`, 'must be nonempty text');
      if (interest.description !== undefined && !text(interest.description)) issue(`${at}.description`, 'must be nonempty text or omitted');
      if (interest.keywords !== undefined && (!Array.isArray(interest.keywords) || !interest.keywords.every(text))) issue(`${at}.keywords`, 'must be an array of nonempty strings');
      links(interest.links, `${at}.links`);
    });
  });
  return errors;
}
