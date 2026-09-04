# Sangeet - Modern Responsive Music Player

Sangeet ek lightweight Spotify-style music player hai jo plain HTML, CSS aur JavaScript par bana hai. Isme local songs, genre-wise playlists, responsive layout, playlist page, volume control aur More Vibes modal available hain.

## Features

- Responsive music player for mobile, tablet and desktop
- 90s playlist main screen par available
- More Vibes modal ke andar:
  - New Hindi
  - Bhojpuri
  - Punjabi
  - Haryanvi
  - English
- Har genre ki independent JavaScript playlist file
- Local audio files ke liye folder-based playlist system
- Volume control
- Shuffle and repeat controls
- Progress bar and duration display
- Dedicated playlist page
- Selected genre ki playlist URL ke through open hoti hai
- Playlist page se player par wapas ja sakte hain
- Missing cover image ke liye fallback image
- Fast genre switching ke liye stale API response protection
- Mobile-friendly spacing, touch targets and no horizontal overflow

## Project Structure

```text
Sangeet-Modern-Responsive-Music-Player/
|
|-- index.html              Main music player
|-- playlist.html           Full playlist page
|-- style.css               Player and playlist page styles
|-- new.js                  Player logic and genre configuration
|-- playlist-page.js        Full playlist page logic
|
|-- songs-90s.js            90s playlist data
|-- songs-bhojpuri.js       Bhojpuri playlist data
|-- songs-newHindi.js       New Hindi playlist data
|-- songs-punjabi.js        Punjabi playlist data
|-- songs-haryanvi.js       Haryanvi playlist data
|-- songs-english.js        English playlist data
|
|-- songs/
|   |-- 90s/
|   |-- newHindi/
|   |-- bhojpuri/
|   |-- punjabi/
|   |-- haryanvi/
|   |-- english/
|
|-- images/
    |-- 90s/
    |-- newHindi/
    |-- bhojpuri/
    |-- punjabi/
    |-- haryanvi/
    |-- english/
    |-- default-cover.jpg
```

## Requirements

- Node.js and npm installed
- A modern browser such as Chrome, Edge or Firefox

Python ki zaroorat nahi hai. Project Node.js ke `npx` command se run ho sakta hai.

## Run Project

### 1. Project folder open karein

PowerShell ya VS Code terminal mein project folder par jaayein:

```powershell
cd "D:\project\Programing\Sangeet-Modern-Responsive-Music-Player"
```

### 2. Local server start karein

```powershell
npx --yes http-server . -p 5500
```

First run par `http-server` package download ho sakta hai. Internet available hona chahiye.

### 3. Browser mein open karein

Main player:

```text
http://localhost:5500/index.html
```

Playlist page example:

```text
http://localhost:5500/playlist.html?vibe=90s
```

Server band karne ke liye terminal mein `Ctrl + C` press karein.

## Playlist System

Har genre ka playlist data apni JavaScript file mein rakha gaya hai. Example:

```javascript
const punjabiSongs = [
  {
    title: 'Punjabi Demo Track',
    artist: 'Sangeet Demo',
    src: 'songs/punjabi/demo.mp3',
    cover: 'images/punjabi/punjabi.jpg'
  }
];
```

Audio aur cover path exact file location se match hona chahiye. Filename mein capital letters, spaces aur extension bhi exact rakhein.

## Naya Song Add Karna

1. Audio file ko correct genre folder mein rakhein:

```text
songs/punjabi/new-song.mp3
```

2. Cover image ko genre image folder mein rakhein:

```text
images/punjabi/new-song.jpg
```

3. Us genre ki JavaScript playlist file mein entry add karein:

```javascript
{
  title: 'New Song',
  artist: 'Artist Name',
  src: 'songs/punjabi/new-song.mp3',
  cover: 'images/punjabi/new-song.jpg'
}
```

4. Page ko browser mein refresh karein.

## Naya Genre Add Karna

Naye genre ke liye ye steps follow karein:

1. Song folder banayein:

```text
songs/genreName/
```

2. Image folder banayein:

```text
images/genreName/
```

