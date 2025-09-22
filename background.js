// Extension initialization
// console.log('Tab Navigator extension loaded');

// Handle action button click
chrome.action.onClicked.addListener((tab) => {
  // console.log('Action button clicked');
  switchToMostRecentTab();
});

// Handle keyboard command
chrome.commands.onCommand.addListener((command) => {
  // console.log('Command received:', command);
  if (command === '_execute_action') {
    // console.log('Alt+Z command triggered at', new Date().toISOString());
    // Switch to most recent tab
    switchToMostRecentTab();
  }
});

// Switch to the most recently used tab by querying Chrome directly
async function switchToMostRecentTab() {
  try {
    // Get all tabs
    const tabs = await chrome.tabs.query({});
    
    if (tabs.length < 2) {
      // console.log('Not enough tabs to switch');
      return;
    }
    
    // Get current active tab
    const currentTab = tabs.find(tab => tab.active);
    if (!currentTab) {
      // console.log('No active tab found');
      return;
    }
    
    // console.log('Current tab:', currentTab.id, 'Total tabs:', tabs.length);
    
    // Sort tabs by lastAccessed timestamp (most recent first)
    const sortedTabs = tabs
      .filter(tab => tab.type !== 'popup') // Filter out popup windows
      .sort((a, b) => {
        // Convert lastAccessed to Date objects for comparison
        const timeA = new Date(a.lastAccessed || 0);
        const timeB = new Date(b.lastAccessed || 0);
        return timeB - timeA; // Most recent first
      });
    
    // console.log('Sorted tabs by lastAccessed:', sortedTabs.map(t => ({ id: t.id, title: t.title, lastAccessed: t.lastAccessed })));
    
    // Find the most recently used tab that's not the current one
    let mostRecentTab = null;
    for (const tab of sortedTabs) {
      if (tab.id !== currentTab.id) {
        mostRecentTab = tab;
        break;
      }
    }
    
    if (mostRecentTab) {
      // console.log('Switching to most recent tab:', mostRecentTab.id, 'Title:', mostRecentTab.title);
      await chrome.tabs.update(mostRecentTab.id, { active: true });
    } else {
      // console.log('No recent tabs to switch to');
    }
  } catch (error) {
    // console.log('Error switching tabs:', error);
  }
}

 