chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ autoMarquee: false });
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.local.get('autoMarquee', (data) => {
        if (data.autoMarquee) {
          chrome.tabs.sendMessage(tabId, { action: "marquee" });
        }
      });
    }
  });