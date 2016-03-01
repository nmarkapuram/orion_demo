/*
* jquery.TreeList.js
*
* Date  : 02/08/2010 
* Version : 1.0
* Author: rnarayanan@vmware.com (Rajesh Narayanan)
*/
if(null == treelistDataObj)
{
    var treelistDataObj = [];
}

;(function($) {

var currentSelection = null;
$.fn.leafSelection = function(){
    if(undefined != $(this).attr("id") && (true == $(this).parent().hasClass("last") || "" == $(this).parent().attr("class")))
    {
        if(null != currentSelection)
        {
            var currentSelectionId = currentSelection.split("_")[1]
            $("#node_" + currentSelectionId).removeClass("highlight");
        }
        
        currentSelection = $(this).attr("id");
        $(this).parent().addClass("highlight");
    }
};

$.fn.getSelectedData = function() 
{
    if(null != currentSelection)
    {
        var currentSelectionId = currentSelection.split("_")[1]
        
        if(null != $.toJSON && null != treelistDataObj[currentSelectionId])
        {
            return $.toJSON(treelistDataObj[currentSelectionId]);
        }
        else if(null != treelistDataObj[currentSelectionId])
        {
            return treelistDataObj[currentSelectionId];
        }
    }
    else
    {
        return "NO_ITEM_SELECTED";
    }
};

function load(settings, root, child, container) 
{
    /* Code block for testing */
    //    alert(settings.url + " " + root);
    //    if(root != -1)
    //    {
    //        if("node_001" == root)
    //        {
    //            settings.url = "data2.js";
    //        }
    //        
    //        if("node_002" == root)
    //        {
    //            settings.url = "data3.js";
    //        }
    //    }
    
    $.getJSON(settings.url, {id: root}, function(response) 
	{
		function createNode(parent) 
		{
			var nameString = "";
			if("" != this.id)
			{
				nameString = new String(this.id)
				nameString = nameString.split(' ').join('');
			}
			
			var current;
			if("-1" == root)
			{
				current = $("<li/>").attr("id", "node_"+this.id || "").attr("name", "pf_node_"+ nameString || "").html("<span id='cell_"+ this.id +"' name='cell_"+ nameString +"' onclick='$(this).leafSelection()'>" + this.text + "</span>").appendTo(parent);
			}
			else
			{
				current = $("<li/>").attr("id", "node_"+this.id || "").attr("name", "node_"+ nameString || "").html("<span id='cell_"+ this.id +"' name='cell_"+ nameString +"' onclick='$(this).leafSelection()'>" + this.text + "</span>").appendTo(parent);
			}

			if (this.classes) {
				current.children("span").addClass(this.classes);
			}
			if (this.expanded) {
				current.addClass("open");
			}
			if (this.hasChildren || this.children && this.children.length) {
				var branch = $("<ul/>").appendTo(current);
			    
				if (this.hasChildren) {
					current.addClass("hasChildren");
					createNode.call({
						text:"loading...",
						id:"placeholder",
						children:[]
					}, branch);
				}
				if (this.children && this.children.length) {
					$.each(this.children, createNode, [branch])
				}
			}
		}
		
        function parseData(response)
        {
            var myNamedArray = [];
            if(null != response)
            {
                var nRootNodeLength = response.length;
                var counter = 0;
                for(var nRootNode = 0;nRootNode < nRootNodeLength; ++nRootNode)
                {
                    for(var nSubNode = 0; nSubNode < response[nRootNode].children.length; ++nSubNode)
                    {
                        if(null != response[nRootNode].children && null != response[nRootNode].children[nSubNode])
                        {
                            for(var nLeafNode = 0; nLeafNode < response[nRootNode].children[nSubNode].children.length; ++nLeafNode)
                            {
                                var nID = response[nRootNode].children[nSubNode].children[nLeafNode].id;
                                
                                //alert(counter + " ---- " + response[nRootNode].children[nSubNode] +  " ~~~%%%%~~~ " + response[nRootNode].text + "---" + response[nRootNode].children[nSubNode].text);
                                myNamedArray[nID] = response[nRootNode].children[nSubNode].children[nLeafNode];
                                myNamedArray[nID].subNode = response[nRootNode].children[nSubNode].text;
                                myNamedArray[nID].rootNode = $("#node_" + nID).parent("ul").parent("li").parent("ul").parent("li").parent("ul").parent("li").children("span").text()
                                ++counter;
                            }
                        }
                    }
                }
            }
            
            return myNamedArray;
        }
		
		$.each(response, createNode, [child]);
		//treelistDataObj = $.extend({}, parseData(response));
		$.extend(treelistDataObj, parseData(response));
		
        $(container).treeview({add: child});
        
        $(".treeview").find("li").children("div").next("span").css("color", "#4BA1CF");
        //$(".treeview").find("li").children("div").next("span").css("font-weight", "bold");
        $(".treeview").children("li").children("div").next("span").css("color", "#666666");
        //$(".treeview").children("li").children("div").next("span").css("font-weight", "bold");
    });
}

var proxied = $.fn.treeview;
$.fn.treeview = function(settings) {
	if (!settings.url) {
		return proxied.apply(this, arguments);
	}
	var container = this;
	load(settings, "-1" , this, container);
	var userToggle = settings.toggle;
	return proxied.call(this, $.extend({}, settings, {
		collapsed: true,
		toggle: function() {
			var $this = $(this);
			if ($this.hasClass("hasChildren")) {
				var childList = $this.removeClass("hasChildren").find("ul");
				childList.empty();
				load(settings, this.id, childList, container);
			}
			if (userToggle) {
				userToggle.apply(this, arguments);
			}
		}
	}));
};
})(jQuery);


