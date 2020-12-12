// Selections
var chartTitle = document.querySelector("#chart-title");
var chartDatesP1 = document.querySelector("#chart-dates-p1");
var chartDatesP2 = document.querySelector("#chart-dates-p2");
var selectionsContainer = document.querySelector("#selections-container");
var selectionsPrompt = document.querySelector("#selections-prompt");

var directoryIdMap = {
    AU: "Australia",
    CA: "Canada",
    DE: "Germany",
    FR: "France",
    GB: "UK",
    IE: "Ireland",
    US: "United States"
};

var stateAbvMap = {
    "al": "Alabama",
    "ak": "Alaska",
    "as": "American Samoa",
    "az": "Arizona",
    "ar": "Arkansas",
    "ca": "California",
    "co": "Colorado",
    "ct": "Connecticut",
    "de": "Delaware",
    "dc": "District Of Columbia",
    "fm": "Federated States Of Micronesia",
    "fl": "Florida",
    "ga": "Georgia",
    "gu": "Guam",
    "hi": "Hawaii",
    "id": "Idaho",
    "il": "Illinois",
    "in": "Indiana",
    "ia": "Iowa",
    "ks": "Kansas",
    "ky": "Kentucky",
    "la": "Louisiana",
    "me": "Maine",
    "mh": "Marshall Islands",
    "md": "Maryland",
    "ma": "Massachusetts",
    "mi": "Michigan",
    "mn": "Minnesota",
    "ms": "Mississippi",
    "mo": "Missouri",
    "mt": "Montana",
    "ne": "Nebraska",
    "nv": "Nevada",
    "nh": "New Hampshire",
    "nj": "New Jersey",
    "nm": "New Mexico",
    "ny": "New York",
    "nc": "North Carolina",
    "nd": "North Dakota",
    "mp": "Northern Mariana Islands",
    "oh": "Ohio",
    "ok": "Oklahoma",
    "or": "Oregon",
    "pw": "Palau",
    "pa": "Pennsylvania",
    "pr": "Puerto Rico",
    "ri": "Rhode Island",
    "sc": "South Carolina",
    "sd": "South Dakota",
    "tn": "Tennessee",
    "tx": "Texas",
    "ut": "Utah",
    "vt": "Vermont",
    "vi": "Virgin Islands",
    "va": "Virginia",
    "wa": "Washington",
    "wv": "West Virginia",
    "wi": "Wisconsin",
    "wy": "Wyoming"
};

var stateNameMap = Object.keys(stateAbvMap).reduce((a,c) => {
    a[stateAbvMap[c]] = c;
    return a;
}, {});

var settings = {
    defaults: {
        "country": [
            "United States",
            "Canada"
        ],
        "state": [
            "Texas",
            "California",
            "New York",
        ],
        "metro": [
            "Austin-Round Rock--TX",
            "San Francisco-Oakland-Hayward--CA",
            "New York-Newark-Jersey City--NY-NJ-PA"
        ]
    },
    initialRegion: "country",
    yLabels: {
        "country": "YoY_pct_change_in_postings_trend_from_feb1",
        "state": "% gap in trend over last year",
        "nation": "% gap in trend over last year",
        "metro": "% gap in trend over last year"
    },
    availableColors: [
        ["#2557A7", 'notInUse'], // indeed blue
        ["#C74289", 'notInUse'], // Orange
        ["#358271", 'notInUse'], // Yellow:
        ["#C08A38", 'notInUse'], // Green
        ["#6792F0", 'notInUse'], // Magenta
        ["#EE99BF", 'notInUse'],  // Purple: 
        ["#7BC0AE", 'notInUse'], // Light blue
        ["#DF7838", 'notInUse']
    ]
}

var currentRegion;


function shortDate(date) {
    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[date.getMonth()] + " " + date.getDate();
}

