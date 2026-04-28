# AM-w-pl[2] Web Player

<pre>
           __  __                        _____  _ ___ ___ ___ 
     /\   |  \/  |                      |  __ \| |  _|__ \_  |
    /  \  | \  / |________      ________| |__) | | |    ) || |
   / /\ \ | |\/| |______\ \ /\ / /______|  ___/| | |   / / | |
  / ____ \| |  | |       \ V  V /       | |    | | |  / /_ | |
 /_/    \_\_|  |_|        \_/\_/        |_|    |_| |_|____|| |
                                                 |___|   |___|          
</pre>


A full-stack web music player built with React and Node.js, integrating JioSaavn for streaming and Musixmatch for synchronized lyrics.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)

---

## Features

- Stream music from JioSaavn
- Synchronized lyrics with karaoke-style syllable highlighting (word-by-word and character-by-character)
- Browse albums, artists, playlists, and radio stations
- Queue management with shuffle and repeat modes
- Search across all content types
- Dynamic background based on album art
- Responsive design for desktop and mobile

---


### Audio Streaming Flow

<pre>
User selects track
       |
       v
JioSaavn API --> Backend Proxy --> JioSaavn CDN
                                        |
                                        v
                                HTML5 Audio Element
</pre>

### Lyrics Fetching Flow (5-Phase Fallback)

<pre>
Phase 1: JioSaavn native lyrics (fastest)
                 ↓   (if no lyrics)
Phase 2: Musixmatch with ISRC code
                 ↓   (if no match)
Phase 3: Musixmatch with metadata search
                 ↓   (if no match)
Phase 4: MusicBrainz ISRC lookup
                 ↓   (if no match)
Phase 5: LRCLIB.net (open-source fallback)
</pre>

---

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. **Clone and install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:3001
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:8080
   ```

### Environment Setup

Create a `.env` file in the frontend directory:
```env
VITE_PROXY_URL=http://localhost:3001
```

---

## Project Structure

<pre>
.
├── backend/                    # Express.js CORS proxy server
│   ├── proxy-server.js         # Main server file
│   └── package.json
│
├── frontend/                   # React (Vite) frontend app
│   ├── src/
│   │   ├── components/
│   │   │   ├── player/         # Music player components
│   │   │   ├── jiosaavn/       # JioSaavn-specific components
│   │   │   └── ui/             # ui component library
│   │   ├── context/
│   │   │   ├── PlayerContext   # Audio playback state
│   │   │   └── LibraryContext  # Custom Curated content
│   │   ├── lib/
│   │   │   ├── jiosaavn-api.ts # JioSaavn scrapped wrapper
│   │   │   └── musixmatch-client.ts  # Musixmatch API client
│   │   ├── integrations/
│   │   │   └── lrclib-musicbrainz/  # Lyrics fallback system
│   │   └── pages/              # Route pages
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
</pre>

## License

Private project. Source code not licensed for reuse.
