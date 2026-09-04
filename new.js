/* ===========================
   Sangeet - Premium Cinematic Player
=========================== */

const vibeConfig = {
  '90s': {
    bg: 'images/90s/90s songs.jpg',
    label: '90s',
    apiQuery: '90s bollywood songs',
    songs: ninetiesSongs
  },
  'newHindi': {
    bg: 'images/New Hindi.mp4',
    label: 'New Hindi',
    apiQuery: 'new hindi songs 2024',
    songs: newHindiSongs
  },
  'bhojpuri': {
    bg: 'images/bhojpuri/Bhojpuri.jpg',
    label: 'Bhojpuri',
    apiQuery: 'bhojpuri songs',
    songs: bhojpuriSongs
  },
  'punjabi': {
    bg: 'images/default-cover.jpg',
    label: 'Punjabi',
    apiQuery: 'Punjabi songs',
    songs: punjabiSongs
  },
  'haryanvi': {
    bg: 'images/default-cover.jpg',
    label: 'Haryanvi',
    apiQuery: 'Haryanvi songs',
    songs: haryanviSongs
  },
  'english': {
    bg: 'images/default-cover.jpg',
    label: 'English',
    apiQuery: 'English pop songs',
    songs: englishSongs
  }
};

const playerContainer = document.getElementById('playerContainer');
const bgVideo = document.getElementById('bgVideo');
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');

const playBtn = document.getElementById('play');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const volumeSlider = document.getElementById('volume');

const progress = document.getElementById('progress');
const current = document.getElementById('current');
const durationDisplay = document.getElementById('duration');
const vibesModal = document.getElementById('vibesModal');
const moreVibesBtn = document.getElementById('moreVibesBtn');
const closeVibesBtn = document.getElementById('closeVibesBtn');
const playlistBtn = document.getElementById('playlistBtn');
const playlistPanel = document.getElementById('playlistPanel');
const playlistTitle = document.getElementById('playlistTitle');
const playlistCount = document.getElementById('playlistCount');
const playlistList = document.getElementById('playlistList');

let currentPlaylist = [];
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let activeVibeKey = 'newHindi';
let selectionRequestId = 0;
const GOLD_COLOR = '#f7d77f';

async function fetchSongsFromApi(query) {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const tracks = Array.isArray(data?.data) ? data.data : [];

    return tracks
      .filter((track) => track?.preview)
      .map((track) => ({
        title: track.title || 'Unknown Track',
        artist: track.artist?.name || 'Unknown Artist',
        src: track.preview,
        cover: track.album?.cover_big || 'images/default-cover.jpg'
      }));
  } catch (error) {
    console.warn('API fetch failed, using local fallback songs.', error);
    return [];
  }
}

function setBackground(vibeKey) {
  if (!vibeConfig[vibeKey]) return;

  bgVideo.pause();
  bgVideo.removeAttribute('src');
  bgVideo.load();
  bgVideo.style.display = 'none';
  playerContainer.style.backgroundImage = 'none';
}

