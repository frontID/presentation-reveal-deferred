
Reveal.addEventListener( 'barchart', function() {
    var width = 1000,
        height = 500;
    
    var color = 'green';
    
    // only display on the first visit to the slide
    if (!d3.select("#barchart svg").empty()) {
        return;
    }
    
    var svg = d3.select("#barchart").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
    
    
      var g = svg.append("g")
          .attr("class", "bar");
    
      var rect = g.append("rect")
          .style("fill", color)
          .attr("x", -width/2)
          .attr("y", -height/2)
          .attr("width", 0)
          .attr("height", height);
    
    rect.transition()
        .duration(5000)
        .attr("width", width);

});
