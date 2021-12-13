var gJsonData = {};
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
        },
        scales: {
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 15
                }
            }],
        },
    },
    data: {
        labels: [],
        datasets: [],
    },
};

const PLAYER_COLORS = ["red", "blue", "green", "purple", "teal"];
function selectData(data, range) {
    if (range > 0)
        return data.slice(-range);
    else
        return data;
}

function initLabel(data, range) {
    return selectData(data, range);
}

function initDataset(data, range) {
    var dataset = Object.keys(data).map((player) => ({
        data: selectData(data[player], range),
        label: player,
        fill: false,
        hidden: false}));

    // Only display the first N players based on latest score
    dataset.sort((a, b) => b.data.at(-1) - a.data.at(-1));
    dataset = dataset.splice(0, PLAYER_COLORS.length);

    // Hiding lower score players if they haven't done anything during
    // the display period
    for (let i = dataset.length - 1; i > 0; i --) {
        if (dataset[i].data.at(0) != dataset[i].data.at(-1)) {
            break;
        }
        dataset[i].hidden = true;
    }

    // Sorting the data again by player name, so we can assign a stable color
    // to each player.
    dataset.sort((a, b) => a > b ? 1 : -1);
    dataset.forEach((value, index) => {
        value.borderColor = PLAYER_COLORS[index];
    });

    // Adjust the order back by score
    dataset.sort((a, b) => b.data.at(-1) - a.data.at(-1));

    return dataset;
}

function displayData(level, range) {
    var labels = initLabel(gJsonData.dates, range);
    var datasets = initDataset(gJsonData.data[level], range);

    gConfig.data.labels = labels;
    gConfig.data.datasets = datasets;
    gChart.update();
}

function initData() {
    $.getJSON("data.json", function(json) {
        gJsonData = json;
        refresh();
    });
}

function refresh() {
    var level = $('#level').val();
    var range = $('#range').val();
    displayData(level, range);
}

$(function() {
    const ctx = $('#myChart');
    gChart = new Chart(ctx, gConfig);
    window.addEventListener('resize', function () { gChart.resize() })
    initData();
});
