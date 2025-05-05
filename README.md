# Simple Music Player (Which only contains music by Quincy Larson. Quincy if you see this your'e a legend!)

## Description

A music player application built with HTML, CSS (including Tailwind), and Vanilla JavaScript. It allows users to play songs from a predefined playlist, control playback, shuffle, delete songs, and features a dynamic, CSS-animated gradient background.

## Features

* **Playback Controls:** Play, pause, skip to the next song, or go back to the previous song.
* **Playlist Display:** Lists available songs with title and artist.
* **Song Selection:** Click on any song in the playlist to play it.
* **Highlighting:** The currently playing song is visually highlighted in the playlist.
* **Shuffle:** Randomize the order of the songs in the current playlist.
* **Delete Song:** Remove individual songs from the playlist using the delete button next to each track.
* **Reset Playlist:** If the playlist becomes empty, a "Reset Playlist" button appears to restore the original list.
* **Album Art Display:** Shows album art for the currently playing song (requires local images). Falls back to a placeholder if an image is missing.
* **Responsive Design:** Adapts layout for different screen sizes (desktop, tablet, mobile).
* **Keyboard Navigation:** Basic keyboard support (Enter/Space) to play songs when focused in the playlist.
* **Animated Background:** Features a subtle, animated radial gradient background created with CSS.

## How to Use

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/QuantumDaveLdn/Music-Player.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Music-Player
    ```
3.  **Open `index.html` in your browser:**
    * **Mac:** `open index.html`
    * **Windows:** `start index.html`
    * Or simply double-click the `index.html` file.
  
    OR

    Visit the github pages associated with this repo: https://quantumdaveldn.github.io/Music-Player/

5.  **Interact with the Player:**
    * Use the play/pause, next, previous, and shuffle buttons.
    * Click on songs in the playlist to play them.
    * Click the 'X' button next to a song to remove it.
    * If you delete all songs, click the "Reset Playlist" button to bring them back.

## Technologies Used

* **HTML:** Structures the web page content.
* **CSS:** Styles the application, including layout, colors, and the animated background.
    * **Tailwind CSS:** Utility classes used for rapid styling (loaded via CDN).
* **JavaScript (Vanilla):** Handles all the player logic, including audio playback, playlist management, UI updates, and event handling.
    * Uses the built-in HTML5 `Audio` element.
* **Three.js:** Included via CDN in `index.html` but **not currently used** in the provided `script.js` for the background animation (which is handled by CSS).

## Project Structure
├── index.html       # Main HTML file

├── styles.css       # Custom CSS styles & background animation

├── script.js        # JavaScript logic for the player

├── images/          # Contains album art (song0.jpg, song1.jpg, etc.)

├── README.md        # This file

└── .gitignore       # Specifies intentionally untracked files for Git

## Future Improvements

* Implement the "Repeat" button functionality (currently disabled).
* Add a visual progress bar for the currently playing song.
* Add volume control.
* Persist the current playlist state (including deletions and shuffle order) and the last played song/time using Local Storage.
* Fetch song data and album art from an API instead of hardcoding.
* Implement error handling for missing audio files.
* If intended, utilise the included Three.js library for a more complex background animation.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
