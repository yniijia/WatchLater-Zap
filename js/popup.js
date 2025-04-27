// Communication port with the content script
let port = null;

// Initialize when the popup is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const zapButton = document.getElementById('zap-btn');
  
  // Check if we're on a YouTube Watch Later page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isWatchLaterPage = tab.url.includes('youtube.com/playlist?list=WL');
  
  if (!isWatchLaterPage) {
    showError('Please navigate to your YouTube Watch Later playlist first.');
    zapButton.disabled = true;
    return;
  }
  
  // Set up click handler
  zapButton.addEventListener('click', handleZapClick);
});

// Handle the click on the Delete All button
async function handleZapClick() {
  const zapButton = document.getElementById('zap-btn');
  
  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  try {
    // Disable button while processing
    zapButton.disabled = true;
    
    // Show progress UI
    document.getElementById('progress').classList.remove('hidden');
    document.getElementById('status').textContent = 'Initializing...';
    
    // Execute the content script to start the deletion process
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['js/content.js']
    });
    
    // Set up message listener for progress updates
    chrome.runtime.onMessage.addListener((message, sender) => {
      if (sender.tab && sender.tab.id === tab.id) {
        handleProgressUpdate(message);
      }
    });
    
  } catch (error) {
    showError(`Error: ${error.message}`);
    zapButton.disabled = false;
  }
}

// Handle progress updates from the content script
function handleProgressUpdate(message) {
  const { type, data } = message;
  
  switch (type) {
    case 'progress':
      updateProgress(data.current, data.total);
      break;
    case 'complete':
      showComplete(data.removed);
      break;
    case 'error':
      showError(data.message);
      document.getElementById('zap-btn').disabled = false;
      break;
  }
}

// Update the progress bar and status text
function updateProgress(current, total) {
  const progressBar = document.getElementById('progress-bar');
  const statusText = document.getElementById('status');
  
  const percentage = Math.min(100, Math.round((current / total) * 100));
  progressBar.style.width = `${percentage}%`;
  statusText.textContent = `Removing videos... ${current}/${total}`;
}

// Show completion message
function showComplete(count) {
  const progressBar = document.getElementById('progress-bar');
  const statusText = document.getElementById('status');
  
  progressBar.style.width = '100%';
  progressBar.style.backgroundColor = 'var(--success)';
  statusText.textContent = `Success! Removed ${count} videos.`;
  
  // Re-enable button after a delay
  setTimeout(() => {
    document.getElementById('zap-btn').disabled = false;
  }, 2000);
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  document.getElementById('progress').classList.add('hidden');
} 