//libs_ad-service_dist_index_js

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
  });
});