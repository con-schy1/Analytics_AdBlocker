//This code is protected under Apache-2.0 license
const MAXSITES = 14;

chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.session.clear();
});
chrome.tabs.onUpdated.addListener((tabId, tab)=> {
    if (tab.status == "complete") {
        chrome.tabs.sendMessage(tabId, {start: true});
    }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
    let data = await chrome.storage.session.get(null), storedAt = 99999999999999999999999, toRemove = null;
    if (Object.keys(data).length >= MAXSITES) {
        for (z in data) {
            if (data[z].storedAt < storedAt) {
                storedAt = data[z].storedAt;
                toRemove = z;
            }
        }

        chrome.storage.session.remove(toRemove);
    }

    chrome.storage.session.set({["tab"+sender.tab.id]:request}); 
    chrome.storage.session.get("tab"+sender.tab.id).then(dat => {
        
        if (request.totalTot <= 5){
            var colorString = "#32a852";
            }
        else if (request.totalTot <= 14){
                var colorString = "#8ECA2E";
        }
        else if (request.totalTot <= 24){
                var colorString = "#f4e03a";
        }
        else if (request.totalTot <= 35){
                var colorString = "#f18931";
        }
        else {
                var colorString = "#ff0d21";
        }
        
        chrome.action.setBadgeBackgroundColor({ 
            color: colorString,
            tabId: sender.tab.id
        });
        chrome.action.setBadgeText({
            text: request.totalString,
            tabId: sender.tab.id
        });
    });
});

// Clear Cache
chrome.tabs.onRemoved.addListener(tabId => {
    chrome.storage.session.get('tab'+tabId).then(data => {
        delete data['tab' + tabId];
    });
});


chrome.runtime.onInstalled.addListener(function (object) {
    let externalUrl = "https://github.com/con-schy1/Analytics_AdBlocker#readme";

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: externalUrl }, function (tab) {
            //console.log("New tab launched with http://yoursite.com/");
        });
    }
});