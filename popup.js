document.getElementById("add").addEventListener("click", function () {
  const fullSiteUrl = document.getElementById("website").value.trim();
  if (!fullSiteUrl) {
    alert("Please enter a website to add.");
    return;
  }
  const site = new URL(fullSiteUrl).href.slice(new URL(fullSiteUrl).protocol.length + 2);
  if (!site) {
    alert("Please enter a website to add.");
    return;
  }
  chrome.storage.sync.get(["blockedSites"], function (result) {
    let sites = result.blockedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      chrome.storage.sync.set({ blockedSites: sites }, function () {
        if (chrome.runtime.lastError) {
          alert("Error adding website: " + chrome.runtime.lastError.message);
        } else {
          updateSiteList(sites);
          alert("Website added successfully!");
          document.getElementById("website").value = "";
        }
      });
    } else {
      alert("Website already in the list.");
    }
  });
});

function updateSiteList(sites) {
  const listElement = document.getElementById("siteList");
  listElement.innerHTML = "";
  sites.forEach((site) => {
    const listItem = document.createElement("li");
    listItem.textContent = site;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = function () {
      removeSite(site);
    };
    listItem.appendChild(removeButton);
    listElement.appendChild(listItem);
  });
}

function removeSite(site) {
  chrome.storage.sync.get(["blockedSites"], function (result) {
    let sites = result.blockedSites || [];
    const index = sites.indexOf(site);
    if (index > -1) {
      sites.splice(index, 1);
      chrome.storage.sync.set({ blockedSites: sites }, function () {
        if (chrome.runtime.lastError) {
          alert("Error removing website: " + chrome.runtime.lastError.message);
        } else {
          updateSiteList(sites);
          alert("Website removed successfully!");
        }
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["blockedSites"], function (result) {
    updateSiteList(result.blockedSites || []);
  });
});
