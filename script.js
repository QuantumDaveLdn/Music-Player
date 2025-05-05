// --- DOM Element Selection ---
// Grabbing all the HTML elements we need to interact with
const playlistSongs = document.getElementById("playlist-songs"); // The list where songs appear
const playButton = document.getElementById("play"); // The play button
const pauseButton = document.getElementById("pause"); // The pause button
const nextButton = document.getElementById("next"); // Next song button
const previousButton = document.getElementById("previous"); // Previous song button
const shuffleButton = document.getElementById("shuffle"); // Shuffle playlist button
const albumArt = document.getElementById("album-art-img"); // The image element for album art
const playerTitle = document.getElementById("player-song-title"); // Where the current song title is displayed
const playerArtist = document.getElementById("player-song-artist"); // Where the current song artist is displayed
const resetContainer = document.getElementById("reset-container"); // The div where the reset button will go if needed

// --- Initial Song Data ---
// This is our starting playlist.
// IMPORTANT: It expects an 'images' folder next to the index.html file,
// and inside that folder, images named song0.jpg, song1.jpg, etc.
const allSongs = [
  {
    id: 0, // Unique ID for each song
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25", // How long the song is (display only)
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3", // Where the audio file lives
    albumArtUrl: "images/song0.jpg", // Path to the local album art image
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
    albumArtUrl: "images/song1.jpg",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
    albumArtUrl: "images/song2.jpg",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
    albumArtUrl: "images/song3.jpg",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
    albumArtUrl: "images/song4.jpg",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
    albumArtUrl: "images/song5.jpg",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
    albumArtUrl: "images/song6.jpg",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
    albumArtUrl: "images/song7.jpg",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
    albumArtUrl: "images/song8.jpg",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
    albumArtUrl: "images/song9.jpg",
  },
];


// --- Audio Player Setup ---
const audio = new Audio(); // Create the HTML5 Audio element to handle playback
let userData = {
  songs: [...allSongs], // Make a *copy* of the original song list to work with (so we don't mess up the original)
  currentSong: null,    // Which song is currently loaded or playing (null if none)
  songCurrentTime: 0,   // Where the user left off in the current song
};

// --- Core Player Functions ---

/**
 * Loads and plays a specific song based on its ID.
 * Handles resuming playback if it's the same song.
 * @param {number} id - The ID of the song to play.
 */
const playSong = (id) => {
  // Find the song object in our current playlist (userData.songs)
  const song = userData.songs.find((song) => song.id === id);
  // If the song isn't found (maybe it was deleted?), just stop.
  if (!song) {
    console.warn(`Song with ID ${id} not found in current playlist.`);
    return;
  }

  // Set the audio source and title
  audio.src = song.src;
  audio.title = song.title; // Good for accessibility tools

  // Decide where to start playback:
  // If it's a brand new song OR no song was previously loaded, start from the beginning (0).
  // Otherwise, resume from where the user paused (userData.songCurrentTime).
  if (userData.currentSong === null || userData.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData.songCurrentTime;
  }
  // Update the state to remember which song is now current
  userData.currentSong = song;

  // Update the UI elements: show pause, hide play, highlight the song, update display text/art
  playButton.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText(); // Important for screen readers

  // Try to play the audio!
  const playPromise = audio.play(); // play() returns a promise

  // Handle potential errors (like browser blocking autoplay)
  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Playback started successfully! Nothing extra needed here for now.
    }).catch(error => {
      // Oops, playback failed. Log the error and reset the UI to paused state.
      console.error("Error playing audio:", error);
      pauseSong(); // Show play button again, etc.
    });
  }
};

/**
 * Pauses the currently playing song and saves its position.
 */
const pauseSong = () => {
  // Store the exact time where the song was paused
  userData.songCurrentTime = audio.currentTime;

  // Update the UI: show play button, hide pause button
  playButton.classList.remove("hidden");
  pauseButton.classList.add("hidden");
  // Actually pause the audio element
  audio.pause();
};

