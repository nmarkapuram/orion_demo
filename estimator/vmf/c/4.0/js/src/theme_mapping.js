if (typeof vmware === "undefined") vmware = {};
			vmware.localeurls= { localeSelectorUrl:'/web/vmware/login?p_p_id=LanguagesRegionsPortlet_WAR_it-crossfunctional&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=getRegionLanguage&p_p_cacheability=cacheLevelPage&p_p_col_id=column-6&p_p_col_pos=1&p_p_col_count=2',
                demandApiUrl:'https://api.demandbase.com/api/v2/ip.json?key=57de83e434ca83f6ca21fb514e0c95dbf4c6fe49'
		}
	/* Checking condition if user is a synthetic user or robo to avoid loading files */	
	var uAgent = navigator.userAgent;
    var searchString = "Mozilla/5.0 AppleWebKit/999.0 (KHTML, like Gecko) Chrome/99.0 Safari/999.0";
	var load_sc = true;
	if(uAgent==searchString && (location.href.toLowerCase().indexOf("home") != -1)){	
	 load_sc = false;
	}
	/* Checking telium present or not */
	if ((location.href.toLowerCase().indexOf("evalcenter") < 0) && (location.href.toLowerCase().indexOf("login") < 0) && (location.href.toLowerCase().indexOf("registration") < 0)){
	  var is_telium = false;
	}
	else{
	 var is_telium = true;
	}
		
				//vmf.loadScript('/vmf/m/opinionLab/1.0/oo_engine.js',function(){});
	

	/*$('.menu-link-quick').on('click',function(){
		$(this).toggleClass('active');
		$('.starlight-eyebrow-quick').toggleClass('active');
	});

	$('.menu-item-primary-1').on('click',function(){
		$(this).toggleClass('is-active');
		$(this).parent().toggleClass('is-active');
		$(this).next().toggleClass('parentClicked');	
	}); */
	/*vmf.setModule({"sc":{
							"path":"/files/templates/inc/s_config",
                            "deps":["/files/templates/inc/s_code.js","/files/templates/inc/s_code_cust.js","/files/templates/inc/s_code_gsa.js","/files/templates/inc/s_code_my.js","/files/templates/inc/s_code_normal.js","/files/templates/inc/s_code_vmw.js","/files/templates/inc/s_config.js","/files/templates/inc/s_config_gsa.js","/files/templates/inc/s_define.js"]
                         }
    }); */
	function callBacks(){this.funcs = [];this.sc=[];}
		callBacks.prototype.add = function(f){if( typeof f!= "function" ) {}
		this.funcs[this.funcs.length] = f;};
		callBacks.prototype.addsc = function(f){if( typeof f!= "function" ) {} 
		this.sc[this.sc.length] = f;};
		callBacks.prototype.execute = function(){for( var i=0; i<this.funcs.length; i++ ){	
		var ct = window;var obj = this.funcs[i];
		var fN = (typeof obj == "string")? obj:obj.f;
		var ns = fN.split("."); var func = ns.pop();
		for(var j = 0; j < ns.length; j++) {ct = ct[ns[j]];};
		if(obj.args){ct[func].apply(this, obj.args); }else{ct[func].apply(this)};
	}
	if(!vmf.scEvent) {
		if(!is_telium){
			if(load_sc){
				vmf.loadScript('/files/templates/inc/s_config.js?globalPath_11082013',function(){});}
			}
	}
};
		var callBack = new callBacks();
		vmf.loadScript('/vmf/m/opinionLab/1.0/oo_engine.js',function(){});
		vmf.loadScript('/vmf/m/sat/1.1/sat_notify.js',function(){vmf.sat.fetchAlerts();});
		if(!is_telium){
		 if(load_sc){
			vmf.loadScript('/files/templates/inc/s_code_my.js?globalPath_11082013',function(){;callBack.funcs= [];callBack.funcs = callBack.sc;callBack.execute();});
		  }	
		}	
		else{
			callBack.funcs= [];callBack.funcs = callBack.sc;callBack.execute();
        }   		
		// cARRIED SESSION FIX FROM  pREVIOUS THEME  COMMENT  --- > start: session Timeout CR changes
		var pageTitle = document.title;
		jQuery("#sessiontime").ajaxSend(function(e,xhr,opt) {
			var sessionalertpopup = $('.popup-alert-close');
			if(sessionalertpopup != null && typeof sessionalertpopup.text() != 'undefined' && sessionalertpopup.text() != '') {
				AUI().ready(
					'aui-io',
					function(A) {
					    if(A.one('.popup-alert-close')) {
						A.one('.popup-alert-close').simulate('click');
						document.title = pageTitle;
					}
				});			
			   } 
			   else {
				invokeBeforeAjax();
			   }	
			}); 
			function invokeBeforeAjax() {
				if(typeof AUI!=="undefined"){
					AUI().ready('aui-base', 'liferay-notice', 'liferay-session', function(a) {
							if(Liferay.Session){
							Liferay.Session._stopTimer();
							Liferay.Session._startTimer();					
							}
						}
					);
				}
			}
			
		if($('#navigation-bottom').length){
		  var $feedback = $('#navigation-bottom');
		  var feedbaklink = $feedback.find('li:last').find('a');
		  var themeLocaleVar = $("#localeFromLiferayTheme").html(); //Gets current locale from myvmware
		  
		  var urlLocaleMapper = {}; //Object that defines the locale's specific URL
		  urlLocaleMapper["en_US"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["en"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["zh_CN"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=ZH-S','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["ja_JP"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=JA','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["de_DE"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=DE','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["fr_FR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=FR','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["ko_KR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=KO','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["undefined"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper[""] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  
		  feedbaklink.attr('href', urlLocaleMapper[themeLocaleVar]); //sets specific URL as href
		}