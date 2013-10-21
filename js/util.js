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

_sandlog = function (codeElem) {
    return function (msg) {
        console.log(codeElem.id);
        $(codeElem.parentElement.parentElement).find('.sandbox').append('<p>'+ msg +'</p>');
    };
};

function quickFn(val) {
    return val + 99;
}

function slowFn(val) {
    setTimeout(function () {
        return val + 99;
    }, 2000);
}
function wait(ms) {
    var deferred = $.Deferred();
    setTimeout(deferred.resolve, ms);

    // We just need to return the promise not the whole deferred.
    return deferred.promise();
}

updateD3 = function updateD3(svg, elem, parent, h, w, data) {
    return function() {
        svg.selectAll(parent).remove();
        
        elem.innerHTML = hljs.highlight('javascript', elem.textContent, true).value;
        
        var draw = new Function('g', 'h', 'w', elem.textContent),
            g = (data ? svg.selectAll(parent).data(data) : svg).append(parent);
            
        draw(g, h, w);
    };
};

updateData = function create_updateData(svg, elem, parent, h, w) {
    return function updateData() {
        elem.innerHTML = hljs.highlight('javascript', elem.textContent, true).value;
        
        var getData = new Function(elem.textContent + "return data;"),
            update = svg.selectAll(parent)
                .data(getData());
                
        update.select('rect')
            .transition()
            .duration(1000)
            .attr('y', function (d) { return (h/2) - d; })
            .attr('height', function (d) { return d; });
                
        update.enter()
            .append(parent)
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

updateTable = function create_updateTable(table, elem, parent, h, w) {
    return function updateTable() {
        elem.innerHTML = hljs.highlight('javascript', elem.textContent, true).value;
        
        var getData = new Function(elem.textContent + 'return data;'),
            updateRow = table.selectAll(parent)
                .data(getData()),
            updateCell = updateRow.selectAll('td')
                .data(function (d) { return d; });
                
        updateCell.text(function (d) { return d; });
        
        updateRow.enter()
            .append(parent);
            
        var enterCell = updateRow.selectAll('td')
            .data(function (d) { return d; })
            .enter()
            .append('td')
            .style('color', function (d) { return 'rgb(127, ' + d + ', 127)'; })
            .text(function (d) { return d; });
            
        updateRow.exit()
            .remove();
            
        updateCell.exit()
            .remove();
    };
};

// for evan
//updateDeferred = function create_updateDeferred(svg, elem, parent) {
//    return function updateDeferred() {
//        elem.innerHTML = hljs.highlight('javascript', elem.textContent, true).value;
//
//        var fn = new Function('var promise,done,fail;' + elem.textContent + ';return { done:done, fail:fail, promise:promise };')();
//
//        var promise = fn.promise();
//
//        promise.done(fn.done);
//        promise.fail(fn.fail);
//
//    };
//};
updateDeferred = function create_updateDeferred(svg, elem, parent) {
    return function updateDeferred() {
        // sets codeElem for sandlog()
        $(elem.parentElement.parentElement).find('.sandbox').html('');

        elem.innerHTML = hljs.highlight('javascript', elem.textContent, true).value;

        var sandlog = _sandlog(elem);

        var fn = new Function(
            'sandlog',
            'var promise,done,fail,a;' +
             elem.textContent +
            ';return { done:done, fail:fail, promise:promise, a:a, };')(sandlog);


        var promise = fn.promise && fn.promise() || $.Deferred().resolve();
        
        promise.done(fn.done);
        promise.fail(fn.fail);

        //$(elem.parentElement.parentElement).find('.sandbox').html('a = ' + fn.a);
        
    };
};

interactiveSlide = function dataSlide(state, sandbox, updateFn, options) {
    Reveal.addEventListener(state, function addEventListener() {
        var width = 1000,
            height = 300,
            elem = document.getElementById(sandbox + '-code'),
            vscale = (options && options.vscale) ? options.vscale : 1.0,
            hscale = (options && options.hscale) ? options.hscale : 1.0,
            container = (options && options.container) ? options.container : 'svg',
            parent = (options && options.parent) ? options.parent : 'g';
            
        d3.select('.' + sandbox + '.sandbox').select(container).remove();
        
        var svg = d3.select('.' + sandbox + '.sandbox')
          .append(container)
            .attr('width', width)
            .attr('height', height);
            
        if (parent === 'g') {
            svg = svg.append(parent)
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        }
            
        var doUpdate = updateFn(svg, elem, parent, height * vscale, width * hscale);
        
        doUpdate();
        
        elem.onkeypress = debounce(1000, elem, function onkeypress() {
            if (Reveal.psychicCodeDispatch) {
                Reveal.psychicCodeDispatch(elem.id, elem.innerHTML);
            }
            doUpdate();
        });
    });
};