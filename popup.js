var tab, chart;
function updateChartData(x) {
    //chart.data.labels.push(label);
    document.getElementById("scoreHTML").innerHTML = x.totalString;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [x.totalAnal, x.totalAd];
    });
    chart.update();
}
function removeData() {
    //chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.length = 0;
    });
    chart.update();
}
function makeChart(x) {
    document.getElementById("scoreHTML").innerHTML = x.totalString;
    var scriptNum = x.totalTot;
    let yValues = [];

    switch (scriptNum >= 0) {
        case scriptNum >= 0:
            var ctx = document.getElementById('myChart').getContext('2d');
            yValues = [x.totalAnal, x.totalAd];
            var barColors = ["#f18931", "#ebdc3d"];
            break;
    }
    
    /*var analLab = x.totalAnal.toString() + " Analytics"; 
    var adLab = x.totalAd.toString() + " Ads";*/
        
    chart = new Chart(ctx, {
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

chrome.tabs.query({
    active: true,currentWindow: true
}).then(tabs => {
    tab = tabs[0];
    chrome.storage.session.get("tab"+tab.id).then(data => {
        try{
            makeChart(data["tab"+tab.id]);
        }catch(e) {
            //alert("Page is almost loaded")
        }
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [changeKey, { oldValue, newValue }] of Object.entries(changes)) {
    if (changeKey.includes(tab.id)) {
        if (chart) {
            updateChartData(newValue);
        }else {
            makeChart(newValue);
        }
    }
  }
});

let pause = document.getElementById("pause");
let resume = document.getElementById("resume");


chrome.storage.session.get("paused").then(data=> {
    if(data.paused) {
        resume.style.display = "initial";
        pause.style.display = "none";
        document.getElementById('blocked').innerHTML = "Not Blocked";
        
    }
});
pause.addEventListener('click', (e) => {
    chrome.storage.session.set({"paused": true});
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
    chrome.storage.session.set({"paused": false});
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

document.querySelector('#go-to-options').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});