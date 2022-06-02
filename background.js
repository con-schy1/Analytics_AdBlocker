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
        
        if (request.finalScore >= 92){
            var colorString = "#32a852";
            }
        else if (request.finalScore >= 78){
                var colorString = "#8ECA2E";
        }
        else if (request.finalScore >= 67){
                var colorString = "#f4e03a";
        }
        else if (request.finalScore >= 55){
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
            text: request.finalGrade,
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
