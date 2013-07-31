debounce = function (ms, ctx, fn) {
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

updateD3 = function (svg, elem, h, w) {
    return function() {
        svg.select('g').remove();
        
        var draw = new Function('g', 'h', 'w', elem.textContent),
            g = svg.append('g');
            
        draw(g, h, w);
    };
};

interactiveSlide = function(primitive) {
    Reveal.addEventListener('primitive-' + primitive, function() {
        var width = 1000,
            height = 300,
            elem = document.getElementById(primitive + '-code');
            
        d3.select('.' + primitive + '.sandbox').select('svg').remove();
            
        var svg = d3.select('.' + primitive + '.sandbox').append('svg')
            .attr('width', width)
            .attr('height', height)
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    
        var doUpdate = updateD3(svg, elem, height, width);
        
        doUpdate();
        
        elem.onkeypress = debounce(1000, elem, function () {
            doUpdate();
        });
    });
};