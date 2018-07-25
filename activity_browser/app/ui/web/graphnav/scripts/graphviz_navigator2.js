
/*
var jsondata = '{"nodes": [{"id": "eb3b15cfce031f9f7494882cccaa04bf", "product": "1,1-dimethylcyclopentane", "name": "market for 1,1-dimethylcyclopentane", "location": "GLO"}, {"id": "304d42eabdcfe000e76034a265f7aa6a", "product": "solvent, organic", "name": "1,1-dimethylcyclopentane to generic market for solvent, organic", "location": "GLO"}], "edges": [{"source": "eb3b15cfce031f9f7494882cccaa04bf", "target": "304d42eabdcfe000e76034a265f7aa6a", "label": "1,1-dimethylcyclopentane"}]}'
console.log ("Hello World");

var heading = document.getElementById("heading"); */

// document.getElementById("data").innerHTML = "no data yet";

// SETUP GRAPH
// https://github.com/dagrejs/graphlib/wiki/API-Reference
// HOW TO SET EDGES AND NODES MANUALLY USING GRAPHLIB:
// digraph.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100 });
// digraph.setEdge("kspacey",   "swilliams");
// var graph = new dagre.graphlib.Graph({ multigraph: true });

// Set an object for the graph label
// graph.setGraph({});


// Create and configure the renderer
// var render = dagreD3.render();


function windowSize() {
    w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = g.clientWidth || w.innerWidth || e.clientWidth;
    y = g.clientHeight || w.innerHeight|| e.clientHeight;
    return [x,y];
};

/* Adapted code from Bill White's Thumbnail Demo
http://www.billdwhite.com/wordpress/2017/09/ */

var svg = {};

var width = windowSize.x,
    height   = windowSize.y;

d3.demo = {};


