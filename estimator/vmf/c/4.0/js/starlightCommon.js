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
/******************************************************************************
 * jquery.i18n.properties
 * 
 * Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
 * MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
 * 
 * @version     1.0.x
 * @author      Nuno Fernandes
 * @url         www.codingwithcoffee.com
 * @inspiration Localisation assistance for jQuery (http://keith-wood.name/localisation.html)
 *              by Keith Wood (kbwood{at}iinet.com.au) June 2007
 * 
 *****************************************************************************/

(function($) {
$.i18n = {};

/** Map holding bundle keys (if mode: 'map') */
$.i18n.map = {};
    
/**
 * Load and parse message bundle files (.properties),
 * making bundles keys available as javascript variables.
 * 
 * i18n files are named <name>.js, or <name>_<language>.js or <name>_<language>_<country>.js
 * Where:
 *      The <language> argument is a valid ISO Language Code. These codes are the lower-case, 
 *      two-letter codes as defined by ISO-639. You can find a full list of these codes at a 
 *      number of sites, such as: http://www.loc.gov/standards/iso639-2/englangn.html
 *      The <country> argument is a valid ISO Country Code. These codes are the upper-case,
 *      two-letter codes as defined by ISO-3166. You can find a full list of these codes at a
 *      number of sites, such as: http://www.iso.ch/iso/en/prods-services/iso3166ma/02iso-3166-code-lists/list-en1.html
 * 
 * Sample usage for a bundles/Messages.properties bundle:
 * $.i18n.properties({
 *      name:      'Messages', 
 *      language:  'en_US',
 *      path:      'bundles'
 * });
 * @param  name			(string/string[], optional) names of file to load (eg, 'Messages' or ['Msg1','Msg2']). Defaults to "Messages"
 * @param  language		(string, optional) language/country code (eg, 'en', 'en_US', 'pt_PT'). if not specified, language reported by the browser will be used instead.
 * @param  path			(string, optional) path of directory that contains file to load
 * @param  mode			(string, optional) whether bundles keys are available as JavaScript variables/functions or as a map (eg, 'vars' or 'map')
 * @param  cache        (boolean, optional) whether bundles should be cached by the browser, or forcibly reloaded on each page load. Defaults to false (i.e. forcibly reloaded)
 * @param  encoding 	(string, optional) the encoding to request for bundles. Property file resource bundles are specified to be in ISO-8859-1 format. Defaults to UTF-8 for backward compatibility.
 * @param  callback     (function, optional) callback function to be called after script is terminated
 */
$.i18n.properties = function(settings) {
	// set up settings
    var defaults = {
        name:           'Messages',
        language:       '',
        path:           '',  
        mode:           'vars',
        cache:			true,
        encoding:       'UTF-8',
        callback:       null
    };
    settings = $.extend(defaults, settings);    
    if(settings.language === null || settings.language == '') {
	   settings.language = $.i18n.browserLang();
	}
	if(settings.language === null) {settings.language='';}
	
	// load and parse bundle files
	var files = getFiles(settings.name);
	for(i=0; i<files.length; i++) {
		// 1. load base (eg, Messages.properties)
		loadAndParseFile(settings.path + files[i] + '.js', settings);
        // 2. with language code (eg, Messages_pt.properties)
		if(settings.language.length >= 2) {
           // loadAndParseFile(settings.path + files[i] + '_' + settings.language.substring(0, 2) +'.js', settings);
		}
		// 3. with language code and country code (eg, Messages_pt_PT.properties)
        if(settings.language.length >= 5) {
            loadAndParseFile(settings.path + files[i] + '_' + settings.language.substring(0, 5) +'.js', settings);
        }
	}
	
	// call callback
	if(settings.callback){ settings.callback(); }
};


/**
 * When configured with mode: 'map', allows access to bundle values by specifying its key.
 * Eg, jQuery.i18n.prop('com.company.bundles.menu_add')
 */
$.i18n.prop = function(key /* Add parameters as function arguments as necessary  */) {
	var value = $.i18n.map[key];
	if (value == null)
		return '[' + key + ']';
	
//	if(arguments.length < 2) // No arguments.
//    //if(key == 'spv.lbl.modified') {alert(value);}
//		return value;
	
//	if (!$.isArray(placeHolderValues)) {
//		// If placeHolderValues is not an array, make it into one.
//		placeHolderValues = [placeHolderValues];
//		for (var i=2; i<arguments.length; i++)
//			placeHolderValues.push(arguments[i]);
//	}

	// Place holder replacement
	/**
	 * Tested with:
	 *   test.t1=asdf ''{0}''
	 *   test.t2=asdf '{0}' '{1}'{1}'zxcv
	 *   test.t3=This is \"a quote" 'a''{0}''s'd{fgh{ij'
	 *   test.t4="'''{'0}''" {0}{a}
	 *   test.t5="'''{0}'''" {1}
	 *   test.t6=a {1} b {0} c
	 *   test.t7=a 'quoted \\ s\ttringy' \t\t x
	 *
	 * Produces:
	 *   test.t1, p1 ==> asdf 'p1'
	 *   test.t2, p1 ==> asdf {0} {1}{1}zxcv
	 *   test.t3, p1 ==> This is "a quote" a'{0}'sd{fgh{ij
	 *   test.t4, p1 ==> "'{0}'" p1{a}
	 *   test.t5, p1 ==> "'{0}'" {1}
	 *   test.t6, p1 ==> a {1} b p1 c
	 *   test.t6, p1, p2 ==> a p2 b p1 c
	 *   test.t6, p1, p2, p3 ==> a p2 b p1 c
	 *   test.t7 ==> a quoted \ s	tringy 		 x
	 */
	
	var i;
	if (typeof(value) == 'string') {
        // Handle escape characters. Done separately from the tokenizing loop below because escape characters are 
		// active in quoted strings.
        i = 0;
        while ((i = value.indexOf('\\', i)) != -1) {
 		   if (value[i+1] == 't')
 			   value = value.substring(0, i) + '\t' + value.substring((i++) + 2); // tab
 		   else if (value[i+1] == 'r')
 			   value = value.substring(0, i) + '\r' + value.substring((i++) + 2); // return
 		   else if (value[i+1] == 'n')
 			   value = value.substring(0, i) + '\n' + value.substring((i++) + 2); // line feed
 		   else if (value[i+1] == 'f')
 			   value = value.substring(0, i) + '\f' + value.substring((i++) + 2); // form feed
 		   else if (value[i+1] == '\\')
 			   value = value.substring(0, i) + '\\' + value.substring((i++) + 2); // \
 		   else
 			   value = value.substring(0, i) + value.substring(i+1); // Quietly drop the character
        }
		
		// Lazily convert the string to a list of tokens.
		var arr = [], j, index;
		i = 0;
		while (i < value.length) {
			if (value[i] == '\'') {
				// Handle quotes
				if (i == value.length-1)
					value = value.substring(0, i); // Silently drop the trailing quote
				else if (value[i+1] == '\'')
					value = value.substring(0, i) + value.substring(++i); // Escaped quote
				else {
					// Quoted string
					j = i + 2;
					while ((j = value.indexOf('\'', j)) != -1) {
						if (j == value.length-1 || value[j+1] != '\'') {
							// Found start and end quotes. Remove them
							value = value.substring(0,i) + value.substring(i+1, j) + value.substring(j+1);
							i = j - 1;
							break;
						}
						else {
							// Found a double quote, reduce to a single quote.
							value = value.substring(0,j) + value.substring(++j);
						}
					}
					
					if (j == -1) {
						// There is no end quote. Drop the start quote
						value = value.substring(0,i) + value.substring(i+1);
					}
				}
			}
			else if (value[i] == '{') {
				// Beginning of an unquoted place holder.
				j = value.indexOf('}', i+1);
				if (j == -1)
					i++; // No end. Process the rest of the line. Java would throw an exception
				else {
					// Add 1 to the index so that it aligns with the function arguments.
					index = parseInt(value.substring(i+1, j));
					if (!isNaN(index) && index >= 0) {
						// Put the line thus far (if it isn't empty) into the array
						var s = value.substring(0, i);
						if (s != "")
							arr.push(s);
						// Put the parameter reference into the array
						arr.push(index);
						// Start the processing over again starting from the rest of the line.
						i = 0;
						value = value.substring(j+1);
					}
					else
						i = j + 1; // Invalid parameter. Leave as is.
				}
			}
			else
				i++;
		}
		
		// Put the remainder of the no-empty line into the array.
		if (value != "")
			arr.push(value);
		value = arr;
		
		// Make the array the value for the entry.
		$.i18n.map[key] = arr;
	}
	
	if (value.length == 0)
		return "";
	if (value.lengh == 1 && typeof(value[0]) == "string")
		return value[0];
	
	var s = "";
	for (i=0; i<value.length; i++) {
		if (typeof(value[i]) == "string")
			s += value[i];
		// Must be a number
		else if (value[i] + 1 < arguments.length)
			s += arguments[value[i] + 1];
		else
			s += "{"+ value[i] +"}";
	}
	
	return s;
};

/** Language reported by browser, normalized code */
$.i18n.browserLang = function() {
	return normaliseLanguageCode(navigator.language /* Mozilla */ || navigator.userLanguage /* IE */);
}


/** Load and parse .properties files */
function loadAndParseFile(filename, settings) {
	$.ajax({
        url:        filename,
        async:      false,
        cache:		settings.cache,
        contentType:'text/plain;charset='+ settings.encoding,
        dataType:   'text',
        success:    function(data, status) {
        				parseData(data, settings.mode); 
					}
    });
}

/** Parse .properties files */
function parseData(data, mode) {
   var parsed = '';
   var parameters = data.split( /\n/ );
   var regPlaceHolder = /(\{\d+\})/g;
   var regRepPlaceHolder = /\{(\d+)\}/g;
   var unicodeRE = /(\\u.{4})/ig;
   for(var i=0; i<parameters.length; i++ ) {
       parameters[i] = parameters[i].replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ); // trim
       if(parameters[i].length > 0 && parameters[i].match("^#")!="#") { // skip comments
           var pair = parameters[i].split('=');
           if(pair.length > 0) {
               /** Process key & value */
               var name = unescape(pair[0]).replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ); // trim
               var value = pair.length == 1 ? "" : pair[1];
               // process multi-line values
               while(value.match(/\\$/)=="\\") {
               		value = value.substring(0, value.length - 1);
               		value += parameters[++i].replace( /\s\s*$/, '' ); // right trim
               }               
               // Put values with embedded '='s back together
               for(var s=2;s<pair.length;s++){ value +='=' + pair[s]; }
               value = value.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ); // trim
               
               /** Mode: bundle keys in a map */
               if(mode == 'map' || mode == 'both') {
                   // handle unicode chars possibly left out
                   var unicodeMatches = value.match(unicodeRE);
                   if(unicodeMatches) {
                     for(var u=0; u<unicodeMatches.length; u++) {
                        value = value.replace( unicodeMatches[u], unescapeUnicode(unicodeMatches[u]));
                     }
                   }
                   // add to map
                   $.i18n.map[name] = value;
               }
               
               /** Mode: bundle keys as vars/functions */
               if(mode == 'vars' || mode == 'both') {
                   value = value.replace( /"/g, '\\"' ); // escape quotation mark (")
                   
                   // make sure namespaced key exists (eg, 'some.key') 
                   checkKeyNamespace(name);
                   
                   // value with variable substitutions
                   if(regPlaceHolder.test(value)) {
                       var parts = value.split(regPlaceHolder);
                       // process function args
                       var first = true;
                       var fnArgs = '';
                       var usedArgs = [];
                       for(var p=0; p<parts.length; p++) {
                           if(regPlaceHolder.test(parts[p]) && (usedArgs.length == 0 || usedArgs.indexOf(parts[p]) == -1)) {
                               if(!first) {fnArgs += ',';}
                               fnArgs += parts[p].replace(regRepPlaceHolder, 'v$1');
                               usedArgs.push(parts[p]);
                               first = false;
                           }
                       }
                       parsed += name + '=function(' + fnArgs + '){';
                       // process function body
                       var fnExpr = '"' + value.replace(regRepPlaceHolder, '"+v$1+"') + '"';
                       parsed += 'return ' + fnExpr + ';' + '};';
                       
                   // simple value
                   }else{
                       parsed += name+'="'+value+'";';
                   }
               } // END: Mode: bundle keys as vars/functions
           } // END: if(pair.length > 0)
       } // END: skip comments
   }
   eval(parsed);
}