async function selectVibe(vibeKey, btnElement) {
  const selectedVibe = vibeConfig[vibeKey];
  if (!selectedVibe) return;

  const requestId = ++selectionRequestId;
  activeVibeKey = vibeKey;

  document.querySelectorAll('.vibe-pill').forEach((btn) => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  playlistBtn.href = `playlist.html?vibe=${encodeURIComponent(vibeKey)}`;
  currentPlaylist = [...selectedVibe.songs];
  songIndex = 0;
  renderPlaylist(selectedVibe.label);
  setBackground(vibeKey);
  loadSong(currentPlaylist[songIndex]);
  playSong();

  const apiSongs = await fetchSongsFromApi(selectedVibe.apiQuery);
  if (requestId !== selectionRequestId || activeVibeKey !== vibeKey) return;

  currentPlaylist = [...selectedVibe.songs, ...apiSongs];
  renderPlaylist(selectedVibe.label);
}

function loadSong(song) {
  if (!song) return;
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover || 'images/default-cover.jpg';
  document.title = `${song.title} • Sangeet`;
  renderPlaylist(vibeConfig[activeVibeKey]?.label || 'Playlist');
}

cover.addEventListener('error', () => {
  if (cover.src.endsWith('/images/default-cover.jpg')) return;
  cover.src = 'images/default-cover.jpg';
});

function renderPlaylist(label) {
  playlistTitle.textContent = label;
  playlistCount.textContent = `${currentPlaylist.length} ${currentPlaylist.length === 1 ? 'song' : 'songs'}`;
  playlistList.replaceChildren();

  if (!currentPlaylist.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'playlist-empty';
    emptyMessage.textContent = 'No songs found for this vibe.';
    playlistList.append(emptyMessage);
    return;
  }

  currentPlaylist.forEach((song, index) => {
    const songButton = document.createElement('button');
    songButton.className = 'playlist-song';
    songButton.type = 'button';
    songButton.classList.toggle('selected', index === songIndex);

    const number = document.createElement('span');
    number.className = 'playlist-number';
    number.textContent = String(index + 1).padStart(2, '0');

    const details = document.createElement('span');
    details.className = 'playlist-details';
    const songTitle = document.createElement('strong');
    songTitle.textContent = song.title;
    const songArtist = document.createElement('small');
    songArtist.textContent = song.artist;
    details.append(songTitle, songArtist);

    songButton.append(number, details);
    songButton.addEventListener('click', () => {
      songIndex = index;
      loadSong(currentPlaylist[songIndex]);
      closePlaylist();
      playSong();
    });
    playlistList.append(songButton);
  });
}

function updatePlayStateUI() {
  if (isPlaying) {
    playIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    if (playIcon.classList.contains('fa-pause')) {
      playIcon.classList.replace('fa-pause', 'fa-play');
    }
  }
}

function playSong() {
  if (!currentPlaylist.length) return;
  audio.play().then(() => {
    isPlaying = true;
    updatePlayStateUI();
  }).catch(() => {
    isPlaying = false;
    updatePlayStateUI();
  });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  updatePlayStateUI();
}

function prevSong() {
  if (currentPlaylist.length === 0) return;
  songIndex -= 1;
  if (songIndex < 0) songIndex = currentPlaylist.length - 1;
  loadSong(currentPlaylist[songIndex]);
  playSong();
}

function nextSong() {
  if (currentPlaylist.length === 0) return;

  if (isShuffle) {
    const nextIndex = Math.floor(Math.random() * currentPlaylist.length);
    songIndex = nextIndex;
  } else {
    songIndex += 1;
    if (songIndex >= currentPlaylist.length) songIndex = 0;
  }

  loadSong(currentPlaylist[songIndex]);
  playSong();
}

// Har vibe button ko uski playlist ke saath connect karte hain.
document.querySelectorAll('.vibe-pill').forEach((button) => {
  if (button.id === 'moreVibesBtn') return;
  button.addEventListener('click', () => {
    selectVibe(button.dataset.vibe, button);
  });
});

function closeVibesModal() {
  vibesModal.hidden = true;
}

moreVibesBtn.addEventListener('click', () => {
  vibesModal.hidden = false;
  closeVibesBtn.focus();
});

closeVibesBtn.addEventListener('click', closeVibesModal);

function closePlaylist() {
  playlistPanel.hidden = true;
  playlistBtn.setAttribute('aria-expanded', 'false');
}

playlistBtn.addEventListener('click', () => {
  playlistPanel.hidden = !playlistPanel.hidden;
  playlistBtn.setAttribute('aria-expanded', String(!playlistPanel.hidden));
});

vibesModal.addEventListener('click', (event) => {
  if (event.target === vibesModal) closeVibesModal();
});

document.querySelectorAll('.genre-card').forEach((button) => {
  button.addEventListener('click', () => {
    closeVibesModal();
    selectVibe(button.dataset.vibe, button);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !vibesModal.hidden) closeVibesModal();
  if (event.key === 'Escape' && !playlistPanel.hidden) closePlaylist();
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.playlist-control')) closePlaylist();
});

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? GOLD_COLOR : '#b3b3b3';
  shuffleBtn.classList.toggle('active-control', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? GOLD_COLOR : '#b3b3b3';
  repeatBtn.classList.toggle('active-control', isRepeat);
});

volumeSlider.addEventListener('input', (event) => {
  audio.volume = Number(event.target.value);
});
audio.volume = Number(volumeSlider.value);

audio.addEventListener('timeupdate', () => {
  if (!audio.duration || Number.isNaN(audio.duration)) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.value = progressPercent || 0;
  current.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

progress.addEventListener('input', () => {
  if (!audio.duration || Number.isNaN(audio.duration)) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

function formatTime(time) {
  if (Number.isNaN(time) || !Number.isFinite(time)) return '0:00';
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

const initialVibeKey = new URLSearchParams(window.location.search).get('vibe') || '90s';
const initialVibeButton = document.querySelector(`[data-vibe="${initialVibeKey}"]`);
selectVibe(initialVibeKey, initialVibeButton || document.querySelector('[data-vibe="90s"]'));