/**
 * Finds the next song in the list and plays it.
 * If it's the last song, it loops back to the first one.
 */
const playNextSong = () => {
  // Don't do anything if the playlist is empty
  if (userData.songs.length === 0) return;

  // If no song is currently selected, just play the first one in the list.
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
  } else {
    // Find the index of the current song
    const currentSongIndex = getCurrentSongIndex();
    // Calculate the next index, using modulo (%) to wrap around to 0 if we're at the end
    const nextSongIndex = (currentSongIndex + 1) % userData.songs.length;
    // Play the song at the calculated next index
    playSong(userData.songs[nextSongIndex].id);
  }
};

/**
 * Finds the previous song in the list and plays it.
 * If it's the first song, it loops back to the last one.
 */
const playPreviousSong = () => {
   // Don't do anything if the playlist is empty
   if (userData.songs.length === 0) return;

   // If no song is currently selected, play the first one.
   if (userData.currentSong === null) {
     playSong(userData.songs[0].id);
   } else {
     // Find the index of the current song
     const currentSongIndex = getCurrentSongIndex();
     // Calculate the previous index. Add userData.songs.length before the modulo
     // to handle the case where currentSongIndex is 0, ensuring a positive result before wrapping.
     const previousSongIndex = (currentSongIndex - 1 + userData.songs.length) % userData.songs.length;
     // Play the song at the calculated previous index
     playSong(userData.songs[previousSongIndex].id);
   }
};

/**
 * Randomly rearranges the order of songs in the current playlist (userData.songs).
 */
const shuffle = () => {
  // Using the Fisher-Yates (aka Knuth) Shuffle algorithm for a proper random shuffle.
  // It iterates backwards through the array...
  for (let i = userData.songs.length - 1; i > 0; i--) {
    // ...picks a random index from 0 up to the current index 'i'...
    const j = Math.floor(Math.random() * (i + 1));
    // ...and swaps the element at 'i' with the element at the random index 'j'.
    [userData.songs[i], userData.songs[j]] = [userData.songs[j], userData.songs[i]];
  }

  // After shuffling, we need to know if the currently playing song is still in the list.
  // If it is, keep it as the currentSong. If it was deleted or wasn't playing, set currentSong to null.
  // Note: This line might be redundant if deleteSong handles currentSong correctly, but it's safe.
  userData.currentSong = userData.songs.find(song => song.id === userData.currentSong?.id) || null;
  // Reset the playback time if no song is current anymore
  if (!userData.currentSong) {
      userData.songCurrentTime = 0;
  }

  // Update the displayed playlist with the new shuffled order
  renderSongs(userData.songs);
  // Re-apply the highlight to the current song (if it still exists)
  highlightCurrentSong();
  // Update the play button's accessible text just in case
  setPlayButtonAccessibleText();
};

/**
 * Removes a song from the playlist based on its ID.
 * Handles stopping playback if the deleted song was the current one.
 * @param {number} id - The ID of the song to delete.
 */
const deleteSong = (id) => {
  // Find the index of the song to delete
  const songToDeleteIndex = userData.songs.findIndex(song => song.id === id);
  // If the song wasn't found, do nothing
  if (songToDeleteIndex === -1) return;

  // Check if the song being deleted is the one currently playing
  if (userData.currentSong?.id === id) {
    // If yes, stop the music and reset the current song state
    pauseSong();
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    // Filter out the song from the playlist *after* resetting state
    userData.songs = userData.songs.filter((song) => song.id !== id);
    // Update the player display (it will show "Select a song" now)
    setPlayerDisplay();
  } else {
     // If it's not the current song, just filter it out of the array
     userData.songs = userData.songs.filter((song) => song.id !== id);
  }

  // Re-draw the playlist without the deleted song
  renderSongs(userData.songs);
  // Make sure the highlighting is correct (removes highlight if current song was deleted)
  highlightCurrentSong();
  // Update accessible text
  setPlayButtonAccessibleText();
};

