// Selections
var chartContainer = document.querySelector(".chart-container");

function shortDate(date, country) {
    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    var monthsFR = [
        'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
        'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ];
    var shortYear = date.getFullYear().toString();
    if (country !== undefined && country.toLowerCase() === "fr") {
        var dayN = date.getDate();
        if (dayN === 1) {
            return date.getDate() + "er " + monthsFR[date.getMonth()] + " " + shortYear;
        } else {
            return date.getDate() + " " + monthsFR[date.getMonth()] + " " + shortYear;
        }

    } else {
        return months[date.getMonth()] + " " + date.getDate() + ", " + shortYear;
    }
}

var shortMonthTranslations = {
    "fr": {
        'Jan': 'janv.',
        'Feb': 'févr.',
        'Mar': 'mars',
        'Apr': 'avr.',
        'May': 'mai',
        'Jun': 'juin',
        'Jul': 'juill.',
        'Aug': 'août',
        'Sep': 'sept.',
        'Oct': 'oct.',
        'Nov': 'nov.',
        'Dec': 'déc.'
    }
};

function translateGridLine(value, country) {
    var splitVal = value.split(" ");

    var month = shortMonthTranslations[country][splitVal[0]];

    var num = splitVal[1] === "1" ? "1er" : splitVal[1];

    return num + " " + month + " " + splitVal[2];
}

/**
 * SECTORS CHART
 */
function initChartSector(country) {
    // Clear out existing chart.
    chartContainer.innerHTML = null;
    var canvas = document.createElement("canvas");
    canvas.id = "myChart";
    chartContainer.appendChild(canvas);
    var ctx = document.getElementById('myChart');

    // Extend chart.
    Chart.defaults.global.defaultFontFamily = 'Noto Sans';
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.defaults.global.animation.duration = 0;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
        draw: function (ease) {
            Chart.controllers.line.prototype.draw.call(this, ease);

            if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                var activePoint = this.chart.tooltip._active[0],
                    ctx = this.chart.ctx,
                    x = activePoint.tooltipPosition().x,
                    topY = this.chart.scales['y-axis-0'].top,
                    bottomY = this.chart.scales['y-axis-0'].bottom;

                // draw line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = .5;
                ctx.strokeStyle = '#808080';
                ctx.stroke();
                ctx.restore();
            }
        }
    });

    // Init a chart.
    return new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: "	rgb(153,204,255, 0.9)",
                titleFontSize: 14,
                titleSpacing: 4,
                bodyFontSize: 14,
                bodySpacing: 4,
                bodyFontColor: "#000000",
                titleFontColor: "#000000",
                borderColor: "#000000",
                borderWidth: 0.5,
                position: "average",
                itemSort: (item1, item2) => { return item2.yLabel - item1.yLabel },
                callbacks: {
                    title: function (tooltipItems) {
                        return shortDate(new Date(tooltipItems[0].xLabel), country);
                    },
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label;
                        label = label.length > 15 ? label.substring(0, 12) + "..." : label;
                        return label + " (" + tooltipItem.yLabel.toFixed(1) + "%)";
                    },
                    labelColor: function (tooltipItem, chart) {
                        return {
                            borderColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
                            backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor
                        };
                    },
                }
            },
            hover: {
                animationDuration: 0,
                mode: 'index',
                intersect: false
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 5,
                        beginAtZero: false,
                        autoSkip: false,
                        callback: function (value, index, values) {
                            return value.toString() + "%";
                        }
                    },
                    gridLines: {
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        padding: 10,
                        fontStyle: "bold",
                        beginAtZero: false,
                        autoSkip: false,
                        maxTicksLimit: 1000,
                        callback: function (value, index, values) {
                            if (country.toLowerCase() === "fr") {
                                var translatedVal = translateGridLine(value, country);
                                return ["1"].includes(value.split(" ")[1]) ? translatedVal : undefined;
                            }
                            return ["1"].includes(value.split(" ")[1]) ? value : undefined;
                        }
                    },
                    type: 'time',
                    time: {
                        unit: 'day',
                        stepSize: 1,
                        displayFormats: {
                            day: 'MMM D YY'
                        }
                    },
                    gridLines: {
                        zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                        display: true,
                        callback: function (value, index, values) {
                            return ["1"].includes(value.split(" ")[1])
                                ? true : false;
                        }
                    }
                }]
            }
        }
    });
}


