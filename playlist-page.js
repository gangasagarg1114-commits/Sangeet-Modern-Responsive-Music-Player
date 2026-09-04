const playlists = {
  '90s': { label: '90s', songs: ninetiesSongs },
  newHindi: { label: 'New Hindi', songs: newHindiSongs },
  bhojpuri: { label: 'Bhojpuri', songs: bhojpuriSongs },
  punjabi: { label: 'Punjabi', songs: punjabiSongs },
  haryanvi: { label: 'Haryanvi', songs: haryanviSongs },
  english: { label: 'English', songs: englishSongs }
};

const params = new URLSearchParams(window.location.search);
const selected = playlists[params.get('vibe')] || playlists['90s'];
const pageTitle = document.getElementById('pageTitle');
const pageCount = document.getElementById('pageCount');
const fullPlaylist = document.getElementById('fullPlaylist');

pageTitle.textContent = `${selected.label} Playlist`;
pageCount.textContent = `${selected.songs.length} ${selected.songs.length === 1 ? 'song' : 'songs'}`;
document.title = `${selected.label} Playlist - Sangeet`;

selected.songs.forEach((song, index) => {
  const item = document.createElement('article');
  item.className = 'full-playlist-item';

  const artwork = document.createElement('img');
  artwork.src = song.cover || 'images/default-cover.jpg';
  artwork.alt = `${song.title} cover`;
  artwork.addEventListener('error', () => {
    artwork.src = 'images/default-cover.jpg';
  }, { once: true });

  const number = document.createElement('span');
  number.className = 'playlist-number';
  number.textContent = String(index + 1).padStart(2, '0');

  const details = document.createElement('div');
  details.className = 'playlist-details';
  const title = document.createElement('strong');
  title.textContent = song.title;
  const artist = document.createElement('small');
  artist.textContent = song.artist;
  details.append(title, artist);

  const playLink = document.createElement('a');
  playLink.className = 'track-open';
  playLink.href = `index.html?vibe=${encodeURIComponent(params.get('vibe') || '90s')}`;
  playLink.setAttribute('aria-label', `Open ${song.title} in player`);
  playLink.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';

  item.append(number, artwork, details, playLink);
  fullPlaylist.append(item);
});