/** CANVAS **/
d3.demo.canvas = function() {

    "use strict"

    var base            = null,
        wrapperBorder   = 0,
        minimap         = null,
        minimapPadding  = 10,
        minimapScale    = 0.25;

    function canvas(selection) {

        base = selection;

        var svgWidth = (width  + (wrapperBorder*2) + minimapPadding*2 + (width*minimapScale));
        var svgHeight = (height + (wrapperBorder*2) + minimapPadding*2);

        svg = selection.append("svg")
            .attr("class", "svg canvas")
            //.attr("width", svgWidth)
            //.attr("height", svgHeight)
            .attr("viewBox", "0 0" + " " + svgWidth + " " + svgHeight)
            .attr("shape-rendering", "auto")
            .append("g")

        var svgDefs = svg.append("defs");
        svgDefs.append("clipPath")
            .attr("id", "wrapperClipPath_qwpyza")
            .attr("class", "wrapper clipPath")
            .append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);
        svgDefs.append("clipPath")
            .attr("id", "minimapClipPath_qwpyza")
            .attr("class", "minimap clipPath")
            .attr("width", width)
            .attr("height", height)
            .append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

        var filter = svgDefs.append("svg:filter")
            .attr("id", "minimapDropShadow_qwpyza")
            .attr("x", "-20%")
            .attr("y", "-20%")
            .attr("width", "150%")
            .attr("height", "150%");
        filter.append("svg:feOffset")
            .attr("result", "offOut")
            .attr("in", "SourceGraphic")
            .attr("dx", "1")
            .attr("dy", "1");
        filter.append("svg:feColorMatrix")
            .attr("result", "matrixOut")
            .attr("in", "offOut")
            .attr("type", "matrix")
            .attr("values", "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.5 0");
        filter.append("svg:feGaussianBlur")
            .attr("result", "blurOut")
            .attr("in", "matrixOut")
            .attr("stdDeviation", "10");
        filter.append("svg:feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "blurOut")
            .attr("mode", "normal");

        var minimapRadialFill = svgDefs.append("radialGradient")
            .attr('id', "minimapGradient")
            .attr('gradientUnits', "userSpaceOnUse")
            .attr('cx', "500")
            .attr('cy', "500")
            .attr('r', "400")
            .attr('fx', "500")
            .attr('fy', "500");
        minimapRadialFill.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#FFFFFF");
        minimapRadialFill.append("stop")
            .attr("offset", "40%")
            .attr("stop-color", "#EEEEEE")
        minimapRadialFill.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#E0E0E0");

        var outerWrapper = svg.append("g")
            .attr("class", "wrapper outer")
            .attr("transform", "translate(0, " + minimapPadding + ")");
        outerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", width + wrapperBorder*2)
            .attr("height", height + wrapperBorder*2);

        var innerWrapper = outerWrapper.append("g")
            .attr("class", "wrapper inner")
            .attr("clip-path", "url(#wrapperClipPath_qwpyza)")
            .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")");

        innerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

        var panCanvas = innerWrapper.append("g")
            .attr("class", "panCanvas")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(0,0)")
            .append("g")

        panCanvas.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

        var zoom = d3.zoom()
            .scaleExtent([0.1, 5]);

        // updates the zoom boundaries based on the current size and scale
        var updateCanvasZoomExtents = function() {
            var scale = innerWrapper.property("__zoom").k;
            var targetWidth = svgWidth;
            var targetHeight = svgHeight;
            var viewportWidth = width;
            var viewportHeight = height;
            zoom.translateExtent([
                [-viewportWidth/scale, -viewportHeight/scale],
                [(viewportWidth/scale + targetWidth), (viewportHeight/scale + targetHeight)]
            ]);
        };

        var zoomHandler = function() {
            panCanvas.attr("transform", d3.event.transform);
            // here we filter out the emitting of events that originated outside of the normal ZoomBehavior; this prevents an infinite loop
            // between the host and the minimap
            if (d3.event.sourceEvent instanceof MouseEvent || d3.event.sourceEvent instanceof WheelEvent) {
                minimap.update(d3.event.transform);
            }
            updateCanvasZoomExtents();
        };

        zoom.on("zoom", zoomHandler);

        innerWrapper.call(zoom);

        // initialize the minimap, passing needed references
        minimap = d3.demo.minimap()
            .host(canvas)
            .target(panCanvas)
            .minimapScale(minimapScale)
            .x(width + minimapPadding)
            .y(minimapPadding);

        svg.call(minimap);

        /** ADD SHAPE **/
        canvas.addItem = function() {
            canvas.reset();
            panCanvas.call(render, graph);
            //svg.call(minimap); # TODO : statement to reset Minimap to only show new graph
            minimap.render();
        };

        /** RENDER **/
        canvas.render = function() {
            svgDefs
                .select(".clipPath .background")
                .attr("width", width)
                .attr("height", height);

            svg
                .attr("width",  width  + (wrapperBorder*2) + minimapPadding*2 + (width*minimapScale))
                .attr("height", height + (wrapperBorder*2));

            outerWrapper
                .select(".background")
                .attr("width", width + wrapperBorder*2)
                .attr("height", height + wrapperBorder*2);

            innerWrapper
                .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")")
                .select(".background")
                .attr("width", width)
                .attr("height", height);

            panCanvas
                .attr("width", width)
                .attr("height", height)
                .select(".background")
                .attr("width", width)
                .attr("height", height);

            minimap
                .x(width + minimapPadding)
                .y(minimapPadding)
                .render();
        };

        canvas.reset = function() {
            //svg.call(zoom.event);
            //svg.transition().duration(750).call(zoom.event);
            zoom.transform(panCanvas, d3.zoomIdentity);
            svg.property("__zoom", d3.zoomIdentity);
            minimap.update(d3.zoomIdentity);
        };

        canvas.update = function(minimapZoomTransform) {
            zoom.transform(panCanvas, minimapZoomTransform);
            // update the '__zoom' property with the new transform on the rootGroup which is where the zoomBehavior stores it since it was the
            // call target during initialization
            innerWrapper.property("__zoom", minimapZoomTransform);

            updateCanvasZoomExtents();
        };

        updateCanvasZoomExtents();
    }


    //============================================================
    // Accessors
    //============================================================

    canvas.width = function(value) {
        if (!arguments.length) return width;
        width = parseInt(value, 10);
        return this;
    };

    canvas.height = function(value) {
        if (!arguments.length) return height;
        height = parseInt(value, 10);
        return this;
    };

    return canvas;
};



