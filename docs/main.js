var gLabels = null;
var gDatasets = {};
var gConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: false,
            text: 'Dummy'
        },
        datasets: {
            line: {
                pointHitRadius: 15,
                tension: 0.3,
            },
        },
        legend: {
            position: "top",
        }
    },
    data: {
        labels: [],
        datasets: [],
    },
};

const DISPLAY_DAYS = 10;
const gColors = ["red", "blue", "green", "purple", "teal"];

function initDataset(data) {
    var dataset = Object.keys(data).map((user) => ({
        data: data[user].slice(-DISPLAY_DAYS),
        label: user,
        fill: false,
        hidden: false}));

    dataset.sort((a, b) => b.data.at(-1) - a.data.at(-1));
    dataset = dataset.splice(0, gColors.length);
    dataset.forEach((value, index) => {
        value.borderColor = gColors[index];
    });

    for (let i = dataset.length - 1; i >0; i --) {
        if (dataset[i].data.at(0) != dataset[i].data.at(-1)) {
            break;
        }

        dataset[i].hidden = true;
    }

    return dataset;
}

function displayLevel(level) {
    gLevel = level;
    gConfig.data = {labels: gLabels, datasets: gDatasets[gLevel]};
    gChart.update();
}

function initData() {
    $.getJSON("data.json", function(json) {
        gLabels = json.dates.slice(-DISPLAY_DAYS);
        for (var level in json.data) {
            gDatasets[level] = initDataset(json.data[level]);
        }
        var DEFAULT_LEVEL = "Algebra 1";
        displayLevel(DEFAULT_LEVEL);
    });
}

$(function() {
    const ctx = $('#myChart');
    gChart = new Chart(ctx, gConfig);
    window.addEventListener('resize', function () { gChart.resize() })
    initData();
});