/** Make sure namespace exists (for keys with dots in name) */
// TODO key parts that start with numbers quietly fail. i.e. month.short.1=Jan
function checkKeyNamespace(key) {
	var regDot = /\./;
	if(regDot.test(key)) {
		var fullname = '';
		var names = key.split( /\./ );
		for(var i=0; i<names.length; i++) {
			if(i>0) {fullname += '.';}
			fullname += names[i];
			if(eval('typeof '+fullname+' == "undefined"')) {
				eval(fullname + '={};');
			}
		}
	}
}

/** Make sure filename is an array */
function getFiles(names) {
	return (names && names.constructor == Array) ? names : [names];
}

/** Ensure language code is in the format aa_AA. */
function normaliseLanguageCode(lang) {
    lang = lang.toLowerCase();
    if(lang.length > 3) {
        lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
    }
    return lang;
}

/** Unescape unicode chars ('\u00e3') */
function unescapeUnicode(str) {
  // unescape unicode codes
  var codes = [];
  var code = parseInt(str.substr(2), 16);
  if (code >= 0 && code < Math.pow(2, 16)) {
     codes.push(code);
  }
  // convert codes to text
  var unescaped = '';
  for (var i = 0; i < codes.length; ++i) {
    unescaped += String.fromCharCode(codes[i]);
  }
  return unescaped;
}

