function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = "/metadata";
  var path = url + sample;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(path).then(function(response){

      // Use d3 to select the panel with id of `#sample-metadata`
    
      // Use `.html("") to clear any existing metadata
      var metadata = d3.select("#sample-metadata").html("")

      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(response).forEach(([key, value]) => {
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
        metadata.append("p").text(`${key}: ${value}`)
      });

    })
  }
  

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/";
  var path = url + sample;

  d3.json(path).then(function(response){

    // @TODO: Build a Bubble Chart using the sample data
      var trace1_bubble = {
        x: response.otu_ids,
        y: response.sample_values,
        text: response.otu_labels,
        mode:'markers',
        marker:{size: response.sample_values,
                color: response.otu_ids
              }
      }

      var data_bubble = [trace1_bubble];
      var layout_bubble = {
                          xaxis: {title: 'OTU ID'}
                          }
      Plotly.newPlot("bubble",data_bubble,layout_bubble);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace1_pie = {
      values: response.sample_values.slice(0,10),
      labels:  response.otu_ids.slice(0,10),
      type:'pie',
      hovertext : response.otu_labels.slice(0,10)
    };

    var data_pie = [trace1_pie];
    var layout_pie = {height:400,width:500};
    Plotly.newPlot("pie",data_pie,layout_pie)

    })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