/**
 * METROS CHART
 */
function initChartMetro() {
    // Clear out existing chart.
    chartContainer.innerHTML = null;
    var canvas = document.createElement("canvas");
    canvas.id = "myChart";
    chartContainer.appendChild(canvas);
    var ctx = document.getElementById('myChart');

    // Extend chart.
    Chart.defaults.global.defaultFontFamily = 'Noto Sans';
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.defaults.global.animation.duration = 0;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
        draw: function (ease) {
            Chart.controllers.line.prototype.draw.call(this, ease);

            if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                var activePoint = this.chart.tooltip._active[0],
                    ctx = this.chart.ctx,
                    x = activePoint.tooltipPosition().x,
                    topY = this.chart.scales['y-axis-0'].top,
                    bottomY = this.chart.scales['y-axis-0'].bottom;

                // draw line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = .5;
                ctx.strokeStyle = '#808080';
                ctx.stroke();
                ctx.restore();
            }
        }
    });

    // Init a chart.
    return new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: "	rgb(153,204,255, 0.9)",
                titleFontSize: 14,
                titleSpacing: 4,
                bodyFontSize: 14,
                bodySpacing: 4,
                bodyFontColor: "#000000",
                titleFontColor: "#000000",
                borderColor: "#000000",
                borderWidth: 0.5,
                position: "average",
                itemSort: (item1, item2) => { return item2.yLabel - item1.yLabel },
                callbacks: {
                    title: function (tooltipItems) {
                        return shortDate(new Date(tooltipItems[0].xLabel));;
                    },
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label;
                        label = label.length > 15 ? label.substring(0, 12) + "..." : label;
                        return label + " (" + tooltipItem.yLabel.toFixed(1) + "%)";
                    },
                    labelColor: function (tooltipItem, chart) {
                        return {
                            borderColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
                            backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor
                        };
                    },
                }
            },
            hover: {
                animationDuration: 0,
                mode: 'index',
                intersect: false
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 5,
                        beginAtZero: false,
                        autoSkip: false,
                        callback: function (value, index, values) {
                            return value.toString() + "%";
                        }
                    },
                    gridLines: {
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        padding: 10,
                        fontStyle: "bold",
                        beginAtZero: false,
                        autoSkip: false,
                        maxTicksLimit: 1000,
                        callback: function (value, index, values) {
                            return ["1"].includes(value.split(" ")[1])
                                ? value : undefined;
                        }
                    },
                    type: 'time',
                    time: {
                        unit: 'day',
                        stepSize: 1,
                        displayFormats: {
                            day: 'MMM D YY'
                        }
                    },
                    gridLines: {
                        zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                        display: true,
                        callback: function (value, index, values) {
                            return ["1"].includes(value.split(" ")[1])
                                ? true : false;
                        }
                    }
                }]
            }
        }
    });
}


/**
 * STATE CHART
 */
