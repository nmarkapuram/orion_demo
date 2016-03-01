if(typeof vmf=="undefined") {
	vmf = {};
}
vmf.fileupload = function(form,options){
    var $ = (typeof vmf!="undefined" && vmf.jq) || jQuery;  
	if(!!$.fn.prop){
		return form.fileupload(options);
	} else {
		alert("please use jquery 1.6 or greater than version to support fileupload");
	}
}
