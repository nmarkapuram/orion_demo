/* ########################################################################### *
/* ##### ACCESSIBLE TOOLTIPS (WCAG LEVEL AAA)
/* ########################################################################### */

/**
 * jQuery.accessibleTooltip - Accessible Tooltip Plugin.
 * Copyright (c) 2009-2010 Damian Keeghan - dkeeghan@deloitte.com.au
 * Date: 02/02/2010
 * @author Damian Keeghan
 * @version 1.0
 *
 */
(function($){
	//creates an accessibleTooltip from an A tag
	$.fn.accessibleTooltip = function(options){
		var defaults = {
			speed: 250,
			fadeoutspeed: 2500,
			associateWithLabel: true,
			labelText: function(btn){
				return $(btn).parent().find("label, .label").text().replace("*", "");	
			},
			helpPrefix: "Help text for",
			leftOffset: 15,
			topOffset: 3,
			preContent: "",
			buttonStyle: "tooltip",
			tooltipStyle: "tooltip",
			isAbbr: false,
			onShow: function(btn, tooltipDiv){
				$(tooltipDiv).animate({opacity: 1}, 0);	
			}
		};		
		var $cT=null;
		var options = $.extend(defaults, options);
		return this.each(function(){
			var aTooltip = $(this);
			var label = (options.associateWithLabel) ? options.labelText($(aTooltip)) : "";
			var helpText = $(aTooltip).attr("title");
			if(helpText==""){
				$(aTooltip).remove();
			} else {
				var tooltip;				
				if(options.isAbbr){
					$(aTooltip).removeAttr('title');
					tooltip = $(aTooltip);
				} else {
					$(aTooltip).after("<button type=\"button\" class=\""+options.buttonStyle+"\">"+options.helpPrefix+" "+label+"</button>");
					tooltip = $(aTooltip).parent().find("button."+options.buttonStyle);	
					$(aTooltip).remove();
				}
				$(tooltip).data("isClicked", false);
				var tooltipContent = "<div class=\""+options.tooltipStyle+"\" style=\"display: none\">";
					tooltipContent += options.preContent;
					tooltipContent += "<div class=\"content\">";
						tooltipContent += (options.associateWithLabel) ? "<h3 style=\"position: absolute; left: -99999px\">Help for "+label+"</h3>" : "";
						tooltipContent += "<p>"+helpText+"</p>";
						tooltipContent += (options.associateWithLabel) ? "<div style=\"position: absolute; left: -99999px\">End help</div>" : "";
					tooltipContent += "</div>";
				tooltipContent += "</div>";
				
				$(tooltip).after(tooltipContent);
				var tooltipDiv = $(tooltip).parent().find("div."+options.tooltipStyle);
				$(tooltip).unbind("click").bind("click", function(e){
					e.preventDefault();
					this.focus();
					if($(tooltip).data("isClicked")==false){
						$(tooltip).data("isClicked", true);
						setPosition(tooltip, tooltipDiv);
						
						if(options.speed==0){
							$(tooltipDiv).show();
							options.onShow($(aTooltip), $(tooltipDiv));
						} else {
							$(tooltipDiv).fadeIn(options.speed, function(){
								options.onShow($(aTooltip), $(tooltipDiv));										 
							});
						}
						$cT =  $(tooltip); //console.log("ct created : " + $cT);
					} else {
						if(options.fadeoutspeed==0){
							$(tooltipDiv).hide();
							$(tooltip).data("isClicked", false);
						} else {
							$(tooltipDiv).fadeOut(options.fadeoutspeed, function(){
								$(tooltip).data("isClicked", false);
							});
						}
					}
					return false;
				});
				
				//$(tooltip).bind("focus mouseover", function(){
				$(tooltip).bind("mouseover", function(){
					if($(tooltip).data("isClicked")==false){
						setPosition(tooltip, tooltipDiv,$cT);
						
						if(options.speed==0){
							$(tooltipDiv).show();
							options.onShow($(aTooltip), $(tooltipDiv));
						} else {
							$(tooltipDiv).stop().fadeIn(options.speed, function(){
								options.onShow($(aTooltip), $(tooltipDiv));
								setPosition(tooltip, tooltipDiv,$cT);								   
							});
						}
					}
				});
				$(tooltip).unbind("blur").bind("blur", function(e){
					/*if($cT!=null){
							$cTDiv =  $cT.parent().find("div."+options.tooltipStyle);	
							$cTDiv.hide();
							$cT.data("isClicked", false);
					}*/
					$.fn.toolTiponBlur($cT,options.tooltipStyle);
				});
				//$(tooltip).bind("blur mouseout", function(){
				$(tooltip).bind("mouseout", function(){
					if($(tooltip).data("isClicked")==false){
						if(options.fadeoutspeed==0){
							$(tooltipDiv).hide();
						} else {
							$(tooltipDiv).stop().fadeOut(options.fadeoutspeed);
						}
					}
				});	
				$(window).resize(function(){
					if($(tooltip).data("isClicked")==true){
						setPosition(tooltip, tooltipDiv);	
					}
				});
			}
		});
		function setPosition(tooltip, tooltipDiv, $d){
			
			var zIdx = ($d)?parseInt($d.parent().find("div."+options.tooltipStyle).css("zIndex"))+1:9001;
			//console.log("ct zindex : " + zIdx);
			var tooltipDimensions = {top: $(tooltip).position().top, left: $(tooltip).position().left, width: $(tooltip).width(), height: $(tooltip).height()}
			var tooltipDivHeight = $(tooltipDiv).height();
			var tooltipDivLeftPos = (tooltipDimensions.left + tooltipDimensions.width + options.leftOffset);
			var tooltipDivTopPos = tooltipDimensions.top + options.topOffset + $(tooltip).parents(".resultsWindow").scrollTop();
			$(tooltipDiv).css({top: tooltipDivTopPos, left: tooltipDivLeftPos,zIndex:zIdx});
		}
	};
	$.fn.toolTiponBlur=function($cT,opts){
		if($cT!=null){
							$cTDiv =  $cT.parent().find("div."+opts);	
							$cTDiv.hide();
							$cT.data("isClicked", false);
		}
	};
	$.fn.resetAccessibleTooltip = function(options){
		var defaults = {
			speed: 2500,
			tooltipStyle: "tooltip"
		};
		var options = $.extend(defaults, options);
		return this.each(function(){
			var tooltip = $(this);
			var tooltipDiv = $(tooltip).parent().find("div."+options.tooltipStyle);
			if(options.speed==0){
				$(tooltipDiv).hide();
				$(tooltip).data("isClicked", false);
			} else {
				$(tooltipDiv).fadeOut(options.speed, function(){
					$(tooltip).data("isClicked", false);
				});
			}						   
		});	
	};
})(jQuery);
/**
 *  ORIGINAL CODE:
 *  http://code.google.com/p/jquery-json/
 */