function initChartState() {
    // Clear out existing chart.
    chartContainer.innerHTML = null;
    var canvas = document.createElement("canvas");
    canvas.id = "myChart";
    chartContainer.appendChild(canvas);
    var ctx = document.getElementById('myChart');

    // Extend chart.
    Chart.defaults.global.defaultFontFamily = 'Noto Sans';
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.defaults.global.animation.duration = 0;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
        draw: function (ease) {
            Chart.controllers.line.prototype.draw.call(this, ease);

            if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                var activePoint = this.chart.tooltip._active[0],
                    ctx = this.chart.ctx,
                    x = activePoint.tooltipPosition().x,
                    topY = this.chart.scales['y-axis-0'].top,
                    bottomY = this.chart.scales['y-axis-0'].bottom;

                // draw line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = '#808080';
                ctx.stroke();
                ctx.restore();
            }
        }
    });

    // Init a chart.
    return new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: "	rgb(153,204,255, 0.9)",
                titleFontSize: 14,
                titleSpacing: 4,
                bodyFontSize: 14,
                bodySpacing: 4,
                bodyFontColor: "#000000",
                titleFontColor: "#000000",
                borderColor: "#000000",
                borderWidth: 0.5,
                position: "average",
                itemSort: (item1, item2) => { return item2.yLabel - item1.yLabel },
                callbacks: {
                    title: function (tooltipItems) {
                        return shortDate(new Date(tooltipItems[0].xLabel));;
                    },
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label;
                        label = label.length > 15 ? label.substring(0, 12) + "..." : label;
                        return label.toUpperCase() + " (" + tooltipItem.yLabel.toFixed(1) + "%)";
                    },
                    labelColor: function (tooltipItem, chart) {
                        return {
                            borderColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
                            backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor
                        };
                    },
                }
            },
            hover: {
                animationDuration: 0,
                mode: 'index',
                intersect: false
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 5,
                        beginAtZero: false,
                        autoSkip: false,
                        callback: function (value, index, values) {
                            return value.toString() + "%";
                        }
                    },
                    gridLines: {
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        padding: 10,
                        fontStyle: "bold",
                        beginAtZero: false,
                        autoSkip: false,
                        maxTicksLimit: 1000,
                        callback: function (value, index, values) {
                            return ["1"].includes(value.split(" ")[1])
                                ? value : undefined;
                        }
                    },
                    type: 'time',
                    time: {
                        unit: 'day',
                        stepSize: 1,
                        displayFormats: {
                            day: 'MMM D YY'
                        }
                    },
                    gridLines: {
                        zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                        display: true,
                        callback: function (value, index, values) {
                            return ["1"].includes(value.split(" ")[1])
                                ? true : false;
                        }
                    }
                }]
            }
        }
    });
}


/**
 * STATE CHART
 */
function initChartNational() {
    // Clear out existing chart.
    chartContainer.innerHTML = null;
    var canvas = document.createElement("canvas");
    canvas.id = "myChart";
    chartContainer.appendChild(canvas);
    var ctx = document.getElementById('myChart');

    // Extend chart.
    Chart.defaults.global.defaultFontFamily = 'Noto Sans';
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.defaults.global.animation.duration = 0;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
        draw: function (ease) {
            Chart.controllers.line.prototype.draw.call(this, ease);

            if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                var activePoint = this.chart.tooltip._active[0],
                    ctx = this.chart.ctx,
                    x = activePoint.tooltipPosition().x,
                    topY = this.chart.scales['y-axis-0'].top,
                    bottomY = this.chart.scales['y-axis-0'].bottom;

                // draw line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = .5;
                ctx.strokeStyle = '#808080';
                ctx.stroke();
                ctx.restore();
            }
        }
    });

    // Init a chart.
    return new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: "	rgb(153,204,255, 0.9)",
                titleFontSize: 14,
                titleSpacing: 4,
                bodyFontSize: 14,
                bodySpacing: 4,
                bodyFontColor: "#000000",
                titleFontColor: "#000000",
                borderColor: "#000000",
                borderWidth: 0.5,
                position: "average",
                itemSort: (item1, item2) => { return item2.yLabel - item1.yLabel },
                callbacks: {
                    title: function (tooltipItems) {
                        return shortDate(new Date(tooltipItems[0].xLabel));;
                    },
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label;
                        label = label.split("_").join(" ");
                        label = label.length > 15 ? label.substring(0, 12) + "..." : label;
                        return label + " (" + tooltipItem.yLabel.toFixed(1) + "%)";
                    },
                    labelColor: function (tooltipItem, chart) {
                        return {
                            borderColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
                            backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor
                        };
                    },
                }
            },
            hover: {
                animationDuration: 0,
                mode: 'index',
                intersect: false
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 5,
                        beginAtZero: false,
                        autoSkip: false,
                        callback: function (value, index, values) {
                            return value.toString() + "%";
                        }
                    },
                    gridLines: {
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        padding: 10,
                        fontStyle: "bold",
                        beginAtZero: false,
                        autoSkip: false,
                        maxTicksLimit: 1000,
                        callback: function (value, index, values) {
                            return ["1", "15"].includes(value.split(" ")[1])
                                ? value : undefined;
                        }
                    },
                    type: 'time',
                    time: {
                        unit: 'day',
                        stepSize: 1
                    },
                    gridLines: {
                        zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                        display: true,
                        callback: function (value, index, values) {
                            return ["1", "15"].includes(value.split(" ")[1])
                                ? true : false;
                        }
                    }
                }]
            }
        }
    });
}


