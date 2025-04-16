#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p public/sounds

# Download spinning wheel sound (from freesound.org)
curl -L "https://freesound.org/data/previews/320/320873_5260872-lq.mp3" -o public/sounds/spin.mp3

# Download winning sound (from freesound.org)
curl -L "https://freesound.org/data/previews/320/320873_5260872-lq.mp3" -o public/sounds/win.mp3

echo "Sound files downloaded successfully!" 