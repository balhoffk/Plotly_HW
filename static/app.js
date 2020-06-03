// 1. Read in `samples.json`.
init();

var sampleNames;
function init() {
    var selector = d3.select('#selDataset');
    
    d3.json("samples.json").then(function(data) {
        sampleNames = data.names;
        sampleNames.forEach(name => {
            selector
                .append('option')
                .text(name)
                .property('value',name);
        });

        var sampleone = sampleNames[0];
        buildCharts(sampleone);
        buildMetadata(sampleone);
    });
};

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
};

function buildMetadata(sample) {
    d3.json('samples.json').then(data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var panel = d3.select('#sample-metadata');
        panel.html('');

        Object.entries(result).forEach(([key,value])=> {
            panel.append('h6').text(`${key.toUpperCase()}: ${value}`);
        });
    });
};

function buildCharts(sample) {
    d3.json('samples.json').then(data => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample)
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleLayout = {
            title: 'Cultures Per Sample',
            margin: { t: 0 },
            hovermode: 'closest',
            xaxis: { title: 'OTU ID'},
            margin: { t: 30 },
        };
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: 'Greens'
                }
            }
        ];

        Plotly.newPlot('bubble',bubbleData,bubbleLayout);

        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: 'bar',
                orientation: 'h'
            }
        ];
        var barLayout = {
            title: 'Top 10 OTUs Found In Individual',
            margin: { t: 25, l: 140 }
        };
        Plotly.newPlot('bar',barData,barLayout);
    });
};




// creating a horizontal bar chart
//  Create a horizontal bar chart with a dropdown menu to
//  display the top 10 OTUs found in that individual.
// * Use `sample_values` as the values for the bar chart.
// * Use `otu_ids` as the labels for the bar chart.
// * Use `otu_labels` as the hovertext for the chart.

// creating trace for bar chart

// var trace1 = {
//     x: [data.otu_ids],
//     y:[data.sample_values],
//     type: "bar"
// };

// var data = [trace1]
// var layout = {
//     title: "Top 10 OTUs",
//     xaxis: {title: "otu_labels"},
//     yaxis: {title: "count"}
// };

// Plotly.newPlot("samples",data,layout)

// // 3. Create a bubble chart that displays each sample.
// // * Use `otu_ids` for the x values.
// // * Use `sample_values` for the y values.
// // * Use `sample_values` for the marker size.
// // * Use `otu_ids` for the marker colors.
// // * Use `otu_labels` for the text values.

// // https://www.d3-graph-gallery.com/graph/bubble_color.html
// // Add X axis
// var x = d3.scaleLinear()
// .domain([0, 12000])
// .range([ 0, width ]);
// svg.append("g")
// .attr("transform", "translate(0," + height + ")")
// .call(d3.axisBottom(x));

// // Add Y axis
// var y = d3.scaleLinear()
// .domain([35, 90])
// .range([ height, 0]);
// svg.append("g")
// .call(d3.axisLeft(y));

// // Add a scale for bubble size
// var z = d3.scaleLinear()
// .domain([200000, 1310000000])
// .range([ 4, 40]);

// // Add a scale for bubble color
// var myColor = d3.scaleOrdinal()
// .domain([data.otu_labels])
// .range(d3.schemeSet2);

// // Add dots
// svg.append('g')
// .selectAll("dot")
// .data(data)
// .enter()
// .append("circle")
//   .attr("cx", function (d) { return x(d.gdpPercap); } )
//   .attr("cy", function (d) { return y(d.lifeExp); } )
//   .attr("r", function (d) { return z(d.pop); } )
//   .style("fill", function (d) { return myColor(d.continent); } )
//   .style("opacity", "0.7")
//   .attr("stroke", "white")
//   .style("stroke-width", "2px")