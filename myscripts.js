//const MAX = request.totalTot*7;

const ctx = document.querySelector("#myChart").getContext('2d');

let hosts = [];
class Hosts {
  constructor(time, url, totalAd, totalAnal) {
    this.time = time;
    this.url = url;
    this.totalAd = totalAd;
    this.totalAnal = totalAnal;
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
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].totalAd, storageData[z].totalAnal));
      
      continue;
    }

    let added = false;
    for (let i=0; i<hosts.length; i++) {
      let y = hosts[i];
      if (storageData[z].storedAt < y.time) {
        let firstHalf = hosts.splice(0, i);
        firstHalf.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].totalAd, storageData[z].totalAnal));
        hosts = firstHalf.concat(hosts); 
          
        added = true;
        break;
      }
    }

    if (!added) {
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].totalAd, storageData[z].totalAnal))
    }
  }

  const datasets = [
    {
      label: "totalAd",
      color: "#ebdc3d"
    },
    {
      label: "totalAnal",
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
            stepSize: 10,
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