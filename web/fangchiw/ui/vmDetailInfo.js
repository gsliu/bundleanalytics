function queryVMInfo () {
    $.ajax({
        url: "http://10.117.8.228:5000/init_search",
        context: document.body,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        console.log(data)
        var vmDetailInfoCount = data['rawData'];
        console.log(vmDetailInfoCount);
        showVMInfo()
        drawVMChart(vmDetailInfoCount);
    });
}


function queryVMAttrStub() {
    showVMInfo();
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['ctkEnabled','ctkDisabled']
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
                    {value:1310, name:'ctkEnabled'},
                    {value:7848, name:'ctkDisabled'}
                ]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('chart'), 'macarons');
    myChart.setOption(option);
                     
}

function queryVMAttr (Attr) {
    if (Attr=='ctk'){
        return queryVMAttrStub();
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

//Hide the information box
function closeVMInfo() {
  d3.select('#VM_information').transition().duration(300).style('opacity',0).style("z-index","-1000"); 
    //location.reload();
  $('#main')[0].innerHTML = "<div id=\"chart\"></div><br><div id=\"sequence\"></div>"; 
  //$('#sequence')[0].innerHTML = ''; 
  LoadMyJs("sequences.js");
  //resetEvents();  
}//closeInfo

function showVMInfo() {
  d3.select("#VM_information").style("z-index","1000").transition().duration(300).style('opacity',1);
  d3.select("#infoClose").on("click", closeVMInfo);
}