/*
(function($){function toIntegersAtLease(n)
{return n<10?'0'+n:n;}
Date.prototype.toJSON=function(date)
{return this.getUTCFullYear()+'-'+
toIntegersAtLease(this.getUTCMonth())+'-'+
toIntegersAtLease(this.getUTCDate());};var escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};$.quoteString=function(string)
{if(escapeable.test(string))
{return'"'+string.replace(escapeable,function(a)
{var c=meta[a];if(typeof c==='string'){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};$.toJSON=function(o,compact)
{var type=typeof(o);if(type=="undefined")
return"undefined";else if(type=="number"||type=="boolean")
return o+"";else if(o===null)
return"null";if(type=="string")
{return $.quoteString(o);}
if(type=="object"&&typeof o.toJSON=="function")
return o.toJSON(compact);if(type!="function"&&typeof(o.length)=="number")
{var ret=[];for(var i=0;i<o.length;i++){ret.push($.toJSON(o[i],compact));}
if(compact)
return"["+ret.join(",")+"]";else
return"["+ret.join(", ")+"]";}
if(type=="function"){throw new TypeError("Unable to convert object of type 'function' to json.");}
var ret=[];for(var k in o){var name;type=typeof(k);if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;var val=$.toJSON(o[k],compact);if(typeof(val)!="string"){continue;}
if(compact)
ret.push(name+":"+val);else
ret.push(name+": "+val);}
return"{"+ret.join(", ")+"}";};$.compactJSON=function(o)
{return $.toJSON(o,true);};$.evalJSON=function(src)
{return eval("("+src+")");};$.secureEvalJSON=function(src)
{var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};})(jQuery);
*/

