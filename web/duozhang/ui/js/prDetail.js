
var global_pr_data = {
        data : [
            {pr: 2312, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf', 'dadsa']},
            {pr: 2313, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2314, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2315, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2316, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2317, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2318, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2319, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2310, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2342, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},
            {pr: 2352, summary:'ejfiaosjodosjdo', bundle: ['desadedefeeaf']},

        ]

}


function showPrDetail (prData) {
    showPrInfo()
    var template = $('#template_pr_info')[0].innerHTML;
    $.each(prData['data'], function(index, element){
        console.log(element);
        if (element['summary'].length > 50){
            element['summary'] = element['summary'].substring(0, 50)+'...';
        }
        var res = template.replace(/{{PR_NUMBER}}/g, element['pr'])
                          .replace("{{PR_SUMMARY}}", element['summary'])
                          .replace("{{PR_BUNDLES}}", element['bundle'].join('<br>'));
        $("#pr_chart").append(res);
        $("#li_"+element['pr']).click(function (){
            window.open('https://bugzilla.eng.vmware.com/show_bug.cgi?id='+element['pr']);
        });
    });
}




//Hide the information box
function closePrInfo() {
  d3.select('#PR_information').transition().duration(300).style('opacity',0).style("z-index","-1000"); 
    //location.reload();
  //$('#sequence')[0].innerHTML = ''; 
  LoadMyJs("js/sequences.js");
  $("#pr_chart").html('');
  //resetEvents();  
}//closeInfo

function showPrInfo() {
  d3.select("#PR_information").style("z-index","1000").transition().duration(300).style('opacity',1);
  d3.select("#prInfoClose").on("click", closePrInfo);
}