function updateAppMetro(data, metros, chart) {
    // Update dates.
    if (metros.length) {
        chartDatesP1.innerHTML = (
            "7 day moving avg through "
            + shortDate(new Date(data[metros[0]][data[metros[0]].length - 1].x))
        ).split(" ").join("&nbsp;") + ", ";
        chartDatesP2.innerHTML = (
            "indexed to "
            + shortDate(new Date(data[metros[0]][0].x))
        ).split(" ").join("&nbsp;");    
    };

    // Swap old with new datasets.
    chart.data.labels.pop();
    while (chart.data.datasets.length) { chart.data.datasets.pop() };
    for (var i = 0; i < metros.length; i++) {
        chart.data.datasets.push({
            label: metros[i],
            data: data[metros[i]],
            fill: false,
            borderColor: settings["availableColors"][i][0],
            borderWidth: 3.0,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: settings["availableColors"][i][0],
            pointHoverBorderColor: "#000000"
        });

        // Update colors.
        $(".tag")
            .filter(function() { return this.innerText == metros[i]; })
            .css('background-color', settings["availableColors"][i][0]);
    };
    chart.update();
};

function initializeTabMetro(processedData) {
    // Chart.
    var chart = initChartMetro();

    // Style.
    chartTitle.innerText = "Job Postings on Indeed by US Metro";
    chartDatesP1.innerHTML = "";

    // Style.
    $(".postingsTrendByMetro").css('display','block');
    selectionsContainer.style.display = "flex";
    selectionsPrompt.style.display = "block";
    selectionsPrompt.innerText = "Search for metros in the box below (limit 8):";

    // Sets the options for the typeahead input.
    if (document.querySelector(".bootstrap-tagsinput")) {
        document.querySelector(".tagsinput-typeahead").remove();
        document.querySelector(".bootstrap-tagsinput").remove();
        var tagsTA = document.createElement("input");
        tagsTA.classList.add("tagsinput-typeahead");
        tagsTA.setAttribute("type", "text");
        document.querySelector("#search-container").appendChild(tagsTA);
    };

    // Sets the options for the typeahead input.
    $('.tagsinput-typeahead').tagsinput({
        maxTags: 8,
        typeahead: {
            source: Object.keys(processedData),
            limit: 3,
            afterSelect: function() {
                this.$element[0].value = '';
            }
        }
    });

    // Seed the options.
    settings["defaults"]['metro'].forEach((m,i) => {
        $('.tagsinput-typeahead').tagsinput('add', m);
        $(".tag")
            .filter(function() { return this.innerText == m; })
            .css('background-color', settings["availableColors"][i][0]);
    });
    updateAppMetro(processedData, settings["defaults"]['metro'], chart);

    // Listen for updates.
    $('.tagsinput-typeahead').change(function() {    
        updateAppMetro(
            processedData,
            $('.tagsinput-typeahead').tagsinput('items'),
            chart
        );
    });
};

function updateAppState(data, states, chart) {

    var statesAbvs = states.map(s => stateNameMap[s]);
    console.log(data)
    // Update dates.
    if (states.length) {
        chartDatesP1.innerHTML = (
            "7 day moving avg through "
            + shortDate(new Date(data[statesAbvs[0]][data[statesAbvs[0]].length - 1].x))
        ).split(" ").join("&nbsp;") + ", ";
        chartDatesP2.innerHTML = (
            "indexed to "
            + shortDate(new Date(data[statesAbvs[0]][0].x))
        ).split(" ").join("&nbsp;");    
    };

    chart.data.labels.pop();
    while (chart.data.datasets.length) { chart.data.datasets.pop() };
    for (var i = 0; i < statesAbvs.length; i++) {
        chart.data.datasets.push({
            label: statesAbvs[i],
            data: data[statesAbvs[i]],
            fill: false,
            borderColor: settings["availableColors"][i][0],
            borderWidth: 3.0,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: settings["availableColors"][i][0],
            pointHoverBorderColor: "#000000"
        });

        // Update colors.
        $(".tag")
            .filter(function() { return this.innerText == states[i]; })
            .css('background-color', settings["availableColors"][i][0]);
    };
    chart.update();
};

