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