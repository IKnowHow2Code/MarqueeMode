document.getElementById('marqueeButton').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "marquee" });
  });
  
  document.getElementById('autoMarquee').addEventListener('change', (e) => {
    chrome.storage.local.set({ autoMarquee: e.target.checked });
  });
  
  chrome.storage.local.get('autoMarquee', (data) => {
    document.getElementById('autoMarquee').checked = data.autoMarquee || false;
  });