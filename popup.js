
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
  "#32a852",
  "#ff0d21",

];
    break;
        
/*case scriptNum == 39:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [39, 1];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
        
case scriptNum == 38:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [38, 2];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
        
case scriptNum == 37:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [37, 3];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
        
case scriptNum == 36:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [36, 4];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
        
case scriptNum == 35:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [35, 5];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 34:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [34, 6];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 33:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [33, 7];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 32:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [32, 8];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 31:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [31, 9];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 30:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [30, 10];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 29:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [29 , 11];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 28:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [28 , 12];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 27:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [27 , 13];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 26:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 14];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 25:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 15];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 24:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 16];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 23:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 17];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 22:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 18];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 21:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 19];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 20:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 20];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 19:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 21];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 18:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 22];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 17:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 23];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 16:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 24];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 15:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 25];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 14:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 26];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 13:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 27];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 12:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 28];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 11:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 29];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 10:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 30];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 9:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 31];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 8:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 32];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 7:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 33];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 6:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 34];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 5:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 35];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
        
case scriptNum == 4:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 36];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
        
case scriptNum == 3:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 37];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
        
case scriptNum == 2:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 37];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
        
case scriptNum == 1:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [scriptNum , 38];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
        
case scriptNum == 0:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [40 , 0];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;*/

}
            
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ['Analytics', 'Ads'],
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options:{
     tooltips:{
         enabled: true,
     }
  }
});
    
        }
        catch(e) {
            //alert("Page is almost loaded")
        }
        });
    
});