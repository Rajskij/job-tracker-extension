document.getElementById('login').addEventListener('click', async () => {
  console.log('Pressed login button')
  chrome.runtime.sendMessage({ type: 'login' });
});

document.getElementById('logout').addEventListener('click', () => {
  console.log('Hit logout button');
  chrome.runtime.sendMessage({ type: 'logout' });
});

document.getElementById('grab_linkedin').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'scrape_linkedin' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Scrape error:", chrome.runtime.lastError.message);
        alert(`Scrape error: ${chrome.runtime.lastError.message}`);
      } else {
        console.log("✅ Got scraped data:", response);
        alert(`Success. Got scraped data`);
        chrome.runtime.sendMessage({ type: 'addData', payload: response });
      }
    });
  });
});

document.getElementById('grab_indeed').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'scrape_indeed' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Scrape error:", chrome.runtime.lastError.message);
        alert(`Scrape error: ${chrome.runtime.lastError.message}`);
      } else {
        console.log("✅ Got scraped data:", response);
        alert(`Success. Got scraped data`);
        chrome.runtime.sendMessage({ type: 'addData', payload: response });
      }
    });
  });
});
