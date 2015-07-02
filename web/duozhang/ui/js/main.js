w = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
x = w.innerWidth || e.clientWidth || g.clientWidth,
y = w.innerHeight|| e.clientHeight|| g.clientHeight;

highlightBugIds = []

var resolution = 1, //perhaps make slider?
    speedUp = 400,
    au = 149597871, //km
    radiusSun = 695800, //km
    radiusJupiter = 69911, //km
    phi = 0, //rotation of ellipses
    radiusSizer = 6, //Size increaser of radii of planets
    planetOpacity = 0.6;

var t_highligtAndDim = null;

function genColorRadius(color) {
    var _mapping = {
        'red': ['url(#radialGradient-red)', 20],
        'orange': ['url(#radialGradient-orange)', 15],
        'yellow': ['url(#radialGradient-yellow)', 12],
        'elevated': ['url(#radialGradient-elevated)', 9],
        null: ['url(#radialGradient-normal)', 7],
    };
    return _mapping[color];
}

function DistanceFactory(minCreatedTs, maxCreatedTs) {
    var _min = 80,
        _k = 550;
    return {
        minCreatedTs: minCreatedTs,
        maxCreatedTs: maxCreatedTs,
        delta: maxCreatedTs - minCreatedTs,
        genDistance: function (createdTs) {
            return _min + _k * ((createdTs - parseFloat(this.minCreatedTs)) / this.delta);
        }
    }
}

function genSpeed(distance) {
    return Math.sqrt(80 / distance) * Math.PI / 180;
}

function genPeriod(distance) {
    return 0.001 * distance * distance
}

function genColor(keywords) {
    var re = /escalated-(red|orange|yellow)/,
        color = null;

    var _result = keywords.match(re);
    if (_result) {
        color = _result[1];
    } else if (keywords.indexOf('elevated') > 0) {
        color = 'elevated';
    }
    return color;
}

//convert rawData to circle properties
function rawDataToCircleData(rawData) {
    // properties:
    //     is_escalated, color -> color, radius
    //     created_ts -> distance
    var distanceFactory = DistanceFactory(rawData['minCt'], rawData['maxCt']),
        circleData = [];
    for (var i = rawData['rawData'].length - 1; i >= 0; i--) {
        var rawItem = rawData['rawData'][i],
            _color = genColor(rawItem['keywords']),
            _colorRadius = genColorRadius(_color),
            _distance = distanceFactory.genDistance(rawItem['creation_ts']);
        var oneItem = {
                'bug_id': rawItem['bug_id'],
                'keywords': rawItem['keywords'],
                'creation_ts': rawItem['creation_ts'],
                'short_desc': rawItem['short_desc'],
                'fill': _colorRadius[0],
                'radius': _colorRadius[1],
                'major': _colorRadius[1],
                'minor': _colorRadius[1],
                'distance': _distance,
                'theta': _distance,
                'speed': genSpeed(_distance),
                'period': genPeriod(_distance),
                'rotation': 0
            };
        circleData.push(oneItem);
    };

    return circleData;
}

function showOrbit(d, i, opacity, svg) {
    var planet = i;
    console.log(d);
    var duration = (opacity == 0) ? 2000 : 50; //If the opacity is zero slowly remove the orbit line
    
    if (duration == 50) {
        console.log(opacity);
    }
    //Highlight the chosen planet
    svg.selectAll(".planet")
        .filter(function(d, i) {return i == planet;})
        .transition().duration(duration)
        .style("stroke-opacity", opacity * 1.25);
    
    //Select the orbit with the same index as the planet
    svg.selectAll(".orbit")
        .filter(function(d, i) {return i == planet;})
        .transition().duration(duration)
        .style("stroke-opacity", opacity)
        .style("fill-opacity", opacity/3);
}