/** MINIMAP **/
d3.demo.minimap = function() {

    "use strict";

    var minimapScale    = 0.15,
        host            = null,
        base            = null,
        target          = null,
        width           = 0,
        height          = 0,
        x               = 0,
        y               = 0;

    function minimap(selection) {

        base = selection;

        var zoom = d3.zoom()
            .scaleExtent([0.1, 5]);

        // updates the zoom boundaries based on the current size and scale
        var updateMinimapZoomExtents = function() {
            var scale = container.property("__zoom").k;
            var targetWidth = parseInt(target.attr("width"));
            var targetHeight = parseInt(target.attr("height"));
            var viewportWidth = host.width();
            var viewportHeight = host.height();
            zoom.translateExtent([
                [-viewportWidth/scale, -viewportHeight/scale],
                [(viewportWidth/scale + targetWidth), (viewportHeight/scale + targetHeight)]
            ]);
        };

        var zoomHandler = function() {
            frame.attr("transform", d3.event.transform);
            // here we filter out the emitting of events that originated outside of the normal ZoomBehavior; this prevents an infinite loop
            // between the host and the minimap
            if (d3.event.sourceEvent instanceof MouseEvent || d3.event.sourceEvent instanceof WheelEvent) {
                // invert the outgoing transform and apply it to the host
                var transform = d3.event.transform;
                // ordering matters here! you have to scale() before you translate()
                var modifiedTransform = d3.zoomIdentity.scale(1/transform.k).translate(-transform.x, -transform.y);
                host.update(modifiedTransform);
            }

            updateMinimapZoomExtents();
        };

        zoom.on("zoom", zoomHandler);

        var container = selection.append("g")
            .attr("class", "minimap");

        container.call(zoom);

        minimap.node = container.node();

        var frame = container.append("g")
            .attr("class", "frame")

        frame.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("filter", "url(#minimapDropShadow_qPWKOg)");


        minimap.update = function(hostTransform) {
            // invert the incoming zoomTransform; ordering matters here! you have to scale() before you translate()
            var modifiedTransform = d3.zoomIdentity.scale((1/hostTransform.k)).translate(-hostTransform.x, -hostTransform.y);
            // call this.zoom.transform which will reuse the handleZoom method below
            zoom.transform(frame, modifiedTransform);
            // update the new transform onto the minimapCanvas which is where the zoomBehavior stores it since it was the call target during initialization
            container.property("__zoom", modifiedTransform);

            updateMinimapZoomExtents();
        };


        /** RENDER **/
        minimap.render = function() {
            // update the placement of the minimap
            container.attr("transform", "translate(" + x + "," + y + ")scale(" + minimapScale + ")");
            // update the visualization being shown by the minimap in case its appearance has changed
            var node = target.node().cloneNode(true);
            node.removeAttribute("id");
            base.selectAll(".minimap .panCanvas").remove();
            minimap.node.appendChild(node); // minimap node is the container's node
            d3.select(node).attr("transform", "translate(0,0)");
            // keep the minimap's viewport (frame) sized to match the current visualization viewport dimensions
            frame.select(".background")
                .attr("width", width)
                .attr("height", height);
            frame.node().parentNode.appendChild(frame.node());
        };

        updateMinimapZoomExtents();
    }


    //============================================================
    // Accessors
    //============================================================


    minimap.width = function(value) {
        if (!arguments.length) return width;
        width = parseInt(value, 10);
        return this;
    };


    minimap.height = function(value) {
        if (!arguments.length) return height;
        height = parseInt(value, 10);
        return this;
    };


    minimap.x = function(value) {
        if (!arguments.length) return x;
        x = parseInt(value, 10);
        return this;
    };


    minimap.y = function(value) {
        if (!arguments.length) return y;
        y = parseInt(value, 10);
        return this;
    };


    minimap.host = function(value) {
        if (!arguments.length) { return host;}
        host = value;
        return this;
    }


    minimap.minimapScale = function(value) {
        if (!arguments.length) { return minimapScale; }
        minimapScale = value;
        return this;
    };


    minimap.target = function(value) {
        if (!arguments.length) { return target; }
        target = value;
        width  = parseInt(target.attr("width"),  10);
        height = parseInt(target.attr("height"), 10);
        return this;
    };

    return minimap;
};

