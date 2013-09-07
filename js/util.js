debounce = function debounce(ms, ctx, fn) {
    var fnKey = fn.toString(),
        fullFn = function() {
            clearTimeout(window[fnKey]);
            delete window[fnKey];
            fn.call(ctx);
        };
        
    return function() {
        if (window[fnKey]) {
            clearTimeout(window[fnKey]);
        }
        
        window[fnKey] = setTimeout(fullFn, ms);
    };
};

updateD3 = function updateD3(svg, elem, h, w, data) {
    return function() {
        svg.selectAll('g').remove();
        
        elem.innerHTML = hljs.highlight('javascript', elem.textContent, true).value;
        
        var draw = new Function('g', 'h', 'w', elem.textContent),
            g = (data ? svg.selectAll('g').data(data) : svg).append('g');
            
        draw(g, h, w);
    };
};

interactiveSlide = function interactiveSlide(state, sandbox) {
    Reveal.addEventListener(state, function addEventListener() {
        var width = 1000,
            height = 300,
            elem = document.getElementById(sandbox + '-code');
            
        d3.select('.' + sandbox + '.sandbox').select('svg').remove();
            
        var svg = d3.select('.' + sandbox + '.sandbox').append('svg')
            .attr('width', width)
            .attr('height', height)
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    
        var doUpdate = updateD3(svg, elem, height, width);
        
        doUpdate();
        
        elem.onkeypress = debounce(1000, elem, function onkeypress() {
            if (Reveal.psychicCodeDispatch) {
                Reveal.psychicCodeDispatch(elem.id, elem.innerHTML);
            }
            doUpdate();
        });
    });
};

updateData = function create_updateData(svg, elem, h, w) {
    return function updateData() {
        elem.innerHTML = hljs.highlight('javascript', elem.textContent, true).value;
        
        var getData = new Function(elem.textContent + "return data;"),
            update = svg.selectAll('.bar')
                .data(getData());
                
        update.select('rect')
            .transition()
            .duration(1000)
            .attr('y', function (d) { return (h/2) - d; })
            .attr('height', function (d) { return d; });
                
        update.enter()
            .append('g')
            .attr('class', 'bar')
            .append('rect')
            .attr('x', function(d, i) { return (100 * i) - (w / 2); })
            .attr('y', function (d) { return (h/2) - d; })
            .attr('width', 75)
            .attr('height', function(d) { return d; })
            .style('fill', 'white')
            .style('stroke', 'green')
            .style('stroke-width', '10px')
            .transition()
            .duration(1000)
            .style('stroke', 'black');
            
        update.exit().transition()
            .duration(1000)
            .remove();
            
        update.exit().select('rect')
            .transition()
            .duration(1000)
            .style('stroke', 'white');
    };
};

dataSlide = function dataSlide(state, sandbox) {
    Reveal.addEventListener(state, function addEventListener() {
        var width = 1000,
            height = 300,
            elem = document.getElementById(sandbox + '-code');
            
        d3.select('.' + sandbox + '.sandbox').select('svg').remove();
        
        var svg = d3.select('.' + sandbox + '.sandbox')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
            
        var dataUpdate = updateData(svg, elem, height * 0.9, width * 0.9);
        
        dataUpdate();
        
        elem.onkeypress = debounce(1000, elem, function () {
            if (Reveal.psychicCodeDispatch) {
                Reveal.psychicCodeDispatch(elem.id, elem.innerHTML);
            }
            dataUpdate();
        });
    });
};