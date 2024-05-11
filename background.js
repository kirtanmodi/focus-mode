chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.storage.sync.get(["blockedSites"], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Failed to retrieve blocked sites:", chrome.runtime.lastError.message);
      } else {
        enforceSiteBlocking(tab, result.blockedSites);
      }
    });
  }
});

function enforceSiteBlocking(tab, sites) {
  if (!sites || sites.length === 0) {
    console.log("No sites to block.");
    return;
  }
  let url = new URL(tab.url);
  let fullUrl = url.href.slice(url.protocol.length + 2);

  if (sites.some((site) => fullUrl.includes(site))) {
    chrome.tabs.remove(tab.id, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to remove tab:", chrome.runtime.lastError.message);
      } else {
        console.log("Blocked and removed site:", fullUrl);
      }
    });
  }
}
