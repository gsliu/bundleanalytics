var needRecovery = false;
function runScript(e) {
    var desc;
    if (e && (e.keyCode == 8 || e.keyCode == 46) && needRecovery) {
        // console.log('aa');
        t_recovery();
    }
    // if (e == null || e.keyCode == 13) {
    if (e == null || e.keyCode == 13) {
        var keyword = $('#search-box').val();
        if (keyword == '') {
            return 0;
        }
        var data;
        var desc = keyword;
        switch (keyword)  {
        case "escalation":
                //to do escaltion
                // alert('escalation');
                needRecovery = true;
                escalation();
                $('#guide-desc').html('Searching ' + desc);
                break;
        case "vmmcore":
                // alert('vmmcore');
                needRecovery = true;
                data = vmmcore();
                $('#guide-desc').html('Searching ' + desc);
                break;
        case "vmxcore":
                // alert('vmxcore');
                needRecovery = true;
                data = vmxcore();
                $('#guide-desc').html('Searching ' + desc);
                break;
        case "vmotion failure": 
                // alert('vmotion failumre');
                needRecovery = true;
                data = vmotion();
                $('#guide-desc').html('Searching ' + desc);
                break;
        case "vm":
		//fangchi input method
                needRecovery = true;
                if (e.keyCode == 13) {
                    queryVMInfo();
                }
                // $('#guide-desc').html('Searching ' + desc);
                break;
        case "vm.ctk":
                //fangchi input method
                needRecovery = true;
                if (e.keyCode == 13) {
                    queryVMAttr('ctk');
                }
                // $('#guide-desc').html('Searching ' + desc);
                break;
        case "host":
                //fangchi input method
                needRecovery = true;
                if (e.keyCode == 13) {
                    queryHostInfo();
                }
                break;
        case "host.vhv":
                //fangchi input method
                needRecovery = true;
                if (e.keyCode == 13) {
                    queryHostAttr('vhv');
                }
                // $('#guide-desc').html('Searching ' + desc);
                break;
        default:
                // alert('keyword');
                desc = '<em>keyword</em> ' + keyword
        		keywordsearch(keyword)
                $('#guide-desc').html('Searching ' + desc);
                break;

        return false;
        }
    }
  }

function getBugId(data) {
   var bugList = [];
   for (var i = data['data'].length - 1; i >= 0; i--) {
       bugList.push(data['data'][i]['pr']);
   };
   return bugList;
}

function escalation() {
   
    $.getJSON('http://10.117.8.206:5000/escalation', function(data) {
       console.log(data);
       t_highligtAndDim(getBugId(data));
    });
}

function vmmcore() {
    $.getJSON('http://10.117.8.206:5000/vmmcore', function(data) {
       console.log(data);
       t_highligtAndDim(getBugId(data));
       return data
    });

}

function vmxcore() {
$.getJSON('http://10.117.8.206:5000/vmxcore', function(data) {
       console.log(data);
       t_highligtAndDim(getBugId(data));
       return data
    });

}

function vmotion() {
$.getJSON('http://10.117.8.206:5000/vmotion', function(data) {
       console.log(data);
       t_highligtAndDim(getBugId(data));
       return data
    });

}



function keywordsearch(keyword) {
    theUrl = "http://10.117.8.206:5000/search?q=" + keyword;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    var result =  $.parseJSON(xmlHttp.responseText);
    t_highligtAndDim(getBugId(result));
    console.log(result);
    // return result;
    if (result['hits']) {
        needRecovery = true;
    }
}