/**
 * MODIFIED FROM ORIGINAL:
 * 
 */
(function($){
function toIntegersAtLease(n){
return n<10?"0"+n:n;
};
Date.prototype.toJSON=function(_3){
return _3.getUTCFullYear()+"-"+toIntegersAtLease(_3.getUTCMonth()+1)+"-"+toIntegersAtLease(_3.getUTCDate());
};
var _4=/["\\\x00-\x1f\x7f-\x9f]/g;
var _5={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
$.quoteString=function(_6){
if(_4.test(_6)){
return "\""+_6.replace(_4,function(a){
var c=_5[a];
if(typeof c==="string"){
return c;
}
c=a.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
})+"\"";
}
return "\""+_6+"\"";
};
$.toJSON=function(o){
var _a=typeof (o);
if(_a=="undefined"){
return "undefined";
}else{
if(_a=="number"||_a=="boolean"){
return o+"";
}else{
if(o===null){
return "null";
}
}
}
if(_a=="string"){
return $.quoteString(o);
}
if(_a=="object"&&typeof o.toJSON=="function"){
return o.toJSON();
}
if(_a!="function"&&typeof (o.length)=="number"){
var _b=[];
for(var i=0;i<o.length;i++){
_b.push($.toJSON(o[i]));
}
return "["+_b.join(", ")+"]";
}
if(_a=="function"){
throw new TypeError("Unable to convert object of type 'function' to json.");
}
_b=[];
for(var k in o){
var _e;
var _a=typeof (k);
if(_a=="number"){
_e="\""+k+"\"";
}else{
if(_a=="string"){
_e=$.quoteString(k);
}else{
continue;
}
}
val=$.toJSON(o[k]);
if(typeof (val)!="string"){
continue;
}
_b.push(_e+": "+val);
}
return "{"+_b.join(", ")+"}";
};
$.evalJSON=function(_f){
return eval("("+_f+")");
};
$.secureEvalJSON=function(src){
var _11=src;
_11=_11.replace(/\\["\\\/bfnrtu]/g,"@");
_11=_11.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]");
_11=_11.replace(/(?:^|:|,)(?:\s*\[)+/g,"");
if(/^[\],:{}\s]*$/.test(_11)){
return eval("("+src+")");
}else{
throw new SyntaxError("Error parsing JSON, source is not valid.");
}
};
})(jQuery);
/*!
 * jQuery corner plugin: simple corner rounding
 * Examples and documentation at: http://jquery.malsup.com/corner/
 * version 2.11 (15-JUN-2010)
 * Requires jQuery v1.3.2 or later
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Authors: Dave Methvin and Mike Alsup
 */
/**
 *  corner() takes a single string argument:  $('#myDiv').corner("effect corners width")
 *
 *  effect:  name of the effect to apply, such as round, bevel, notch, bite, etc (default is round). 
 *  corners: one or more of: top, bottom, tr, tl, br, or bl.  (default is all corners)
 *  width:   width of the effect; in the case of rounded corners this is the radius. 
 *           specify this value using the px suffix such as 10px (yes, it must be pixels).
 */
;(function($){var style=document.createElement('div').style,moz=style['MozBorderRadius']!==undefined,webkit=style['WebkitBorderRadius']!==undefined,radius=style['borderRadius']!==undefined||style['BorderRadius']!==undefined,mode=document.documentMode||0,noBottomFold=$.browser.msie&&(($.browser.version<8&&!mode)||mode<8),expr=$.browser.msie&&(function(){var div=document.createElement('div');try{div.style.setExpression('width','0+0');div.style.removeExpression('width')}catch(e){return false}return true})();$.support=$.support||{};$.support.borderRadius=moz||webkit||radius;function sz(el,p){return parseInt($.css(el,p))||0};function hex2(s){var s=parseInt(s).toString(16);return(s.length<2)?'0'+s:s};function gpc(node){while(node){var v=$.css(node,'backgroundColor'),rgb;if(v&&v!='transparent'&&v!='rgba(0, 0, 0, 0)'){if(v.indexOf('rgb')>=0){rgb=v.match(/\d+/g);return'#'+hex2(rgb[0])+hex2(rgb[1])+hex2(rgb[2])}return v}if(node.nodeName.toLowerCase()=='html')break;node=node.parentNode}return'#ffffff'};function getWidth(fx,i,width){switch(fx){case'round':return Math.round(width*(1-Math.cos(Math.asin(i/width))));case'cool':return Math.round(width*(1+Math.cos(Math.asin(i/width))));case'sharp':return Math.round(width*(1-Math.cos(Math.acos(i/width))));case'bite':return Math.round(width*(Math.cos(Math.asin((width-i-1)/width))));case'slide':return Math.round(width*(Math.atan2(i,width/i)));case'jut':return Math.round(width*(Math.atan2(width,(width-i-1))));case'curl':return Math.round(width*(Math.atan(i)));case'tear':return Math.round(width*(Math.cos(i)));case'wicked':return Math.round(width*(Math.tan(i)));case'long':return Math.round(width*(Math.sqrt(i)));case'sculpt':return Math.round(width*(Math.log((width-i-1),width)));case'dogfold':case'dog':return(i&1)?(i+1):width;case'dog2':return(i&2)?(i+1):width;case'dog3':return(i&3)?(i+1):width;case'fray':return(i%2)*width;case'notch':return width;case'bevelfold':case'bevel':return i+1}};$.fn.corner=function(options){if(this.length==0){if(!$.isReady&&this.selector){var s=this.selector,c=this.context;$(function(){$(s,c).corner(options)})}return this}return this.each(function(index){var $this=$(this),o=[$this.attr($.fn.corner.defaults.metaAttr)||'',options||''].join(' ').toLowerCase(),keep=/keep/.test(o),cc=((o.match(/cc:(#[0-9a-f]+)/)||[])[1]),sc=((o.match(/sc:(#[0-9a-f]+)/)||[])[1]),width=parseInt((o.match(/(\d+)px/)||[])[1])||10,re=/round|bevelfold|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dogfold|dog/,fx=((o.match(re)||['round'])[0]),fold=/dogfold|bevelfold/.test(o),edges={T:0,B:1},opts={TL:/top|tl|left/.test(o),TR:/top|tr|right/.test(o),BL:/bottom|bl|left/.test(o),BR:/bottom|br|right/.test(o)},strip,pad,cssHeight,j,bot,d,ds,bw,i,w,e,c,common,$horz;if(!opts.TL&&!opts.TR&&!opts.BL&&!opts.BR)opts={TL:1,TR:1,BL:1,BR:1};if($.fn.corner.defaults.useNative&&fx=='round'&&(radius||moz||webkit)&&!cc&&!sc){if(opts.TL)$this.css(radius?'border-top-left-radius':moz?'-moz-border-radius-topleft':'-webkit-border-top-left-radius',width+'px');if(opts.TR)$this.css(radius?'border-top-right-radius':moz?'-moz-border-radius-topright':'-webkit-border-top-right-radius',width+'px');if(opts.BL)$this.css(radius?'border-bottom-left-radius':moz?'-moz-border-radius-bottomleft':'-webkit-border-bottom-left-radius',width+'px');if(opts.BR)$this.css(radius?'border-bottom-right-radius':moz?'-moz-border-radius-bottomright':'-webkit-border-bottom-right-radius',width+'px');return}strip=document.createElement('div');$(strip).css({overflow:'hidden',height:'1px',minHeight:'1px',fontSize:'1px',backgroundColor:sc||'transparent',borderStyle:'solid'});pad={T:parseInt($.css(this,'paddingTop'))||0,R:parseInt($.css(this,'paddingRight'))||0,B:parseInt($.css(this,'paddingBottom'))||0,L:parseInt($.css(this,'paddingLeft'))||0};if(typeof this.style.zoom!=undefined)this.style.zoom=1;if(!keep)this.style.border='none';strip.style.borderColor=cc||gpc(this.parentNode);cssHeight=$(this).outerHeight();for(j in edges){bot=edges[j];if((bot&&(opts.BL||opts.BR))||(!bot&&(opts.TL||opts.TR))){strip.style.borderStyle='none '+(opts[j+'R']?'solid':'none')+' none '+(opts[j+'L']?'solid':'none');d=document.createElement('div');$(d).addClass('jquery-corner');ds=d.style;bot?this.appendChild(d):this.insertBefore(d,this.firstChild);if(bot&&cssHeight!='auto'){if($.css(this,'position')=='static')this.style.position='relative';ds.position='absolute';ds.bottom=ds.left=ds.padding=ds.margin='0';if(expr)ds.setExpression('width','this.parentNode.offsetWidth');else ds.width='100%'}else if(!bot&&$.browser.msie){if($.css(this,'position')=='static')this.style.position='relative';ds.position='absolute';ds.top=ds.left=ds.right=ds.padding=ds.margin='0';if(expr){bw=sz(this,'borderLeftWidth')+sz(this,'borderRightWidth');ds.setExpression('width','this.parentNode.offsetWidth - '+bw+'+ "px"')}else ds.width='100%'}else{ds.position='relative';ds.margin=!bot?'-'+pad.T+'px -'+pad.R+'px '+(pad.T-width)+'px -'+pad.L+'px':(pad.B-width)+'px -'+pad.R+'px -'+pad.B+'px -'+pad.L+'px'}for(i=0;i<width;i++){w=Math.max(0,getWidth(fx,i,width));e=strip.cloneNode(false);e.style.borderWidth='0 '+(opts[j+'R']?w:0)+'px 0 '+(opts[j+'L']?w:0)+'px';bot?d.appendChild(e):d.insertBefore(e,d.firstChild)}if(fold&&$.support.boxModel){if(bot&&noBottomFold)continue;for(c in opts){if(!opts[c])continue;if(bot&&(c=='TL'||c=='TR'))continue;if(!bot&&(c=='BL'||c=='BR'))continue;common={position:'absolute',border:'none',margin:0,padding:0,overflow:'hidden',backgroundColor:strip.style.borderColor};$horz=$('<div/>').css(common).css({width:width+'px',height:'1px'});switch(c){case'TL':$horz.css({bottom:0,left:0});break;case'TR':$horz.css({bottom:0,right:0});break;case'BL':$horz.css({top:0,left:0});break;case'BR':$horz.css({top:0,right:0});break}d.appendChild($horz[0]);var $vert=$('<div/>').css(common).css({top:0,bottom:0,width:'1px',height:width+'px'});switch(c){case'TL':$vert.css({left:width});break;case'TR':$vert.css({right:width});break;case'BL':$vert.css({left:width});break;case'BR':$vert.css({right:width});break}d.appendChild($vert[0])}}}}})};$.fn.uncorner=function(){if(radius||moz||webkit)this.css(radius?'border-radius':moz?'-moz-border-radius':'-webkit-border-radius',0);$('div.jquery-corner',this).remove();return this};$.fn.corner.defaults={useNative:true,metaAttr:'data-corner'}})(jQuery);

/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);

/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */

;(function($){$.fn.superfish=function(op){var sf=$.fn.superfish,c=sf.c,$arrow=$(['<span class="',c.arrowClass,'"> &#187;</span>'].join('')),over=function(){var $$=$(this),menu=getMenu($$);clearTimeout(menu.sfTimer);$$.showSuperfishUl().siblings().hideSuperfishUl()},out=function(){var $$=$(this),menu=getMenu($$),o=sf.op;clearTimeout(menu.sfTimer);menu.sfTimer=setTimeout(function(){o.retainPath=($.inArray($$[0],o.$path)>-1);$$.hideSuperfishUl();if(o.$path.length&&$$.parents(['li.',o.hoverClass].join('')).length<1){over.call(o.$path)}},o.delay)},getMenu=function($menu){var menu=$menu.parents(['ul.',c.menuClass,':first'].join(''))[0];sf.op=sf.o[menu.serial];return menu},addArrow=function($a){$a.addClass(c.anchorClass).append($arrow.clone())};return this.each(function(){var s=this.serial=sf.o.length;var o=$.extend({},sf.defaults,op);o.$path=$('li.'+o.pathClass,this).slice(0,o.pathLevels).each(function(){$(this).addClass([o.hoverClass,c.bcClass].join(' ')).filter('li:has(ul)').removeClass(o.pathClass)});sf.o[s]=sf.op=o;$('li:has(ul)',this)[($.fn.hoverIntent&&!o.disableHI)?'hoverIntent':'hover'](over,out).each(function(){if(o.autoArrows)addArrow($('>a:first-child',this))}).not('.'+c.bcClass).hideSuperfishUl();var $a=$('a',this);$a.each(function(i){var $li=$a.eq(i).parents('li');$a.eq(i).focus(function(){over.call($li)}).blur(function(){out.call($li)})});o.onInit.call(this)}).each(function(){var menuClasses=[c.menuClass];if(sf.op.dropShadows&&!($.browser.msie&&$.browser.version<7))menuClasses.push(c.shadowClass);$(this).addClass(menuClasses.join(' '))})};var sf=$.fn.superfish;sf.o=[];sf.op={};sf.IE7fix=function(){var o=sf.op;if($.browser.msie&&$.browser.version>6&&o.dropShadows&&o.animation.opacity!=undefined)this.toggleClass(sf.c.shadowClass+'-off')};sf.c={bcClass:'sf-breadcrumb',menuClass:'sf-js-enabled',anchorClass:'sf-with-ul',arrowClass:'sf-sub-indicator',shadowClass:'sf-shadow'};sf.defaults={hoverClass:'sfHover',pathClass:'overideThisToUse',pathLevels:1,delay:800,animation:{opacity:'show'},speed:'normal',autoArrows:true,dropShadows:true,disableHI:false,onInit:function(){},onBeforeShow:function(){},onShow:function(){},onHide:function(){}};$.fn.extend({hideSuperfishUl:function(){var o=sf.op,not=(o.retainPath===true)?o.$path:'';o.retainPath=false;var $ul=$(['li.',o.hoverClass].join(''),this).add(this).not(not).removeClass(o.hoverClass).find('>ul').hide().css('visibility','hidden');o.onHide.call($ul);return this},showSuperfishUl:function(){var o=sf.op,sh=sf.c.shadowClass+'-off',$ul=this.addClass(o.hoverClass).find('>ul:hidden').css('visibility','visible');sf.IE7fix.call($ul);o.onBeforeShow.call($ul);$ul.animate(o.animation,o.speed,function(){sf.IE7fix.call($ul);o.onShow.call($ul)});return this}})})(jQuery);

/*
 * Supersubs v0.2b - jQuery plugin
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 *
 * This plugin automatically adjusts submenu widths of suckerfish-style menus to that of
 * their longest list item children. If you use this, please expect bugs and report them
 * to the jQuery Google Group with the word 'Superfish' in the subject line.
 *
 */
;(function($){$.fn.supersubs=function(options){var opts=$.extend({},$.fn.supersubs.defaults,options);return this.each(function(){var $$=$(this);var o=$.meta?$.extend({},opts,$$.data()):opts;var fontsize=$('<li id="menu-fontsize">&#8212;</li>').css({'padding':0,'position':'absolute','top':'-999em','width':'auto'}).appendTo($$).width();$('#menu-fontsize').remove();$ULs=$$.find('ul');$ULs.each(function(i){var $ul=$ULs.eq(i);var $LIs=$ul.children();var $As=$LIs.children('a');var liFloat=$LIs.css('white-space','nowrap').css('float');var emWidth=$ul.add($LIs).add($As).css({'float':'none','width':'auto'}).end().end()[0].clientWidth/fontsize;emWidth+=o.extraWidth;if(emWidth>o.maxWidth){emWidth=o.maxWidth}else if(emWidth<o.minWidth){emWidth=o.minWidth}emWidth+='em';$ul.css('width',emWidth);$LIs.css({'float':liFloat,'width':'100%','white-space':'normal'}).each(function(){var $childUl=$('>ul',this);var offsetDirection=$childUl.css('left')!==undefined?'left':'right';$childUl.css(offsetDirection,emWidth)})})})};$.fn.supersubs.defaults={minWidth:9,maxWidth:25,extraWidth:0}})(jQuery);
function get_html_translation_table(table, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brettz9.blogspot.com)
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js. Meaning the constants are not
    // %          note: real constants, but strings instead. integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
    
    var entities = {}, histogram = {}, decimal = 0, symbol = '';
    var constMappingTable = {}, constMappingQuoteStyle = {};
    var useTable = {}, useQuoteStyle = {};
    
    // Translate arguments
    constMappingTable[0]      = 'HTML_SPECIALCHARS';
    constMappingTable[1]      = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';
 
    useTable     = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
 
    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw Error("Table: "+useTable+' not supported');
        // return false;
    }
 
    // ascii decimals for better compatibility
    entities['38'] = '&amp;';
    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#039;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';
 
    if (useTable === 'HTML_ENTITIES') {
      entities['160'] = '&nbsp;';
      entities['161'] = '&iexcl;';
      entities['162'] = '&cent;';
      entities['163'] = '&pound;';
      entities['164'] = '&curren;';
      entities['165'] = '&yen;';
      entities['166'] = '&brvbar;';
      entities['167'] = '&sect;';
      entities['168'] = '&uml;';
      entities['169'] = '&copy;';
      entities['170'] = '&ordf;';
      entities['171'] = '&laquo;';
      entities['172'] = '&not;';
      entities['173'] = '&shy;';
      entities['174'] = '&reg;';
      entities['175'] = '&macr;';
      entities['176'] = '&deg;';
      entities['177'] = '&plusmn;';
      entities['178'] = '&sup2;';
      entities['179'] = '&sup3;';
      entities['180'] = '&acute;';
      entities['181'] = '&micro;';
      entities['182'] = '&para;';
      entities['183'] = '&middot;';
      entities['184'] = '&cedil;';
      entities['185'] = '&sup1;';
      entities['186'] = '&ordm;';
      entities['187'] = '&raquo;';
      entities['188'] = '&frac14;';
      entities['189'] = '&frac12;';
      entities['190'] = '&frac34;';
      entities['191'] = '&iquest;';
      entities['192'] = '&Agrave;';
      entities['193'] = '&Aacute;';
      entities['194'] = '&Acirc;';
      entities['195'] = '&Atilde;';
      entities['196'] = '&Auml;';
      entities['197'] = '&Aring;';
      entities['198'] = '&AElig;';
      entities['199'] = '&Ccedil;';
      entities['200'] = '&Egrave;';
      entities['201'] = '&Eacute;';
      entities['202'] = '&Ecirc;';
      entities['203'] = '&Euml;';
      entities['204'] = '&Igrave;';
      entities['205'] = '&Iacute;';
      entities['206'] = '&Icirc;';
      entities['207'] = '&Iuml;';
      entities['208'] = '&ETH;';
      entities['209'] = '&Ntilde;';
      entities['210'] = '&Ograve;';
      entities['211'] = '&Oacute;';
      entities['212'] = '&Ocirc;';
      entities['213'] = '&Otilde;';
      entities['214'] = '&Ouml;';
      entities['215'] = '&times;';
      entities['216'] = '&Oslash;';
      entities['217'] = '&Ugrave;';
      entities['218'] = '&Uacute;';
      entities['219'] = '&Ucirc;';
      entities['220'] = '&Uuml;';
      entities['221'] = '&Yacute;';
      entities['222'] = '&THORN;';
      entities['223'] = '&szlig;';
      entities['224'] = '&agrave;';
      entities['225'] = '&aacute;';
      entities['226'] = '&acirc;';
      entities['227'] = '&atilde;';
      entities['228'] = '&auml;';
      entities['229'] = '&aring;';
      entities['230'] = '&aelig;';
      entities['231'] = '&ccedil;';
      entities['232'] = '&egrave;';
      entities['233'] = '&eacute;';
      entities['234'] = '&ecirc;';
      entities['235'] = '&euml;';
      entities['236'] = '&igrave;';
      entities['237'] = '&iacute;';
      entities['238'] = '&icirc;';
      entities['239'] = '&iuml;';
      entities['240'] = '&eth;';
      entities['241'] = '&ntilde;';
      entities['242'] = '&ograve;';
      entities['243'] = '&oacute;';
      entities['244'] = '&ocirc;';
      entities['245'] = '&otilde;';
      entities['246'] = '&ouml;';
      entities['247'] = '&divide;';
      entities['248'] = '&oslash;';
      entities['249'] = '&ugrave;';
      entities['250'] = '&uacute;';
      entities['251'] = '&ucirc;';
      entities['252'] = '&uuml;';
      entities['253'] = '&yacute;';
      entities['254'] = '&thorn;';
      entities['255'] = '&yuml;';
    }
    
    // ascii decimals to real symbols
    for (decimal in entities) {
        symbol = String.fromCharCode(decimal);
        histogram[symbol] = entities[decimal];
    }
    
    return histogram;
}
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