function initializeTabState(processedData) {
    // Chart.
    var chart = initChartState();

    // Style.
    chartTitle.innerText = "Job Postings on Indeed by US State";
    chartDatesP1.innerHTML = "";

    // Styling.
    $(".postingsTrendByState").css("display", "block");
    selectionsContainer.style.display = "flex";
    selectionsPrompt.style.display = "block";
    selectionsPrompt.innerText = "Search for states in the box below (limit 8):";

    // Sets the options for the typeahead input.
    if (document.querySelector(".bootstrap-tagsinput")) {
        document.querySelector(".tagsinput-typeahead").remove();
        document.querySelector(".bootstrap-tagsinput").remove();
        var tagsTA = document.createElement("input");
        tagsTA.classList.add("tagsinput-typeahead");
        tagsTA.setAttribute("type", "text");
        document.querySelector("#search-container").appendChild(tagsTA);
    };

    $('.tagsinput-typeahead').tagsinput({
        maxTags: 8,
        typeahead: {
            source: Object.keys(processedData).map(stateAbv => stateAbvMap[stateAbv]),
            limit: 3,
            afterSelect: function() {
                this.$element[0].value = '';
            },
           
        }
    });

    // Seed the options.
    settings["defaults"]["state"].forEach((m,i) => {
        $('.tagsinput-typeahead').tagsinput('add', m);
        $(".tag")
            .filter(function() { return this.innerText == m; })
            .css('background-color', settings["availableColors"][i][0]);
    });
    updateAppState(processedData, settings["defaults"]["state"], chart);

    // Listen for updates.
    $('.tagsinput-typeahead').change(function() {
        updateAppState(
            processedData,
            $('.tagsinput-typeahead').tagsinput('items'),
            chart
        );
    });
};

function updateAppNational(data, metros, chart) {
    // Update dates.
    if (metros.length) {
        chartDatesP1.innerHTML = (
            "7 day moving avg through "
            + shortDate(new Date(data[countries[0]][data[countries[0]].length - 1].x))
        ).split(" ").join("&nbsp;") + ", ";
        chartDatesP2.innerHTML = (
            "indexed to "
            + shortDate(new Date(data[countries[0]][0].x))
        ).split(" ").join("&nbsp;");    
    };

    // Swap old with new datasets.
    chart.data.labels.pop();
    while (chart.data.datasets.length) { chart.data.datasets.pop() };
    for (var i = 0; i < countries.length; i++) {
        chart.data.datasets.push({
            label: countries[i],
            data: data[countries[i]],
            fill: false,
            borderColor: settings["availableColors"][i][0],
            borderWidth: 3.0,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: settings["availableColors"][i][0],
            pointHoverBorderColor: "#000000"
        });

        // Update colors.
        $(".tag")
            .filter(function() { return this.innerText == metros[i]; })
            .css('background-color', settings["availableColors"][i][0]);
    };
    chart.update();
};

function initializeTabNational(processedData) {
    // Chart.
    var chart = initChartNational();

    // Style.
    chartTitle.innerText = "Job Postings on Indeed by Wage Tier in the US";
    chartDatesP1.innerHTML = "";

    // Style.
    chartTitle.innerText = "Job Postings on Indeed by Country";
    chartDatesP1.innerHTML = "";

    $(".postingsTrendByMetro").css('display','block');
    selectionsContainer.style.display = "none";
    selectionsPrompt.style.display = "none";

    // Sets the options for the typeahead input.
    if (document.querySelector(".bootstrap-tagsinput")) {
        document.querySelector(".tagsinput-typeahead").remove();
        document.querySelector(".bootstrap-tagsinput").remove();
        var tagsTA = document.createElement("input");
        tagsTA.classList.add("tagsinput-typeahead");
        tagsTA.setAttribute("type", "text");
        document.querySelector("#search-container").appendChild(tagsTA);
    };

    // Sets the options for the typeahead input.
    if (document.querySelector(".bootstrap-tagsinput")) {
        document.querySelector(".tagsinput-typeahead").remove();
        document.querySelector(".bootstrap-tagsinput").remove();
        var tagsTA = document.createElement("input");
        tagsTA.classList.add("tagsinput-typeahead");
        tagsTA.setAttribute("type", "text");
        document.querySelector("#search-container").appendChild(tagsTA);
    };

    $('.tagsinput-typeahead').tagsinput({
        typeahead: {
            source: Object.keys(processedData),
            limit: 3,
            afterSelect: function() {
                this.$element[0].value = '';
            }
        }
    });

    // Seed the options.
    Object.keys(processedData).forEach((m,i) => {
        $('.tagsinput-typeahead').tagsinput('add', m);
        $(".tag")
            .filter(function() { return this.innerText == m; })
            .css('background-color', settings["availableColors"][i][0]);
    });
    updateAppNational(processedData, Object.keys(processedData), chart);

    // Listen for updates.
    $('.tagsinput-typeahead').change(function() {    
        updateAppNational(
            processedData,
            $('.tagsinput-typeahead').tagsinput('items'),
            chart
        );
    });
};

