// MRU tab stack per window: Map<windowId, tabId[]>
// Most recently used tab is at the front (index 0).
const mruStacks = new Map();

// --- MRU stack maintenance ---

chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  pushToFront(windowId, tabId);
  // Any non-walk activation resets the walk state
  if (!inWalkSwitch) walkIndex = 0;
});

chrome.tabs.onRemoved.addListener((tabId, { windowId }) => {
  const stack = mruStacks.get(windowId);
  if (stack) {
    const idx = stack.indexOf(tabId);
    if (idx !== -1) stack.splice(idx, 1);
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  mruStacks.delete(windowId);
});

function pushToFront(windowId, tabId) {
  let stack = mruStacks.get(windowId);
  if (!stack) {
    stack = [];
    mruStacks.set(windowId, stack);
  }
  const idx = stack.indexOf(tabId);
  if (idx !== -1) stack.splice(idx, 1);
  stack.unshift(tabId);
}

// Initialize stacks for existing windows/tabs on install/startup
async function initStacks() {
  const windows = await chrome.windows.getAll({ populate: true });
  for (const win of windows) {
    const sorted = win.tabs
      .filter(t => t.type !== 'popup')
      .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
    mruStacks.set(win.id, sorted.map(t => t.id));
  }
}
initStacks();

// --- Tab switching ---

// Alt+Z: toggle between the two most recent tabs
chrome.action.onClicked.addListener(() => {
  toggleLastTwo();
});

chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_action') {
    toggleLastTwo();
  } else if (command === 'walk_down') {
    walkStack(1);
  } else if (command === 'walk_up') {
    walkStack(-1);
  }
});

async function toggleLastTwo() {
  try {
    walkIndex = 0;
    const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!currentTab) return;

    const stack = mruStacks.get(currentTab.windowId);
    if (!stack || stack.length < 2) return;

    await chrome.tabs.update(stack[1], { active: true });
  } catch (error) {
    // console.error('Error toggling tabs:', error);
  }
}

// Walk state: tracks position in the MRU stack during walk sessions.
// walkIndex 0 = origin tab (stack[0]). First press goes to stack[1].
let walkIndex = 0;
let inWalkSwitch = false;

// Shift+Alt+Z (direction=1): walk down (deeper into history)
// Ctrl+Alt+Z (direction=-1): walk back up (toward more recent)
async function walkStack(direction) {
  try {
    const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!currentTab) return;

    const stack = mruStacks.get(currentTab.windowId);
    if (!stack || stack.length < 2) return;

    const newIndex = walkIndex + direction;
    if (newIndex < 1 || newIndex >= stack.length) return;

    walkIndex = newIndex;

    inWalkSwitch = true;
    await chrome.tabs.update(stack[walkIndex], { active: true });
    inWalkSwitch = false;
  } catch (error) {
    // console.error('Error walking stack:', error);
  }
}
