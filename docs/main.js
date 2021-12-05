var gLabels = null;
var gDatasets = {};
var gConfig = {
    type: 'line',
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Dummy'
        },
    }
};

const gColors = ["red", "blue", "green", "purple", "teal"];

function initDataset(data) {
    var dataset = Object.keys(data).map((user) => ({
        data: data[user],
        label: user,
        fill: false}));

    dataset.sort((a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1]);
    dataset = dataset.splice(0, gColors.length);
    dataset.forEach((value, index) => {
        value.borderColor = gColors[index];
    });

    return dataset;
}

function displayLevel(level) {
    gLevel = level;
    gConfig.data = {labels: gLabels, datasets: gDatasets[gLevel]};
    gConfig.options.title.text = gLevel;
    gChart.update();
}

function initData() {
    $.getJSON("data.json", function(json) {
        gLabels = json.dates;
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
    initData();
});