function updateAppCountry(data, countries, chart) {
    // Update dates.
    if (countries.length) {
        chartDatesP1.innerHTML = (
            "7 day moving avg through "
            + shortDate(new Date(data[countries[0]][data[countries[0]].length - 1].x))
        ).split(" ").join("&nbsp;") + ", ";
        chartDatesP2.innerHTML = (
            "indexed to "
            + shortDate(new Date(data[countries[0]][0].x))
        ).split(" ").join("&nbsp;");    
    };

    // Swap old with new datasets.
    chart.data.labels.pop();
    while (chart.data.datasets.length) { chart.data.datasets.pop() };
    for (var i = 0; i < countries.length; i++) {
        chart.data.datasets.push({
            label: countries[i],
            data: data[countries[i]],
            fill: false,
            borderColor: settings["availableColors"][i][0],
            borderWidth: 3.0,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: settings["availableColors"][i][0],
            pointHoverBorderColor: "#000000"
        });

        // Update colors.
        $(".tag")
            .filter(function() { return this.innerText == countries[i]; })
            .css('background-color', settings["availableColors"][i][0]);
    };
    chart.update();
};

function initializeTabCountry(processedData) {
    // Chart.
    var chart = initChartCountry();

    // Style.
    chartTitle.innerText = "Job Postings on Indeed by Country";
    chartDatesP1.innerHTML = "";

    $(".postingsTrendByMetro").css('display','block');
    selectionsContainer.style.display = "flex";
    selectionsPrompt.style.display = "block";
    selectionsPrompt.innerText = "Select Australia, Canada, France, Germany, Ireland, United Kingdom, and/or United States below:";

    // Sets the options for the typeahead input.
    if (document.querySelector(".bootstrap-tagsinput")) {
        document.querySelector(".tagsinput-typeahead").remove();
        document.querySelector(".bootstrap-tagsinput").remove();
        var tagsTA = document.createElement("input");
        tagsTA.classList.add("tagsinput-typeahead");
        tagsTA.setAttribute("type", "text");
        document.querySelector("#search-container").appendChild(tagsTA);
    };

    $('.tagsinput-typeahead').tagsinput({
        typeahead: {
            source: Object.keys(processedData),
            limit: 3,
            afterSelect: function() {
                this.$element[0].value = '';
            }
        }
    });

    // Seed the options.
    settings["defaults"]["country"].forEach((m,i) => {
        $('.tagsinput-typeahead').tagsinput('add', m);
        $(".tag")
            .filter(function() { return this.innerText == m; })
            .css('background-color', settings["availableColors"][i][0]);
    });
    updateAppCountry(processedData, settings["defaults"]["country"], chart);

    // Listen for updates.
    $('.tagsinput-typeahead').change(function() {    
        updateAppCountry(
            processedData,
            $('.tagsinput-typeahead').tagsinput('items'),
            chart
        );
    });
};