//Show the tooltip on hover
function showTooltip(d) {   

    //Show how to close tooltip
    d3.select("#tooltipInfo").style("visibility", "visible");
    
    //Make a different offset for really small planets
    //var Offset = (rScale(d.Radius)/2 < 2) ? 3 : rScale(d.Radius)/2;
    // var xOffset = ((10*d.radius)/2 < 3) ? 6 : (10*d.radius)/2;
    // var yOffset = ((10*d.radius)/2 < 3) ? 0 : (10*d.radius)/2;

    var xOffset = 15;
    var yOffset = 15;

    //Set first location of tooltip and change opacity
    var xpos = d.x + x/2 - xOffset + 3;
    var ypos = d.y + y/2 - yOffset - 5;
      
    d3.select("#tooltip")
        .style('top',ypos+"px")
        .style('left',xpos+"px")
        .transition().duration(500)
        .style('opacity',1);
        
    //Keep the tooltip moving with the planet, until stopTooltip 
    //returns true (when the user clicks)
    d3.timer(function() { 
      xpos = d.x + x/2 - xOffset + 3;
      ypos = d.y + y/2 - yOffset - 5;
      
     //Keep changing the location of the tooltip
     d3.select("#tooltip")
        .style('top',ypos+"px")
        .style('left',xpos+"px");
    
        //Breaks from the timer function when stopTooltip is changed to true
        //by another function
        if (stopTooltip == true) { 
            //Hide tooltip info again
            d3.select("#tooltipInfo").style("visibility", "hidden");
            //Hide tooltip
            d3.select("#tooltip").transition().duration(300)
                .style('opacity',0)
                .call(endall, function() { //Move tooltip out of the way
                    d3.select("#tooltip")
                        .style('top',0+"px")
                        .style('left',0+"px");
                }); 
            //Remove show how to close
            return stopTooltip;
        }
    });

    //Change the texts inside the tooltip
    d3.select("#tooltip .tooltip-bug-id").text(d.bug_id);
    d3.select("#tooltip .tooltip-year").html("Crated in: " + parseInt(d.creation_ts / (3600*24*365) + 1970));
    //d3.select("#tooltip-class").html("Temperature of star: " + d.temp + " Kelvin");
    d3.select("#tooltip-desc").html(d.short_desc);
}//showTooltip  

function endall(transition, callback) { 
    var n = 0; 
    transition 
        .each(function() { ++n; }) 
        .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
}

//Turn degrees into radians
function toRadians (angle) { return angle * (Math.PI / 180);}





$(document).ready(function () {
    $('input').bind('input keyup', function(){
        var $this = $(this);
        var delay = 2000; // 2 seconds delay after last input

        clearTimeout($this.data('timer'));
        $this.data('timer', setTimeout(function(){
            $this.removeData('timer');
            runScript(null);
            // Do your stuff after 2 seconds of last user input
        }, delay));
    });


    // console.log(serverData);
var width = 500,
    height = 500;

var planet = [
    {
        'color': 'green',
        'radius': 10,
        'rotation': 0,
        'speed':  5 * Math.PI / 180,
        'distance': 100,
    },
    {
        'color': 'blue',
        'radius': 5,
        'rotation': 0,
        'speed': 10 * Math.PI / 180,
        'distance': 200,
    }
];

// My code
var width = $(window).width(),
    height = $(window).height();


$.getJSON('http://10.117.8.206:5000/init_search', function (serverData) {
var planet = rawDataToCircleData(serverData);
var svg = d3.select('#galaxy')
    .append('svg')
        .attr('width', width)
        .attr('height', height);

// svg radialGradient
var svg_defs = svg.append('defs');
var red_rad = svg_defs.append('radialGradient')
    .attr('id', 'radialGradient-red')
            .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "0%")
        .attr("gradientUnits", "objectBoundingBox")

red_rad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#E34D00')
red_rad.append('stop')
        .attr('offset', '40%')
        .attr('stop-color', '#E14B00')
red_rad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#000')

var orange_rad = svg_defs.append('radialGradient')
    .attr('id', 'radialGradient-orange')
            .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "0%")
        .attr("gradientUnits", "objectBoundingBox")

orange_rad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#FDB500')
orange_rad.append('stop')
        .attr('offset', '40%')
        .attr('stop-color', '#FB7F00')
orange_rad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#000')

var yellow_rad = svg_defs.append('radialGradient')
    .attr('id', 'radialGradient-yellow')
            .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "0%")
        .attr("gradientUnits", "objectBoundingBox")

yellow_rad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#FEEE00')
yellow_rad.append('stop')
        .attr('offset', '40%')
        .attr('stop-color', '#FEE704')
yellow_rad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#000')

var elevated_rad = svg_defs.append('radialGradient')
    .attr('id', 'radialGradient-elevated')
            .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "0%")
        .attr("gradientUnits", "objectBoundingBox")

elevated_rad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ffffff')
elevated_rad.append('stop')
        .attr('offset', '40%')
        .attr('stop-color', '#d6eae9')
elevated_rad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#727d7c')

var normal_rad = svg_defs.append('radialGradient')
    .attr('id', 'radialGradient-normal')
            .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .attr("fx", "0%")
        .attr("gradientUnits", "objectBoundingBox")

normal_rad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ffffff')
normal_rad.append('stop')
        .attr('offset', '40%')
        .attr('stop-color', '#f7f7c4')
normal_rad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#848468')

svg.append('circle')  // the sun
    .attr('cx', width/2)
    .attr('cy', height/2)
    .attr('r', 0)
    .attr('fill', 'url(#radialGradient-red)')
    .attr('id', 'center');


// for orbit
var svgOrbit = svg.append('g').attr('class', 'orbitContainer');
var orbits = svgOrbit.selectAll('g.orbit')
                .data(planet).enter().append('circle')
                .attr('class', 'orbit')
                .attr('id', function (d) { return d.bug_id; })
                .attr('cx', function(d){ 
                    return width/2; })
                .attr('cy', function(d){ 
                    return height/2; })
                .attr('r', function(d){ return d.distance; })
                .style("fill", "#3E5968")
                .style("fill-opacity", 0)
                .style("stroke", "white")
                .style("stroke-opacity", 0);

