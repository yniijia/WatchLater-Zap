/**
 * WatchLater Zap - Content Script
 * This script runs in the context of the YouTube page to delete Watch Later videos
 */

// Configuration
const CONFIG = {
  // Milliseconds to wait after clicking menu button
  MENU_CLICK_DELAY: 300,
  // Milliseconds to wait after clicking remove button
  REMOVE_CLICK_DELAY: 500,
  // Maximum batch size for processing videos
  BATCH_SIZE: 100,
  // Maximum retries for finding elements
  MAX_RETRIES: 5
};

// Main function to start the deletion process
async function startWatchLaterDeletion() {
  try {
    // Verify we're on the Watch Later playlist
    if (!isWatchLaterPage()) {
      sendErrorMessage('This doesn\'t appear to be a Watch Later playlist.');
      return;
    }

    // Get initial videos count
    let totalVideos = getVideoElements().length;
    let removedCount = 0;
    
    // Send initial progress
    sendProgressUpdate(removedCount, totalVideos);
    
    // Continue as long as there are videos
    while (true) {
      const videoElements = getVideoElements();
      
      // Check if we're done
      if (videoElements.length === 0) {
        break;
      }
      
      // If total changed (YouTube loaded more), update it
      if (videoElements.length > totalVideos - removedCount) {
        totalVideos = videoElements.length + removedCount;
      }
      
      // Process video removal
      const success = await removeVideo(videoElements[0]);
      
      if (success) {
        removedCount++;
        sendProgressUpdate(removedCount, totalVideos);
      } else {
        // If we can't remove a video, try scrolling to load more or break
        await scrollDown();
        
        // Get new count after scrolling
        const newCount = getVideoElements().length;
        
        // If no new videos appeared after scrolling, we're likely done
        if (newCount === 0 || newCount === videoElements.length) {
          break;
        }
      }
      
      // Small delay between operations
      await sleep(100);
    }
    
    // Send completion message
    sendCompletionMessage(removedCount);
    
  } catch (error) {
    console.error('WatchLater Zap Error:', error);
    sendErrorMessage(`An error occurred: ${error.message}`);
  }
}

// Check if we're on the Watch Later playlist page
function isWatchLaterPage() {
  return window.location.href.includes('youtube.com/playlist?list=WL');
}

// Get all video elements in the Watch Later playlist
function getVideoElements() {
  return document.querySelectorAll('ytd-playlist-video-renderer');
}

// Remove a single video from the playlist
async function removeVideo(videoElement) {
  let retries = 0;
  
  while (retries < CONFIG.MAX_RETRIES) {
    try {
      // Find and click the menu button
      const menuButton = videoElement.querySelector('button[aria-label="Action menu"]');
      if (!menuButton) {
        console.log('Menu button not found, retrying...');
        retries++;
        await sleep(300);
        continue;
      }
      
      // Click the menu button to open the dropdown
      menuButton.click();
      await sleep(CONFIG.MENU_CLICK_DELAY);
      
      // Find and click the "Remove from Watch Later" option
      const menuItems = document.querySelectorAll('tp-yt-paper-listbox ytd-menu-service-item-renderer');
      const removeButton = Array.from(menuItems).find(item => {
        const text = item.textContent.trim().toLowerCase();
        return text.includes('remove from') && text.includes('watch later');
      });
      
      if (!removeButton) {
        console.log('Remove button not found, retrying...');
        // Close the menu by clicking elsewhere
        document.body.click();
        retries++;
        await sleep(300);
        continue;
      }
      
      // Click the remove button
      removeButton.click();
      await sleep(CONFIG.REMOVE_CLICK_DELAY);
      
      return true;
    } catch (error) {
      console.error('Error removing video:', error);
      retries++;
      await sleep(500);
    }
  }
  
  return false;
}

// Scroll down to load more videos
async function scrollDown() {
  window.scrollBy(0, 500);
  return sleep(1000);
}

// Helper function to wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Send progress updates to the popup
function sendProgressUpdate(current, total) {
  chrome.runtime.sendMessage({
    type: 'progress',
    data: { current, total }
  });
}

// Send completion message to the popup
function sendCompletionMessage(removed) {
  chrome.runtime.sendMessage({
    type: 'complete',
    data: { removed }
  });
}

// Send error message to the popup
function sendErrorMessage(message) {
  chrome.runtime.sendMessage({
    type: 'error',
    data: { message }
  });
}

// Start the deletion process
startWatchLaterDeletion(); 