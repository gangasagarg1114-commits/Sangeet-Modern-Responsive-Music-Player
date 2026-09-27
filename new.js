/* ===========================
   Sangeet - Single Page App (SPA) Local Player with Modal Playlist
=========================== */

// VIBES & GENRES CONFIGURATION
const vibeConfig = {
  '90s': {
    label: '90s',
    songs: typeof ninetiesSongs !== 'undefined' ? ninetiesSongs : []
  },
  'newHindi': {
    label: 'New Hindi',
    songs: typeof newHindiSongs !== 'undefined' ? newHindiSongs : []
  },
  'bhojpuri': {
    label: 'Bhojpuri',
    songs: typeof bhojpuriSongs !== 'undefined' ? bhojpuriSongs : []
  },
  'punjabi': {
    label: 'Punjabi',
    songs: typeof punjabiSongs !== 'undefined' ? punjabiSongs : []
  },
  'haryanvi': {
    label: 'Haryanvi',
    songs: typeof haryanviSongs !== 'undefined' ? haryanviSongs : []
  },
  'english': {
    label: 'English',
    songs: typeof englishSongs !== 'undefined' ? englishSongs : []
  }
};

// DOM ELEMENTS SELECTION
const playerContainer = document.getElementById('playerContainer');
const bgVideo = document.getElementById('bgVideo');
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');

// CONTROL BUTTONS
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');

// PROGRESS BAR & TIMINGS
const progress = document.getElementById('progress');
const current = document.getElementById('current');
const durationDisplay = document.getElementById('duration');

// MODAL POPUPS (Vibes & Playlist)
const vibesModal = document.getElementById('vibesModal');
const moreVibesBtn = document.getElementById('moreVibesBtn');
const closeVibesBtn = document.getElementById('closeVibesBtn');

const playlistModal = document.getElementById('playlistModal');
const playlistBtn = document.getElementById('playlistBtn');
const closePlaylistBtn = document.getElementById('closePlaylistBtn');
const pageCount = document.getElementById('pageCount');
const searchInput = document.getElementById('searchInput');
const fullPlaylist = document.getElementById('fullPlaylist');

// PLAYER STATE VARIABLES
let currentPlaylist = [];
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let activeVibeKey = '90s';
const ACCENT_COLOR = '#00f2fe';

// BACKGROUND SETTER FUNCTION
function setBackground(vibeKey) {
  if (!vibeConfig[vibeKey]) return;
  if (bgVideo) {
    bgVideo.pause();
    bgVideo.removeAttribute('src');
    bgVideo.load();
    bgVideo.style.display = 'none';
  }
  playerContainer.style.backgroundImage = 'none';
}