// for planets
var svg_planets = svg.append('g').attr('class', 'planetContainer');  

svg_planets.selectAll('.planet')
    .data(planet)
    .enter()
    .append('circle')
        .attr('class', 'planet')
        .attr('id', function (d) { return d.bug_id; })
        .attr('cx', function(d){ 
            return width/2; })
        .attr('cy', function(d){ 
            return height/2  - d.distance; })
        .attr('r', function(d){ return d.radius; })
        // .attr('id', function(d){ return d.color; });
        .style('fill', function (d) { 
            return d.fill })
        .style('opacity', 0.6)
        .style("stroke-opacity", 0)
        .style("stroke-width", "3px")
        .style("stroke", "white")
        .on('mouseover', function (d, i) {
            stopTooltip = false;
            showTooltip(d);
            showOrbit(d, i, 0.8, svg);
        })
        .on("mouseout", function(d, i) {
            showOrbit(d, i, 0, svg);
        });

// setInterval(newPlace, 100);

// function newPlace(){
//     for(var key in planet)
//         planet[key].rotation += planet[key].speed;

//     svg_planets.selectAll('.planet')
//         .data(planet)
//         .transition()
//             .delay(0)
//             .duration(100)
//                 .attr('cx', function(d){ 
//                     var newX = width/2 + Math.cos(d.rotation) * d.distance;
//                     d.x = Math.cos(d.rotation) * d.distance;
//                     return newX })
//                 .attr('cy', function(d){ 
//                     var newY = height/2 + Math.sin(d.rotation) * d.distance;
//                     d.y = Math.sin(d.rotation) * d.distance;
//                     return newY });
// }

//Change x and y location of each planet
d3.timer(function() {               
        //Move the planet - DO NOT USE TRANSITION
        for(var key in planet)
            planet[key].rotation += planet[key].speed;

        d3.selectAll(".planet")
            .attr("cx", locate("x"))
            .attr("cy", locate("y"))
            // .attr("transform", function(d) {
            //     return "rotate(" + (d.theta%360) + "," + d.x + "," + d.y + ")";
            // })
            ;               
});

//Calculate the new x or y position per planet
function locate(coord) {
    return function(d){
        if (coord == "x") {
            var newX = width/2 + Math.cos(d.rotation) * d.distance;
            d.x = Math.cos(d.rotation) * d.distance;
            return newX
        } else if (coord == "y") {
            var newY = height/2 + Math.sin(d.rotation) * d.distance;
            d.y = Math.sin(d.rotation) * d.distance;
            return newY;
        }
    };
}//function locate


d3.select("svg")
    .on("click", function(d) {
        stopTooltip = true;
        t_recovery();
    });


//Highlight some special planets & dim the others
function highligtAndDim(bugIds) {
    $('#guide-desc').html(['Searched', ].concat($('#guide-desc').val().split(' ').slice(1)).join(' '));
    $('#guide-num').html(bugIds.length);

    highlightBugIds = bugIds;
    var time = 500;

    console.log('Highlight');
    svg.selectAll('.planet')
        .filter(function (d, i) {
            return bugIds.indexOf(d.bug_id) >= 0
        })
        .transition().duration(time)
        .style('stroke-opacity', 1)
        .style('opacity', 0.95)

    svg.selectAll('.orbit')
        .filter(function (d, i) {
            return bugIds.indexOf(d.bug_id) >= 0
        })
        .transition()
        .style('stroke-opacity', 0.8)
        .style('fill-opacity', 0.2);

    svg.selectAll('.planet')
        .filter(function (d, i) {
            return bugIds.indexOf(d.bug_id) < 0
        })
        .transition().duration(time)
        .style('stroke-opacity', 0)
        .style('opacity', 0.1);

    svg.selectAll('.orbit')
        .filter(function (d, i) {
            return bugIds.indexOf(d.bug_id) < 0
        })
        .transition()
        .style('stroke-opacity', 0)
        .style('fill-opacity', 0);
}

function recovery() {
    console.log('recovery');
    svg.selectAll('.planet')
        // .filter(function (d, i) {
        //     return highlightBugIds.indexOf(d.bug_id) >= 0
        // })
        .transition().duration(100)
        .style('stroke-opacity', 0)
        .style('opacity', 0.6);

    svg.selectAll('.orbit')
        // .filter(function (d, i) {
        //     return highlightBugIds.indexOf(d.bug_id) >= 0
        // })
        .transition().duration(100)
        .style('stroke-opacity', 0)
        .style('fill-opacity', 0);
}

t_highligtAndDim = highligtAndDim;
t_recovery = recovery;

})//end getJson init_search


})
