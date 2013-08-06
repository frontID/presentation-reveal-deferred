
Reveal.addEventListener( 'barchart', function() {
    var width = 1000,
        height = 500,
        elem = document.getElementById('barchart-code');
    
    d3.select('.barchart.showcase').select('svg').remove();
    
    var svg = d3.select(".barchart.showcase").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    var doUpdate = updateD3(svg, elem, height, width);
        
    doUpdate();
        
    elem.onkeypress = debounce(1000, elem, function () {
        if (Reveal.psychicCodeDispatch) {
            Reveal.psychicCodeDispatch(elem.id, elem.innerHTML);
        }

        doUpdate();
    });
});
