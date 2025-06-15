function extractJobData() {
    const jobTitle = document.querySelector('h1')?.innerText.trim() || '';
    const companyName = document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.innerText.trim() || '';
    const contactInterviewer = document.querySelector('.t-black.jobs-poster__name.text-body-medium-bold')?.innerText?.trim() || '';
    const website = document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.href || '';
    const jobLink = window.location.href;
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

// async function scrapeCompanyWebsite() {
//     // First get company LinkedIn URL
//     const companyLinkedInUrl = document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.href;
//     console.log(companyLinkedInUrl);
//     if (!companyLinkedInUrl) return null;

//     // Fetch company page (requires CORS proxy in browser extension)
//     const response = await fetch(`https://cors-anywhere.herokuapp.com/${companyLinkedInUrl}`);
//     const html = await response.text();

//     // Parse HTML to find website
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');
//     return doc.querySelector('.org-top-card-summary-info-list__info-item a')?.href;
// }

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
            return true;
        }
    }
});
