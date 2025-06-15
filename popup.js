document.getElementById('auth').addEventListener('click', async () => {
  console.log('hit click')
  chrome.runtime.sendMessage({ type: 'login' });
});

document.getElementById('data-btn').addEventListener('click', async () => {
  chrome.runtime.sendMessage({ type: 'addData' }, (response) => {
    console.log('Data request sent, response:', response);
  });
})

document.getElementById('grab').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'scrape_linkedin' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Scrape error:", chrome.runtime.lastError.message);
      } else {
        console.log("✅ Got scraped data:", response);
        chrome.runtime.sendMessage({
          type: 'addDataFromLinkedIn',
          payload: response
        });
      }
    });
  });
});
