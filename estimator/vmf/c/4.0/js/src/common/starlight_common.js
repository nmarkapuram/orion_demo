$( document ).ready(function() {
	myvmware.common.init();
	vmf.loadScript('/static/vmware/common/js/localize_starlight.js',
		function(){
			myvmware.localize.init('MY_VMWARE');
		});
	$('.menu-link-quick').on('click',function(){
		$(this).toggleClass('active');
		$('.starlight-eyebrow-quick').toggleClass('active');
	});
	
	$('.nav-level-1 li').on('click',function(){
			var item = $(this);
			item.toggleClass('is-active')
				.siblings('.is-active').removeClass('is-active focused')
									   .find('a.menu-item-primary-1').removeClass('is-active').end()
									   .find('ul').removeClass('parentClicked');

			item.find('a.menu-item-primary-1').toggleClass('is-active').end()
				.find('ul').toggleClass('parentClicked');
	 });
});

vmf = vmf || {};
vmf.getCookie = function(cookiename){
  // Get name followed by anything except a semicolon
  var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
  // Return everything after the equal sign
  return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

var myvmware = myvmware || {};
myvmware.common = {
	supportedLang : {locales:[{lang:"en"},{lang:"jp"}]},
	ie6UnsupportedMessage : "We have detected that your using an old Internet browser which our website doesn\'t support.<br />Please upgrade your browser to ensure an amazing experience.",
	init: function(){
	    var langauge=$('#localeFromLiferayTheme').text();
		myvmware.common.loadBundles(langauge);
		var ob = vmf.getCookie("ObSSOCookie"),
			path = window.location.href,
			pgNamesArr = [
				  "registration"
				, "activationbeforeauth"
				, "activation"
				, "inactiveaccount"
				, "terms-of-use"
				, "home"
				, "users-permissions"
				, "downloads"
				, "downloads_family"
				, "info"
				, "my-licenses","all-services","sdppartnercentral","sdpPartnerAllOrders","allrenewals","sdppartnerAllRateCards","subscription-services","billing-statements"
			],
			urlPieces = (path.split('#')[0]).split('/'),
			intersectionArr = $.map(pgNamesArr, function(a){
				return $.inArray(a, urlPieces) < 0 ? null : a;
			});
			
		if( intersectionArr.length === 0 && !(ob == "loggedout" || ob == "loggedoutcontinue" || ob == null || ob == "")) {
			myvmware.common.showMessageComponent("");
		}
		else if(intersectionArr.length !== 0 && $.inArray("my-licenses", intersectionArr) !== -1){
			myvmware.common.showMessageComponent("LICENSE");
		}
		else if(intersectionArr.length !== 0 && $.inArray("home", intersectionArr) !== -1){
			myvmware.common.showMessageComponent("HOME");
		}
		
		var languageCode = langauge.substring(0,2);
		if(languageCode == "ko")	languageCode = "kr";
		else if(languageCode == "ja")	languageCode = "jp";
		else if(languageCode == "zh")	languageCode = "cn";		
		$('.nav-level-2 li a').each(function(){
			if(languageCode != "en") {
				this.href = this.href.replace("lan_code",languageCode);
				this.href = this.href.replace("/zh/","/cn/");
				this.href = this.href.replace("/ja/","/jp/");
				this.href = this.href.replace("/ko/","/kr/");
			}
			else {this.href = this.href.replace("lan_code/","");}		 	
		});
		
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
		
	},

		loadBundles : function(lang) {
		jQuery.i18n.properties({name:'message', path:'/static/myvmware/common/message/', mode:'map', language:lang, callback: function() {myvmware.common.updateMessage();} });
	   },
       updateMessage : function(){myvmware.common.ie6UnsupportedMessage=jQuery.i18n.prop('label.common.ie6.unsupportedMessage');},	


	showMessageComponent: function(pageName){
		var url ='/group/vmware/alogin?p_p_id=asynchLoginPortlet_WAR_itvmlogin&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_resource_id=getAllUIMessageComponentsForPage', 
			_postData = new Object(),
			map = {
				  "Q1_PUSHPANE_ALL_PAGES":myvmware.common.showPushPane
				, "BEAK_HOME_PAGE_FOR_DOWNLOAD_MENU":myvmware.common.showGlobalBeaks//HOME
				, "BEAK_HOME_PAGE_FOR_PROFILE_DROPMENU":myvmware.common.showHomeBeaks//HOME
				, "BEAK_DOWNLOADS_PAGE_FOR_MY_PRODUCTS":myvmware.common.showBeaks//DOWNLOADS
				, "BEAK_DOWNLOADS_PAGE_FOR_ALL_PRODUCTS_HOVER_MENU":myvmware.common.showBeaks//DOWNLOADS
				, "BEAK_DOWNLOADS_FAMILY_PAGE_FOR_VERSION_SELECTOR":myvmware.common.showBeaks//DOWNLOADS_FAMILY
				, "BEAK_DOWNLOADS_PAGE_FOR_CUSTOM_ISO_TAB":myvmware.common.showBeaks//DOWNLOADS_FAMILY
				, "BEAK_USERPERMISSION_PAGE_FOR_SHARE_FOLDER":myvmware.common.showBeaks,//USER_PERMISSION
				"SDP_BEAK_SUBSCRIPTION_SERVICE_ALERT":myvmware.common.showBeaks,
				"SDP_BEAK_SUBSCRIPTION_SERVICE_EXPORT":myvmware.common.showBeaks,
				//"SDP_BEAK_SUBSCRIPTION_SERVICE_REMAINING_TERM":myvmware.common.showBeaks, // Added by Satya
				"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_LAUNCH":myvmware.common.showBeaks,
				"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_TERM":myvmware.common.showBeaks,
				"SDP_BEAK_SUBSCRIPTION_INSTANCE_DETAIL_ADDON":myvmware.common.showBeaks,
				"SDP_BEAK_SUBSCRIPTION_HOME_MEGAMENU":myvmware.common.showBeaks,
				"SDP_BEAK_USERPERMISSION_BYSERVICE":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_CUSTOMER_ALERT":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_CUSTOMER_MONTHLY_LIMIT":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_RESELLER_ALERT":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_RESELLER_MONTHLY_LIMIT":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_RESELLR_ORDER_PENDING_TAB":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_TAB":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_RESELLER_ORDER_PENDING_MONTHLY":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_MONTHLY":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_RESELLER_RENEWAL_ALERT":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_DISTI_RENEWAL_ALERT":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_RESELLER_RENEWAL_RENEW":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_DISTI_RENEWAL_RENEW":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_PRICELIST_DEFAULT":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_PRICELIST_UPLOAD":myvmware.common.showBeaks,
				"SDP_BEAK_PARTNER_PRICELIST_DOWNLOAD":myvmware.common.showBeaks
				, "SDP_BEAK_SUB_PRAXIS_INS_DET_MAN_SER": myvmware.common.showBeaks
				, "SDP_BEAK_SUB_PRAXIS_INS_DET_PAST_USG": myvmware.common.showBeaks
				, "SDP_BEAK_SUB_PRAXIS_BILL_DET_CSV_DOW": myvmware.common.showBeaks
				, "SDP_BEAK_SUB_PRAXIS_PAST_USG_CHAR_OPT": myvmware.common.showBeaks
				, "SPOT_LIGHT_HOME_PAGE": myvmware.common.showSpotlight
				, "SPOT_LIGHT_LICENSE_PAGE" : myvmware.common.showSpotlight_lic				
			};
		if(typeof partnerType !="undefined") //Url for partner beaks
			url = rs.beak_url || '/web/sdppartner/blogin/-/consumer/WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3/normal/view/cacheLevelPage/WDJKbFlXdHpVRzl5ZEd4bGRGOVhRVkpmYVhSelpIQlFZWEowYm1WeVgzZHpjbkE5TVEqKg**?p_p_lifecycle=2&p_p_resource_id=getParnterUIComponents&p_p_col_id=column-3&p_p_col_count=1&_WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3_wsrp-resourceCacheability=cacheLevelPage';
		myvmware.common.beaksObj = {};
		_postData['pageName'] = pageName;

		$.ajax({
			url: url,
			data: _postData,
			method: 'post',
			success: function(data){
				if(typeof data!="object"){
					data=vmf.json.txtToObj(data);
				}
				var jsonData = data.allUIMessageComponents;
				if(jsonData && jsonData.length){
					for(var i =0;i<jsonData.length;i++){
						if (typeof map[jsonData[i].name] != "undefined"){
							map[jsonData[i].name](jsonData[i].name,jsonData[i].id,pageName);
						}
					}
				}
			}
		});
	},


	feedbackText: "We've been listening to your feedback",
	comingSoonText: "Coming soon: new features you've been asking for",
	learnMore: "learnMore",
    showSpotlight_lic: function(messageName, messageId, pageName){
	vmf.include("spotLight",function(){
		    if((window.location.hash).indexOf('prodFilter') != -1){
					if($('.dataTables_wrapper table#productsDataTable tbody tr:first td:first').hasClass("dataTables_empty")){
						 tr_select = '#no_selectorforthis';
					}else{
						 tr_select = '.byProductsTab .dataTables_wrapper table#productsDataTable tbody tr:first';
					}
			    
				   spotlight_byProduct.init();
			   
			  }
			  else{
					spotlight_byFolder.init();
			  }
	  });
	  if( typeof messageId != 'undefined' ){
			$(document).one('click', '#close_help_bubbles', function(){
				myvmware.common.setMessageStatus(messageId);
			})
		}
	},
	
	showSpotlight: function(messageName, messageId, pageName){
    	vmf.include("spotLight",function(){
		   spotlight.init();
		});
		if( typeof messageId != 'undefined' ){
			$(document).one('click', '#close_help_bubbles', function(){
				myvmware.common.setMessageStatus(messageId);
			})
		}
    },
	showPushPane: function(overlayNm,id,pgNm){
		if( !$('.pushPaneMainContainer').length ){ /* to render pushpane only once */
			$('#vmbar').after(
			  '<div class="pushPane pushPaneMainContainer"><div class="pushPaneContent"><div class="feedbackinfo">' + 
			  myvmware.commonKeys.feedbackText + '</div><div class="feedbacktext">' + 
			  myvmware.commonKeys.comingSoonText + '</div><a href="javascript:;" class="closePane">closePane</a><a class="learnMoreLink" href="javascript:;">' + 
			  myvmware.commonKeys.learnMore + '</a></div></div>');
			$('.pushPane').show();
			var pushpaneHt = $('.pushPane').outerHeight(true);
			$('a.closePane').on('click',function(){
				$('.pushPane').hide().remove();
				$(window).trigger('resize'); // to position the beaks properly, on removing the pushpane element on the browser
				if($('.beak_tooltip_flyout_def').length){
					var config = myvmware.common.beakConfig;
					if(config && config.target){
						var getTopPos = (config.target.offset().top + (config.target.outerHeight(true)/2)) - $('.beak_tooltip_flyout_def').outerHeight(),getLeftPos;
						if(config.isFlip){
							getLeftPos = config.target.offset().left - $('.beak_tooltip_flyout_def').width();
						} else {
							getLeftPos = config.target.offset().left + config.target.width();
						}	
						$('.beak_tooltip_flyout_def').css({'top':getTopPos,'left':getLeftPos});
					}
				}
				if(typeof ice != 'undefined' && $('.modalOverlay').length){
					if(ice.alertinfo) {
						ice.alertinfo.setHomeOverlayPos();
					}
					else if(ice.managelicense) {
						ice.managelicense.setMessagesPosition();
					}
					myvmware.common.setOverlayPosition();
				}
				myvmware.common.setMessageStatus(id);
			});
			$('a.learnMoreLink').on('click',function(){
				myvmware.common.openHelpPage('//download3.vmware.com/microsite/myvmware/dot7/index.html','1060px');
			});
		}
	},


	setMessageStatus: function(msgId){
		var url= '/group/vmware/alogin?p_p_id=asynchLoginPortlet_WAR_itvmlogin&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_resource_id=setUIMessageComponent', postData = new Object();
		if(typeof partnerType !="undefined") //Url for partner beaks
			url = rs.beak_set_url || '/web/sdppartner/blogin/-/consumer/WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3/normal/view/cacheLevelPage/WDJKbFlXdHpVRzl5ZEd4bGRGOVhRVkpmYVhSelpIQlFZWEowYm1WeVgzZHpjbkE5TVEqKg**?p_p_lifecycle=2&p_p_resource_id=setParnterUIComponents&p_p_col_id=column-3&p_p_col_count=1&_WSRP_10132_718d37b1__1862__46dd__a5ab__8eb9291af1d3_wsrp-resourceCacheability=cacheLevelPage';
		postData['displayId'] = msgId;
		$.ajax({
			url: url,
			data: postData
		});
	},



	openHelpPage: function(URL,customWidth){
		var wd =   customWidth || '695px';
		NewWindow = window.open(URL,"_blank","width="+wd+",height=670,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes") ;
		NewWindow.location = URL;
	},
	buildLocaleMsg:function(text,dObj){
		try{
			var re = /\{(.*?)\}/g, matches;
			while ((matches = re.exec(text)) !== null){
				text = text.replace(matches[0],(dObj instanceof Array) ? dObj[matches[1]] : dObj)
			}
		}
		catch(e){
			alert("There is a problem in text or dObj params, details are...\n\n"+e);
			return text;
		}
		return text;
	}
};

  spotlight_byFolder = {
		init: function(){
			$('#help_bubbles_paginator').help_bubbles_paginator({
				closeOnOverlayClick: false,
				target_list: [
					[
						'.accountSelectorDropdownHolderWrapper .vmf-dropdown', 
						[
							{
								isAbove: false,
								title: globalVariables.spot_byFold_Easelector_title,
								copy: globalVariables.spot_byFold_Easelector_info
							}
						]
					],
					[
                	'.vmfTab ul', 
						[
							{
								isAbove: false,
								title: globalVariables.spot_byFold_tabSelect_title,
								copy: globalVariables.spot_byFold_tabSelect_info
							}
						 ]
					   ],
					   [
                	'.dropdownsWrapper .licenseKeysDropdownHolderWrapper .vmf-dropdown', 
						[
							{
								isAbove: false,
								title: globalVariables.spot_byFold_viewactions_title,
								copy: globalVariables.spot_byFold_viewactions_info
							}
						 ]
					   ],
				   [
                	'.foldertreeUl li:first a:first', 
						[
							{
								isAbove: false,
								title:  globalVariables.spot_byFold_folder_title,
								copy: globalVariables.spot_byFold_folder_info,
								altSelector: 'label.folderSelector'
							}
						 ]
                   ],
				   [
                	'.folderTreeHeader .actionAll', 
						[
							{
								isAbove: false,
								title:  globalVariables.spot_byFold_actions_title,
								copy: globalVariables.spot_byFold_actions_info,
								altSelector: 'label.folderSelector'
							}
						 ]
                   ],
				   [
						'.folderFiltersHolderWrapper .table-filter', 
						[
							{
								isAbove: false,
								title:  globalVariables.spot_byFold_filter_title,
								copy: globalVariables.spot_byFold_filter_info
							}
						 ]
                   ]						   
				 ] // target_list
			}) // help_bubbles_paginator
			$( "#help_bubbles_paginator a").wrapAll( "<div class='paginateCenter' />");
			// help-bubble/spotlight close event handler 
			$(document).one('close_help_bubble', function(){
				$('div.takeTour').css('visibility', 'visible');
			});
	    }
    };

	spotlight_byProduct = {
		init: function(){
			$('#help_bubbles_paginator').help_bubbles_paginator({
				closeOnOverlayClick: false,
				target_list: [
					[
					  tr_select, 
						[
							{
								isAbove: false,
								title:  globalVariables.spot_byProd_Prod_title,
								copy: globalVariables.spot_byProd_Prod_info
							}
						]
					],
					[
                	'.byProductsTab .prodFolderFilter', 
						[
							{
								isAbove: false,
								title:  globalVariables.spot_byProd_folder_title,
								copy: globalVariables.spot_byProd_folder_info
							}
						 ]
					   ],
					[
                	'.searchLicenseKeysHolderWrapper form.searchArea', 
						[
							{
								isAbove: false,
								title:  globalVariables.spot_byProd_findLic_title,
								copy: globalVariables.spot_byProd_findLic_info
							}
						 ]
					   ],
				   [
                	'.byProductsTab .exportToCSVLink', 
						[
							{
								isAbove: false,
								title:  globalVariables.spot_byProd_csv_title,
								copy: globalVariables.spot_byProd_csv_info
							 }
						 ]
                   ]							   				   
				 ] // target_list
			}) // help_bubbles_paginator
			$( "#help_bubbles_paginator a").wrapAll( "<div class='paginateCenter' />");
			// help-bubble/spotlight close event handler 
			$(document).one('close_help_bubble', function(){
				$('div.takeTour').css('visibility', 'visible');
			});
	     }
    };