function processData(metaData, region) {
    switch (region) {
        case "country":
            var processedData = {};
            for (var dataset of metaData) {
                processedData[dataset.name] = dataset.data.map(row => {
                    return {
                        x: row.date,
                        y: row[settings["yLabels"]["country"]]
                    }
                }).filter(row => {
                    var newDate = new Date("2020-02-01");
                    return row.x >= new Date(
                        newDate.getTime()
                        + Math.abs(newDate.getTimezoneOffset()*60000)
                    )
                })
            }
            return processedData;
        case "national":
            var processedData = {};
            for (var row of metaData[0].data) {
                var tier = row["wage_terile"];
                if (tier in processedData) {
                    processedData[tier].push({ x: row.date, y: row[settings["yLabels"]["nation"]] }) 
                } else {
                    processedData[tier] = [{ x: row.date, y: row[settings["yLabels"]["nation"]] }];
                };
            };
            return processedData;
        case "state":
            var processedData = metaData[0].data.reduce((a,c) => ({
                ...a,
                [c['state'].toLowerCase()]: c['state'].toLowerCase() in a ?
                    a[c['state'].toLowerCase()].concat({ x: c.date, y: c[settings["yLabels"]["state"]]}) :
                    [{ x: c.date, y: c[settings["yLabels"]["state"]]}]
            }), {});
            return processedData;
        case "metro":            
            var processedData = {};
            for (var row of metaData[0].data) {
                var cleanName = row["CBSA_Title"].replace(", ", "--");
                if (cleanName in processedData) {
                    processedData[cleanName].push({ x: row.date, y: row[settings["yLabels"]["metro"]] }) 
                } else {
                    processedData[cleanName] = [{ x: row.date, y: row[settings["yLabels"]["metro"]] }];
                };
            };
            return processedData;
        default:
            break;
    };
};

function getDatasetsMeta(region) {
    switch (region) {
        case "country":
            return [
                {
                    name: "Australia",
                    filepath: "./AU/YoY_postings_trend_ratio_AU.csv",
                    data: null
                },
                {
                    name: "Canada",
                    filepath: "./CA/YoY_postings_trend_ratio_CA.csv",
                    data: null
                },
                {
                    name: "France",
                    filepath: "./FR/YoY_postings_trend_ratio_FR.csv",
                    data: null
                },
                {
                    name: "Germany",
                    filepath: "./DE/YoY_postings_trend_ratio_DE.csv",
                    data: null
                },
                {
                    name: "Ireland",
                    filepath: "./IE/YoY_postings_trend_ratio_IE.csv",
                    data: null
                },
                {
                    name: "United Kingdom",
                    filepath: "./GB/YoY_postings_trend_ratio_GB.csv",
                    data: null
                },
                {
                    name: "United States",
                    filepath: "./US/YoY_postings_trend_ratio_US.csv",
                    data: null
                },
            ];
        case "national":
            return [
                {
                    filepath: "./US/wage_tier_postings_trend.csv",
                    data: null
                }
            ];
        case "state":
            return [
                {
                    filepath: "./US/state_pct_gap_in_trend.csv",
                    data: null
                }
            ];
        case "metro":
            return [
                {
                    filepath: "./US/metro_pct_gap_in_trend.csv",
                    data: null
                }
            ];
        default:
            break;
    };
};


/**
 * Populate UI.
 */
function populateUI(datasets, chartName) {
    // Delete existing options.
    datasetsSelection.innerHTML = "";

    // Populate dataset selector.
    datasets.forEach(function(dataset) {
        if (dataset.data !== null) {
            var option = document.createElement("option");
            option.value = dataset.name;
            option.innerHTML = dataset.name;
            datasetsSelection.appendChild(option);
            if (dataset.name === "Postings Category Trend") {
                populateIndustryForm(dataset.data);
            };
            if (dataset.name === "postingstrendbymetro") {
                populateMetrosForm(dataset.data, metrosSelection);
            };
        };
    });

    // Add event listener to data selector.
    // datasetsSelection.addEventListener("change", function() {
    //     for (var i = 0; i < datasets.length; i++) {
    //         if (datasets[i].name === this.value) {
    //             if (datasets[i].name === "Postings Category Trend") {
    //                 state = {
    //                     dataset: datasets[i],
    //                     category: "Accounting"
    //                 }
    //                 updateApp(state);
    //             } else {
    //                 state = {
    //                     dataset: datasets[i],
    //                     category: null
    //                 }
    //                 updateApp(state);
    //             }
    //             break;
    //         };
    //     };
    // });

    // Hide datasetsSelection if chartName is passed in hash.
    switch (chartName) {
        case undefined:
            selectionsContainer.style.display = "none";
            break;
        case "postingstrend":
            selectionsContainer.style.display = "none";
            break;
        case "postingstrendbymetro":
            selectionsContainer.style.display = "flex";
            industryForm.style.display = "none";
            metrosForm.style.display = "block";
            datasetsForm.style.display = "none";
            break;
    }
};

