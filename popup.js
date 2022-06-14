
chrome.tabs.query({
    active: true,currentWindow: true
}).then(tabs => {
    var tab = tabs[0];
    chrome.storage.local.get("tab"+tab.id).then(data => {
        try{
 var x = data["tab"+tab.id];
            
            
document.getElementById("scoreHTML").innerHTML = x.total;
    
var scriptNum = x.total;     

switch (scriptNum >= 0){
    
case scriptNum >= 20:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [100, 0];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
        
case scriptNum == 19:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [95, 5];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 18:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [90, 10];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
 
case scriptNum == 17:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [85, 15];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
        
case scriptNum == 16:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [80, 20];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;

case scriptNum == 15:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [7 , 3];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 14:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [7 , 3];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;  

case scriptNum == 13:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [65 , 5];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 12:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [60 , 40];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 11:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [55 , 45];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 10:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [50 , 50];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 9:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [45 , 45];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 8:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [40 , 60];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 7:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [35 , 65];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 6:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [30 , 70];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;
        
case scriptNum == 6:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [25 , 75];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 5:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [20 , 80];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 4:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [15 , 85];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 3:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [10 , 90];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case scriptNum == 2:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [5 , 95];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;

case scriptNum == 1:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [0 , 100];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
        
case scriptNum == 0:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [0 , 100];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;

}
            
new Chart(ctx, {
  type: "doughnut",
  data: {
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options:{
     tooltips:{
         enabled: false,
     } 
  }
});
    
        }
        catch(e) {
            //alert("Page is almost loaded")
        }
        });
    
});