/* Cross-Browser Split 1.0.1
(c) Steven Levithan <stevenlevithan.com>; MIT License
An ECMA-compliant, uniform cross-browser split method */
var cbSplit;
// avoid running twice, which would break `cbSplit._nativeSplit`'s reference to the native `split`
if (!cbSplit) {    
  cbSplit = function(str, separator, limit) {
      // if `separator` is not a regex, use the native `split`
      if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
        if(typeof cbSplit._nativeSplit == "undefined")
          return str.split(separator, limit);
        else
          return cbSplit._nativeSplit.call(str, separator, limit);
      }
  
      var output = [],
          lastLastIndex = 0,
          flags = (separator.ignoreCase ? "i" : "") +
                  (separator.multiline  ? "m" : "") +
                  (separator.sticky     ? "y" : ""),
          separator = RegExp(separator.source, flags + "g"), // make `global` and avoid `lastIndex` issues by working with a copy
          separator2, match, lastIndex, lastLength;
  
      str = str + ""; // type conversion
      if (!cbSplit._compliantExecNpcg) {
          separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
      }
  
      /* behavior for `limit`: if it's...
      - `undefined`: no limit.
      - `NaN` or zero: return an empty array.
      - a positive number: use `Math.floor(limit)`.
      - a negative number: no limit.
      - other: type-convert, then use the above rules. */
      if (limit === undefined || +limit < 0) {
          limit = Infinity;
      } else {
          limit = Math.floor(+limit);
          if (!limit) {
              return [];
          }
      }
  
      while (match = separator.exec(str)) {
          lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser
  
          if (lastIndex > lastLastIndex) {
              output.push(str.slice(lastLastIndex, match.index));
  
              // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
              if (!cbSplit._compliantExecNpcg && match.length > 1) {
                  match[0].replace(separator2, function () {
                      for (var i = 1; i < arguments.length - 2; i++) {
                          if (arguments[i] === undefined) {
                              match[i] = undefined;
                          }
                      }
                  });
              }
  
              if (match.length > 1 && match.index < str.length) {
                  Array.prototype.push.apply(output, match.slice(1));
              }
  
              lastLength = match[0].length;
              lastLastIndex = lastIndex;
  
              if (output.length >= limit) {
                  break;
              }
          }
  
          if (separator.lastIndex === match.index) {
              separator.lastIndex++; // avoid an infinite loop
          }
      }
  
      if (lastLastIndex === str.length) {
          if (lastLength || !separator.test("")) {
              output.push("");
          }
      } else {
          output.push(str.slice(lastLastIndex));
      }
  
      return output.length > limit ? output.slice(0, limit) : output;
  };
  
  cbSplit._compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group
  cbSplit._nativeSplit = String.prototype.split;

} // end `if (!cbSplit)`
String.prototype.split = function (separator, limit) {
    return cbSplit(this, separator, limit);
};

})(jQuery);
                
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