3. Playlist file banayein:

```text
songs-genreName.js
```

4. Us file mein global playlist array define karein:

```javascript
const genreNameSongs = [
  {
    title: 'Demo Song',
    artist: 'Demo Artist',
    src: 'songs/genreName/demo.mp3',
    cover: 'images/genreName/demo.jpg'
  }
];
```

5. `index.html` mein playlist script ko `new.js` se pehle load karein:

```html
<script src="songs-genreName.js"></script>
<script src="new.js"></script>
```

6. `new.js` ke `vibeConfig` mein genre add karein:

```javascript
'genreName': {
  bg: 'images/default-cover.jpg',
  label: 'Genre Name',
  apiQuery: 'genre name songs',
  songs: genreNameSongs
}
```

7. `index.html` ke More Vibes modal mein button add karein:

```html
<button class="genre-card" type="button" data-vibe="genreName">
  <i class="fa-solid fa-music" aria-hidden="true"></i>
  <span>Genre Name</span>
  <small>Genre description</small>
</button>
```

8. `playlist-page.js` ke `playlists` object mein genre add karein:

```javascript
genreName: { label: 'Genre Name', songs: genreNameSongs }
```

## Main Files

### `index.html`

Main player interface, controls, More Vibes modal aur script loading contain karta hai.

### `new.js`

Player ka main behavior handle karta hai:

- Genre selection
- Audio loading and playback
- Play, pause, next and previous
- Shuffle and repeat
- Volume and progress
- More Vibes modal
- Playlist page URL update
- Background media disable behavior

### `playlist.html`

Selected genre ki complete local playlist ko dedicated page par show karta hai.

URL format:

```text
playlist.html?vibe=genreKey
```

Examples:

```text
playlist.html?vibe=newHindi
playlist.html?vibe=bhojpuri
playlist.html?vibe=punjabi
```

### `playlist-page.js`

URL se `vibe` key read karta hai aur related playlist ko full page par render karta hai.

### `style.css`

Player, modal, playlist page aur responsive breakpoints ke styles contain karta hai.

## Available Genre Keys

```text
90s
newHindi
bhojpuri
punjabi
haryanvi
english
```

## API Behavior

Player Deezer search API se preview songs load karne ki koshish karta hai. Agar API CORS, network ya server issue ki wajah se unavailable ho, to local playlist phir bhi immediately load hoti hai.

Local player chalane ke liye API zaroori nahi hai. Local songs ke liye correct files aur paths hona zaroori hai.

## Validation Commands

JavaScript syntax check:

```powershell
node --check new.js
node --check playlist-page.js
node --check songs-90s.js
node --check songs-bhojpuri.js
node --check songs-newHindi.js
node --check songs-punjabi.js
node --check songs-haryanvi.js
node --check songs-english.js
```

## Troubleshooting

### Page blank ya scripts work nahi kar rahe

Project ko direct double-click se `file://` URL par open karne ke bajay local server se run karein:

```powershell
npx --yes http-server . -p 5500
```

### Song play nahi ho raha

- Audio file correct folder mein hai ya nahi check karein.
- Playlist JS mein `src` path exact check karein.
- Filename aur extension verify karein.
- Browser console mein 404 error check karein.

### Cover image nahi aa rahi

- Cover file correct image folder mein rakhein.
- `cover` path ko exact filename se match karein.
- `.jpg`, `.jpeg` aur `.png` extension verify karein.

### Playlist page wrong genre dikha raha hai

URL mein correct key use karein:

```text
playlist.html?vibe=punjabi
```

### Port already in use hai

Kisi doosre port par server start karein:

```powershell
npx --yes http-server . -p 5501
```

Phir open karein:

```text
http://localhost:5501/index.html
```

## Current Demo Assets

- 90s: one local example song
- Bhojpuri: one local example song
- New Hindi: existing local playlist
- Punjabi: one local demo song
- Haryanvi: one local demo song
- English: one local demo song

## License and Media Note

Is project mein use kiye gaye songs aur images ke rights unke respective owners ke ho sakte hain. Public deployment se pehle media usage permissions verify karein.
