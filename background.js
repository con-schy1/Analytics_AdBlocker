chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.local.clear();
});
chrome.tabs.onUpdated.addListener((tabId, tab)=> {
    if (tab.status == "complete") {
        chrome.tabs.sendMessage(tabId, {start: true});
    }
});

chrome.runtime.onMessage.addListener((request, sender) => {
    //console.log(request)
    chrome.storage.local.set({["tab"+sender.tab.id]:request}); 
    chrome.storage.local.get("tab"+sender.tab.id).then(dat => {
        
        if (request.scrptCount >= 20){
            var colorString = "#32a852";
            }
        else if (request.scrptCount >= 15){
                var colorString = "#8ECA2E";
        }
        else if (request.scrptCount >= 10){
                var colorString = "#f4e03a";
        }
        else if (request.scrptCount >= 5){
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
            text: request.scriptStr,
            tabId: sender.tab.id
        });
    });
});

// Clear Cache
chrome.tabs.onRemoved.addListener(tabId => {
    chrome.storage.local.get('tab'+tabId).then(data => {
        delete data['tab' + tabId];
    });
});


chrome.runtime.onInstalled.addListener(function (object) {
    let externalUrl = "https://ko-fi.com/globemallow#paypalModal";

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: externalUrl }, function (tab) {
            //console.log("New tab launched with http://yoursite.com/");
        });
    }
});