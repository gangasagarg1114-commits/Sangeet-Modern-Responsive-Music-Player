/* ===========================
   Sangeet - Premium Cinematic Player
=========================== */

// Deezer se songs na milen to ye local songs chalenge.
const localSongs = [
  { title: 'HASEEN', artist: 'TALWIINDER', src: 'songs/HASEEN.mp3', cover: 'images/haseen.jpg' },
  { title: 'Ishq', artist: 'Amir Ameer', src: 'songs/Ishq.mp3', cover: 'images/ishq.jpg' },
  { title: 'Janam Janam', artist: 'Arijit Singh', src: 'songs/Janam Janam.mp3', cover: 'images/Janam Janam.jpg' },
  { title: 'Thodi Der', artist: 'Arjun Kapoor & Shraddha Kapoor', src: 'songs/Thodi Der.mp3', cover: 'images/Thodi Der.webp' }
];

const vibeConfig = {
  '90s': {
    bg: 'images/New Hindi.mp4',
    apiQuery: '90s bollywood songs',
    songs: localSongs
  },
  'newHindi': {
    bg: 'images/New Hindi.mp4',
    apiQuery: 'new hindi songs 2024',
    songs: localSongs
  },
  'bhojpuri': {
    bg: 'images/New Hindi.mp4',
    apiQuery: 'bhojpuri songs',
    songs: localSongs
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
const GOLD_COLOR = '#f7d77f';

// API se 5 preview songs laane ki koshish karta hai.
// API fail ho to ye function empty list return karta hai.
async function getSongsFromApi(query) {
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
    bgVideo.play().catch(() => {});
    playerContainer.style.backgroundImage = 'none';
  } else {
    bgVideo.style.display = 'none';
    bgVideo.pause();
    playerContainer.style.backgroundImage = `url('${selectedVibe.bg}')`;
  }
}

// Vibe button dabane par us vibe ke songs load hote hain.
async function selectVibe(vibeKey) {
  const selectedVibe = vibeConfig[vibeKey];
  if (!selectedVibe) return;

  // Sirf selected button ko active dikhate hain.
  document.querySelectorAll('.vibe-pill').forEach((button) => {
    button.classList.toggle('active', button.dataset.vibe === vibeKey);
  });

  const apiSongs = await getSongsFromApi(selectedVibe.apiQuery);
  currentPlaylist = apiSongs.length ? apiSongs : selectedVibe.songs;
  songIndex = 0;
  setBackground(vibeKey);
  showSong(currentPlaylist[songIndex]);
  playSong();
}

// Current song ki information screen par dikhata hai.
function showSong(song) {
  if (!song) return;
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover || 'images/default-cover.jpg';
  document.title = `${song.title} • Sangeet`;
}

// Play button ka icon play/pause me badalta hai.
function updatePlayButton() {
  if (isPlaying) {
    playIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    if (playIcon.classList.contains('fa-pause')) {
      playIcon.classList.replace('fa-pause', 'fa-play');
    }
  }
}

// Song start karta hai.
function playSong() {
  if (!currentPlaylist.length) return;
  audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
  }).catch(() => {
    isPlaying = false;
    updatePlayButton();
  });
}

// Song rokta hai.
function pauseSong() {
  audio.pause();
  isPlaying = false;
  updatePlayButton();
}

// Previous song par jaata hai.
function prevSong() {
  if (currentPlaylist.length === 0) return;
  songIndex -= 1;
  if (songIndex < 0) songIndex = currentPlaylist.length - 1;
  showSong(currentPlaylist[songIndex]);
  playSong();
}

// Next song par jaata hai. Shuffle on ho to random song chunta hai.
function nextSong() {
  if (currentPlaylist.length === 0) return;

  if (isShuffle) {
    const nextIndex = Math.floor(Math.random() * currentPlaylist.length);
    songIndex = nextIndex;
  } else {
    songIndex += 1;
    if (songIndex >= currentPlaylist.length) songIndex = 0;
  }

  showSong(currentPlaylist[songIndex]);
  playSong();
}

// Vibe buttons ko JavaScript ke click event se connect karte hain.
document.querySelectorAll('.vibe-pill').forEach((button) => {
  button.addEventListener('click', () => selectVibe(button.dataset.vibe));
});

// Play button: chal raha ho to pause, warna play.
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Shuffle button on/off karta hai.
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? GOLD_COLOR : '#b3b3b3';
  shuffleBtn.classList.toggle('active-control', isShuffle);
});

// Repeat button on/off karta hai.
repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? GOLD_COLOR : '#b3b3b3';
  repeatBtn.classList.toggle('active-control', isRepeat);
});

// Volume slider ki value audio me set karte hain.
volumeSlider.addEventListener('input', (event) => {
  audio.volume = Number(event.target.value);
});
audio.volume = Number(volumeSlider.value);

// Song chalte waqt progress bar aur current time update hota hai.
audio.addEventListener('timeupdate', () => {
  if (!audio.duration || Number.isNaN(audio.duration)) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.value = progressPercent || 0;
  current.textContent = formatTime(audio.currentTime);
});

// Song ki total length milne par duration dikhate hain.
audio.addEventListener('loadedmetadata', () => {
  durationDisplay.textContent = formatTime(audio.duration);
});

// Song khatam hone par repeat ho to wahi song, warna next song.
audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

// Progress bar par click/drag karke song me aage-peeche ja sakte hain.
progress.addEventListener('input', () => {
  if (!audio.duration || Number.isNaN(audio.duration)) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Seconds ko minutes:seconds format me badalta hai.
function formatTime(time) {
  if (Number.isNaN(time) || !Number.isFinite(time)) return '0:00';
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

selectVibe('newHindi');