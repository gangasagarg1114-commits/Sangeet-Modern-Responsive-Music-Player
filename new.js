/* ===========================
   Sangeet - Premium Cinematic Player
=========================== */

const LOCAL_FALLBACKS = {
  '90s': [
    { title: 'HASEEN', artist: 'TALWIINDER', src: 'songs/HASEEN.mp3', cover: 'images/haseen.jpg' },
    { title: 'Ishq', artist: 'Amir Ameer', src: 'songs/Ishq.mp3', cover: 'images/ishq.jpg' },
    { title: 'Janam Janam', artist: 'Arijit Singh', src: 'songs/Janam Janam.mp3', cover: 'images/Janam Janam.jpg' },
    { title: 'Thodi Der', artist: 'Arjun Kapoor & Shraddha Kapoor', src: 'songs/Thodi Der.mp3', cover: 'images/Thodi Der.webp' }
  ],
  'newHindi': [
    { title: 'HASEEN', artist: 'TALWIINDER', src: 'songs/HASEEN.mp3', cover: 'images/haseen.jpg' },
    { title: 'Ishq', artist: 'Amir Ameer', src: 'songs/Ishq.mp3', cover: 'images/ishq.jpg' },
    { title: 'Janam Janam', artist: 'Arijit Singh', src: 'songs/Janam Janam.mp3', cover: 'images/Janam Janam.jpg' },
    { title: 'Thodi Der', artist: 'Arjun Kapoor & Shraddha Kapoor', src: 'songs/Thodi Der.mp3', cover: 'images/Thodi Der.webp' }
  ],
  'bhojpuri': [
    { title: 'HASEEN', artist: 'TALWIINDER', src: 'songs/HASEEN.mp3', cover: 'images/haseen.jpg' },
    { title: 'Ishq', artist: 'Amir Ameer', src: 'songs/Ishq.mp3', cover: 'images/ishq.jpg' },
    { title: 'Janam Janam', artist: 'Arijit Singh', src: 'songs/Janam Janam.mp3', cover: 'images/Janam Janam.jpg' },
    { title: 'Thodi Der', artist: 'Arjun Kapoor & Shraddha Kapoor', src: 'songs/Thodi Der.mp3', cover: 'images/Thodi Der.webp' }
  ]
};

const vibeConfig = {
  '90s': {
    bg: 'images/New Hindi.mp4',
    label: '90s',
    apiQuery: '90s bollywood songs',
    songs: LOCAL_FALLBACKS['90s']
  },
  'newHindi': {
    bg: 'images/New Hindi.mp4',
    label: 'New Hindi',
    apiQuery: 'new hindi songs 2024',
    songs: LOCAL_FALLBACKS['newHindi']
  },
  'bhojpuri': {
    bg: 'images/New Hindi.mp4',
    label: 'Bhojpuri',
    apiQuery: 'bhojpuri songs',
    songs: LOCAL_FALLBACKS['bhojpuri']
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

let currentPlaylist = [];
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let activeVibeKey = 'newHindi';
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
  const selectedVibe = vibeConfig[vibeKey];
  if (!selectedVibe) return;

  if (selectedVibe.bg.endsWith('.mp4')) {
    bgVideo.src = selectedVibe.bg;
    bgVideo.style.display = 'block';
    bgVideo.play();
    playerContainer.style.backgroundImage = 'none';
  } else {
    bgVideo.style.display = 'none';
    bgVideo.pause();
    playerContainer.style.backgroundImage = `url('${selectedVibe.bg}')`;
  }
}

async function selectVibe(vibeKey, btnElement) {
  const selectedVibe = vibeConfig[vibeKey];
  if (!selectedVibe) return;

  activeVibeKey = vibeKey;

  document.querySelectorAll('.vibe-pill').forEach((btn) => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  const apiSongs = await fetchSongsFromApi(selectedVibe.apiQuery);
  currentPlaylist = apiSongs.length ? apiSongs : selectedVibe.songs;
  songIndex = 0;
  setBackground(vibeKey);
  loadSong(currentPlaylist[songIndex]);
  playSong();
}

function loadSong(song) {
  if (!song) return;
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover || 'images/default-cover.jpg';
  document.title = `${song.title} • Sangeet`;
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

selectVibe('newHindi', document.querySelector('[data-vibe="newHindi"]'));