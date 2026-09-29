/* ===========================
   Sangeet - Cinematic Music Player (API & Hybrid Edition)
   Local song arrays are preserved below in comments.
=========================== */

/* ==========================================================
   OLD LOCAL SONGS DATA (PRESERVED IN COMMENTS AS REQUESTED)
   ==========================================================
// 90s Songs Local Data
const ninetiesSongs = [
  { title: "Pehla Nasha", artist: "Udit Narayan", src: "local-path-1.mp3" },
  { title: "Tujhe Dekha To", artist: "Kumar Sanu, Lata Mangeshkar", src: "local-path-2.mp3" }
];

// New Hindi Songs Local Data
const newHindiSongs = [
  { title: "Kesariya", artist: "Arijit Singh", src: "local-path-3.mp3" }
];

// Bhojpuri Songs Local Data
const bhojpuriSongs = [
  { title: "Raja Ji", artist: "Pawan Singh", src: "local-path-4.mp3" }
];

// Punjabi Songs Local Data
const punjabiSongs = [
  { title: "Brown Munde", artist: "AP Dhillon", src: "local-path-5.mp3" }
];

// Haryanvi Songs Local Data
const haryanviSongs = [
  { title: "5 Talliyan", artist: "Renuka Panwar", src: "local-path-6.mp3" }
];

// English Songs Local Data
const englishSongs = [
  { title: "Believer", artist: "Imagine Dragons", src: "local-path-7.mp3" }
];
========================================================== */

// VIBES & API QUERY CONFIGURATION
const vibeApiConfig = {
  '90s': { label: '90s Hits', query: 'hindi 90s evergreen hits' },
  'newHindi': { label: 'New Hindi', query: 'new bollywood hits 2026' },
  'bhojpuri': { label: 'Bhojpuri', query: 'top bhojpuri dj songs' },
  'punjabi': { label: 'Punjabi', query: 'latest punjabi party tracks' },
  'haryanvi': { label: 'Haryanvi', query: 'haryanvi raw beat songs' },
  'english': { label: 'English', query: 'global pop billboard hits' }
};

// DOM ELEMENTS SELECTION
const playerContainer = document.getElementById('playerContainer');
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