/**
 * STATE CHART
 */
function initChart() {

    // Extend chart.
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.defaults.global.animation.duration = 0;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
        draw: function(ease) {
            Chart.controllers.line.prototype.draw.call(this, ease);

/**
 * Populate dataset selector.
 * @param {*} data 
 */
function populateMetrosForm(data, form) {
    // Get all unique metros into a set of strings.
    var metrosSet = new Set(data.map(function(d) {
        return d['CBSA_Title'] 
    })); 

                const lookupDate = new Date(chartX);
                const y2019 = this.chart.data.datasets
                    .find(d => d.label === "2019").data
                    .find(p => p.x.getTime() === lookupDate.getTime())
                    .y;
                const y2020 = this.chart.data.datasets
                    .find(d => d.label === "2020").data
                    .find(p => p.x.getTime() === lookupDate.getTime())
                    .y;

                var topYpixel = this.chart.scales['y-axis-0'].top;
                var bottomYpixel = this.chart.scales['y-axis-0'].bottom;
                const minYValue = this.chart.scales['y-axis-0'].min;
                const maxYValue = this.chart.scales['y-axis-0'].max;

                const y0 = topYpixel + (
                    (maxYValue - y2019)
                    / (maxYValue - minYValue)
                    * (bottomYpixel - topYpixel)
                );
                const y1 = topYpixel + (
                    (maxYValue- y2020)
                    / (maxYValue - minYValue)
                    * (bottomYpixel - topYpixel)
                );
    
                // draw line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y0);
                ctx.lineTo(x, y1);
                ctx.lineWidth = 2.0;
                ctx.strokeStyle = '#000000';
                ctx.stroke();
                ctx.restore();
            }
        }
        updateApp(state);
    });

    return rtn;
}

/**
 * Main
 */
function loadapp(region) {
    // Turn on loader.
    document.querySelector("#loader").style.display = "block";
    document.querySelector("#cover").style.display = "block";

    // Get meta data.
    var metaData = getDatasetsMeta(region);

    // Read in all the required data.
    Promise.all(metaData.map(d => d3.csv(d.filepath)))
        .catch(function(err) { return console.log(err); })
        .then(function(files) {
            console.log("All data loaded successfully.");
            for (var i = 0; i < files.length; i++) {
                metaData[i].data = files[i].map(function(data) {
                    var newDate = new Date(data.date);
                    return {
                        ...data,
                        date: new Date(
                            newDate.getTime()
                            + Math.abs(newDate.getTimezoneOffset()*60000)
                        )
                    };
                });
            };

            var processedData = processData(metaData, region);

            // Handle the data by chart type.
            switch(region) {
                case "country":
                    initializeTabCountry(processedData);
                    break;
                case "national":
                    initializeTabNational(processedData);
                    break;
                case "state":
                    initializeTabState(processedData);
                    break;
                case "metro":
                    initializeTabMetro(processedData);
                    break;
                default:
                    break;
            };

            // Pull off the loader.
            document.querySelector("#loader").style.display = "none";
            document.querySelector("#cover").style.display = "none";
        });
};


// Initialize App.
loadapp(settings["initialRegion"]);

// Listen for navigation change.
$('#myTabs a').click(function (e) {
    e.preventDefault();
    if ($(this)[0].attributes.region.value != currentRegion) {
        currentRegion = $(this)[0].attributes.region.value;
        $(this).tab('show')
        console.log("Loading", currentRegion)
        loadapp(currentRegion);
    };
});
