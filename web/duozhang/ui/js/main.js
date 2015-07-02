function runScript(e) {
    if (e.keyCode == 13) {
        var keyword = $('#search-box').val();
	var data;
        switch (keyword)  {
        case "escalation":
                //to do escaltion
                alert('escalation');
                data = escalation() 
                break;
        case "vmmcore":
                alert('vmmcore');
                data = vmmcore();
                break;
        case "vmxcore":
                alert('vmxcore');
                data = vmxcore();
                break;
        case "vmotion failure": 
                alert('vmotion failure');
                data = vmotion();
                break;
        case "vm":
                alert('vm');
		//fangchi input method
                break;
        case "vm.ctk":
                alert('vmctk');
		//fangchi input method
                break;
        case "host":
                alert('host');
		//fangchi input method
                break;
        case "host.vhv":
                alert('host.vhv');
		//fangchi input method
                break;
        default:
                alert('keyword');
		data = keywordsearch(keyword)
                break;

        return false;
        }
    }
  }

function escalation() {
   
    $.getJSON('http://10.117.8.206:5000/escalation', function(data) {
       console.log(data);
       return data
    });
}

function vmmcore() {
    $.getJSON('http://10.117.8.206:5000/vmmcore', function(data) {
       console.log(data);
       return data
    });

}

function vmxcore() {
$.getJSON('http://10.117.8.206:5000/vmxcore', function(data) {
       console.log(data);
       return data
    });

}

function vmotion() {
$.getJSON('http://10.117.8.206:5000/vmotion', function(data) {
       console.log(data);
       return data
    });

}



function keywordsearch(keyword) {

//$.getJSON('http://10.117.8.206:5000/', function(data) {
 //      console.log(data);
  //     return data
   // });
}
