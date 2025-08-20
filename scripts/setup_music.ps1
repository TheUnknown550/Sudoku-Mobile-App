# Sudoku Background Music Setup Script for Windows
# Run this PowerShell script to set up copyright-free background music

Write-Host "🎵 Sudoku Background Music Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Create music directory
$musicDir = "assets\music"
if (!(Test-Path $musicDir)) {
    New-Item -ItemType Directory -Path $musicDir -Force
    Write-Host "📂 Created $musicDir directory" -ForegroundColor Green
} else {
    Write-Host "📂 Music directory already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎼 Recommended Copyright-Free Music Sources:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Kevin MacLeod (incompetech.com)" -ForegroundColor White
Write-Host "   - Search for 'Peaceful Piano' or 'Meditation'"
Write-Host "   - Download MP3 format"
Write-Host "   - Creative Commons licensed"
Write-Host ""
Write-Host "2. YouTube Audio Library" -ForegroundColor White
Write-Host "   - Go to: studio.youtube.com/channel/music"
Write-Host "   - Filter by 'Calm' mood"
Write-Host "   - Download any track you like"
Write-Host ""
Write-Host "3. Free Music Archive" -ForegroundColor White
Write-Host "   - Go to: freemusicarchive.org"
Write-Host "   - Search for 'ambient meditation'"
Write-Host "   - Look for CC0 licensed tracks"
Write-Host ""

# Create helpful README
$readmeContent = @"
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

## Quick Start:
For immediate testing, you can download this free track:
- Title: "Peaceful Piano" by Kevin MacLeod
- URL: https://incompetech.com/music/royalty-free/index.html?keywords=peaceful+piano
- License: Creative Commons

Or search YouTube Audio Library for "calm piano meditation"
"@

$readmeContent | Out-File -FilePath "$musicDir\README.md" -Encoding UTF8

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Next steps:" -ForegroundColor Cyan
Write-Host "1. Download a copyright-free music file"
Write-Host "2. Rename it to 'peaceful_piano.mp3'"
Write-Host "3. Place it in the assets\music\ folder"
Write-Host "4. Restart your Expo app"
Write-Host ""
Write-Host "🎵 The app will automatically play your music!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: Use Ctrl+C to copy the music sources above" -ForegroundColor Yellow

# Optionally open the music folder
$openFolder = Read-Host "Would you like to open the music folder now? (y/n)"
if ($openFolder -eq "y" -or $openFolder -eq "Y") {
    Start-Process $musicDir
}
