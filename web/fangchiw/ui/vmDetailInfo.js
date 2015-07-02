var vmDetailInfoCount = []
 
$( document ).ready(function() {
    $.ajax({
        url: "http://10.117.8.228:5000/init_search",
        context: document.body,
        async : false,
        crossDomain : true,
        dataType: 'json'
    }).done(function(data) {
        console.log(data)
        vmDetailInfoCount = data['rawData'];
        console.log(vmDetailInfoCount);
    });
});
