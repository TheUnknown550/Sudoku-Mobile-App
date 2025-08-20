// Copyright-free background music configuration for Sudoku game
// These are all royalty-free options you can download and add to your assets/music folder

export interface MusicTrack {
  id: string;
  name: string;
  filename: string;
  artist: string;
  duration: number; // in seconds
  mood: 'calm' | 'focused' | 'ambient' | 'peaceful';
  source: string; // where to download
}

export const BACKGROUND_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'charm_anno_domini',
    name: 'Charm',
    filename: 'charm_music.mp3',
    artist: 'Anno Domini Beats',
    duration: 180,
    mood: 'calm',
    source: 'User provided'
  },
  {
    id: 'peaceful_piano',
    name: 'Peaceful Piano',
    filename: 'peaceful_piano.mp3',
    artist: 'Kevin MacLeod',
    duration: 180,
    mood: 'calm',
    source: 'incompetech.com'
  },
  {
    id: 'meditation_loop',
    name: 'Meditation Ambient',
    filename: 'meditation_ambient.mp3',
    artist: 'Free Music Archive',
    duration: 240,
    mood: 'peaceful',
    source: 'freemusicarchive.org'
  },
  {
    id: 'gentle_waves',
    name: 'Gentle Waves',
    filename: 'gentle_waves.mp3',
    artist: 'Zapsplat',
    duration: 300,
    mood: 'ambient',
    source: 'zapsplat.com'
  },
  {
    id: 'focus_ambient',
    name: 'Focus Ambient',
    filename: 'focus_ambient.mp3',
    artist: 'Freesound',
    duration: 200,
    mood: 'focused',
    source: 'freesound.org'
  }
];

// Default track to use (make sure you have this file)
export const DEFAULT_TRACK = BACKGROUND_MUSIC_TRACKS[0]; // Using Charm - Anno Domini Beats

// Helper function to get track by ID
export const getTrackById = (id: string): MusicTrack | undefined => {
  return BACKGROUND_MUSIC_TRACKS.find(track => track.id === id);
};

// Helper function to get tracks by mood
export const getTracksByMood = (mood: string): MusicTrack[] => {
  return BACKGROUND_MUSIC_TRACKS.filter(track => track.mood === mood);
};

/*
RECOMMENDED DOWNLOADS:

1. Kevin MacLeod - Incompetech.com
   - "Peaceful Piano" or "Meditation"
   - Creative Commons licensed
   - Perfect for concentration games

2. Free Music Archive
   - Search for "ambient meditation"
   - CC0 licensed tracks available

3. YouTube Audio Library
   - Filter by "Calm" and "No copyright"
   - Download as MP3

4. Zapsplat (free account required)
   - Great ambient and nature sounds
   - Perfect for background ambience

5. Freesound.org
   - Creative Commons tracks
   - Search for "ambient loop" or "meditation"

INSTRUCTIONS:
1. Download any of these tracks
2. Convert to MP3 if needed (keep under 5MB for mobile)
3. Place in assets/music/ folder
4. Update the filename in this config
5. The app will automatically use the track!
*/
