function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;

      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}
  // Initialize the dashboard
  init();

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      console.log(resultArray[0]);
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultSample);
    
    //  5. Create a variable that holds the first sample in the array.
    var resultForSample = resultSample[0];
    console.log(resultForSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // otu_ids
    var otuIds = resultForSample.otu_ids
    var otuIdsSliced = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    //var otuIds = otuIds1.sort((a,b) => 
    //a.otu_ids - b.otu_ids).slice(0,10);
    //console.log(otuIdsSlice.map(`OTU ${otuIds}`)
    console.log(otuIdsSliced)

    //otu_labels // add hover-over labes, check the order if correct
    var otuLables = resultForSample.otu_labels;
    var otuLablesSliced = otuLables.slice(0,10).reverse();
    //var otuLables = otuLables1.sort((a,b) => 
    //a.sample_values - b.sample_values).slice(0,10);
    console.log(otuLablesSliced);

    //otu_values
    var sampleValues = resultForSample.sample_values;
    var sampleValuesSliced = sampleValues.slice(0,10).reverse();

    //var sampleValues = sampleValues1.sort((a,b) => 
    //a.sample_values - b.sample_values).slice(0,10);
    console.log(sampleValuesSliced);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks =  {
    //};
    // var yticks =  {
    //   tickmode: 'array',
    //   nticks: 0,
    //   tickprefix:  (`OTU ${otuIds}`)

    // };

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValuesSliced,
      y: otuIdsSliced, //(`OTU ${otuIds}`)
      text: otuLablesSliced,
      type: "bar",
      orientation: 'h'
    }];
    


    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Frekvency"},
      yaxis: {title: "Type of Bacteria"},
      //showticklabels: true,
      //tickangle: 45,
      //autotick: true,
      //ticklen: 0,
      //yticks: yticks
    
     
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);



//////////////////////////////////////////////// deliverable2 ///////////////////////////////////////
// d3 select - why do we need d3 select here?
//var bubbleChart = d3.select('#row').node().value


  //1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: otuIds,
    y: sampleValues,
    text: otuLables,
    mode: "markers",
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: 'blues',
      hovermode: 'blues',
      margins: '',
    }
    
  }];

  
  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacteria Cultures per Sample",
    xaxis: {title: "OTU ID"},
    yaxis: {title: "Frekvency"}
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);



// ///////////////////////////////////////////////////// deliverable 3 ////////////////////////////////////
// step: 1-3initialize variables that hold arrays for the sample 
//that is selected from the dropdown menu on the webpage
var metadata = data.metadata;
// Filter the data for the object with the desired sample number
var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
console.log(resultArray);

var result = resultArray[0];
console.log(result);

//initialize variables and convert to a float
var wFreq = result.wfreq
var wFreqFloat = parseFloat(wFreq).toFixed( 2 )
console.log(wFreqFloat) //parseFloat(num).toFixed( 2 )


// 4. Create the trace for the gauge chart.
var gaugeData = [{
  title: {text: "Scrubs per Week", font: { size: 18 }},
  type: "indicator",
  mode: "gauge+number",
  value: wFreq,
  delta: { reference: 2},
  gauge: {
    axis: { range: [null, 10] },
    bar: { color: "black" },
    bgcolor: "white",
    borderwidth: 2,
    bordercolor: "gray",
    steps: [
      { range: [0, 2], color: "red" },
      { range: [2, 4], color: "orange" },
      { range: [4, 6], color: "yellow" },
      { range: [6, 8], color: "green" },
      { range: [8, 10], color: "darkgreen" },
    ]},

  //color of the gauge = "black"
  //Assign different colors as string values in increments of 2

     
}];

// // 5. Create the layout for the gauge chart.
var gaugeLayout = { 
  title: "Belly Button Washing Frequency"
};

// // 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout)
});
}
