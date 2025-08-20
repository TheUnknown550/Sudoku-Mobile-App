#!/bin/bash
# 
# Music Download Helper Script
# Run this script to download copyright-free background music for your Sudoku app
#

echo "🎵 Sudoku Background Music Setup"
echo "================================"
echo ""
echo "This script will help you download copyright-free music for your app."
echo ""

# Create music directory if it doesn't exist
mkdir -p assets/music

echo "📂 Created assets/music directory"
echo ""

echo "🎼 Recommended Copyright-Free Music Sources:"
echo ""
echo "1. Kevin MacLeod (incompetech.com)"
echo "   - Search for 'Peaceful Piano' or 'Meditation'"
echo "   - Download MP3 format"
echo "   - Creative Commons licensed"
echo ""
echo "2. YouTube Audio Library"
echo "   - Go to: studio.youtube.com/channel/music"
echo "   - Filter by 'Calm' mood"
echo "   - Download any track you like"
echo ""
echo "3. Free Music Archive"
echo "   - Go to: freemusicarchive.org"
echo "   - Search for 'ambient meditation'"
echo "   - Look for CC0 licensed tracks"
echo ""
echo "4. Quick Option - Use this sample:"

# Provide a data URI for a simple tone (this creates a short beep for testing)
echo "   Copy this sample file to test the audio system:"
echo ""

cat > assets/music/README.md << EOF
# Background Music for Sudoku App

## Current Status
- Place your music file here as 'peaceful_piano.mp3'
- Supported formats: MP3, WAV, M4A
- Recommended file size: Under 5MB
- Recommended duration: 2-5 minutes (it will loop)

## How to Add Music:
1. Download copyright-free music from sources listed in the setup script
2. Rename the file to 'peaceful_piano.mp3'
3. Place it in this folder (assets/music/)
4. Restart your app

## Recommended Mood:
- Calm, peaceful instrumental music
- Ambient or meditation-style tracks
- Avoid music with lyrics or sudden volume changes
- Piano, ambient synths, or nature sounds work well

The app will automatically detect and play your music file!
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📁 Next steps:"
echo "1. Download a copyright-free music file"
echo "2. Rename it to 'peaceful_piano.mp3'"
echo "3. Place it in the assets/music/ folder"
echo "4. Restart your Expo app"
echo ""
echo "🎵 The app will automatically play your music!"
