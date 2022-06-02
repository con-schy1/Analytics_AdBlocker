
chrome.tabs.query({
    active: true,currentWindow: true
}).then(tabs => {
    var tab = tabs[0];
    chrome.storage.local.get("tab"+tab.id).then(data => {
        try{
 var x = data["tab"+tab.id];
            
            
document.getElementById("scoreHTML").innerHTML = x.finalGrade;
            
    
// CO2 + KWH Calculations - used from https://github.com/carbonalyser/Carbonalyser
    
const defaultCarbonIntensityFactorIngCO2PerKWh = 519;
const kWhPerByteDataCenter = 0.000000000072;
const kWhPerByteNetwork = 0.000000000152;
const kWhPerMinuteDevice = 0.00021;

var kwhDCT = 0;
var GESDCT = 0;
var kwhNT = 0;
var GESNT = 0;
var kwhDT = 0;
var GESDT = 0;

/*kwhDCT = x.decodedBodySizeChart*kWhPerByteDataCenter;
GESDCT = kwhDCT*defaultCarbonIntensityFactorIngCO2PerKWh;
kwhNT = x.decodedBodySizeChart*kWhPerByteNetwork;
GESNT = kwhNT*defaultCarbonIntensityFactorIngCO2PerKWh;
kwhDT = x.duration*kWhPerMinuteDevice;
GESDT = kwhDT*493;

var kwhTotal = 0;
var co2Total = 0;

kwhTotal = (((1000*(kwhDCT+kwhNT+kwhDT))/1000)/2);
co2Total = ((GESDCT+GESNT+GESDT)/2).toPrecision(1);*/

kwhDCT = x.transferSizeChart*kWhPerByteDataCenter;
GESDCT = kwhDCT*defaultCarbonIntensityFactorIngCO2PerKWh;
kwhNT = x.transferSizeChart*kWhPerByteNetwork;
GESNT = kwhNT*defaultCarbonIntensityFactorIngCO2PerKWh;
kwhDT = x.duration*kWhPerMinuteDevice;
GESDT = kwhDT*493;

var kwhTotal = 0;
var co2Total = 0;

kwhTotal = (((1000 * (kwhDCT + kwhNT + kwhDT)) / 1000) / 2);
co2Total = ((GESDCT + GESNT + GESDT) / 2).toPrecision(1);
    
document.getElementById("co2Total").innerHTML = co2Total + "g";

document.getElementById("kwhTotal").innerHTML = kwhTotal.toPrecision(2);
    

var scoreDiff = 100-x.finalScore;      

switch (x.finalScore >= 0){
    
case x.finalScore >= 92:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#32a852",
  "#f2f2f2",

];
    break;
      case x.finalScore >= 78:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#8ECA2E",
  "#f2f2f2",

];
    break;
    
   case x.finalScore >= 70:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [x.finalScore, scoreDiff];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;

case x.finalScore >= 67:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [6 , 4];
var barColors = [
  "#ebdc3d",
  "#f2f2f2",

];
    break;  
        
 case x.finalScore >= 64:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [5 , 5];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;
        
case x.finalScore >= 55:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [4 , 6];
var barColors = [
  "#f18931",
  "#f2f2f2",

];
    break;


    case x.finalScore >= 50:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [3 , 7];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
    
case x.finalScore >= 40:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [2 , 8];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;
    
case x.finalScore < 40:
var ctx = document.getElementById('myChart').getContext('2d');
var yValues = [1 , 9];
var barColors = [
  "#ff0d21",
  "#f2f2f2",

];
    break;

}
    


/*new Chart(ctx, {
  type: "doughnut",
  data: {
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  }
});*/
            
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
    
// Factoid____________________________________________________________________
    
var co2_breath = co2Total * 0.5;

var treeAbsorb = Math.round(co2Total / 2);

var co2_breath = co2_breath.toString();

var treeAbsorb = treeAbsorb.toString();
            
var co2_candle = Math.round((co2Total / 1.6)*10);

var co2_candle = co2_candle.toString();
            
var co2_lighter = Math.round((co2Total/0.25)*60);

var co2_lighter = co2_lighter.toString();
            
var co2_textMessage = (co2Total / .014).toPrecision(3);
            
var co2_textMessage = co2_textMessage.toString();
            
//co2 metrics

var co2_MoreThan3 = [co2_breath, treeAbsorb, co2_candle];

var co2_3g = ['About the amount of CO2 released by a can of pop','It takes 1 mature tree 1.5 hours to absorb the CO2 emitted on page load', 'It would take 6 minutes of human breathing to emit the same amount of CO2', 'Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes', 'Same amount of CO2 released as using a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var co2_2g = ['Amount of CO2 released as burning 1/3 of a charcoal briquette','About the amount of CO2 released by a can of pop','It would take 4 minutes of human breathing to emit the same amount of CO2','It would take 1 mature tree 1 hour to absorb the CO2 emitted*','Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes', 'Same amount of CO2 released as using a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var co2_1g = ['It would take 2 minutes of human breathing to emit the same amount of CO2','It takes 1 mature tree 30 minutes to absorb the CO2 emitted on page load','Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes.', 'Same amount of CO2 released as using a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var co2_halfg = ['It would take 1 minutes of human breathing to emit the same amount of CO2.','It takes 1 mature tree 15 minutes to absorb the CO2 emitted on page load.','Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes.', 'Same amount of CO2 released as burning a plastic lighter for '+ co2_lighter + ' seconds.', 'Sending ' + co2_textMessage + ' text messages takes the same amount of CO2 as loading this page.'];

var kwh_IncanLightBulb = (kwhTotal / 0.00001).toPrecision(3);

var kwh_IncanLightBulb = kwh_IncanLightBulb.toString();

var kwh_LEDLightBulb = (kwhTotal / .0000023).toPrecision(3);
            
var kwh_LEDLightBulb = kwh_LEDLightBulb.toString();
            
var kwh_MicrowaveSec = (kwhTotal / .0001).toPrecision(2);
            
var kwh_MicrowaveSec = kwh_MicrowaveSec.toString();
            
var kwh_MiniFridgeSec = (kwhTotal / .00001).toPrecision(2);
            
var kwh_MiniFridgeSec = kwh_MiniFridgeSec.toString();

var kwh_AAABattery = Math.round((kwhTotal/.0018)*100);
            
var kwh_AAABattery = kwh_AAABattery.toString();

var kwh_OneCalorie = Math.round(kwhTotal/.001);
            
var kwh_OneCalorie = kwh_OneCalorie.toString();

var kwh_CellPhoneCharge = Math.round((kwhTotal/.006)*100);
            
var kwh_CellPhoneCharge = kwh_CellPhoneCharge.toString();

var kwh_LCDTVCharge = (kwhTotal/.00003).toPrecision(2);

var kwh_LCDTVCharge = kwh_LCDTVCharge.toString();

var kwh_CeilingFan = (kwhTotal/.000015).toPrecision(2);

var kwh_CeilingFan = kwh_CeilingFan.toString();
            
var kwh_ChristmasLights = (kwhTotal/.000036).toPrecision(2);

var kwh_ChristmasLights = kwh_ChristmasLights.toString();
        
var kwh_TurnSignal = Math.round(kwhTotal/.00008);

var kwh_TurnSignal = kwh_TurnSignal.toString();

var kwh_Cal = (kwhTotal * 860.42).toPrecision(2);
var amountOfSteps = Math.round(kwh_Cal*20);
            
            
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var co2SelectorMoreThan3 = getRandomInt(3);
var co2Selector3 = getRandomInt(6);
var co2Selector2 = getRandomInt(7);
var co2Selector1 = getRandomInt(5);
var kwhSelectorMoreThan2Thou = getRandomInt(4);
var kwhMoreThan001 = getRandomInt(7);
var kwhMoreThan0002 = getRandomInt(9);
var kwhMoreThan0 = getRandomInt(5);

switch (kwhTotal >= 0){
    
  case co2Total > 3:
        if(co2SelectorMoreThan3 == 0){
          document.getElementById("actualFact").innerHTML = "It would take 1 mature tree " + treeAbsorb + " hours to absorb the CO2 emitted from page load.";  
        }
        else if(co2SelectorMoreThan3 == 1){
           document.getElementById("actualFact").innerHTML = 'Same amount of CO2 released as burning a candle for ' + co2_candle  + ' minutes.';
        }
        else{
           document.getElementById("actualFact").innerHTML = 'It would take '+ co2_breath + ' minutes of human breathing to emit the same amount of CO2.'; 
        }

    break;

  case co2Total >= 3:
    document.getElementById("actualFact").innerHTML = co2_3g[co2Selector3];

    break;
   
  case co2Total >= 2:
    document.getElementById("actualFact").innerHTML = co2_2g[co2Selector2];

    break;
        
  case co2Total >= .9:
    document.getElementById("actualFact").innerHTML = co2_1g[co2Selector1];

    break;

  case kwhTotal > 0.001:
    if(kwhMoreThan001 == 0){
          document.getElementById("actualFact").innerHTML = "Loading this page takes the same amount of energy as charging your phone " + kwh_CellPhoneCharge + "%.";  
        }
    else if(kwhMoreThan001 == 1 && kwhTotal <= .0018){
           document.getElementById("actualFact").innerHTML = 'Same amount of energy on page load as using ' + kwh_AAABattery  + '% of a AAA battery.';
        }
    else if(kwhMoreThan001 == 2){
           document.getElementById("actualFact").innerHTML = 'The energy required to run a ceiling fan ' + kwh_CeilingFan  + ' seconds.';
        }
    else if(kwhMoreThan001 == 3){
           document.getElementById("actualFact").innerHTML = 'Energy used to power a TV screen for ' + kwh_LCDTVCharge  + ' seconds.';
        }
    else if(kwhMoreThan001 == 4){
           document.getElementById("actualFact").innerHTML = 'Loading this page could power a 25ft strand of Christmas lights for ' + kwh_ChristmasLights  + ' seconds.';
        }
    else if(kwhMoreThan001 == 5){
           document.getElementById("actualFact").innerHTML = 'The energy to load this page could power a car\'s turn signal ' + kwh_TurnSignal  + ' times.';
        }
    else{
           document.getElementById("actualFact").innerHTML = kwh_Cal + " Calorie(s), about the same energy emitted as walking "+ amountOfSteps + " steps."; 
        }

    break;
        
  case co2Total >= .5:
    document.getElementById("actualFact").innerHTML = co2_halfg[co2Selector1];

    break;

  case kwhTotal > 0.0002:
    if(kwhMoreThan0002 == 0){
          document.getElementById("actualFact").innerHTML = "Loading this page takes the same amount of energy as charging your phone " + kwh_CellPhoneCharge + "%.";  
        }
    else if(kwhMoreThan0002 == 1){
           document.getElementById("actualFact").innerHTML = 'Same amount of energy on page load as using ' + kwh_AAABattery  + '% of a AAA battery.';
        }
    else if(kwhMoreThan0002 == 2){
           document.getElementById("actualFact").innerHTML = 'Loading this pages takes the same amount of energy as ' + kwh_MicrowaveSec  + ' seconds in a microwave.';
        }
    else if(kwhMoreThan0002 == 3){
           document.getElementById("actualFact").innerHTML = 'Loading this pages takes the same amount of energy as running a mini fridge ' + kwh_MiniFridgeSec  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 4){
           document.getElementById("actualFact").innerHTML = 'The energy required to run a ceiling fan ' + kwh_CeilingFan  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 5){
           document.getElementById("actualFact").innerHTML = 'Energy used to power a TV screen for ' + kwh_LCDTVCharge  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 6){
           document.getElementById("actualFact").innerHTML = 'Loading this page could power a 25ft strand of Christmas lights for ' + kwh_ChristmasLights  + ' seconds.';
        }
    else if(kwhMoreThan0002 == 7){
           document.getElementById("actualFact").innerHTML = 'The energy to load this page could power a car\'s turn signal ' + kwh_TurnSignal  + ' times.';
        }
    else{
           document.getElementById("actualFact").innerHTML = kwh_Cal + " Calorie(s), about the same energy emitted as walking "+ amountOfSteps + " steps."; 
        }

    break;
    


  case kwhTotal >= 0:
        if(kwhMoreThan0 == 0){
            document.getElementById("actualFact").innerHTML = kwh_IncanLightBulb + " seconds running an incandescent lightbulb."; 
        }
        else if(kwhMoreThan0 == 1){
            document.getElementById("actualFact").innerHTML = 'Loading this pages takes the same amount of energy as running a mini fridge ' + kwh_MiniFridgeSec  + ' seconds.'; 
        }
        else if(kwhMoreThan0 == 2){
           document.getElementById("actualFact").innerHTML = 'The energy required to run a ceiling fan ' + kwh_CeilingFan  + ' seconds.';
        }
        else if(kwhMoreThan0 == 3){
           document.getElementById("actualFact").innerHTML = 'Loading this page could power a 25ft strand of Christmas lights for ' + kwh_ChristmasLights  + ' seconds.';
        }
        else{
           document.getElementById("actualFact").innerHTML = kwh_LEDLightBulb + " seconds running an LED lightbulb."; 
        }

    break;

}
        }
        catch(e) {
            //alert("Page is almost loaded")
        }
        });
    
});