// VIBE SELECTION & SWITCHING
function selectVibe(vibeKey, btnElement, restoreSongIndex = 0, restoreTime = 0, autoPlay = false) {
  const selectedVibe = vibeConfig[vibeKey];
  if (!selectedVibe) return;

  activeVibeKey = vibeKey;

  document.querySelectorAll('.vibe-pill').forEach((btn) => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  currentPlaylist = [...selectedVibe.songs];
  songIndex = restoreSongIndex < currentPlaylist.length ? restoreSongIndex : 0;
  
  setBackground(vibeKey);
  loadSong(currentPlaylist[songIndex], restoreTime);

  if (autoPlay) {
    playSong();
  }
}

// LOAD SONG DETAILS INTO AUDIO PLAYER
function loadSong(song, startPlaybackTime = 0) {
  if (!song) return;
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  document.title = `${song.title} • Sangeet`;

  if (startPlaybackTime > 0) {
    audio.currentTime = startPlaybackTime;
  }
}

// UPDATE PLAY/PAUSE ICON UI
function updatePlayStateUI() {
  if (isPlaying) {
    playIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    if (playIcon.classList.contains('fa-pause')) {
      playIcon.classList.replace('fa-pause', 'fa-play');
    }
  }
}

// PLAY AUDIO FUNCTION
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

// PAUSE AUDIO FUNCTION
function pauseSong() {
  audio.pause();
  isPlaying = false;
  updatePlayStateUI();
}

// PREVIOUS SONG LOGIC
function prevSong() {
  if (currentPlaylist.length === 0) return;
  songIndex -= 1;
  if (songIndex < 0) songIndex = currentPlaylist.length - 1;
  loadSong(currentPlaylist[songIndex]);
  playSong();
}

// NEXT SONG LOGIC (Supports Shuffle)
function nextSong() {
  if (currentPlaylist.length === 0) return;

  if (isShuffle) {
    songIndex = Math.floor(Math.random() * currentPlaylist.length);
  } else {
    songIndex += 1;
    if (songIndex >= currentPlaylist.length) songIndex = 0;
  }

  loadSong(currentPlaylist[songIndex]);
  playSong();
}

// PLAYLIST MODAL RENDERING & LIVE SEARCH LOGIC
function renderPlaylistSongs(songsToRender) {
  if (!fullPlaylist) return;
  fullPlaylist.replaceChildren();
  const activeVibeData = vibeConfig[activeVibeKey];
  
  if (pageCount) {
    pageCount.textContent = `${songsToRender.length} ${songsToRender.length === 1 ? 'song' : 'songs'}`;
  }

  if (!songsToRender.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'playlist-empty';
    emptyMessage.textContent = 'No matching songs found.';
    fullPlaylist.append(emptyMessage);
    return;
  }

  songsToRender.forEach((song) => {
    const originalIndex = activeVibeData.songs.findIndex((s) => s.src === song.src);

    const item = document.createElement('article');
    item.className = 'full-playlist-item';

    const number = document.createElement('span');
    number.className = 'playlist-number';
    number.textContent = String(originalIndex !== -1 ? originalIndex + 1 : 1).padStart(2, '0');

    const details = document.createElement('div');
    details.className = 'playlist-details';
    const songTitle = document.createElement('strong');
    songTitle.textContent = song.title;
    const songArtist = document.createElement('small');
    songArtist.textContent = song.artist;
    details.append(songTitle, songArtist);

    const playIconSpan = document.createElement('button');
    playIconSpan.className = 'track-open';
    playIconSpan.setAttribute('type', 'button');
    playIconSpan.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';

    item.addEventListener('click', () => {
      songIndex = originalIndex !== -1 ? originalIndex : 0;
      loadSong(currentPlaylist[songIndex]);
      playSong();
      playlistModal.hidden = true;
    });

    item.append(number, details, playIconSpan);
    fullPlaylist.append(item);
  });
}

// PLAYLIST MODAL OPEN/CLOSE EVENT LISTENERS
playlistBtn.addEventListener('click', () => {
  const activeVibeData = vibeConfig[activeVibeKey];
  if (searchInput) searchInput.value = '';
  renderPlaylistSongs(activeVibeData.songs);
  playlistModal.hidden = false;
  if (searchInput) searchInput.focus();
});

closePlaylistBtn.addEventListener('click', () => {
  playlistModal.hidden = true;
});

playlistModal.addEventListener('click', (event) => {
  if (event.target === playlistModal) playlistModal.hidden = true;
});

// REAL-TIME SEARCH FILTER IN PLAYLIST
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activeVibeData = vibeConfig[activeVibeKey];
    const filtered = activeVibeData.songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );
    renderPlaylistSongs(filtered);
  });
}

// MORE VIBES MODAL EVENT LISTENERS
document.querySelectorAll('.vibe-pill').forEach((button) => {
  if (button.id === 'moreVibesBtn') return;
  button.addEventListener('click', () => {
    selectVibe(button.dataset.vibe, button, 0, 0, true);
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
    selectVibe(targetVibe, correspondingPill, 0, 0, true);
  });
});

// KEYBOARD SHORTCUTS (ESC to close modals)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!vibesModal.hidden) closeVibesModal();
    if (!playlistModal.hidden) playlistModal.hidden = true;
  }
});

// PLAYER CONTROLS BUTTON EVENT LISTENERS
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
  shuffleBtn.style.color = isShuffle ? ACCENT_COLOR : '#b3b3b3';
  shuffleBtn.classList.toggle('active-control', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? ACCENT_COLOR : '#b3b3b3';
  repeatBtn.classList.toggle('active-control', isRepeat);
});

// AUDIO PROGRESS & SESSION STORAGE UPDATES
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

// WHEN TRACK ENDS (Handles Repeat or Next Song)
audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

// SEEK BAR INPUT LISTENER
progress.addEventListener('input', () => {
  if (!audio.duration || Number.isNaN(audio.duration)) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// TIME FORMATTING HELPER FUNCTION
function formatTime(time) {
  if (Number.isNaN(time) || !Number.isFinite(time)) return '0:00';
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// INITIALIZE PLAYER STATE FROM SESSION STORAGE
const savedVibe = sessionStorage.getItem('sangeet_vibe') || '90s';
const savedSongIndex = Number(sessionStorage.getItem('sangeet_songIndex')) || 0;
const savedCurrentTime = Number(sessionStorage.getItem('sangeet_currentTime')) || 0;

const initialVibeButton = document.querySelector(`[data-vibe="${savedVibe}"]`);
selectVibe(savedVibe, initialVibeButton || document.querySelector('[data-vibe="90s"]'), savedSongIndex, savedCurrentTime, false);

// FIX: Ensure song info updates immediately on load
if (currentPlaylist.length > 0 && currentPlaylist[songIndex]) {
  loadSong(currentPlaylist[songIndex], savedCurrentTime);
}