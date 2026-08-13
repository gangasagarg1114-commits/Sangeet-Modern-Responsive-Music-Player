const songs = [
  {
    title: "HASEEN",
    artist: "TALWIINDER, NDS, RIPPY",
    src: "songs/HASEEN.mp3",
    cover: "images/haseen.jpg"
  },
  {
    title: "Bairan",
    artist: "Banjaare Official",
    src: "songs/Bairan.mp3",
    cover: "images/bairen.jpg"
  },
  {
    title: "Ishq",
    artist: "Amir Ameer, Faheem Abdullah, Rauhan Malik",
    src: "songs/Ishq.mp3",
    cover: "images/ishq.jpg"
  },
  {
    title: "Acche Lagti Ho",
    artist: "Udit Narayan",
    src: "songs/Acche lagte ho.mp3",
    cover: "images/acche.jpg"
  },
  {
    title: "Tera Mera Rishta",
    artist: "Emraan_Hashmi_Songs",
    src: "songs/Tera Mera Rishta.mp3",
    cover: "images/rishta.jpg"
  },
  {
    title: "Janam Janam",
    artist: "Arijit_Singh",
    src: "songs/Janam Janam.mp3",
    cover: "images/Janam Janam.jpg"
  },
  {
    title: "Hare Krishna Hare Rama",
    artist: "Jubin_Nautiyal",
    src: "songs/Hare Krishna Hare Rama.mp3",
    cover: "images/Hare Krishna.jpg"
  },
  {
    title: "Main Agar",
    artist: "Pritam___Atif_Aslam",
    src: "songs/Main Agar.mp3",
    cover: "images/Main Agar.jpg"
  },
  {
    title: "Sajjan Raazi",
    artist: "Satinder_Sartaaj",
    src: "songs/Sajjan Raazi.mp3",
    cover: "images/Sajjan Raazi.jpg"
  },
  {
    title: "O Sanam",
    artist: "Akhil_Sachdeva",
    src: "songs/O Sanam.mp3",
    cover: "images/O Sanam.jpg"
  }
];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const trackCount = document.getElementById("trackCount");

const playBtn = document.getElementById("play");
const playIcon = document.getElementById("playIcon");

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const searchInput = document.getElementById("search");
const songUpload = document.getElementById("songUpload");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const volumeIcon = document.getElementById("volumeIcon");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const playlist = document.getElementById("playlist");
const emptyState = document.getElementById("emptyState");


let songIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;


/* ===========================
   SONG TITLE SCROLL
=========================== */

function checkTitleOverflow() {

  // Pehle scrolling reset karo
  title.classList.remove("scrolling");

  title.style.removeProperty("--scroll-distance");
  title.style.removeProperty("--scroll-duration");

  // Browser ko dimensions calculate karne do
  requestAnimationFrame(() => {

    const containerWidth = title.clientWidth;
    const textWidth = title.scrollWidth;

    // Agar title container se bada hai
    if (textWidth > containerWidth) {

      const distance = textWidth - containerWidth;

      // Kitna left move karna hai
      title.style.setProperty(
        "--scroll-distance",
        `${distance}px`
      );

      // Long title = thoda zyada time
      const scrollDuration = Math.max(
        5,
        distance / 35
      );

      title.style.setProperty(
        "--scroll-duration",
        `${scrollDuration}s`
      );

      title.classList.add("scrolling");
    }
  });
}


/* ===========================
   LOAD SONG
=========================== */

function loadSong(index) {

  if (!songs[index]) return;

  audio.src = songs[index].src;

  title.innerText = songs[index].title;
  artist.innerText = songs[index].artist;

  cover.src =
    songs[index].cover ||
    "images/default-cover.jpg";

  trackCount.innerText =
    `${index + 1} / ${songs.length}`;


  // Long title check
  checkTitleOverflow();


  // Remove previous active song
  document
    .querySelectorAll("#playlist li")
    .forEach(li => {
      li.classList.remove("active");
    });


  // Current active song
  const activeSong =
    document.querySelectorAll("#playlist li")[index];


  if (activeSong) {

    activeSong.classList.add("active");

    activeSong.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }
}


/* ===========================
   PLAY SONG
=========================== */

function playSong() {

  audio.play().catch(() => {});

  isPlaying = true;

  playIcon.classList.remove("fa-play");
  playIcon.classList.add("fa-pause");

  playBtn.setAttribute(
    "aria-label",
    "Pause"
  );
}


/* ===========================
   PAUSE SONG
=========================== */

function pauseSong() {

  audio.pause();

  isPlaying = false;

  playIcon.classList.remove("fa-pause");
  playIcon.classList.add("fa-play");

  playBtn.setAttribute(
    "aria-label",
    "Play"
  );
}


/* ===========================
   PLAY / PAUSE
=========================== */

playBtn.addEventListener("click", () => {

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }

});


/* ===========================
   NEXT SONG
=========================== */

nextBtn.addEventListener("click", () => {

  if (shuffle) {

    songIndex =
      Math.floor(
        Math.random() * songs.length
      );

  } else {

    songIndex++;

    if (songIndex >= songs.length) {
      songIndex = 0;
    }
  }

  loadSong(songIndex);
  playSong();

});


