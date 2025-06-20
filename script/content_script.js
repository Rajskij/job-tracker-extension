chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("✅ Content script injected!");
    if (message.type === 'scrape_linkedin') {
        try {
            const jobData = extractJobData();
            console.log(jobData);
            sendResponse(jobData);
        } catch (e) {
            console.error("Scraping failed:", e);
            sendResponse({ error: e.message });
        }
    }
    return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'scrape_indeed') {
        try {
            console.log('Start scrapping');
            const jobData = extractIndeedJobData();
            console.log('Scraped Indeed job:', jobData);
            sendResponse(jobData);
        } catch (e) {
            console.error("Indeed scraping failed:", e);
            sendResponse({ error: e.message });
        }
    }
    return true; // Keep message channel open for async response
});

function extractJobData() {
    const jobTitle = document.querySelector('h1')?.innerText.trim() || '';
    const companyName = document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.innerText.trim() || '';
    const contactInterviewer = document.querySelector('.t-black.jobs-poster__name.text-body-medium-bold')?.innerText?.trim() || '';
    const website = document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.href || '';
    const jobLink = normalizeLinkedInJobUrl(window.location.href);
    const profile = document.querySelector('.jobs-poster__name')?.closest('a')?.href || '';
    const location = document.querySelector('.t-black--light.mt2 span > span:first-child')?.textContent?.trim() || '';

    return {
        title: jobTitle,
        company: companyName,
        contact: contactInterviewer,
        website,
        jobLink,
        profile,
        location
    };
}

// Main data extraction function
function extractIndeedJobData() {
    // Wait for critical elements to load (handles Indeed's dynamic rendering)
    const jobTitle = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]')?.textContent?.trim();
    const websiteLink = document.querySelector('span.css-1ygeylu.e1wnkr790 > a.css-1s1odts.e19afand0')?.href;
    const jobLink = cleanWebsiteLink(window.location.href);
    const companyElement = document.querySelector('[data-company-name="true"]');
    const contact = document.querySelector('.jobsearch-InlineCompanyRating + div')?.textContent?.trim() || '';
    const locationElement = document.querySelector(`
        [data-testid="inlineHeader-companyLocation"] [data-testid="job-location"],
        [data-testid="job-location"]
    `)?.textContent?.trim() || '';

    return {
        title: jobTitle,
        company: companyElement?.textContent?.trim() || '',
        contact,
        website: cleanWebsiteLink(websiteLink),
        jobLink,
        profile: extractIndeedProfile(),
        location: cleanLocationString(locationElement)
    };
}

function extractIndeedProfile() {
    const profileLink = document.querySelector('.jobsearch-CompanyInfoContainer a[href*="/cmp/"]');
    return profileLink?.href || '';
}

function cleanLocationString(location) {
    return location
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .replace(/,(\S)/g, ', $1') // Ensure space after commas
        .trim();
}

function cleanWebsiteLink(websiteLink) {
    let link;
    if (websiteLink) {
        link = websiteLink.split('?')[0];
    }
    return link;
} 

function normalizeLinkedInJobUrl(url) {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.pathname.startsWith('/jobs/view/')) {
      return url.split('?')[0]; // Remove any query parameters
    }
    
    if (urlObj.pathname.startsWith('/jobs/collections/')) {
      const jobId = urlObj.searchParams.get('currentJobId');
      if (jobId) {
        return `https://www.linkedin.com/jobs/view/${jobId}/`;
      }
    }
    
    return url.split('?')[0];
  } catch {
    return url; // Return original if URL parsing fails
  }
}
