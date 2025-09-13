# Music Files

Place your music files here with the following naming convention:

- `ambient-music.mp3` - Main audio file (MP3 format)
- `ambient-music.ogg` - OGG format (optional, for better browser compatibility)
- `ambient-music.wav` - WAV format (optional, for better quality)
- `tape-rec_sfx.mp3` - Tape recorder feedback sound effect (MP3 format)

## Supported Formats

The MusicPlayer component supports multiple audio formats:
- **MP3** (recommended) - Best compatibility
- **OGG** - Good for Firefox and other browsers
- **WAV** - High quality, larger file size

## File Requirements

- Keep file size reasonable (under 10MB recommended)
- Use good quality but compressed audio for web
- Consider using a loop-friendly track since the player loops by default

## How to Add Your Music

1. Rename your music file to `ambient-music.mp3`
2. Place it in this `public/music/` directory
3. The MusicPlayer will automatically detect and load it
4. Optionally add `.ogg` and `.wav` versions for better browser support

## How to Add Your SFX

1. Rename your tape recorder SFX file to `tape-rec_sfx.mp3`
2. Place it in this `public/music/` directory
3. The SFX will automatically play when you click play/pause or mute buttons
4. The SFX volume is set to 60% - you can adjust this in the MusicPlayer component if needed
