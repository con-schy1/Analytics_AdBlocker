
const ctx = document.querySelector("#myChart").getContext('2d');

let hosts = [];
class Hosts {
  constructor(time, url, Ads, Analytics) {
    this.time = time;
    this.url = url;
    this.Ads = Ads;
    this.Analytics = Analytics;
  }
}
class Dataset {
  constructor(label, bgcolor) {
    this.base = 0;
    this.label = label;
    this.data = hosts.map(z => z[label]);
    this.backgroundColor = bgcolor;
    this.borderColor = this.backgroundColor;
    this.borderWidth = 2;
    this.borderRadius = 5;
    this.borderSkipped = false;
  }
}

function chartConfig(storageData) {
  hosts.length = 0;
  for (z in storageData) {
    if (!hosts.length) {
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].Ads, storageData[z].Analytics));
      
      continue;
    }

    let added = false;
    for (let i=0; i<hosts.length; i++) {
      let y = hosts[i];
      if (storageData[z].storedAt < y.time) {
        let firstHalf = hosts.splice(0, i);
        firstHalf.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].Ads, storageData[z].totalAnal));
        hosts = firstHalf.concat(hosts); 
          
        added = true;
        break;
      }
    }

    if (!added) {
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].Ads, storageData[z].Analytics))
    }
  }

  const datasets = [
    {
      label: "Ads",
      color: "#ebdc3d"
    },
    {
      label: "Analytics",
      color: "#f18931"
    }
  ];
  const data = {
    labels: hosts.map(z => z.url),
    datasets: datasets.map(z => new Dataset(z.label, z.color))
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: false,
          text: 'Chart.js Bar Chart'
        }
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          min: 0,
          /*max: 100,*/
          ticks: {
            stepSize: 1,
          }
        }
      }
    },
  };

  return config;
}


function createChart(callback, storageData) {
  if (!callback) return 0;


  return new Chart(ctx, callback(storageData));
}
function updateChartData(x) {
    //chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [x.totalTot, x.totalDiff];
    });
    chart.update();
}

let chart = null;
chrome.storage.session.get(null).then(data => {
  chart = createChart(chartConfig, data);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  chrome.storage.session.get(null).then(data => {
    chart.destroy();    
    chart = createChart(chartConfig, data);
      
    //chrome.storage.session.clear();
      

    if (window.location.hash == "#Requests") {
      requestDiv.innerHTML = "";
      for (x in data) {
        listSiteInfo(data[x].hostURL, data[x].foundHTTPArray, data[x].foundHTTPADArray);
      }
    } 
  });
});



// ----------------- iframe and image list DOM -----------------
const requestDiv = document.querySelector("#requestDiv");
const siteInfoTemplate = document.querySelector("#site-info-template");

function listSiteInfo(name, imgs, frames) {
  let clone = siteInfoTemplate.content.cloneNode(true);

  let siteName = clone.querySelector(".site-name");
  let siteMore = clone.querySelector(".site-more");
  let siteImageList = clone.querySelector(".site-image-list");
  let siteFrameList = clone.querySelector(".site-frame-list");
  let listsections = clone.querySelectorAll(".list-sections");

  siteName.innerText = name;
  siteMore.addEventListener('click', e => {
    listsections.forEach(z => {z.classList.toggle("list-sections")});
    e.currentTarget.classList.toggle("site-more-rotated");
  });

//Try / Catch    
try{    
  imgs.forEach(z => {
    if (z && z != "") siteImageList.innerHTML += `<li>${z}</li>`;
  });
  frames.forEach(z => {
    if (z && z != "") siteFrameList.innerHTML += `<li>${z}</li>`;
  });
    
requestDiv.appendChild(clone);
    

    
}
    catch(e){
        
    }

  
}

//Chart Code to display requestDiv and hide chartDiv
window.addEventListener("hashchange", async function() {
  if(location.hash === "#Requests"){
    document.getElementById("chartDiv").style.display = "none";
    document.getElementById("requestDiv").style.display = "block";

    // changes below -harshit
    requestDiv.innerHTML = "";
    await chrome.storage.session.get(null).then(data => {
      for (x in data) {
        listSiteInfo(data[x].hostURL, data[x].foundHTTPArray, data[x].foundHTTPADArray);
      }
    });
  }else{
    document.getElementById("requestDiv").style.display = "none";
    document.getElementById("chartDiv").style.display = "block";
  }
});

