const list = document.querySelector('#entries'), status = document.querySelector('#status'), search = document.querySelector('#search'), retry = document.querySelector('#retry');
let entries = [];
function render() {
  const query = search.value.trim().normalize('NFKC').toLocaleLowerCase();
  const matches = entries.filter(e => e.name.normalize('NFKC').toLocaleLowerCase().includes(query));
  list.replaceChildren();
  status.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'location' : 'locations'}` : query ? 'No names match your search.' : 'No locations published yet. Please check back soon.';
  for (const entry of matches) {
    const card = document.createElement('article'); card.className = 'card';
    const name = document.createElement('h2'); name.textContent = entry.name;
    const caption = document.createElement('p'); caption.className = 'caption'; caption.textContent = 'CURRENT ADDRESS';
    const address = document.createElement('p'); address.textContent = entry.address;
    card.append(name, caption, address); list.append(card);
  }
}
async function load() {
  retry.hidden = true; status.textContent = 'Loading locations…';
  try {
    const response = await fetch('data/sadhviji.json', {cache:'no-store'});
    if (!response.ok) throw Error();
    const data = await response.json();
    if (!Array.isArray(data) || data.some(e => typeof e.name !== 'string' || typeof e.address !== 'string')) throw Error();
    entries = data.sort((a,b) => a.name.localeCompare(b.name)); render();
  } catch { status.textContent = 'Locations could not be loaded. Please try again.'; retry.hidden = false; }
}
search.addEventListener('input',render); retry.addEventListener('click',load); load();

async function loadSuvichar() {
  try {
    const response = await fetch('data/suvichar.txt', {cache:'no-store'});
    if (!response.ok) throw Error();
    const text = (await response.text()).trim();
    if (text) { document.querySelector('#thought').textContent = text; document.querySelector('#suvichar').hidden = false; }
  } catch { /* The directory remains available if the optional Suvichar cannot load. */ }
}
loadSuvichar();
