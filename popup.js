
chrome.tabs.query({
    active: true,currentWindow: true
}).then(tabs => {
    var tab = tabs[0];
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