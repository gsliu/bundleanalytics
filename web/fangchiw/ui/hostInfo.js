function queryHostInfo() {
    showHostInfo();
    drawHostVerChart();
    drawHostCpuChart();
    drawHostMemChart();
    return;
    $.ajax({
        url: "http://10.117.8.228:5000/init_search",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        var hostCpuInfo = data['rawData'];
        drawHostCpuChart(hostCpuInfo);
    });

    $.ajax({
        url: "http://10.117.8.228:5000/init_search",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        var hostVerInfo = data['rawData'];
        drawHostVerChart(hostVerInfo);
    });

    $.ajax({
        url: "http://10.117.8.228:5000/init_search",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        var hostMemInfo = data['rawData'];
        drawHostMemChart(hostMemInfo);
    });
}

function drawHostCpuChart(cpuData) {
    var myChart = echarts.init(document.getElementById('cpu_chart'), 'macarons');
    var option = {
    title : {
        text: 'CPU',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        show: false,
        orient : 'vertical',
        x : 'left',
        data: ['']
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'CPU Info',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};
    myChart.setOption(option);
}


function drawHostVerChart(verData) {
    var myChart = echarts.init(document.getElementById('ver_chart'), 'macarons');
    var option = {
    title : {
        text: 'Product',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        show: false,
        orient : 'vertical',
        x : 'left',
        data: ['']
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'CPU Info',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};
    myChart.setOption(option);
}

function drawHostMemChart(hostMemInfo) {
    var myChart = echarts.init(document.getElementById('mem_chart'), 'macarons');
    var option = {
    title : {
        text: 'Memory',
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data: ['']
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'蒸发量',
            type:'bar',
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        }
    ]
};

    myChart.setOption(option);

}

function showHostInfo() {
  d3.select("#HOST_information").style("z-index","1000").transition().duration(300).style('opacity',1);
  d3.select("#hostInfoClose").on("click", closeHostInfo);
}

//Hide the information box
function closeHostInfo() {
  d3.select('#HOST_information').transition().duration(300).style('opacity',0).style("z-index","-1000"); 
    //location.reload();
  //$('#main')[0].innerHTML = "<div id=\"chart\"></div><br><div id=\"sequence\"></div>"; 
  //$('#sequence')[0].innerHTML = ''; 
  LoadMyJs("sequences.js");
  //resetEvents();  
}//closeInfo


