function queryHostInfo() {
    showHostInfo();
    $.ajax({
        url: "http://10.117.8.206:5000/hostcpuinfo",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        var hostCpuInfo = data;
        drawHostCpuChart(hostCpuInfo);
    });

    $.ajax({
        url: "http://10.117.8.206:5000/hostversioninfo",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        var hostVerInfo = data;
        drawHostVerChart(hostVerInfo);
    });

    $.ajax({
        url: "http://10.117.8.206:5000/hostmeminfo",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        var hostMemInfo = data;
        drawHostMemChart(hostMemInfo);
    });
    return;
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
            data: cpuData['pie']
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
            data: verData['pie']
        }
    ]
};
    myChart.setOption(option);
}

function drawHostMemChart(hostMemInfo) {
    var myChart = echarts.init(document.getElementById('mem_chart'), 'macarons');
    var option = {
    title : {
        text: 'Memory(GB)',
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
            data : hostMemInfo['bar'][0]
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'Hosts',
            type:'bar',
            data:hostMemInfo['bar'][1],
            markPoint : {
                data : [
                    {type : 'max', name: 'max'}
                ]
            },
            markLine : {
                data : [
                        [
                            {name: 'avg', value: 27.67, xAxis: 0, yAxis: 27.67},      // 当xAxis为类目轴时，数值1会被理解为类目轴的index，通过xAxis:-1|MAXNUMBER可以让线到达grid边缘
                            {name: 'avg', xAxis: 1024, yAxis: 27.67},             // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
                        ]
                ]
            }
        }
    ]
};

    myChart.setOption(option);

}


function queryHostAttrStub() {
    showHostAttrInfo();
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['vhv.enabled','vhv.disabled']
        },
        toolbox: {
            show : true,
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
                            funnelAlign: 'center',
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
                name:'ctk stats',
                type:'pie',
                radius : ['50%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '30',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data:[
                    {value:14, name:'vhv.enabled'},
                    {value:591, name:'vhv.disabled'}
                ]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('host_chart'), 'macarons');
    myChart.setOption(option);
                     
}

function queryHostAttr (Attr) {
    if (Attr=='vhv'){
        return queryHostAttrStub();
    }
    else {
        alert('not implemented yet!');
        return;
    }
    /* havn't finished, using stub*/
    $.ajax({
        url: "http://10.117.8.228:5000/init_search",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        console.log(data)
        var vmAttrData = data['rawData'];
        console.log(vmAttrData);
        drawVMAttrChart(vmAttrData);  
    });
    
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
  LoadMyJs("js/sequences.js");
  //resetEvents();  
}//closeInfo

function showHostAttrInfo() {
  d3.select("#HOSTATTR_information").style("z-index","1000").transition().duration(300).style('opacity',1);
  d3.select("#hostAttrInfoClose").on("click", closeHostAttrInfo);
}

//Hide the information box
function closeHostAttrInfo() {
  d3.select('#HOSTATTR_information').transition().duration(300).style('opacity',0).style("z-index","-1000"); 
    //location.reload();
  //$('#main')[0].innerHTML = "<div id=\"chart\"></div><br><div id=\"sequence\"></div>"; 
  //$('#sequence')[0].innerHTML = ''; 
  LoadMyJs("js/sequences.js");
  //resetEvents();  
}//closeInfo