/** RUN SCRIPT **/

var canvas = d3.demo.canvas().width(1000).height(800);
d3.select("#canvasqPWKOg").call(canvas);

d3.select("#resetButtonqPWKOg").on("click", function() {
    canvas.reset();
});

/* End of adapted demo code */


/**
 * Build svg container and listen for zoom and drag calls
 */

/*
var svg = d3.select("body")
 .append("svg")
 .attr("viewBox", "0 0 600 400")
 .attr("height", "100%")
 .attr("width", "100%")
 .call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
 }))
 .append("g") */

var render = dagreD3.render();
var graph = {}

function update_graph(json_data) {
    console.log("Updating Graph")
	data = JSON.parse(json_data)

	heading.innerHTML = data.title;

	// reset graph
	graph = new dagre.graphlib.Graph({ multigraph: true });
	graph.setGraph({});

	  // nodes --> graph
	  data.nodes.forEach(function(n) {

	    graph.setNode(n['id'], {
	      label: chunkString(n['name'], 40),
	      product: n['product'],
	      location: n['location'],
	      id: n['id'],
	      database: n['db'],
	    });
	  });

    console.log("Nodes successfully loaded...");

	  // edges --> graph
	  data.edges.forEach(function(e) {
	  	// document.writeln(e['source']);
	    graph.setEdge(e['source_id'], e['target_id'], {label: chunkString(e['label'], 40)
	    });
	  });

    console.log("Edges successfully loaded...")
	  // Render the graph into svg g
	  canvas.addItem()
	  //svg.call(render, graph);


	  // Adds click listener, calling handleMouseClick func
	  var nodes = svg.selectAll("g .node")
	      .on("click", handleMouseClick)
	      console.log ("click!");

	// Function called on click

	function handleMouseClick(node){
        //launch downstream exploration on shift+clicked node
		if (window.event.shiftKey){
            console.log ('shift')

            new QWebChannel(qt.webChannelTransport, function (channel) {
                window.bridge = channel.objects.bridge;
                window.bridge.node_clicked_expand(
                  graph.node(node).database + ";" + graph.node(node).id
                );
                window.bridge.graph_ready.connect(update_graph);
            });


        //launch reduction on alt+clicked node
		} else if (window.event.altKey){
            console.log ('alt')

            new QWebChannel(qt.webChannelTransport, function (channel) {
                window.bridge = channel.objects.bridge;
                window.bridge.node_clicked_reduce(
                  graph.node(node).database + ";" + graph.node(node).id
                );
                window.bridge.graph_ready.connect(update_graph);
            });


        //launch navigation from clicked node
		} else  {
            console.log ('no additional key')
            new QWebChannel(qt.webChannelTransport, function (channel) {
                window.bridge = channel.objects.bridge;
                window.bridge.node_clicked(
                  graph.node(node).database + ";" + graph.node(node).id
                );
            window.bridge.graph_ready.connect(update_graph);
            });
	}

};
};


// break strings into multiple lines after certain length if necessary
function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g')).join("\n");
}


new QWebChannel(qt.webChannelTransport, function (channel) {
    window.bridge = channel.objects.bridge;
    window.bridge.graph_ready.connect(update_graph);
});

