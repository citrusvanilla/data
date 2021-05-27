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

var currentRegion;


function shortDate(date) {
    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    var shortYear = date.getFullYear().toString();
    return months[date.getMonth()] + " " + date.getDate() + ", " + shortYear;
}

function updateAppSector(data, sectors, chart) {
    // Update dates.
    if (sectors.length) {
        chartDatesP1.innerHTML = (
            "% change in job postings since "
            + shortDate(new Date(data[sectors[0]][0].x))
        ).split(" ").join("&nbsp;");    
        chartDatesP2.innerHTML = (
            ", seasonally adjusted, to "
            + shortDate(new Date(data[sectors[0]][data[sectors[0]].length - 1].x))
        ).split(" ").join("&nbsp;");
    };

    // Swap old with new datasets.
    chart.data.labels.pop();
    while (chart.data.datasets.length) { chart.data.datasets.pop() };
    for (var i = 0; i < sectors.length; i++) {
        chart.data.datasets.push({
            label: sectors[i],
            data: data[sectors[i]],
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
            .filter(function() { return this.innerText == sectors[i]; })
            .css('background-color', settings["availableColors"][i][0]);
    };
    chart.update();
};

function initializeTabSector(processedData) {
    // Chart.
    var chart = initChartSector();

    // Style.
    chartTitle.innerText = "Total Job Postings on Indeed by Sector";
    chartDatesP1.innerHTML = "";

    // Style.
    $("#search-container").css('display','block');
    selectionsContainer.style.display = "flex";
    selectionsPrompt.style.display = "block";
    selectionsPrompt.innerText = "Search for sectors in the box below (limit 8):";

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
    settings["defaults"]['sector'].forEach((m,i) => {
        $('.tagsinput-typeahead').tagsinput('add', m);
        $(".tag")
            .filter(function() { return this.innerText == m; })
            .css('background-color', settings["availableColors"][i][0]);
    });
    updateAppSector(processedData, settings["defaults"]['sector'], chart);

    // Listen for updates.
    $('.tagsinput-typeahead').change(function() {    
        updateAppSector(
            processedData,
            $('.tagsinput-typeahead').tagsinput('items'),
            chart
        );
    });
};

function updateAppMetro(data, metros, chart) {
    // Update dates.
    if (metros.length) {
        chartDatesP1.innerHTML = (
            "% change in job postings since "
            + shortDate(new Date(data[metros[0]][0].x))
        ).split(" ").join("&nbsp;");    
        chartDatesP2.innerHTML = (
            ", seasonally adjusted, to "
            + shortDate(new Date(data[metros[0]][data[metros[0]].length - 1].x))
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
    chartTitle.innerText = "Total Job Postings on Indeed by US Metro";
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

    // Update dates.
    if (states.length) {
        chartDatesP1.innerHTML = (
            "% change in job postings since "
            + shortDate(new Date(data[statesAbvs[0]][0].x))
        ).split(" ").join("&nbsp;");    
        chartDatesP2.innerHTML = (
            ", seasonally adjusted, to "
            + shortDate(new Date(data[statesAbvs[0]][data[statesAbvs[0]].length - 1].x))
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
    chartTitle.innerText = "Total Job Postings on Indeed by US State";
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
            "% change in job postings since "
            + shortDate(new Date(data[metros[0]][0].x))
        ).split(" ").join("&nbsp;");    
        chartDatesP2.innerHTML = (
            ", seasonally adjusted, to "
            + shortDate(new Date(data[metros[0]][data[metros[0]].length - 1].x))
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

function initializeTabNational(processedData) {
    // Chart.
    var chart = initChartNational();

    // Style.
    chartTitle.innerText = "Job Postings on Indeed by Wage Tier in the US";
    chartDatesP1.innerHTML = "";

    // Style.
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
            "% change in job postings since "
            + shortDate(new Date(data[countries[0]][0].x))
        ).split(" ").join("&nbsp;");    
        chartDatesP2.innerHTML = (
            ", seasonally adjusted, to "
            + shortDate(new Date(data[countries[0]][data[countries[0]].length - 1].x))
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

function initializeTabCountry(processedData, country) {
    // Chart.
    var chart = initChartCountry();

    // Style.
    chartTitle.innerText = "Total Job Postings on Indeed by Country";
    chartDatesP1.innerHTML = "";

    $(".postingsTrendByMetro").css('display','block');
    selectionsContainer.style.display = "flex";
    selectionsPrompt.style.display = "block";
    selectionsPrompt.innerText = "Select Australia, Canada, France, Germany, United Kingdom, and/or United States below:";

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
                processedData[dataset.name] = dataset.data.filter(row => {
                    return row.variable === "total postings"
                }).map(row => {
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
                var cleanName = row["CBSA Title"].replace(", ", "--");
                if (cleanName in processedData) {
                    processedData[cleanName].push({ x: row.date, y: row[settings["yLabels"]["metro"]] }) 
                } else {
                    processedData[cleanName] = [{ x: row.date, y: row[settings["yLabels"]["metro"]] }];
                };
            };
            return processedData;
        case "sector":            
            var processedData = {};
            for (var row of metaData[0].data) {
                var cleanName = row["display_name"];
                if (cleanName in processedData) {
                    processedData[cleanName].push({ x: row.date, y: row[settings["yLabels"]["sector"]] }) 
                } else {
                    processedData[cleanName] = [{ x: row.date, y: row[settings["yLabels"]["sector"]] }];
                };
            };
            return processedData;
        default:
            break;
    };
};

function getDatasetsMeta(region, country) {
    switch (region) {
        case "country":
            return [
                {
                    name: "Australia",
                    filepath: "./AU/aggregate_job_postings_AU.csv",
                    data: null
                },
                {
                    name: "Canada",
                    filepath: "./CA/aggregate_job_postings_CA.csv",
                    data: null
                },
                {
                    name: "France",
                    filepath: "./FR/aggregate_job_postings_FR.csv",
                    data: null
                },
                {
                    name: "Germany",
                    filepath: "./DE/aggregate_job_postings_DE.csv",
                    data: null
                },
                {
                    name: "United Kingdom",
                    filepath: "./GB/aggregate_job_postings_GB.csv",
                    data: null
                },
                {
                    name: "United States",
                    filepath: "./US/aggregate_job_postings_US.csv",
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
                    filepath: "./US/state_job_postings_us.csv",
                    data: null
                }
            ];
        case "metro":
            return [
                {
                    filepath: "./US/metro_job_postings_us.csv",
                    data: null
                }
            ];
        case "sector":
            switch (country) {
                case "au":
                    return [
                        {
                            name: "Australia",
                            filepath: "./AU/job_postings_by_sectorAU.csv",
                            data: null
                        }
                    ]
                case "ca":
                    return [
                        {
                            name: "Canada",
                            filepath: "./CA/job_postings_by_sectorCA.csv",
                            data: null
                        }
                    ]
                case "fr":
                    return [
                        {
                            name: "France",
                            filepath: "./FR/job_postings_by_sectorFR.csv",
                            data: null
                        }
                    ]
                case "de":
                    return [
                        {
                            name: "Germany",
                            filepath: "./DE/job_postings_by_sectorDE.csv",
                            data: null
                        }
                    ]
                case "gb":
                    return [
                        {
                            name: "United Kingdom",
                            filepath: "./GB/job_postings_by_sectorGB.csv",
                            data: null
                        }
                    ]
                case "us":
                    return [
                        {
                            name: "United States",
                            filepath: "./US/job_postings_by_sectorUS.csv",
                            data: null
                        }
                    ]
                default:
                    return [
                        {
                            name: "United States",
                            filepath: "./US/job_postings_by_sectorUS.csv",
                            data: null
                        }
                    ]
            }
        default:
            break;
    };
};

/**
 * Main
 */
function loadapp(region, country) {
    // Turn on loader.
    document.querySelector("#loader").style.display = "block";
    document.querySelector("#cover").style.display = "block";

    if (!["", "us"].includes(country.toLowerCase())) {
        document.querySelector("#stateTab").style.display = "none";
        document.querySelector("#metroTab").style.display = "none";
    };

    // Get meta data.
    var metaData = getDatasetsMeta(region, country);

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
                    initializeTabCountry(processedData, country);
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
                case "sector":
                    initializeTabSector(processedData);
                    break;
                default:
                    break;
            };

            // Pull off the loader.
            document.querySelector("#loader").style.display = "none";
            document.querySelector("#cover").style.display = "none";
        });
};



// Listen for navigation change.
$('#myTabs a').click(function (e) {
    e.preventDefault();
    if ($(this)[0].attributes.region.value != currentRegion) {
        currentRegion = $(this)[0].attributes.region.value;
        $(this).tab('show')
        console.log("Loading", currentRegion)
        loadapp(currentRegion, country);
    };
});

// Get the hash.
var hash = window.location.hash;
var country = hash.replace("#", "").toLowerCase();

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
            "Austin-Round Rock-Georgetown--TX",
            "San Francisco-Oakland-Berkeley--CA",
            "New York-Newark-Jersey City--NY-NJ-PA"
        ],
        "sector": [
            "Hospitality & Tourism",
            "Software Development"
        ]
    },
    initialRegion: "country",
    yLabels: {
        "country": "pct_chng_feb_1",
        "state": "pct_chng_feb_1",
        "nation": "% gap in trend over last year",
        "metro": "pct_chng_feb_1",
        "sector": "pct_chng_feb_1"
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
};

switch(country.toLowerCase()) {
    case "au":
        settings["defaults"]["country"] = [
            "Australia"
        ]
        break;
    case "ca":
        settings["defaults"]["country"] = [
            "Canada"
        ]
        break;
    case "fr":
        settings["defaults"]["country"] = [
            "France"
        ]
        break;
    case "de":
        settings["defaults"]["country"] = [
            "Germany"
        ]
        break;
    case "uk":
        settings["defaults"]["country"] = [
            "United Kingdom"
        ]
        break;
    case "us":
        settings["defaults"]["country"] = [
            "United States"
        ]
        break;
    default:
        settings["defaults"]["country"] = [
            "United States",
            "Canada"
        ]
        break;
};

// Initialize App.
loadapp(settings["initialRegion"], country);
