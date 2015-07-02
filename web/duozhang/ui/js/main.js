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
    var _min = 40,
        _k = 760;
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
    return Math.sqrt(2000 / distance) * Math.PI / 180;
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
                'fill': _colorRadius[0],
                'radius': _colorRadius[1],
                'distance': _distance,
                'theta': _distance,
                'speed': genSpeed(_distance),
                'rotation': 0
            };
        circleData.push(oneItem);
    };

    return circleData;
}


$(document).ready(function () {
    console.log(serverData);
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
var width = $(window).width() - 80,
    height = $(window).height()- 80;

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
    .attr('cy', 300)
    .attr('r', 0)
    .attr('fill', 'url(#radialGradient-red)')
    .attr('id', 'center');

svg = svg.append('g');  // two star

svg.selectAll('circle')
    .data(planet)
    .enter()
    .append('circle')
        .attr('class', 'planet')
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
        .style("stroke", "white");

setInterval(newPlace, 100);

function newPlace(){
    for(var key in planet)
        planet[key].rotation += planet[key].speed;

    svg.selectAll('circle')
        .data(planet)
        .transition()
            .delay(0)
            .duration(100)
                .attr('cx', function(d){ return width/2 + Math.cos(d.rotation) * d.distance; })
                .attr('cy', function(d){ return height/2 + Math.sin(d.rotation) * d.distance; });
}

})
