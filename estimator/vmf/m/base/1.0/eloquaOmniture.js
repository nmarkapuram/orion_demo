if (typeof(myvmware) == "undefined")  myvmware = {};
myvmware.eloqua = {
	init: function(){
		if(location.pathname.indexOf('/group/')>=0){
			var eloquaCookie = myvmware.eloqua.getCookie('mv_eid_processed');
			if(eloquaCookie.length<=0){
				vmf.ajax.post('/group/vmware/alogin?p_p_id=asynchLoginPortlet_WAR_itvmlogin&p_p_lifecycle=2&p_p_resource_id=getEIDDetails','',myvmware.eloqua.doSuccess);
			}
		}
	},
	getCookie:function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	},
	doSuccess:function(res){
		if (typeof res!="object") 
		{	
			res = vmf.json.txtToObj(res);
		} 
		if(typeof res.eId !="undefined"){
			if((res.eId !="") && (res.eId !="-1")){
				if(typeof sendEID !="undefined"){
					sendEID(res.eId);
				}
			}
		}
	}
}
if(location.pathname.indexOf('/evalcenter')===-1){ 
	callBack.addsc({'f':'myvmware.eloqua.init','args':[]});
}else{
	if((location.pathname.indexOf('/registration')===-1) && ((location.pathname.indexOf('/login')===-1) )){
		myvmware.eloqua.init();
	}
}