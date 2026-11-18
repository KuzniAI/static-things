import { validateProfiles, tagsFor, matches, safeLink, safeAvatar } from './content.mjs';
const $ = id => document.getElementById(id);
let profiles = [];
let activeRoute = '';
let returnTo = { query:'', scroll:0, person:null };
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const route = () => {
  const [path, search = ''] = location.hash.slice(1).split('?');
  return { id:path.startsWith('person/') ? path.slice(7) : null, query:new URLSearchParams(search).get('q') || '' };
};
const hash = (id, query) => `#${id ? `person/${id}` : 'people'}${query ? `?${new URLSearchParams({ q:query })}` : ''}`;
function avatar(p) {
  const fallback = el('span', 'avatar avatar-fallback', p.name.slice(0, 2).toUpperCase());
  fallback.setAttribute('aria-hidden', 'true');
  if (!safeAvatar(p.avatar)) return fallback;
  const image = el('img', 'avatar'); image.src = `./${p.avatar}`; image.alt = ''; image.width = 60; image.height = 60;
  image.addEventListener('error', () => image.replaceWith(fallback), { once:true });
  return image;
}
function tags(p) {
  const container = el('div', 'tags');
  tagsFor(p).forEach(tag => container.append(el('span', 'tag', tag)));
  return container;
}
function links(items = []) {
  const list = el('ul', 'links');
  items.filter(item => safeLink(item.url)).forEach(item => {
    const li = el('li'); const a = el('a', '', `${item.label} ↗`);
    a.href = item.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', `${item.label} (opens in a new tab)`);
    li.append(a); list.append(li);
  });
  return list;
}
function renderPeople(query) {
  const results = profiles.filter(p => matches(p, query));
  $('people').replaceChildren();
  results.forEach(p => {
    const li = el('li'); const a = el('a', 'person');
    a.href = hash(p.id, query); a.dataset.person = p.id;
    const body = el('div'); body.append(el('h3', 'person-name', p.name), el('p', 'bio', p.bio), tags(p));
    const arrow = el('span', 'row-arrow', '↗'); arrow.setAttribute('aria-hidden','true');
    a.append(avatar(p), body, arrow); li.append(a); $('people').append(li);
  });
  $('count').textContent = `${results.length} ${results.length === 1 ? 'person' : 'people'}${query ? ` matching “${query}”` : ' · a few things in common'}`;
  $('empty').hidden = results.length !== 0;
}
function renderProfile(id, query) {
  const p = profiles.find(p => p.id === id);
  const page = $('profile'); page.replaceChildren();
  const back = el('a', 'back', '← Back to people'); back.href = hash(null, query); back.dataset.back = 'true'; page.append(back);
  if (!p) {
    const title = el('h1', '', 'This person isn’t here.'); title.id = 'profile-title'; page.append(title, el('p', 'bio', 'They may have changed their profile link. Head back and find another curious person.'));
    document.title = 'Person not found — Into Things.'; return;
  }
  const header = el('header', 'profile-header'); const body = el('div');
  const title = el('h1', '', p.name); title.id = 'profile-title';
  body.append(el('p', 'profile-kicker', 'A person, through their interests'), title, el('p', 'bio', p.bio), tags(p), links(p.links));
  header.append(avatar(p), body); page.append(header);
  const heading = el('h2', 'interests-title', 'A few things I’m into'); page.append(heading);
  const list = el('ol', 'interests');
  p.interests.forEach(interest => {
    const li = el('li', 'interest'); li.append(el('p', 'category', interest.category), el('h3', '', interest.answer));
    if (interest.description) li.append(el('p', '', interest.description));
    if (interest.links?.length) li.append(links(interest.links));
    list.append(li);
  });
  page.append(list); document.title = `${p.name} — Into Things.`;
}
function showRoute(initial = false) {
  const { id, query } = route();
  const wasProfile = activeRoute === 'profile';
  $('directory').hidden = Boolean(id); $('profile').hidden = !id;
  if (id) {
    renderProfile(id, query); activeRoute = 'profile'; window.scrollTo(0,0);
    if (!initial) { $('profile-title').tabIndex = -1; $('profile-title').focus({ preventScroll:true }); }
  } else {
    $('search').value = query; renderPeople(query); activeRoute = 'directory';
    document.title = "Into Things. — Come see what everyone's into.";
    if (wasProfile) {
      const saved = history.state?.directory || returnTo;
      const person = [...document.querySelectorAll('[data-person]')].find(a => a.dataset.person === saved.person);
      (person || $('directory-title')).tabIndex = person ? 0 : -1;
      (person || $('directory-title')).focus({ preventScroll:true });
      requestAnimationFrame(() => window.scrollTo(0, saved.query === query ? saved.scroll : 0));
    }
  }
}
function search() {
  const query = $('search').value;
  history.replaceState(null, '', hash(null, query)); renderPeople(query);
}
$('search-form').addEventListener('submit', event => { event.preventDefault(); search(); });
$('search').addEventListener('input', search);
$('clear').addEventListener('click', () => { $('search').value = ''; search(); $('search').focus(); });
document.addEventListener('click', event => {
  const a = event.target.closest('a');
  if (!a || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (a.dataset.person) {
    returnTo = { query:$('search').value, scroll:window.scrollY, person:a.dataset.person };
    history.replaceState({ directory:returnTo }, '');
    event.preventDefault();
    history.pushState({ fromDirectory:true }, '', a.href);
    showRoute();
    return;
  }
  if (a.dataset.back && history.state?.fromDirectory && returnTo.person && route().query === returnTo.query) {
    event.preventDefault(); history.back();
  }
  // The skip link targets the main landmark, rather than an application route.
  if (a.classList.contains('skip-link')) { event.preventDefault(); $('main').focus(); $('main').scrollIntoView(); }
});
window.addEventListener('popstate', () => { if (profiles.length || !$('directory').hidden || !$('profile').hidden) showRoute(); });
// hashchange also handles direct hash edits; popstate already handles normal history traversal.
window.addEventListener('hashchange', () => { if (profiles.length && (route().id ? 'profile' : 'directory') !== activeRoute) showRoute(); });
$('retry').addEventListener('click', load);
async function load() {
  $('loading').hidden = false; $('error').hidden = true;
  try {
    const response = await fetch(new URL('../data/profiles.json', import.meta.url));
    if (!response.ok) throw new Error(`Profile request failed (${response.status})`);
    const data = await response.json(); const errors = validateProfiles(data);
    if (errors.length) throw new Error(errors.join('\n'));
    profiles = data.profiles; showRoute(true);
  } catch (error) {
    console.error('Into Things:', error); $('error').hidden = false; $('directory').hidden = true; $('profile').hidden = true;
  } finally { $('loading').hidden = true; }
}
load();
