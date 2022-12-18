var tab;
chrome.tabs.query({
    active: true,currentWindow: true
}).then(tabs => {
    tab = tabs[0];
    chrome.storage.local.get("tab"+tab.id).then(data => {
        try{
 var x = data["tab"+tab.id];
            
            
document.getElementById("scoreHTML").innerHTML = x.totalString;
    
var scriptNum = x.totalTot;     

switch (scriptNum >= 0){
        
case scriptNum >= 0:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [x.totalAnal, x.totalAd];
var barColors = [
  "#f18931",
  "#ebdc3d",

];
    break;

}
            
/*var analLab = x.totalAnal.toString() + " Analytics"; 
var adLab = x.totalAd.toString() + " Ads";*/
            
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: [' Analytics', ' Ads'],
    //labels: [analLab, adLab],
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options:{
    plugins:{
     tooltips:{
         yAlign: 'top'
     }
  }
  }
});
    
        }
        catch(e) {
            //alert("Page is almost loaded")
        }
        });
    
});

let pause = document.getElementById("pause");
let resume = document.getElementById("resume");


chrome.storage.local.get("paused").then(data=> {
    if(data.paused) {
        resume.style.display = "initial";
        pause.style.display = "none";
        document.getElementById('blocked').innerHTML = "Not Blocked";
        
    }
});
pause.addEventListener('click', (e) => {
    chrome.storage.local.set({"paused": true});
    resume.style.display = "initial";
    pause.style.display = "none";
    document.getElementById('blocked').innerHTML = "Not Blocked";
/*    function refresh() {    
    setTimeout(function () {
        location.reload()
    }, 4000);

}*/
    chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: ['ruleset_1']});

    if (tab) {
        chrome.tabs.reload(tab.id);
        //refresh();
    }
});
resume.addEventListener('click', (e) => {
    chrome.storage.local.set({"paused": false});
    pause.style.display = "initial";
    resume.style.display = "none";
    document.getElementById('blocked').innerHTML = "Blocked";
/*    function refresh() {    
    setTimeout(function () {
        location.reload()
    }, 4000);
}*/
    //^Makes the extension refresh after 4 seconds
    
    chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ['ruleset_1']});
    
    if (tab) {
        chrome.tabs.reload(tab.id);
        //refresh();
    }
});