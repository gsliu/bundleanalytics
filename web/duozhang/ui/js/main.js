function genColorRadius(color) {
    var _mapping = {
        'red': ['red', 9],
        'orange': ['orange', 7],
        'yellow': ['yellow', 5],
        'elevated': ['#e5e5e5', 3],
        null: ['#eeeeee', 3],
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
    return Math.sqrt(8000 / distance) * Math.PI / 180;
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
    //     weight -> speed
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
var width = $(window).width(),
    height = $(window).height();

var planet = rawDataToCircleData(serverData);

var svg = d3.select('#galaxy')
    .append('svg')
        .attr('width', width)
        .attr('height', height);

svg.append('circle')  // the sun
    .attr('cx', width/2)
    .attr('cy', height/2)
    .attr('r', 0)
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