// --- UI Update Functions ---

/**
 * Updates the main player display (album art, title, artist).
 * Shows default text/image if no song is currently loaded.
 */
const setPlayerDisplay = () => {
  // Get the title/artist/art from the current song, or use default values if no song is loaded
  const currentTitle = userData.currentSong?.title || "Select a song";
  const currentArtist = userData.currentSong?.artist || "";
  const currentAlbumArt = userData.currentSong?.albumArtUrl || "images/default.jpg"; // Default local image if needed

  // Update the text content of the title and artist elements
  playerTitle.textContent = currentTitle;
  playerArtist.textContent = currentArtist;
  // Update the source of the album art image element
  albumArt.src = currentAlbumArt;

  // Set up an error handler for the album art image.
  // If the image fails to load (e.g., file not found)...
  albumArt.onerror = () => {
      console.warn(`Failed to load image: ${currentAlbumArt}`); // Log a warning in the console
      albumArt.onerror = null; // IMPORTANT: Remove the onerror handler to prevent potential infinite loops if the fallback also fails
      // ...set the image source to a reliable online placeholder.
      albumArt.src = 'https://placehold.co/256x256/181818/535353?text=No+Image';
      // Alternatively, you could point to a guaranteed local fallback: albumArt.src = 'images/default-error.jpg';
  };
};

/**
 * Adds a visual highlight to the currently playing song in the playlist.
 * Removes highlights from all other songs.
 */
const highlightCurrentSong = () => {
  // Get all the song list items in the playlist
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  // Try to find the specific list item for the current song using its ID
  const songToHighlight = document.getElementById(`song-${userData.currentSong?.id}`);

  // First, remove the 'aria-current' attribute (which the CSS uses for highlighting) from all songs.
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  // If the current song's element was found in the list...
  if (songToHighlight) {
    // ...add the 'aria-current="true"' attribute to highlight it.
    songToHighlight.setAttribute("aria-current", "true");
    // You could also uncomment this to make the playlist scroll to the current song:
    // songToHighlight.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

/**
 * Generates the HTML for the playlist based on the provided song array
 * and inserts it into the playlist container. Also handles the reset button logic.
 * @param {Array} array - The array of song objects to display.
 */
const renderSongs = (array) => {
  // Create the HTML string for all the songs using map() and join()
  const songsHTML = array
    .map((song)=> {
      // Using template literals for easier HTML structure
      // Added onclick to the whole <li> for a larger click target
      // Added tabindex="0" to make <li> focusable with keyboard
      return `
      <li id="song-${song.id}" class="playlist-song" tabindex="0" onclick="playSong(${song.id})">
        <div class="playlist-song-info">
            <span class="playlist-song-title">${song.title}</span>
            <span class="playlist-song-artist">${song.artist}</span>
        </div>
        <button onclick="event.stopPropagation(); deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z"/>
          </svg>
        </button>
      </li>
      `;
      // Note: event.stopPropagation() on the delete button prevents the click
      // from also triggering the playSong function on the parent <li>.
    })
    .join(""); // Join all the generated <li> strings together

  // Put the generated HTML into the playlist <ul>
  playlistSongs.innerHTML = songsHTML;

  // --- Reset Button Logic ---
  // Always clear out the reset button container first
  resetContainer.innerHTML = '';

  // Only add the reset button if the playlist is currently empty
  if (userData.songs.length === 0) {
    const resetButton = document.createElement("button");
    resetButton.id = "reset"; // Give it an ID for CSS styling
    resetButton.ariaLabel = "Reset playlist"; // Accessibility
    resetButton.textContent = "Reset Playlist"; // Text on the button
    // Add some basic styling classes (could rely purely on CSS via #reset id too)
    resetButton.className = "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-150 ease-in-out";
    // Add the button to its designated container div
    resetContainer.appendChild(resetButton);

    // Add the click listener for the reset button
    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs]; // Restore the playlist from the original full list
      userData.currentSong = null;    // Reset current song state
      userData.songCurrentTime = 0;
      pauseSong();                    // Make sure the player is visually paused
      renderSongs(sortSongs());       // Re-render the now full (and sorted) playlist
      setPlayerDisplay();             // Reset the main display area
      setPlayButtonAccessibleText();
      resetContainer.innerHTML = '';  // Remove the reset button itself after it's clicked
    });
  }
};