/**
 * STATE CHART
 */
function initChartCountry(country) {
    // Clear out existing chart.
    chartContainer.innerHTML = null;
    var canvas = document.createElement("canvas");
    canvas.id = "myChart";
    chartContainer.appendChild(canvas);
    var ctx = document.getElementById('myChart');

    // Extend chart.
    Chart.defaults.global.defaultFontFamily = 'Noto Sans';
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.defaults.global.animation.duration = 0;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
        draw: function (ease) {
            Chart.controllers.line.prototype.draw.call(this, ease);

            if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                var activePoint = this.chart.tooltip._active[0],
                    ctx = this.chart.ctx,
                    x = activePoint.tooltipPosition().x,
                    topY = this.chart.scales['y-axis-0'].top,
                    bottomY = this.chart.scales['y-axis-0'].bottom;

                // draw line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = '#808080';
                ctx.stroke();
                ctx.restore();
            }
        }
    });

    // Init a chart.
    return new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: "	rgb(153,204,255, 0.9)",
                titleFontSize: 14,
                titleSpacing: 4,
                bodyFontSize: 14,
                bodySpacing: 4,
                bodyFontColor: "#000000",
                titleFontColor: "#000000",
                borderColor: "#000000",
                borderWidth: 0.5,
                position: "average",
                itemSort: function (item1, item2) { return item2.yLabel - item1.yLabel; },
                callbacks: {
                    title: function (tooltipItems) {
                        return shortDate(new Date(tooltipItems[0].xLabel), country);
                    },
                    label: function (tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label;
                        label = label.length > 15 ? label.substring(0, 12) + "..." : label;
                        return label + " (" + tooltipItem.yLabel.toFixed(1) + "%)";
                    },
                    labelColor: function (tooltipItem, chart) {
                        return {
                            borderColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
                            backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor
                        };
                    },
                }
            },
            hover: {
                animationDuration: 0,
                mode: 'index',
                intersect: false
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 5,
                        beginAtZero: false,
                        autoSkip: false,
                        callback: function (value, index, values) {
                            return value.toString() + "%";
                        }
                    },
                    gridLines: {
                        display: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        padding: 10,
                        fontStyle: "bold",
                        beginAtZero: false,
                        autoSkip: false,
                        maxTicksLimit: 1000,
                        callback: function (value, index, values) {
                            if (country.toLowerCase() === "fr") {
                                var translatedVal = translateGridLine(value, country);
                                return ["1"].includes(value.split(" ")[1]) ? translatedVal : undefined;
                            }
                            return ["1"].includes(value.split(" ")[1]) ? value : undefined;
                        }
                    },
                    type: 'time',
                    time: {
                        unit: 'day',
                        stepSize: 1,
                        displayFormats: {
                            day: 'MMM D YY'
                        }
                    },
                    gridLines: {
                        zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                        display: true,
                        callback: function (value, index, values) {
                            return ["1"].includes(value.split(" ")[1]) ? true : false;
                        }
                    }
                }]
            }
        }
    });
}
