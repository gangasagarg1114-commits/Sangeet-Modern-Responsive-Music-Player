/* ===========================
   Playlist Page Logic with Live Search
=========================== */

const playlists = {
  '90s': { label: '90s', songs: typeof ninetiesSongs !== 'undefined' ? ninetiesSongs : [] },
  newHindi: { label: 'New Hindi', songs: typeof newHindiSongs !== 'undefined' ? newHindiSongs : [] },
  bhojpuri: { label: 'Bhojpuri', songs: typeof bhojpuriSongs !== 'undefined' ? bhojpuriSongs : [] },
  punjabi: { label: 'Punjabi', songs: typeof punjabiSongs !== 'undefined' ? punjabiSongs : [] },
  haryanvi: { label: 'Haryanvi', songs: typeof haryanviSongs !== 'undefined' ? haryanviSongs : [] },
  english: { label: 'English', songs: typeof englishSongs !== 'undefined' ? englishSongs : [] }
};

const params = new URLSearchParams(window.location.search);
const vibeKey = params.get('vibe') || '90s';
const selected = playlists[vibeKey] || playlists['90s'];

const pageTitle = document.getElementById('pageTitle');
const pageCount = document.getElementById('pageCount');
const fullPlaylist = document.getElementById('fullPlaylist');
const searchInput = document.getElementById('searchInput');

pageTitle.textContent = `${selected.label} Playlist`;
document.title = `${selected.label} Playlist - Sangeet`;

function renderSongs(songsToRender) {
  fullPlaylist.replaceChildren();
  pageCount.textContent = `${songsToRender.length} ${songsToRender.length === 1 ? 'song' : 'songs'}`;

  if (!songsToRender.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'playlist-empty';
    emptyMessage.textContent = 'No matching songs found.';
    fullPlaylist.append(emptyMessage);
    return;
  }

  songsToRender.forEach((song) => {
    // Original array me song ka exact index find karna (filtering ke baad bhi sahi index milega)
    const originalIndex = selected.songs.findIndex((s) => s.src === song.src);

    const item = document.createElement('article');
    item.className = 'full-playlist-item';

    const number = document.createElement('span');
    number.className = 'playlist-number';
    number.textContent = String(originalIndex !== -1 ? originalIndex + 1 : 1).padStart(2, '0');

    const details = document.createElement('div');
    details.className = 'playlist-details';
    const title = document.createElement('strong');
    title.textContent = song.title;
    const artist = document.createElement('small');
    artist.textContent = song.artist;
    details.append(title, artist);

    const playLink = document.createElement('a');
    playLink.className = 'track-open';
    playLink.href = `index.html?vibe=${encodeURIComponent(vibeKey)}`;
    playLink.setAttribute('aria-label', `Open ${song.title} in player`);
    playLink.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';

    item.addEventListener('click', () => {
      sessionStorage.setItem('sangeet_vibe', vibeKey);
      sessionStorage.setItem('sangeet_songIndex', originalIndex !== -1 ? originalIndex : 0);
      sessionStorage.setItem('sangeet_currentTime', 0);
      window.location.href = playLink.href;
    });

    item.append(number, details, playLink);
    fullPlaylist.append(item);
  });
}

// Initial render
renderSongs(selected.songs);

// Live Search Filtering
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filteredSongs = selected.songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );
    renderSongs(filteredSongs);
  });
}