/**
 * Updates the aria-label for the play button to be more descriptive for screen readers.
 */
const setPlayButtonAccessibleText = () => {
  // Use the current song's title if available, otherwise use the first song's title, or default to "Play"
  const song = userData.currentSong || userData.songs[0];
  const label = song ? `Play ${song.title}` : "Play";

  // Set the aria-label attribute on the play button
  playButton.setAttribute("aria-label", label);
  // Pause button generally just needs "Pause"
  pauseButton.setAttribute("aria-label", "Pause");
};

/**
 * Finds the index (position) of the currently loaded song within the userData.songs array.
 * Returns -1 if no song is current or if the song isn't found (e.g., after deletion).
 * @returns {number} The index of the current song.
 */
const getCurrentSongIndex = () => {
    // If no song is current, we can't find an index
    if (!userData.currentSong) return -1;
    // Use findIndex to get the position of the song object in the array
    return userData.songs.findIndex(song => song.id === userData.currentSong.id);
};

/**
 * Sorts the current playlist (userData.songs) alphabetically by title.
 * Modifies the array in place and also returns it.
 * @returns {Array} The sorted array of songs.
 */
const sortSongs = () => {
  // Use the sort method on the array. It modifies the array directly.
  userData.songs.sort((a, b) => {
    // Standard comparison function for alphabetical sorting
    if (a.title < b.title) return -1; // a comes first
    if (a.title > b.title) return 1;  // b comes first
    return 0; // titles are equal
  });
  // Return the sorted array (though it was also sorted in place)
  return userData.songs;
};


// --- Event Listeners ---
// Set up what happens when buttons are clicked

// Play Button: Play the current song, or the first song if none is selected
playButton.addEventListener("click", () => {
  if (userData.currentSong === null && userData.songs.length > 0) {
    playSong(userData.songs[0].id);
  } else if (userData.currentSong !== null) {
    playSong(userData.currentSong.id); // Resumes the current song
  }
});

// Other Buttons: Just call their respective functions
pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffle);

// Keyboard Accessibility for Playlist: Play song on Enter/Space
playlistSongs.addEventListener('keydown', (event) => {
    // Check if the event happened on an element with the 'playlist-song' class
    if (event.target.classList.contains('playlist-song')) {
        // Check if the key pressed was Enter or Space
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // Stop space bar from scrolling the page
            // Get the song ID from the element's ID (e.g., "song-5" -> 5)
            const songId = parseInt(event.target.id.split('-')[1]);
            // If we successfully got a number ID, play that song
            if (!isNaN(songId)) {
                playSong(songId);
            }
        }
    }
});

// Automatically play the next song when the current one finishes
audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  // Make sure a song was actually playing and the playlist isn't empty
  if (currentSongIndex !== -1 && userData.songs.length > 0) {
      playNextSong(); // Simply play the next one (handles looping)
  } else {
      // If the playlist became empty or something went wrong, reset the player state
      userData.currentSong = null;
      userData.songCurrentTime = 0;
      pauseSong();
      setPlayerDisplay();
      highlightCurrentSong();
      setPlayButtonAccessibleText();
  }
});


// --- Initialisation ---
// This code runs once when the script first loads

renderSongs(sortSongs());       // Sort the initial song list and display it
setPlayerDisplay();             // Set the initial state of the player display (likely "Select a song")
setPlayButtonAccessibleText();  // Set the initial aria-label for the play button