// FETCH SONGS FROM FREE PUBLIC MUSIC API (JioSaavn Open Endpoint Wrapper)
async function fetchSongsByVibe(vibeKey) {
  const config = vibeApiConfig[vibeKey];
  if (!config) return;

  try {
    // Open public music search API
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(config.query)}`);
    const data = await response.json();

    if (data && data.success && data.data && data.data.results) {
      currentPlaylist = data.data.results.map(song => ({
        title: song.name || 'Unknown Track',
        artist: song.artists?.primary?.[0]?.name || song.primaryArtists || 'Various Artists',
        src: song.downloadUrl?.[4]?.link || song.downloadUrl?.[3]?.link || song.downloadUrl?.[0]?.link || ''
      })).filter(song => song.src !== ''); // Filter out tracks without valid streaming links
    } else {
      currentPlaylist = [];
    }

    if (currentPlaylist.length > 0) {
      songIndex = 0;
      loadSong(currentPlaylist[songIndex]);
      playSong();
    } else {
      title.textContent = "No tracks found";
      artist.textContent = "Try another vibe";
    }
  } catch (error) {
    console.error("API Fetch Error:", error);
    title.textContent = "Loading error";
    artist.textContent = "Check internet connection";
  }
}

// VIBE SELECTION & SWITCHING
function selectVibe(vibeKey, btnElement, autoPlay = false) {
  if (!vibeApiConfig[vibeKey]) return;

  activeVibeKey = vibeKey;

  // Update active pill UI state
  document.querySelectorAll('.vibe-pill').forEach((btn) => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  // Fetch songs via API for selected vibe
  fetchSongsByVibe(vibeKey);
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
  }).catch((err) => {
    console.warn("Playback prevented or error:", err);
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

  songsToRender.forEach((song, idx) => {
    const item = document.createElement('article');
    item.className = 'full-playlist-item';

    const number = document.createElement('span');
    number.className = 'playlist-number';
    number.textContent = String(idx + 1).padStart(2, '0');

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
      songIndex = idx;
      loadSong(currentPlaylist[songIndex]);
      playSong();
      if (playlistModal) playlistModal.hidden = true;
    });

    item.append(number, details, playIconSpan);
    fullPlaylist.append(item);
  });
}

// PLAYLIST MODAL OPEN/CLOSE EVENT LISTENERS
if (playlistBtn && playlistModal) {
  playlistBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    renderPlaylistSongs(currentPlaylist);
    playlistModal.hidden = false;
    if (searchInput) searchInput.focus();
  });
}

if (closePlaylistBtn && playlistModal) {
  closePlaylistBtn.addEventListener('click', () => {
    playlistModal.hidden = true;
  });

  playlistModal.addEventListener('click', (event) => {
    if (event.target === playlistModal) playlistModal.hidden = true;
  });
}

// REAL-TIME SEARCH FILTER IN PLAYLIST
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = currentPlaylist.filter(
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
    selectVibe(button.dataset.vibe, button, true);
  });
});

function closeVibesModal() {
  if (vibesModal) vibesModal.hidden = true;
}

if (moreVibesBtn && vibesModal && closeVibesBtn) {
  moreVibesBtn.addEventListener('click', () => {
    vibesModal.hidden = false;
    closeVibesBtn.focus();
  });

  closeVibesBtn.addEventListener('click', closeVibesModal);

  vibesModal.addEventListener('click', (event) => {
    if (event.target === vibesModal) closeVibesModal();
  });
}

document.querySelectorAll('.genre-card').forEach((button) => {
  button.addEventListener('click', () => {
    closeVibesModal();
    const targetVibe = button.dataset.vibe;
    const correspondingPill = document.querySelector(`[data-vibe="${targetVibe}"]`);
    selectVibe(targetVibe, correspondingPill, true);
  });
});

// KEYBOARD SHORTCUTS (ESC to close modals)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (vibesModal && !vibesModal.hidden) closeVibesModal();
    if (playlistModal && !playlistModal.hidden) playlistModal.hidden = true;
  }
});

// PLAYER CONTROLS BUTTON EVENT LISTENERS
if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  });
}

if (prevBtn) prevBtn.addEventListener('click', prevSong);
if (nextBtn) nextBtn.addEventListener('click', nextSong);

if (shuffleBtn) {
  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? ACCENT_COLOR : '#b3b3b3';
    shuffleBtn.classList.toggle('active-control', isShuffle);
  });
}

if (repeatBtn) {
  repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? ACCENT_COLOR : '#b3b3b3';
    repeatBtn.classList.toggle('active-control', isRepeat);
  });
}

// AUDIO PROGRESS & SESSION STORAGE UPDATES
if (audio) {
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || Number.isNaN(audio.duration)) return;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    if (progress) progress.value = progressPercent || 0;
    if (current) current.textContent = formatTime(audio.currentTime);

    sessionStorage.setItem('sangeet_vibe', activeVibeKey);
    sessionStorage.setItem('sangeet_songIndex', songIndex);
    sessionStorage.setItem('sangeet_currentTime', audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (isRepeat) {
      audio.currentTime = 0;
      playSong();
    } else {
      nextSong();
    }
  });
}

// SEEK BAR INPUT LISTENER
if (progress) {
  progress.addEventListener('input', () => {
    if (!audio.duration || Number.isNaN(audio.duration)) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
  });
}

// TIME FORMATTING HELPER FUNCTION
function formatTime(time) {
  if (Number.isNaN(time) || !Number.isFinite(time)) return '0:00';
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// INITIALIZE PLAYER STATE ON PAGE LOAD
const savedVibe = sessionStorage.getItem('sangeet_vibe') || '90s';
const initialVibeButton = document.querySelector(`[data-vibe="${savedVibe}"]`);

// Load initial vibe songs from API
selectVibe(savedVibe, initialVibeButton || document.querySelector('[data-vibe="90s"]'), false);