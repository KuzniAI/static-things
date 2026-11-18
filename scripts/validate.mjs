import { readFile, access } from 'node:fs/promises';
import { validateProfiles } from '../assets/content.mjs';
const root = new URL('../', import.meta.url);
try {
  const data = JSON.parse(await readFile(new URL('data/profiles.json', root), 'utf8'));
  const errors = validateProfiles(data);
  for (const p of data.profiles || []) {
    if (p?.avatar && /^assets\/avatars\/[\w-]+\.(svg|png|jpe?g|webp)$/.test(p.avatar)) {
      try { await access(new URL(p.avatar, root)); }
      catch { errors.push(`${p.id}: avatar file does not exist: ${p.avatar}`); }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Valid: ${data.profiles.length} profiles. All referenced avatars exist.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
