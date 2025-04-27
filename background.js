// Background script for handling events
chrome.runtime.onInstalled.addListener(() => {
    console.log('Merlin Clone extension installed');
});

// We're using the _execute_action command to trigger the popup via Ctrl+M
// The shortcut is defined in the manifest.json 

// Lắng nghe phím tắt Ctrl+M và gửi message tới content script để bật/tắt overlay
chrome.commands.onCommand.addListener((command) => {
    if (command === '_execute_action') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { toggleOverlay: true });
            }
        });
    }
}); 