/* ===========================
   PREVIOUS SONG
=========================== */

prevBtn.addEventListener("click", () => {

  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songIndex);
  playSong();

});


/* ===========================
   SHUFFLE
=========================== */

shuffleBtn.addEventListener("click", () => {

  shuffle = !shuffle;

  shuffleBtn.setAttribute(
    "aria-pressed",
    String(shuffle)
  );

});


/* ===========================
   REPEAT
=========================== */

repeatBtn.addEventListener("click", () => {

  repeat = !repeat;

  repeatBtn.setAttribute(
    "aria-pressed",
    String(repeat)
  );

});


/* ===========================
   AUDIO PROGRESS
=========================== */

audio.addEventListener("timeupdate", () => {

  progress.value =
    (audio.currentTime / audio.duration) * 100 || 0;

  current.innerText =
    formatTime(audio.currentTime);

});


/* ===========================
   AUDIO DURATION
=========================== */

audio.addEventListener("loadedmetadata", () => {

  duration.innerText =
    formatTime(audio.duration);

});


/* ===========================
   PROGRESS SEEK
=========================== */

progress.addEventListener("input", () => {

  audio.currentTime =
    (progress.value / 100) *
    audio.duration;

});


/* ===========================
   VOLUME
=========================== */

volume.addEventListener("input", () => {

  audio.volume = volume.value;


  volumeIcon.classList.remove(
    "fa-volume-high",
    "fa-volume-low",
    "fa-volume-xmark"
  );


  if (volume.value == 0) {

    volumeIcon.classList.add(
      "fa-volume-xmark"
    );

  } else if (volume.value < 0.5) {

    volumeIcon.classList.add(
      "fa-volume-low"
    );

  } else {

    volumeIcon.classList.add(
      "fa-volume-high"
    );
  }

});


/* ===========================
   SONG ENDED
=========================== */

audio.addEventListener("ended", () => {

  if (repeat) {

    audio.currentTime = 0;

    playSong();

    return;
  }


  if (shuffle) {

    songIndex =
      Math.floor(
        Math.random() * songs.length
      );

  } else {

    songIndex++;

    if (songIndex >= songs.length) {
      songIndex = 0;
    }
  }


  loadSong(songIndex);
  playSong();

});


/* ===========================
   FORMAT TIME
=========================== */

function formatTime(time) {

  if (Number.isNaN(time)) {
    return "0:00";
  }

  const min =
    Math.floor(time / 60);

  const sec =
    Math.floor(time % 60);


  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}


/* ===========================
   CREATE PLAYLIST ITEM
=========================== */

function createPlaylistItem(song, index) {

  const li =
    document.createElement("li");

  li.classList.add("song-item");


  li.innerHTML = `
    <span class="song-title">${song.title}</span>
    <span class="song-artist">${song.artist}</span>
  `;


  li.addEventListener("click", () => {

    songIndex = index;

    loadSong(songIndex);
    playSong();

  });


  playlist.appendChild(li);
}


/* ===========================
   RENDER PLAYLIST
=========================== */

function renderPlaylist() {

  playlist.innerHTML = "";

  songs.forEach((song, index) => {

    createPlaylistItem(
      song,
      index
    );

  });

}


/* ===========================
   INITIAL LOAD
=========================== */

renderPlaylist();

loadSong(songIndex);


/* ===========================
   SEARCH
=========================== */

searchInput.addEventListener(
  "keyup",
  () => {

    const value =
      searchInput.value.toLowerCase();

    let visibleCount = 0;


    document
      .querySelectorAll("#playlist li")
      .forEach(li => {

        const matches =
          li.innerText
            .toLowerCase()
            .includes(value);


        li.style.display =
          matches ? "flex" : "none";


        if (matches) {
          visibleCount++;
        }

      });


    emptyState.hidden =
      visibleCount !== 0;

  }
);


/* ===========================
   KEYBOARD CONTROLS
=========================== */

document.addEventListener(
  "keydown",
  e => {

    if (e.target.tagName === "INPUT") {
      return;
    }


    if (e.code === "Space") {

      e.preventDefault();

      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    }


    if (e.code === "ArrowRight") {
      nextBtn.click();
    }


    if (e.code === "ArrowLeft") {
      prevBtn.click();
    }

  }
);


/* ===========================
   UPLOAD LOCAL SONGS
=========================== */

songUpload.addEventListener(
  "change",
  e => {

    const files =
      Array.from(e.target.files);


    files.forEach(file => {

      const song = {

        title:
          file.name.replace(
            /\.[^/.]+$/,
            ""
          ),

        artist: "Local File",

        src:
          URL.createObjectURL(file),

        cover: ""

      };


      songs.push(song);


      createPlaylistItem(
        song,
        songs.length - 1
      );

    });


    if (files.length > 0) {

      songIndex =
        songs.length - files.length;


      loadSong(songIndex);

      playSong();

    }


    trackCount.innerText =
      `${songIndex + 1} / ${songs.length}`;

  }
);


/* ===========================
   WINDOW RESIZE
=========================== */

window.addEventListener(
  "resize",
  checkTitleOverflow
);