vmf.TreeList = function($){
    return {
      build: function(id , options)
      {
           $("#" + id).treeview(options);
      },
      getSelectedData: function()
      {
           return $.fn.getSelectedData();
      }      
    };
}(jQuery);
/*
 * http://docs.jquery.com/Plugins
 *
 * jquery.TreeList.js
 *
 * Date  : 12/04/2009 
 * Version : 1.0
 * Author: rnarayanan@vmware.com (Rajesh Narayanan)
 *
 */

;(function($) {

	$.extend($.fn, {
		swapClass: function(c1, c2) {
			var c1Elements = this.filter('.' + c1);
			this.filter('.' + c2).removeClass(c2).addClass(c1);
			c1Elements.removeClass(c1).addClass(c2);
			return this;
		},
		replaceClass: function(c1, c2) {
			return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
		},
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		heightToggle: function(animated, callback) {
			animated ?
				this.animate({ height: "toggle" }, animated, callback) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
					if(callback)
						callback.apply(this, arguments);
				});
		},
		heightHide: function(animated, callback) {
			if (animated) {
				this.animate({ height: "hide" }, animated, callback);
			} else {
				this.hide();
				if (callback)
					this.each(callback);				
			}
		},
		prepareBranches: function(settings) {
			if (!settings.prerendered) {
				// mark last tree items
				this.filter(":last-child:not(ul)").addClass(CLASSES.last);
				// collapse whole tree, or only those marked as closed, anyway except those marked as open
				this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide();
			}
			// return all items with sublists
			return this.filter(":has(>ul)");
		},
		applyClasses: function(settings, toggler) {
			this.filter(":has(>ul):not(:has(>a))").find(">span").click(function(event) {
				toggler.apply($(this).next());
			}).add( $("a", this) ).hoverClass();
			
			if (!settings.prerendered) {
				// handle closed ones first
				this.filter(":has(>ul:hidden)")
						.addClass(CLASSES.expandable)
						.replaceClass(CLASSES.last, CLASSES.lastExpandable);
						
				// handle open ones
				this.not(":has(>ul:hidden)")
						.addClass(CLASSES.collapsable)
						.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
						
	            // create hitarea
				this.prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea).each(function() {
					var classes = "";
					$.each($(this).parent().attr("class").split(" "), function() {
						classes += this + "-hitarea ";
					});
					$(this).addClass( classes );
				});
			}
			
			// apply event to hitarea
			this.find("div." + CLASSES.hitarea).click( toggler );
		},
		treeview: function(settings) {
			
			settings = $.extend({
				cookieId: "treeview"
			}, settings);
			
			if (settings.add) {
				return this.trigger("add", [settings.add]);
			}
			
			if ( settings.toggle ) {
				var callback = settings.toggle;
				settings.toggle = function() {
					return callback.apply($(this).parent()[0], arguments);
				};
			}
		
			// factory for treecontroller
			function treeController(tree, control) {
				// factory for click handlers
				function handler(filter) {
					return function() {
						// reuse toggle event handler, applying the elements to toggle
						// start searching for all hitareas
						toggler.apply( $("div." + CLASSES.hitarea, tree).filter(function() {
							// for plain toggle, no filter is provided, otherwise we need to check the parent element
							return filter ? $(this).parent("." + filter).length : true;
						}) );
						return false;
					};
				}
				// click on first element to collapse tree
				$("a:eq(0)", control).click( handler(CLASSES.collapsable) );
				// click on second to expand tree
				$("a:eq(1)", control).click( handler(CLASSES.expandable) );
				// click on third to toggle tree
				$("a:eq(2)", control).click( handler() ); 
			}
		
			// handle toggle event
			function toggler() {
				$(this)
					.parent()
					// swap classes for hitarea
					.find(">.hitarea")
						.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
						.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
					.end()
					// swap classes for parent li
					.swapClass( CLASSES.collapsable, CLASSES.expandable )
					.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
					// find child lists
					.find( ">ul" )
					// toggle them
					.heightToggle( settings.animated, settings.toggle );
				if ( settings.unique ) {
					$(this).parent()
						.siblings()
						// swap classes for hitarea
						.find(">.hitarea")
							.replaceClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
							.replaceClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
						.end()
						.replaceClass( CLASSES.collapsable, CLASSES.expandable )
						.replaceClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
						.find( ">ul" )
						.heightHide( settings.animated, settings.toggle );
				}
			}
			
			function serialize() {
				function binary(arg) {
					return arg ? 1 : 0;
				}
				var data = [];
				branches.each(function(i, e) {
					data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0;
				});
				$.cookie(settings.cookieId, data.join("") );
			}
			
			function deserialize() {
				var stored = $.cookie(settings.cookieId);
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						$(e).find(">ul")[ parseInt(data[i]) ? "show" : "hide" ]();
					});
				}
			}
			
			// add treeview class to activate styles
			this.addClass("treeview");
			
			// prepare branches and find all tree items with child lists
			var branches = this.find("li").prepareBranches(settings);
			
			switch(settings.persist) {
			case "cookie":
				var toggleCallback = settings.toggle;
				settings.toggle = function() {
					serialize();
					if (toggleCallback) {
						toggleCallback.apply(this, arguments);
					}
				};
				deserialize();
				break;
			case "location":
				var current = this.find("a").filter(function() { return this.href.toLowerCase() == location.href.toLowerCase(); });
				if ( current.length ) {
					current.addClass("selected").parents("ul, li").add( current.next() ).show();
				}
				break;
			}
			
			branches.applyClasses(settings, toggler);
				
			// if control option is set, create the treecontroller and show it
			if ( settings.control ) {
				treeController(this, settings.control);
				$(settings.control).show();
			}
			
			return this.bind("add", function(event, branches) {
				$(branches).prev()
					.removeClass(CLASSES.last)
					.removeClass(CLASSES.lastCollapsable)
					.removeClass(CLASSES.lastExpandable)
				.find(">.hitarea")
					.removeClass(CLASSES.lastCollapsableHitarea)
					.removeClass(CLASSES.lastExpandableHitarea);
				$(branches).find("li").andSelf().prepareBranches(settings).applyClasses(settings, toggler);
			});
		}
	});
	
	// classes used by the plugin
	// need to be styled via external stylesheet, see first example
	var CLASSES = $.fn.treeview.classes = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		expandableHitarea: "expandable-hitarea",
		lastExpandableHitarea: "lastExpandable-hitarea",
		collapsable: "collapsable",
		collapsableHitarea: "collapsable-hitarea",
		lastCollapsableHitarea: "lastCollapsable-hitarea",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	};
	
	// provide backwards compability
	$.fn.Treeview = $.fn.treeview;
	
})(jQuery);