/* ===========================
   Sangeet - Premium Cinematic Player
=========================== */

const vibeConfig = {
  '90s': {
    bg: 'images/90s/90s songs.jpg',
    label: '90s',
    apiQuery: '90s bollywood songs',
    songs: typeof ninetiesSongs !== 'undefined' ? ninetiesSongs : []
  },
  'newHindi': {
    bg: 'images/New Hindi.mp4',
    label: 'New Hindi',
    apiQuery: 'new hindi songs 2024',
    songs: typeof newHindiSongs !== 'undefined' ? newHindiSongs : []
  },
  'bhojpuri': {
    bg: 'images/bhojpuri/Bhojpuri.jpg',
    label: 'Bhojpuri',
    apiQuery: 'bhojpuri songs',
    songs: typeof bhojpuriSongs !== 'undefined' ? bhojpuriSongs : []
  },
  'punjabi': {
    bg: 'images/default-cover.jpg',
    label: 'Punjabi',
    apiQuery: 'Punjabi songs',
    songs: typeof punjabiSongs !== 'undefined' ? punjabiSongs : []
  },
  'haryanvi': {
    bg: 'images/default-cover.jpg',
    label: 'Haryanvi',
    apiQuery: 'Haryanvi songs',
    songs: typeof haryanviSongs !== 'undefined' ? haryanviSongs : []
  },
  'english': {
    bg: 'images/default-cover.jpg',
    label: 'English',
    apiQuery: 'English pop songs',
    songs: typeof englishSongs !== 'undefined' ? englishSongs : []
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

const progress = document.getElementById('progress');
const current = document.getElementById('current');
const durationDisplay = document.getElementById('duration');
const vibesModal = document.getElementById('vibesModal');
const moreVibesBtn = document.getElementById('moreVibesBtn');
const closeVibesBtn = document.getElementById('closeVibesBtn');
const playlistBtn = document.getElementById('playlistBtn');

let currentPlaylist = [];
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let activeVibeKey = '90s';
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

async function selectVibe(vibeKey, btnElement, restoreSongIndex = 0, restoreTime = 0) {
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
  songIndex = restoreSongIndex < currentPlaylist.length ? restoreSongIndex : 0;
  
  setBackground(vibeKey);
  loadSong(currentPlaylist[songIndex], restoreTime);

  const apiSongs = await fetchSongsFromApi(selectedVibe.apiQuery);
  if (requestId !== selectionRequestId || activeVibeKey !== vibeKey) return;

  currentPlaylist = [...selectedVibe.songs, ...apiSongs];
}

function loadSong(song, startPlaybackTime = 0) {
  if (!song) return;
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover || 'images/default-cover.jpg';
  document.title = `${song.title} • Sangeet`;

  if (startPlaybackTime > 0) {
    audio.currentTime = startPlaybackTime;
  }
}

cover.addEventListener('error', () => {
  if (cover.src.endsWith('/images/default-cover.jpg')) return;
  cover.src = 'images/default-cover.jpg';
});

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

document.querySelectorAll('.vibe-pill').forEach((button) => {
  if (button.id === 'moreVibesBtn') return;
  button.addEventListener('click', () => {
    selectVibe(button.dataset.vibe, button);
    playSong();
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

vibesModal.addEventListener('click', (event) => {
  if (event.target === vibesModal) closeVibesModal();
});

document.querySelectorAll('.genre-card').forEach((button) => {
  button.addEventListener('click', () => {
    closeVibesModal();
    const targetVibe = button.dataset.vibe;
    const correspondingPill = document.querySelector(`[data-vibe="${targetVibe}"]`);
    selectVibe(targetVibe, correspondingPill);
    playSong();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !vibesModal.hidden) closeVibesModal();
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

audio.addEventListener('timeupdate', () => {
  if (!audio.duration || Number.isNaN(audio.duration)) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.value = progressPercent || 0;
  current.textContent = formatTime(audio.currentTime);

  sessionStorage.setItem('sangeet_vibe', activeVibeKey);
  sessionStorage.setItem('sangeet_songIndex', songIndex);
  sessionStorage.setItem('sangeet_currentTime', audio.currentTime);
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

const urlParams = new URLSearchParams(window.location.search);
const userVibe = urlParams.get('vibe') || sessionStorage.getItem('sangeet_vibe') || '90s';
const userSongIndex = Number(sessionStorage.getItem('sangeet_songIndex')) || 0;
const userCurrentTime = Number(sessionStorage.getItem('sangeet_currentTime')) || 0;

const initialVibeButton = document.querySelector(`[data-vibe="${userVibe}"]`);
selectVibe(userVibe, initialVibeButton || document.querySelector('[data-vibe="90s"]'), userSongIndex, userCurrentTime);