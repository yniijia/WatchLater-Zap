#!/bin/bash
# This script generates PNG icons from the SVG icon for Chrome extension

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is required but not installed. Please install it first."
    echo "On macOS: brew install imagemagick"
    echo "On Ubuntu/Debian: sudo apt-get install imagemagick"
    exit 1
fi

# Source SVG file
SVG_FILE="icons/icon.svg"

# Check if the SVG file exists
if [ ! -f "$SVG_FILE" ]; then
    echo "Error: SVG file not found at $SVG_FILE"
    exit 1
fi

# Generate icon sizes
convert -background none "$SVG_FILE" -resize 16x16 icons/icon16.png
convert -background none "$SVG_FILE" -resize 48x48 icons/icon48.png
convert -background none "$SVG_FILE" -resize 128x128 icons/icon128.png

echo "PNG icons generated successfully in the icons directory." 