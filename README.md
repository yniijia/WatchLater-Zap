# WatchLater Zap

A Chrome extension that lets you delete all videos from your YouTube "Watch Later" playlist with a single click.

## Features

- One-click deletion of all videos in your YouTube Watch Later playlist
- Real-time progress tracking
- Clean, modern UI
- Works with large playlists (handles thousands of videos)
- Automatically detects YouTube Watch Later pages

## Installation

### From Source (Developer Mode)

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The WatchLater Zap extension should now appear in your extensions list

### From Chrome Web Store

*(Coming soon)*

## Usage

1. Navigate to your YouTube Watch Later playlist page: [https://www.youtube.com/playlist?list=WL](https://www.youtube.com/playlist?list=WL)
2. Click the WatchLater Zap extension icon in your Chrome toolbar
3. Click the "Delete All Videos" button in the popup
4. Wait for the process to complete - you'll see a progress indicator while videos are being removed

## How It Works

The extension uses the YouTube page's own UI elements to automate the process of removing videos:

1. It identifies each video in the playlist
2. For each video, it:
   - Clicks the menu button
   - Selects the "Remove from Watch Later" option
   - Waits for the video to be removed
   - Updates the progress indicator
3. It continues until all videos are removed

## Notes

- The extension requires permission to access and modify content on youtube.com
- The removal process is sequential and may take some time for large playlists
- YouTube's UI may change over time, which could affect the extension's functionality

## Development

The extension uses:
- Chrome Manifest V3
- Modern JavaScript (ES6+)
- Clean, responsive CSS

## License

MIT 