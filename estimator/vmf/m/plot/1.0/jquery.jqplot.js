//first
/**
 * Title: jqPlot Charts
 * 
 * Pure JavaScript plotting plugin for jQuery.
 * 
 * About: Version
 * 
 * version: 1.0.8 
 * revision: 1250
 * 
 * About: Copyright & License
 * 
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly.
 * 
 * See <GPL Version 2> and <MIT License> contained within this distribution for further information. 
 *
 * The author would appreciate an email letting him know of any substantial
 * use of jqPlot.  You can reach the author at: chris at jqplot dot com 
 * or see http://www.jqplot.com/info.php.  This is, of course, not required.
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php.
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 * 
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 * 
 * About: Introduction
 * 
 * jqPlot requires jQuery (1.4+ required for certain features). jQuery 1.4.2 is included in the distribution.  
 * To use jqPlot include jQuery, the jqPlot jQuery plugin, the jqPlot css file and optionally 
 * the excanvas script for IE support in your web page:
 * 
 * > <!--[if lt IE 9]><script language="javascript" type="text/javascript" src="excanvas.js"></script><![endif]-->
 * > <script language="javascript" type="text/javascript" src="jquery-1.4.4.min.js"></script>
 * > <script language="javascript" type="text/javascript" src="jquery.jqplot.min.js"></script>
 * > <link rel="stylesheet" type="text/css" href="jquery.jqplot.css" />
 * 
 * jqPlot can be customized by overriding the defaults of any of the objects which make
 * up the plot. The general usage of jqplot is:
 * 
 * > chart = $.jqplot('targetElemId', [dataArray,...], {optionsObject});
 * 
 * The options available to jqplot are detailed in <jqPlot Options> in the jqPlotOptions.txt file.
 * 
 * An actual call to $.jqplot() may look like the 
 * examples below:
 * 
 * > chart = $.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);
 * 
 * or
 * 
 * > dataArray = [34,12,43,55,77];
 * > chart = $.jqplot('targetElemId', [dataArray, ...], {title:'My Plot', axes:{yaxis:{min:20, max:100}}});
 * 
 * For more inforrmation, see <jqPlot Usage>.
 * 
 * About: Usage
 * 
 * See <jqPlot Usage>
 * 
 * About: Available Options 
 * 
 * See <jqPlot Options> for a list of options available thorugh the options object (not complete yet!)
 * 
 * About: Options Usage
 * 
 * See <Options Tutorial>
 * 
 * About: Changes
 * 
 * See <Change Log>
 * 
 */
(function($) {
    // make sure undefined is undefined
    var undefined;
    
    $.fn.emptyForce = function() {
      for ( var i = 0, elem; (elem = $(this)[i]) != null; i++ ) {
        // Remove element nodes and prevent memory leaks
        if ( elem.nodeType === 1 ) {
          $.cleanData( elem.getElementsByTagName("*") );
        }
  
        // Remove any remaining nodes
        if ($.jqplot.use_excanvas) {
          elem.outerHTML = "";
        }
        else {
          while ( elem.firstChild ) {
            elem.removeChild( elem.firstChild );
          }
        }

        elem = null;
      }
  
      return $(this);
    };
  
    $.fn.removeChildForce = function(parent) {
      while ( parent.firstChild ) {
        this.removeChildForce( parent.firstChild );
        parent.removeChild( parent.firstChild );
      }
    };

    $.fn.jqplot = function() {
        var datas = [];
        var options = [];
        // see how many data arrays we have
        for (var i=0, l=arguments.length; i<l; i++) {
            if ($.isArray(arguments[i])) {
                datas.push(arguments[i]);
            }
            else if ($.isPlainObject(arguments[i])) {
                options.push(arguments[i]);
            }
        }

        return this.each(function(index) {
            var tid, 
                plot, 
                $this = $(this),
                dl = datas.length,
                ol = options.length,
                data, 
                opts;

            if (index < dl) {
                data = datas[index];
            }
            else {
                data = dl ? datas[dl-1] : null;
            }

            if (index < ol) {
                opts = options[index];
            }
            else {
                opts = ol ? options[ol-1] : null;
            }

            // does el have an id?
            // if not assign it one.
            tid = $this.attr('id');
            if (tid === undefined) {
                tid = 'jqplot_target_' + $.jqplot.targetCounter++;
                $this.attr('id', tid);
            }

            plot = $.jqplot(tid, data, opts);

            $this.data('jqplot', plot);
        });
    };


    /**
     * Namespace: $.jqplot
     * jQuery function called by the user to create a plot.
     *  
     * Parameters:
     * target - ID of target element to render the plot into.
     * data - an array of data series.
     * options - user defined options object.  See the individual classes for available options.
     * 
     * Properties:
     * config - object to hold configuration information for jqPlot plot object.
     * 
     * attributes:
     * enablePlugins - False to disable plugins by default.  Plugins must then be explicitly 
     *   enabled in the individual plot options.  Default: false.
     *   This property sets the "show" property of certain plugins to true or false.
     *   Only plugins that can be immediately active upon loading are affected.  This includes
     *   non-renderer plugins like cursor, dragable, highlighter, and trendline.
     * defaultHeight - Default height for plots where no css height specification exists.  This
     *   is a jqplot wide default.
     * defaultWidth - Default height for plots where no css height specification exists.  This
     *   is a jqplot wide default.
     */

    $.jqplot = function(target, data, options) {
        var _data = null, _options = null;

        if (arguments.length === 3) {
            _data = data;
            _options = options;
        }

        else if (arguments.length === 2) {
            if ($.isArray(data)) {
                _data = data;
            }

            else if ($.isPlainObject(data)) {
                _options = data;
            }
        }

        if (_data === null && _options !== null && _options.data) {
            _data = _options.data;
        }

        var plot = new jqPlot();
        // remove any error class that may be stuck on target.
        $('#'+target).removeClass('jqplot-error');
        
        if ($.jqplot.config.catchErrors) {
            try {
                plot.init(target, _data, _options);
                plot.draw();
                plot.themeEngine.init.call(plot);
                return plot;
            }
            catch(e) {
                var msg = $.jqplot.config.errorMessage || e.message;
                $('#'+target).append('<div class="jqplot-error-message">'+msg+'</div>');
                $('#'+target).addClass('jqplot-error');
                document.getElementById(target).style.background = $.jqplot.config.errorBackground;
                document.getElementById(target).style.border = $.jqplot.config.errorBorder;
                document.getElementById(target).style.fontFamily = $.jqplot.config.errorFontFamily;
                document.getElementById(target).style.fontSize = $.jqplot.config.errorFontSize;
                document.getElementById(target).style.fontStyle = $.jqplot.config.errorFontStyle;
                document.getElementById(target).style.fontWeight = $.jqplot.config.errorFontWeight;
            }
        }
        else {        
            plot.init(target, _data, _options);
            plot.draw();
            plot.themeEngine.init.call(plot);
            return plot;
        }
    };

    $.jqplot.version = "1.0.8";
    $.jqplot.revision = "1250";

    $.jqplot.targetCounter = 1;

    // canvas manager to reuse canvases on the plot.
    // Should help solve problem of canvases not being freed and
    // problem of waiting forever for firefox to decide to free memory.
    $.jqplot.CanvasManager = function() {
        // canvases are managed globally so that they can be reused
        // across plots after they have been freed
        if (typeof $.jqplot.CanvasManager.canvases == 'undefined') {
            $.jqplot.CanvasManager.canvases = [];
            $.jqplot.CanvasManager.free = [];
        }
        
        var myCanvases = [];
        
        this.getCanvas = function() {
            var canvas;
            var makeNew = true;
            
            if (!$.jqplot.use_excanvas) {
                for (var i = 0, l = $.jqplot.CanvasManager.canvases.length; i < l; i++) {
                    if ($.jqplot.CanvasManager.free[i] === true) {
                        makeNew = false;
                        canvas = $.jqplot.CanvasManager.canvases[i];
                        // $(canvas).removeClass('jqplot-canvasManager-free').addClass('jqplot-canvasManager-inuse');
                        $.jqplot.CanvasManager.free[i] = false;
                        myCanvases.push(i);
                        break;
                    }
                }
            }

            if (makeNew) {
                canvas = document.createElement('canvas');
                myCanvases.push($.jqplot.CanvasManager.canvases.length);
                $.jqplot.CanvasManager.canvases.push(canvas);
                $.jqplot.CanvasManager.free.push(false);
            }   
            
            return canvas;
        };
        
        // this method has to be used after settings the dimesions
        // on the element returned by getCanvas()
        this.initCanvas = function(canvas) {
            if ($.jqplot.use_excanvas) {
                return window.G_vmlCanvasManager.initElement(canvas);
            }
            return canvas;
        };

        this.freeAllCanvases = function() {
            for (var i = 0, l=myCanvases.length; i < l; i++) {
                this.freeCanvas(myCanvases[i]);
            }
            myCanvases = [];
        };

        this.freeCanvas = function(idx) {
            if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
                // excanvas can't be reused, but properly unset
                window.G_vmlCanvasManager.uninitElement($.jqplot.CanvasManager.canvases[idx]);
                $.jqplot.CanvasManager.canvases[idx] = null;
            } 
            else {
                var canvas = $.jqplot.CanvasManager.canvases[idx];
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                $(canvas).unbind().removeAttr('class').removeAttr('style');
                // Style attributes seemed to be still hanging around.  wierd.  Some ticks
                // still retained a left: 0px attribute after reusing a canvas.
                $(canvas).css({left: '', top: '', position: ''});
                // setting size to 0 may save memory of unused canvases?
                canvas.width = 0;
                canvas.height = 0;
                $.jqplot.CanvasManager.free[idx] = true;
            }
        };
        
    };

            
    // Convienence function that won't hang IE or FF without FireBug.
    $.jqplot.log = function() {
        if (window.console) {
            window.console.log.apply(window.console, arguments);
        }
    };
        
    $.jqplot.config = {
        addDomReference: false,
        enablePlugins:false,
        defaultHeight:300,
        defaultWidth:400,
        UTCAdjust:false,
        timezoneOffset: new Date(new Date().getTimezoneOffset() * 60000),
        errorMessage: '',
        errorBackground: '',
        errorBorder: '',
        errorFontFamily: '',
        errorFontSize: '',
        errorFontStyle: '',
        errorFontWeight: '',
        catchErrors: false,
        defaultTickFormatString: "%.1f",
        defaultColors: [ "#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
        defaultNegativeColors: [ "#498991", "#C08840", "#9F9274", "#546D61", "#646C4A", "#6F6621", "#6E3F5F", "#4F64B0", "#A89050", "#C45923", "#187399", "#945381", "#959E5C", "#C7AF7B", "#478396", "#907294"],
        dashLength: 4,
        gapLength: 4,
        dotGapLength: 2.5,
        srcLocation: 'jqplot/src/',
        pluginLocation: 'jqplot/src/plugins/'
    };
    
    
    $.jqplot.arrayMax = function( array ){
        return Math.max.apply( Math, array );
    };
    
    $.jqplot.arrayMin = function( array ){
        return Math.min.apply( Math, array );
    };
    
    $.jqplot.enablePlugins = $.jqplot.config.enablePlugins;
    
    // canvas related tests taken from modernizer:
    // Copyright (c) 2009 - 2010 Faruk Ates.
    // http://www.modernizr.com
    
    $.jqplot.support_canvas = function() {
        if (typeof $.jqplot.support_canvas.result == 'undefined') {
            $.jqplot.support_canvas.result = !!document.createElement('canvas').getContext; 
        }
        return $.jqplot.support_canvas.result;
    };
            
    $.jqplot.support_canvas_text = function() {
        if (typeof $.jqplot.support_canvas_text.result == 'undefined') {
            if (window.G_vmlCanvasManager !== undefined && window.G_vmlCanvasManager._version > 887) {
                $.jqplot.support_canvas_text.result = true;
            }
            else {
                $.jqplot.support_canvas_text.result = !!(document.createElement('canvas').getContext && typeof document.createElement('canvas').getContext('2d').fillText == 'function');
            }
             
        }
        return $.jqplot.support_canvas_text.result;
    };
    
    $.jqplot.use_excanvas = ((!$.support.boxModel || !$.support.objectAll || !$support.leadingWhitespace) && !$.jqplot.support_canvas()) ? true : false;
    
    /**
     * 
     * Hooks: jqPlot Pugin Hooks
     * 
     * $.jqplot.preInitHooks - called before initialization.
     * $.jqplot.postInitHooks - called after initialization.
     * $.jqplot.preParseOptionsHooks - called before user options are parsed.
     * $.jqplot.postParseOptionsHooks - called after user options are parsed.
     * $.jqplot.preDrawHooks - called before plot draw.
     * $.jqplot.postDrawHooks - called after plot draw.
     * $.jqplot.preDrawSeriesHooks - called before each series is drawn.
     * $.jqplot.postDrawSeriesHooks - called after each series is drawn.
     * $.jqplot.preDrawLegendHooks - called before the legend is drawn.
     * $.jqplot.addLegendRowHooks - called at the end of legend draw, so plugins
     *     can add rows to the legend table.
     * $.jqplot.preSeriesInitHooks - called before series is initialized.
     * $.jqplot.postSeriesInitHooks - called after series is initialized.
     * $.jqplot.preParseSeriesOptionsHooks - called before series related options
     *     are parsed.
     * $.jqplot.postParseSeriesOptionsHooks - called after series related options
     *     are parsed.
     * $.jqplot.eventListenerHooks - called at the end of plot drawing, binds
     *     listeners to the event canvas which lays on top of the grid area.
     * $.jqplot.preDrawSeriesShadowHooks - called before series shadows are drawn.
     * $.jqplot.postDrawSeriesShadowHooks - called after series shadows are drawn.
     * 
     */
    
    $.jqplot.preInitHooks = [];
    $.jqplot.postInitHooks = [];
    $.jqplot.preParseOptionsHooks = [];
    $.jqplot.postParseOptionsHooks = [];
    $.jqplot.preDrawHooks = [];
    $.jqplot.postDrawHooks = [];
    $.jqplot.preDrawSeriesHooks = [];
    $.jqplot.postDrawSeriesHooks = [];
    $.jqplot.preDrawLegendHooks = [];
    $.jqplot.addLegendRowHooks = [];
    $.jqplot.preSeriesInitHooks = [];
    $.jqplot.postSeriesInitHooks = [];
    $.jqplot.preParseSeriesOptionsHooks = [];
    $.jqplot.postParseSeriesOptionsHooks = [];
    $.jqplot.eventListenerHooks = [];
    $.jqplot.preDrawSeriesShadowHooks = [];
    $.jqplot.postDrawSeriesShadowHooks = [];

    // A superclass holding some common properties and methods.
    $.jqplot.ElemContainer = function() {
        this._elem;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
    };
    
    $.jqplot.ElemContainer.prototype.createElement = function(el, offsets, clss, cssopts, attrib) {
        this._offsets = offsets;
        var klass = clss || 'jqplot';
        var elem = document.createElement(el);
        this._elem = $(elem);
        this._elem.addClass(klass);
        this._elem.css(cssopts);
        this._elem.attr(attrib);
        // avoid memory leak;
        elem = null;
        return this._elem;
    };
    
    $.jqplot.ElemContainer.prototype.getWidth = function() {
        if (this._elem) {
            return this._elem.outerWidth(true);
        }
        else {
            return null;
        }
    };
    
    $.jqplot.ElemContainer.prototype.getHeight = function() {
        if (this._elem) {
            return this._elem.outerHeight(true);
        }
        else {
            return null;
        }
    };
    
    $.jqplot.ElemContainer.prototype.getPosition = function() {
        if (this._elem) {
            return this._elem.position();
        }
        else {
            return {top:null, left:null, bottom:null, right:null};
        }
    };
    
    $.jqplot.ElemContainer.prototype.getTop = function() {
        return this.getPosition().top;
    };
    
    $.jqplot.ElemContainer.prototype.getLeft = function() {
        return this.getPosition().left;
    };
    
    $.jqplot.ElemContainer.prototype.getBottom = function() {
        return this._elem.css('bottom');
    };
    
    $.jqplot.ElemContainer.prototype.getRight = function() {
        return this._elem.css('right');
    };
    

    /**
     * Class: Axis
     * An individual axis object.  Cannot be instantiated directly, but created
     * by the Plot object.  Axis properties can be set or overridden by the 
     * options passed in from the user.
     * 
     */
    function Axis(name) {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        //
        // Axes options are specified within an axes object at the top level of the 
        // plot options like so:
        // > {
        // >    axes: {
        // >        xaxis: {min: 5},
        // >        yaxis: {min: 2, max: 8, numberTicks:4},
        // >        x2axis: {pad: 1.5},
        // >        y2axis: {ticks:[22, 44, 66, 88]}
        // >        }
        // > }
        // There are 2 x axes, 'xaxis' and 'x2axis', and 
        // 9 yaxes, 'yaxis', 'y2axis'. 'y3axis', ...  Any or all of which may be specified.
        this.name = name;
        this._series = [];
        // prop: show
        // Wether to display the axis on the graph.
        this.show = false;
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        this.tickRenderer = $.jqplot.AxisTickRenderer;
        // prop: tickOptions
        // Options that will be passed to the tickRenderer, see <$.jqplot.AxisTickRenderer> options.
        this.tickOptions = {};
        // prop: labelRenderer
        // A class of a rendering engine for creating an axis label.
        this.labelRenderer = $.jqplot.AxisLabelRenderer;
        // prop: labelOptions
        // Options passed to the label renderer.
        this.labelOptions = {};
        // prop: label
        // Label for the axis
        this.label = null;
        // prop: showLabel
        // true to show the axis label.
        this.showLabel = true;
        // prop: min
        // minimum value of the axis (in data units, not pixels).
        this.min = null;
        // prop: max
        // maximum value of the axis (in data units, not pixels).
        this.max = null;
        // prop: autoscale
        // DEPRECATED
        // the default scaling algorithm produces superior results.
        this.autoscale = false;
        // prop: pad
        // Padding to extend the range above and below the data bounds.
        // The data range is multiplied by this factor to determine minimum and maximum axis bounds.
        // A value of 0 will be interpreted to mean no padding, and pad will be set to 1.0.
        this.pad = 1.2;
        // prop: padMax
        // Padding to extend the range above data bounds.
        // The top of the data range is multiplied by this factor to determine maximum axis bounds.
        // A value of 0 will be interpreted to mean no padding, and padMax will be set to 1.0.
        this.padMax = null;
        // prop: padMin
        // Padding to extend the range below data bounds.
        // The bottom of the data range is multiplied by this factor to determine minimum axis bounds.
        // A value of 0 will be interpreted to mean no padding, and padMin will be set to 1.0.
        this.padMin = null;
        // prop: ticks
        // 1D [val, val, ...] or 2D [[val, label], [val, label], ...] array of ticks for the axis.
        // If no label is specified, the value is formatted into an appropriate label.
        this.ticks = [];
        // prop: numberTicks
        // Desired number of ticks.  Default is to compute automatically.
        this.numberTicks;
        // prop: tickInterval
        // number of units between ticks.  Mutually exclusive with numberTicks.
        this.tickInterval;
        // prop: renderer
        // A class of a rendering engine that handles tick generation, 
        // scaling input data to pixel grid units and drawing the axis element.
        this.renderer = $.jqplot.LinearAxisRenderer;
        // prop: rendererOptions
        // renderer specific options.  See <$.jqplot.LinearAxisRenderer> for options.
        this.rendererOptions = {};
        // prop: showTicks
        // Wether to show the ticks (both marks and labels) or not.
        // Will not override showMark and showLabel options if specified on the ticks themselves.
        this.showTicks = true;
        // prop: showTickMarks
        // Wether to show the tick marks (line crossing grid) or not.
        // Overridden by showTicks and showMark option of tick itself.
        this.showTickMarks = true;
        // prop: showMinorTicks
        // Wether or not to show minor ticks.  This is renderer dependent.
        this.showMinorTicks = true;
        // prop: drawMajorGridlines
        // True to draw gridlines for major axis ticks.
        this.drawMajorGridlines = true;
        // prop: drawMinorGridlines
        // True to draw gridlines for minor ticks.
        this.drawMinorGridlines = false;
        // prop: drawMajorTickMarks
        // True to draw tick marks for major axis ticks.
        this.drawMajorTickMarks = true;
        // prop: drawMinorTickMarks
        // True to draw tick marks for minor ticks.  This is renderer dependent.
        this.drawMinorTickMarks = true;
        // prop: useSeriesColor
        // Use the color of the first series associated with this axis for the
        // tick marks and line bordering this axis.
        this.useSeriesColor = false;
        // prop: borderWidth
        // width of line stroked at the border of the axis.  Defaults
        // to the width of the grid boarder.
        this.borderWidth = null;
        // prop: borderColor
        // color of the border adjacent to the axis.  Defaults to grid border color.
        this.borderColor = null;
        // prop: scaleToHiddenSeries
        // True to include hidden series when computing axes bounds and scaling.
        this.scaleToHiddenSeries = false;
        // minimum and maximum values on the axis.
        this._dataBounds = {min:null, max:null};
        // statistics (min, max, mean) as well as actual data intervals for each series attached to axis.
        // holds collection of {intervals:[], min:, max:, mean: } objects for each series on axis.
        this._intervalStats = [];
        // pixel position from the top left of the min value and max value on the axis.
        this._offsets = {min:null, max:null};
        this._ticks=[];
        this._label = null;
        // prop: syncTicks
        // true to try and synchronize tick spacing across multiple axes so that ticks and
        // grid lines line up.  This has an impact on autoscaling algorithm, however.
        // In general, autoscaling an individual axis will work better if it does not
        // have to sync ticks.
        this.syncTicks = null;
        // prop: tickSpacing
        // Approximate pixel spacing between ticks on graph.  Used during autoscaling.
        // This number will be an upper bound, actual spacing will be less.
        this.tickSpacing = 75;
        // Properties to hold the original values for min, max, ticks, tickInterval and numberTicks
        // so they can be restored if altered by plugins.
        this._min = null;
        this._max = null;
        this._tickInterval = null;
        this._numberTicks = null;
        this.__ticks = null;
        // hold original user options.
        this._options = {};
    }
    
    Axis.prototype = new $.jqplot.ElemContainer();
    Axis.prototype.constructor = Axis;
    
    Axis.prototype.init = function() {
        if ($.isFunction(this.renderer)) {
            this.renderer = new this.renderer();  
        }
        // set the axis name
        this.tickOptions.axis = this.name;
        // if showMark or showLabel tick options not specified, use value of axis option.
        // showTicks overrides showTickMarks.
        if (this.tickOptions.showMark == null) {
            this.tickOptions.showMark = this.showTicks;
        }
        if (this.tickOptions.showMark == null) {
            this.tickOptions.showMark = this.showTickMarks;
        }
        if (this.tickOptions.showLabel == null) {
            this.tickOptions.showLabel = this.showTicks;
        }
        
        if (this.label == null || this.label == '') {
            this.showLabel = false;
        }
        else {
            this.labelOptions.label = this.label;
        }
        if (this.showLabel == false) {
            this.labelOptions.show = false;
        }
        // set the default padMax, padMin if not specified
        // special check, if no padding desired, padding
        // should be set to 1.0
        if (this.pad == 0) {
            this.pad = 1.0;
        }
        if (this.padMax == 0) {
            this.padMax = 1.0;
        }
        if (this.padMin == 0) {
            this.padMin = 1.0;
        }
        if (this.padMax == null) {
            this.padMax = (this.pad-1)/2 + 1;
        }
        if (this.padMin == null) {
            this.padMin = (this.pad-1)/2 + 1;
        }
        // now that padMin and padMax are correctly set, reset pad in case user has supplied 
        // padMin and/or padMax
        this.pad = this.padMax + this.padMin - 1;
        if (this.min != null || this.max != null) {
            this.autoscale = false;
        }
        // if not set, sync ticks for y axes but not x by default.
        if (this.syncTicks == null && this.name.indexOf('y') > -1) {
            this.syncTicks = true;
        }
        else if (this.syncTicks == null){
            this.syncTicks = false;
        }
        this.renderer.init.call(this, this.rendererOptions);
        
    };
    
    Axis.prototype.draw = function(ctx, plot) {
        // Memory Leaks patch
        if (this.__ticks) {
          this.__ticks = null;
        }

        return this.renderer.draw.call(this, ctx, plot);
        
    };
    
    Axis.prototype.set = function() {
        this.renderer.set.call(this);
    };
    
    Axis.prototype.pack = function(pos, offsets) {
        if (this.show) {
            this.renderer.pack.call(this, pos, offsets);
        }
        // these properties should all be available now.
        if (this._min == null) {
            this._min = this.min;
            this._max = this.max;
            this._tickInterval = this.tickInterval;
            this._numberTicks = this.numberTicks;
            this.__ticks = this._ticks;
        }
    };
    
    // reset the axis back to original values if it has been scaled, zoomed, etc.
    Axis.prototype.reset = function() {
        this.renderer.reset.call(this);
    };
    
    Axis.prototype.resetScale = function(opts) {
        $.extend(true, this, {min: null, max: null, numberTicks: null, tickInterval: null, _ticks: [], ticks: []}, opts);
        this.resetDataBounds();
    };
    
    Axis.prototype.resetDataBounds = function() {
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        var db = this._dataBounds;
        db.min = null;
        db.max = null;
        var l, s, d;
        // check for when to force min 0 on bar series plots.
        var doforce = (this.show) ? true : false;
        for (var i=0; i<this._series.length; i++) {
            s = this._series[i];
            if (s.show || this.scaleToHiddenSeries) {
                d = s._plotData;
                if (s._type === 'line' && s.renderer.bands.show && this.name.charAt(0) !== 'x') {
                    d = [[0, s.renderer.bands._min], [1, s.renderer.bands._max]];
                }

                var minyidx = 1, maxyidx = 1;

                if (s._type != null && s._type == 'ohlc') {
                    minyidx = 3;
                    maxyidx = 2;
                }
                
                for (var j=0, l=d.length; j<l; j++) { 
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        if ((d[j][0] != null && d[j][0] < db.min) || db.min == null) {
                            db.min = d[j][0];
                        }
                        if ((d[j][0] != null && d[j][0] > db.max) || db.max == null) {
                            db.max = d[j][0];
                        }
                    }              
                    else {
                        if ((d[j][minyidx] != null && d[j][minyidx] < db.min) || db.min == null) {
                            db.min = d[j][minyidx];
                        }
                        if ((d[j][maxyidx] != null && d[j][maxyidx] > db.max) || db.max == null) {
                            db.max = d[j][maxyidx];
                        }
                    }              
                }

                // Hack to not pad out bottom of bar plots unless user has specified a padding.
                // every series will have a chance to set doforce to false.  once it is set to 
                // false, it cannot be reset to true.
                // If any series attached to axis is not a bar, wont force 0.
                if (doforce && s.renderer.constructor !== $.jqplot.BarRenderer) {
                    doforce = false;
                }

                else if (doforce && this._options.hasOwnProperty('forceTickAt0') && this._options.forceTickAt0 == false) {
                    doforce = false;
                }

                else if (doforce && s.renderer.constructor === $.jqplot.BarRenderer) {
                    if (s.barDirection == 'vertical' && this.name != 'xaxis' && this.name != 'x2axis') { 
                        if (this._options.pad != null || this._options.padMin != null) {
                            doforce = false;
                        }
                    }

                    else if (s.barDirection == 'horizontal' && (this.name == 'xaxis' || this.name == 'x2axis')) {
                        if (this._options.pad != null || this._options.padMin != null) {
                            doforce = false;
                        }
                    }

                }
            }
        }

        if (doforce && this.renderer.constructor === $.jqplot.LinearAxisRenderer && db.min >= 0) {
            this.padMin = 1.0;
            this.forceTickAt0 = true;
        }
    };

    /**
     * Class: Legend
     * Legend object.  Cannot be instantiated directly, but created
     * by the Plot object.  Legend properties can be set or overridden by the 
     * options passed in from the user.
     */
    function Legend(options) {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: show
        // Wether to display the legend on the graph.
        this.show = false;
        // prop: location
        // Placement of the legend.  one of the compass directions: nw, n, ne, e, se, s, sw, w
        this.location = 'ne';
        // prop: labels
        // Array of labels to use.  By default the renderer will look for labels on the series.
        // Labels specified in this array will override labels specified on the series.
        this.labels = [];
        // prop: showLabels
        // true to show the label text on the  legend.
        this.showLabels = true;
        // prop: showSwatch
        // true to show the color swatches on the legend.
        this.showSwatches = true;
        // prop: placement
        // "insideGrid" places legend inside the grid area of the plot.
        // "outsideGrid" places the legend outside the grid but inside the plot container, 
        // shrinking the grid to accomodate the legend.
        // "inside" synonym for "insideGrid", 
        // "outside" places the legend ouside the grid area, but does not shrink the grid which
        // can cause the legend to overflow the plot container.
        this.placement = "insideGrid";
        // prop: xoffset
        // DEPRECATED.  Set the margins on the legend using the marginTop, marginLeft, etc. 
        // properties or via CSS margin styling of the .jqplot-table-legend class.
        this.xoffset = 0;
        // prop: yoffset
        // DEPRECATED.  Set the margins on the legend using the marginTop, marginLeft, etc. 
        // properties or via CSS margin styling of the .jqplot-table-legend class.
        this.yoffset = 0;
        // prop: border
        // css spec for the border around the legend box.
        this.border;
        // prop: background
        // css spec for the background of the legend box.
        this.background;
        // prop: textColor
        // css color spec for the legend text.
        this.textColor;
        // prop: fontFamily
        // css font-family spec for the legend text.
        this.fontFamily; 
        // prop: fontSize
        // css font-size spec for the legend text.
        this.fontSize ;
        // prop: rowSpacing
        // css padding-top spec for the rows in the legend.
        this.rowSpacing = '0.5em';
        // renderer
        // A class that will create a DOM object for the legend,
        // see <$.jqplot.TableLegendRenderer>.
        this.renderer = $.jqplot.TableLegendRenderer;
        // prop: rendererOptions
        // renderer specific options passed to the renderer.
        this.rendererOptions = {};
        // prop: predraw
        // Wether to draw the legend before the series or not.
        // Used with series specific legend renderers for pie, donut, mekko charts, etc.
        this.preDraw = false;
        // prop: marginTop
        // CSS margin for the legend DOM element. This will set an element 
        // CSS style for the margin which will override any style sheet setting.
        // The default will be taken from the stylesheet.
        this.marginTop = null;
        // prop: marginRight
        // CSS margin for the legend DOM element. This will set an element 
        // CSS style for the margin which will override any style sheet setting.
        // The default will be taken from the stylesheet.
        this.marginRight = null;
        // prop: marginBottom
        // CSS margin for the legend DOM element. This will set an element 
        // CSS style for the margin which will override any style sheet setting.
        // The default will be taken from the stylesheet.
        this.marginBottom = null;
        // prop: marginLeft
        // CSS margin for the legend DOM element. This will set an element 
        // CSS style for the margin which will override any style sheet setting.
        // The default will be taken from the stylesheet.
        this.marginLeft = null;
        // prop: escapeHtml
        // True to escape special characters with their html entity equivalents
        // in legend text.  "<" becomes &lt; and so on, so html tags are not rendered.
        this.escapeHtml = false;
        this._series = [];
        
        $.extend(true, this, options);
    }
    
    Legend.prototype = new $.jqplot.ElemContainer();
    Legend.prototype.constructor = Legend;
    
    Legend.prototype.setOptions = function(options) {
        $.extend(true, this, options);
        
        // Try to emulate deprecated behaviour
        // if user has specified xoffset or yoffset, copy these to
        // the margin properties.
        
        if (this.placement ==  'inside') {
            this.placement = 'insideGrid';
        }
        
        if (this.xoffset >0) {
            if (this.placement == 'insideGrid') {
                switch (this.location) {
                    case 'nw':
                    case 'w':
                    case 'sw':
                        if (this.marginLeft == null) {
                            this.marginLeft = this.xoffset + 'px';
                        }
                        this.marginRight = '0px';
                        break;
                    case 'ne':
                    case 'e':
                    case 'se':
                    default:
                        if (this.marginRight == null) {
                            this.marginRight = this.xoffset + 'px';
                        }
                        this.marginLeft = '0px';
                        break;
                }
            }
            else if (this.placement == 'outside') {
                switch (this.location) {
                    case 'nw':
                    case 'w':
                    case 'sw':
                        if (this.marginRight == null) {
                            this.marginRight = this.xoffset + 'px';
                        }
                        this.marginLeft = '0px';
                        break;
                    case 'ne':
                    case 'e':
                    case 'se':
                    default:
                        if (this.marginLeft == null) {
                            this.marginLeft = this.xoffset + 'px';
                        }
                        this.marginRight = '0px';
                        break;
                }
            }
            this.xoffset = 0;
        }
        
        if (this.yoffset >0) {
            if (this.placement == 'outside') {
                switch (this.location) {
                    case 'sw':
                    case 's':
                    case 'se':
                        if (this.marginTop == null) {
                            this.marginTop = this.yoffset + 'px';
                        }
                        this.marginBottom = '0px';
                        break;
                    case 'ne':
                    case 'n':
                    case 'nw':
                    default:
                        if (this.marginBottom == null) {
                            this.marginBottom = this.yoffset + 'px';
                        }
                        this.marginTop = '0px';
                        break;
                }
            }
            else if (this.placement == 'insideGrid') {
                switch (this.location) {
                    case 'sw':
                    case 's':
                    case 'se':
                        if (this.marginBottom == null) {
                            this.marginBottom = this.yoffset + 'px';
                        }
                        this.marginTop = '0px';
                        break;
                    case 'ne':
                    case 'n':
                    case 'nw':
                    default:
                        if (this.marginTop == null) {
                            this.marginTop = this.yoffset + 'px';
                        }
                        this.marginBottom = '0px';
                        break;
                }
            }
            this.yoffset = 0;
        }
        
        // TO-DO:
        // Handle case where offsets are < 0.
        //
    };
    
    Legend.prototype.init = function() {
        if ($.isFunction(this.renderer)) {
            this.renderer = new this.renderer();  
        }
        this.renderer.init.call(this, this.rendererOptions);
    };
    
    Legend.prototype.draw = function(offsets, plot) {
        for (var i=0; i<$.jqplot.preDrawLegendHooks.length; i++){
            $.jqplot.preDrawLegendHooks[i].call(this, offsets);
        }
        return this.renderer.draw.call(this, offsets, plot);
    };
    
    Legend.prototype.pack = function(offsets) {
        this.renderer.pack.call(this, offsets);
    };

    /**
     * Class: Title
     * Plot Title object.  Cannot be instantiated directly, but created
     * by the Plot object.  Title properties can be set or overridden by the 
     * options passed in from the user.
     * 
     * Parameters:
     * text - text of the title.
     */
    function Title(text) {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: text
        // text of the title;
        this.text = text;
        // prop: show
        // whether or not to show the title
        this.show = true;
        // prop: fontFamily
        // css font-family spec for the text.
        this.fontFamily;
        // prop: fontSize
        // css font-size spec for the text.
        this.fontSize ;
        // prop: textAlign
        // css text-align spec for the text.
        this.textAlign;
        // prop: textColor
        // css color spec for the text.
        this.textColor;
        // prop: renderer
        // A class for creating a DOM element for the title,
        // see <$.jqplot.DivTitleRenderer>.
        this.renderer = $.jqplot.DivTitleRenderer;
        // prop: rendererOptions
        // renderer specific options passed to the renderer.
        this.rendererOptions = {};   
        // prop: escapeHtml
        // True to escape special characters with their html entity equivalents
        // in title text.  "<" becomes &lt; and so on, so html tags are not rendered.
        this.escapeHtml = false;
    }
    
    Title.prototype = new $.jqplot.ElemContainer();
    Title.prototype.constructor = Title;
    
    Title.prototype.init = function() {
        if ($.isFunction(this.renderer)) {
            this.renderer = new this.renderer();  
        }
        this.renderer.init.call(this, this.rendererOptions);
    };
    
    Title.prototype.draw = function(width) {
        return this.renderer.draw.call(this, width);
    };
    
    Title.prototype.pack = function() {
        this.renderer.pack.call(this);
    };


    /**
     * Class: Series
     * An individual data series object.  Cannot be instantiated directly, but created
     * by the Plot object.  Series properties can be set or overridden by the 
     * options passed in from the user.
     */
    function Series(options) {
        options = options || {};
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        // Properties will be assigned from a series array at the top level of the
        // options.  If you had two series and wanted to change the color and line
        // width of the first and set the second to use the secondary y axis with
        // no shadow and supply custom labels for each:
        // > {
        // >    series:[
        // >        {color: '#ff4466', lineWidth: 5, label:'good line'},
        // >        {yaxis: 'y2axis', shadow: false, label:'bad line'}
        // >    ]
        // > }

        // prop: show
        // whether or not to draw the series.
        this.show = true;
        // prop: xaxis
        // which x axis to use with this series, either 'xaxis' or 'x2axis'.
        this.xaxis = 'xaxis';
        this._xaxis;
        // prop: yaxis
        // which y axis to use with this series, either 'yaxis' or 'y2axis'.
        this.yaxis = 'yaxis';
        this._yaxis;
        this.gridBorderWidth = 2.0;
        // prop: renderer
        // A class of a renderer which will draw the series, 
        // see <$.jqplot.LineRenderer>.
        this.renderer = $.jqplot.LineRenderer;
        // prop: rendererOptions
        // Options to pass on to the renderer.
        this.rendererOptions = {};
        this.data = [];
        this.gridData = [];
        // prop: label
        // Line label to use in the legend.
        this.label = '';
        // prop: showLabel
        // true to show label for this series in the legend.
        this.showLabel = true;
        // prop: color
        // css color spec for the series
        this.color;
        // prop: negativeColor
        // css color spec used for filled (area) plots that are filled to zero and
        // the "useNegativeColors" option is true.
        this.negativeColor;
        // prop: lineWidth
        // width of the line in pixels.  May have different meanings depending on renderer.
        this.lineWidth = 2.5;
        // prop: lineJoin
        // Canvas lineJoin style between segments of series.
        this.lineJoin = 'round';
        // prop: lineCap
        // Canvas lineCap style at ends of line.
        this.lineCap = 'round';
        // prop: linePattern
        // line pattern 'dashed', 'dotted', 'solid', some combination
        // of '-' and '.' characters such as '.-.' or a numerical array like 
        // [draw, skip, draw, skip, ...] such as [1, 10] to draw a dotted line, 
        // [1, 10, 20, 10] to draw a dot-dash line, and so on.
        this.linePattern = 'solid';
        this.shadow = true;
        // prop: shadowAngle
        // Shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Shadow offset from line in pixels
        this.shadowOffset = 1.25;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.1';
        // prop: breakOnNull
        // Wether line segments should be be broken at null value.
        // False will join point on either side of line.
        this.breakOnNull = false;
        // prop: markerRenderer
        // A class of a renderer which will draw marker (e.g. circle, square, ...) at the data points,
        // see <$.jqplot.MarkerRenderer>.
        this.markerRenderer = $.jqplot.MarkerRenderer;
        // prop: markerOptions
        // renderer specific options to pass to the markerRenderer,
        // see <$.jqplot.MarkerRenderer>.
        this.markerOptions = {};
        // prop: showLine
        // whether to actually draw the line or not.  Series will still be renderered, even if no line is drawn.
        this.showLine = true;
        // prop: showMarker
        // whether or not to show the markers at the data points.
        this.showMarker = true;
        // prop: index
        // 0 based index of this series in the plot series array.
        this.index;
        // prop: fill
        // true or false, whether to fill under lines or in bars.
        // May not be implemented in all renderers.
        this.fill = false;
        // prop: fillColor
        // CSS color spec to use for fill under line.  Defaults to line color.
        this.fillColor;
        // prop: fillAlpha
        // Alpha transparency to apply to the fill under the line.
        // Use this to adjust alpha separate from fill color.
        this.fillAlpha;
        // prop: fillAndStroke
        // If true will stroke the line (with color this.color) as well as fill under it.
        // Applies only when fill is true.
        this.fillAndStroke = false;
        // prop: disableStack
        // true to not stack this series with other series in the plot.
        // To render properly, non-stacked series must come after any stacked series
        // in the plot's data series array.  So, the plot's data series array would look like:
        // > [stackedSeries1, stackedSeries2, ..., nonStackedSeries1, nonStackedSeries2, ...]
        // disableStack will put a gap in the stacking order of series, and subsequent
        // stacked series will not fill down through the non-stacked series and will
        // most likely not stack properly on top of the non-stacked series.
        this.disableStack = false;
        // _stack is set by the Plot if the plot is a stacked chart.
        // will stack lines or bars on top of one another to build a "mountain" style chart.
        // May not be implemented in all renderers.
        this._stack = false;
        // prop: neighborThreshold
        // how close or far (in pixels) the cursor must be from a point marker to detect the point.
        this.neighborThreshold = 4;
        // prop: fillToZero
        // true will force bar and filled series to fill toward zero on the fill Axis.
        this.fillToZero = false;
        // prop: fillToValue
        // fill a filled series to this value on the fill axis.
        // Works in conjunction with fillToZero, so that must be true.
        this.fillToValue = 0;
        // prop: fillAxis
        // Either 'x' or 'y'.  Which axis to fill the line toward if fillToZero is true.
        // 'y' means fill up/down to 0 on the y axis for this series.
        this.fillAxis = 'y';
        // prop: useNegativeColors
        // true to color negative values differently in filled and bar charts.
        this.useNegativeColors = true;
        this._stackData = [];
        // _plotData accounts for stacking.  If plots not stacked, _plotData and data are same.  If
        // stacked, _plotData is accumulation of stacking data.
        this._plotData = [];
        // _plotValues hold the individual x and y values that will be plotted for this series.
        this._plotValues = {x:[], y:[]};
        // statistics about the intervals between data points.  Used for auto scaling.
        this._intervals = {x:{}, y:{}};
        // data from the previous series, for stacked charts.
        this._prevPlotData = [];
        this._prevGridData = [];
        this._stackAxis = 'y';
        this._primaryAxis = '_xaxis';
        // give each series a canvas to draw on.  This should allow for redrawing speedups.
        this.canvas = new $.jqplot.GenericCanvas();
        this.shadowCanvas = new $.jqplot.GenericCanvas();
        this.plugins = {};
        // sum of y values in this series.
        this._sumy = 0;
        this._sumx = 0;
        this._type = '';
    }
    
    Series.prototype = new $.jqplot.ElemContainer();
    Series.prototype.constructor = Series;
    
    Series.prototype.init = function(index, gridbw, plot) {
        // weed out any null values in the data.
        this.index = index;
        this.gridBorderWidth = gridbw;
        var d = this.data;
        var temp = [], i, l;
        for (i=0, l=d.length; i<l; i++) {
            if (! this.breakOnNull) {
                if (d[i] == null || d[i][0] == null || d[i][1] == null) {
                    continue;
                }
                else {
                    temp.push(d[i]);
                }
            }
            else {
                // TODO: figure out what to do with null values
                // probably involve keeping nulls in data array
                // and then updating renderers to break line
                // when it hits null value.
                // For now, just keep value.
                temp.push(d[i]);
            }
        }
        this.data = temp;

        // parse the renderer options and apply default colors if not provided
        // Set color even if not shown, so series don't change colors when other
        // series on plot shown/hidden.
        if (!this.color) {
            this.color = plot.colorGenerator.get(this.index);
        }
        if (!this.negativeColor) {
            this.negativeColor = plot.negativeColorGenerator.get(this.index);
        }


        if (!this.fillColor) {
            this.fillColor = this.color;
        }
        if (this.fillAlpha) {
            var comp = $.jqplot.normalize2rgb(this.fillColor);
            var comp = $.jqplot.getColorComponents(comp);
            this.fillColor = 'rgba('+comp[0]+','+comp[1]+','+comp[2]+','+this.fillAlpha+')';
        }
        if ($.isFunction(this.renderer)) {
            this.renderer = new this.renderer();  
        }
        this.renderer.init.call(this, this.rendererOptions, plot);
        this.markerRenderer = new this.markerRenderer();
        if (!this.markerOptions.color) {
            this.markerOptions.color = this.color;
        }
        if (this.markerOptions.show == null) {
            this.markerOptions.show = this.showMarker;
        }
        this.showMarker = this.markerOptions.show;
        // the markerRenderer is called within its own scope, don't want to overwrite series options!!
        this.markerRenderer.init(this.markerOptions);
    };
    
    // data - optional data point array to draw using this series renderer
    // gridData - optional grid data point array to draw using this series renderer
    // stackData - array of cumulative data for stacked plots.
    Series.prototype.draw = function(sctx, opts, plot) {
        var options = (opts == undefined) ? {} : opts;
        sctx = (sctx == undefined) ? this.canvas._ctx : sctx;
        
        var j, data, gridData;
        
        // hooks get called even if series not shown
        // we don't clear canvas here, it would wipe out all other series as well.
        for (j=0; j<$.jqplot.preDrawSeriesHooks.length; j++) {
            $.jqplot.preDrawSeriesHooks[j].call(this, sctx, options);
        }
        if (this.show) {
            this.renderer.setGridData.call(this, plot);
            if (!options.preventJqPlotSeriesDrawTrigger) {
                $(sctx.canvas).trigger('jqplotSeriesDraw', [this.data, this.gridData]);
            }
            data = [];
            if (options.data) {
                data = options.data;
            }
            else if (!this._stack) {
                data = this.data;
            }
            else {
                data = this._plotData;
            }
            gridData = options.gridData || this.renderer.makeGridData.call(this, data, plot);

            if (this._type === 'line' && this.renderer.smooth && this.renderer._smoothedData.length) {
                gridData = this.renderer._smoothedData;
            }

            this.renderer.draw.call(this, sctx, gridData, options, plot);
        }
        
        for (j=0; j<$.jqplot.postDrawSeriesHooks.length; j++) {
            $.jqplot.postDrawSeriesHooks[j].call(this, sctx, options, plot);
        }
        
        sctx = opts = plot = j = data = gridData = null;
    };
    
    Series.prototype.drawShadow = function(sctx, opts, plot) {
        var options = (opts == undefined) ? {} : opts;
        sctx = (sctx == undefined) ? this.shadowCanvas._ctx : sctx;
        
        var j, data, gridData;
        
        // hooks get called even if series not shown
        // we don't clear canvas here, it would wipe out all other series as well.
        for (j=0; j<$.jqplot.preDrawSeriesShadowHooks.length; j++) {
            $.jqplot.preDrawSeriesShadowHooks[j].call(this, sctx, options);
        }
        if (this.shadow) {
            this.renderer.setGridData.call(this, plot);

            data = [];
            if (options.data) {
                data = options.data;
            }
            else if (!this._stack) {
                data = this.data;
            }
            else {
                data = this._plotData;
            }
            gridData = options.gridData || this.renderer.makeGridData.call(this, data, plot);
        
            this.renderer.drawShadow.call(this, sctx, gridData, options, plot);
        }
        
        for (j=0; j<$.jqplot.postDrawSeriesShadowHooks.length; j++) {
            $.jqplot.postDrawSeriesShadowHooks[j].call(this, sctx, options);
        }
        
        sctx = opts = plot = j = data = gridData = null;
        
    };
    
    // toggles series display on plot, e.g. show/hide series
    Series.prototype.toggleDisplay = function(ev, callback) {
        var s, speed;
        if (ev.data.series) {
            s = ev.data.series;
        }
        else {
            s = this;
        }

        if (ev.data.speed) {
            speed = ev.data.speed;
        }
        if (speed) {
            // this can be tricky because series may not have a canvas element if replotting.
            if (s.canvas._elem.is(':hidden') || !s.show) {
                s.show = true;

                s.canvas._elem.removeClass('jqplot-series-hidden');
                if (s.shadowCanvas._elem) {
                    s.shadowCanvas._elem.fadeIn(speed);
                }
                s.canvas._elem.fadeIn(speed, callback);
                s.canvas._elem.nextAll('.jqplot-point-label.jqplot-series-'+s.index).fadeIn(speed);
            }
            else {
                s.show = false;

                s.canvas._elem.addClass('jqplot-series-hidden');
                if (s.shadowCanvas._elem) {
                    s.shadowCanvas._elem.fadeOut(speed);
                }
                s.canvas._elem.fadeOut(speed, callback);
                s.canvas._elem.nextAll('.jqplot-point-label.jqplot-series-'+s.index).fadeOut(speed);
            }
        }
        else {
            // this can be tricky because series may not have a canvas element if replotting.
            if (s.canvas._elem.is(':hidden') || !s.show) {
                s.show = true;

                s.canvas._elem.removeClass('jqplot-series-hidden');
                if (s.shadowCanvas._elem) {
                    s.shadowCanvas._elem.show();
                }
                s.canvas._elem.show(0, callback);
                s.canvas._elem.nextAll('.jqplot-point-label.jqplot-series-'+s.index).show();
            }
            else {
                s.show = false;

                s.canvas._elem.addClass('jqplot-series-hidden');
                if (s.shadowCanvas._elem) {
                    s.shadowCanvas._elem.hide();
                }
                s.canvas._elem.hide(0, callback);
                s.canvas._elem.nextAll('.jqplot-point-label.jqplot-series-'+s.index).hide();
            }
        }
    };
    


    /**
     * Class: Grid
     * 
     * Object representing the grid on which the plot is drawn.  The grid in this
     * context is the area bounded by the axes, the area which will contain the series.
     * Note, the series are drawn on their own canvas.
     * The Grid object cannot be instantiated directly, but is created by the Plot object.  
     * Grid properties can be set or overridden by the options passed in from the user.
     */
    function Grid() {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: drawGridlines
        // whether to draw the gridlines on the plot.
        this.drawGridlines = true;
        // prop: gridLineColor
        // color of the grid lines.
        this.gridLineColor = '#cccccc';
        // prop: gridLineWidth
        // width of the grid lines.
        this.gridLineWidth = 1.0;
        // prop: background
        // css spec for the background color.
        this.background = '#fffdf6';
        // prop: borderColor
        // css spec for the color of the grid border.
        this.borderColor = '#999999';
        // prop: borderWidth
        // width of the border in pixels.
        this.borderWidth = 2.0;
        // prop: drawBorder
        // True to draw border around grid.
        this.drawBorder = true;
        // prop: shadow
        // whether to show a shadow behind the grid.
        this.shadow = true;
        // prop: shadowAngle
        // shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Offset of each shadow stroke from the border in pixels
        this.shadowOffset = 1.5;
        // prop: shadowWidth
        // width of the stoke for the shadow
        this.shadowWidth = 3;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowColor
        // an optional css color spec for the shadow in 'rgba(n, n, n, n)' form
        this.shadowColor = null;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        this._left;
        this._top;
        this._right;
        this._bottom;
        this._width;
        this._height;
        this._axes = [];
        // prop: renderer
        // Instance of a renderer which will actually render the grid,
        // see <$.jqplot.CanvasGridRenderer>.
        this.renderer = $.jqplot.CanvasGridRenderer;
        // prop: rendererOptions
        // Options to pass on to the renderer,
        // see <$.jqplot.CanvasGridRenderer>.
        this.rendererOptions = {};
        this._offsets = {top:null, bottom:null, left:null, right:null};
    }
    
    Grid.prototype = new $.jqplot.ElemContainer();
    Grid.prototype.constructor = Grid;
    
    Grid.prototype.init = function() {
        if ($.isFunction(this.renderer)) {
            this.renderer = new this.renderer();  
        }
        this.renderer.init.call(this, this.rendererOptions);
    };
    
    Grid.prototype.createElement = function(offsets,plot) {
        this._offsets = offsets;
        return this.renderer.createElement.call(this, plot);
    };
    
    Grid.prototype.draw = function() {
        this.renderer.draw.call(this);
    };
    
    $.jqplot.GenericCanvas = function() {
        $.jqplot.ElemContainer.call(this);
        this._ctx;  
    };
    
    $.jqplot.GenericCanvas.prototype = new $.jqplot.ElemContainer();
    $.jqplot.GenericCanvas.prototype.constructor = $.jqplot.GenericCanvas;
    
    $.jqplot.GenericCanvas.prototype.createElement = function(offsets, clss, plotDimensions, plot) {
        this._offsets = offsets;
        var klass = 'jqplot';
        if (clss != undefined) {
            klass = clss;
        }
        var elem;

        elem = plot.canvasManager.getCanvas();
        
        // if new plotDimensions supplied, use them.
        if (plotDimensions != null) {
            this._plotDimensions = plotDimensions;
        }
        
        elem.width = this._plotDimensions.width - this._offsets.left - this._offsets.right;
        elem.height = this._plotDimensions.height - this._offsets.top - this._offsets.bottom;
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', left: this._offsets.left, top: this._offsets.top });
        
        this._elem.addClass(klass);
        
        elem = plot.canvasManager.initCanvas(elem);
        
        elem = null;
        return this._elem;
    };
    
    $.jqplot.GenericCanvas.prototype.setContext = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        return this._ctx;
    };
    
    // Memory Leaks patch
    $.jqplot.GenericCanvas.prototype.resetCanvas = function() {
      if (this._elem) {
        if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
           window.G_vmlCanvasManager.uninitElement(this._elem.get(0));
        }
        
        //this._elem.remove();
        this._elem.emptyForce();
      }
      
      this._ctx = null;
    };
    
    $.jqplot.HooksManager = function () {
        this.hooks =[];
        this.args = [];
    };
    
    $.jqplot.HooksManager.prototype.addOnce = function(fn, args) {
        args = args || [];
        var havehook = false;
        for (var i=0, l=this.hooks.length; i<l; i++) {
            if (this.hooks[i] == fn) {
                havehook = true;
            }
        }
        if (!havehook) {
            this.hooks.push(fn);
            this.args.push(args);
        }
    };
    
    $.jqplot.HooksManager.prototype.add = function(fn, args) {
        args = args || [];
        this.hooks.push(fn);
        this.args.push(args);
    };
    
    $.jqplot.EventListenerManager = function () {
        this.hooks =[];
    };
    
    $.jqplot.EventListenerManager.prototype.addOnce = function(ev, fn) {
        var havehook = false, h, i;
        for (var i=0, l=this.hooks.length; i<l; i++) {
            h = this.hooks[i];
            if (h[0] == ev && h[1] == fn) {
                havehook = true;
            }
        }
        if (!havehook) {
            this.hooks.push([ev, fn]);
        }
    };
    
    $.jqplot.EventListenerManager.prototype.add = function(ev, fn) {
        this.hooks.push([ev, fn]);
    };


    var _axisNames = ['yMidAxis', 'xaxis', 'yaxis', 'x2axis', 'y2axis', 'y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis'];

    /**
     * Class: jqPlot
     * Plot object returned by call to $.jqplot.  Handles parsing user options,
     * creating sub objects (Axes, legend, title, series) and rendering the plot.
     */
    function jqPlot() {
        // Group: Properties
        // These properties are specified at the top of the options object
        // like so:
        // > {
        // >     axesDefaults:{min:0},
        // >     series:[{color:'#6633dd'}],
        // >     title: 'A Plot'
        // > }
        //

        // prop: animate
        // True to animate the series on initial plot draw (renderer dependent).
        // Actual animation functionality must be supported in the renderer.
        this.animate = false;
        // prop: animateReplot
        // True to animate series after a call to the replot() method.
        // Use with caution!  Replots can happen very frequently under
        // certain circumstances (e.g. resizing, dragging points) and
        // animation in these situations can cause problems.
        this.animateReplot = false;
        // prop: axes
        // up to 4 axes are supported, each with its own options, 
        // See <Axis> for axis specific options.
        this.axes = {xaxis: new Axis('xaxis'), yaxis: new Axis('yaxis'), x2axis: new Axis('x2axis'), y2axis: new Axis('y2axis'), y3axis: new Axis('y3axis'), y4axis: new Axis('y4axis'), y5axis: new Axis('y5axis'), y6axis: new Axis('y6axis'), y7axis: new Axis('y7axis'), y8axis: new Axis('y8axis'), y9axis: new Axis('y9axis'), yMidAxis: new Axis('yMidAxis')};
        this.baseCanvas = new $.jqplot.GenericCanvas();
        // true to intercept right click events and fire a 'jqplotRightClick' event.
        // this will also block the context menu.
        this.captureRightClick = false;
        // prop: data
        // user's data.  Data should *NOT* be specified in the options object,
        // but be passed in as the second argument to the $.jqplot() function.
        // The data property is described here soley for reference. 
        // The data should be in the form of an array of 2D or 1D arrays like
        // > [ [[x1, y1], [x2, y2],...], [y1, y2, ...] ].
        this.data = [];
        // prop: dataRenderer
        // A callable which can be used to preprocess data passed into the plot.
        // Will be called with 3 arguments: the plot data, a reference to the plot,
        // and the value of dataRendererOptions.
        this.dataRenderer;
        // prop: dataRendererOptions
        // Options that will be passed to the dataRenderer.
        // Can be of any type.
        this.dataRendererOptions;
        this.defaults = {
            // prop: axesDefaults
            // default options that will be applied to all axes.
            // see <Axis> for axes options.
            axesDefaults: {},
            axes: {xaxis:{}, yaxis:{}, x2axis:{}, y2axis:{}, y3axis:{}, y4axis:{}, y5axis:{}, y6axis:{}, y7axis:{}, y8axis:{}, y9axis:{}, yMidAxis:{}},
            // prop: seriesDefaults
            // default options that will be applied to all series.
            // see <Series> for series options.
            seriesDefaults: {},
            series:[]
        };
        // prop: defaultAxisStart
        // 1-D data series are internally converted into 2-D [x,y] data point arrays
        // by jqPlot.  This is the default starting value for the missing x or y value.
        // The added data will be a monotonically increasing series (e.g. [1, 2, 3, ...])
        // starting at this value.
        this.defaultAxisStart = 1;
        // this.doCustomEventBinding = true;
        // prop: drawIfHidden
        // True to execute the draw method even if the plot target is hidden.
        // Generally, this should be false.  Most plot elements will not be sized/
        // positioned correclty if renderered into a hidden container.  To render into
        // a hidden container, call the replot method when the container is shown.
        this.drawIfHidden = false;
        this.eventCanvas = new $.jqplot.GenericCanvas();
        // prop: fillBetween
        // Fill between 2 line series in a plot.
        // Options object:
        // {
        //    series1: first index (0 based) of series in fill
        //    series2: second index (0 based) of series in fill
        //    color: color of fill [default fillColor of series1]
        //    baseSeries:  fill will be drawn below this series (0 based index)
        //    fill: false to turn off fill [default true].
        //  }
        this.fillBetween = {
            series1: null,
            series2: null,
            color: null,
            baseSeries: 0,
            fill: true
        };
        // prop; fontFamily
        // css spec for the font-family attribute.  Default for the entire plot.
        this.fontFamily;
        // prop: fontSize
        // css spec for the font-size attribute.  Default for the entire plot.
        this.fontSize;
        // prop: grid
        // See <Grid> for grid specific options.
        this.grid = new Grid();
        // prop: legend
        // see <$.jqplot.TableLegendRenderer>
        this.legend = new Legend();
        // prop: noDataIndicator
        // Options to set up a mock plot with a data loading indicator if no data is specified.
        this.noDataIndicator = {    
            show: false,
            indicator: 'Loading Data...',
            axes: {
                xaxis: {
                    min: 0,
                    max: 10,
                    tickInterval: 2,
                    show: true
                },
                yaxis: {
                    min: 0,
                    max: 12,
                    tickInterval: 3,
                    show: true
                }
            }
        };
        // prop: negativeSeriesColors 
        // colors to use for portions of the line below zero.
        this.negativeSeriesColors = $.jqplot.config.defaultNegativeColors;
        // container to hold all of the merged options.  Convienence for plugins.
        this.options = {};
        this.previousSeriesStack = [];
        // Namespace to hold plugins.  Generally non-renderer plugins add themselves to here.
        this.plugins = {};
        // prop: series
        // Array of series object options.
        // see <Series> for series specific options.
        this.series = [];
        // array of series indices. Keep track of order
        // which series canvases are displayed, lowest
        // to highest, back to front.
        this.seriesStack = [];
        // prop: seriesColors
        // Ann array of CSS color specifications that will be applied, in order,
        // to the series in the plot.  Colors will wrap around so, if their
        // are more series than colors, colors will be reused starting at the
        // beginning.  For pie charts, this specifies the colors of the slices.
        this.seriesColors = $.jqplot.config.defaultColors;
        // prop: sortData
        // false to not sort the data passed in by the user.
        // Many bar, stacked and other graphs as well as many plugins depend on
        // having sorted data.
        this.sortData = true;
        // prop: stackSeries
        // true or false, creates a stack or "mountain" plot.
        // Not all series renderers may implement this option.
        this.stackSeries = false;
        // a shortcut for axis syncTicks options.  Not implemented yet.
        this.syncXTicks = true;
        // a shortcut for axis syncTicks options.  Not implemented yet.
        this.syncYTicks = true;
        // the jquery object for the dom target.
        this.target = null; 
        // The id of the dom element to render the plot into
        this.targetId = null;
        // prop textColor
        // css spec for the css color attribute.  Default for the entire plot.
        this.textColor;
        // prop: title
        // Title object.  See <Title> for specific options.  As a shortcut, you
        // can specify the title option as just a string like: title: 'My Plot'
        // and this will create a new title object with the specified text.
        this.title = new Title();
        // Count how many times the draw method has been called while the plot is visible.
        // Mostly used to test if plot has never been drawn (=0), has been successfully drawn
        // into a visible container once (=1) or draw more than once into a visible container.
        // Can use this in tests to see if plot has been visibly drawn at least one time.
        // After plot has been visibly drawn once, it generally doesn't need redrawing if its
        // container is hidden and shown.
        this._drawCount = 0;
        // sum of y values for all series in plot.
        // used in mekko chart.
        this._sumy = 0;
        this._sumx = 0;
        // array to hold the cumulative stacked series data.
        // used to ajust the individual series data, which won't have access to other
        // series data.
        this._stackData = [];
        // array that holds the data to be plotted. This will be the series data
        // merged with the the appropriate data from _stackData according to the stackAxis.
        this._plotData = [];
        this._width = null;
        this._height = null; 
        this._plotDimensions = {height:null, width:null};
        this._gridPadding = {top:null, right:null, bottom:null, left:null};
        this._defaultGridPadding = {top:10, right:10, bottom:23, left:10};

        this._addDomReference = $.jqplot.config.addDomReference;

        this.preInitHooks = new $.jqplot.HooksManager();
        this.postInitHooks = new $.jqplot.HooksManager();
        this.preParseOptionsHooks = new $.jqplot.HooksManager();
        this.postParseOptionsHooks = new $.jqplot.HooksManager();
        this.preDrawHooks = new $.jqplot.HooksManager();
        this.postDrawHooks = new $.jqplot.HooksManager();
        this.preDrawSeriesHooks = new $.jqplot.HooksManager();
        this.postDrawSeriesHooks = new $.jqplot.HooksManager();
        this.preDrawLegendHooks = new $.jqplot.HooksManager();
        this.addLegendRowHooks = new $.jqplot.HooksManager();
        this.preSeriesInitHooks = new $.jqplot.HooksManager();
        this.postSeriesInitHooks = new $.jqplot.HooksManager();
        this.preParseSeriesOptionsHooks = new $.jqplot.HooksManager();
        this.postParseSeriesOptionsHooks = new $.jqplot.HooksManager();
        this.eventListenerHooks = new $.jqplot.EventListenerManager();
        this.preDrawSeriesShadowHooks = new $.jqplot.HooksManager();
        this.postDrawSeriesShadowHooks = new $.jqplot.HooksManager();
        
        this.colorGenerator = new $.jqplot.ColorGenerator();
        this.negativeColorGenerator = new $.jqplot.ColorGenerator();

        this.canvasManager = new $.jqplot.CanvasManager();

        this.themeEngine = new $.jqplot.ThemeEngine();
        
        var seriesColorsIndex = 0;

        // Group: methods
        //
        // method: init
        // sets the plot target, checks data and applies user
        // options to plot.
        this.init = function(target, data, options) {
            options = options || {};
            for (var i=0; i<$.jqplot.preInitHooks.length; i++) {
                $.jqplot.preInitHooks[i].call(this, target, data, options);
            }

            for (var i=0; i<this.preInitHooks.hooks.length; i++) {
                this.preInitHooks.hooks[i].call(this, target, data, options);
            }
            
            this.targetId = '#'+target;
            this.target = $('#'+target);

            //////
            // Add a reference to plot
            //////
            if (this._addDomReference) {
                this.target.data('jqplot', this);
            }
            // remove any error class that may be stuck on target.
            this.target.removeClass('jqplot-error');
            if (!this.target.get(0)) {
                throw new Error("No plot target specified");
            }
            
            // make sure the target is positioned by some means and set css
            if (this.target.css('position') == 'static') {
                this.target.css('position', 'relative');
            }
            if (!this.target.hasClass('jqplot-target')) {
                this.target.addClass('jqplot-target');
            }
            
            // if no height or width specified, use a default.
            if (!this.target.height()) {
                var h;
                if (options && options.height) {
                    h = parseInt(options.height, 10);
                }
                else if (this.target.attr('data-height')) {
                    h = parseInt(this.target.attr('data-height'), 10);
                }
                else {
                    h = parseInt($.jqplot.config.defaultHeight, 10);
                }
                this._height = h;
                this.target.css('height', h+'px');
            }
            else {
                this._height = h = this.target.height();
            }
            if (!this.target.width()) {
                var w;
                if (options && options.width) {
                    w = parseInt(options.width, 10);
                }
                else if (this.target.attr('data-width')) {
                    w = parseInt(this.target.attr('data-width'), 10);
                }
                else {
                    w = parseInt($.jqplot.config.defaultWidth, 10);
                }
                this._width = w;
                this.target.css('width', w+'px');
            }
            else {
                this._width = w = this.target.width();
            }

            for (var i=0, l=_axisNames.length; i<l; i++) {
                this.axes[_axisNames[i]] = new Axis(_axisNames[i]);
            }
            
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            this.baseCanvas._plotDimensions = this._plotDimensions;
            this.eventCanvas._plotDimensions = this._plotDimensions;
            this.legend._plotDimensions = this._plotDimensions;
            if (this._height <=0 || this._width <=0 || !this._height || !this._width) {
                throw new Error("Canvas dimension not set");
            }
            
            if (options.dataRenderer && $.isFunction(options.dataRenderer)) {
                if (options.dataRendererOptions) {
                    this.dataRendererOptions = options.dataRendererOptions;
                }
                this.dataRenderer = options.dataRenderer;
                data = this.dataRenderer(data, this, this.dataRendererOptions);
            }
            
            if (options.noDataIndicator && $.isPlainObject(options.noDataIndicator)) {
                $.extend(true, this.noDataIndicator, options.noDataIndicator);
            }
            
            if (data == null || $.isArray(data) == false || data.length == 0 || $.isArray(data[0]) == false || data[0].length == 0) {
                
                if (this.noDataIndicator.show == false) {
                    throw new Error("No data specified");
                }
                
                else {
                    // have to be descructive here in order for plot to not try and render series.
                    // This means that $.jqplot() will have to be called again when there is data.
                    //delete options.series;
                    
                    for (var ax in this.noDataIndicator.axes) {
                        for (var prop in this.noDataIndicator.axes[ax]) {
                            this.axes[ax][prop] = this.noDataIndicator.axes[ax][prop];
                        }
                    }
                    
                    this.postDrawHooks.add(function() {
                        var eh = this.eventCanvas.getHeight();
                        var ew = this.eventCanvas.getWidth();
                        var temp = $('<div class="jqplot-noData-container" style="position:absolute;"></div>');
                        this.target.append(temp);
                        temp.height(eh);
                        temp.width(ew);
                        temp.css('top', this.eventCanvas._offsets.top);
                        temp.css('left', this.eventCanvas._offsets.left);
                        
                        var temp2 = $('<div class="jqplot-noData-contents" style="text-align:center; position:relative; margin-left:auto; margin-right:auto;"></div>');
                        temp.append(temp2);
                        temp2.html(this.noDataIndicator.indicator);
                        var th = temp2.height();
                        var tw = temp2.width();
                        temp2.height(th);
                        temp2.width(tw);
                        temp2.css('top', (eh - th)/2 + 'px');
                    });

                }
            }
            
            // make a copy of the data
            this.data = $.extend(true, [], data);
            
            this.parseOptions(options);
            
            if (this.textColor) {
                this.target.css('color', this.textColor);
            }
            if (this.fontFamily) {
                this.target.css('font-family', this.fontFamily);
            }
            if (this.fontSize) {
                this.target.css('font-size', this.fontSize);
            }
            
            this.title.init();
            this.legend.init();
            this._sumy = 0;
            this._sumx = 0;
            this.computePlotData();
            for (var i=0; i<this.series.length; i++) {
                // set default stacking order for series canvases
                this.seriesStack.push(i);
                this.previousSeriesStack.push(i);
                this.series[i].shadowCanvas._plotDimensions = this._plotDimensions;
                this.series[i].canvas._plotDimensions = this._plotDimensions;
                for (var j=0; j<$.jqplot.preSeriesInitHooks.length; j++) {
                    $.jqplot.preSeriesInitHooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                for (var j=0; j<this.preSeriesInitHooks.hooks.length; j++) {
                    this.preSeriesInitHooks.hooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                // this.populatePlotData(this.series[i], i);
                this.series[i]._plotDimensions = this._plotDimensions;
                this.series[i].init(i, this.grid.borderWidth, this);
                for (var j=0; j<$.jqplot.postSeriesInitHooks.length; j++) {
                    $.jqplot.postSeriesInitHooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                for (var j=0; j<this.postSeriesInitHooks.hooks.length; j++) {
                    this.postSeriesInitHooks.hooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                this._sumy += this.series[i]._sumy;
                this._sumx += this.series[i]._sumx;
            }

            var name,
                axis;
            for (var i=0, l=_axisNames.length; i<l; i++) {
                name = _axisNames[i];
                axis = this.axes[name];
                axis._plotDimensions = this._plotDimensions;
                axis.init();
                if (this.axes[name].borderColor == null) {
                    if (name.charAt(0) !== 'x' && axis.useSeriesColor === true && axis.show) {
                        axis.borderColor = axis._series[0].color;
                    }
                    else {
                        axis.borderColor = this.grid.borderColor;
                    }
                }
            }
            
            if (this.sortData) {
                sortData(this.series);
            }
            this.grid.init();
            this.grid._axes = this.axes;
            
            this.legend._series = this.series;

            for (var i=0; i<$.jqplot.postInitHooks.length; i++) {
                $.jqplot.postInitHooks[i].call(this, target, this.data, options);
            }

            for (var i=0; i<this.postInitHooks.hooks.length; i++) {
                this.postInitHooks.hooks[i].call(this, target, this.data, options);
            }
        };  
        
        // method: resetAxesScale
        // Reset the specified axes min, max, numberTicks and tickInterval properties to null
        // or reset these properties on all axes if no list of axes is provided.
        //
        // Parameters:
        // axes - Boolean to reset or not reset all axes or an array or object of axis names to reset.
        this.resetAxesScale = function(axes, options) {
            var opts = options || {};
            var ax = axes || this.axes;
            if (ax === true) {
                ax = this.axes;
            }
            if ($.isArray(ax)) {
                for (var i = 0; i < ax.length; i++) {
                    this.axes[ax[i]].resetScale(opts[ax[i]]);
                }
            }
            else if (typeof(ax) === 'object') {
                for (var name in ax) {
                    this.axes[name].resetScale(opts[name]);
                }
            }
        };
        // method: reInitialize
        // reinitialize plot for replotting.
        // not called directly.
        this.reInitialize = function (data, opts) {
            // Plot should be visible and have a height and width.
            // If plot doesn't have height and width for some
            // reason, set it by other means.  Plot must not have
            // a display:none attribute, however.

            var options = $.extend(true, {}, this.options, opts);

            var target = this.targetId.substr(1);
            var tdata = (data == null) ? this.data : data;

            for (var i=0; i<$.jqplot.preInitHooks.length; i++) {
                $.jqplot.preInitHooks[i].call(this, target, tdata, options);
            }

            for (var i=0; i<this.preInitHooks.hooks.length; i++) {
                this.preInitHooks.hooks[i].call(this, target, tdata, options);
            }
            
            this._height = this.target.height();
            this._width = this.target.width();
            
            if (this._height <=0 || this._width <=0 || !this._height || !this._width) {
                throw new Error("Target dimension not set");
            }
            
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            this.baseCanvas._plotDimensions = this._plotDimensions;
            this.eventCanvas._plotDimensions = this._plotDimensions;
            this.legend._plotDimensions = this._plotDimensions;

            var name,
                t, 
                j, 
                axis;

            for (var i=0, l=_axisNames.length; i<l; i++) {
                name = _axisNames[i];
                axis = this.axes[name];

                // Memory Leaks patch : clear ticks elements
                t = axis._ticks;
                for (var j = 0, tlen = t.length; j < tlen; j++) {
                  var el = t[j]._elem;
                  if (el) {
                    // if canvas renderer
                    if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
                      window.G_vmlCanvasManager.uninitElement(el.get(0));
                    }
                    el.emptyForce();
                    el = null;
                    t._elem = null;
                  }
                }
                t = null;

                delete axis.ticks;
                delete axis._ticks;
                this.axes[name] = new Axis(name);
                this.axes[name]._plotWidth = this._width;
                this.axes[name]._plotHeight = this._height;
            }
            
            if (data) {
                if (options.dataRenderer && $.isFunction(options.dataRenderer)) {
                    if (options.dataRendererOptions) {
                        this.dataRendererOptions = options.dataRendererOptions;
                    }
                    this.dataRenderer = options.dataRenderer;
                    data = this.dataRenderer(data, this, this.dataRendererOptions);
                }
                
                // make a copy of the data
                this.data = $.extend(true, [], data);
            }

            if (opts) {
                this.parseOptions(options);
            }
            
            this.title._plotWidth = this._width;
            
            if (this.textColor) {
                this.target.css('color', this.textColor);
            }
            if (this.fontFamily) {
                this.target.css('font-family', this.fontFamily);
            }
            if (this.fontSize) {
                this.target.css('font-size', this.fontSize);
            }

            this.title.init();
            this.legend.init();
            this._sumy = 0;
            this._sumx = 0;

            this.seriesStack = [];
            this.previousSeriesStack = [];

            this.computePlotData();
            for (var i=0, l=this.series.length; i<l; i++) {
                // set default stacking order for series canvases
                this.seriesStack.push(i);
                this.previousSeriesStack.push(i);
                this.series[i].shadowCanvas._plotDimensions = this._plotDimensions;
                this.series[i].canvas._plotDimensions = this._plotDimensions;
                for (var j=0; j<$.jqplot.preSeriesInitHooks.length; j++) {
                    $.jqplot.preSeriesInitHooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                for (var j=0; j<this.preSeriesInitHooks.hooks.length; j++) {
                    this.preSeriesInitHooks.hooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                // this.populatePlotData(this.series[i], i);
                this.series[i]._plotDimensions = this._plotDimensions;
                this.series[i].init(i, this.grid.borderWidth, this);
                for (var j=0; j<$.jqplot.postSeriesInitHooks.length; j++) {
                    $.jqplot.postSeriesInitHooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                for (var j=0; j<this.postSeriesInitHooks.hooks.length; j++) {
                    this.postSeriesInitHooks.hooks[j].call(this.series[i], target, this.data, this.options.seriesDefaults, this.options.series[i], this);
                }
                this._sumy += this.series[i]._sumy;
                this._sumx += this.series[i]._sumx;
            }

            for (var i=0, l=_axisNames.length; i<l; i++) {
                name = _axisNames[i];
                axis = this.axes[name];

                axis._plotDimensions = this._plotDimensions;
                axis.init();
                if (axis.borderColor == null) {
                    if (name.charAt(0) !== 'x' && axis.useSeriesColor === true && axis.show) {
                        axis.borderColor = axis._series[0].color;
                    }
                    else {
                        axis.borderColor = this.grid.borderColor;
                    }
                }
            }
            
            if (this.sortData) {
                sortData(this.series);
            }
            this.grid.init();
            this.grid._axes = this.axes;
            
            this.legend._series = this.series;

            for (var i=0, l=$.jqplot.postInitHooks.length; i<l; i++) {
                $.jqplot.postInitHooks[i].call(this, target, this.data, options);
            }

            for (var i=0, l=this.postInitHooks.hooks.length; i<l; i++) {
                this.postInitHooks.hooks[i].call(this, target, this.data, options);
            }
        };



        // method: quickInit
        // 
        // Quick reinitialization plot for replotting.
        // Does not parse options ore recreate axes and series.
        // not called directly.
        this.quickInit = function () {
            // Plot should be visible and have a height and width.
            // If plot doesn't have height and width for some
            // reason, set it by other means.  Plot must not have
            // a display:none attribute, however.
            
            this._height = this.target.height();
            this._width = this.target.width();
            
            if (this._height <=0 || this._width <=0 || !this._height || !this._width) {
                throw new Error("Target dimension not set");
            }
            
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            this.baseCanvas._plotDimensions = this._plotDimensions;
            this.eventCanvas._plotDimensions = this._plotDimensions;
            this.legend._plotDimensions = this._plotDimensions;
            
            for (var n in this.axes) {
                this.axes[n]._plotWidth = this._width;
                this.axes[n]._plotHeight = this._height;
            }
            
            this.title._plotWidth = this._width;
            
            if (this.textColor) {
                this.target.css('color', this.textColor);
            }
            if (this.fontFamily) {
                this.target.css('font-family', this.fontFamily);
            }
            if (this.fontSize) {
                this.target.css('font-size', this.fontSize);
            }
            
            this._sumy = 0;
            this._sumx = 0;
            this.computePlotData();
            for (var i=0; i<this.series.length; i++) {
                // this.populatePlotData(this.series[i], i);
                if (this.series[i]._type === 'line' && this.series[i].renderer.bands.show) {
                    this.series[i].renderer.initBands.call(this.series[i], this.series[i].renderer.options, this);
                }
                this.series[i]._plotDimensions = this._plotDimensions;
                this.series[i].canvas._plotDimensions = this._plotDimensions;
                //this.series[i].init(i, this.grid.borderWidth);
                this._sumy += this.series[i]._sumy;
                this._sumx += this.series[i]._sumx;
            }

            var name;
            
            for (var j=0; j<12; j++) {
                name = _axisNames[j];
                // Memory Leaks patch : clear ticks elements
                var t = this.axes[name]._ticks;
                for (var i = 0; i < t.length; i++) {
                  var el = t[i]._elem;
                  if (el) {
                    // if canvas renderer
                    if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
                      window.G_vmlCanvasManager.uninitElement(el.get(0));
                    }
                    el.emptyForce();
                    el = null;
                    t._elem = null;
                  }
                }
                t = null;
                
                this.axes[name]._plotDimensions = this._plotDimensions;
                this.axes[name]._ticks = [];
                // this.axes[name].renderer.init.call(this.axes[name], {});
            }
            
            if (this.sortData) {
                sortData(this.series);
            }
            
            this.grid._axes = this.axes;
            
            this.legend._series = this.series;
        };
        
        // sort the series data in increasing order.
        function sortData(series) {
            var d, sd, pd, ppd, ret;
            for (var i=0; i<series.length; i++) {
                var check;
                var bat = [series[i].data, series[i]._stackData, series[i]._plotData, series[i]._prevPlotData];
                for (var n=0; n<4; n++) {
                    check = true;
                    d = bat[n];
                    if (series[i]._stackAxis == 'x') {
                        for (var j = 0; j < d.length; j++) {
                            if (typeof(d[j][1]) != "number") {
                                check = false;
                                break;
                            }
                        }
                        if (check) {
                            d.sort(function(a,b) { return a[1] - b[1]; });
                        }
                    }
                    else {
                        for (var j = 0; j < d.length; j++) {
                            if (typeof(d[j][0]) != "number") {
                                check = false;
                                break;
                            }
                        }
                        if (check) {
                            d.sort(function(a,b) { return a[0] - b[0]; });
                        }
                    }
                }
               
            }
        }

        this.computePlotData = function() {
            this._plotData = [];
            this._stackData = [];
            var series,
                index,
                l;


            for (index=0, l=this.series.length; index<l; index++) {
                series = this.series[index];
                this._plotData.push([]);
                this._stackData.push([]);
                var cd = series.data;
                this._plotData[index] = $.extend(true, [], cd);
                this._stackData[index] = $.extend(true, [], cd);
                series._plotData = this._plotData[index];
                series._stackData = this._stackData[index];
                var plotValues = {x:[], y:[]};

                if (this.stackSeries && !series.disableStack) {
                    series._stack = true;
                    ///////////////////////////
                    // have to check for nulls
                    ///////////////////////////
                    var sidx = (series._stackAxis === 'x') ? 0 : 1;

                    for (var k=0, cdl=cd.length; k<cdl; k++) {
                        var temp = cd[k][sidx];
                        if (temp == null) {
                            temp = 0;
                        }
                        this._plotData[index][k][sidx] = temp;
                        this._stackData[index][k][sidx] = temp;

                        if (index > 0) {
                            for (var j=index; j--;) {
                                var prevval = this._plotData[j][k][sidx];
                                // only need to sum up the stack axis column of data
                                // and only sum if it is of same sign.
                                // if previous series isn't same sign, keep looking
                                // at earlier series untill we find one of same sign.
                                if (temp * prevval >= 0) {
                                    this._plotData[index][k][sidx] += prevval;
                                    this._stackData[index][k][sidx] += prevval;
                                    break;
                                } 
                            }
                        }
                    }

                }
                else {
                    for (var i=0; i<series.data.length; i++) {
                        plotValues.x.push(series.data[i][0]);
                        plotValues.y.push(series.data[i][1]);
                    }
                    this._stackData.push(series.data);
                    this.series[index]._stackData = series.data;
                    this._plotData.push(series.data);
                    series._plotData = series.data;
                    series._plotValues = plotValues;
                }
                if (index>0) {
                    series._prevPlotData = this.series[index-1]._plotData;
                }
                series._sumy = 0;
                series._sumx = 0;
                for (i=series.data.length-1; i>-1; i--) {
                    series._sumy += series.data[i][1];
                    series._sumx += series.data[i][0];
                }
            }

        };
        
        // populate the _stackData and _plotData arrays for the plot and the series.
        this.populatePlotData = function(series, index) {
            // if a stacked chart, compute the stacked data
            this._plotData = [];
            this._stackData = [];
            series._stackData = [];
            series._plotData = [];
            var plotValues = {x:[], y:[]};
            if (this.stackSeries && !series.disableStack) {
                series._stack = true;
                var sidx = (series._stackAxis === 'x') ? 0 : 1;
                // var idx = sidx ? 0 : 1;
                // push the current data into stackData
                //this._stackData.push(this.series[i].data);
                var temp = $.extend(true, [], series.data);
                // create the data that will be plotted for this series
                var plotdata = $.extend(true, [], series.data);
                var tempx, tempy, dval, stackval, comparator;
                // for first series, nothing to add to stackData.
                for (var j=0; j<index; j++) {
                    var cd = this.series[j].data;
                    for (var k=0; k<cd.length; k++) {
                        dval = cd[k];
                        tempx = (dval[0] != null) ? dval[0] : 0;
                        tempy = (dval[1] != null) ? dval[1] : 0;
                        temp[k][0] += tempx;
                        temp[k][1] += tempy;
                        stackval = (sidx) ? tempy : tempx;
                        // only need to sum up the stack axis column of data
                        // and only sum if it is of same sign.
                        if (series.data[k][sidx] * stackval >= 0) {
                            plotdata[k][sidx] += stackval;
                        }
                    }
                }
                for (var i=0; i<plotdata.length; i++) {
                    plotValues.x.push(plotdata[i][0]);
                    plotValues.y.push(plotdata[i][1]);
                }
                this._plotData.push(plotdata);
                this._stackData.push(temp);
                series._stackData = temp;
                series._plotData = plotdata;
                series._plotValues = plotValues;
            }
            else {
                for (var i=0; i<series.data.length; i++) {
                    plotValues.x.push(series.data[i][0]);
                    plotValues.y.push(series.data[i][1]);
                }
                this._stackData.push(series.data);
                this.series[index]._stackData = series.data;
                this._plotData.push(series.data);
                series._plotData = series.data;
                series._plotValues = plotValues;
            }
            if (index>0) {
                series._prevPlotData = this.series[index-1]._plotData;
            }
            series._sumy = 0;
            series._sumx = 0;
            for (i=series.data.length-1; i>-1; i--) {
                series._sumy += series.data[i][1];
                series._sumx += series.data[i][0];
            }
        };
        
        // function to safely return colors from the color array and wrap around at the end.
        this.getNextSeriesColor = (function(t) {
            var idx = 0;
            var sc = t.seriesColors;
            
            return function () { 
                if (idx < sc.length) {
                    return sc[idx++];
                }
                else {
                    idx = 0;
                    return sc[idx++];
                }
            };
        })(this);
    
        this.parseOptions = function(options){
            for (var i=0; i<this.preParseOptionsHooks.hooks.length; i++) {
                this.preParseOptionsHooks.hooks[i].call(this, options);
            }
            for (var i=0; i<$.jqplot.preParseOptionsHooks.length; i++) {
                $.jqplot.preParseOptionsHooks[i].call(this, options);
            }
            this.options = $.extend(true, {}, this.defaults, options);
            var opts = this.options;
            this.animate = opts.animate;
            this.animateReplot = opts.animateReplot;
            this.stackSeries = opts.stackSeries;
            if ($.isPlainObject(opts.fillBetween)) {

                var temp = ['series1', 'series2', 'color', 'baseSeries', 'fill'], 
                    tempi;

                for (var i=0, l=temp.length; i<l; i++) {
                    tempi = temp[i];
                    if (opts.fillBetween[tempi] != null) {
                        this.fillBetween[tempi] = opts.fillBetween[tempi];
                    }
                }
            }

            if (opts.seriesColors) {
                this.seriesColors = opts.seriesColors;
            }
            if (opts.negativeSeriesColors) {
                this.negativeSeriesColors = opts.negativeSeriesColors;
            }
            if (opts.captureRightClick) {
                this.captureRightClick = opts.captureRightClick;
            }
            this.defaultAxisStart = (options && options.defaultAxisStart != null) ? options.defaultAxisStart : this.defaultAxisStart;
            this.colorGenerator.setColors(this.seriesColors);
            this.negativeColorGenerator.setColors(this.negativeSeriesColors);
            // var cg = new this.colorGenerator(this.seriesColors);
            // var ncg = new this.colorGenerator(this.negativeSeriesColors);
            // this._gridPadding = this.options.gridPadding;
            $.extend(true, this._gridPadding, opts.gridPadding);
            this.sortData = (opts.sortData != null) ? opts.sortData : this.sortData;
            for (var i=0; i<12; i++) {
                var n = _axisNames[i];
                var axis = this.axes[n];
                axis._options = $.extend(true, {}, opts.axesDefaults, opts.axes[n]);
                $.extend(true, axis, opts.axesDefaults, opts.axes[n]);
                axis._plotWidth = this._width;
                axis._plotHeight = this._height;
            }
            // if (this.data.length == 0) {
            //     this.data = [];
            //     for (var i=0; i<this.options.series.length; i++) {
            //         this.data.push(this.options.series.data);
            //     }    
            // }
                
            var normalizeData = function(data, dir, start) {
                // return data as an array of point arrays,
                // in form [[x1,y1...], [x2,y2...], ...]
                var temp = [];
                var i, l;
                dir = dir || 'vertical';
                if (!$.isArray(data[0])) {
                    // we have a series of scalars.  One line with just y values.
                    // turn the scalar list of data into a data array of form:
                    // [[1, data[0]], [2, data[1]], ...]
                    for (i=0, l=data.length; i<l; i++) {
                        if (dir == 'vertical') {
                            temp.push([start + i, data[i]]);   
                        }
                        else {
                            temp.push([data[i], start+i]);
                        }
                    }
                }            
                else {
                    // we have a properly formatted data series, copy it.
                    $.extend(true, temp, data);
                }
                return temp;
            };

            var colorIndex = 0;
            this.series = [];
            for (var i=0; i<this.data.length; i++) {
                var sopts = $.extend(true, {index: i}, {seriesColors:this.seriesColors, negativeSeriesColors:this.negativeSeriesColors}, this.options.seriesDefaults, this.options.series[i], {rendererOptions:{animation:{show: this.animate}}});
                // pass in options in case something needs set prior to initialization.
                var temp = new Series(sopts);
                for (var j=0; j<$.jqplot.preParseSeriesOptionsHooks.length; j++) {
                    $.jqplot.preParseSeriesOptionsHooks[j].call(temp, this.options.seriesDefaults, this.options.series[i]);
                }
                for (var j=0; j<this.preParseSeriesOptionsHooks.hooks.length; j++) {
                    this.preParseSeriesOptionsHooks.hooks[j].call(temp, this.options.seriesDefaults, this.options.series[i]);
                }
                // Now go back and apply the options to the series.  Really should just do this during initializaiton, but don't want to
                // mess up preParseSeriesOptionsHooks at this point.
                $.extend(true, temp, sopts);
                var dir = 'vertical';
                if (temp.renderer === $.jqplot.BarRenderer && temp.rendererOptions && temp.rendererOptions.barDirection == 'horizontal') {
                    dir = 'horizontal';
                    temp._stackAxis = 'x';
                    temp._primaryAxis = '_yaxis';
                }
                temp.data = normalizeData(this.data[i], dir, this.defaultAxisStart);
                switch (temp.xaxis) {
                    case 'xaxis':
                        temp._xaxis = this.axes.xaxis;
                        break;
                    case 'x2axis':
                        temp._xaxis = this.axes.x2axis;
                        break;
                    default:
                        break;
                }
                temp._yaxis = this.axes[temp.yaxis];
                temp._xaxis._series.push(temp);
                temp._yaxis._series.push(temp);
                if (temp.show) {
                    temp._xaxis.show = true;
                    temp._yaxis.show = true;
                }
                else {
                    if (temp._xaxis.scaleToHiddenSeries) {
                        temp._xaxis.show = true;
                    }
                    if (temp._yaxis.scaleToHiddenSeries) {
                        temp._yaxis.show = true;
                    }
                }

                // // parse the renderer options and apply default colors if not provided
                // if (!temp.color && temp.show != false) {
                //     temp.color = cg.next();
                //     colorIndex = cg.getIndex() - 1;;
                // }
                // if (!temp.negativeColor && temp.show != false) {
                //     temp.negativeColor = ncg.get(colorIndex);
                //     ncg.setIndex(colorIndex);
                // }
                if (!temp.label) {
                    temp.label = 'Series '+ (i+1).toString();
                }
                // temp.rendererOptions.show = temp.show;
                // $.extend(true, temp.renderer, {color:this.seriesColors[i]}, this.rendererOptions);
                this.series.push(temp);  
                for (var j=0; j<$.jqplot.postParseSeriesOptionsHooks.length; j++) {
                    $.jqplot.postParseSeriesOptionsHooks[j].call(this.series[i], this.options.seriesDefaults, this.options.series[i]);
                }
                for (var j=0; j<this.postParseSeriesOptionsHooks.hooks.length; j++) {
                    this.postParseSeriesOptionsHooks.hooks[j].call(this.series[i], this.options.seriesDefaults, this.options.series[i]);
                }
            }
            
            // copy the grid and title options into this object.
            $.extend(true, this.grid, this.options.grid);
            // if axis border properties aren't set, set default.
            for (var i=0, l=_axisNames.length; i<l; i++) {
                var n = _axisNames[i];
                var axis = this.axes[n];
                if (axis.borderWidth == null) {
                    axis.borderWidth =this.grid.borderWidth;
                }
            }
            
            if (typeof this.options.title == 'string') {
                this.title.text = this.options.title;
            }
            else if (typeof this.options.title == 'object') {
                $.extend(true, this.title, this.options.title);
            }
            this.title._plotWidth = this._width;
            this.legend.setOptions(this.options.legend);
            
            for (var i=0; i<$.jqplot.postParseOptionsHooks.length; i++) {
                $.jqplot.postParseOptionsHooks[i].call(this, options);
            }
            for (var i=0; i<this.postParseOptionsHooks.hooks.length; i++) {
                this.postParseOptionsHooks.hooks[i].call(this, options);
            }
        };
        
        // method: destroy
        // Releases all resources occupied by the plot
        this.destroy = function() {
            this.canvasManager.freeAllCanvases();
            if (this.eventCanvas && this.eventCanvas._elem) {
                this.eventCanvas._elem.unbind();
            }
            // Couple of posts on Stack Overflow indicate that empty() doesn't
            // always cear up the dom and release memory.  Sometimes setting
            // innerHTML property to null is needed.  Particularly on IE, may 
            // have to directly set it to null, bypassing $.
            this.target.empty();

            this.target[0].innerHTML = '';
        };
        
        // method: replot
        // Does a reinitialization of the plot followed by
        // a redraw.  Method could be used to interactively
        // change plot characteristics and then replot.
        //
        // Parameters:
        // options - Options used for replotting.
        //
        // Properties:
        // clear - false to not clear (empty) the plot container before replotting (default: true).
        // resetAxes - true to reset all axes min, max, numberTicks and tickInterval setting so axes will rescale themselves.
        //             optionally pass in list of axes to reset (e.g. ['xaxis', 'y2axis']) (default: false).
        this.replot = function(options) {
            var opts =  options || {};
            var data = opts.data || null;
            var clear = (opts.clear === false) ? false : true;
            var resetAxes = opts.resetAxes || false;
            delete opts.data;
            delete opts.clear;
            delete opts.resetAxes;

            this.target.trigger('jqplotPreReplot');
            
            if (clear) {
                this.destroy();
            }
            // if have data or other options, full reinit.
            // otherwise, quickinit.
            if (data || !$.isEmptyObject(opts)) {
                this.reInitialize(data, opts);
            }
            else {
                this.quickInit();
            }

            if (resetAxes) {
                this.resetAxesScale(resetAxes, opts.axes);
            }
            this.draw();
            this.target.trigger('jqplotPostReplot');
        };
        
        // method: redraw
        // Empties the plot target div and redraws the plot.
        // This enables plot data and properties to be changed
        // and then to comletely clear the plot and redraw.
        // redraw *will not* reinitialize any plot elements.
        // That is, axes will not be autoscaled and defaults
        // will not be reapplied to any plot elements.  redraw
        // is used primarily with zooming. 
        //
        // Parameters:
        // clear - false to not clear (empty) the plot container before redrawing (default: true).
        this.redraw = function(clear) {
            clear = (clear != null) ? clear : true;
            this.target.trigger('jqplotPreRedraw');
            if (clear) {
                this.canvasManager.freeAllCanvases();
                this.eventCanvas._elem.unbind();
                // Dont think I bind any events to the target, this shouldn't be necessary.
                // It will remove user's events.
                // this.target.unbind();
                this.target.empty();
            }
             for (var ax in this.axes) {
                this.axes[ax]._ticks = [];
            }
            this.computePlotData();
            // for (var i=0; i<this.series.length; i++) {
            //     this.populatePlotData(this.series[i], i);
            // }
            this._sumy = 0;
            this._sumx = 0;
            for (var i=0, tsl = this.series.length; i<tsl; i++) {
                this._sumy += this.series[i]._sumy;
                this._sumx += this.series[i]._sumx;
            }
            this.draw();
            this.target.trigger('jqplotPostRedraw');
        };
        
        // method: draw
        // Draws all elements of the plot into the container.
        // Does not clear the container before drawing.
        this.draw = function(){
            if (this.drawIfHidden || this.target.is(':visible')) {
                this.target.trigger('jqplotPreDraw');
                var i,
                    j,
                    l,
                    tempseries;
                for (i=0, l=$.jqplot.preDrawHooks.length; i<l; i++) {
                    $.jqplot.preDrawHooks[i].call(this);
                }
                for (i=0, l=this.preDrawHooks.hooks.length; i<l; i++) {
                    this.preDrawHooks.hooks[i].apply(this, this.preDrawSeriesHooks.args[i]);
                }
                // create an underlying canvas to be used for special features.
                this.target.append(this.baseCanvas.createElement({left:0, right:0, top:0, bottom:0}, 'jqplot-base-canvas', null, this));
                this.baseCanvas.setContext();
                this.target.append(this.title.draw());
                this.title.pack({top:0, left:0});
                
                // make room  for the legend between the grid and the edge.
                // pass a dummy offsets object and a reference to the plot.
                var legendElem = this.legend.draw({}, this);
                
                var gridPadding = {top:0, left:0, bottom:0, right:0};
                
                if (this.legend.placement == "outsideGrid") {
                    // temporarily append the legend to get dimensions
                    this.target.append(legendElem);
                    switch (this.legend.location) {
                        case 'n':
                            gridPadding.top += this.legend.getHeight();
                            break;
                        case 's':
                            gridPadding.bottom += this.legend.getHeight();
                            break;
                        case 'ne':
                        case 'e':
                        case 'se':
                            gridPadding.right += this.legend.getWidth();
                            break;
                        case 'nw':
                        case 'w':
                        case 'sw':
                            gridPadding.left += this.legend.getWidth();
                            break;
                        default:  // same as 'ne'
                            gridPadding.right += this.legend.getWidth();
                            break;
                    }
                    legendElem = legendElem.detach();
                }
                
                var ax = this.axes;
                var name;
                // draw the yMidAxis first, so xaxis of pyramid chart can adjust itself if needed.
                for (i=0; i<12; i++) {
                    name = _axisNames[i];
                    this.target.append(ax[name].draw(this.baseCanvas._ctx, this));
                    ax[name].set();
                }
                if (ax.yaxis.show) {
                    gridPadding.left += ax.yaxis.getWidth();
                }
                var ra = ['y2axis', 'y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis'];
                var rapad = [0, 0, 0, 0, 0, 0, 0, 0];
                var gpr = 0;
                var n;
                for (n=0; n<8; n++) {
                    if (ax[ra[n]].show) {
                        gpr += ax[ra[n]].getWidth();
                        rapad[n] = gpr;
                    }
                }
                gridPadding.right += gpr;
                if (ax.x2axis.show) {
                    gridPadding.top += ax.x2axis.getHeight();
                }
                if (this.title.show) {
                    gridPadding.top += this.title.getHeight();
                }
                if (ax.xaxis.show) {
                    gridPadding.bottom += ax.xaxis.getHeight();
                }
                
                // end of gridPadding adjustments.

                // if user passed in gridDimensions option, check against calculated gridPadding
                if (this.options.gridDimensions && $.isPlainObject(this.options.gridDimensions)) {
                    var gdw = parseInt(this.options.gridDimensions.width, 10) || 0;
                    var gdh = parseInt(this.options.gridDimensions.height, 10) || 0;
                    var widthAdj = (this._width - gridPadding.left - gridPadding.right - gdw)/2;
                    var heightAdj = (this._height - gridPadding.top - gridPadding.bottom - gdh)/2;

                    if (heightAdj >= 0 && widthAdj >= 0) {
                        gridPadding.top += heightAdj;
                        gridPadding.bottom += heightAdj;
                        gridPadding.left += widthAdj;
                        gridPadding.right += widthAdj;
                    }
                }
                var arr = ['top', 'bottom', 'left', 'right'];
                for (var n in arr) {
                    if (this._gridPadding[arr[n]] == null && gridPadding[arr[n]] > 0) {
                        this._gridPadding[arr[n]] = gridPadding[arr[n]];
                    }
                    else if (this._gridPadding[arr[n]] == null) {
                        this._gridPadding[arr[n]] = this._defaultGridPadding[arr[n]];
                    }
                }
                
                var legendPadding = this._gridPadding;
                
                if (this.legend.placement === 'outsideGrid') {
                    legendPadding = {top:this.title.getHeight(), left: 0, right: 0, bottom: 0};
                    if (this.legend.location === 's') {
                        legendPadding.left = this._gridPadding.left;
                        legendPadding.right = this._gridPadding.right;
                    }
                }
                
                ax.xaxis.pack({position:'absolute', bottom:this._gridPadding.bottom - ax.xaxis.getHeight(), left:0, width:this._width}, {min:this._gridPadding.left, max:this._width - this._gridPadding.right});
                ax.yaxis.pack({position:'absolute', top:0, left:this._gridPadding.left - ax.yaxis.getWidth(), height:this._height}, {min:this._height - this._gridPadding.bottom, max: this._gridPadding.top});
                ax.x2axis.pack({position:'absolute', top:this._gridPadding.top - ax.x2axis.getHeight(), left:0, width:this._width}, {min:this._gridPadding.left, max:this._width - this._gridPadding.right});
                for (i=8; i>0; i--) {
                    ax[ra[i-1]].pack({position:'absolute', top:0, right:this._gridPadding.right - rapad[i-1]}, {min:this._height - this._gridPadding.bottom, max: this._gridPadding.top});
                }
                var ltemp = (this._width - this._gridPadding.left - this._gridPadding.right)/2.0 + this._gridPadding.left - ax.yMidAxis.getWidth()/2.0;
                ax.yMidAxis.pack({position:'absolute', top:0, left:ltemp, zIndex:9, textAlign: 'center'}, {min:this._height - this._gridPadding.bottom, max: this._gridPadding.top});
            
                this.target.append(this.grid.createElement(this._gridPadding, this));
                this.grid.draw();
                
                var series = this.series;
                var seriesLength = series.length;
                // put the shadow canvases behind the series canvases so shadows don't overlap on stacked bars.
                for (i=0, l=seriesLength; i<l; i++) {
                    // draw series in order of stacking.  This affects only
                    // order in which canvases are added to dom.
                    j = this.seriesStack[i];
                    this.target.append(series[j].shadowCanvas.createElement(this._gridPadding, 'jqplot-series-shadowCanvas', null, this));
                    series[j].shadowCanvas.setContext();
                    series[j].shadowCanvas._elem.data('seriesIndex', j);
                }
                
                for (i=0, l=seriesLength; i<l; i++) {
                    // draw series in order of stacking.  This affects only
                    // order in which canvases are added to dom.
                    j = this.seriesStack[i];
                    this.target.append(series[j].canvas.createElement(this._gridPadding, 'jqplot-series-canvas', null, this));
                    series[j].canvas.setContext();
                    series[j].canvas._elem.data('seriesIndex', j);
                }
                // Need to use filled canvas to capture events in IE.
                // Also, canvas seems to block selection of other elements in document on FF.
                this.target.append(this.eventCanvas.createElement(this._gridPadding, 'jqplot-event-canvas', null, this));
                this.eventCanvas.setContext();
                this.eventCanvas._ctx.fillStyle = 'rgba(0,0,0,0)';
                this.eventCanvas._ctx.fillRect(0,0,this.eventCanvas._ctx.canvas.width, this.eventCanvas._ctx.canvas.height);
            
                // bind custom event handlers to regular events.
                this.bindCustomEvents();
            
                // draw legend before series if the series needs to know the legend dimensions.
                if (this.legend.preDraw) {  
                    this.eventCanvas._elem.before(legendElem);
                    this.legend.pack(legendPadding);
                    if (this.legend._elem) {
                        this.drawSeries({legendInfo:{location:this.legend.location, placement:this.legend.placement, width:this.legend.getWidth(), height:this.legend.getHeight(), xoffset:this.legend.xoffset, yoffset:this.legend.yoffset}});
                    }
                    else {
                        this.drawSeries();
                    }
                }
                else {  // draw series before legend
                    this.drawSeries();
                    if (seriesLength) {
                        $(series[seriesLength-1].canvas._elem).after(legendElem);
                    }
                    this.legend.pack(legendPadding);                
                }
            
                // register event listeners on the overlay canvas
                for (var i=0, l=$.jqplot.eventListenerHooks.length; i<l; i++) {
                    // in the handler, this will refer to the eventCanvas dom element.
                    // make sure there are references back into plot objects.
                    this.eventCanvas._elem.bind($.jqplot.eventListenerHooks[i][0], {plot:this}, $.jqplot.eventListenerHooks[i][1]);
                }
            
                // register event listeners on the overlay canvas
                for (var i=0, l=this.eventListenerHooks.hooks.length; i<l; i++) {
                    // in the handler, this will refer to the eventCanvas dom element.
                    // make sure there are references back into plot objects.
                    this.eventCanvas._elem.bind(this.eventListenerHooks.hooks[i][0], {plot:this}, this.eventListenerHooks.hooks[i][1]);
                }

                var fb = this.fillBetween;
                if (fb.fill && fb.series1 !== fb.series2 && fb.series1 < seriesLength && fb.series2 < seriesLength && series[fb.series1]._type === 'line' && series[fb.series2]._type === 'line') {
                    this.doFillBetweenLines();
                }

                for (var i=0, l=$.jqplot.postDrawHooks.length; i<l; i++) {
                    $.jqplot.postDrawHooks[i].call(this);
                }

                for (var i=0, l=this.postDrawHooks.hooks.length; i<l; i++) {
                    this.postDrawHooks.hooks[i].apply(this, this.postDrawHooks.args[i]);
                }
            
                if (this.target.is(':visible')) {
                    this._drawCount += 1;
                }

                var temps, 
                    tempr,
                    sel,
                    _els;
                // ughh.  ideally would hide all series then show them.
                for (i=0, l=seriesLength; i<l; i++) {
                    temps = series[i];
                    tempr = temps.renderer;
                    sel = '.jqplot-point-label.jqplot-series-'+i;
                    if (tempr.animation && tempr.animation._supported && tempr.animation.show && (this._drawCount < 2 || this.animateReplot)) {
                        _els = this.target.find(sel);
                        _els.stop(true, true).hide();
                        temps.canvas._elem.stop(true, true).hide();
                        temps.shadowCanvas._elem.stop(true, true).hide();
                        temps.canvas._elem.jqplotEffect('blind', {mode: 'show', direction: tempr.animation.direction}, tempr.animation.speed);
                        temps.shadowCanvas._elem.jqplotEffect('blind', {mode: 'show', direction: tempr.animation.direction}, tempr.animation.speed);
                        _els.fadeIn(tempr.animation.speed*0.8);
                    }
                }
                _els = null;
            
                this.target.trigger('jqplotPostDraw', [this]);
            }
        };

        jqPlot.prototype.doFillBetweenLines = function () {
            var fb = this.fillBetween;
            var sid1 = fb.series1;
            var sid2 = fb.series2;
            // first series should always be lowest index
            var id1 = (sid1 < sid2) ? sid1 : sid2;
            var id2 = (sid2 >  sid1) ? sid2 : sid1;

            var series1 = this.series[id1];
            var series2 = this.series[id2];

            if (series2.renderer.smooth) {
                var tempgd = series2.renderer._smoothedData.slice(0).reverse();
            }
            else {
                var tempgd = series2.gridData.slice(0).reverse();
            }

            if (series1.renderer.smooth) {
                var gd = series1.renderer._smoothedData.concat(tempgd);
            }
            else {
                var gd = series1.gridData.concat(tempgd);
            }

            var color = (fb.color !== null) ? fb.color : this.series[sid1].fillColor;
            var baseSeries = (fb.baseSeries !== null) ? fb.baseSeries : id1;

            // now apply a fill to the shape on the lower series shadow canvas,
            // so it is behind both series.
            var sr = this.series[baseSeries].renderer.shapeRenderer;
            var opts = {fillStyle: color, fill: true, closePath: true};
            sr.draw(series1.shadowCanvas._ctx, gd, opts);
        };
        
        this.bindCustomEvents = function() {
            this.eventCanvas._elem.bind('click', {plot:this}, this.onClick);
            this.eventCanvas._elem.bind('dblclick', {plot:this}, this.onDblClick);
            this.eventCanvas._elem.bind('mousedown', {plot:this}, this.onMouseDown);
            this.eventCanvas._elem.bind('mousemove', {plot:this}, this.onMouseMove);
            this.eventCanvas._elem.bind('mouseenter', {plot:this}, this.onMouseEnter);
            this.eventCanvas._elem.bind('mouseleave', {plot:this}, this.onMouseLeave);
            if (this.captureRightClick) {
                this.eventCanvas._elem.bind('mouseup', {plot:this}, this.onRightClick);
                this.eventCanvas._elem.get(0).oncontextmenu = function() {
                    return false;
                };
            }
            else {
                this.eventCanvas._elem.bind('mouseup', {plot:this}, this.onMouseUp);
            }
        };
        
        function getEventPosition(ev) {
            var plot = ev.data.plot;
            var go = plot.eventCanvas._elem.offset();
            var gridPos = {x:ev.pageX - go.left, y:ev.pageY - go.top};
            var dataPos = {xaxis:null, yaxis:null, x2axis:null, y2axis:null, y3axis:null, y4axis:null, y5axis:null, y6axis:null, y7axis:null, y8axis:null, y9axis:null, yMidAxis:null};
            var an = ['xaxis', 'yaxis', 'x2axis', 'y2axis', 'y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis', 'yMidAxis'];
            var ax = plot.axes;
            var n, axis;
            for (n=11; n>0; n--) {
                axis = an[n-1];
                if (ax[axis].show) {
                    dataPos[axis] = ax[axis].series_p2u(gridPos[axis.charAt(0)]);
                }
            }

            return {offsets:go, gridPos:gridPos, dataPos:dataPos};
        }
        
        
        // function to check if event location is over a area area
        function checkIntersection(gridpos, plot) {
            var series = plot.series;
            var i, j, k, s, r, x, y, theta, sm, sa, minang, maxang;
            
            var returnDataArray = {
                seriesIndex: [],
                pointIndex: [], 
                gridData: [], 
                data: []
            };


            var d0, d, p, pp, points, bw, hp;
            var threshold, t;
            for (k=plot.seriesStack.length-1; k>=0; k--) {
                i = plot.seriesStack[k];
                s = series[i];
                hp = s._highlightThreshold;
                switch (s.renderer.constructor) {
                    case $.jqplot.BarRenderer:
                        x = gridpos.x;
                        y = gridpos.y;
                        for (j=0; j<s._barPoints.length; j++) {
                            points = s._barPoints[j];
                            p = s.gridData[j];
                            if (x>points[0][0] && x<points[2][0] && y>points[2][1] && y<points[0][1]) {
                                return {seriesIndex:s.index, pointIndex:j, gridData:p, data:s.data[j], points:s._barPoints[j]};
                            }
                        }
                        break;
                    case $.jqplot.PyramidRenderer:
                        x = gridpos.x;
                        y = gridpos.y;
                        for (j=0; j<s._barPoints.length; j++) {
                            points = s._barPoints[j];
                            p = s.gridData[j];
                            if (x > points[0][0] + hp[0][0] && x < points[2][0] + hp[2][0] && y > points[2][1] && y < points[0][1]) {
                                return {seriesIndex:s.index, pointIndex:j, gridData:p, data:s.data[j], points:s._barPoints[j]};
                            }
                        }
                        break;
                    
                    case $.jqplot.DonutRenderer:
                        sa = s.startAngle/180*Math.PI;
                        x = gridpos.x - s._center[0];
                        y = gridpos.y - s._center[1];
                        r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                        if (x > 0 && -y >= 0) {
                            theta = 2*Math.PI - Math.atan(-y/x);
                        }
                        else if (x > 0 && -y < 0) {
                            theta = -Math.atan(-y/x);
                        }
                        else if (x < 0) {
                            theta = Math.PI - Math.atan(-y/x);
                        }
                        else if (x == 0 && -y > 0) {
                            theta = 3*Math.PI/2;
                        }
                        else if (x == 0 && -y < 0) {
                            theta = Math.PI/2;
                        }
                        else if (x == 0 && y == 0) {
                            theta = 0;
                        }
                        if (sa) {
                            theta -= sa;
                            if (theta < 0) {
                                theta += 2*Math.PI;
                            }
                            else if (theta > 2*Math.PI) {
                                theta -= 2*Math.PI;
                            }
                        }
            
                        sm = s.sliceMargin/180*Math.PI;
                        if (r < s._radius && r > s._innerRadius) {
                            for (j=0; j<s.gridData.length; j++) {
                                minang = (j>0) ? s.gridData[j-1][1]+sm : sm;
                                maxang = s.gridData[j][1];
                                if (theta > minang && theta < maxang) {
                                    return {seriesIndex:s.index, pointIndex:j, gridData:[gridpos.x,gridpos.y], data:s.data[j]};
                                }
                            }
                        }
                        break;
                        
                    case $.jqplot.PieRenderer:
                        sa = s.startAngle/180*Math.PI;
                        x = gridpos.x - s._center[0];
                        y = gridpos.y - s._center[1];
                        r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                        if (x > 0 && -y >= 0) {
                            theta = 2*Math.PI - Math.atan(-y/x);
                        }
                        else if (x > 0 && -y < 0) {
                            theta = -Math.atan(-y/x);
                        }
                        else if (x < 0) {
                            theta = Math.PI - Math.atan(-y/x);
                        }
                        else if (x == 0 && -y > 0) {
                            theta = 3*Math.PI/2;
                        }
                        else if (x == 0 && -y < 0) {
                            theta = Math.PI/2;
                        }
                        else if (x == 0 && y == 0) {
                            theta = 0;
                        }
                        if (sa) {
                            theta -= sa;
                            if (theta < 0) {
                                theta += 2*Math.PI;
                            }
                            else if (theta > 2*Math.PI) {
                                theta -= 2*Math.PI;
                            }
                        }
            
                        sm = s.sliceMargin/180*Math.PI;
                        if (r < s._radius) {
                            for (j=0; j<s.gridData.length; j++) {
                                minang = (j>0) ? s.gridData[j-1][1]+sm : sm;
                                maxang = s.gridData[j][1];
                                if (theta > minang && theta < maxang) {
                                    return {seriesIndex:s.index, pointIndex:j, gridData:[gridpos.x,gridpos.y], data:s.data[j]};
                                }
                            }
                        }
                        break;
                        
                    case $.jqplot.BubbleRenderer:
                        x = gridpos.x;
                        y = gridpos.y;
                        var ret = null;
                        
                        if (s.show) {
                            for (var j=0; j<s.gridData.length; j++) {
                                p = s.gridData[j];
                                d = Math.sqrt( (x-p[0]) * (x-p[0]) + (y-p[1]) * (y-p[1]) );
                                if (d <= p[2] && (d <= d0 || d0 == null)) {
                                   d0 = d;
                                   ret = {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                }
                            }
                            if (ret != null) {
                                return ret;
                            }
                        }
                        break;
                        
                    case $.jqplot.FunnelRenderer:
                        x = gridpos.x;
                        y = gridpos.y;
                        var v = s._vertices,
                            vfirst = v[0],
                            vlast = v[v.length-1],
                            lex,
                            rex,
                            cv;
    
                        // equations of right and left sides, returns x, y values given height of section (y value and 2 points)
    
                        function findedge (l, p1 , p2) {
                            var m = (p1[1] - p2[1])/(p1[0] - p2[0]);
                            var b = p1[1] - m*p1[0];
                            var y = l + p1[1];
        
                            return [(y - b)/m, y];
                        }
    
                        // check each section
                        lex = findedge(y, vfirst[0], vlast[3]);
                        rex = findedge(y, vfirst[1], vlast[2]);
                        for (j=0; j<v.length; j++) {
                            cv = v[j];
                            if (y >= cv[0][1] && y <= cv[3][1] && x >= lex[0] && x <= rex[0]) {
                                return {seriesIndex:s.index, pointIndex:j, gridData:null, data:s.data[j]};
                            }
                        }         
                        break;           
                    
                    case $.jqplot.LineRenderer:
                        x = gridpos.x;
                        y = gridpos.y;
                        r = s.renderer;
                        if (s.show) {
                            if ((s.fill || (s.renderer.bands.show && s.renderer.bands.fill)) && (!plot.plugins.highlighter || !plot.plugins.highlighter.show)) {
                                // first check if it is in bounding box
                                var inside = false;
                                if (x>s._boundingBox[0][0] && x<s._boundingBox[1][0] && y>s._boundingBox[1][1] && y<s._boundingBox[0][1]) { 
                                    // now check the crossing number   
                                    
                                    var numPoints = s._areaPoints.length;
                                    var ii;
                                    var j = numPoints-1;

                                    for(var ii=0; ii < numPoints; ii++) { 
                                        var vertex1 = [s._areaPoints[ii][0], s._areaPoints[ii][1]];
                                        var vertex2 = [s._areaPoints[j][0], s._areaPoints[j][1]];

                                        if (vertex1[1] < y && vertex2[1] >= y || vertex2[1] < y && vertex1[1] >= y)     {
                                            if (vertex1[0] + (y - vertex1[1]) / (vertex2[1] - vertex1[1]) * (vertex2[0] - vertex1[0]) < x) {
                                                inside = !inside;
                                            }
                                        }

                                        j = ii;
                                    }        
                                }
                                if (inside) {
                                    return {seriesIndex:i, pointIndex:null, gridData:s.gridData, data:s.data, points:s._areaPoints};
                                }
                                break;
                                
                            }

                            else {
                                t = s.markerRenderer.size/2+s.neighborThreshold;
                                threshold = (t > 0) ? t : 0;
                                for (var j=0; j<s.gridData.length; j++) {
                                    p = s.gridData[j];
                                    // neighbor looks different to OHLC chart.
                                    if (r.constructor == $.jqplot.OHLCRenderer) {
                                        if (r.candleStick) {
                                            var yp = s._yaxis.series_u2p;
                                            if (x >= p[0]-r._bodyWidth/2 && x <= p[0]+r._bodyWidth/2 && y >= yp(s.data[j][2]) && y <= yp(s.data[j][3])) {
                                                return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                            }
                                        }
                                        // if an open hi low close chart
                                        else if (!r.hlc){
                                            var yp = s._yaxis.series_u2p;
                                            if (x >= p[0]-r._tickLength && x <= p[0]+r._tickLength && y >= yp(s.data[j][2]) && y <= yp(s.data[j][3])) {
                                                return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                            }
                                        }
                                        // a hi low close chart
                                        else {
                                            var yp = s._yaxis.series_u2p;
                                            if (x >= p[0]-r._tickLength && x <= p[0]+r._tickLength && y >= yp(s.data[j][1]) && y <= yp(s.data[j][2])) {
                                                return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                            }
                                        }
                            
                                    }
                                    else if (p[0] != null && p[1] != null){
                                        d = Math.sqrt((x-p[0]) * (x-p[0]) + (y-p[1]) * (y-p[1]));
                                        if (d <= threshold && (d <= d0 || d0 == null)) {
                                            d0 = d;
                                            //return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                            returnDataArray.seriesIndex.push(i);
                                            returnDataArray.pointIndex.push(j);
                                            returnDataArray.gridData.push(p);
                                            returnDataArray.data.push(s.data[j]);
                                            if(i == 0)
                                                return returnDataArray;
                                            else{
                                                break;
                                            }
                                        }
                                    }
                                } 
                            }
                        }
                        break;
                        
                    default:
                        x = gridpos.x;
                        y = gridpos.y;
                        r = s.renderer;
                        if (s.show) {
                            t = s.markerRenderer.size/2+s.neighborThreshold;
                            threshold = (t > 0) ? t : 0;
                            for (var j=0; j<s.gridData.length; j++) {
                                p = s.gridData[j];
                                // neighbor looks different to OHLC chart.
                                if (r.constructor == $.jqplot.OHLCRenderer) {
                                    if (r.candleStick) {
                                        var yp = s._yaxis.series_u2p;
                                        if (x >= p[0]-r._bodyWidth/2 && x <= p[0]+r._bodyWidth/2 && y >= yp(s.data[j][2]) && y <= yp(s.data[j][3])) {
                                            return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                        }
                                    }
                                    // if an open hi low close chart
                                    else if (!r.hlc){
                                        var yp = s._yaxis.series_u2p;
                                        if (x >= p[0]-r._tickLength && x <= p[0]+r._tickLength && y >= yp(s.data[j][2]) && y <= yp(s.data[j][3])) {
                                            return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                        }
                                    }
                                    // a hi low close chart
                                    else {
                                        var yp = s._yaxis.series_u2p;
                                        if (x >= p[0]-r._tickLength && x <= p[0]+r._tickLength && y >= yp(s.data[j][1]) && y <= yp(s.data[j][2])) {
                                            return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                        }
                                    }
                            
                                }
                                else {
                                    d = Math.sqrt( (x-p[0]) * (x-p[0]) + (y-p[1]) * (y-p[1]) );
                                    if (d <= threshold && (d <= d0 || d0 == null)) {
                                       d0 = d;
                                       return {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                                    }
                                }
                            } 
                        }
                        break;
                }
            }
            if($.isEmptyObject(returnDataArray))
                return null;
            else
                return returnDataArray;
        }
        
        
        
        this.onClick = function(ev) {
            // Event passed in is normalized and will have data attribute.
            // Event passed out is unnormalized.
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = checkIntersection(positions.gridPos, p);
            var evt = $.Event('jqplotClick');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, neighbor, p]);
        };
        
        this.onDblClick = function(ev) {
            // Event passed in is normalized and will have data attribute.
            // Event passed out is unnormalized.
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = checkIntersection(positions.gridPos, p);
            var evt = $.Event('jqplotDblClick');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, neighbor, p]);
        };
        
        this.onMouseDown = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = checkIntersection(positions.gridPos, p);
            var evt = $.Event('jqplotMouseDown');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, neighbor, p]);
        };
        
        this.onMouseUp = function(ev) {
            var positions = getEventPosition(ev);
            var evt = $.Event('jqplotMouseUp');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, null, ev.data.plot]);
        };
        
        this.onRightClick = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = checkIntersection(positions.gridPos, p);
            if (p.captureRightClick) {
                if (ev.which == 3) {
                var evt = $.Event('jqplotRightClick');
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                    $(this).trigger(evt, [positions.gridPos, positions.dataPos, neighbor, p]);
                }
                else {
                var evt = $.Event('jqplotMouseUp');
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                    $(this).trigger(evt, [positions.gridPos, positions.dataPos, neighbor, p]);
                }
            }
        };
        
        this.onMouseMove = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = checkIntersection(positions.gridPos, p);
            var evt = $.Event('jqplotMouseMove');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, neighbor, p]);
        };
        
        this.onMouseEnter = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var evt = $.Event('jqplotMouseEnter');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            evt.relatedTarget = ev.relatedTarget;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, null, p]);
        };
        
        this.onMouseLeave = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var evt = $.Event('jqplotMouseLeave');
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            evt.relatedTarget = ev.relatedTarget;
            $(this).trigger(evt, [positions.gridPos, positions.dataPos, null, p]);
        };
        
        // method: drawSeries
        // Redraws all or just one series on the plot.  No axis scaling
        // is performed and no other elements on the plot are redrawn.
        // options is an options object to pass on to the series renderers.
        // It can be an empty object {}.  idx is the series index
        // to redraw if only one series is to be redrawn.
        this.drawSeries = function(options, idx){
            var i, series, ctx;
            // if only one argument passed in and it is a number, use it ad idx.
            idx = (typeof(options) === "number" && idx == null) ? options : idx;
            options = (typeof(options) === "object") ? options : {};
            // draw specified series
            if (idx != undefined) {
                series = this.series[idx];
                ctx = series.shadowCanvas._ctx;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                series.drawShadow(ctx, options, this);
                ctx = series.canvas._ctx;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                series.draw(ctx, options, this);
                if (series.renderer.constructor == $.jqplot.BezierCurveRenderer) {
                    if (idx < this.series.length - 1) {
                        this.drawSeries(idx+1); 
                    }
                }
            }
            
            else {
                // if call series drawShadow method first, in case all series shadows
                // should be drawn before any series.  This will ensure, like for 
                // stacked bar plots, that shadows don't overlap series.
                for (i=0; i<this.series.length; i++) {
                    // first clear the canvas
                    series = this.series[i];
                    ctx = series.shadowCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    series.drawShadow(ctx, options, this);
                    ctx = series.canvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    series.draw(ctx, options, this);
                }
            }
            options = idx = i = series = ctx = null;
        };
        
        // method: moveSeriesToFront
        // This method requires jQuery 1.4+
        // Moves the specified series canvas in front of all other series canvases.
        // This effectively "draws" the specified series on top of all other series,
        // although it is performed through DOM manipulation, no redrawing is performed.
        //
        // Parameters:
        // idx - 0 based index of the series to move.  This will be the index of the series
        // as it was first passed into the jqplot function.
        this.moveSeriesToFront = function (idx) { 
            idx = parseInt(idx, 10);
            var stackIndex = $.inArray(idx, this.seriesStack);
            // if already in front, return
            if (stackIndex == -1) {
                return;
            }
            if (stackIndex == this.seriesStack.length -1) {
                this.previousSeriesStack = this.seriesStack.slice(0);
                return;
            }
            var opidx = this.seriesStack[this.seriesStack.length -1];
            var serelem = this.series[idx].canvas._elem.detach();
            var shadelem = this.series[idx].shadowCanvas._elem.detach();
            this.series[opidx].shadowCanvas._elem.after(shadelem);
            this.series[opidx].canvas._elem.after(serelem);
            this.previousSeriesStack = this.seriesStack.slice(0);
            this.seriesStack.splice(stackIndex, 1);
            this.seriesStack.push(idx);
        };
        
        // method: moveSeriesToBack
        // This method requires jQuery 1.4+
        // Moves the specified series canvas behind all other series canvases.
        //
        // Parameters:
        // idx - 0 based index of the series to move.  This will be the index of the series
        // as it was first passed into the jqplot function.
        this.moveSeriesToBack = function (idx) {
            idx = parseInt(idx, 10);
            var stackIndex = $.inArray(idx, this.seriesStack);
            // if already in back, return
            if (stackIndex == 0 || stackIndex == -1) {
                return;
            }
            var opidx = this.seriesStack[0];
            var serelem = this.series[idx].canvas._elem.detach();
            var shadelem = this.series[idx].shadowCanvas._elem.detach();
            this.series[opidx].shadowCanvas._elem.before(shadelem);
            this.series[opidx].canvas._elem.before(serelem);
            this.previousSeriesStack = this.seriesStack.slice(0);
            this.seriesStack.splice(stackIndex, 1);
            this.seriesStack.unshift(idx);
        };
        
        // method: restorePreviousSeriesOrder
        // This method requires jQuery 1.4+
        // Restore the series canvas order to its previous state.
        // Useful to put a series back where it belongs after moving
        // it to the front.
        this.restorePreviousSeriesOrder = function () {
            var i, j, serelem, shadelem, temp, move, keep;
            // if no change, return.
            if (this.seriesStack == this.previousSeriesStack) {
                return;
            }
            for (i=1; i<this.previousSeriesStack.length; i++) {
                move = this.previousSeriesStack[i];
                keep = this.previousSeriesStack[i-1];
                serelem = this.series[move].canvas._elem.detach();
                shadelem = this.series[move].shadowCanvas._elem.detach();
                this.series[keep].shadowCanvas._elem.after(shadelem);
                this.series[keep].canvas._elem.after(serelem);
            }
            temp = this.seriesStack.slice(0);
            this.seriesStack = this.previousSeriesStack.slice(0);
            this.previousSeriesStack = temp;
        };
        
        // method: restoreOriginalSeriesOrder
        // This method requires jQuery 1.4+
        // Restore the series canvas order to its original order
        // when the plot was created.
        this.restoreOriginalSeriesOrder = function () {
            var i, j, arr=[], serelem, shadelem;
            for (i=0; i<this.series.length; i++) {
                arr.push(i);
            }
            if (this.seriesStack == arr) {
                return;
            }
            this.previousSeriesStack = this.seriesStack.slice(0);
            this.seriesStack = arr;
            for (i=1; i<this.seriesStack.length; i++) {
                serelem = this.series[i].canvas._elem.detach();
                shadelem = this.series[i].shadowCanvas._elem.detach();
                this.series[i-1].shadowCanvas._elem.after(shadelem);
                this.series[i-1].canvas._elem.after(serelem);
            }
        };
        
        this.activateTheme = function (name) {
            this.themeEngine.activate(this, name);
        };
    }
    
    
    // conpute a highlight color or array of highlight colors from given colors.
    $.jqplot.computeHighlightColors  = function(colors) {
        var ret;
        if ($.isArray(colors)) {
            ret = [];
            for (var i=0; i<colors.length; i++){
                var rgba = $.jqplot.getColorComponents(colors[i]);
                var newrgb = [rgba[0], rgba[1], rgba[2]];
                var sum = newrgb[0] + newrgb[1] + newrgb[2];
                for (var j=0; j<3; j++) {
                    // when darkening, lowest color component can be is 60.
                    newrgb[j] = (sum > 660) ?  newrgb[j] * 0.85 : 0.73 * newrgb[j] + 90;
                    newrgb[j] = parseInt(newrgb[j], 10);
                    (newrgb[j] > 255) ? 255 : newrgb[j];
                }
                // newrgb[3] = (rgba[3] > 0.4) ? rgba[3] * 0.4 : rgba[3] * 1.5;
                // newrgb[3] = (rgba[3] > 0.5) ? 0.8 * rgba[3] - .1 : rgba[3] + 0.2;
                newrgb[3] = 0.3 + 0.35 * rgba[3];
                ret.push('rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+newrgb[3]+')');
            }
        }
        else {
            var rgba = $.jqplot.getColorComponents(colors);
            var newrgb = [rgba[0], rgba[1], rgba[2]];
            var sum = newrgb[0] + newrgb[1] + newrgb[2];
            for (var j=0; j<3; j++) {
                // when darkening, lowest color component can be is 60.
                // newrgb[j] = (sum > 570) ?  newrgb[j] * 0.8 : newrgb[j] + 0.3 * (255 - newrgb[j]);
                // newrgb[j] = parseInt(newrgb[j], 10);
                newrgb[j] = (sum > 660) ?  newrgb[j] * 0.85 : 0.73 * newrgb[j] + 90;
                newrgb[j] = parseInt(newrgb[j], 10);
                (newrgb[j] > 255) ? 255 : newrgb[j];
            }
            // newrgb[3] = (rgba[3] > 0.4) ? rgba[3] * 0.4 : rgba[3] * 1.5;
            // newrgb[3] = (rgba[3] > 0.5) ? 0.8 * rgba[3] - .1 : rgba[3] + 0.2;
            newrgb[3] = 0.3 + 0.35 * rgba[3];
            ret = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+newrgb[3]+')';
        }
        return ret;
    };
        
   $.jqplot.ColorGenerator = function(colors) {
        colors = colors || $.jqplot.config.defaultColors;
        var idx = 0;
        
        this.next = function () { 
            if (idx < colors.length) {
                return colors[idx++];
            }
            else {
                idx = 0;
                return colors[idx++];
            }
        };
        
        this.previous = function () { 
            if (idx > 0) {
                return colors[idx--];
            }
            else {
                idx = colors.length-1;
                return colors[idx];
            }
        };
        
        // get a color by index without advancing pointer.
        this.get = function(i) {
            var idx = i - colors.length * Math.floor(i/colors.length);
            return colors[idx];
        };
        
        this.setColors = function(c) {
            colors = c;
        };
        
        this.reset = function() {
            idx = 0;
        };

        this.getIndex = function() {
            return idx;
        };

        this.setIndex = function(index) {
            idx = index;
        };
    };

    // convert a hex color string to rgb string.
    // h - 3 or 6 character hex string, with or without leading #
    // a - optional alpha
    $.jqplot.hex2rgb = function(h, a) {
        h = h.replace('#', '');
        if (h.length == 3) {
            h = h.charAt(0)+h.charAt(0)+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2);
        }
        var rgb;
        rgb = 'rgba('+parseInt(h.slice(0,2), 16)+', '+parseInt(h.slice(2,4), 16)+', '+parseInt(h.slice(4,6), 16);
        if (a) {
            rgb += ', '+a;
        }
        rgb += ')';
        return rgb;
    };
    
    // convert an rgb color spec to a hex spec.  ignore any alpha specification.
    $.jqplot.rgb2hex = function(s) {
        var pat = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/;
        var m = s.match(pat);
        var h = '#';
        for (var i=1; i<4; i++) {
            var temp;
            if (m[i].search(/%/) != -1) {
                temp = parseInt(255*m[i]/100, 10).toString(16);
                if (temp.length == 1) {
                    temp = '0'+temp;
                }
            }
            else {
                temp = parseInt(m[i], 10).toString(16);
                if (temp.length == 1) {
                    temp = '0'+temp;
                }
            }
            h += temp;
        }
        return h;
    };
    
    // given a css color spec, return an rgb css color spec
    $.jqplot.normalize2rgb = function(s, a) {
        if (s.search(/^ *rgba?\(/) != -1) {
            return s; 
        }
        else if (s.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/) != -1) {
            return $.jqplot.hex2rgb(s, a);
        }
        else {
            throw new Error('Invalid color spec');
        }
    };
    
    // extract the r, g, b, a color components out of a css color spec.
    $.jqplot.getColorComponents = function(s) {
        // check to see if a color keyword.
        s = $.jqplot.colorKeywordMap[s] || s;
        var rgb = $.jqplot.normalize2rgb(s);
        var pat = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/;
        var m = rgb.match(pat);
        var ret = [];
        for (var i=1; i<4; i++) {
            if (m[i].search(/%/) != -1) {
                ret[i-1] = parseInt(255*m[i]/100, 10);
            }
            else {
                ret[i-1] = parseInt(m[i], 10);
            }
        }
        ret[3] = parseFloat(m[4]) ? parseFloat(m[4]) : 1.0;
        return ret;
    };
    
    $.jqplot.colorKeywordMap = {
        aliceblue: 'rgb(240, 248, 255)',
        antiquewhite: 'rgb(250, 235, 215)',
        aqua: 'rgb( 0, 255, 255)',
        aquamarine: 'rgb(127, 255, 212)',
        azure: 'rgb(240, 255, 255)',
        beige: 'rgb(245, 245, 220)',
        bisque: 'rgb(255, 228, 196)',
        black: 'rgb( 0, 0, 0)',
        blanchedalmond: 'rgb(255, 235, 205)',
        blue: 'rgb( 0, 0, 255)',
        blueviolet: 'rgb(138, 43, 226)',
        brown: 'rgb(165, 42, 42)',
        burlywood: 'rgb(222, 184, 135)',
        cadetblue: 'rgb( 95, 158, 160)',
        chartreuse: 'rgb(127, 255, 0)',
        chocolate: 'rgb(210, 105, 30)',
        coral: 'rgb(255, 127, 80)',
        cornflowerblue: 'rgb(100, 149, 237)',
        cornsilk: 'rgb(255, 248, 220)',
        crimson: 'rgb(220, 20, 60)',
        cyan: 'rgb( 0, 255, 255)',
        darkblue: 'rgb( 0, 0, 139)',
        darkcyan: 'rgb( 0, 139, 139)',
        darkgoldenrod: 'rgb(184, 134, 11)',
        darkgray: 'rgb(169, 169, 169)',
        darkgreen: 'rgb( 0, 100, 0)',
        darkgrey: 'rgb(169, 169, 169)',
        darkkhaki: 'rgb(189, 183, 107)',
        darkmagenta: 'rgb(139, 0, 139)',
        darkolivegreen: 'rgb( 85, 107, 47)',
        darkorange: 'rgb(255, 140, 0)',
        darkorchid: 'rgb(153, 50, 204)',
        darkred: 'rgb(139, 0, 0)',
        darksalmon: 'rgb(233, 150, 122)',
        darkseagreen: 'rgb(143, 188, 143)',
        darkslateblue: 'rgb( 72, 61, 139)',
        darkslategray: 'rgb( 47, 79, 79)',
        darkslategrey: 'rgb( 47, 79, 79)',
        darkturquoise: 'rgb( 0, 206, 209)',
        darkviolet: 'rgb(148, 0, 211)',
        deeppink: 'rgb(255, 20, 147)',
        deepskyblue: 'rgb( 0, 191, 255)',
        dimgray: 'rgb(105, 105, 105)',
        dimgrey: 'rgb(105, 105, 105)',
        dodgerblue: 'rgb( 30, 144, 255)',
        firebrick: 'rgb(178, 34, 34)',
        floralwhite: 'rgb(255, 250, 240)',
        forestgreen: 'rgb( 34, 139, 34)',
        fuchsia: 'rgb(255, 0, 255)',
        gainsboro: 'rgb(220, 220, 220)',
        ghostwhite: 'rgb(248, 248, 255)',
        gold: 'rgb(255, 215, 0)',
        goldenrod: 'rgb(218, 165, 32)',
        gray: 'rgb(128, 128, 128)',
        grey: 'rgb(128, 128, 128)',
        green: 'rgb( 0, 128, 0)',
        greenyellow: 'rgb(173, 255, 47)',
        honeydew: 'rgb(240, 255, 240)',
        hotpink: 'rgb(255, 105, 180)',
        indianred: 'rgb(205, 92, 92)',
        indigo: 'rgb( 75, 0, 130)',
        ivory: 'rgb(255, 255, 240)',
        khaki: 'rgb(240, 230, 140)',
        lavender: 'rgb(230, 230, 250)',
        lavenderblush: 'rgb(255, 240, 245)',
        lawngreen: 'rgb(124, 252, 0)',
        lemonchiffon: 'rgb(255, 250, 205)',
        lightblue: 'rgb(173, 216, 230)',
        lightcoral: 'rgb(240, 128, 128)',
        lightcyan: 'rgb(224, 255, 255)',
        lightgoldenrodyellow: 'rgb(250, 250, 210)',
        lightgray: 'rgb(211, 211, 211)',
        lightgreen: 'rgb(144, 238, 144)',
        lightgrey: 'rgb(211, 211, 211)',
        lightpink: 'rgb(255, 182, 193)',
        lightsalmon: 'rgb(255, 160, 122)',
        lightseagreen: 'rgb( 32, 178, 170)',
        lightskyblue: 'rgb(135, 206, 250)',
        lightslategray: 'rgb(119, 136, 153)',
        lightslategrey: 'rgb(119, 136, 153)',
        lightsteelblue: 'rgb(176, 196, 222)',
        lightyellow: 'rgb(255, 255, 224)',
        lime: 'rgb( 0, 255, 0)',
        limegreen: 'rgb( 50, 205, 50)',
        linen: 'rgb(250, 240, 230)',
        magenta: 'rgb(255, 0, 255)',
        maroon: 'rgb(128, 0, 0)',
        mediumaquamarine: 'rgb(102, 205, 170)',
        mediumblue: 'rgb( 0, 0, 205)',
        mediumorchid: 'rgb(186, 85, 211)',
        mediumpurple: 'rgb(147, 112, 219)',
        mediumseagreen: 'rgb( 60, 179, 113)',
        mediumslateblue: 'rgb(123, 104, 238)',
        mediumspringgreen: 'rgb( 0, 250, 154)',
        mediumturquoise: 'rgb( 72, 209, 204)',
        mediumvioletred: 'rgb(199, 21, 133)',
        midnightblue: 'rgb( 25, 25, 112)',
        mintcream: 'rgb(245, 255, 250)',
        mistyrose: 'rgb(255, 228, 225)',
        moccasin: 'rgb(255, 228, 181)',
        navajowhite: 'rgb(255, 222, 173)',
        navy: 'rgb( 0, 0, 128)',
        oldlace: 'rgb(253, 245, 230)',
        olive: 'rgb(128, 128, 0)',
        olivedrab: 'rgb(107, 142, 35)',
        orange: 'rgb(255, 165, 0)',
        orangered: 'rgb(255, 69, 0)',
        orchid: 'rgb(218, 112, 214)',
        palegoldenrod: 'rgb(238, 232, 170)',
        palegreen: 'rgb(152, 251, 152)',
        paleturquoise: 'rgb(175, 238, 238)',
        palevioletred: 'rgb(219, 112, 147)',
        papayawhip: 'rgb(255, 239, 213)',
        peachpuff: 'rgb(255, 218, 185)',
        peru: 'rgb(205, 133, 63)',
        pink: 'rgb(255, 192, 203)',
        plum: 'rgb(221, 160, 221)',
        powderblue: 'rgb(176, 224, 230)',
        purple: 'rgb(128, 0, 128)',
        red: 'rgb(255, 0, 0)',
        rosybrown: 'rgb(188, 143, 143)',
        royalblue: 'rgb( 65, 105, 225)',
        saddlebrown: 'rgb(139, 69, 19)',
        salmon: 'rgb(250, 128, 114)',
        sandybrown: 'rgb(244, 164, 96)',
        seagreen: 'rgb( 46, 139, 87)',
        seashell: 'rgb(255, 245, 238)',
        sienna: 'rgb(160, 82, 45)',
        silver: 'rgb(192, 192, 192)',
        skyblue: 'rgb(135, 206, 235)',
        slateblue: 'rgb(106, 90, 205)',
        slategray: 'rgb(112, 128, 144)',
        slategrey: 'rgb(112, 128, 144)',
        snow: 'rgb(255, 250, 250)',
        springgreen: 'rgb( 0, 255, 127)',
        steelblue: 'rgb( 70, 130, 180)',
        tan: 'rgb(210, 180, 140)',
        teal: 'rgb( 0, 128, 128)',
        thistle: 'rgb(216, 191, 216)',
        tomato: 'rgb(255, 99, 71)',
        turquoise: 'rgb( 64, 224, 208)',
        violet: 'rgb(238, 130, 238)',
        wheat: 'rgb(245, 222, 179)',
        white: 'rgb(255, 255, 255)',
        whitesmoke: 'rgb(245, 245, 245)',
        yellow: 'rgb(255, 255, 0)',
        yellowgreen: 'rgb(154, 205, 50)'
    };

    


    // class: $.jqplot.AxisLabelRenderer
    // Renderer to place labels on the axes.
    $.jqplot.AxisLabelRenderer = function(options) {
        // Group: Properties
        $.jqplot.ElemContainer.call(this);
        // name of the axis associated with this tick
        this.axis;
        // prop: show
        // whether or not to show the tick (mark and label).
        this.show = true;
        // prop: label
        // The text or html for the label.
        this.label = '';
        this.fontFamily = null;
        this.fontSize = null;
        this.textColor = null;
        this._elem;
        // prop: escapeHTML
        // true to escape HTML entities in the label.
        this.escapeHTML = false;
        
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisLabelRenderer.prototype = new $.jqplot.ElemContainer();
    $.jqplot.AxisLabelRenderer.prototype.constructor = $.jqplot.AxisLabelRenderer;
    
    $.jqplot.AxisLabelRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisLabelRenderer.prototype.draw = function(ctx, plot) {
        // Memory Leaks patch
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }

        this._elem = $('<div style="position:absolute;" class="jqplot-'+this.axis+'-label"></div>');
        
        if (Number(this.label)) {
            this._elem.css('white-space', 'nowrap');
        }
        
        if (!this.escapeHTML) {
            this._elem.html(this.label);
        }
        else {
            this._elem.text(this.label);
        }
        if (this.fontFamily) {
            this._elem.css('font-family', this.fontFamily);
        }
        if (this.fontSize) {
            this._elem.css('font-size', this.fontSize);
        }
        if (this.textColor) {
            this._elem.css('color', this.textColor);
        }
        
        return this._elem;
    };
    
    $.jqplot.AxisLabelRenderer.prototype.pack = function() {
    };

    // class: $.jqplot.AxisTickRenderer
    // A "tick" object showing the value of a tick/gridline on the plot.
    $.jqplot.AxisTickRenderer = function(options) {
        // Group: Properties
        $.jqplot.ElemContainer.call(this);
        // prop: mark
        // tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
        this.mark = 'outside';
        // name of the axis associated with this tick
        this.axis;
        // prop: showMark
        // whether or not to show the mark on the axis.
        this.showMark = true;
        // prop: showGridline
        // whether or not to draw the gridline on the grid at this tick.
        this.showGridline = true;
        // prop: isMinorTick
        // if this is a minor tick.
        this.isMinorTick = false;
        // prop: size
        // Length of the tick beyond the grid in pixels.
        // DEPRECATED: This has been superceeded by markSize
        this.size = 4;
        // prop:  markSize
        // Length of the tick marks in pixels.  For 'cross' style, length
        // will be stoked above and below axis, so total length will be twice this.
        this.markSize = 6;
        // prop: show
        // whether or not to show the tick (mark and label).
        // Setting this to false requires more testing.  It is recommended
        // to set showLabel and showMark to false instead.
        this.show = true;
        // prop: showLabel
        // whether or not to show the label.
        this.showLabel = true;
        this.label = null;
        this.value = null;
        this._styles = {};
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: prefix
        // String to prepend to the tick label.
        // Prefix is prepended to the formatted tick label.
        this.prefix = '';
        // prop: suffix
        // String to append to the tick label.
        // Suffix is appended to the formatted tick label.
        this.suffix = '';
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily;
        // prop: fontSize
        // css spec for the font-size css attribute.
        this.fontSize;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor;
        // prop: escapeHTML
        // true to escape HTML entities in the label.
        this.escapeHTML = false;
        this._elem;
        this._breakTick = false;
        
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisTickRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    $.jqplot.AxisTickRenderer.prototype = new $.jqplot.ElemContainer();
    $.jqplot.AxisTickRenderer.prototype.constructor = $.jqplot.AxisTickRenderer;
    
    $.jqplot.AxisTickRenderer.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        this.axis = axisName;
        if (isMinor) {
            this.isMinorTick = true;
        }
        return this;
    };
    
    $.jqplot.AxisTickRenderer.prototype.draw = function() {
        if (this.label === null) {
            this.label = this.prefix + this.formatter(this.formatString, this.value) + this.suffix;
        }
        var style = {position: 'absolute'};
        if (Number(this.label)) {
            style['whitSpace'] = 'nowrap';
        }
        
        // Memory Leaks patch
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }

        this._elem = $(document.createElement('div'));
        this._elem.addClass("jqplot-"+this.axis+"-tick");
        
        if (!this.escapeHTML) {
            this._elem.html(this.label);
        }
        else {
            this._elem.text(this.label);
        }
        
        this._elem.css(style);

        for (var s in this._styles) {
            this._elem.css(s, this._styles[s]);
        }
        if (this.fontFamily) {
            this._elem.css('font-family', this.fontFamily);
        }
        if (this.fontSize) {
            this._elem.css('font-size', this.fontSize);
        }
        if (this.textColor) {
            this._elem.css('color', this.textColor);
        }
        if (this._breakTick) {
          this._elem.addClass('jqplot-breakTick');
        }
        
        return this._elem;
    };
        
    $.jqplot.DefaultTickFormatter = function (format, val) {
        if (typeof val == 'number') {
            if (!format) {
                format = $.jqplot.config.defaultTickFormatString;
            }
            return $.jqplot.sprintf(format, val);
        }
        else {
            return String(val);
        }
    };
        
    $.jqplot.PercentTickFormatter = function (format, val) {
        if (typeof val == 'number') {
            val = 100 * val;
            if (!format) {
                format = $.jqplot.config.defaultTickFormatString;
            }
            return $.jqplot.sprintf(format, val);
        }
        else {
            return String(val);
        }
    };
    
    $.jqplot.AxisTickRenderer.prototype.pack = function() {
    };
     
    // Class: $.jqplot.CanvasGridRenderer
    // The default jqPlot grid renderer, creating a grid on a canvas element.
    // The renderer has no additional options beyond the <Grid> class.
    $.jqplot.CanvasGridRenderer = function(){
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
    };
    
    // called with context of Grid object
    $.jqplot.CanvasGridRenderer.prototype.init = function(options) {
        this._ctx;
        $.extend(true, this, options);
        // set the shadow renderer options
        var sopts = {lineJoin:'miter', lineCap:'round', fill:false, isarc:false, angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, depth:this.shadowDepth, lineWidth:this.shadowWidth, closePath:false, strokeStyle:this.shadowColor};
        this.renderer.shadowRenderer.init(sopts);
    };
    
    // called with context of Grid.
    $.jqplot.CanvasGridRenderer.prototype.createElement = function(plot) {
        var elem;
        // Memory Leaks patch
        if (this._elem) {
          if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
            elem = this._elem.get(0);
            window.G_vmlCanvasManager.uninitElement(elem);
            elem = null;
          }
          
          this._elem.emptyForce();
          this._elem = null;
        }
      
        elem = plot.canvasManager.getCanvas();

        var w = this._plotDimensions.width;
        var h = this._plotDimensions.height;
        elem.width = w;
        elem.height = h;
        this._elem = $(elem);
        this._elem.addClass('jqplot-grid-canvas');
        this._elem.css({ position: 'absolute', left: 0, top: 0 });
        
        elem = plot.canvasManager.initCanvas(elem);

        this._top = this._offsets.top;
        this._bottom = h - this._offsets.bottom;
        this._left = this._offsets.left;
        this._right = w - this._offsets.right;
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        // avoid memory leak
        elem = null;
        return this._elem;
    };
    
    $.jqplot.CanvasGridRenderer.prototype.draw = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        var ctx = this._ctx;
        var axes = this._axes;
        // Add the grid onto the grid canvas.  This is the bottom most layer.
        ctx.save();
        ctx.clearRect(0, 0, this._plotDimensions.width, this._plotDimensions.height);
        ctx.fillStyle = this.backgroundColor || this.background;
        ctx.fillRect(this._left, this._top, this._width, this._height);
        
        ctx.save();
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'butt';
        ctx.lineWidth = this.gridLineWidth;
        ctx.strokeStyle = this.gridLineColor;
        var b, e, s, m;
        var ax = ['xaxis', 'yaxis', 'x2axis', 'y2axis'];
        for (var i=4; i>0; i--) {
            var name = ax[i-1];
            var axis = axes[name];
            var ticks = axis._ticks;
            var numticks = ticks.length;
            if (axis.show) {
                if (axis.drawBaseline) {
                    var bopts = {};
                    if (axis.baselineWidth !== null) {
                        bopts.lineWidth = axis.baselineWidth;
                    }
                    if (axis.baselineColor !== null) {
                        bopts.strokeStyle = axis.baselineColor;
                    }
                    switch (name) {
                        case 'xaxis':
                            drawLine (this._left, this._bottom, this._right, this._bottom, bopts);
                            break;
                        case 'yaxis':
                            drawLine (this._left, this._bottom, this._left, this._top, bopts);
                            break;
                        case 'x2axis':
                            drawLine (this._left, this._bottom, this._right, this._bottom, bopts);
                            break;
                        case 'y2axis':
                            drawLine (this._right, this._bottom, this._right, this._top, bopts);
                            break;
                    }
                }
                for (var j=numticks; j>0; j--) {
                    var t = ticks[j-1];
                    if (t.show) {
                        var pos = Math.round(axis.u2p(t.value)) + 0.5;
                        switch (name) {
                            case 'xaxis':
                                // draw the grid line if we should
                                if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines)) ) {
                                    drawLine(pos, this._top, pos, this._bottom);
                                }
                                // draw the mark
                                if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks)) ) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._bottom;
                                            e = this._bottom+s;
                                            break;
                                        case 'inside':
                                            b = this._bottom-s;
                                            e = this._bottom;
                                            break;
                                        case 'cross':
                                            b = this._bottom-s;
                                            e = this._bottom+s;
                                            break;
                                        default:
                                            b = this._bottom;
                                            e = this._bottom+s;
                                            break;
                                    }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[pos,b],[pos,e]], {lineCap:'butt', lineWidth:this.gridLineWidth, offset:this.gridLineWidth*0.75, depth:2, fill:false, closePath:false});
                                    }
                                    // draw the line
                                    drawLine(pos, b, pos, e);
                                }
                                break;
                            case 'yaxis':
                                // draw the grid line
                                if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines)) ) {
                                    drawLine(this._right, pos, this._left, pos);
                                }
                                // draw the mark
                                if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks)) ) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._left-s;
                                            e = this._left;
                                            break;
                                        case 'inside':
                                            b = this._left;
                                            e = this._left+s;
                                            break;
                                        case 'cross':
                                            b = this._left-s;
                                            e = this._left+s;
                                            break;
                                        default:
                                            b = this._left-s;
                                            e = this._left;
                                            break;
                                            }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap:'butt', lineWidth:this.gridLineWidth*1.5, offset:this.gridLineWidth*0.75, fill:false, closePath:false});
                                    }
                                    drawLine(b, pos, e, pos, {strokeStyle:axis.borderColor});
                                }
                                break;
                            case 'x2axis':
                                // draw the grid line
                                if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines)) ) {
                                    drawLine(pos, this._bottom, pos, this._top);
                                }
                                // draw the mark
                                if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks)) ) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._top-s;
                                            e = this._top;
                                            break;
                                        case 'inside':
                                            b = this._top;
                                            e = this._top+s;
                                            break;
                                        case 'cross':
                                            b = this._top-s;
                                            e = this._top+s;
                                            break;
                                        default:
                                            b = this._top-s;
                                            e = this._top;
                                            break;
                                            }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[pos,b],[pos,e]], {lineCap:'butt', lineWidth:this.gridLineWidth, offset:this.gridLineWidth*0.75, depth:2, fill:false, closePath:false});
                                    }
                                    drawLine(pos, b, pos, e);
                                }
                                break;
                            case 'y2axis':
                                // draw the grid line
                                if (t.showGridline && this.drawGridlines && ((!t.isMinorTick && axis.drawMajorGridlines) || (t.isMinorTick && axis.drawMinorGridlines)) ) {
                                    drawLine(this._left, pos, this._right, pos);
                                }
                                // draw the mark
                                if (t.showMark && t.mark && ((!t.isMinorTick && axis.drawMajorTickMarks) || (t.isMinorTick && axis.drawMinorTickMarks)) ) {
                                    s = t.markSize;
                                    m = t.mark;
                                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                                    switch (m) {
                                        case 'outside':
                                            b = this._right;
                                            e = this._right+s;
                                            break;
                                        case 'inside':
                                            b = this._right-s;
                                            e = this._right;
                                            break;
                                        case 'cross':
                                            b = this._right-s;
                                            e = this._right+s;
                                            break;
                                        default:
                                            b = this._right;
                                            e = this._right+s;
                                            break;
                                            }
                                    // draw the shadow
                                    if (this.shadow) {
                                        this.renderer.shadowRenderer.draw(ctx, [[b, pos], [e, pos]], {lineCap:'butt', lineWidth:this.gridLineWidth*1.5, offset:this.gridLineWidth*0.75, fill:false, closePath:false});
                                    }
                                    drawLine(b, pos, e, pos, {strokeStyle:axis.borderColor});
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                t = null;
            }
            axis = null;
            ticks = null;
        }
        // Now draw grid lines for additional y axes
        //////
        // TO DO: handle yMidAxis
        //////
        ax = ['y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis', 'yMidAxis'];
        for (var i=7; i>0; i--) {
            var axis = axes[ax[i-1]];
            var ticks = axis._ticks;
            if (axis.show) {
                var tn = ticks[axis.numberTicks-1];
                var t0 = ticks[0];
                var left = axis.getLeft();
                var points = [[left, tn.getTop() + tn.getHeight()/2], [left, t0.getTop() + t0.getHeight()/2 + 1.0]];
                // draw the shadow
                if (this.shadow) {
                    this.renderer.shadowRenderer.draw(ctx, points, {lineCap:'butt', fill:false, closePath:false});
                }
                // draw the line
                drawLine(points[0][0], points[0][1], points[1][0], points[1][1], {lineCap:'butt', strokeStyle:axis.borderColor, lineWidth:axis.borderWidth});
                // draw the tick marks
                for (var j=ticks.length; j>0; j--) {
                    var t = ticks[j-1];
                    s = t.markSize;
                    m = t.mark;
                    var pos = Math.round(axis.u2p(t.value)) + 0.5;
                    if (t.showMark && t.mark) {
                        switch (m) {
                            case 'outside':
                                b = left;
                                e = left+s;
                                break;
                            case 'inside':
                                b = left-s;
                                e = left;
                                break;
                            case 'cross':
                                b = left-s;
                                e = left+s;
                                break;
                            default:
                                b = left;
                                e = left+s;
                                break;
                        }
                        points = [[b,pos], [e,pos]];
                        // draw the shadow
                        if (this.shadow) {
                            this.renderer.shadowRenderer.draw(ctx, points, {lineCap:'butt', lineWidth:this.gridLineWidth*1.5, offset:this.gridLineWidth*0.75, fill:false, closePath:false});
                        }
                        // draw the line
                        drawLine(b, pos, e, pos, {strokeStyle:axis.borderColor});
                    }
                    t = null;
                }
                t0 = null;
            }
            axis = null;
            ticks =  null;
        }
        
        ctx.restore();
        
        function drawLine(bx, by, ex, ey, opts) {
            ctx.save();
            opts = opts || {};
            if (opts.lineWidth == null || opts.lineWidth != 0){
                $.extend(true, ctx, opts);
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(ex, ey);
                ctx.stroke();
                ctx.restore();
            }
        }
        
        if (this.shadow) {
            var points = [[this._left, this._bottom], [this._right, this._bottom], [this._right, this._top]];
            this.renderer.shadowRenderer.draw(ctx, points);
        }
        // Now draw border around grid.  Use axis border definitions. start at
        // upper left and go clockwise.
        if (this.borderWidth != 0 && this.drawBorder) {
            drawLine (this._left, this._top, this._right, this._top, {lineCap:'round', strokeStyle:axes.x2axis.borderColor, lineWidth:axes.x2axis.borderWidth});
            drawLine (this._right, this._top, this._right, this._bottom, {lineCap:'round', strokeStyle:axes.y2axis.borderColor, lineWidth:axes.y2axis.borderWidth});
            drawLine (this._right, this._bottom, this._left, this._bottom, {lineCap:'round', strokeStyle:axes.xaxis.borderColor, lineWidth:axes.xaxis.borderWidth});
            drawLine (this._left, this._bottom, this._left, this._top, {lineCap:'round', strokeStyle:axes.yaxis.borderColor, lineWidth:axes.yaxis.borderWidth});
        }
        // ctx.lineWidth = this.borderWidth;
        // ctx.strokeStyle = this.borderColor;
        // ctx.strokeRect(this._left, this._top, this._width, this._height);
        
        ctx.restore();
        ctx =  null;
        axes = null;
    };
 
    // Class: $.jqplot.DivTitleRenderer
    // The default title renderer for jqPlot.  This class has no options beyond the <Title> class. 
    $.jqplot.DivTitleRenderer = function() {
    };
    
    $.jqplot.DivTitleRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    $.jqplot.DivTitleRenderer.prototype.draw = function() {
        // Memory Leaks patch
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }

        var r = this.renderer;
        var elem = document.createElement('div');
        this._elem = $(elem);
        this._elem.addClass('jqplot-title');

        if (!this.text) {
            this.show = false;
            this._elem.height(0);
            this._elem.width(0);
        }
        else if (this.text) {
            var color;
            if (this.color) {
                color = this.color;
            }
            else if (this.textColor) {
                color = this.textColor;
            }

            // don't trust that a stylesheet is present, set the position.
            var styles = {position:'absolute', top:'0px', left:'0px'};

            if (this._plotWidth) {
                styles['width'] = this._plotWidth+'px';
            }
            if (this.fontSize) {
                styles['fontSize'] = this.fontSize;
            }
            if (typeof this.textAlign === 'string') {
                styles['textAlign'] = this.textAlign;
            }
            else {
                styles['textAlign'] = 'center';
            }
            if (color) {
                styles['color'] = color;
            }
            if (this.paddingBottom) {
                styles['paddingBottom'] = this.paddingBottom;
            }
            if (this.fontFamily) {
                styles['fontFamily'] = this.fontFamily;
            }

            this._elem.css(styles);
            if (this.escapeHtml) {
                this._elem.text(this.text);
            }
            else {
                this._elem.html(this.text);
            }


            // styletext += (this._plotWidth) ? 'width:'+this._plotWidth+'px;' : '';
            // styletext += (this.fontSize) ? 'font-size:'+this.fontSize+';' : '';
            // styletext += (this.textAlign) ? 'text-align:'+this.textAlign+';' : 'text-align:center;';
            // styletext += (color) ? 'color:'+color+';' : '';
            // styletext += (this.paddingBottom) ? 'padding-bottom:'+this.paddingBottom+';' : '';
            // this._elem = $('<div class="jqplot-title" style="'+styletext+'">'+this.text+'</div>');
            // if (this.fontFamily) {
            //     this._elem.css('font-family', this.fontFamily);
            // }
        }

        elem = null;
        
        return this._elem;
    };
    
    $.jqplot.DivTitleRenderer.prototype.pack = function() {
        // nothing to do here
    };
  

    var dotlen = 0.1;

    $.jqplot.LinePattern = function (ctx, pattern) {

        var defaultLinePatterns = {
            dotted: [ dotlen, $.jqplot.config.dotGapLength ],
            dashed: [ $.jqplot.config.dashLength, $.jqplot.config.gapLength ],
            solid: null
        };

        if (typeof pattern === 'string') {
            if (pattern[0] === '.' || pattern[0] === '-') {
                var s = pattern;
                pattern = [];
                for (var i=0, imax=s.length; i<imax; i++) {
                    if (s[i] === '.') {
                        pattern.push( dotlen );
                    }
                    else if (s[i] === '-') {
                        pattern.push( $.jqplot.config.dashLength );
                    }
                    else {
                        continue;
                    }
                    pattern.push( $.jqplot.config.gapLength );
                }
            }
            else {
                pattern = defaultLinePatterns[pattern];
            }
        }

        if (!(pattern && pattern.length)) {
            return ctx;
        }

        var patternIndex = 0;
        var patternDistance = pattern[0];
        var px = 0;
        var py = 0;
        var pathx0 = 0;
        var pathy0 = 0;

        var moveTo = function (x, y) {
            ctx.moveTo( x, y );
            px = x;
            py = y;
            pathx0 = x;
            pathy0 = y;
        };

        var lineTo = function (x, y) {
            var scale = ctx.lineWidth;
            var dx = x - px;
            var dy = y - py;
            var dist = Math.sqrt(dx*dx+dy*dy);
            if ((dist > 0) && (scale > 0)) {
                dx /= dist;
                dy /= dist;
                while (true) {
                    var dp = scale * patternDistance;
                    if (dp < dist) {
                        px += dp * dx;
                        py += dp * dy;
                        if ((patternIndex & 1) == 0) {
                            ctx.lineTo( px, py );
                        }
                        else {
                            ctx.moveTo( px, py );
                        }
                        dist -= dp;
                        patternIndex++;
                        if (patternIndex >= pattern.length) {
                            patternIndex = 0;
                        }
                        patternDistance = pattern[patternIndex];
                    }
                    else {
                        px = x;
                        py = y;
                        if ((patternIndex & 1) == 0) {
                            ctx.lineTo( px, py );
                        }
                        else {
                            ctx.moveTo( px, py );
                        }
                        patternDistance -= dist / scale;
                        break;
                    }
                }
            }
        };

        var beginPath = function () {
            ctx.beginPath();
        };

        var closePath = function () {
            lineTo( pathx0, pathy0 );
        };

        return {
            moveTo: moveTo,
            lineTo: lineTo,
            beginPath: beginPath,
            closePath: closePath
        };
    };

    // Class: $.jqplot.LineRenderer
    // The default line renderer for jqPlot, this class has no options beyond the <Series> class.
    // Draws series as a line.
    $.jqplot.LineRenderer = function(){
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
    };
    
    // called with scope of series.
    $.jqplot.LineRenderer.prototype.init = function(options, plot) {
        // Group: Properties
        //
        options = options || {};
        this._type='line';
        this.renderer.animation = {
            show: false,
            direction: 'left',
            speed: 2500,
            _supported: true
        };
        // prop: smooth
        // True to draw a smoothed (interpolated) line through the data points
        // with automatically computed number of smoothing points.
        // Set to an integer number > 2 to specify number of smoothing points
        // to use between each data point.
        this.renderer.smooth = false;  // true or a number > 2 for smoothing.
        this.renderer.tension = null; // null to auto compute or a number typically > 6.  Fewer points requires higher tension.
        // prop: constrainSmoothing
        // True to use a more accurate smoothing algorithm that will
        // not overshoot any data points.  False to allow overshoot but
        // produce a smoother looking line.
        this.renderer.constrainSmoothing = true;
        // this is smoothed data in grid coordinates, like gridData
        this.renderer._smoothedData = [];
        // this is smoothed data in plot units (plot coordinates), like plotData.
        this.renderer._smoothedPlotData = [];
        this.renderer._hiBandGridData = [];
        this.renderer._lowBandGridData = [];
        this.renderer._hiBandSmoothedData = [];
        this.renderer._lowBandSmoothedData = [];

        // prop: bandData
        // Data used to draw error bands or confidence intervals above/below a line.
        //
        // bandData can be input in 3 forms.  jqPlot will figure out which is the
        // low band line and which is the high band line for all forms:
        // 
        // A 2 dimensional array like [[yl1, yl2, ...], [yu1, yu2, ...]] where
        // [yl1, yl2, ...] are y values of the lower line and
        // [yu1, yu2, ...] are y values of the upper line.
        // In this case there must be the same number of y data points as data points
        // in the series and the bands will inherit the x values of the series.
        //
        // A 2 dimensional array like [[[xl1, yl1], [xl2, yl2], ...], [[xh1, yh1], [xh2, yh2], ...]]
        // where [xl1, yl1] are x,y data points for the lower line and
        // [xh1, yh1] are x,y data points for the high line.
        // x values do not have to correspond to the x values of the series and can
        // be of any arbitrary length.
        //
        // Can be of form [[yl1, yu1], [yl2, yu2], [yl3, yu3], ...] where
        // there must be 3 or more arrays and there must be the same number of arrays
        // as there are data points in the series.  In this case, 
        // [yl1, yu1] specifies the lower and upper y values for the 1st
        // data point and so on.  The bands will inherit the x
        // values from the series.
        this.renderer.bandData = [];

        // Group: bands
        // Banding around line, e.g error bands or confidence intervals.
        this.renderer.bands = {
            // prop: show
            // true to show the bands.  If bandData or interval is
            // supplied, show will be set to true by default.
            show: false,
            hiData: [],
            lowData: [],
            // prop: color
            // color of lines at top and bottom of bands [default: series color].
            color: this.color,
            // prop: showLines
            // True to show lines at top and bottom of bands [default: false].
            showLines: false,
            // prop: fill
            // True to fill area between bands [default: true].
            fill: true,
            // prop: fillColor
            // css color spec for filled area.  [default: series color].
            fillColor: null,
            _min: null,
            _max: null,
            // prop: interval
            // User specified interval above and below line for bands [default: '3%''].
            // Can be a value like 3 or a string like '3%' 
            // or an upper/lower array like [1, -2] or ['2%', '-1.5%']
            interval: '3%'
        };


        var lopts = {highlightMouseOver: options.highlightMouseOver, highlightMouseDown: options.highlightMouseDown, highlightColor: options.highlightColor};
        
        delete (options.highlightMouseOver);
        delete (options.highlightMouseDown);
        delete (options.highlightColor);
        
        $.extend(true, this.renderer, options);

        this.renderer.options = options;

        // if we are given some band data, and bands aren't explicity set to false in options, turn them on.
        if (this.renderer.bandData.length > 1 && (!options.bands || options.bands.show == null)) {
            this.renderer.bands.show = true;
        }

        // if we are given an interval, and bands aren't explicity set to false in options, turn them on.
        else if (options.bands && options.bands.show == null && options.bands.interval != null) {
            this.renderer.bands.show = true;
        }

        // if plot is filled, turn off bands.
        if (this.fill) {
            this.renderer.bands.show = false;
        }

        if (this.renderer.bands.show) {
            this.renderer.initBands.call(this, this.renderer.options, plot);
        }


        // smoothing is not compatible with stacked lines, disable
        if (this._stack) {
            this.renderer.smooth = false;
        }

        // set the shape renderer options
        var opts = {lineJoin:this.lineJoin, lineCap:this.lineCap, fill:this.fill, isarc:false, strokeStyle:this.color, fillStyle:this.fillColor, lineWidth:this.lineWidth, linePattern:this.linePattern, closePath:this.fill};
        this.renderer.shapeRenderer.init(opts);

        var shadow_offset = options.shadowOffset;
        // set the shadow renderer options
        if (shadow_offset == null) {
            // scale the shadowOffset to the width of the line.
            if (this.lineWidth > 2.5) {
                shadow_offset = 1.25 * (1 + (Math.atan((this.lineWidth/2.5))/0.785398163 - 1)*0.6);
                // var shadow_offset = this.shadowOffset;
            }
            // for skinny lines, don't make such a big shadow.
            else {
                shadow_offset = 1.25 * Math.atan((this.lineWidth/2.5))/0.785398163;
            }
        }
        
        var sopts = {lineJoin:this.lineJoin, lineCap:this.lineCap, fill:this.fill, isarc:false, angle:this.shadowAngle, offset:shadow_offset, alpha:this.shadowAlpha, depth:this.shadowDepth, lineWidth:this.lineWidth, linePattern:this.linePattern, closePath:this.fill};
        this.renderer.shadowRenderer.init(sopts);
        this._areaPoints = [];
        this._boundingBox = [[],[]];
        
        if (!this.isTrendline && this.fill || this.renderer.bands.show) {
            // Group: Properties
            //        
            // prop: highlightMouseOver
            // True to highlight area on a filled plot when moused over.
            // This must be false to enable highlightMouseDown to highlight when clicking on an area on a filled plot.
            this.highlightMouseOver = true;
            // prop: highlightMouseDown
            // True to highlight when a mouse button is pressed over an area on a filled plot.
            // This will be disabled if highlightMouseOver is true.
            this.highlightMouseDown = false;
            // prop: highlightColor
            // color to use when highlighting an area on a filled plot.
            this.highlightColor = null;
            // if user has passed in highlightMouseDown option and not set highlightMouseOver, disable highlightMouseOver
            if (lopts.highlightMouseDown && lopts.highlightMouseOver == null) {
                lopts.highlightMouseOver = false;
            }
        
            $.extend(true, this, {highlightMouseOver: lopts.highlightMouseOver, highlightMouseDown: lopts.highlightMouseDown, highlightColor: lopts.highlightColor});
            
            if (!this.highlightColor) {
                var fc = (this.renderer.bands.show) ? this.renderer.bands.fillColor : this.fillColor;
                this.highlightColor = $.jqplot.computeHighlightColors(fc);
            }
            // turn off (disable) the highlighter plugin
            if (this.highlighter) {
                this.highlighter.show = false;
            }
        }
        
        if (!this.isTrendline && plot) {
            plot.plugins.lineRenderer = {};
            plot.postInitHooks.addOnce(postInit);
            plot.postDrawHooks.addOnce(postPlotDraw);
            plot.eventListenerHooks.addOnce('jqplotMouseMove', handleMove);
            plot.eventListenerHooks.addOnce('jqplotMouseDown', handleMouseDown);
            plot.eventListenerHooks.addOnce('jqplotMouseUp', handleMouseUp);
            plot.eventListenerHooks.addOnce('jqplotClick', handleClick);
            plot.eventListenerHooks.addOnce('jqplotRightClick', handleRightClick);
        }

    };

    $.jqplot.LineRenderer.prototype.initBands = function(options, plot) {
        // use bandData if no data specified in bands option
        //var bd = this.renderer.bandData;
        var bd = options.bandData || [];
        var bands = this.renderer.bands;
        bands.hiData = [];
        bands.lowData = [];
        var data = this.data;
        bands._max = null;
        bands._min = null;
        // If 2 arrays, and each array greater than 2 elements, assume it is hi and low data bands of y values.
        if (bd.length == 2) {
            // Do we have an array of x,y values?
            // like [[[1,1], [2,4], [3,3]], [[1,3], [2,6], [3,5]]]
            if ($.isArray(bd[0][0])) {
                // since an arbitrary array of points, spin through all of them to determine max and min lines.

                var p;
                var bdminidx = 0, bdmaxidx = 0;
                for (var i = 0, l = bd[0].length; i<l; i++) {
                    p = bd[0][i];
                    if ((p[1] != null && p[1] > bands._max) || bands._max == null) {
                        bands._max = p[1];
                    }
                    if ((p[1] != null && p[1] < bands._min) || bands._min == null) {
                        bands._min = p[1];
                    }
                }
                for (var i = 0, l = bd[1].length; i<l; i++) {
                    p = bd[1][i];
                    if ((p[1] != null && p[1] > bands._max) || bands._max == null) {
                        bands._max = p[1];
                        bdmaxidx = 1;
                    }
                    if ((p[1] != null && p[1] < bands._min) || bands._min == null) {
                        bands._min = p[1];
                        bdminidx = 1;
                    }
                }

                if (bdmaxidx === bdminidx) {
                    bands.show = false;
                }

                bands.hiData = bd[bdmaxidx];
                bands.lowData = bd[bdminidx];
            }
            // else data is arrays of y values
            // like [[1,4,3], [3,6,5]]
            // must have same number of band data points as points in series
            else if (bd[0].length === data.length && bd[1].length === data.length) {
                var hi = (bd[0][0] > bd[1][0]) ? 0 : 1;
                var low = (hi) ? 0 : 1;
                for (var i=0, l=data.length; i < l; i++) {
                    bands.hiData.push([data[i][0], bd[hi][i]]);
                    bands.lowData.push([data[i][0], bd[low][i]]);
                }
            }

            // we don't have proper data array, don't show bands.
            else {
                bands.show = false;
            }
        }

        // if more than 2 arrays, have arrays of [ylow, yhi] values.
        // note, can't distinguish case of [[ylow, yhi], [ylow, yhi]] from [[ylow, ylow], [yhi, yhi]]
        // this is assumed to be of the latter form.
        else if (bd.length > 2 && !$.isArray(bd[0][0])) {
            var hi = (bd[0][0] > bd[0][1]) ? 0 : 1;
            var low = (hi) ? 0 : 1;
            for (var i=0, l=bd.length; i<l; i++) {
                bands.hiData.push([data[i][0], bd[i][hi]]);
                bands.lowData.push([data[i][0], bd[i][low]]);
            }
        }

        // don't have proper data, auto calculate
        else {
            var intrv = bands.interval;
            var a = null;
            var b = null;
            var afunc = null;
            var bfunc = null;

            if ($.isArray(intrv)) {
                a = intrv[0];
                b = intrv[1];
            }
            else {
                a = intrv;
            }

            if (isNaN(a)) {
                // we have a string
                if (a.charAt(a.length - 1) === '%') {
                    afunc = 'multiply';
                    a = parseFloat(a)/100 + 1;
                }
            }

            else {
                a = parseFloat(a);
                afunc = 'add';
            }

            if (b !== null && isNaN(b)) {
                // we have a string
                if (b.charAt(b.length - 1) === '%') {
                    bfunc = 'multiply';
                    b = parseFloat(b)/100 + 1;
                }
            }

            else if (b !== null) {
                b = parseFloat(b);
                bfunc = 'add';
            }

            if (a !== null) {
                if (b === null) {
                    b = -a;
                    bfunc = afunc;
                    if (bfunc === 'multiply') {
                        b += 2;
                    }
                }

                // make sure a always applies to hi band.
                if (a < b) {
                    var temp = a;
                    a = b;
                    b = temp;
                    temp = afunc;
                    afunc = bfunc;
                    bfunc = temp;
                }

                for (var i=0, l = data.length; i < l; i++) {
                    switch (afunc) {
                        case 'add':
                            bands.hiData.push([data[i][0], data[i][1] + a]);
                            break;
                        case 'multiply':
                            bands.hiData.push([data[i][0], data[i][1] * a]);
                            break;
                    }
                    switch (bfunc) {
                        case 'add':
                            bands.lowData.push([data[i][0], data[i][1] + b]);
                            break;
                        case 'multiply':
                            bands.lowData.push([data[i][0], data[i][1] * b]);
                            break;
                    }
                }
            }

            else {
                bands.show = false;
            }
        }

        var hd = bands.hiData;
        var ld = bands.lowData;
        for (var i = 0, l = hd.length; i<l; i++) {
            if ((hd[i][1] != null && hd[i][1] > bands._max) || bands._max == null) {
                bands._max = hd[i][1];
            }
        }
        for (var i = 0, l = ld.length; i<l; i++) {
            if ((ld[i][1] != null && ld[i][1] < bands._min) || bands._min == null) {
                bands._min = ld[i][1];
            }
        }

        // one last check for proper data
        // these don't apply any more since allowing arbitrary x,y values
        // if (bands.hiData.length != bands.lowData.length) {
        //     bands.show = false;
        // }

        // if (bands.hiData.length != this.data.length) {
        //     bands.show = false;
        // }

        if (bands.fillColor === null) {
            var c = $.jqplot.getColorComponents(bands.color);
            // now adjust alpha to differentiate fill
            c[3] = c[3] * 0.5;
            bands.fillColor = 'rgba(' + c[0] +', '+ c[1] +', '+ c[2] +', '+ c[3] + ')';
        }
    };

    function getSteps (d, f) {
        return (3.4182054+f) * Math.pow(d, -0.3534992);
    }

    function computeSteps (d1, d2) {
        var s = Math.sqrt(Math.pow((d2[0]- d1[0]), 2) + Math.pow ((d2[1] - d1[1]), 2));
        return 5.7648 * Math.log(s) + 7.4456;
    }

    function tanh (x) {
        var a = (Math.exp(2*x) - 1) / (Math.exp(2*x) + 1);
        return a;
    }

    //////////
    // computeConstrainedSmoothedData
    // An implementation of the constrained cubic spline interpolation
    // method as presented in:
    //
    // Kruger, CJC, Constrained Cubic Spine Interpolation for Chemical Engineering Applications
    // http://www.korf.co.uk/spline.pdf
    //
    // The implementation below borrows heavily from the sample Visual Basic
    // implementation by CJC Kruger found in http://www.korf.co.uk/spline.xls
    //
    /////////

    // called with scope of series
    function computeConstrainedSmoothedData (gd) {
        var smooth = this.renderer.smooth;
        var dim = this.canvas.getWidth();
        var xp = this._xaxis.series_p2u;
        var yp = this._yaxis.series_p2u; 
        var steps =null;
        var _steps = null;
        var dist = gd.length/dim;
        var _smoothedData = [];
        var _smoothedPlotData = [];

        if (!isNaN(parseFloat(smooth))) {
            steps = parseFloat(smooth);
        }
        else {
            steps = getSteps(dist, 0.5);
        }

        var yy = [];
        var xx = [];

        for (var i=0, l = gd.length; i<l; i++) {
            yy.push(gd[i][1]);
            xx.push(gd[i][0]);
        }

        function dxx(x1, x0) {
            if (x1 - x0 == 0) {
                return Math.pow(10,10);
            }
            else {
                return x1 - x0;
            }
        }

        var A, B, C, D;
        // loop through each line segment.  Have # points - 1 line segments.  Nmber segments starting at 1.
        var nmax = gd.length - 1;
        for (var num = 1, gdl = gd.length; num<gdl; num++) {
            var gxx = [];
            var ggxx = [];
            // point at each end of segment.
            for (var j = 0; j < 2; j++) {
                var i = num - 1 + j; // point number, 0 to # points.

                if (i == 0 || i == nmax) {
                    gxx[j] = Math.pow(10, 10);
                }
                else if (yy[i+1] - yy[i] == 0 || yy[i] - yy[i-1] == 0) {
                    gxx[j] = 0;
                }
                else if (((xx[i+1] - xx[i]) / (yy[i+1] - yy[i]) + (xx[i] - xx[i-1]) / (yy[i] - yy[i-1])) == 0 ) {
                    gxx[j] = 0;
                }
                else if ( (yy[i+1] - yy[i]) * (yy[i] - yy[i-1]) < 0 ) {
                    gxx[j] = 0;
                }

                else {
                    gxx[j] = 2 / (dxx(xx[i + 1], xx[i]) / (yy[i + 1] - yy[i]) + dxx(xx[i], xx[i - 1]) / (yy[i] - yy[i - 1]));
                }
            }

            // Reset first derivative (slope) at first and last point
            if (num == 1) {
                // First point has 0 2nd derivative
                gxx[0] = 3 / 2 * (yy[1] - yy[0]) / dxx(xx[1], xx[0]) - gxx[1] / 2;
            }
            else if (num == nmax) {
                // Last point has 0 2nd derivative
                gxx[1] = 3 / 2 * (yy[nmax] - yy[nmax - 1]) / dxx(xx[nmax], xx[nmax - 1]) - gxx[0] / 2;
            }   

            // Calc second derivative at points
            ggxx[0] = -2 * (gxx[1] + 2 * gxx[0]) / dxx(xx[num], xx[num - 1]) + 6 * (yy[num] - yy[num - 1]) / Math.pow(dxx(xx[num], xx[num - 1]), 2);
            ggxx[1] = 2 * (2 * gxx[1] + gxx[0]) / dxx(xx[num], xx[num - 1]) - 6 * (yy[num] - yy[num - 1]) / Math.pow(dxx(xx[num], xx[num - 1]), 2);

            // Calc constants for cubic interpolation
            D = 1 / 6 * (ggxx[1] - ggxx[0]) / dxx(xx[num], xx[num - 1]);
            C = 1 / 2 * (xx[num] * ggxx[0] - xx[num - 1] * ggxx[1]) / dxx(xx[num], xx[num - 1]);
            B = (yy[num] - yy[num - 1] - C * (Math.pow(xx[num], 2) - Math.pow(xx[num - 1], 2)) - D * (Math.pow(xx[num], 3) - Math.pow(xx[num - 1], 3))) / dxx(xx[num], xx[num - 1]);
            A = yy[num - 1] - B * xx[num - 1] - C * Math.pow(xx[num - 1], 2) - D * Math.pow(xx[num - 1], 3);

            var increment = (xx[num] - xx[num - 1]) / steps;
            var temp, tempx;

            for (var j = 0, l = steps; j < l; j++) {
                temp = [];
                tempx = xx[num - 1] + j * increment;
                temp.push(tempx);
                temp.push(A + B * tempx + C * Math.pow(tempx, 2) + D * Math.pow(tempx, 3));
                _smoothedData.push(temp);
                _smoothedPlotData.push([xp(temp[0]), yp(temp[1])]);
            }
        }

        _smoothedData.push(gd[i]);
        _smoothedPlotData.push([xp(gd[i][0]), yp(gd[i][1])]);

        return [_smoothedData, _smoothedPlotData];
    }

    ///////
    // computeHermiteSmoothedData
    // A hermite spline smoothing of the plot data.
    // This implementation is derived from the one posted
    // by krypin on the jqplot-users mailing list:
    //
    // http://groups.google.com/group/jqplot-users/browse_thread/thread/748be6a445723cea?pli=1
    //
    // with a blog post:
    //
    // http://blog.statscollector.com/a-plugin-renderer-for-jqplot-to-draw-a-hermite-spline/
    //
    // and download of the original plugin:
    //
    // http://blog.statscollector.com/wp-content/uploads/2010/02/jqplot.hermiteSplineRenderer.js
    //////////

    // called with scope of series
    function computeHermiteSmoothedData (gd) {
        var smooth = this.renderer.smooth;
        var tension = this.renderer.tension;
        var dim = this.canvas.getWidth();
        var xp = this._xaxis.series_p2u;
        var yp = this._yaxis.series_p2u; 
        var steps =null;
        var _steps = null;
        var a = null;
        var a1 = null;
        var a2 = null;
        var slope = null;
        var slope2 = null;
        var temp = null;
        var t, s, h1, h2, h3, h4;
        var TiX, TiY, Ti1X, Ti1Y;
        var pX, pY, p;
        var sd = [];
        var spd = [];
        var dist = gd.length/dim;
        var min, max, stretch, scale, shift;
        var _smoothedData = [];
        var _smoothedPlotData = [];
        if (!isNaN(parseFloat(smooth))) {
            steps = parseFloat(smooth);
        }
        else {
            steps = getSteps(dist, 0.5);
        }
        if (!isNaN(parseFloat(tension))) {
            tension = parseFloat(tension);
        }

        for (var i=0, l = gd.length-1; i < l; i++) {

            if (tension === null) {
                slope = Math.abs((gd[i+1][1] - gd[i][1]) / (gd[i+1][0] - gd[i][0]));

                min = 0.3;
                max = 0.6;
                stretch = (max - min)/2.0;
                scale = 2.5;
                shift = -1.4;

                temp = slope/scale + shift;

                a1 = stretch * tanh(temp) - stretch * tanh(shift) + min;

                // if have both left and right line segments, will use  minimum tension. 
                if (i > 0) {
                    slope2 = Math.abs((gd[i][1] - gd[i-1][1]) / (gd[i][0] - gd[i-1][0]));
                }
                temp = slope2/scale + shift;

                a2 = stretch * tanh(temp) - stretch * tanh(shift) + min;

                a = (a1 + a2)/2.0;

            }
            else {
                a = tension;
            }
            for (t=0; t < steps; t++) {
                s = t / steps;
                h1 = (1 + 2*s)*Math.pow((1-s),2);
                h2 = s*Math.pow((1-s),2);
                h3 = Math.pow(s,2)*(3-2*s);
                h4 = Math.pow(s,2)*(s-1);     
                
                if (gd[i-1]) {  
                    TiX = a * (gd[i+1][0] - gd[i-1][0]); 
                    TiY = a * (gd[i+1][1] - gd[i-1][1]);
                } else {
                    TiX = a * (gd[i+1][0] - gd[i][0]); 
                    TiY = a * (gd[i+1][1] - gd[i][1]);                                  
                }
                if (gd[i+2]) {  
                    Ti1X = a * (gd[i+2][0] - gd[i][0]); 
                    Ti1Y = a * (gd[i+2][1] - gd[i][1]);
                } else {
                    Ti1X = a * (gd[i+1][0] - gd[i][0]); 
                    Ti1Y = a * (gd[i+1][1] - gd[i][1]);                                 
                }
                
                pX = h1*gd[i][0] + h3*gd[i+1][0] + h2*TiX + h4*Ti1X;
                pY = h1*gd[i][1] + h3*gd[i+1][1] + h2*TiY + h4*Ti1Y;
                p = [pX, pY];

                _smoothedData.push(p);
                _smoothedPlotData.push([xp(pX), yp(pY)]);
            }
        }
        _smoothedData.push(gd[l]);
        _smoothedPlotData.push([xp(gd[l][0]), yp(gd[l][1])]);

        return [_smoothedData, _smoothedPlotData];
    }
    
    // setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.
    // Called with scope of a series.
    $.jqplot.LineRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        var pdata = this._prevPlotData;
        this.gridData = [];
        this._prevGridData = [];
        this.renderer._smoothedData = [];
        this.renderer._smoothedPlotData = [];
        this.renderer._hiBandGridData = [];
        this.renderer._lowBandGridData = [];
        this.renderer._hiBandSmoothedData = [];
        this.renderer._lowBandSmoothedData = [];
        var bands = this.renderer.bands;
        var hasNull = false;
        for (var i=0, l=data.length; i < l; i++) {
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (data[i][0] != null && data[i][1] != null) {
                this.gridData.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
            }
            // else if there is a null, preserve it.
            else if (data[i][0] == null) {
                hasNull = true;
                this.gridData.push([null, yp.call(this._yaxis, data[i][1])]);
            }
            else if (data[i][1] == null) {
                hasNull = true;
                this.gridData.push([xp.call(this._xaxis, data[i][0]), null]);
            }
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (pdata[i] != null && pdata[i][0] != null && pdata[i][1] != null) {
                this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), yp.call(this._yaxis, pdata[i][1])]);
            }
            // else if there is a null, preserve it.
            else if (pdata[i] != null && pdata[i][0] == null) {
                this._prevGridData.push([null, yp.call(this._yaxis, pdata[i][1])]);
            }  
            else if (pdata[i] != null && pdata[i][0] != null && pdata[i][1] == null) {
                this._prevGridData.push([xp.call(this._xaxis, pdata[i][0]), null]);
            }
        }

        // don't do smoothing or bands on broken lines.
        if (hasNull) {
            this.renderer.smooth = false;
            if (this._type === 'line') {
                bands.show = false;
            }
        }

        if (this._type === 'line' && bands.show) {
            for (var i=0, l=bands.hiData.length; i<l; i++) {
                this.renderer._hiBandGridData.push([xp.call(this._xaxis, bands.hiData[i][0]), yp.call(this._yaxis, bands.hiData[i][1])]);
            }
            for (var i=0, l=bands.lowData.length; i<l; i++) {
                this.renderer._lowBandGridData.push([xp.call(this._xaxis, bands.lowData[i][0]), yp.call(this._yaxis, bands.lowData[i][1])]);
            }
        }

        // calculate smoothed data if enough points and no nulls
        if (this._type === 'line' && this.renderer.smooth && this.gridData.length > 2) {
            var ret;
            if (this.renderer.constrainSmoothing) {
                ret = computeConstrainedSmoothedData.call(this, this.gridData);
                this.renderer._smoothedData = ret[0];
                this.renderer._smoothedPlotData = ret[1];

                if (bands.show) {
                    ret = computeConstrainedSmoothedData.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ret[0];
                    ret = computeConstrainedSmoothedData.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ret[0];
                }

                ret = null;
            }
            else {
                ret = computeHermiteSmoothedData.call(this, this.gridData);
                this.renderer._smoothedData = ret[0];
                this.renderer._smoothedPlotData = ret[1];

                if (bands.show) {
                    ret = computeHermiteSmoothedData.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ret[0];
                    ret = computeHermiteSmoothedData.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ret[0];
                }

                ret = null;
            }
        }
    };
    
    // makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.LineRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var gd = [];
        var pgd = [];
        this.renderer._smoothedData = [];
        this.renderer._smoothedPlotData = [];
        this.renderer._hiBandGridData = [];
        this.renderer._lowBandGridData = [];
        this.renderer._hiBandSmoothedData = [];
        this.renderer._lowBandSmoothedData = [];
        var bands = this.renderer.bands;
        var hasNull = false;
        for (var i=0; i<data.length; i++) {
            // if not a line series or if no nulls in data, push the converted point onto the array.
            if (data[i][0] != null && data[i][1] != null) {
                gd.push([xp.call(this._xaxis, data[i][0]), yp.call(this._yaxis, data[i][1])]);
            }
            // else if there is a null, preserve it.
            else if (data[i][0] == null) {
                hasNull = true;
                gd.push([null, yp.call(this._yaxis, data[i][1])]);
            }
            else if (data[i][1] == null) {
                hasNull = true;
                gd.push([xp.call(this._xaxis, data[i][0]), null]);
            }
        }

        // don't do smoothing or bands on broken lines.
        if (hasNull) {
            this.renderer.smooth = false;
            if (this._type === 'line') {
                bands.show = false;
            }
        }

        if (this._type === 'line' && bands.show) {
            for (var i=0, l=bands.hiData.length; i<l; i++) {
                this.renderer._hiBandGridData.push([xp.call(this._xaxis, bands.hiData[i][0]), yp.call(this._yaxis, bands.hiData[i][1])]);
            }
            for (var i=0, l=bands.lowData.length; i<l; i++) {
                this.renderer._lowBandGridData.push([xp.call(this._xaxis, bands.lowData[i][0]), yp.call(this._yaxis, bands.lowData[i][1])]);
            }
        }

        if (this._type === 'line' && this.renderer.smooth && gd.length > 2) {
            var ret;
            if (this.renderer.constrainSmoothing) {
                ret = computeConstrainedSmoothedData.call(this, gd);
                this.renderer._smoothedData = ret[0];
                this.renderer._smoothedPlotData = ret[1];

                if (bands.show) {
                    ret = computeConstrainedSmoothedData.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ret[0];
                    ret = computeConstrainedSmoothedData.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ret[0];
                }

                ret = null;
            }
            else {
                ret = computeHermiteSmoothedData.call(this, gd);
                this.renderer._smoothedData = ret[0];
                this.renderer._smoothedPlotData = ret[1];

                if (bands.show) {
                    ret = computeHermiteSmoothedData.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ret[0];
                    ret = computeHermiteSmoothedData.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ret[0];
                }

                ret = null;
            }
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.LineRenderer.prototype.draw = function(ctx, gd, options, plot) {
        var i;
        // get a copy of the options, so we don't modify the original object.
        var opts = $.extend(true, {}, options);
        var shadow = (opts.shadow != undefined) ? opts.shadow : this.shadow;
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var fill = (opts.fill != undefined) ? opts.fill : this.fill;
        var fillAndStroke = (opts.fillAndStroke != undefined) ? opts.fillAndStroke : this.fillAndStroke;
        var xmin, ymin, xmax, ymax;
        ctx.save();
        if (gd.length) {
            if (showLine) {
                // if we fill, we'll have to add points to close the curve.
                if (fill) {
                    if (this.fillToZero) { 
                        // have to break line up into shapes at axis crossings
                        var negativeColor = this.negativeColor;
                        if (! this.useNegativeColors) {
                            negativeColor = opts.fillStyle;
                        }
                        var isnegative = false;
                        var posfs = opts.fillStyle;
                    
                        // if stoking line as well as filling, get a copy of line data.
                        if (fillAndStroke) {
                            var fasgd = gd.slice(0);
                        }
                        // if not stacked, fill down to axis
                        if (this.index == 0 || !this._stack) {
                        
                            var tempgd = [];
                            var pd = (this.renderer.smooth) ? this.renderer._smoothedPlotData : this._plotData;
                            this._areaPoints = [];
                            var pyzero = this._yaxis.series_u2p(this.fillToValue);
                            var pxzero = this._xaxis.series_u2p(this.fillToValue);

                            opts.closePath = true;
                            
                            if (this.fillAxis == 'y') {
                                tempgd.push([gd[0][0], pyzero]);
                                this._areaPoints.push([gd[0][0], pyzero]);
                                
                                for (var i=0; i<gd.length-1; i++) {
                                    tempgd.push(gd[i]);
                                    this._areaPoints.push(gd[i]);
                                    // do we have an axis crossing?
                                    if (pd[i][1] * pd[i+1][1] <= 0) {
                                        if (pd[i][1] < 0) {
                                            isnegative = true;
                                            opts.fillStyle = negativeColor;
                                        }
                                        else {
                                            isnegative = false;
                                            opts.fillStyle = posfs;
                                        }
                                        
                                        var xintercept = gd[i][0] + (gd[i+1][0] - gd[i][0]) * (pyzero-gd[i][1])/(gd[i+1][1] - gd[i][1]);
                                        tempgd.push([xintercept, pyzero]);
                                        this._areaPoints.push([xintercept, pyzero]);
                                        // now draw this shape and shadow.
                                        if (shadow) {
                                            this.renderer.shadowRenderer.draw(ctx, tempgd, opts);
                                        }
                                        this.renderer.shapeRenderer.draw(ctx, tempgd, opts);
                                        // now empty temp array and continue
                                        tempgd = [[xintercept, pyzero]];
                                        // this._areaPoints = [[xintercept, pyzero]];
                                    }   
                                }
                                if (pd[gd.length-1][1] < 0) {
                                    isnegative = true;
                                    opts.fillStyle = negativeColor;
                                }
                                else {
                                    isnegative = false;
                                    opts.fillStyle = posfs;
                                }
                                tempgd.push(gd[gd.length-1]);
                                this._areaPoints.push(gd[gd.length-1]);
                                tempgd.push([gd[gd.length-1][0], pyzero]); 
                                this._areaPoints.push([gd[gd.length-1][0], pyzero]); 
                            }
                            // now draw the last area.
                            if (shadow) {
                                this.renderer.shadowRenderer.draw(ctx, tempgd, opts);
                            }
                            this.renderer.shapeRenderer.draw(ctx, tempgd, opts);
                            
                            
                            // var gridymin = this._yaxis.series_u2p(0);
                            // // IE doesn't return new length on unshift
                            // gd.unshift([gd[0][0], gridymin]);
                            // len = gd.length;
                            // gd.push([gd[len - 1][0], gridymin]);                   
                        }
                        // if stacked, fill to line below 
                        else {
                            var prev = this._prevGridData;
                            for (var i=prev.length; i>0; i--) {
                                gd.push(prev[i-1]);
                                // this._areaPoints.push(prev[i-1]);
                            }
                            if (shadow) {
                                this.renderer.shadowRenderer.draw(ctx, gd, opts);
                            }
                            this._areaPoints = gd;
                            this.renderer.shapeRenderer.draw(ctx, gd, opts);
                        }
                    }
                    /////////////////////////
                    // Not filled to zero
                    ////////////////////////
                    else {                    
                        // if stoking line as well as filling, get a copy of line data.
                        if (fillAndStroke) {
                            var fasgd = gd.slice(0);
                        }
                        // if not stacked, fill down to axis
                        if (this.index == 0 || !this._stack) {
                            // var gridymin = this._yaxis.series_u2p(this._yaxis.min) - this.gridBorderWidth / 2;
                            var gridymin = ctx.canvas.height;
                            // IE doesn't return new length on unshift
                            gd.unshift([gd[0][0], gridymin]);
                            var len = gd.length;
                            gd.push([gd[len - 1][0], gridymin]);                   
                        }
                        // if stacked, fill to line below 
                        else {
                            var prev = this._prevGridData;
                            for (var i=prev.length; i>0; i--) {
                                gd.push(prev[i-1]);
                            }
                        }
                        this._areaPoints = gd;
                        
                        if (shadow) {
                            this.renderer.shadowRenderer.draw(ctx, gd, opts);
                        }
            
                        this.renderer.shapeRenderer.draw(ctx, gd, opts);                        
                    }
                    if (fillAndStroke) {
                        var fasopts = $.extend(true, {}, opts, {fill:false, closePath:false});
                        this.renderer.shapeRenderer.draw(ctx, fasgd, fasopts);
                        //////////
                        // TODO: figure out some way to do shadows nicely
                        // if (shadow) {
                        //     this.renderer.shadowRenderer.draw(ctx, fasgd, fasopts);
                        // }
                        // now draw the markers
                        if (this.markerRenderer.show) {
                            if (this.renderer.smooth) {
                                fasgd = this.gridData;
                            }
                            for (i=0; i<fasgd.length; i++) {
                                this.markerRenderer.draw(fasgd[i][0], fasgd[i][1], ctx, opts.markerOptions);
                            }
                        }
                    }
                }
                else {

                    if (this.renderer.bands.show) {
                        var bdat;
                        var bopts = $.extend(true, {}, opts);
                        if (this.renderer.bands.showLines) {
                            bdat = (this.renderer.smooth) ? this.renderer._hiBandSmoothedData : this.renderer._hiBandGridData;
                            this.renderer.shapeRenderer.draw(ctx, bdat, opts);
                            bdat = (this.renderer.smooth) ? this.renderer._lowBandSmoothedData : this.renderer._lowBandGridData;
                            this.renderer.shapeRenderer.draw(ctx, bdat, bopts);
                        }

                        if (this.renderer.bands.fill) {
                            if (this.renderer.smooth) {
                                bdat = this.renderer._hiBandSmoothedData.concat(this.renderer._lowBandSmoothedData.reverse());
                            }
                            else {
                                bdat = this.renderer._hiBandGridData.concat(this.renderer._lowBandGridData.reverse());
                            }
                            this._areaPoints = bdat;
                            bopts.closePath = true;
                            bopts.fill = true;
                            bopts.fillStyle = this.renderer.bands.fillColor;
                            this.renderer.shapeRenderer.draw(ctx, bdat, bopts);
                        }
                    }

                    if (shadow) {
                        this.renderer.shadowRenderer.draw(ctx, gd, opts);
                    }
    
                    this.renderer.shapeRenderer.draw(ctx, gd, opts);
                }
            }
            // calculate the bounding box
            var xmin = xmax = ymin = ymax = null;
            for (i=0; i<this._areaPoints.length; i++) {
                var p = this._areaPoints[i];
                if (xmin > p[0] || xmin == null) {
                    xmin = p[0];
                }
                if (ymax < p[1] || ymax == null) {
                    ymax = p[1];
                }
                if (xmax < p[0] || xmax == null) {
                    xmax = p[0];
                }
                if (ymin > p[1] || ymin == null) {
                    ymin = p[1];
                }
            }

            if (this.type === 'line' && this.renderer.bands.show) {
                ymax = this._yaxis.series_u2p(this.renderer.bands._min);
                ymin = this._yaxis.series_u2p(this.renderer.bands._max);
            }

            this._boundingBox = [[xmin, ymax], [xmax, ymin]];
        
            // now draw the markers
            if (this.markerRenderer.show && !fill) {
                if (this.renderer.smooth) {
                    gd = this.gridData;
                }
                for (i=0; i<gd.length; i++) {
                    if (gd[i][0] != null && gd[i][1] != null) {
                        this.markerRenderer.draw(gd[i][0], gd[i][1], ctx, opts.markerOptions);
                    }
                }
            }
        }
        
        ctx.restore();
    };  
    
    $.jqplot.LineRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, shadows drawn with lines.
    };
    
    // called with scope of plot.
    // make sure to not leave anything highlighted.
    function postInit(target, data, options) {
        for (var i=0; i<this.series.length; i++) {
            if (this.series[i].renderer.constructor == $.jqplot.LineRenderer) {
                // don't allow mouseover and mousedown at same time.
                if (this.series[i].highlightMouseOver) {
                    this.series[i].highlightMouseDown = false;
                }
            }
        }
    }  
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    function postPlotDraw() {
        // Memory Leaks patch    
        if (this.plugins.lineRenderer && this.plugins.lineRenderer.highlightCanvas) {
          this.plugins.lineRenderer.highlightCanvas.resetCanvas();
          this.plugins.lineRenderer.highlightCanvas = null;
        }
        
        this.plugins.lineRenderer.highlightedSeriesIndex = null;
        this.plugins.lineRenderer.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.lineRenderer.highlightCanvas.createElement(this._gridPadding, 'jqplot-lineRenderer-highlight-canvas', this._plotDimensions, this));
        this.plugins.lineRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind('mouseleave', {plot:this}, function (ev) { unhighlight(ev.data.plot); });
    } 
    
    function highlight (plot, sidx, pidx, points) {
        var s = plot.series[sidx];
        var canvas = plot.plugins.lineRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0,canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        s._highlightedPoint = pidx;
        plot.plugins.lineRenderer.highlightedSeriesIndex = sidx;
        var opts = {fillStyle: s.highlightColor};
        if (s.type === 'line' && s.renderer.bands.show) {
            opts.fill = true;
            opts.closePath = true;
        }
        s.renderer.shapeRenderer.draw(canvas._ctx, points, opts);
        canvas = null;
    }
    
    function unhighlight (plot) {
        var canvas = plot.plugins.lineRenderer.highlightCanvas;
        canvas._ctx.clearRect(0,0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
        for (var i=0; i<plot.series.length; i++) {
            plot.series[i]._highlightedPoint = null;
        }
        plot.plugins.lineRenderer.highlightedSeriesIndex = null;
        plot.target.trigger('jqplotDataUnhighlight');
        canvas = null;
    }
    
        
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        //if (neighbor) {
        if (neighbor.seriesIndex.length > 0) {
            var ins = [neighbor.seriesIndex[0], neighbor.pointIndex[0], neighbor.data[0]];              //changed -- Jayesh
            var evt1 = jQuery.Event('jqplotDataMouseOver');
            evt1.pageX = ev.pageX;
            evt1.pageY = ev.pageY;
            plot.target.trigger(evt1, ins);
            if (plot.series[ins[0]].highlightMouseOver && !(ins[0] == plot.plugins.lineRenderer.highlightedSeriesIndex)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, neighbor.seriesIndex, neighbor.pointIndex, neighbor.points);
            }
        }
        //changed..
        //else if (neighbor == null) {
        else if (neighbor.seriesIndex.length == 0) {
            unhighlight (plot);
        }
    }
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor.seriesIndex.length > 0) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            if (plot.series[ins[0]].highlightMouseDown && !(ins[0] == plot.plugins.lineRenderer.highlightedSeriesIndex)) {
                var evt = jQuery.Event('jqplotDataHighlight');
                evt.which = ev.which;
                evt.pageX = ev.pageX;
                evt.pageY = ev.pageY;
                plot.target.trigger(evt, ins);
                highlight (plot, neighbor.seriesIndex, neighbor.pointIndex, neighbor.points);
            }
        }
        //else if (neighbor == null) {
        else if (neighbor.seriesIndex.length == 0) {
            unhighlight (plot);
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var idx = plot.plugins.lineRenderer.highlightedSeriesIndex;
        if (idx != null && plot.series[idx].highlightMouseDown) {
            unhighlight(plot);
        }
    }
    
    function handleClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var evt = jQuery.Event('jqplotDataClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    function handleRightClick(ev, gridpos, datapos, neighbor, plot) {
        if (neighbor) {
            var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
            var idx = plot.plugins.lineRenderer.highlightedSeriesIndex;
            if (idx != null && plot.series[idx].highlightMouseDown) {
                unhighlight(plot);
            }
            var evt = jQuery.Event('jqplotDataRightClick');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
        }
    }
    
    
    // class: $.jqplot.LinearAxisRenderer
    // The default jqPlot axis renderer, creating a numeric axis.
    $.jqplot.LinearAxisRenderer = function() {
    };
    
    // called with scope of axis object.
    $.jqplot.LinearAxisRenderer.prototype.init = function(options){
        // prop: breakPoints
        // EXPERIMENTAL!! Use at your own risk!
        // Works only with linear axes and the default tick renderer.
        // Array of [start, stop] points to create a broken axis.
        // Broken axes have a "jump" in them, which is an immediate 
        // transition from a smaller value to a larger value.
        // Currently, axis ticks MUST be manually assigned if using breakPoints
        // by using the axis ticks array option.
        this.breakPoints = null;
        // prop: breakTickLabel
        // Label to use at the axis break if breakPoints are specified.
        this.breakTickLabel = "&asymp;";
        // prop: drawBaseline
        // True to draw the axis baseline.
        this.drawBaseline = true;
        // prop: baselineWidth
        // width of the baseline in pixels.
        this.baselineWidth = null;
        // prop: baselineColor
        // CSS color spec for the baseline.
        this.baselineColor = null;
        // prop: forceTickAt0
        // This will ensure that there is always a tick mark at 0.
        // If data range is strictly positive or negative,
        // this will force 0 to be inside the axis bounds unless
        // the appropriate axis pad (pad, padMin or padMax) is set
        // to 0, then this will force an axis min or max value at 0.
        // This has know effect when any of the following options
        // are set:  autoscale, min, max, numberTicks or tickInterval.
        this.forceTickAt0 = false;
        // prop: forceTickAt100
        // This will ensure that there is always a tick mark at 100.
        // If data range is strictly above or below 100,
        // this will force 100 to be inside the axis bounds unless
        // the appropriate axis pad (pad, padMin or padMax) is set
        // to 0, then this will force an axis min or max value at 100.
        // This has know effect when any of the following options
        // are set:  autoscale, min, max, numberTicks or tickInterval.
        this.forceTickAt100 = false;
        // prop: tickInset
        // Controls the amount to inset the first and last ticks from 
        // the edges of the grid, in multiples of the tick interval.
        // 0 is no inset, 0.5 is one half a tick interval, 1 is a full
        // tick interval, etc.
        this.tickInset = 0;
        // prop: minorTicks
        // Number of ticks to add between "major" ticks.
        // Major ticks are ticks supplied by user or auto computed.
        // Minor ticks cannot be created by user.
        this.minorTicks = 0;
        // prop: alignTicks
        // true to align tick marks across opposed axes
        // such as from the y2axis to yaxis.
        this.alignTicks = false;
        this._autoFormatString = '';
        this._overrideFormatString = false;
        this._scalefact = 1.0;
        $.extend(true, this, options);
        if (this.breakPoints) {
            if (!$.isArray(this.breakPoints)) {
                this.breakPoints = null;
            }
            else if (this.breakPoints.length < 2 || this.breakPoints[1] <= this.breakPoints[0]) {
                this.breakPoints = null;
            }
        }
        if (this.numberTicks != null && this.numberTicks < 2) {
            this.numberTicks = 2;
        }
        this.resetDataBounds();
    };
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.draw = function(ctx, plot) {
        if (this.show) {
            // populate the axis label and value properties.
            // createTicks is a method on the renderer, but
            // call it within the scope of the axis.
            this.renderer.createTicks.call(this, plot);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get its bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            // Added for theming.
            if (this._elem) {
                // Memory Leaks patch
                //this._elem.empty();
                this._elem.emptyForce();
                this._elem = null;
            }
            
            this._elem = $(document.createElement('div'));
            this._elem.addClass('jqplot-axis jqplot-'+this.name);
            this._elem.css('position', 'absolute');

            
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                this._elem.width(this._plotDimensions.width);
            }
            else {
                this._elem.height(this._plotDimensions.height);
            }
            
            // create a _label object.
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                var elem = this._label.draw(ctx, plot);
                elem.appendTo(this._elem);
                elem = null;
            }
    
            var t = this._ticks;
            var tick;
            for (var i=0; i<t.length; i++) {
                tick = t[i];
                if (tick.show && tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    this._elem.append(tick.draw(ctx, plot));
                }
            }
            tick = null;
            t = null;
        }
        return this._elem;
    };
    
    // called with scope of an axis
    $.jqplot.LinearAxisRenderer.prototype.reset = function() {
        this.min = this._options.min;
        this.max = this._options.max;
        this.tickInterval = this._options.tickInterval;
        this.numberTicks = this._options.numberTicks;
        this._autoFormatString = '';
        if (this._overrideFormatString && this.tickOptions && this.tickOptions.formatString) {
            this.tickOptions.formatString = '';
        }

        // this._ticks = this.__ticks;
    };
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.set = function() { 
        var dim = 0;
        var temp;
        var w = 0;
        var h = 0;
        var lshow = (this._label == null) ? false : this._label.show;
        if (this.show) {
            var t = this._ticks;
            var tick;
            for (var i=0; i<t.length; i++) {
                tick = t[i];
                if (!tick._breakTick && tick.show && tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        temp = tick._elem.outerHeight(true);
                    }
                    else {
                        temp = tick._elem.outerWidth(true);
                    }
                    if (temp > dim) {
                        dim = temp;
                    }
                }
            }
            tick = null;
            t = null;
            
            if (lshow) {
                w = this._label._elem.outerWidth(true);
                h = this._label._elem.outerHeight(true); 
            }
            if (this.name == 'xaxis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', bottom:'0px'});
            }
            else if (this.name == 'x2axis') {
                dim = dim + h;
                this._elem.css({'height':dim+'px', left:'0px', top:'0px'});
            }
            else if (this.name == 'yaxis') {
                dim = dim + w;
                this._elem.css({'width':dim+'px', left:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
            else {
                dim = dim + w;
                this._elem.css({'width':dim+'px', right:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
        }  
    };    
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.createTicks = function(plot) {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;
        var interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        // get a copy of user's settings for min/max.
        var userMin = this.min;
        var userMax = this.max;
        var userNT = this.numberTicks;
        var userTI = this.tickInterval;

        var threshold = 30;
        this._scalefact =  (Math.max(dim, threshold+1) - threshold)/300.0;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0; i<userTicks.length; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if ($.isArray(ut)) {
                    t.value = ut[0];
                    if (this.breakPoints) {
                        if (ut[0] == this.breakPoints[0]) {
                            t.label = this.breakTickLabel;
                            t._breakTick = true;
                            t.showGridline = false;
                            t.showMark = false;
                        }
                        else if (ut[0] > this.breakPoints[0] && ut[0] <= this.breakPoints[1]) {
                            t.show = false;
                            t.showGridline = false;
                            t.label = ut[1];
                        }
                        else {
                            t.label = ut[1];
                        }
                    }
                    else {
                        t.label = ut[1];
                    }
                    t.setTick(ut[0], this.name);
                    this._ticks.push(t);
                }

                else if ($.isPlainObject(ut)) {
                    $.extend(true, t, ut);
                    t.axis = this.name;
                    this._ticks.push(t);
                }
                
                else {
                    t.value = ut;
                    if (this.breakPoints) {
                        if (ut == this.breakPoints[0]) {
                            t.label = this.breakTickLabel;
                            t._breakTick = true;
                            t.showGridline = false;
                            t.showMark = false;
                        }
                        else if (ut > this.breakPoints[0] && ut <= this.breakPoints[1]) {
                            t.show = false;
                            t.showGridline = false;
                        }
                    }
                    t.setTick(ut, this.name);
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
            this.tickInterval = (this.max - this.min) / (this.numberTicks - 1);
        }
        
        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }

            var _numberTicks = this.numberTicks;

            // if aligning this axis, use number of ticks from previous axis.
            // Do I need to reset somehow if alignTicks is changed and then graph is replotted??
            if (this.alignTicks) {
                if (this.name === 'x2axis' && plot.axes.xaxis.show) {
                    _numberTicks = plot.axes.xaxis.numberTicks;
                }
                else if (this.name.charAt(0) === 'y' && this.name !== 'yaxis' && this.name !== 'yMidAxis' && plot.axes.yaxis.show) {
                    _numberTicks = plot.axes.yaxis.numberTicks;
                }
            }
        
            min = ((this.min != null) ? this.min : db.min);
            max = ((this.max != null) ? this.max : db.max);

            var range = max - min;
            var rmin, rmax;
            var temp;

            if (this.tickOptions == null || !this.tickOptions.formatString) {
                this._overrideFormatString = true;
            }

            // Doing complete autoscaling
            if (this.min == null || this.max == null && this.tickInterval == null && !this.autoscale) {
                // Check if user must have tick at 0 or 100 and ensure they are in range.
                // The autoscaling algorithm will always place ticks at 0 and 100 if they are in range.
                if (this.forceTickAt0) {
                    if (min > 0) {
                        min = 0;
                    }
                    if (max < 0) {
                        max = 0;
                    }
                }

                if (this.forceTickAt100) {
                    if (min > 100) {
                        min = 100;
                    }
                    if (max < 100) {
                        max = 100;
                    }
                }

                var keepMin = false,
                    keepMax = false;

                if (this.min != null) {
                    keepMin = true;
                }

                else if (this.max != null) {
                    keepMax = true;
                }

                // var threshold = 30;
                // var tdim = Math.max(dim, threshold+1);
                // this._scalefact =  (tdim-threshold)/300.0;
                var ret = $.jqplot.LinearTickGenerator(min, max, this._scalefact, _numberTicks, keepMin, keepMax); 
                // calculate a padded max and min, points should be less than these
                // so that they aren't too close to the edges of the plot.
                // User can adjust how much padding is allowed with pad, padMin and PadMax options. 
                // If min or max is set, don't pad that end of axis.
                var tumin = (this.min != null) ? min : min + range*(this.padMin - 1);
                var tumax = (this.max != null) ? max : max - range*(this.padMax - 1);

                // if they're equal, we shouldn't have to do anything, right?
                // if (min <=tumin || max >= tumax) {
                if (min <tumin || max > tumax) {
                    tumin = (this.min != null) ? min : min - range*(this.padMin - 1);
                    tumax = (this.max != null) ? max : max + range*(this.padMax - 1);
                    ret = $.jqplot.LinearTickGenerator(tumin, tumax, this._scalefact, _numberTicks, keepMin, keepMax);
                }

                this.min = ret[0];
                this.max = ret[1];
                // if numberTicks specified, it should return the same.
                this.numberTicks = ret[2];
                this._autoFormatString = ret[3];
                this.tickInterval = ret[4];
            }

            // User has specified some axis scale related option, can use auto algorithm
            else {
                
                // if min and max are same, space them out a bit
                if (min == max) {
                    var adj = 0.05;
                    if (min > 0) {
                        adj = Math.max(Math.log(min)/Math.LN10, 0.05);
                    }
                    min -= adj;
                    max += adj;
                }
                
                // autoscale.  Can't autoscale if min or max is supplied.
                // Will use numberTicks and tickInterval if supplied.  Ticks
                // across multiple axes may not line up depending on how
                // bars are to be plotted.
                if (this.autoscale && this.min == null && this.max == null) {
                    var rrange, ti, margin;
                    var forceMinZero = false;
                    var forceZeroLine = false;
                    var intervals = {min:null, max:null, average:null, stddev:null};
                    // if any series are bars, or if any are fill to zero, and if this
                    // is the axis to fill toward, check to see if we can start axis at zero.
                    for (var i=0; i<this._series.length; i++) {
                        var s = this._series[i];
                        var faname = (s.fillAxis == 'x') ? s._xaxis.name : s._yaxis.name;
                        // check to see if this is the fill axis
                        if (this.name == faname) {
                            var vals = s._plotValues[s.fillAxis];
                            var vmin = vals[0];
                            var vmax = vals[0];
                            for (var j=1; j<vals.length; j++) {
                                if (vals[j] < vmin) {
                                    vmin = vals[j];
                                }
                                else if (vals[j] > vmax) {
                                    vmax = vals[j];
                                }
                            }
                            var dp = (vmax - vmin) / vmax;
                            // is this sries a bar?
                            if (s.renderer.constructor == $.jqplot.BarRenderer) {
                                // if no negative values and could also check range.
                                if (vmin >= 0 && (s.fillToZero || dp > 0.1)) {
                                    forceMinZero = true;
                                }
                                else {
                                    forceMinZero = false;
                                    if (s.fill && s.fillToZero && vmin < 0 && vmax > 0) {
                                        forceZeroLine = true;
                                    }
                                    else {
                                        forceZeroLine = false;
                                    }
                                }
                            }
                            
                            // if not a bar and filling, use appropriate method.
                            else if (s.fill) {
                                if (vmin >= 0 && (s.fillToZero || dp > 0.1)) {
                                    forceMinZero = true;
                                }
                                else if (vmin < 0 && vmax > 0 && s.fillToZero) {
                                    forceMinZero = false;
                                    forceZeroLine = true;
                                }
                                else {
                                    forceMinZero = false;
                                    forceZeroLine = false;
                                }
                            }
                            
                            // if not a bar and not filling, only change existing state
                            // if it doesn't make sense
                            else if (vmin < 0) {
                                forceMinZero = false;
                            }
                        }
                    }
                    
                    // check if we need make axis min at 0.
                    if (forceMinZero) {
                        // compute number of ticks
                        this.numberTicks = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                        this.min = 0;
                        userMin = 0;
                        // what order is this range?
                        // what tick interval does that give us?
                        ti = max/(this.numberTicks-1);
                        temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti)/Math.LN10)));
                        if (ti/temp == parseInt(ti/temp, 10)) {
                            ti += temp;
                        }
                        this.tickInterval = Math.ceil(ti/temp) * temp;
                        this.max = this.tickInterval * (this.numberTicks - 1);
                    }
                    
                    // check if we need to make sure there is a tick at 0.
                    else if (forceZeroLine) {
                        // compute number of ticks
                        this.numberTicks = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                        var ntmin = Math.ceil(Math.abs(min)/range*(this.numberTicks-1));
                        var ntmax = this.numberTicks - 1  - ntmin;
                        ti = Math.max(Math.abs(min/ntmin), Math.abs(max/ntmax));
                        temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti)/Math.LN10)));
                        this.tickInterval = Math.ceil(ti/temp) * temp;
                        this.max = this.tickInterval * ntmax;
                        this.min = -this.tickInterval * ntmin;
                    }
                    
                    // if nothing else, do autoscaling which will try to line up ticks across axes.
                    else {  
                        if (this.numberTicks == null){
                            if (this.tickInterval) {
                                this.numberTicks = 3 + Math.ceil(range / this.tickInterval);
                            }
                            else {
                                this.numberTicks = 2 + Math.ceil((dim-(this.tickSpacing-1))/this.tickSpacing);
                            }
                        }
                
                        if (this.tickInterval == null) {
                            // get a tick interval
                            ti = range/(this.numberTicks - 1);

                            if (ti < 1) {
                                temp = Math.pow(10, Math.abs(Math.floor(Math.log(ti)/Math.LN10)));
                            }
                            else {
                                temp = 1;
                            }
                            this.tickInterval = Math.ceil(ti*temp*this.pad)/temp;
                        }
                        else {
                            temp = 1 / this.tickInterval;
                        }
                        
                        // try to compute a nicer, more even tick interval
                        // temp = Math.pow(10, Math.floor(Math.log(ti)/Math.LN10));
                        // this.tickInterval = Math.ceil(ti/temp) * temp;
                        rrange = this.tickInterval * (this.numberTicks - 1);
                        margin = (rrange - range)/2;
           
                        if (this.min == null) {
                            this.min = Math.floor(temp*(min-margin))/temp;
                        }
                        if (this.max == null) {
                            this.max = this.min + rrange;
                        }
                    }

                    // Compute a somewhat decent format string if it is needed.
                    // get precision of interval and determine a format string.
                    var sf = $.jqplot.getSignificantFigures(this.tickInterval);

                    var fstr;

                    // if we have only a whole number, use integer formatting
                    if (sf.digitsLeft >= sf.significantDigits) {
                        fstr = '%d';
                    }

                    else {
                        var temp = Math.max(0, 5 - sf.digitsLeft);
                        temp = Math.min(temp, sf.digitsRight);
                        fstr = '%.'+ temp + 'f';
                    }

                    this._autoFormatString = fstr;
                }
                
                // Use the default algorithm which pads each axis to make the chart
                // centered nicely on the grid.
                else {

                    rmin = (this.min != null) ? this.min : min - range*(this.padMin - 1);
                    rmax = (this.max != null) ? this.max : max + range*(this.padMax - 1);
                    range = rmax - rmin;
        
                    if (this.numberTicks == null){
                        // if tickInterval is specified by user, we will ignore computed maximum.
                        // max will be equal or greater to fit even # of ticks.
                        if (this.tickInterval != null) {
                            this.numberTicks = Math.ceil((rmax - rmin)/this.tickInterval)+1;
                        }
                        else if (dim > 100) {
                            this.numberTicks = parseInt(3+(dim-100)/75, 10);
                        }
                        else {
                            this.numberTicks = 2;
                        }
                    }
                
                    if (this.tickInterval == null) {
                        this.tickInterval = range / (this.numberTicks-1);
                    }
                    
                    if (this.max == null) {
                        rmax = rmin + this.tickInterval*(this.numberTicks - 1);
                    }        
                    if (this.min == null) {
                        rmin = rmax - this.tickInterval*(this.numberTicks - 1);
                    }

                    // get precision of interval and determine a format string.
                    var sf = $.jqplot.getSignificantFigures(this.tickInterval);

                    var fstr;

                    // if we have only a whole number, use integer formatting
                    if (sf.digitsLeft >= sf.significantDigits) {
                        fstr = '%d';
                    }

                    else {
                        var temp = Math.max(0, 5 - sf.digitsLeft);
                        temp = Math.min(temp, sf.digitsRight);
                        fstr = '%.'+ temp + 'f';
                    }


                    this._autoFormatString = fstr;

                    this.min = rmin;
                    this.max = rmax;
                }
                
                if (this.renderer.constructor == $.jqplot.LinearAxisRenderer && this._autoFormatString == '') {
                    // fix for misleading tick display with small range and low precision.
                    range = this.max - this.min;
                    // figure out precision
                    var temptick = new this.tickRenderer(this.tickOptions);
                    // use the tick formatString or, the default.
                    var fs = temptick.formatString || $.jqplot.config.defaultTickFormatString; 
                    var fs = fs.match($.jqplot.sprintf.regex)[0];
                    var precision = 0;
                    if (fs) {
                        if (fs.search(/[fFeEgGpP]/) > -1) {
                            var m = fs.match(/\%\.(\d{0,})?[eEfFgGpP]/);
                            if (m) {
                                precision = parseInt(m[1], 10);
                            }
                            else {
                                precision = 6;
                            }
                        }
                        else if (fs.search(/[di]/) > -1) {
                            precision = 0;
                        }
                        // fact will be <= 1;
                        var fact = Math.pow(10, -precision);
                        if (this.tickInterval < fact) {
                            // need to correct underrange
                            if (userNT == null && userTI == null) {
                                this.tickInterval = fact;
                                if (userMax == null && userMin == null) {
                                    // this.min = Math.floor((this._dataBounds.min - this.tickInterval)/fact) * fact;
                                    this.min = Math.floor(this._dataBounds.min/fact) * fact;
                                    if (this.min == this._dataBounds.min) {
                                        this.min = this._dataBounds.min - this.tickInterval;
                                    }
                                    // this.max = Math.ceil((this._dataBounds.max + this.tickInterval)/fact) * fact;
                                    this.max = Math.ceil(this._dataBounds.max/fact) * fact;
                                    if (this.max == this._dataBounds.max) {
                                        this.max = this._dataBounds.max + this.tickInterval;
                                    }
                                    var n = (this.max - this.min)/this.tickInterval;
                                    n = n.toFixed(11);
                                    n = Math.ceil(n);
                                    this.numberTicks = n + 1;
                                }
                                else if (userMax == null) {
                                    // add one tick for top of range.
                                    var n = (this._dataBounds.max - this.min) / this.tickInterval;
                                    n = n.toFixed(11);
                                    this.numberTicks = Math.ceil(n) + 2;
                                    this.max = this.min + this.tickInterval * (this.numberTicks-1);
                                }
                                else if (userMin == null) {
                                    // add one tick for bottom of range.
                                    var n = (this.max - this._dataBounds.min) / this.tickInterval;
                                    n = n.toFixed(11);
                                    this.numberTicks = Math.ceil(n) + 2;
                                    this.min = this.max - this.tickInterval * (this.numberTicks-1);
                                }
                                else {
                                    // calculate a number of ticks so max is within axis scale
                                    this.numberTicks = Math.ceil((userMax - userMin)/this.tickInterval) + 1;
                                    // if user's min and max don't fit evenly in ticks, adjust.
                                    // This takes care of cases such as user min set to 0, max set to 3.5 but tick
                                    // format string set to %d (integer ticks)
                                    this.min =  Math.floor(userMin*Math.pow(10, precision))/Math.pow(10, precision);
                                    this.max =  Math.ceil(userMax*Math.pow(10, precision))/Math.pow(10, precision);
                                    // this.max = this.min + this.tickInterval*(this.numberTicks-1);
                                    this.numberTicks = Math.ceil((this.max - this.min)/this.tickInterval) + 1;
                                }
                            }
                        }
                    }
                }
                
            }
            
            if (this._overrideFormatString && this._autoFormatString != '') {
                this.tickOptions = this.tickOptions || {};
                this.tickOptions.formatString = this._autoFormatString;
            }

            var t, to;
            for (var i=0; i<this.numberTicks; i++){
                tt = this.min + i * this.tickInterval;
                t = new this.tickRenderer(this.tickOptions);
                // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);

                t.setTick(tt, this.name);
                this._ticks.push(t);

                if (i < this.numberTicks - 1) {
                    for (var j=0; j<this.minorTicks; j++) {
                        tt += this.tickInterval/(this.minorTicks+1);
                        to = $.extend(true, {}, this.tickOptions, {name:this.name, value:tt, label:'', isMinorTick:true});
                        t = new this.tickRenderer(to);
                        this._ticks.push(t);
                    }
                }
                t = null;
            }
        }

        if (this.tickInset) {
            this.min = this.min - this.tickInset * this.tickInterval;
            this.max = this.max + this.tickInset * this.tickInterval;
        }

        ticks = null;
    };
    
    // Used to reset just the values of the ticks and then repack, which will
    // recalculate the positioning functions.  It is assuemd that the 
    // number of ticks is the same and the values of the new array are at the
    // proper interval.
    // This method needs to be called with the scope of an axis object, like:
    //
    // > plot.axes.yaxis.renderer.resetTickValues.call(plot.axes.yaxis, yarr);
    //
    $.jqplot.LinearAxisRenderer.prototype.resetTickValues = function(opts) {
        if ($.isArray(opts) && opts.length == this._ticks.length) {
            var t;
            for (var i=0; i<opts.length; i++) {
                t = this._ticks[i];
                t.value = opts[i];
                t.label = t.formatter(t.formatString, opts[i]);
                t.label = t.prefix + t.label;
                t._elem.html(t.label);
            }
            t = null;
            this.min = $.jqplot.arrayMin(opts);
            this.max = $.jqplot.arrayMax(opts);
            this.pack();
        }
        // Not implemented yet.
        // else if ($.isPlainObject(opts)) {
        // 
        // }
    };
    
    // called with scope of axis
    $.jqplot.LinearAxisRenderer.prototype.pack = function(pos, offsets) {
        // Add defaults for repacking from resetTickValues function.
        pos = pos || {};
        offsets = offsets || this._offsets;
        
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        var offmax = offsets.max;
        var offmin = offsets.min;
        var lshow = (this._label == null) ? false : this._label.show;
        
        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        
        // point to unit and unit to point conversions references to Plot DOM element top left corner.
        if (this.breakPoints) {
            unitlength = unitlength - this.breakPoints[1] + this.breakPoints[0];
            
            this.p2u = function(p){
                return (p - offmin) * unitlength / pixellength + min;
            };
        
            this.u2p = function(u){
                if (u > this.breakPoints[0] && u < this.breakPoints[1]){
                    u = this.breakPoints[0];
                }
                if (u <= this.breakPoints[0]) {
                    return (u - min) * pixellength / unitlength + offmin;
                }
                else {
                    return (u - this.breakPoints[1] + this.breakPoints[0] - min) * pixellength / unitlength + offmin;
                }
            };
                
            if (this.name.charAt(0) == 'x'){
                this.series_u2p = function(u){
                    if (u > this.breakPoints[0] && u < this.breakPoints[1]){
                        u = this.breakPoints[0];
                    }
                    if (u <= this.breakPoints[0]) {
                        return (u - min) * pixellength / unitlength;
                    }
                    else {
                        return (u - this.breakPoints[1] + this.breakPoints[0] - min) * pixellength / unitlength;
                    }
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + min;
                };
            }
        
            else {
                this.series_u2p = function(u){
                    if (u > this.breakPoints[0] && u < this.breakPoints[1]){
                        u = this.breakPoints[0];
                    }
                    if (u >= this.breakPoints[1]) {
                        return (u - max) * pixellength / unitlength;
                    }
                    else {
                        return (u + this.breakPoints[1] - this.breakPoints[0] - max) * pixellength / unitlength;
                    }
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + max;
                };
            }
        }
        else {
            this.p2u = function(p){
                return (p - offmin) * unitlength / pixellength + min;
            };
        
            this.u2p = function(u){
                return (u - min) * pixellength / unitlength + offmin;
            };
                
            if (this.name == 'xaxis' || this.name == 'x2axis'){
                this.series_u2p = function(u){
                    return (u - min) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + min;
                };
            }
        
            else {
                this.series_u2p = function(u){
                    return (u - max) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + max;
                };
            }
        }
        
        if (this.show) {
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {
                        var shim;
                        
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'xaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                    if (temp * t.angle < 0) {
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    }
                                    // position at start
                                    else {
                                        shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'end':
                                    shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                case 'start':
                                    shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    break;
                                case 'middle':
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                default:
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getWidth()/2;
                        }
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('left', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var w = this._label._elem.outerWidth(true);
                    this._label._elem.css('left', offmin + pixellength/2 - w/2 + 'px');
                    if (this.name == 'xaxis') {
                        this._label._elem.css('bottom', '0px');
                    }
                    else {
                        this._label._elem.css('top', '0px');
                    }
                    this._label.pack();
                }
            }
            else {
                for (var i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {                        
                        var shim;
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'yaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                case 'end':
                                    if (temp * t.angle < 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'start':
                                    if (t.angle > 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'middle':
                                    // if (t.angle > 0) {
                                    //     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    // }
                                    // else {
                                    //     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    // }
                                    shim = -t.getHeight()/2;
                                    break;
                                default:
                                    shim = -t.getHeight()/2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getHeight()/2;
                        }
                        
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('top', val);
                        t.pack();
                    }
                }
                if (lshow) {
                    var h = this._label._elem.outerHeight(true);
                    this._label._elem.css('top', offmax - pixellength/2 - h/2 + 'px');
                    if (this.name == 'yaxis') {
                        this._label._elem.css('left', '0px');
                    }
                    else {
                        this._label._elem.css('right', '0px');
                    }   
                    this._label.pack();
                }
            }
        }

        ticks = null;
    };


    /**
    * The following code was generaously given to me a while back by Scott Prahl.
    * He did a good job at computing axes min, max and number of ticks for the 
    * case where the user has not set any scale related parameters (tickInterval,
    * numberTicks, min or max).  I had ignored this use case for a long time,
    * focusing on the more difficult case where user has set some option controlling
    * tick generation.  Anyway, about time I got this into jqPlot.
    * Thanks Scott!!
    */
    
    /**
    * Copyright (c) 2010 Scott Prahl
    * The next three routines are currently available for use in all personal 
    * or commercial projects under both the MIT and GPL version 2.0 licenses. 
    * This means that you can choose the license that best suits your project 
    * and use it accordingly. 
    */

    // A good format string depends on the interval. If the interval is greater 
    // than 1 then there is no need to show any decimal digits. If it is < 1.0, then
    // use the magnitude of the interval to determine the number of digits to show.
    function bestFormatString (interval)
    {
        var fstr;
        interval = Math.abs(interval);
        if (interval >= 10) {
            fstr = '%d';
        }

        else if (interval > 1) {
            if (interval === parseInt(interval, 10)) {
                fstr = '%d';
            }
            else {
                fstr = '%.1f';
            }
        }

        else {
            var expv = -Math.floor(Math.log(interval)/Math.LN10);
            fstr = '%.' + expv + 'f';
        }
        
        return fstr; 
    }

    var _factors = [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1, 2, 3, 4, 5];

    var _getLowerFactor = function(f) {
        var i = _factors.indexOf(f);
        if (i > 0) {
            return _factors[i-1];
        }
        else {
            return _factors[_factors.length - 1] / 100;
        }
    };

    var _getHigherFactor = function(f) {
        var i = _factors.indexOf(f);
        if (i < _factors.length-1) {
            return _factors[i+1];
        }
        else {
            return _factors[0] * 100;
        }
    };

    // Given a fixed minimum and maximum and a target number ot ticks
    // figure out the best interval and 
    // return min, max, number ticks, format string and tick interval
    function bestConstrainedInterval(min, max, nttarget) {
        // run through possible number to ticks and see which interval is best
        var low = Math.floor(nttarget/2);
        var hi = Math.ceil(nttarget*1.5);
        var badness = Number.MAX_VALUE;
        var r = (max - min);
        var temp;
        var sd;
        var bestNT;
        var gsf = $.jqplot.getSignificantFigures;
        var fsd;
        var fs;
        var currentNT;
        var bestPrec;

        for (var i=0, l=hi-low+1; i<l; i++) {
            currentNT = low + i;
            temp = r/(currentNT-1);
            sd = gsf(temp);

            temp = Math.abs(nttarget - currentNT) + sd.digitsRight;
            if (temp < badness) {
                badness = temp;
                bestNT = currentNT;
                bestPrec = sd.digitsRight;
            }
            else if (temp === badness) {
                // let nicer ticks trump number ot ticks
                if (sd.digitsRight < bestPrec) {
                    bestNT = currentNT;
                    bestPrec = sd.digitsRight;
                }
            }

        }

        fsd = Math.max(bestPrec, Math.max(gsf(min).digitsRight, gsf(max).digitsRight));
        if (fsd === 0) {
            fs = '%d';
        }
        else {
            fs = '%.' + fsd + 'f';
        }
        temp = r / (bestNT - 1);
        // min, max, number ticks, format string, tick interval
        return [min, max, bestNT, fs, temp];
    }

    // This will return an interval of form 2 * 10^n, 5 * 10^n or 10 * 10^n
    // it is based soley on the range and number of ticks.  So if user specifies
    // number of ticks, use this.
    function bestInterval(range, numberTicks) {
        numberTicks = numberTicks || 7;
        var minimum = range / (numberTicks - 1);
        var magnitude = Math.pow(10, Math.floor(Math.log(minimum) / Math.LN10));
        var residual = minimum / magnitude;
        var interval;
        // "nicest" ranges are 1, 2, 5 or powers of these.
        // for magnitudes below 1, only allow these. 
        if (magnitude < 1) {
            if (residual > 5) {
                interval = 10 * magnitude;
            }
            else if (residual > 2) {
                interval = 5 * magnitude;
            }
            else if (residual > 1) {
                interval = 2 * magnitude;
            }
            else {
                interval = magnitude;
            }
        }
        // for large ranges (whole integers), allow intervals like 3, 4 or powers of these.
        // this helps a lot with poor choices for number of ticks. 
        else {
            if (residual > 5) {
                interval = 10 * magnitude;
            }
            else if (residual > 4) {
                interval = 5 * magnitude;
            }
            else if (residual > 3) {
                interval = 4 * magnitude;
            }
            else if (residual > 2) {
                interval = 3 * magnitude;
            }
            else if (residual > 1) {
                interval = 2 * magnitude;
            }
            else {
                interval = magnitude;
            }
        }

        return interval;
    }

    // This will return an interval of form 2 * 10^n, 5 * 10^n or 10 * 10^n
    // it is based soley on the range of data, number of ticks must be computed later.
    function bestLinearInterval(range, scalefact) {
        scalefact = scalefact || 1;
        var expv = Math.floor(Math.log(range)/Math.LN10);
        var magnitude = Math.pow(10, expv);
        // 0 < f < 10
        var f = range / magnitude;
        var fact;
        // for large plots, scalefact will decrease f and increase number of ticks.
        // for small plots, scalefact will increase f and decrease number of ticks.
        f = f/scalefact;

        // for large plots, smaller interval, more ticks.
        if (f<=0.38) {
            fact = 0.1;
        }
        else if (f<=1.6) {
            fact = 0.2;
        }
        else if (f<=4.0) {
            fact = 0.5;
        }
        else if (f<=8.0) {
            fact = 1.0;
        }
        // for very small plots, larger interval, less ticks in number ticks
        else if (f<=16.0) {
            fact = 2;
        }
        else {
            fact = 5;
        } 

        return fact*magnitude; 
    }

    function bestLinearComponents(range, scalefact) {
        var expv = Math.floor(Math.log(range)/Math.LN10);
        var magnitude = Math.pow(10, expv);
        // 0 < f < 10
        var f = range / magnitude;
        var interval;
        var fact;
        // for large plots, scalefact will decrease f and increase number of ticks.
        // for small plots, scalefact will increase f and decrease number of ticks.
        f = f/scalefact;

        // for large plots, smaller interval, more ticks.
        if (f<=0.38) {
            fact = 0.1;
        }
        else if (f<=1.6) {
            fact = 0.2;
        }
        else if (f<=4.0) {
            fact = 0.5;
        }
        else if (f<=8.0) {
            fact = 1.0;
        }
        // for very small plots, larger interval, less ticks in number ticks
        else if (f<=16.0) {
            fact = 2;
        }
        // else if (f<=20.0) {
        //     fact = 3;
        // }
        // else if (f<=24.0) {
        //     fact = 4;
        // }
        else {
            fact = 5;
        } 

        interval = fact * magnitude;

        return [interval, fact, magnitude];
    }

    // Given the min and max for a dataset, return suitable endpoints
    // for the graphing, a good number for the number of ticks, and a
    // format string so that extraneous digits are not displayed.
    // returned is an array containing [min, max, nTicks, format]
    $.jqplot.LinearTickGenerator = function(axis_min, axis_max, scalefact, numberTicks, keepMin, keepMax) {
        // Set to preserve EITHER min OR max.
        // If min is preserved, max must be free.
        keepMin = (keepMin === null) ? false : keepMin;
        keepMax = (keepMax === null || keepMin) ? false : keepMax;
        // if endpoints are equal try to include zero otherwise include one
        if (axis_min === axis_max) {
            axis_max = (axis_max) ? 0 : 1;
        }

        scalefact = scalefact || 1.0;

        // make sure range is positive
        if (axis_max < axis_min) {
            var a = axis_max;
            axis_max = axis_min;
            axis_min = a;
        }

        var r = [];
        var ss = bestLinearInterval(axis_max - axis_min, scalefact);

        var gsf = $.jqplot.getSignificantFigures;
        
        if (numberTicks == null) {

            // Figure out the axis min, max and number of ticks
            // the min and max will be some multiple of the tick interval,
            // 1*10^n, 2*10^n or 5*10^n.  This gaurantees that, if the
            // axis min is negative, 0 will be a tick.
            if (!keepMin && !keepMax) {
                r[0] = Math.floor(axis_min / ss) * ss;  // min
                r[1] = Math.ceil(axis_max / ss) * ss;   // max
                r[2] = Math.round((r[1]-r[0])/ss+1.0);  // number of ticks
                r[3] = bestFormatString(ss);            // format string
                r[4] = ss;                              // tick Interval
            }

            else if (keepMin) {
                r[0] = axis_min;                                        // min
                r[2] = Math.ceil((axis_max - axis_min) / ss + 1.0);     // number of ticks
                r[1] = axis_min + (r[2] - 1) * ss;                      // max
                var digitsMin = gsf(axis_min).digitsRight;
                var digitsSS = gsf(ss).digitsRight;
                if (digitsMin < digitsSS) {
                    r[3] = bestFormatString(ss);                        // format string
                }
                else {
                    r[3] = '%.' + digitsMin + 'f';
                }
                r[4] = ss;                                              // tick Interval
            }

            else if (keepMax) {
                r[1] = axis_max;                                        // max
                r[2] = Math.ceil((axis_max - axis_min) / ss + 1.0);     // number of ticks
                r[0] = axis_max - (r[2] - 1) * ss;                      // min
                var digitsMax = gsf(axis_max).digitsRight;
                var digitsSS = gsf(ss).digitsRight;
                if (digitsMax < digitsSS) {
                    r[3] = bestFormatString(ss);                        // format string
                }
                else {
                    r[3] = '%.' + digitsMax + 'f';
                }
                r[4] = ss;                                              // tick Interval
            }
        }

        else {
            var tempr = [];

            // Figure out the axis min, max and number of ticks
            // the min and max will be some multiple of the tick interval,
            // 1*10^n, 2*10^n or 5*10^n.  This gaurantees that, if the
            // axis min is negative, 0 will be a tick.
            tempr[0] = Math.floor(axis_min / ss) * ss;  // min
            tempr[1] = Math.ceil(axis_max / ss) * ss;   // max
            tempr[2] = Math.round((tempr[1]-tempr[0])/ss+1.0);    // number of ticks
            tempr[3] = bestFormatString(ss);            // format string
            tempr[4] = ss;                              // tick Interval

            // first, see if we happen to get the right number of ticks
            if (tempr[2] === numberTicks) {
                r = tempr;
            }

            else {

                var newti = bestInterval(tempr[1] - tempr[0], numberTicks);

                r[0] = tempr[0];                        // min
                r[2] = numberTicks;                     // number of ticks
                r[4] = newti;                           // tick interval
                r[3] = bestFormatString(newti);         // format string
                r[1] = r[0] + (r[2] - 1) * r[4];        // max
            }
        }

        return r;
    };

    $.jqplot.LinearTickGenerator.bestLinearInterval = bestLinearInterval;
    $.jqplot.LinearTickGenerator.bestInterval = bestInterval;
    $.jqplot.LinearTickGenerator.bestLinearComponents = bestLinearComponents;
    $.jqplot.LinearTickGenerator.bestConstrainedInterval = bestConstrainedInterval;


    // class: $.jqplot.MarkerRenderer
    // The default jqPlot marker renderer, rendering the points on the line.
    $.jqplot.MarkerRenderer = function(options){
        // Group: Properties
        
        // prop: show
        // whether or not to show the marker.
        this.show = true;
        // prop: style
        // One of diamond, circle, square, x, plus, dash, filledDiamond, filledCircle, filledSquare
        this.style = 'filledCircle';
        // prop: lineWidth
        // size of the line for non-filled markers.
        this.lineWidth = 2;
        // prop: size
        // Size of the marker (diameter or circle, length of edge of square, etc.)
        this.size = 9.0;
        // prop: color
        // color of marker.  Will be set to color of series by default on init.
        this.color = '#666666';
        // prop: shadow
        // whether or not to draw a shadow on the line
        this.shadow = true;
        // prop: shadowAngle
        // Shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Shadow offset from line in pixels
        this.shadowOffset = 1;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        // prop: shadowRenderer
        // Renderer that will draws the shadows on the marker.
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
        // prop: shapeRenderer
        // Renderer that will draw the marker.
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        
        $.extend(true, this, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        var sdopt = {angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, lineWidth:this.lineWidth, depth:this.shadowDepth, closePath:true};
        if (this.style.indexOf('filled') != -1) {
            sdopt.fill = true;
        }
        if (this.style.indexOf('ircle') != -1) {
            sdopt.isarc = true;
            sdopt.closePath = false;
        }
        this.shadowRenderer.init(sdopt);
        
        var shopt = {fill:false, isarc:false, strokeStyle:this.color, fillStyle:this.color, lineWidth:this.lineWidth, closePath:true};
        if (this.style.indexOf('filled') != -1) {
            shopt.fill = true;
        }
        if (this.style.indexOf('ircle') != -1) {
            shopt.isarc = true;
            shopt.closePath = false;
        }
        this.shapeRenderer.init(shopt);
    };
    
    $.jqplot.MarkerRenderer.prototype.drawDiamond = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/2/stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y], [x, y+dy], [x+dx, y], [x, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.drawPlus = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points1 = [[x, y-dy], [x, y+dy]];
        var points2 = [[x+dx, y], [x-dx, y]];
        var opts = $.extend(true, {}, this.options, {closePath:false});
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points1, {closePath:false});
            this.shadowRenderer.draw(ctx, points2, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points1, opts);
        this.shapeRenderer.draw(ctx, points2, opts);
    };
    
    $.jqplot.MarkerRenderer.prototype.drawX = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var opts = $.extend(true, {}, this.options, {closePath:false});
        var points1 = [[x-dx, y-dy], [x+dx, y+dy]];
        var points2 = [[x-dx, y+dy], [x+dx, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points1, {closePath:false});
            this.shadowRenderer.draw(ctx, points2, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points1, opts);
        this.shapeRenderer.draw(ctx, points2, opts);
    };
    
    $.jqplot.MarkerRenderer.prototype.drawDash = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y], [x+dx, y]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.drawLine = function(p1, p2, ctx, fill, options) {
        var points = [p1, p2];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.drawSquare = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2/stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y-dy], [x-dx, y+dy], [x+dx, y+dy], [x+dx, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.drawCircle = function(x, y, ctx, fill, options) {
        var radius = this.size/2;
        var end = 2*Math.PI;
        var points = [x, y, radius, 0, end, true];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.draw = function(x, y, ctx, options) {
        options = options || {};
        // hack here b/c shape renderer uses canvas based color style options
        // and marker uses css style names.
        if (options.show == null || options.show != false) {
            if (options.color && !options.fillStyle) {
                options.fillStyle = options.color;
            }
            if (options.color && !options.strokeStyle) {
                options.strokeStyle = options.color;
            }
            switch (this.style) {
                case 'diamond':
                    this.drawDiamond(x,y,ctx, false, options);
                    break;
                case 'filledDiamond':
                    this.drawDiamond(x,y,ctx, true, options);
                    break;
                case 'circle':
                    this.drawCircle(x,y,ctx, false, options);
                    break;
                case 'filledCircle':
                    this.drawCircle(x,y,ctx, true, options);
                    break;
                case 'square':
                    this.drawSquare(x,y,ctx, false, options);
                    break;
                case 'filledSquare':
                    this.drawSquare(x,y,ctx, true, options);
                    break;
                case 'x':
                    this.drawX(x,y,ctx, true, options);
                    break;
                case 'plus':
                    this.drawPlus(x,y,ctx, true, options);
                    break;
                case 'dash':
                    this.drawDash(x,y,ctx, true, options);
                    break;
                case 'line':
                    this.drawLine(x, y, ctx, false, options);
                    break;
                default:
                    this.drawDiamond(x,y,ctx, false, options);
                    break;
            }
        }
    };
    
    // class: $.jqplot.shadowRenderer
    // The default jqPlot shadow renderer, rendering shadows behind shapes.
    $.jqplot.ShadowRenderer = function(options){ 
        // Group: Properties
        
        // prop: angle
        // Angle of the shadow in degrees.  Measured counter-clockwise from the x axis.
        this.angle = 45;
        // prop: offset
        // Pixel offset at the given shadow angle of each shadow stroke from the last stroke.
        this.offset = 1;
        // prop: alpha
        // alpha transparency of shadow stroke.
        this.alpha = 0.07;
        // prop: lineWidth
        // width of the shadow line stroke.
        this.lineWidth = 1.5;
        // prop: lineJoin
        // How line segments of the shadow are joined.
        this.lineJoin = 'miter';
        // prop: lineCap
        // how ends of the shadow line are rendered.
        this.lineCap = 'round';
        // prop; closePath
        // whether line path segment is closed upon itself.
        this.closePath = false;
        // prop: fill
        // whether to fill the shape.
        this.fill = false;
        // prop: depth
        // how many times the shadow is stroked.  Each stroke will be offset by offset at angle degrees.
        this.depth = 3;
        this.strokeStyle = 'rgba(0,0,0,0.1)';
        // prop: isarc
        // whether the shadow is an arc or not.
        this.isarc = false;
        
        $.extend(true, this, options);
    };
    
    $.jqplot.ShadowRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    // function: draw
    // draws an transparent black (i.e. gray) shadow.
    //
    // ctx - canvas drawing context
    // points - array of points or [x, y, radius, start angle (rad), end angle (rad)]
    $.jqplot.ShadowRenderer.prototype.draw = function(ctx, points, options) {
        ctx.save();
        var opts = (options != null) ? options : {};
        var fill = (opts.fill != null) ? opts.fill : this.fill;
        var fillRect = (opts.fillRect != null) ? opts.fillRect : this.fillRect;
        var closePath = (opts.closePath != null) ? opts.closePath : this.closePath;
        var offset = (opts.offset != null) ? opts.offset : this.offset;
        var alpha = (opts.alpha != null) ? opts.alpha : this.alpha;
        var depth = (opts.depth != null) ? opts.depth : this.depth;
        var isarc = (opts.isarc != null) ? opts.isarc : this.isarc;
        var linePattern = (opts.linePattern != null) ? opts.linePattern : this.linePattern;
        ctx.lineWidth = (opts.lineWidth != null) ? opts.lineWidth : this.lineWidth;
        ctx.lineJoin = (opts.lineJoin != null) ? opts.lineJoin : this.lineJoin;
        ctx.lineCap = (opts.lineCap != null) ? opts.lineCap : this.lineCap;
        ctx.strokeStyle = opts.strokeStyle || this.strokeStyle || 'rgba(0,0,0,'+alpha+')';
        ctx.fillStyle = opts.fillStyle || this.fillStyle || 'rgba(0,0,0,'+alpha+')';
        for (var j=0; j<depth; j++) {
            var ctxPattern = $.jqplot.LinePattern(ctx, linePattern);
            ctx.translate(Math.cos(this.angle*Math.PI/180)*offset, Math.sin(this.angle*Math.PI/180)*offset);
            ctxPattern.beginPath();
            if (isarc) {
                ctx.arc(points[0], points[1], points[2], points[3], points[4], true);                
            }
            else if (fillRect) {
                if (fillRect) {
                    ctx.fillRect(points[0], points[1], points[2], points[3]);
                }
            }
            else if (points && points.length){
                var move = true;
                for (var i=0; i<points.length; i++) {
                    // skip to the first non-null point and move to it.
                    if (points[i][0] != null && points[i][1] != null) {
                        if (move) {
                            ctxPattern.moveTo(points[i][0], points[i][1]);
                            move = false;
                        }
                        else {
                            ctxPattern.lineTo(points[i][0], points[i][1]);
                        }
                    }
                    else {
                        move = true;
                    }
                }
                
            }
            if (closePath) {
                ctxPattern.closePath();
            }
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
        ctx.restore();
    };
    
    // class: $.jqplot.shapeRenderer
    // The default jqPlot shape renderer.  Given a set of points will
    // plot them and either stroke a line (fill = false) or fill them (fill = true).
    // If a filled shape is desired, closePath = true must also be set to close
    // the shape.
    $.jqplot.ShapeRenderer = function(options){
        
        this.lineWidth = 1.5;
        // prop: linePattern
        // line pattern 'dashed', 'dotted', 'solid', some combination
        // of '-' and '.' characters such as '.-.' or a numerical array like 
        // [draw, skip, draw, skip, ...] such as [1, 10] to draw a dotted line, 
        // [1, 10, 20, 10] to draw a dot-dash line, and so on.
        this.linePattern = 'solid';
        // prop: lineJoin
        // How line segments of the shadow are joined.
        this.lineJoin = 'miter';
        // prop: lineCap
        // how ends of the shadow line are rendered.
        this.lineCap = 'round';
        // prop; closePath
        // whether line path segment is closed upon itself.
        this.closePath = false;
        // prop: fill
        // whether to fill the shape.
        this.fill = false;
        // prop: isarc
        // whether the shadow is an arc or not.
        this.isarc = false;
        // prop: fillRect
        // true to draw shape as a filled rectangle.
        this.fillRect = false;
        // prop: strokeRect
        // true to draw shape as a stroked rectangle.
        this.strokeRect = false;
        // prop: clearRect
        // true to cear a rectangle.
        this.clearRect = false;
        // prop: strokeStyle
        // css color spec for the stoke style
        this.strokeStyle = '#999999';
        // prop: fillStyle
        // css color spec for the fill style.
        this.fillStyle = '#999999'; 
        
        $.extend(true, this, options);
    };
    
    $.jqplot.ShapeRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    // function: draw
    // draws the shape.
    //
    // ctx - canvas drawing context
    // points - array of points for shapes or 
    // [x, y, width, height] for rectangles or
    // [x, y, radius, start angle (rad), end angle (rad)] for circles and arcs.
    $.jqplot.ShapeRenderer.prototype.draw = function(ctx, points, options) {
        ctx.save();
        var opts = (options != null) ? options : {};
        var fill = (opts.fill != null) ? opts.fill : this.fill;
        var closePath = (opts.closePath != null) ? opts.closePath : this.closePath;
        var fillRect = (opts.fillRect != null) ? opts.fillRect : this.fillRect;
        var strokeRect = (opts.strokeRect != null) ? opts.strokeRect : this.strokeRect;
        var clearRect = (opts.clearRect != null) ? opts.clearRect : this.clearRect;
        var isarc = (opts.isarc != null) ? opts.isarc : this.isarc;
        var linePattern = (opts.linePattern != null) ? opts.linePattern : this.linePattern;
        var ctxPattern = $.jqplot.LinePattern(ctx, linePattern);
        ctx.lineWidth = opts.lineWidth || this.lineWidth;
        ctx.lineJoin = opts.lineJoin || this.lineJoin;
        ctx.lineCap = opts.lineCap || this.lineCap;
        ctx.strokeStyle = (opts.strokeStyle || opts.color) || this.strokeStyle;
        ctx.fillStyle = opts.fillStyle || this.fillStyle;
        ctx.beginPath();
        if (isarc) {
            ctx.arc(points[0], points[1], points[2], points[3], points[4], true);   
            if (closePath) {
                ctx.closePath();
            }
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
            ctx.restore();
            return;
        }
        else if (clearRect) {
            ctx.clearRect(points[0], points[1], points[2], points[3]);
            ctx.restore();
            return;
        }
        else if (fillRect || strokeRect) {
            if (fillRect) {
                ctx.fillRect(points[0], points[1], points[2], points[3]);
            }
            if (strokeRect) {
                ctx.strokeRect(points[0], points[1], points[2], points[3]);
                ctx.restore();
                return;
            }
        }
        else if (points && points.length){
            var move = true;
            for (var i=0; i<points.length; i++) {
                // skip to the first non-null point and move to it.
                if (points[i][0] != null && points[i][1] != null) {
                    if (move) {
                        ctxPattern.moveTo(points[i][0], points[i][1]);
                        move = false;
                    }
                    else {
                        ctxPattern.lineTo(points[i][0], points[i][1]);
                    }
                }
                else {
                    move = true;
                }
            }
            if (closePath) {
                ctxPattern.closePath();
            }
            if (fill) {
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
        ctx.restore();
    };
    
    // class $.jqplot.TableLegendRenderer
    // The default legend renderer for jqPlot.
    $.jqplot.TableLegendRenderer = function(){
        //
    };
    
    $.jqplot.TableLegendRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
        
    $.jqplot.TableLegendRenderer.prototype.addrow = function (label, color, pad, reverse) {
        var rs = (pad) ? this.rowSpacing+'px' : '0px';
        var tr;
        var td;
        var elem;
        var div0;
        var div1;
        elem = document.createElement('tr');
        tr = $(elem);
        tr.addClass('jqplot-table-legend');
        elem = null;

        if (reverse){
            tr.prependTo(this._elem);
        }

        else{
            tr.appendTo(this._elem);
        }

        if (this.showSwatches) {
            td = $(document.createElement('td'));
            td.addClass('jqplot-table-legend jqplot-table-legend-swatch');
            td.css({textAlign: 'center', paddingTop: rs});

            div0 = $(document.createElement('div'));
            div0.addClass('jqplot-table-legend-swatch-outline');
            div1 = $(document.createElement('div'));
            div1.addClass('jqplot-table-legend-swatch');
            div1.css({backgroundColor: color, borderColor: color});

            tr.append(td.append(div0.append(div1)));

            // $('<td class="jqplot-table-legend" style="text-align:center;padding-top:'+rs+';">'+
            // '<div><div class="jqplot-table-legend-swatch" style="background-color:'+color+';border-color:'+color+';"></div>'+
            // '</div></td>').appendTo(tr);
        }
        if (this.showLabels) {
            td = $(document.createElement('td'));
            td.addClass('jqplot-table-legend jqplot-table-legend-label');
            td.css('paddingTop', rs);
            tr.append(td);

            // elem = $('<td class="jqplot-table-legend" style="padding-top:'+rs+';"></td>');
            // elem.appendTo(tr);
            if (this.escapeHtml) {
                td.text(label);
            }
            else {
                td.html(label);
            }
        }
        td = null;
        div0 = null;
        div1 = null;
        tr = null;
        elem = null;
    };
    
    // called with scope of legend
    $.jqplot.TableLegendRenderer.prototype.draw = function() {
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }

        if (this.show) {
            var series = this._series;
            // make a table.  one line label per row.
            var elem = document.createElement('table');
            this._elem = $(elem);
            this._elem.addClass('jqplot-table-legend');

            var ss = {position:'absolute'};
            if (this.background) {
                ss['background'] = this.background;
            }
            if (this.border) {
                ss['border'] = this.border;
            }
            if (this.fontSize) {
                ss['fontSize'] = this.fontSize;
            }
            if (this.fontFamily) {
                ss['fontFamily'] = this.fontFamily;
            }
            if (this.textColor) {
                ss['textColor'] = this.textColor;
            }
            if (this.marginTop != null) {
                ss['marginTop'] = this.marginTop;
            }
            if (this.marginBottom != null) {
                ss['marginBottom'] = this.marginBottom;
            }
            if (this.marginLeft != null) {
                ss['marginLeft'] = this.marginLeft;
            }
            if (this.marginRight != null) {
                ss['marginRight'] = this.marginRight;
            }
            
        
            var pad = false, 
                reverse = false,
                s;
            for (var i = 0; i< series.length; i++) {
                s = series[i];
                if (s._stack || s.renderer.constructor == $.jqplot.BezierCurveRenderer){
                    reverse = true;
                }
                if (s.show && s.showLabel) {
                    var lt = this.labels[i] || s.label.toString();
                    if (lt) {
                        var color = s.color;
                        if (reverse && i < series.length - 1){
                            pad = true;
                        }
                        else if (reverse && i == series.length - 1){
                            pad = false;
                        }
                        this.renderer.addrow.call(this, lt, color, pad, reverse);
                        pad = true;
                    }
                    // let plugins add more rows to legend.  Used by trend line plugin.
                    for (var j=0; j<$.jqplot.addLegendRowHooks.length; j++) {
                        var item = $.jqplot.addLegendRowHooks[j].call(this, s);
                        if (item) {
                            this.renderer.addrow.call(this, item.label, item.color, pad);
                            pad = true;
                        } 
                    }
                    lt = null;
                }
            }
        }
        return this._elem;
    };
    
    $.jqplot.TableLegendRenderer.prototype.pack = function(offsets) {
        if (this.show) {       
            if (this.placement == 'insideGrid') {
                switch (this.location) {
                    case 'nw':
                        var a = offsets.left;
                        var b = offsets.top;
                        this._elem.css('left', a);
                        this._elem.css('top', b);
                        break;
                    case 'n':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = offsets.top;
                        this._elem.css('left', a);
                        this._elem.css('top', b);
                        break;
                    case 'ne':
                        var a = offsets.right;
                        var b = offsets.top;
                        this._elem.css({right:a, top:b});
                        break;
                    case 'e':
                        var a = offsets.right;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({right:a, top:b});
                        break;
                    case 'se':
                        var a = offsets.right;
                        var b = offsets.bottom;
                        this._elem.css({right:a, bottom:b});
                        break;
                    case 's':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = offsets.bottom;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 'sw':
                        var a = offsets.left;
                        var b = offsets.bottom;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 'w':
                        var a = offsets.left;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({left:a, top:b});
                        break;
                    default:  // same as 'se'
                        var a = offsets.right;
                        var b = offsets.bottom;
                        this._elem.css({right:a, bottom:b});
                        break;
                }
                
            }
            else if (this.placement == 'outside'){
                switch (this.location) {
                    case 'nw':
                        var a = this._plotDimensions.width - offsets.left;
                        var b = offsets.top;
                        this._elem.css('right', a);
                        this._elem.css('top', b);
                        break;
                    case 'n':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = this._plotDimensions.height - offsets.top;
                        this._elem.css('left', a);
                        this._elem.css('bottom', b);
                        break;
                    case 'ne':
                        var a = this._plotDimensions.width - offsets.right;
                        var b = offsets.top;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'e':
                        var a = this._plotDimensions.width - offsets.right;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'se':
                        var a = this._plotDimensions.width - offsets.right;
                        var b = offsets.bottom;
                        this._elem.css({left:a, bottom:b});
                        break;
                    case 's':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        var b = this._plotDimensions.height - offsets.bottom;
                        this._elem.css({left:a, top:b});
                        break;
                    case 'sw':
                        var a = this._plotDimensions.width - offsets.left;
                        var b = offsets.bottom;
                        this._elem.css({right:a, bottom:b});
                        break;
                    case 'w':
                        var a = this._plotDimensions.width - offsets.left;
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({right:a, top:b});
                        break;
                    default:  // same as 'se'
                        var a = offsets.right;
                        var b = offsets.bottom;
                        this._elem.css({right:a, bottom:b});
                        break;
                }
            }
            else {
                switch (this.location) {
                    case 'nw':
                        this._elem.css({left:0, top:offsets.top});
                        break;
                    case 'n':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        this._elem.css({left: a, top:offsets.top});
                        break;
                    case 'ne':
                        this._elem.css({right:0, top:offsets.top});
                        break;
                    case 'e':
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({right:offsets.right, top:b});
                        break;
                    case 'se':
                        this._elem.css({right:offsets.right, bottom:offsets.bottom});
                        break;
                    case 's':
                        var a = (offsets.left + (this._plotDimensions.width - offsets.right))/2 - this.getWidth()/2;
                        this._elem.css({left: a, bottom:offsets.bottom});
                        break;
                    case 'sw':
                        this._elem.css({left:offsets.left, bottom:offsets.bottom});
                        break;
                    case 'w':
                        var b = (offsets.top + (this._plotDimensions.height - offsets.bottom))/2 - this.getHeight()/2;
                        this._elem.css({left:offsets.left, top:b});
                        break;
                    default:  // same as 'se'
                        this._elem.css({right:offsets.right, bottom:offsets.bottom});
                        break;
                }
            }
        } 
    };

    /**
     * Class: $.jqplot.ThemeEngine
     * Theme Engine provides a programatic way to change some of the  more
     * common jqplot styling options such as fonts, colors and grid options.
     * A theme engine instance is created with each plot.  The theme engine
     * manages a collection of themes which can be modified, added to, or 
     * applied to the plot.
     * 
     * The themeEngine class is not instantiated directly.
     * When a plot is initialized, the current plot options are scanned
     * an a default theme named "Default" is created.  This theme is
     * used as the basis for other themes added to the theme engine and
     * is always available.
     * 
     * A theme is a simple javascript object with styling parameters for
     * various entities of the plot.  A theme has the form:
     * 
     * 
     * > {
     * >     _name:f "Default",
     * >     target: {
     * >         backgroundColor: "transparent"
     * >     },
     * >     legend: {
     * >         textColor: null,
     * >         fontFamily: null,
     * >         fontSize: null,
     * >         border: null,
     * >         background: null
     * >     },
     * >     title: {
     * >         textColor: "rgb(102, 102, 102)",
     * >         fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif",
     * >         fontSize: "19.2px",
     * >         textAlign: "center"
     * >     },
     * >     seriesStyles: {},
     * >     series: [{
     * >         color: "#4bb2c5",
     * >         lineWidth: 2.5,
     * >         linePattern: "solid",
     * >         shadow: true,
     * >         fillColor: "#4bb2c5",
     * >         showMarker: true,
     * >         markerOptions: {
     * >             color: "#4bb2c5",
     * >             show: true,
     * >             style: 'filledCircle',
     * >             lineWidth: 1.5,
     * >             size: 4,
     * >             shadow: true
     * >         }
     * >     }],
     * >     grid: {
     * >         drawGridlines: true,
     * >         gridLineColor: "#cccccc",
     * >         gridLineWidth: 1,
     * >         backgroundColor: "#fffdf6",
     * >         borderColor: "#999999",
     * >         borderWidth: 2,
     * >         shadow: true
     * >     },
     * >     axesStyles: {
     * >         label: {},
     * >         ticks: {}
     * >     },
     * >     axes: {
     * >         xaxis: {
     * >             borderColor: "#999999",
     * >             borderWidth: 2,
     * >             ticks: {
     * >                 show: true,
     * >                 showGridline: true,
     * >                 showLabel: true,
     * >                 showMark: true,
     * >                 size: 4,
     * >                 textColor: "",
     * >                 whiteSpace: "nowrap",
     * >                 fontSize: "12px",
     * >                 fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif"
     * >             },
     * >             label: {
     * >                 textColor: "rgb(102, 102, 102)",
     * >                 whiteSpace: "normal",
     * >                 fontSize: "14.6667px",
     * >                 fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif",
     * >                 fontWeight: "400"
     * >             }
     * >         },
     * >         yaxis: {
     * >             borderColor: "#999999",
     * >             borderWidth: 2,
     * >             ticks: {
     * >                 show: true,
     * >                 showGridline: true,
     * >                 showLabel: true,
     * >                 showMark: true,
     * >                 size: 4,
     * >                 textColor: "",
     * >                 whiteSpace: "nowrap",
     * >                 fontSize: "12px",
     * >                 fontFamily: "'Trebuchet MS',Arial,Helvetica,sans-serif"
     * >             },
     * >             label: {
     * >                 textColor: null,
     * >                 whiteSpace: null,
     * >                 fontSize: null,
     * >                 fontFamily: null,
     * >                 fontWeight: null
     * >             }
     * >         },
     * >         x2axis: {...
     * >         },
     * >         ...
     * >         y9axis: {...
     * >         }
     * >     }
     * > }
     * 
     * "seriesStyles" is a style object that will be applied to all series in the plot.
     * It will forcibly override any styles applied on the individual series.  "axesStyles" is
     * a style object that will be applied to all axes in the plot.  It will also forcibly
     * override any styles on the individual axes.
     * 
     * The example shown above has series options for a line series.  Options for other
     * series types are shown below:
     * 
     * Bar Series:
     * 
     * > {
     * >     color: "#4bb2c5",
     * >     seriesColors: ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
     * >     lineWidth: 2.5,
     * >     shadow: true,
     * >     barPadding: 2,
     * >     barMargin: 10,
     * >     barWidth: 15.09375,
     * >     highlightColors: ["rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)", "rgb(129,201,214)"]
     * > }
     * 
     * Pie Series:
     * 
     * > {
     * >     seriesColors: ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
     * >     padding: 20,
     * >     sliceMargin: 0,
     * >     fill: true,
     * >     shadow: true,
     * >     startAngle: 0,
     * >     lineWidth: 2.5,
     * >     highlightColors: ["rgb(129,201,214)", "rgb(240,189,104)", "rgb(214,202,165)", "rgb(137,180,158)", "rgb(168,180,137)", "rgb(180,174,89)", "rgb(180,113,161)", "rgb(129,141,236)", "rgb(227,205,120)", "rgb(255,138,76)", "rgb(76,169,219)", "rgb(215,126,190)", "rgb(220,232,135)", "rgb(200,167,96)", "rgb(103,202,235)", "rgb(208,154,215)"]
     * > }
     * 
     * Funnel Series:
     * 
     * > {
     * >     color: "#4bb2c5",
     * >     lineWidth: 2,
     * >     shadow: true,
     * >     padding: {
     * >         top: 20,
     * >         right: 20,
     * >         bottom: 20,
     * >         left: 20
     * >     },
     * >     sectionMargin: 6,
     * >     seriesColors: ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
     * >     highlightColors: ["rgb(147,208,220)", "rgb(242,199,126)", "rgb(220,210,178)", "rgb(154,191,172)", "rgb(180,191,154)", "rgb(191,186,112)", "rgb(191,133,174)", "rgb(147,157,238)", "rgb(231,212,139)", "rgb(255,154,102)", "rgb(102,181,224)", "rgb(221,144,199)", "rgb(225,235,152)", "rgb(200,167,96)", "rgb(124,210,238)", "rgb(215,169,221)"]
     * > }
     * 
     */
    $.jqplot.ThemeEngine = function(){
        // Group: Properties
        //
        // prop: themes
        // hash of themes managed by the theme engine.  
        // Indexed by theme name.
        this.themes = {};
        // prop: activeTheme
        // Pointer to currently active theme
        this.activeTheme=null;
        
    };
    
    // called with scope of plot
    $.jqplot.ThemeEngine.prototype.init = function() {
        // get the Default theme from the current plot settings.
        var th = new $.jqplot.Theme({_name:'Default'});
        var n, i, nn;
        
        for (n in th.target) {
            if (n == "textColor") {
                th.target[n] = this.target.css('color');
            }
            else {
                th.target[n] = this.target.css(n);
            }
        }
        
        if (this.title.show && this.title._elem) {
            for (n in th.title) {
                if (n == "textColor") {
                    th.title[n] = this.title._elem.css('color');
                }
                else {
                    th.title[n] = this.title._elem.css(n);
                }
            }
        }
        
        for (n in th.grid) {
            th.grid[n] = this.grid[n];
        }
        if (th.grid.backgroundColor == null && this.grid.background != null) {
            th.grid.backgroundColor = this.grid.background;
        }
        if (this.legend.show && this.legend._elem) {
            for (n in th.legend) {
                if (n == 'textColor') {
                    th.legend[n] = this.legend._elem.css('color');
                }
                else {
                    th.legend[n] = this.legend._elem.css(n);
                }
            }
        }
        var s;
        
        for (i=0; i<this.series.length; i++) {
            s = this.series[i];
            if (s.renderer.constructor == $.jqplot.LineRenderer) {
                th.series.push(new LineSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.BarRenderer) {
                th.series.push(new BarSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.PieRenderer) {
                th.series.push(new PieSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.DonutRenderer) {
                th.series.push(new DonutSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.FunnelRenderer) {
                th.series.push(new FunnelSeriesProperties());
            }
            else if (s.renderer.constructor == $.jqplot.MeterGaugeRenderer) {
                th.series.push(new MeterSeriesProperties());
            }
            else {
                th.series.push({});
            }
            for (n in th.series[i]) {
                th.series[i][n] = s[n];
            }
        }
        var a, ax;
        for (n in this.axes) {
            ax = this.axes[n];
            a = th.axes[n] = new AxisProperties();
            a.borderColor = ax.borderColor;
            a.borderWidth = ax.borderWidth;
            if (ax._ticks && ax._ticks[0]) {
                for (nn in a.ticks) {
                    if (ax._ticks[0].hasOwnProperty(nn)) {
                        a.ticks[nn] = ax._ticks[0][nn];
                    }
                    else if (ax._ticks[0]._elem){
                        a.ticks[nn] = ax._ticks[0]._elem.css(nn);
                    }
                }
            }
            if (ax._label && ax._label.show) {
                for (nn in a.label) {
                    // a.label[nn] = ax._label._elem.css(nn);
                    if (ax._label[nn]) {
                        a.label[nn] = ax._label[nn];
                    }
                    else if (ax._label._elem){
                        if (nn == 'textColor') {
                            a.label[nn] = ax._label._elem.css('color');
                        }
                        else {
                            a.label[nn] = ax._label._elem.css(nn);
                        }
                    }
                }
            }
        }
        this.themeEngine._add(th);
        this.themeEngine.activeTheme  = this.themeEngine.themes[th._name];
    };
    /**
     * Group: methods
     * 
     * method: get
     * 
     * Get and return the named theme or the active theme if no name given.
     * 
     * parameter:
     * 
     * name - name of theme to get.
     * 
     * returns:
     * 
     * Theme instance of given name.
     */   
    $.jqplot.ThemeEngine.prototype.get = function(name) {
        if (!name) {
            // return the active theme
            return this.activeTheme;
        }
        else {
            return this.themes[name];
        }
    };
    
    function numericalOrder(a,b) { return a-b; }
    
    /**
     * method: getThemeNames
     * 
     * Return the list of theme names in this manager in alpha-numerical order.
     * 
     * parameter:
     * 
     * None
     * 
     * returns:
     * 
     * A the list of theme names in this manager in alpha-numerical order.
     */       
    $.jqplot.ThemeEngine.prototype.getThemeNames = function() {
        var tn = [];
        for (var n in this.themes) {
            tn.push(n);
        }
        return tn.sort(numericalOrder);
    };

    /**
     * method: getThemes
     * 
     * Return a list of themes in alpha-numerical order by name.
     * 
     * parameter:
     * 
     * None
     * 
     * returns:
     * 
     * A list of themes in alpha-numerical order by name.
     */ 
    $.jqplot.ThemeEngine.prototype.getThemes = function() {
        var tn = [];
        var themes = [];
        for (var n in this.themes) {
            tn.push(n);
        }
        tn.sort(numericalOrder);
        for (var i=0; i<tn.length; i++) {
            themes.push(this.themes[tn[i]]);
        }
        return themes;
    };
    
    $.jqplot.ThemeEngine.prototype.activate = function(plot, name) {
        // sometimes need to redraw whole plot.
        var redrawPlot = false;
        if (!name && this.activeTheme && this.activeTheme._name) {
            name = this.activeTheme._name;
        }
        if (!this.themes.hasOwnProperty(name)) {
            throw new Error("No theme of that name");
        }
        else {
            var th = this.themes[name];
            this.activeTheme = th;
            var val, checkBorderColor = false, checkBorderWidth = false;
            var arr = ['xaxis', 'x2axis', 'yaxis', 'y2axis'];
            
            for (i=0; i<arr.length; i++) {
                var ax = arr[i];
                if (th.axesStyles.borderColor != null) {
                    plot.axes[ax].borderColor = th.axesStyles.borderColor;
                }
                if (th.axesStyles.borderWidth != null) {
                    plot.axes[ax].borderWidth = th.axesStyles.borderWidth;
                }
            }
            
            for (var axname in plot.axes) {
                var axis = plot.axes[axname];
                if (axis.show) {
                    var thaxis = th.axes[axname] || {};
                    var thaxstyle = th.axesStyles;
                    var thax = $.jqplot.extend(true, {}, thaxis, thaxstyle);
                    val = (th.axesStyles.borderColor != null) ? th.axesStyles.borderColor : thax.borderColor;
                    if (thax.borderColor != null) {
                        axis.borderColor = thax.borderColor;
                        redrawPlot = true;
                    }
                    val = (th.axesStyles.borderWidth != null) ? th.axesStyles.borderWidth : thax.borderWidth;
                    if (thax.borderWidth != null) {
                        axis.borderWidth = thax.borderWidth;
                        redrawPlot = true;
                    }
                    if (axis._ticks && axis._ticks[0]) {
                        for (var nn in thax.ticks) {
                            // val = null;
                            // if (th.axesStyles.ticks && th.axesStyles.ticks[nn] != null) {
                            //     val = th.axesStyles.ticks[nn];
                            // }
                            // else if (thax.ticks[nn] != null){
                            //     val = thax.ticks[nn]
                            // }
                            val = thax.ticks[nn];
                            if (val != null) {
                                axis.tickOptions[nn] = val;
                                axis._ticks = [];
                                redrawPlot = true;
                            }
                        }
                    }
                    if (axis._label && axis._label.show) {
                        for (var nn in thax.label) {
                            // val = null;
                            // if (th.axesStyles.label && th.axesStyles.label[nn] != null) {
                            //     val = th.axesStyles.label[nn];
                            // }
                            // else if (thax.label && thax.label[nn] != null){
                            //     val = thax.label[nn]
                            // }
                            val = thax.label[nn];
                            if (val != null) {
                                axis.labelOptions[nn] = val;
                                redrawPlot = true;
                            }
                        }
                    }
                    
                }
            }            
            
            for (var n in th.grid) {
                if (th.grid[n] != null) {
                    plot.grid[n] = th.grid[n];
                }
            }
            if (!redrawPlot) {
                plot.grid.draw();
            }
            
            if (plot.legend.show) { 
                for (n in th.legend) {
                    if (th.legend[n] != null) {
                        plot.legend[n] = th.legend[n];
                    }
                }
            }
            if (plot.title.show) {
                for (n in th.title) {
                    if (th.title[n] != null) {
                        plot.title[n] = th.title[n];
                    }
                }
            }
            
            var i;
            for (i=0; i<th.series.length; i++) {
                var opts = {};
                var redrawSeries = false;
                for (n in th.series[i]) {
                    val = (th.seriesStyles[n] != null) ? th.seriesStyles[n] : th.series[i][n];
                    if (val != null) {
                        opts[n] = val;
                        if (n == 'color') {
                            plot.series[i].renderer.shapeRenderer.fillStyle = val;
                            plot.series[i].renderer.shapeRenderer.strokeStyle = val;
                            plot.series[i][n] = val;
                        }
                        else if ((n == 'lineWidth') || (n == 'linePattern')) {
                            plot.series[i].renderer.shapeRenderer[n] = val;
                            plot.series[i][n] = val;
                        }
                        else if (n == 'markerOptions') {
                            merge (plot.series[i].markerOptions, val);
                            merge (plot.series[i].markerRenderer, val);
                        }
                        else {
                            plot.series[i][n] = val;
                        }
                        redrawPlot = true;
                    }
                }
            }
            
            if (redrawPlot) {
                plot.target.empty();
                plot.draw();
            }
            
            for (n in th.target) {
                if (th.target[n] != null) {
                    plot.target.css(n, th.target[n]);
                }
            }
        }
        
    };
    
    $.jqplot.ThemeEngine.prototype._add = function(theme, name) {
        if (name) {
            theme._name = name;
        }
        if (!theme._name) {
            theme._name = Date.parse(new Date());
        }
        if (!this.themes.hasOwnProperty(theme._name)) {
            this.themes[theme._name] = theme;
        }
        else {
            throw new Error("jqplot.ThemeEngine Error: Theme already in use");
        }
    };
    
    // method remove
    // Delete the named theme, return true on success, false on failure.
    

    /**
     * method: remove
     * 
     * Remove the given theme from the themeEngine.
     * 
     * parameters:
     * 
     * name - name of the theme to remove.
     * 
     * returns:
     * 
     * true on success, false on failure.
     */
    $.jqplot.ThemeEngine.prototype.remove = function(name) {
        if (name == 'Default') {
            return false;
        }
        return delete this.themes[name];
    };

    /**
     * method: newTheme
     * 
     * Create a new theme based on the default theme, adding it the themeEngine.
     * 
     * parameters:
     * 
     * name - name of the new theme.
     * obj - optional object of styles to be applied to this new theme.
     * 
     * returns:
     * 
     * new Theme object.
     */
    $.jqplot.ThemeEngine.prototype.newTheme = function(name, obj) {
        if (typeof(name) == 'object') {
            obj = obj || name;
            name = null;
        }
        if (obj && obj._name) {
            name = obj._name;
        }
        else {
            name = name || Date.parse(new Date());
        }
        // var th = new $.jqplot.Theme(name);
        var th = this.copy(this.themes['Default']._name, name);
        $.jqplot.extend(th, obj);
        return th;
    };
    
    // function clone(obj) {
    //     return eval(obj.toSource());
    // }
    
    function clone(obj){
        if(obj == null || typeof(obj) != 'object'){
            return obj;
        }
    
        var temp = new obj.constructor();
        for(var key in obj){
            temp[key] = clone(obj[key]);
        }   
        return temp;
    }
    
    $.jqplot.clone = clone;
    
    function merge(obj1, obj2) {
        if (obj2 ==  null || typeof(obj2) != 'object') {
            return;
        }
        for (var key in obj2) {
            if (key == 'highlightColors') {
                obj1[key] = clone(obj2[key]);
            }
            if (obj2[key] != null && typeof(obj2[key]) == 'object') {
                if (!obj1.hasOwnProperty(key)) {
                    obj1[key] = {};
                }
                merge(obj1[key], obj2[key]);
            }
            else {
                obj1[key] = obj2[key];
            }
        }
    }
    
    $.jqplot.merge = merge;
    
        // Use the jQuery 1.3.2 extend function since behaviour in jQuery 1.4 seems problematic
    $.jqplot.extend = function() {
        // copy reference to target object
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !toString.call(target) === "[object Function]" ) {
            target = {};
        }

        for ( ; i < length; i++ ){
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( var name in options ) {
                    var src = target[ name ], copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging object values
                    if ( deep && copy && typeof copy === "object" && !copy.nodeType ) {
                        target[ name ] = $.jqplot.extend( deep, 
                            // Never move original objects, clone them
                            src || ( copy.length != null ? [ ] : { } )
                        , copy );
                    }
                    // Don't bring in undefined values
                    else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };

    /**
     * method: rename
     * 
     * Rename a theme.
     * 
     * parameters:
     * 
     * oldName - current name of the theme.
     * newName - desired name of the theme.
     * 
     * returns:
     * 
     * new Theme object.
     */
    $.jqplot.ThemeEngine.prototype.rename = function (oldName, newName) {
        if (oldName == 'Default' || newName == 'Default') {
            throw new Error ("jqplot.ThemeEngine Error: Cannot rename from/to Default");
        }
        if (this.themes.hasOwnProperty(newName)) {
            throw new Error ("jqplot.ThemeEngine Error: New name already in use.");
        }
        else if (this.themes.hasOwnProperty(oldName)) {
            var th = this.copy (oldName, newName);
            this.remove(oldName);
            return th;
        }
        throw new Error("jqplot.ThemeEngine Error: Old name or new name invalid");
    };

    /**
     * method: copy
     * 
     * Create a copy of an existing theme in the themeEngine, adding it the themeEngine.
     * 
     * parameters:
     * 
     * sourceName - name of the existing theme.
     * targetName - name of the copy.
     * obj - optional object of style parameter to apply to the new theme.
     * 
     * returns:
     * 
     * new Theme object.
     */
    $.jqplot.ThemeEngine.prototype.copy = function (sourceName, targetName, obj) {
        if (targetName == 'Default') {
            throw new Error ("jqplot.ThemeEngine Error: Cannot copy over Default theme");
        }
        if (!this.themes.hasOwnProperty(sourceName)) {
            var s = "jqplot.ThemeEngine Error: Source name invalid";
            throw new Error(s);
        }
        if (this.themes.hasOwnProperty(targetName)) {
            var s = "jqplot.ThemeEngine Error: Target name invalid";
            throw new Error(s);
        }
        else {
            var th = clone(this.themes[sourceName]);
            th._name = targetName;
            $.jqplot.extend(true, th, obj);
            this._add(th);
            return th;
        }
    };
    
    
    $.jqplot.Theme = function(name, obj) {
        if (typeof(name) == 'object') {
            obj = obj || name;
            name = null;
        }
        name = name || Date.parse(new Date());
        this._name = name;
        this.target = {
            backgroundColor: null
        };
        this.legend = {
            textColor: null,
            fontFamily: null,
            fontSize: null,
            border: null,
            background: null
        };
        this.title = {
            textColor: null,
            fontFamily: null,
            fontSize: null,
            textAlign: null
        };
        this.seriesStyles = {};
        this.series = [];
        this.grid = {
            drawGridlines: null,
            gridLineColor: null,
            gridLineWidth: null,
            backgroundColor: null,
            borderColor: null,
            borderWidth: null,
            shadow: null
        };
        this.axesStyles = {label:{}, ticks:{}};
        this.axes = {};
        if (typeof(obj) == 'string') {
            this._name = obj;
        }
        else if(typeof(obj) == 'object') {
            $.jqplot.extend(true, this, obj);
        }
    };
    
    var AxisProperties = function() {
        this.borderColor = null;
        this.borderWidth = null;
        this.ticks = new AxisTicks();
        this.label = new AxisLabel();
    };
    
    var AxisTicks = function() {
        this.show = null;
        this.showGridline = null;
        this.showLabel = null;
        this.showMark = null;
        this.size = null;
        this.textColor = null;
        this.whiteSpace = null;
        this.fontSize = null;
        this.fontFamily = null;
    };
    
    var AxisLabel = function() {
        this.textColor = null;
        this.whiteSpace = null;
        this.fontSize = null;
        this.fontFamily = null;
        this.fontWeight = null;
    };
    
    var LineSeriesProperties = function() {
        this.color=null;
        this.lineWidth=null;
        this.linePattern=null;
        this.shadow=null;
        this.fillColor=null;
        this.showMarker=null;
        this.markerOptions = new MarkerOptions();
    };
    
    var MarkerOptions = function() {
        this.show = null;
        this.style = null;
        this.lineWidth = null;
        this.size = null;
        this.color = null;
        this.shadow = null;
    };
    
    var BarSeriesProperties = function() {
        this.color=null;
        this.seriesColors=null;
        this.lineWidth=null;
        this.shadow=null;
        this.barPadding=null;
        this.barMargin=null;
        this.barWidth=null;
        this.highlightColors=null;
    };
    
    var PieSeriesProperties = function() {
        this.seriesColors=null;
        this.padding=null;
        this.sliceMargin=null;
        this.fill=null;
        this.shadow=null;
        this.startAngle=null;
        this.lineWidth=null;
        this.highlightColors=null;
    };
    
    var DonutSeriesProperties = function() {
        this.seriesColors=null;
        this.padding=null;
        this.sliceMargin=null;
        this.fill=null;
        this.shadow=null;
        this.startAngle=null;
        this.lineWidth=null;
        this.innerDiameter=null;
        this.thickness=null;
        this.ringMargin=null;
        this.highlightColors=null;
    };
    
    var FunnelSeriesProperties = function() {
        this.color=null;
        this.lineWidth=null;
        this.shadow=null;
        this.padding=null;
        this.sectionMargin=null;
        this.seriesColors=null;
        this.highlightColors=null;
    };
    
    var MeterSeriesProperties = function() {
        this.padding=null;
        this.backgroundColor=null;
        this.ringColor=null;
        this.tickColor=null;
        this.ringWidth=null;
        this.intervalColors=null;
        this.intervalInnerRadius=null;
        this.intervalOuterRadius=null;
        this.hubRadius=null;
        this.needleThickness=null;
        this.needlePad=null;
    };
        



    $.fn.jqplotChildText = function() {
        return $(this).contents().filter(function() {
            return this.nodeType == 3;  // Node.TEXT_NODE not defined in I7
        }).text();
    };

    // Returns font style as abbreviation for "font" property.
    $.fn.jqplotGetComputedFontStyle = function() {
        var css = window.getComputedStyle ?  window.getComputedStyle(this[0], "") : this[0].currentStyle;
        var attrs = css['font-style'] ? ['font-style', 'font-weight', 'font-size', 'font-family'] : ['fontStyle', 'fontWeight', 'fontSize', 'fontFamily'];
        var style = [];

        for (var i=0 ; i < attrs.length; ++i) {
            var attr = String(css[attrs[i]]);

            if (attr && attr != 'normal') {
                style.push(attr);
            }
        }
        return style.join(' ');
    };

    /**
     * Namespace: $.fn
     * jQuery namespace to attach functions to jQuery elements.
     *  
     */

    $.fn.jqplotToImageCanvas = function(options) {

        options = options || {};
        var x_offset = (options.x_offset == null) ? 0 : options.x_offset;
        var y_offset = (options.y_offset == null) ? 0 : options.y_offset;
        var backgroundColor = (options.backgroundColor == null) ? 'rgb(255,255,255)' : options.backgroundColor;

        if ($(this).width() == 0 || $(this).height() == 0) {
            return null;
        }

        // excanvas and hence IE < 9 do not support toDataURL and cannot export images.
        if ($.jqplot.use_excanvas) {
            return null;
        }
        
        var newCanvas = document.createElement("canvas");
        var h = $(this).outerHeight(true);
        var w = $(this).outerWidth(true);
        var offs = $(this).offset();
        var plotleft = offs.left;
        var plottop = offs.top;
        var transx = 0, transy = 0;

        // have to check if any elements are hanging outside of plot area before rendering,
        // since changing width of canvas will erase canvas.

        var clses = ['jqplot-table-legend', 'jqplot-xaxis-tick', 'jqplot-x2axis-tick', 'jqplot-yaxis-tick', 'jqplot-y2axis-tick', 'jqplot-y3axis-tick', 
        'jqplot-y4axis-tick', 'jqplot-y5axis-tick', 'jqplot-y6axis-tick', 'jqplot-y7axis-tick', 'jqplot-y8axis-tick', 'jqplot-y9axis-tick',
        'jqplot-xaxis-label', 'jqplot-x2axis-label', 'jqplot-yaxis-label', 'jqplot-y2axis-label', 'jqplot-y3axis-label', 'jqplot-y4axis-label', 
        'jqplot-y5axis-label', 'jqplot-y6axis-label', 'jqplot-y7axis-label', 'jqplot-y8axis-label', 'jqplot-y9axis-label' ];

        var temptop, templeft, tempbottom, tempright;

        for (var i = 0; i < clses.length; i++) {
            $(this).find('.'+clses[i]).each(function() {
                temptop = $(this).offset().top - plottop;
                templeft = $(this).offset().left - plotleft;
                tempright = templeft + $(this).outerWidth(true) + transx;
                tempbottom = temptop + $(this).outerHeight(true) + transy;
                if (templeft < -transx) {
                    w = w - transx - templeft;
                    transx = -templeft;
                }
                if (temptop < -transy) {
                    h = h - transy - temptop;
                    transy = - temptop;
                }
                if (tempright > w) {
                    w = tempright;
                }
                if (tempbottom > h) {
                    h =  tempbottom;
                }
            });
        }

        newCanvas.width = w + Number(x_offset);
        newCanvas.height = h + Number(y_offset);

        var newContext = newCanvas.getContext("2d"); 

        newContext.save();
        newContext.fillStyle = backgroundColor;
        newContext.fillRect(0,0, newCanvas.width, newCanvas.height);
        newContext.restore();

        newContext.translate(transx, transy);
        newContext.textAlign = 'left';
        newContext.textBaseline = 'top';

        function getLineheight(el) {
            var lineheight = parseInt($(el).css('line-height'), 10);

            if (isNaN(lineheight)) {
                lineheight = parseInt($(el).css('font-size'), 10) * 1.2;
            }
            return lineheight;
        }

        function writeWrappedText (el, context, text, left, top, canvasWidth) {
            var lineheight = getLineheight(el);
            var tagwidth = $(el).innerWidth();
            var tagheight = $(el).innerHeight();
            var words = text.split(/\s+/);
            var wl = words.length;
            var w = '';
            var breaks = [];
            var temptop = top;
            var templeft = left;

            for (var i=0; i<wl; i++) {
                w += words[i];
                if (context.measureText(w).width > tagwidth) {
                    breaks.push(i);
                    w = '';
                    i--;
                }   
            }
            if (breaks.length === 0) {
                // center text if necessary
                if ($(el).css('textAlign') === 'center') {
                    templeft = left + (canvasWidth - context.measureText(w).width)/2  - transx;
                }
                context.fillText(text, templeft, top);
            }
            else {
                w = words.slice(0, breaks[0]).join(' ');
                // center text if necessary
                if ($(el).css('textAlign') === 'center') {
                    templeft = left + (canvasWidth - context.measureText(w).width)/2  - transx;
                }
                context.fillText(w, templeft, temptop);
                temptop += lineheight;
                for (var i=1, l=breaks.length; i<l; i++) {
                    w = words.slice(breaks[i-1], breaks[i]).join(' ');
                    // center text if necessary
                    if ($(el).css('textAlign') === 'center') {
                        templeft = left + (canvasWidth - context.measureText(w).width)/2  - transx;
                    }
                    context.fillText(w, templeft, temptop);
                    temptop += lineheight;
                }
                w = words.slice(breaks[i-1], words.length).join(' ');
                // center text if necessary
                if ($(el).css('textAlign') === 'center') {
                    templeft = left + (canvasWidth - context.measureText(w).width)/2  - transx;
                }
                context.fillText(w, templeft, temptop);
            }

        }

        function _jqpToImage(el, x_offset, y_offset) {
            var tagname = el.tagName.toLowerCase();
            var p = $(el).position();
            var css = window.getComputedStyle ?  window.getComputedStyle(el, "") : el.currentStyle; // for IE < 9
            var left = x_offset + p.left + parseInt(css.marginLeft, 10) + parseInt(css.borderLeftWidth, 10) + parseInt(css.paddingLeft, 10);
            var top = y_offset + p.top + parseInt(css.marginTop, 10) + parseInt(css.borderTopWidth, 10)+ parseInt(css.paddingTop, 10);
            var w = newCanvas.width;
            // var left = x_offset + p.left + $(el).css('marginLeft') + $(el).css('borderLeftWidth') 

            // somehow in here, for divs within divs, the width of the inner div should be used instead of the canvas.

            if ((tagname == 'div' || tagname == 'span') && !$(el).hasClass('jqplot-highlighter-tooltip')) {
                $(el).children().each(function() {
                    _jqpToImage(this, left, top);
                });
                var text = $(el).jqplotChildText();

                if (text) {
                    newContext.font = $(el).jqplotGetComputedFontStyle();
                    newContext.fillStyle = $(el).css('color');

                    writeWrappedText(el, newContext, text, left, top, w);
                }
            }

            // handle the standard table legend

            else if (tagname === 'table' && $(el).hasClass('jqplot-table-legend')) {
                newContext.strokeStyle = $(el).css('border-top-color');
                newContext.fillStyle = $(el).css('background-color');
                newContext.fillRect(left, top, $(el).innerWidth(), $(el).innerHeight());
                if (parseInt($(el).css('border-top-width'), 10) > 0) {
                    newContext.strokeRect(left, top, $(el).innerWidth(), $(el).innerHeight());
                }

                // find all the swatches
                $(el).find('div.jqplot-table-legend-swatch-outline').each(function() {
                    // get the first div and stroke it
                    var elem = $(this);
                    newContext.strokeStyle = elem.css('border-top-color');
                    var l = left + elem.position().left;
                    var t = top + elem.position().top;
                    newContext.strokeRect(l, t, elem.innerWidth(), elem.innerHeight());

                    // now fill the swatch
                    
                    l += parseInt(elem.css('padding-left'), 10);
                    t += parseInt(elem.css('padding-top'), 10);
                    var h = elem.innerHeight() - 2 * parseInt(elem.css('padding-top'), 10);
                    var w = elem.innerWidth() - 2 * parseInt(elem.css('padding-left'), 10);

                    var swatch = elem.children('div.jqplot-table-legend-swatch');
                    newContext.fillStyle = swatch.css('background-color');
                    newContext.fillRect(l, t, w, h);
                });

                // now add text

                $(el).find('td.jqplot-table-legend-label').each(function(){
                    var elem = $(this);
                    var l = left + elem.position().left;
                    var t = top + elem.position().top + parseInt(elem.css('padding-top'), 10);
                    newContext.font = elem.jqplotGetComputedFontStyle();
                    newContext.fillStyle = elem.css('color');
                    writeWrappedText(elem, newContext, elem.text(), l, t, w);
                });

                var elem = null;
            }

            else if (tagname == 'canvas') {
                newContext.drawImage(el, left, top);
            }
        }
        $(this).children().each(function() {
            _jqpToImage(this, x_offset, y_offset);
        });
        return newCanvas;
    };

    // return the raw image data string.
    // Should work on canvas supporting browsers.
    $.fn.jqplotToImageStr = function(options) {
        var imgCanvas = $(this).jqplotToImageCanvas(options);
        if (imgCanvas) {
            return imgCanvas.toDataURL("image/png");
        }
        else {
            return null;
        }
    };

    // return a DOM <img> element and return it.
    // Should work on canvas supporting browsers.
    $.fn.jqplotToImageElem = function(options) {
        var elem = document.createElement("img");
        var str = $(this).jqplotToImageStr(options);
        elem.src = str;
        return elem;
    };

    // return a string for an <img> element and return it.
    // Should work on canvas supporting browsers.
    $.fn.jqplotToImageElemStr = function(options) {
        var str = '<img src='+$(this).jqplotToImageStr(options)+' />';
        return str;
    };

    // Not guaranteed to work, even on canvas supporting browsers due to 
    // limitations with location.href and browser support.
    $.fn.jqplotSaveImage = function() {
        var imgData = $(this).jqplotToImageStr({});
        if (imgData) {
            window.location.href = imgData.replace("image/png", "image/octet-stream");
        }

    };

    // Not guaranteed to work, even on canvas supporting browsers due to
    // limitations with window.open and arbitrary data.
    $.fn.jqplotViewImage = function() {
        var imgStr = $(this).jqplotToImageElemStr({});
        var imgData = $(this).jqplotToImageStr({});
        if (imgStr) {
            var w = window.open('');
            w.document.open("image/png");
            w.document.write(imgStr);
            w.document.close();
            w = null;
        }
    };
    



    /** 
     * @description
     * <p>Object with extended date parsing and formatting capabilities.
     * This library borrows many concepts and ideas from the Date Instance 
     * Methods by Ken Snyder along with some parts of Ken's actual code.</p>
     *
     * <p>jsDate takes a different approach by not extending the built-in 
     * Date Object, improving date parsing, allowing for multiple formatting 
     * syntaxes and multiple and more easily expandable localization.</p>
     * 
     * @author Chris Leonello
     * @date #date#
     * @version #VERSION#
     * @copyright (c) 2010-2013 Chris Leonello
     * jsDate is currently available for use in all personal or commercial projects 
     * under both the MIT and GPL version 2.0 licenses. This means that you can 
     * choose the license that best suits your project and use it accordingly.
     * 
     * <p>Ken's original Date Instance Methods and copyright notice:</p>
     * <pre>
     * Ken Snyder (ken d snyder at gmail dot com)
     * 2008-09-10
     * version 2.0.2 (http://kendsnyder.com/sandbox/date/)     
     * Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
     * </pre>
     * 
     * @class
     * @name jsDate
     * @param  {String | Number | Array | Date&nbsp;Object | Options&nbsp;Object} arguments Optional arguments, either a parsable date/time string,
     * a JavaScript timestamp, an array of numbers of form [year, month, day, hours, minutes, seconds, milliseconds],
     * a Date object, or an options object of form {syntax: "perl", date:some Date} where all options are optional.
     */
     
    var jsDate = function () {
    
        this.syntax = jsDate.config.syntax;
        this._type = "jsDate";
        this.proxy = new Date();
        this.options = {};
        this.locale = jsDate.regional.getLocale();
        this.formatString = '';
        this.defaultCentury = jsDate.config.defaultCentury;

        switch ( arguments.length ) {
            case 0:
                break;
            case 1:
                // other objects either won't have a _type property or,
                // if they do, it shouldn't be set to "jsDate", so
                // assume it is an options argument.
                if (get_type(arguments[0]) == "[object Object]" && arguments[0]._type != "jsDate") {
                    var opts = this.options = arguments[0];
                    this.syntax = opts.syntax || this.syntax;
                    this.defaultCentury = opts.defaultCentury || this.defaultCentury;
                    this.proxy = jsDate.createDate(opts.date);
                }
                else {
                    this.proxy = jsDate.createDate(arguments[0]);
                }
                break;
            default:
                var a = [];
                for ( var i=0; i<arguments.length; i++ ) {
                    a.push(arguments[i]);
                }
                // this should be the current date/time?
                this.proxy = new Date();
                this.proxy.setFullYear.apply( this.proxy, a.slice(0,3) );
                if ( a.slice(3).length ) {
                    this.proxy.setHours.apply( this.proxy, a.slice(3) );
                }
                break;
        }
    };
    
    /**
     * @namespace Configuration options that will be used as defaults for all instances on the page.
     * @property {String} defaultLocale The default locale to use [en].
     * @property {String} syntax The default syntax to use [perl].
     * @property {Number} defaultCentury The default centry for 2 digit dates.
     */
    jsDate.config = {
        defaultLocale: 'en',
        syntax: 'perl',
        defaultCentury: 1900
    };
        
    /**
     * Add an arbitrary amount to the currently stored date
     * 
     * @param {Number} number      
     * @param {String} unit
     * @returns {jsDate}       
     */
     
    jsDate.prototype.add = function(number, unit) {
        var factor = multipliers[unit] || multipliers.day;
        if (typeof factor == 'number') {
            this.proxy.setTime(this.proxy.getTime() + (factor * number));
        } else {
            factor.add(this, number);
        }
        return this;
    };
        
    /**
     * Create a new jqplot.date object with the same date
     * 
     * @returns {jsDate}
     */  
     
    jsDate.prototype.clone = function() {
            return new jsDate(this.proxy.getTime());
    };

    /**
     * Get the UTC TimeZone Offset of this date in milliseconds.
     *
     * @returns {Number}
     */

    jsDate.prototype.getUtcOffset = function() {
        return this.proxy.getTimezoneOffset() * 60000;
    };

    /**
     * Find the difference between this jsDate and another date.
     * 
     * @param {String| Number| Array| jsDate&nbsp;Object| Date&nbsp;Object} dateObj
     * @param {String} unit
     * @param {Boolean} allowDecimal
     * @returns {Number} Number of units difference between dates.
     */
     
    jsDate.prototype.diff = function(dateObj, unit, allowDecimal) {
        // ensure we have a Date object
        dateObj = new jsDate(dateObj);
        if (dateObj === null) {
            return null;
        }
        // get the multiplying factor integer or factor function
        var factor = multipliers[unit] || multipliers.day;
        if (typeof factor == 'number') {
            // multiply
            var unitDiff = (this.proxy.getTime() - dateObj.proxy.getTime()) / factor;
        } else {
            // run function
            var unitDiff = factor.diff(this.proxy, dateObj.proxy);
        }
        // if decimals are not allowed, round toward zero
        return (allowDecimal ? unitDiff : Math[unitDiff > 0 ? 'floor' : 'ceil'](unitDiff));          
    };
    
    /**
     * Get the abbreviated name of the current week day
     * 
     * @returns {String}
     */   
     
    jsDate.prototype.getAbbrDayName = function() {
        return jsDate.regional[this.locale]["dayNamesShort"][this.proxy.getDay()];
    };
    
    /**
     * Get the abbreviated name of the current month
     * 
     * @returns {String}
     */
     
    jsDate.prototype.getAbbrMonthName = function() {
        return jsDate.regional[this.locale]["monthNamesShort"][this.proxy.getMonth()];
    };
    
    /**
     * Get UPPER CASE AM or PM for the current time
     * 
     * @returns {String}
     */
     
    jsDate.prototype.getAMPM = function() {
        return this.proxy.getHours() >= 12 ? 'PM' : 'AM';
    };
    
    /**
     * Get lower case am or pm for the current time
     * 
     * @returns {String}
     */
     
    jsDate.prototype.getAmPm = function() {
        return this.proxy.getHours() >= 12 ? 'pm' : 'am';
    };
    
    /**
     * Get the century (19 for 20th Century)
     *
     * @returns {Integer} Century (19 for 20th century).
     */
    jsDate.prototype.getCentury = function() { 
        return parseInt(this.proxy.getFullYear()/100, 10);
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getDate = function() {
        return this.proxy.getDate();
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getDay = function() {
        return this.proxy.getDay();
    };
    
    /**
     * Get the Day of week 1 (Monday) thru 7 (Sunday)
     * 
     * @returns {Integer} Day of week 1 (Monday) thru 7 (Sunday)
     */
    jsDate.prototype.getDayOfWeek = function() { 
        var dow = this.proxy.getDay(); 
        return dow===0?7:dow; 
    };
    
    /**
     * Get the day of the year
     * 
     * @returns {Integer} 1 - 366, day of the year
     */
    jsDate.prototype.getDayOfYear = function() {
        var d = this.proxy;
        var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
        ms += d.getTimezoneOffset()*60000;
        d = null;
        return parseInt(ms/60000/60/24, 10)+1;
    };
    
    /**
     * Get the name of the current week day
     * 
     * @returns {String}
     */  
     
    jsDate.prototype.getDayName = function() {
        return jsDate.regional[this.locale]["dayNames"][this.proxy.getDay()];
    };
    
    /**
     * Get the week number of the given year, starting with the first Sunday as the first week
     * @returns {Integer} Week number (13 for the 13th full week of the year).
     */
    jsDate.prototype.getFullWeekOfYear = function() {
        var d = this.proxy;
        var doy = this.getDayOfYear();
        var rdow = 6-d.getDay();
        var woy = parseInt((doy+rdow)/7, 10);
        return woy;
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getFullYear = function() {
        return this.proxy.getFullYear();
    };
    
    /**
     * Get the GMT offset in hours and minutes (e.g. +06:30)
     * 
     * @returns {String}
     */
     
    jsDate.prototype.getGmtOffset = function() {
        // divide the minutes offset by 60
        var hours = this.proxy.getTimezoneOffset() / 60;
        // decide if we are ahead of or behind GMT
        var prefix = hours < 0 ? '+' : '-';
        // remove the negative sign if any
        hours = Math.abs(hours);
        // add the +/- to the padded number of hours to : to the padded minutes
        return prefix + addZeros(Math.floor(hours), 2) + ':' + addZeros((hours % 1) * 60, 2);
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getHours = function() {
        return this.proxy.getHours();
    };
    
    /**
     * Get the current hour on a 12-hour scheme
     * 
     * @returns {Integer}
     */
     
    jsDate.prototype.getHours12  = function() {
        var hours = this.proxy.getHours();
        return hours > 12 ? hours - 12 : (hours == 0 ? 12 : hours);
    };
    
    
    jsDate.prototype.getIsoWeek = function() {
        var d = this.proxy;
        var woy = this.getWeekOfYear();
        var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
        // First week is 01 and not 00 as in the case of %U and %W,
        // so we add 1 to the final result except if day 1 of the year
        // is a Monday (then %W returns 01).
        // We also need to subtract 1 if the day 1 of the year is 
        // Friday-Sunday, so the resulting equation becomes:
        var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
        if(idow == 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
        {
            idow = 1;
        }
        else if(idow === 0)
        {
            d = new jsDate(new Date('' + (d.getFullYear()-1) + '/12/31'));
            idow = d.getIsoWeek();
        }
        d = null;
        return idow;
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getMilliseconds = function() {
        return this.proxy.getMilliseconds();
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getMinutes = function() {
        return this.proxy.getMinutes();
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getMonth = function() {
        return this.proxy.getMonth();
    };
    
    /**
     * Get the name of the current month
     * 
     * @returns {String}
     */
     
    jsDate.prototype.getMonthName = function() {
        return jsDate.regional[this.locale]["monthNames"][this.proxy.getMonth()];
    };
    
    /**
     * Get the number of the current month, 1-12
     * 
     * @returns {Integer}
     */
     
    jsDate.prototype.getMonthNumber = function() {
        return this.proxy.getMonth() + 1;
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getSeconds = function() {
        return this.proxy.getSeconds();
    };
    
    /**
     * Return a proper two-digit year integer
     * 
     * @returns {Integer}
     */
     
    jsDate.prototype.getShortYear = function() {
        return this.proxy.getYear() % 100;
    };
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getTime = function() {
        return this.proxy.getTime();
    };
    
    /**
     * Get the timezone abbreviation
     *
     * @returns {String} Abbreviation for the timezone
     */
    jsDate.prototype.getTimezoneAbbr = function() {
        return this.proxy.toString().replace(/^.*\(([^)]+)\)$/, '$1'); 
    };
    
    /**
     * Get the browser-reported name for the current timezone (e.g. MDT, Mountain Daylight Time)
     * 
     * @returns {String}
     */
    jsDate.prototype.getTimezoneName = function() {
        var match = /(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());
        return match[1] || match[2] || 'GMT' + this.getGmtOffset();
    }; 
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getTimezoneOffset = function() {
        return this.proxy.getTimezoneOffset();
    };
    
    
    /**
     * Get the week number of the given year, starting with the first Monday as the first week
     * @returns {Integer} Week number (13 for the 13th week of the year).
     */
    jsDate.prototype.getWeekOfYear = function() {
        var doy = this.getDayOfYear();
        var rdow = 7 - this.getDayOfWeek();
        var woy = parseInt((doy+rdow)/7, 10);
        return woy;
    };
    
    /**
     * Get the current date as a Unix timestamp
     * 
     * @returns {Integer}
     */
     
    jsDate.prototype.getUnix = function() {
        return Math.round(this.proxy.getTime() / 1000, 0);
    }; 
    
    /**
     * Implements Date functionality
     */
    jsDate.prototype.getYear = function() {
        return this.proxy.getYear();
    };
    
    /**
     * Return a date one day ahead (or any other unit)
     * 
     * @param {String} unit Optional, year | month | day | week | hour | minute | second | millisecond
     * @returns {jsDate}
     */
     
    jsDate.prototype.next = function(unit) {
        unit = unit || 'day';
        return this.clone().add(1, unit);
    };
    
    /**
     * Set the jsDate instance to a new date.
     *
     * @param  {String | Number | Array | Date Object | jsDate Object | Options Object} arguments Optional arguments, 
     * either a parsable date/time string,
     * a JavaScript timestamp, an array of numbers of form [year, month, day, hours, minutes, seconds, milliseconds],
     * a Date object, jsDate Object or an options object of form {syntax: "perl", date:some Date} where all options are optional.
     */
    jsDate.prototype.set = function() {
        switch ( arguments.length ) {
            case 0:
                this.proxy = new Date();
                break;
            case 1:
                // other objects either won't have a _type property or,
                // if they do, it shouldn't be set to "jsDate", so
                // assume it is an options argument.
                if (get_type(arguments[0]) == "[object Object]" && arguments[0]._type != "jsDate") {
                    var opts = this.options = arguments[0];
                    this.syntax = opts.syntax || this.syntax;
                    this.defaultCentury = opts.defaultCentury || this.defaultCentury;
                    this.proxy = jsDate.createDate(opts.date);
                }
                else {
                    this.proxy = jsDate.createDate(arguments[0]);
                }
                break;
            default:
                var a = [];
                for ( var i=0; i<arguments.length; i++ ) {
                    a.push(arguments[i]);
                }
                // this should be the current date/time
                this.proxy = new Date();
                this.proxy.setFullYear.apply( this.proxy, a.slice(0,3) );
                if ( a.slice(3).length ) {
                    this.proxy.setHours.apply( this.proxy, a.slice(3) );
                }
                break;
        }
        return this;
    };
    
    /**
     * Sets the day of the month for a specified date according to local time.
     * @param {Integer} dayValue An integer from 1 to 31, representing the day of the month. 
     */
    jsDate.prototype.setDate = function(n) {
        this.proxy.setDate(n);
        return this;
    };
    
    /**
     * Sets the full year for a specified date according to local time.
     * @param {Integer} yearValue The numeric value of the year, for example, 1995.  
     * @param {Integer} monthValue Optional, between 0 and 11 representing the months January through December.  
     * @param {Integer} dayValue Optional, between 1 and 31 representing the day of the month. If you specify the dayValue parameter, you must also specify the monthValue. 
     */
    jsDate.prototype.setFullYear = function() {
        this.proxy.setFullYear.apply(this.proxy, arguments);
        return this;
    };
    
    /**
     * Sets the hours for a specified date according to local time.
     * 
     * @param {Integer} hoursValue An integer between 0 and 23, representing the hour.  
     * @param {Integer} minutesValue Optional, An integer between 0 and 59, representing the minutes.  
     * @param {Integer} secondsValue Optional, An integer between 0 and 59, representing the seconds. 
     * If you specify the secondsValue parameter, you must also specify the minutesValue.  
     * @param {Integer} msValue Optional, A number between 0 and 999, representing the milliseconds. 
     * If you specify the msValue parameter, you must also specify the minutesValue and secondsValue. 
     */
    jsDate.prototype.setHours = function() {
        this.proxy.setHours.apply(this.proxy, arguments);
        return this;
    };
    
    /**
     * Implements Date functionality
     */ 
    jsDate.prototype.setMilliseconds = function(n) {
        this.proxy.setMilliseconds(n);
        return this;
    };
    
    /**
     * Implements Date functionality
     */ 
    jsDate.prototype.setMinutes = function() {
        this.proxy.setMinutes.apply(this.proxy, arguments);
        return this;
    };
    
    /**
     * Implements Date functionality
     */ 
    jsDate.prototype.setMonth = function() {
        this.proxy.setMonth.apply(this.proxy, arguments);
        return this;
    };
    
    /**
     * Implements Date functionality
     */ 
    jsDate.prototype.setSeconds = function() {
        this.proxy.setSeconds.apply(this.proxy, arguments);
        return this;
    };
    
    /**
     * Implements Date functionality
     */ 
    jsDate.prototype.setTime = function(n) {
        this.proxy.setTime(n);
        return this;
    };
    
    /**
     * Implements Date functionality
     */ 
    jsDate.prototype.setYear = function() {
        this.proxy.setYear.apply(this.proxy, arguments);
        return this;
    };
    
    /**
     * Provide a formatted string representation of this date.
     * 
     * @param {String} formatString A format string.  
     * See: {@link jsDate.formats}.
     * @returns {String} Date String.
     */
            
    jsDate.prototype.strftime = function(formatString) {
        formatString = formatString || this.formatString || jsDate.regional[this.locale]['formatString'];
        return jsDate.strftime(this, formatString, this.syntax);
    };
        
    /**
     * Return a String representation of this jsDate object.
     * @returns {String} Date string.
     */
    
    jsDate.prototype.toString = function() {
        return this.proxy.toString();
    };
        
    /**
     * Convert the current date to an 8-digit integer (%Y%m%d)
     * 
     * @returns {Integer}
     */
     
    jsDate.prototype.toYmdInt = function() {
        return (this.proxy.getFullYear() * 10000) + (this.getMonthNumber() * 100) + this.proxy.getDate();
    };
    
    /**
     * @namespace Holds localizations for month/day names.
     * <p>jsDate attempts to detect locale when loaded and defaults to 'en'.
     * If a localization is detected which is not available, jsDate defaults to 'en'.
     * Additional localizations can be added after jsDate loads.  After adding a localization,
     * call the jsDate.regional.getLocale() method.  Currently, en, fr and de are defined.</p>
     * 
     * <p>Localizations must be an object and have the following properties defined:  monthNames, monthNamesShort, dayNames, dayNamesShort and Localizations are added like:</p>
     * <pre class="code">
     * jsDate.regional['en'] = {
     * monthNames      : 'January February March April May June July August September October November December'.split(' '),
     * monthNamesShort : 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
     * dayNames        : 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
     * dayNamesShort   : 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
     * };
     * </pre>
     * <p>After adding localizations, call <code>jsDate.regional.getLocale();</code> to update the locale setting with the
     * new localizations.</p>
     */
     
    jsDate.regional = {
        'en': {
            monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },
        
        'fr': {
            monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
            monthNamesShort: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
            dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
            dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },
        
        'de': {
            monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
            monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
            dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
            dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },
        
        'es': {
            monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
            monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun', 'Jul','Ago','Sep','Oct','Nov','Dic'],
            dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
            dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },
        
        'ru': {
            monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
            dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
            dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },
        
        'ar': {
            monthNames: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'آذار', 'حزيران','تموز', 'آب', 'أيلول',   'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
            monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            dayNames: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            dayNamesShort: ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },
        
        'pt': {
            monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','S&aacute;bado'],
            dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','S&aacute;b'],
            formatString: '%Y-%m-%d %H:%M:%S'   
        },
        
        'pt-BR': {
            monthNames: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho', 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            dayNames: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','S&aacute;bado'],
            dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','S&aacute;b'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },
        
        'pl': {
            monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
            monthNamesShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze','Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
            dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
            dayNamesShort: ['Ni', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },

        'nl': {
            monthNames: ['Januari','Februari','Maart','April','Mei','Juni','July','Augustus','September','Oktober','November','December'],
            monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
            dayNames:','['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],
            dayNamesShort: ['Zo','Ma','Di','Wo','Do','Vr','Za'],
            formatString: '%Y-%m-%d %H:%M:%S'
        },

        'sv': {
            monthNames: ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'],
          monthNamesShort: ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'],
            dayNames: ['söndag','måndag','tisdag','onsdag','torsdag','fredag','lördag'],
            dayNamesShort: ['sön','mån','tis','ons','tor','fre','lör'],
            formatString: '%Y-%m-%d %H:%M:%S'
        }
    
    };
    
    // Set english variants to 'en'
    jsDate.regional['en-US'] = jsDate.regional['en-GB'] = jsDate.regional['en'];
    
    /**
     * Try to determine the users locale based on the lang attribute of the html page.  Defaults to 'en'
     * if it cannot figure out a locale of if the locale does not have a localization defined.
     * @returns {String} locale
     */
     
    jsDate.regional.getLocale = function () {
        var l = jsDate.config.defaultLocale;
        
        if ( document && document.getElementsByTagName('html') && document.getElementsByTagName('html')[0].lang ) {
            l = document.getElementsByTagName('html')[0].lang;
            if (!jsDate.regional.hasOwnProperty(l)) {
                l = jsDate.config.defaultLocale;
            }
        }
        
        return l;
    };
    
    // ms in day
    var day = 24 * 60 * 60 * 1000;
    
    // padd a number with zeros
    var addZeros = function(num, digits) {
        num = String(num);
        var i = digits - num.length;
        var s = String(Math.pow(10, i)).slice(1);
        return s.concat(num);
    };

    // representations used for calculating differences between dates.
    // This borrows heavily from Ken Snyder's work.
    var multipliers = {
        millisecond: 1,
        second: 1000,
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: day,
        week: 7 * day,
        month: {
            // add a number of months
            add: function(d, number) {
                // add any years needed (increments of 12)
                multipliers.year.add(d, Math[number > 0 ? 'floor' : 'ceil'](number / 12));
                // ensure that we properly wrap betwen December and January
                // 11 % 12 = 11
                // 12 % 12 = 0
                var prevMonth = d.getMonth() + (number % 12);
                if (prevMonth == 12) {
                    prevMonth = 0;
                    d.setYear(d.getFullYear() + 1);
                } else if (prevMonth == -1) {
                    prevMonth = 11;
                    d.setYear(d.getFullYear() - 1);
                }
                d.setMonth(prevMonth);
            },
            // get the number of months between two Date objects (decimal to the nearest day)
            diff: function(d1, d2) {
                // get the number of years
                var diffYears = d1.getFullYear() - d2.getFullYear();
                // get the number of remaining months
                var diffMonths = d1.getMonth() - d2.getMonth() + (diffYears * 12);
                // get the number of remaining days
                var diffDays = d1.getDate() - d2.getDate();
                // return the month difference with the days difference as a decimal
                return diffMonths + (diffDays / 30);
            }
        },
        year: {
            // add a number of years
            add: function(d, number) {
                d.setYear(d.getFullYear() + Math[number > 0 ? 'floor' : 'ceil'](number));
            },
            // get the number of years between two Date objects (decimal to the nearest day)
            diff: function(d1, d2) {
                return multipliers.month.diff(d1, d2) / 12;
            }
        }        
    };
    //
    // Alias each multiplier with an 's' to allow 'year' and 'years' for example.
    // This comes from Ken Snyders work.
    //
    for (var unit in multipliers) {
        if (unit.substring(unit.length - 1) != 's') { // IE will iterate newly added properties :|
            multipliers[unit + 's'] = multipliers[unit];
        }
    }
    
    //
    // take a jsDate instance and a format code and return the formatted value.
    // This is a somewhat modified version of Ken Snyder's method.
    //
    var format = function(d, code, syntax) {
        // if shorcut codes are used, recursively expand those.
        if (jsDate.formats[syntax]["shortcuts"][code]) {
            return jsDate.strftime(d, jsDate.formats[syntax]["shortcuts"][code], syntax);
        } else {
            // get the format code function and addZeros() argument
            var getter = (jsDate.formats[syntax]["codes"][code] || '').split('.');
            var nbr = d['get' + getter[0]] ? d['get' + getter[0]]() : '';
            if (getter[1]) {
                nbr = addZeros(nbr, getter[1]);
            }
            return nbr;
        }       
    };
    
    /**
     * @static
     * Static function for convert a date to a string according to a given format.  Also acts as namespace for strftime format codes.
     * <p>strftime formatting can be accomplished without creating a jsDate object by calling jsDate.strftime():</p>
     * <pre class="code">
     * var formattedDate = jsDate.strftime('Feb 8, 2006 8:48:32', '%Y-%m-%d %H:%M:%S');
     * </pre>
     * @param {String | Number | Array | jsDate&nbsp;Object | Date&nbsp;Object} date A parsable date string, JavaScript time stamp, Array of form [year, month, day, hours, minutes, seconds, milliseconds], jsDate Object or Date object.
     * @param {String} formatString String with embedded date formatting codes.  
     * See: {@link jsDate.formats}. 
     * @param {String} syntax Optional syntax to use [default perl].
     * @param {String} locale Optional locale to use.
     * @returns {String} Formatted representation of the date.
    */
    //
    // Logic as implemented here is very similar to Ken Snyder's Date Instance Methods.
    //
    jsDate.strftime = function(d, formatString, syntax, locale) {
        var syn = 'perl';
        var loc = jsDate.regional.getLocale();
        
        // check if syntax and locale are available or reversed
        if (syntax && jsDate.formats.hasOwnProperty(syntax)) {
            syn = syntax;
        }
        else if (syntax && jsDate.regional.hasOwnProperty(syntax)) {
            loc = syntax;
        }
        
        if (locale && jsDate.formats.hasOwnProperty(locale)) {
            syn = locale;
        }
        else if (locale && jsDate.regional.hasOwnProperty(locale)) {
            loc = locale;
        }
        
        if (get_type(d) != "[object Object]" || d._type != "jsDate") {
            d = new jsDate(d);
            d.locale = loc;
        }
        if (!formatString) {
            formatString = d.formatString || jsDate.regional[loc]['formatString'];
        }
        // default the format string to year-month-day
        var source = formatString || '%Y-%m-%d', 
            result = '', 
            match;
        // replace each format code
        while (source.length > 0) {
            if (match = source.match(jsDate.formats[syn].codes.matcher)) {
                result += source.slice(0, match.index);
                result += (match[1] || '') + format(d, match[2], syn);
                source = source.slice(match.index + match[0].length);
            } else {
                result += source;
                source = '';
            }
        }
        return result;
    };
    
    /**
     * @namespace
     * Namespace to hold format codes and format shortcuts.  "perl" and "php" format codes 
     * and shortcuts are defined by default.  Additional codes and shortcuts can be
     * added like:
     * 
     * <pre class="code">
     * jsDate.formats["perl"] = {
     *     "codes": {
     *         matcher: /someregex/,
     *         Y: "fullYear",  // name of "get" method without the "get",
     *         ...,            // more codes
     *     },
     *     "shortcuts": {
     *         F: '%Y-%m-%d',
     *         ...,            // more shortcuts
     *     }
     * };
     * </pre>
     * 
     * <p>Additionally, ISO and SQL shortcuts are defined and can be accesses via:
     * <code>jsDate.formats.ISO</code> and <code>jsDate.formats.SQL</code>
     */
    
    jsDate.formats = {
        ISO:'%Y-%m-%dT%H:%M:%S.%N%G',
        SQL:'%Y-%m-%d %H:%M:%S'
    };
    
    /**
     * Perl format codes and shortcuts for strftime.
     * 
     * A hash (object) of codes where each code must be an array where the first member is 
     * the name of a Date.prototype or jsDate.prototype function to call
     * and optionally a second member indicating the number to pass to addZeros()
     * 
     * <p>The following format codes are defined:</p>
     * 
     * <pre class="code">
     * Code    Result                    Description
     * == Years ==           
     * %Y      2008                      Four-digit year
     * %y      08                        Two-digit year
     * 
     * == Months ==          
     * %m      09                        Two-digit month
     * %#m     9                         One or two-digit month
     * %B      September                 Full month name
     * %b      Sep                       Abbreviated month name
     * 
     * == Days ==            
     * %d      05                        Two-digit day of month
     * %#d     5                         One or two-digit day of month
     * %e      5                         One or two-digit day of month
     * %A      Sunday                    Full name of the day of the week
     * %a      Sun                       Abbreviated name of the day of the week
     * %w      0                         Number of the day of the week (0 = Sunday, 6 = Saturday)
     * 
     * == Hours ==           
     * %H      23                        Hours in 24-hour format (two digits)
     * %#H     3                         Hours in 24-hour integer format (one or two digits)
     * %I      11                        Hours in 12-hour format (two digits)
     * %#I     3                         Hours in 12-hour integer format (one or two digits)
     * %p      PM                        AM or PM
     * 
     * == Minutes ==         
     * %M      09                        Minutes (two digits)
     * %#M     9                         Minutes (one or two digits)
     * 
     * == Seconds ==         
     * %S      02                        Seconds (two digits)
     * %#S     2                         Seconds (one or two digits)
     * %s      1206567625723             Unix timestamp (Seconds past 1970-01-01 00:00:00)
     * 
     * == Milliseconds ==    
     * %N      008                       Milliseconds (three digits)
     * %#N     8                         Milliseconds (one to three digits)
     * 
     * == Timezone ==        
     * %O      360                       difference in minutes between local time and GMT
     * %Z      Mountain Standard Time    Name of timezone as reported by browser
     * %G      06:00                     Hours and minutes between GMT
     * 
     * == Shortcuts ==       
     * %F      2008-03-26                %Y-%m-%d
     * %T      05:06:30                  %H:%M:%S
     * %X      05:06:30                  %H:%M:%S
     * %x      03/26/08                  %m/%d/%y
     * %D      03/26/08                  %m/%d/%y
     * %#c     Wed Mar 26 15:31:00 2008  %a %b %e %H:%M:%S %Y
     * %v      3-Sep-2008                %e-%b-%Y
     * %R      15:31                     %H:%M
     * %r      03:31:00 PM               %I:%M:%S %p
     * 
     * == Characters ==      
     * %n      \n                        Newline
     * %t      \t                        Tab
     * %%      %                         Percent Symbol
     * </pre>
     * 
     * <p>Formatting shortcuts that will be translated into their longer version.
     * Be sure that format shortcuts do not refer to themselves: this will cause an infinite loop.</p>
     * 
     * <p>Format codes and format shortcuts can be redefined after the jsDate
     * module is imported.</p>
     * 
     * <p>Note that if you redefine the whole hash (object), you must supply a "matcher"
     * regex for the parser.  The default matcher is:</p>
     * 
     * <code>/()%(#?(%|[a-z]))/i</code>
     * 
     * <p>which corresponds to the Perl syntax used by default.</p>
     * 
     * <p>By customizing the matcher and format codes, nearly any strftime functionality is possible.</p>
     */
     
    jsDate.formats.perl = {
        codes: {
            //
            // 2-part regex matcher for format codes
            //
            // first match must be the character before the code (to account for escaping)
            // second match must be the format code character(s)
            //
            matcher: /()%(#?(%|[a-z]))/i,
            // year
            Y: 'FullYear',
            y: 'ShortYear.2',
            // month
            m: 'MonthNumber.2',
            '#m': 'MonthNumber',
            B: 'MonthName',
            b: 'AbbrMonthName',
            // day
            d: 'Date.2',
            '#d': 'Date',
            e: 'Date',
            A: 'DayName',
            a: 'AbbrDayName',
            w: 'Day',
            // hours
            H: 'Hours.2',
            '#H': 'Hours',
            I: 'Hours12.2',
            '#I': 'Hours12',
            p: 'AMPM',
            // minutes
            M: 'Minutes.2',
            '#M': 'Minutes',
            // seconds
            S: 'Seconds.2',
            '#S': 'Seconds',
            s: 'Unix',
            // milliseconds
            N: 'Milliseconds.3',
            '#N': 'Milliseconds',
            // timezone
            O: 'TimezoneOffset',
            Z: 'TimezoneName',
            G: 'GmtOffset'  
        },
        
        shortcuts: {
            // date
            F: '%Y-%m-%d',
            // time
            T: '%H:%M:%S',
            X: '%H:%M:%S',
            // local format date
            x: '%m/%d/%y',
            D: '%m/%d/%y',
            // local format extended
            '#c': '%a %b %e %H:%M:%S %Y',
            // local format short
            v: '%e-%b-%Y',
            R: '%H:%M',
            r: '%I:%M:%S %p',
            // tab and newline
            t: '\t',
            n: '\n',
            '%': '%'
        }
    };
    
    /**
     * PHP format codes and shortcuts for strftime.
     * 
     * A hash (object) of codes where each code must be an array where the first member is 
     * the name of a Date.prototype or jsDate.prototype function to call
     * and optionally a second member indicating the number to pass to addZeros()
     * 
     * <p>The following format codes are defined:</p>
     * 
     * <pre class="code">
     * Code    Result                    Description
     * === Days ===        
     * %a      Sun through Sat           An abbreviated textual representation of the day
     * %A      Sunday - Saturday         A full textual representation of the day
     * %d      01 to 31                  Two-digit day of the month (with leading zeros)
     * %e      1 to 31                   Day of the month, with a space preceding single digits.
     * %j      001 to 366                Day of the year, 3 digits with leading zeros
     * %u      1 - 7 (Mon - Sun)         ISO-8601 numeric representation of the day of the week
     * %w      0 - 6 (Sun - Sat)         Numeric representation of the day of the week
     *                                  
     * === Week ===                     
     * %U      13                        Full Week number, starting with the first Sunday as the first week
     * %V      01 through 53             ISO-8601:1988 week number, starting with the first week of the year 
     *                                   with at least 4 weekdays, with Monday being the start of the week
     * %W      46                        A numeric representation of the week of the year, 
     *                                   starting with the first Monday as the first week
     * === Month ===                    
     * %b      Jan through Dec           Abbreviated month name, based on the locale
     * %B      January - December        Full month name, based on the locale
     * %h      Jan through Dec           Abbreviated month name, based on the locale (an alias of %b)
     * %m      01 - 12 (Jan - Dec)       Two digit representation of the month
     * 
     * === Year ===                     
     * %C      19                        Two digit century (year/100, truncated to an integer)
     * %y      09 for 2009               Two digit year
     * %Y      2038                      Four digit year
     * 
     * === Time ===                     
     * %H      00 through 23             Two digit representation of the hour in 24-hour format
     * %I      01 through 12             Two digit representation of the hour in 12-hour format
     * %l      1 through 12              Hour in 12-hour format, with a space preceeding single digits
     * %M      00 through 59             Two digit representation of the minute
     * %p      AM/PM                     UPPER-CASE 'AM' or 'PM' based on the given time
     * %P      am/pm                     lower-case 'am' or 'pm' based on the given time
     * %r      09:34:17 PM               Same as %I:%M:%S %p
     * %R      00:35                     Same as %H:%M
     * %S      00 through 59             Two digit representation of the second
     * %T      21:34:17                  Same as %H:%M:%S
     * %X      03:59:16                  Preferred time representation based on locale, without the date
     * %z      -0500 or EST              Either the time zone offset from UTC or the abbreviation
     * %Z      -0500 or EST              The time zone offset/abbreviation option NOT given by %z
     * 
     * === Time and Date ===            
     * %D      02/05/09                  Same as %m/%d/%y
     * %F      2009-02-05                Same as %Y-%m-%d (commonly used in database datestamps)
     * %s      305815200                 Unix Epoch Time timestamp (same as the time() function)
     * %x      02/05/09                  Preferred date representation, without the time
     * 
     * === Miscellaneous ===            
     * %n        ---                     A newline character (\n)
     * %t        ---                     A Tab character (\t)
     * %%        ---                     A literal percentage character (%)
     * </pre>
     */
 
    jsDate.formats.php = {
        codes: {
            //
            // 2-part regex matcher for format codes
            //
            // first match must be the character before the code (to account for escaping)
            // second match must be the format code character(s)
            //
            matcher: /()%((%|[a-z]))/i,
            // day
            a: 'AbbrDayName',
            A: 'DayName',
            d: 'Date.2',
            e: 'Date',
            j: 'DayOfYear.3',
            u: 'DayOfWeek',
            w: 'Day',
            // week
            U: 'FullWeekOfYear.2',
            V: 'IsoWeek.2',
            W: 'WeekOfYear.2',
            // month
            b: 'AbbrMonthName',
            B: 'MonthName',
            m: 'MonthNumber.2',
            h: 'AbbrMonthName',
            // year
            C: 'Century.2',
            y: 'ShortYear.2',
            Y: 'FullYear',
            // time
            H: 'Hours.2',
            I: 'Hours12.2',
            l: 'Hours12',
            p: 'AMPM',
            P: 'AmPm',
            M: 'Minutes.2',
            S: 'Seconds.2',
            s: 'Unix',
            O: 'TimezoneOffset',
            z: 'GmtOffset',
            Z: 'TimezoneAbbr'
        },
        
        shortcuts: {
            D: '%m/%d/%y',
            F: '%Y-%m-%d',
            T: '%H:%M:%S',
            X: '%H:%M:%S',
            x: '%m/%d/%y',
            R: '%H:%M',
            r: '%I:%M:%S %p',
            t: '\t',
            n: '\n',
            '%': '%'
        }
    };   
    //
    // Conceptually, the logic implemented here is similar to Ken Snyder's Date Instance Methods.
    // I use his idea of a set of parsers which can be regular expressions or functions,
    // iterating through those, and then seeing if Date.parse() will create a date.
    // The parser expressions and functions are a little different and some bugs have been
    // worked out.  Also, a lot of "pre-parsing" is done to fix implementation
    // variations of Date.parse() between browsers.
    //
    jsDate.createDate = function(date) {
        // if passing in multiple arguments, try Date constructor
        if (date == null) {
            return new Date();
        }
        // If the passed value is already a date object, return it
        if (date instanceof Date) {
            return date;
        }
        // if (typeof date == 'number') return new Date(date * 1000);
        // If the passed value is an integer, interpret it as a javascript timestamp
        if (typeof date == 'number') {
            return new Date(date);
        }
        
        // Before passing strings into Date.parse(), have to normalize them for certain conditions.
        // If strings are not formatted staccording to the EcmaScript spec, results from Date parse will be implementation dependent.  
        // 
        // For example: 
        //  * FF and Opera assume 2 digit dates are pre y2k, Chome assumes <50 is pre y2k, 50+ is 21st century.  
        //  * Chrome will correctly parse '1984-1-25' into localtime, FF and Opera will not parse.
        //  * Both FF, Chrome and Opera will parse '1984/1/25' into localtime.
        
        // remove leading and trailing spaces
        var parsable = String(date).replace(/^\s*(.+)\s*$/g, '$1');
        
        // replace dahses (-) with slashes (/) in dates like n[nnn]/n[n]/n[nnn]
        parsable = parsable.replace(/^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,4})/, "$1/$2/$3");
        
        /////////
        // Need to check for '15-Dec-09' also.
        // FF will not parse, but Chrome will.
        // Chrome will set date to 2009 as well.
        /////////
        
        // first check for 'dd-mmm-yyyy' or 'dd/mmm/yyyy' like '15-Dec-2010'
        parsable = parsable.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{4})/i, "$1 $2 $3");
        
        // Now check for 'dd-mmm-yy' or 'dd/mmm/yy' and normalize years to default century.
        var match = parsable.match(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i);
        if (match && match.length > 3) {
            var m3 = parseFloat(match[3]);
            var ny = jsDate.config.defaultCentury + m3;
            ny = String(ny);
            
            // now replace 2 digit year with 4 digit year
            parsable = parsable.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i, match[1] +' '+ match[2] +' '+ ny);
            
        }
        
        // Check for '1/19/70 8:14PM'
        // where starts with mm/dd/yy or yy/mm/dd and have something after
        // Check if 1st postiion is greater than 31, assume it is year.
        // Assme all 2 digit years are 1900's.
        // Finally, change them into US style mm/dd/yyyy representations.
        match = parsable.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})[^0-9]/);
        
        function h1(parsable, match) {
            var m1 = parseFloat(match[1]);
            var m2 = parseFloat(match[2]);
            var m3 = parseFloat(match[3]);
            var cent = jsDate.config.defaultCentury;
            var ny, nd, nm, str;
            
            if (m1 > 31) { // first number is a year
                nd = m3;
                nm = m2;
                ny = cent + m1;
            }
            
            else { // last number is the year
                nd = m2;
                nm = m1;
                ny = cent + m3;
            }
            
            str = nm+'/'+nd+'/'+ny;
            
            // now replace 2 digit year with 4 digit year
            return  parsable.replace(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})/, str);
        
        }
        
        if (match && match.length > 3) {
            parsable = h1(parsable, match);
        }
        
        // Now check for '1/19/70' with nothing after and do as above
        var match = parsable.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})$/);
        
        if (match && match.length > 3) {
            parsable = h1(parsable, match);
        }
                
        
        var i = 0;
        var length = jsDate.matchers.length;
        var pattern,
            ms,
            current = parsable,
            obj;
        while (i < length) {
            ms = Date.parse(current);
            if (!isNaN(ms)) {
                return new Date(ms);
            }
            pattern = jsDate.matchers[i];
            if (typeof pattern == 'function') {
                obj = pattern.call(jsDate, current);
                if (obj instanceof Date) {
                    return obj;
                }
            } else {
                current = parsable.replace(pattern[0], pattern[1]);
            }
            i++;
        }
        return NaN;
    };
    

    /**
     * @static
     * Handy static utility function to return the number of days in a given month.
     * @param {Integer} year Year
     * @param {Integer} month Month (1-12)
     * @returns {Integer} Number of days in the month.
    */
    //
    // handy utility method Borrowed right from Ken Snyder's Date Instance Mehtods.
    // 
    jsDate.daysInMonth = function(year, month) {
        if (month == 2) {
            return new Date(year, 1, 29).getDate() == 29 ? 29 : 28;
        }
        return [undefined,31,undefined,31,30,31,30,31,31,30,31,30,31][month];
    };


    //
    // An Array of regular expressions or functions that will attempt to match the date string.
    // Functions are called with scope of a jsDate instance.
    //
    jsDate.matchers = [
        // convert dd.mmm.yyyy to mm/dd/yyyy (world date to US date).
        [/(3[01]|[0-2]\d)\s*\.\s*(1[0-2]|0\d)\s*\.\s*([1-9]\d{3})/, '$2/$1/$3'],
        // convert yyyy-mm-dd to mm/dd/yyyy (ISO date to US date).
        [/([1-9]\d{3})\s*-\s*(1[0-2]|0\d)\s*-\s*(3[01]|[0-2]\d)/, '$2/$3/$1'],
        // Handle 12 hour or 24 hour time with milliseconds am/pm and optional date part.
        function(str) { 
            var match = str.match(/^(?:(.+)\s+)?([012]?\d)(?:\s*\:\s*(\d\d))?(?:\s*\:\s*(\d\d(\.\d*)?))?\s*(am|pm)?\s*$/i);
            //                   opt. date      hour       opt. minute     opt. second       opt. msec   opt. am or pm
            if (match) {
                if (match[1]) {
                    var d = this.createDate(match[1]);
                    if (isNaN(d)) {
                        return;
                    }
                } else {
                    var d = new Date();
                    d.setMilliseconds(0);
                }
                var hour = parseFloat(match[2]);
                if (match[6]) {
                    hour = match[6].toLowerCase() == 'am' ? (hour == 12 ? 0 : hour) : (hour == 12 ? 12 : hour + 12);
                }
                d.setHours(hour, parseInt(match[3] || 0, 10), parseInt(match[4] || 0, 10), ((parseFloat(match[5] || 0)) || 0)*1000);
                return d;
            }
            else {
                return str;
            }
        },
        // Handle ISO timestamp with time zone.
        function(str) {
            var match = str.match(/^(?:(.+))[T|\s+]([012]\d)(?:\:(\d\d))(?:\:(\d\d))(?:\.\d+)([\+\-]\d\d\:\d\d)$/i);
            if (match) {
                if (match[1]) {
                    var d = this.createDate(match[1]);
                    if (isNaN(d)) {
                        return;
                    }
                } else {
                    var d = new Date();
                    d.setMilliseconds(0);
                }
                var hour = parseFloat(match[2]);
                d.setHours(hour, parseInt(match[3], 10), parseInt(match[4], 10), parseFloat(match[5])*1000);
                return d;
            }
            else {
                    return str;
            }
        },
        // Try to match ambiguous strings like 12/8/22.
        // Use FF date assumption that 2 digit years are 20th century (i.e. 1900's).
        // This may be redundant with pre processing of date already performed.
        function(str) {
            var match = str.match(/^([0-3]?\d)\s*[-\/.\s]{1}\s*([a-zA-Z]{3,9})\s*[-\/.\s]{1}\s*([0-3]?\d)$/);
            if (match) {
                var d = new Date();
                var cent = jsDate.config.defaultCentury;
                var m1 = parseFloat(match[1]);
                var m3 = parseFloat(match[3]);
                var ny, nd, nm;
                if (m1 > 31) { // first number is a year
                    nd = m3;
                    ny = cent + m1;
                }
                
                else { // last number is the year
                    nd = m1;
                    ny = cent + m3;
                }
                
                var nm = inArray(match[2], jsDate.regional[jsDate.regional.getLocale()]["monthNamesShort"]);
                
                if (nm == -1) {
                    nm = inArray(match[2], jsDate.regional[jsDate.regional.getLocale()]["monthNames"]);
                }
            
                d.setFullYear(ny, nm, nd);
                d.setHours(0,0,0,0);
                return d;
            }
            
            else {
                return str;
            }
        }      
    ];

    //
    // I think John Reisig published this method on his blog, ejohn.
    //
    function inArray( elem, array ) {
        if ( array.indexOf ) {
            return array.indexOf( elem );
        }

        for ( var i = 0, length = array.length; i < length; i++ ) {
            if ( array[ i ] === elem ) {
                return i;
            }
        }

        return -1;
    }
    
    //
    // Thanks to Kangax, Christian Sciberras and Stack Overflow for this method.
    //
    function get_type(thing){
        if(thing===null) return "[object Null]"; // special case
        return Object.prototype.toString.call(thing);
    }
    
    $.jsDate = jsDate;

      
    /**
     * JavaScript printf/sprintf functions.
     * 
     * This code has been adapted from the publicly available sprintf methods
     * by Ash Searle. His original header follows:
     *
     *     This code is unrestricted: you are free to use it however you like.
     *     
     *     The functions should work as expected, performing left or right alignment,
     *     truncating strings, outputting numbers with a required precision etc.
     *
     *     For complex cases, these functions follow the Perl implementations of
     *     (s)printf, allowing arguments to be passed out-of-order, and to set the
     *     precision or length of the output based on arguments instead of fixed
     *     numbers.
     *
     *     See http://perldoc.perl.org/functions/sprintf.html for more information.
     *
     *     Implemented:
     *     - zero and space-padding
     *     - right and left-alignment,
     *     - base X prefix (binary, octal and hex)
     *     - positive number prefix
     *     - (minimum) width
     *     - precision / truncation / maximum width
     *     - out of order arguments
     *
     *     Not implemented (yet):
     *     - vector flag
     *     - size (bytes, words, long-words etc.)
     *     
     *     Will not implement:
     *     - %n or %p (no pass-by-reference in JavaScript)
     *
     *     @version 2007.04.27
     *     @author Ash Searle 
     * 
     * You can see the original work and comments on his blog:
     * http://hexmen.com/blog/2007/03/printf-sprintf/
     * http://hexmen.com/js/sprintf.js
     */
     
     /**
      * @Modifications 2009.05.26
      * @author Chris Leonello
      * 
      * Added %p %P specifier
      * Acts like %g or %G but will not add more significant digits to the output than present in the input.
      * Example:
      * Format: '%.3p', Input: 0.012, Output: 0.012
      * Format: '%.3g', Input: 0.012, Output: 0.0120
      * Format: '%.4p', Input: 12.0, Output: 12.0
      * Format: '%.4g', Input: 12.0, Output: 12.00
      * Format: '%.4p', Input: 4.321e-5, Output: 4.321e-5
      * Format: '%.4g', Input: 4.321e-5, Output: 4.3210e-5
      * 
      * Example:
      * >>> $.jqplot.sprintf('%.2f, %d', 23.3452, 43.23)
      * "23.35, 43"
      * >>> $.jqplot.sprintf("no value: %n, decimal with thousands separator: %'d", 23.3452, 433524)
      * "no value: , decimal with thousands separator: 433,524"
      */
    $.jqplot.sprintf = function() {
        function pad(str, len, chr, leftJustify) {
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;

        }

        function thousand_separate(value) {
            var value_str = new String(value);
            for (var i=10; i>0; i--) {
                if (value_str == (value_str = value_str.replace(/^(\d+)(\d{3})/, "$1"+$.jqplot.sprintf.thousandsSeparator+"$2"))) break;
            }
            return value_str; 
        }

        function justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                var spchar = ' ';
                if (htmlSpace) { spchar = '&nbsp;'; }
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, spchar, leftJustify);
                } else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        }

        function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad, htmlSpace) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace);
        }

        function formatString(value, leftJustify, minWidth, precision, zeroPad, htmlSpace) {
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, htmlSpace);
        }

        var a = arguments, i = 0, format = a[i++];

        return format.replace($.jqplot.sprintf.regex, function(substring, valueIndex, flags, minWidth, _, precision, type) {
            if (substring == '%%') { return '%'; }

            // parse flags
            var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, htmlSpace = false, thousandSeparation = false;
            for (var j = 0; flags && j < flags.length; j++) switch (flags.charAt(j)) {
                case ' ': positivePrefix = ' '; break;
                case '+': positivePrefix = '+'; break;
                case '-': leftJustify = true; break;
                case '0': zeroPad = true; break;
                case '#': prefixBaseX = true; break;
                case '&': htmlSpace = true; break;
                case '\'': thousandSeparation = true; break;
            }

            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values

            if (!minWidth) {
                minWidth = 0;
            } 
            else if (minWidth == '*') {
                minWidth = +a[i++];
            } 
            else if (minWidth.charAt(0) == '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            } 
            else {
                minWidth = +minWidth;
            }

            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }

            if (!isFinite(minWidth)) {
                throw new Error('$.jqplot.sprintf: (minimum-)width must be finite');
            }

            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void(0);
            } 
            else if (precision == '*') {
                precision = +a[i++];
            } 
            else if (precision.charAt(0) == '*') {
                precision = +a[precision.slice(1, -1)];
            } 
            else {
                precision = +precision;
            }

            // grab value using valueIndex if required?
            var value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

            switch (type) {
            case 's': {
                if (value == null) {
                    return '';
                }
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, htmlSpace);
            }
            case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad, htmlSpace);
            case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad,htmlSpace);
            case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace);
            case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace);
            case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace).toUpperCase();
            case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad, htmlSpace);
            case 'i': {
              var number = parseInt(+value, 10);
              if (isNaN(number)) {
                return '';
              }
              var prefix = number < 0 ? '-' : positivePrefix;
              var number_str = thousandSeparation ? thousand_separate(String(Math.abs(number))): String(Math.abs(number));
              value = prefix + pad(number_str, precision, '0', false);
              //value = prefix + pad(String(Math.abs(number)), precision, '0', false);
              return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace);
                  }
            case 'd': {
              var number = Math.round(+value);
              if (isNaN(number)) {
                return '';
              }
              var prefix = number < 0 ? '-' : positivePrefix;
              var number_str = thousandSeparation ? thousand_separate(String(Math.abs(number))): String(Math.abs(number));
              value = prefix + pad(number_str, precision, '0', false);
              return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace);
                  }
            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G':
                      {
                      var number = +value;
                      if (isNaN(number)) {
                          return '';
                      }
                      var prefix = number < 0 ? '-' : positivePrefix;
                      var method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                      var textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                      var number_str = Math.abs(number)[method](precision);
                      
                      // Apply the decimal mark properly by splitting the number by the
                      //   decimalMark, applying thousands separator, and then placing it
                      //   back in.
                      var parts = number_str.toString().split('.');
                      parts[0] = thousandSeparation ? thousand_separate(parts[0]) : parts[0];
                      number_str = parts.join($.jqplot.sprintf.decimalMark);
                      
                      value = prefix + number_str;
                      var justified = justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace)[textTransform]();
                      
                      return justified;
                  }
            case 'p':
            case 'P':
            {
                // make sure number is a number
                var number = +value;
                if (isNaN(number)) {
                    return '';
                }
                var prefix = number < 0 ? '-' : positivePrefix;

                var parts = String(Number(Math.abs(number)).toExponential()).split(/e|E/);
                var sd = (parts[0].indexOf('.') != -1) ? parts[0].length - 1 : String(number).length;
                var zeros = (parts[1] < 0) ? -parts[1] - 1 : 0;
                
                if (Math.abs(number) < 1) {
                    if (sd + zeros  <= precision) {
                        value = prefix + Math.abs(number).toPrecision(sd);
                    }
                    else {
                        if (sd  <= precision - 1) {
                            value = prefix + Math.abs(number).toExponential(sd-1);
                        }
                        else {
                            value = prefix + Math.abs(number).toExponential(precision-1);
                        }
                    }
                }
                else {
                    var prec = (sd <= precision) ? sd : precision;
                    value = prefix + Math.abs(number).toPrecision(prec);
                }
                var textTransform = ['toString', 'toUpperCase']['pP'.indexOf(type) % 2];
                return justify(value, prefix, leftJustify, minWidth, zeroPad, htmlSpace)[textTransform]();
            }
            case 'n': return '';
            default: return substring;
            }
        });
    };

    $.jqplot.sprintf.thousandsSeparator = ',';
    // Specifies the decimal mark for floating point values. By default a period '.'
    // is used. If you change this value to for example a comma be sure to also
    // change the thousands separator or else this won't work since a simple String
    // replace is used (replacing all periods with the mark specified here).
    $.jqplot.sprintf.decimalMark = '.';
    
    $.jqplot.sprintf.regex = /%%|%(\d+\$)?([-+#0&\' ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g;

    $.jqplot.getSignificantFigures = function(number) {
        var parts = String(Number(Math.abs(number)).toExponential()).split(/e|E/);
        // total significant digits
        var sd = (parts[0].indexOf('.') != -1) ? parts[0].length - 1 : parts[0].length;
        var zeros = (parts[1] < 0) ? -parts[1] - 1 : 0;
        // exponent
        var expn = parseInt(parts[1], 10);
        // digits to the left of the decimal place
        var dleft = (expn + 1 > 0) ? expn + 1 : 0;
        // digits to the right of the decimal place
        var dright = (sd <= dleft) ? 0 : sd - expn - 1;
        return {significantDigits: sd, digitsLeft: dleft, digitsRight: dright, zeros: zeros, exponent: expn} ;
    };

    $.jqplot.getPrecision = function(number) {
        return $.jqplot.getSignificantFigures(number).digitsRight;
    };

  


    var backCompat = $.uiBackCompat !== false;

    $.jqplot.effects = {
        effect: {}
    };

    // prefix used for storing data on .data()
    var dataSpace = "jqplot.storage.";

    /******************************************************************************/
    /*********************************** EFFECTS **********************************/
    /******************************************************************************/

    $.extend( $.jqplot.effects, {
        version: "1.9pre",

        // Saves a set of properties in a data storage
        save: function( element, set ) {
            for( var i=0; i < set.length; i++ ) {
                if ( set[ i ] !== null ) {
                    element.data( dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ] );
                }
            }
        },

        // Restores a set of previously saved properties from a data storage
        restore: function( element, set ) {
            for( var i=0; i < set.length; i++ ) {
                if ( set[ i ] !== null ) {
                    element.css( set[ i ], element.data( dataSpace + set[ i ] ) );
                }
            }
        },

        setMode: function( el, mode ) {
            if (mode === "toggle") {
                mode = el.is( ":hidden" ) ? "show" : "hide";
            }
            return mode;
        },

        // Wraps the element around a wrapper that copies position properties
        createWrapper: function( element ) {

            // if the element is already wrapped, return it
            if ( element.parent().is( ".ui-effects-wrapper" )) {
                return element.parent();
            }

            // wrap the element
            var props = {
                    width: element.outerWidth(true),
                    height: element.outerHeight(true),
                    "float": element.css( "float" )
                },
                wrapper = $( "<div></div>" )
                    .addClass( "ui-effects-wrapper" )
                    .css({
                        fontSize: "100%",
                        background: "transparent",
                        border: "none",
                        margin: 0,
                        padding: 0
                    }),
                // Store the size in case width/height are defined in % - Fixes #5245
                size = {
                    width: element.width(),
                    height: element.height()
                },
                active = document.activeElement;

            element.wrap( wrapper );

            // Fixes #7595 - Elements lose focus when wrapped.
            if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
                $( active ).focus();
            }

            wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually loose the reference to the wrapped element

            // transfer positioning properties to the wrapper
            if ( element.css( "position" ) === "static" ) {
                wrapper.css({ position: "relative" });
                element.css({ position: "relative" });
            } else {
                $.extend( props, {
                    position: element.css( "position" ),
                    zIndex: element.css( "z-index" )
                });
                $.each([ "top", "left", "bottom", "right" ], function(i, pos) {
                    props[ pos ] = element.css( pos );
                    if ( isNaN( parseInt( props[ pos ], 10 ) ) ) {
                        props[ pos ] = "auto";
                    }
                });
                element.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                });
            }
            element.css(size);

            return wrapper.css( props ).show();
        },

        removeWrapper: function( element ) {
            var active = document.activeElement;

            if ( element.parent().is( ".ui-effects-wrapper" ) ) {
                element.parent().replaceWith( element );

                // Fixes #7595 - Elements lose focus when wrapped.
                if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
                    $( active ).focus();
                }
            }


            return element;
        }
    });

    // return an effect options object for the given parameters:
    function _normalizeArguments( effect, options, speed, callback ) {

        // short path for passing an effect options object:
        if ( $.isPlainObject( effect ) ) {
            return effect;
        }

        // convert to an object
        effect = { effect: effect };

        // catch (effect)
        if ( options === undefined ) {
            options = {};
        }

        // catch (effect, callback)
        if ( $.isFunction( options ) ) {
            callback = options;
            speed = null;
            options = {};
        }

        // catch (effect, speed, ?)
        if ( $.type( options ) === "number" || $.fx.speeds[ options ]) {
            callback = speed;
            speed = options;
            options = {};
        }

        // catch (effect, options, callback)
        if ( $.isFunction( speed ) ) {
            callback = speed;
            speed = null;
        }

        // add options to effect
        if ( options ) {
            $.extend( effect, options );
        }

        speed = speed || options.duration;
        effect.duration = $.fx.off ? 0 : typeof speed === "number"
            ? speed : speed in $.fx.speeds ? $.fx.speeds[ speed ] : $.fx.speeds._default;

        effect.complete = callback || options.complete;

        return effect;
    }

    function standardSpeed( speed ) {
        // valid standard speeds
        if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
            return true;
        }

        // invalid strings - treat as "normal" speed
        if ( typeof speed === "string" && !$.jqplot.effects.effect[ speed ] ) {
            // TODO: remove in 2.0 (#7115)
            if ( backCompat && $.jqplot.effects[ speed ] ) {
                return false;
            }
            return true;
        }

        return false;
    }

    $.fn.extend({
        jqplotEffect: function( effect, options, speed, callback ) {
            var args = _normalizeArguments.apply( this, arguments ),
                mode = args.mode,
                queue = args.queue,
                effectMethod = $.jqplot.effects.effect[ args.effect ],

                // DEPRECATED: remove in 2.0 (#7115)
                oldEffectMethod = !effectMethod && backCompat && $.jqplot.effects[ args.effect ];

            if ( $.fx.off || !( effectMethod || oldEffectMethod ) ) {
                // delegate to the original method (e.g., .show()) if possible
                if ( mode ) {
                    return this[ mode ]( args.duration, args.complete );
                } else {
                    return this.each( function() {
                        if ( args.complete ) {
                            args.complete.call( this );
                        }
                    });
                }
            }

            function run( next ) {
                var elem = $( this ),
                    complete = args.complete,
                    mode = args.mode;

                function done() {
                    if ( $.isFunction( complete ) ) {
                        complete.call( elem[0] );
                    }
                    if ( $.isFunction( next ) ) {
                        next();
                    }
                }

                // if the element is hiddden and mode is hide,
                // or element is visible and mode is show
                if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {
                    done();
                } else {
                    effectMethod.call( elem[0], args, done );
                }
            }

            // TODO: remove this check in 2.0, effectMethod will always be true
            if ( effectMethod ) {
                return queue === false ? this.each( run ) : this.queue( queue || "fx", run );
            } else {
                // DEPRECATED: remove in 2.0 (#7115)
                return oldEffectMethod.call(this, {
                    options: args,
                    duration: args.duration,
                    callback: args.complete,
                    mode: args.mode
                });
            }
        }
    });




    var rvertical = /up|down|vertical/,
        rpositivemotion = /up|left|vertical|horizontal/;

    $.jqplot.effects.effect.blind = function( o, done ) {
        // Create element
        var el = $( this ),
            props = [ "position", "top", "bottom", "left", "right", "height", "width" ],
            mode = $.jqplot.effects.setMode( el, o.mode || "hide" ),
            direction = o.direction || "up",
            vertical = rvertical.test( direction ),
            ref = vertical ? "height" : "width",
            ref2 = vertical ? "top" : "left",
            motion = rpositivemotion.test( direction ),
            animation = {},
            show = mode === "show",
            wrapper, distance, top;

        // // if already wrapped, the wrapper's properties are my property. #6245
        if ( el.parent().is( ".ui-effects-wrapper" ) ) {
            $.jqplot.effects.save( el.parent(), props );
        } else {
            $.jqplot.effects.save( el, props );
        }
        el.show();
        top = parseInt(el.css('top'), 10);
        wrapper = $.jqplot.effects.createWrapper( el ).css({
            overflow: "hidden"
        });

        distance = vertical ? wrapper[ ref ]() + top : wrapper[ ref ]();

        animation[ ref ] = show ? String(distance) : '0';
        if ( !motion ) {
            el
                .css( vertical ? "bottom" : "right", 0 )
                .css( vertical ? "top" : "left", "" )
                .css({ position: "absolute" });
            animation[ ref2 ] = show ? '0' : String(distance);
        }

        // // start at 0 if we are showing
        if ( show ) {
            wrapper.css( ref, 0 );
            if ( ! motion ) {
                wrapper.css( ref2, distance );
            }
        }

        // // Animate
        wrapper.animate( animation, {
            duration: o.duration,
            easing: o.easing,
            queue: false,
            complete: function() {
                if ( mode === "hide" ) {
                    el.hide();
                }
                $.jqplot.effects.restore( el, props );
                $.jqplot.effects.removeWrapper( el );
                done();
            }
        });

    };

})(jQuery);


//next
//excanvas.js
// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns only support repeat.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Non uniform scaling does not correctly scale strokes.
// * Optimize. There is always room for speed improvements.

// Only add this code if we do not already have a canvas implementation
if (!document.createElement('canvas').getContext) {

(function() {

  // alias some functions to make (compiled) code shorter
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;
  var abs = m.abs;
  var sqrt = m.sqrt;

  // this is used for sub pixel precision
  var Z = 10;
  var Z2 = Z / 2;

  var IE_VERSION = +navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];

  /**
   * This funtion is assigned to the <canvas> elements as element.getContext().
   * @this {HTMLElement}
   * @return {CanvasRenderingContext2D_}
   */
  function getContext() {
    return this.context_ ||
        (this.context_ = new CanvasRenderingContext2D_(this));
  }

  var slice = Array.prototype.slice;

  /**
   * Binds a function to an object. The returned function will always use the
   * passed in {@code obj} as {@code this}.
   *
   * Example:
   *
   *   g = bind(f, obj, a, b)
   *   g(c, d) // will do f.call(obj, a, b, c, d)
   *
   * @param {Function} f The function to bind the object to
   * @param {Object} obj The object that should act as this when the function
   *     is called
   * @param {*} var_args Rest arguments that will be used as the initial
   *     arguments when the function is called
   * @return {Function} A new function that has bound this
   */
  function bind(f, obj, var_args) {
    var a = slice.call(arguments, 2);
    return function() {
      return f.apply(obj, a.concat(slice.call(arguments)));
    };
  }

  function encodeHtmlAttribute(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function addNamespace(doc, prefix, urn) {
    if (!doc.namespaces[prefix]) {
      doc.namespaces.add(prefix, urn, '#default#VML');
    }
  }

  function addNamespacesAndStylesheet(doc) {
    addNamespace(doc, 'g_vml_', 'urn:schemas-microsoft-com:vml');
    addNamespace(doc, 'g_o_', 'urn:schemas-microsoft-com:office:office');

    // Setup default CSS.  Only add one style sheet per document
    if (!doc.styleSheets['ex_canvas_']) {
      var ss = doc.createStyleSheet();
      ss.owningElement.id = 'ex_canvas_';
      ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
          // default size is 300x150 in Gecko and Opera
          'text-align:left;width:300px;height:150px}';
    }
  }

  // Add namespaces and stylesheet at startup.
  addNamespacesAndStylesheet(document);

  var G_vmlCanvasManager_ = {
    init: function(opt_doc) {
      var doc = opt_doc || document;
      // Create a dummy element so that IE will allow canvas elements to be
      // recognized.
      doc.createElement('canvas');
      doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
    },

    init_: function(doc) {
      // find all canvas elements
      var els = doc.getElementsByTagName('canvas');
      for (var i = 0; i < els.length; i++) {
        this.initElement(els[i]);
      }
    },

    /**
     * Public initializes a canvas element so that it can be used as canvas
     * element from now on. This is called automatically before the page is
     * loaded but if you are creating elements using createElement you need to
     * make sure this is called on the element.
     * @param {HTMLElement} el The canvas element to initialize.
     * @return {HTMLElement} the element that was created.
     */
    initElement: function(el) {
      if (!el.getContext) {
        el.getContext = getContext;

        // Add namespaces and stylesheet to document of the element.
        addNamespacesAndStylesheet(el.ownerDocument);

        // Remove fallback content. There is no way to hide text nodes so we
        // just remove all childNodes. We could hide all elements and remove
        // text nodes but who really cares about the fallback content.
        el.innerHTML = '';

        // do not use inline function because that will leak memory
        el.attachEvent('onpropertychange', onPropertyChange);
        el.attachEvent('onresize', onResize);

        var attrs = el.attributes;
        if (attrs.width && attrs.width.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setWidth_(attrs.width.nodeValue);
          el.style.width = attrs.width.nodeValue + 'px';
        } else {
          el.width = el.clientWidth;
        }
        if (attrs.height && attrs.height.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setHeight_(attrs.height.nodeValue);
          el.style.height = attrs.height.nodeValue + 'px';
        } else {
          el.height = el.clientHeight;
        }
        //el.getContext().setCoordsize_()
      }
      return el;
    }
  };

  function onPropertyChange(e) {
    var el = e.srcElement;

    switch (e.propertyName) {
      case 'width':
        el.getContext().clearRect();
        el.style.width = el.attributes.width.nodeValue + 'px';
        // In IE8 this does not trigger onresize.
        el.firstChild.style.width =  el.clientWidth + 'px';
        break;
      case 'height':
        el.getContext().clearRect();
        el.style.height = el.attributes.height.nodeValue + 'px';
        el.firstChild.style.height = el.clientHeight + 'px';
        break;
    }
  }

  function onResize(e) {
    var el = e.srcElement;
    if (el.firstChild) {
      el.firstChild.style.width =  el.clientWidth + 'px';
      el.firstChild.style.height = el.clientHeight + 'px';
    }
  }

  G_vmlCanvasManager_.init();

  // precompute "00" to "FF"
  var decToHex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      decToHex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  function matrixMultiply(m1, m2) {
    var result = createMatrixIdentity();

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;

        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }

        result[x][y] = sum;
      }
    }
    return result;
  }

  function copyState(o1, o2) {
    o2.fillStyle     = o1.fillStyle;
    o2.lineCap       = o1.lineCap;
    o2.lineJoin      = o1.lineJoin;
    o2.lineWidth     = o1.lineWidth;
    o2.miterLimit    = o1.miterLimit;
    o2.shadowBlur    = o1.shadowBlur;
    o2.shadowColor   = o1.shadowColor;
    o2.shadowOffsetX = o1.shadowOffsetX;
    o2.shadowOffsetY = o1.shadowOffsetY;
    o2.strokeStyle   = o1.strokeStyle;
    o2.globalAlpha   = o1.globalAlpha;
    o2.font          = o1.font;
    o2.textAlign     = o1.textAlign;
    o2.textBaseline  = o1.textBaseline;
    o2.arcScaleX_    = o1.arcScaleX_;
    o2.arcScaleY_    = o1.arcScaleY_;
    o2.lineScale_    = o1.lineScale_;
  }

  var colorData = {
    aliceblue: '#F0F8FF',
    antiquewhite: '#FAEBD7',
    aquamarine: '#7FFFD4',
    azure: '#F0FFFF',
    beige: '#F5F5DC',
    bisque: '#FFE4C4',
    black: '#000000',
    blanchedalmond: '#FFEBCD',
    blueviolet: '#8A2BE2',
    brown: '#A52A2A',
    burlywood: '#DEB887',
    cadetblue: '#5F9EA0',
    chartreuse: '#7FFF00',
    chocolate: '#D2691E',
    coral: '#FF7F50',
    cornflowerblue: '#6495ED',
    cornsilk: '#FFF8DC',
    crimson: '#DC143C',
    cyan: '#00FFFF',
    darkblue: '#00008B',
    darkcyan: '#008B8B',
    darkgoldenrod: '#B8860B',
    darkgray: '#A9A9A9',
    darkgreen: '#006400',
    darkgrey: '#A9A9A9',
    darkkhaki: '#BDB76B',
    darkmagenta: '#8B008B',
    darkolivegreen: '#556B2F',
    darkorange: '#FF8C00',
    darkorchid: '#9932CC',
    darkred: '#8B0000',
    darksalmon: '#E9967A',
    darkseagreen: '#8FBC8F',
    darkslateblue: '#483D8B',
    darkslategray: '#2F4F4F',
    darkslategrey: '#2F4F4F',
    darkturquoise: '#00CED1',
    darkviolet: '#9400D3',
    deeppink: '#FF1493',
    deepskyblue: '#00BFFF',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1E90FF',
    firebrick: '#B22222',
    floralwhite: '#FFFAF0',
    forestgreen: '#228B22',
    gainsboro: '#DCDCDC',
    ghostwhite: '#F8F8FF',
    gold: '#FFD700',
    goldenrod: '#DAA520',
    grey: '#808080',
    greenyellow: '#ADFF2F',
    honeydew: '#F0FFF0',
    hotpink: '#FF69B4',
    indianred: '#CD5C5C',
    indigo: '#4B0082',
    ivory: '#FFFFF0',
    khaki: '#F0E68C',
    lavender: '#E6E6FA',
    lavenderblush: '#FFF0F5',
    lawngreen: '#7CFC00',
    lemonchiffon: '#FFFACD',
    lightblue: '#ADD8E6',
    lightcoral: '#F08080',
    lightcyan: '#E0FFFF',
    lightgoldenrodyellow: '#FAFAD2',
    lightgreen: '#90EE90',
    lightgrey: '#D3D3D3',
    lightpink: '#FFB6C1',
    lightsalmon: '#FFA07A',
    lightseagreen: '#20B2AA',
    lightskyblue: '#87CEFA',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#B0C4DE',
    lightyellow: '#FFFFE0',
    limegreen: '#32CD32',
    linen: '#FAF0E6',
    magenta: '#FF00FF',
    mediumaquamarine: '#66CDAA',
    mediumblue: '#0000CD',
    mediumorchid: '#BA55D3',
    mediumpurple: '#9370DB',
    mediumseagreen: '#3CB371',
    mediumslateblue: '#7B68EE',
    mediumspringgreen: '#00FA9A',
    mediumturquoise: '#48D1CC',
    mediumvioletred: '#C71585',
    midnightblue: '#191970',
    mintcream: '#F5FFFA',
    mistyrose: '#FFE4E1',
    moccasin: '#FFE4B5',
    navajowhite: '#FFDEAD',
    oldlace: '#FDF5E6',
    olivedrab: '#6B8E23',
    orange: '#FFA500',
    orangered: '#FF4500',
    orchid: '#DA70D6',
    palegoldenrod: '#EEE8AA',
    palegreen: '#98FB98',
    paleturquoise: '#AFEEEE',
    palevioletred: '#DB7093',
    papayawhip: '#FFEFD5',
    peachpuff: '#FFDAB9',
    peru: '#CD853F',
    pink: '#FFC0CB',
    plum: '#DDA0DD',
    powderblue: '#B0E0E6',
    rosybrown: '#BC8F8F',
    royalblue: '#4169E1',
    saddlebrown: '#8B4513',
    salmon: '#FA8072',
    sandybrown: '#F4A460',
    seagreen: '#2E8B57',
    seashell: '#FFF5EE',
    sienna: '#A0522D',
    skyblue: '#87CEEB',
    slateblue: '#6A5ACD',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#FFFAFA',
    springgreen: '#00FF7F',
    steelblue: '#4682B4',
    tan: '#D2B48C',
    thistle: '#D8BFD8',
    tomato: '#FF6347',
    turquoise: '#40E0D0',
    violet: '#EE82EE',
    wheat: '#F5DEB3',
    whitesmoke: '#F5F5F5',
    yellowgreen: '#9ACD32'
  };


  function getRgbHslContent(styleString) {
    var start = styleString.indexOf('(', 3);
    var end = styleString.indexOf(')', start + 1);
    var parts = styleString.substring(start + 1, end).split(',');
    // add alpha if needed
    if (parts.length != 4 || styleString.charAt(3) != 'a') {
      parts[3] = 1;
    }
    return parts;
  }

  function percent(s) {
    return parseFloat(s) / 100;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function hslToRgb(parts){
    var r, g, b, h, s, l;
    h = parseFloat(parts[0]) / 360 % 360;
    if (h < 0)
      h++;
    s = clamp(percent(parts[1]), 0, 1);
    l = clamp(percent(parts[2]), 0, 1);
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    return '#' + decToHex[Math.floor(r * 255)] +
        decToHex[Math.floor(g * 255)] +
        decToHex[Math.floor(b * 255)];
  }

  function hueToRgb(m1, m2, h) {
    if (h < 0)
      h++;
    if (h > 1)
      h--;

    if (6 * h < 1)
      return m1 + (m2 - m1) * 6 * h;
    else if (2 * h < 1)
      return m2;
    else if (3 * h < 2)
      return m1 + (m2 - m1) * (2 / 3 - h) * 6;
    else
      return m1;
  }

  var processStyleCache = {};

  function processStyle(styleString) {
    if (styleString in processStyleCache) {
      return processStyleCache[styleString];
    }

    var str, alpha = 1;

    styleString = String(styleString);
    if (styleString.charAt(0) == '#') {
      str = styleString;
    } else if (/^rgb/.test(styleString)) {
      var parts = getRgbHslContent(styleString);
      var str = '#', n;
      for (var i = 0; i < 3; i++) {
        if (parts[i].indexOf('%') != -1) {
          n = Math.floor(percent(parts[i]) * 255);
        } else {
          n = +parts[i];
        }
        str += decToHex[clamp(n, 0, 255)];
      }
      alpha = +parts[3];
    } else if (/^hsl/.test(styleString)) {
      var parts = getRgbHslContent(styleString);
      str = hslToRgb(parts);
      alpha = parts[3];
    } else {
      str = colorData[styleString] || styleString;
    }
    return processStyleCache[styleString] = {color: str, alpha: alpha};
  }

  var DEFAULT_STYLE = {
    style: 'normal',
    variant: 'normal',
    weight: 'normal',
    size: 10,
    family: 'sans-serif'
  };

  // Internal text style cache
  var fontStyleCache = {};

  function processFontStyle(styleString) {
    if (fontStyleCache[styleString]) {
      return fontStyleCache[styleString];
    }

    var el = document.createElement('div');
    var style = el.style;
    try {
      style.font = styleString;
    } catch (ex) {
      // Ignore failures to set to invalid font.
    }

    return fontStyleCache[styleString] = {
      style: style.fontStyle || DEFAULT_STYLE.style,
      variant: style.fontVariant || DEFAULT_STYLE.variant,
      weight: style.fontWeight || DEFAULT_STYLE.weight,
      size: style.fontSize || DEFAULT_STYLE.size,
      family: style.fontFamily || DEFAULT_STYLE.family
    };
  }

  function getComputedStyle(style, element) {
    var computedStyle = {};

    for (var p in style) {
      computedStyle[p] = style[p];
    }

    // Compute the size
    var canvasFontSize = parseFloat(element.currentStyle.fontSize),
        fontSize = parseFloat(style.size);

    if (typeof style.size == 'number') {
      computedStyle.size = style.size;
    } else if (style.size.indexOf('px') != -1) {
      computedStyle.size = fontSize;
    } else if (style.size.indexOf('em') != -1) {
      computedStyle.size = canvasFontSize * fontSize;
    } else if(style.size.indexOf('%') != -1) {
      computedStyle.size = (canvasFontSize / 100) * fontSize;
    } else if (style.size.indexOf('pt') != -1) {
      computedStyle.size = fontSize / .75;
    } else {
      computedStyle.size = canvasFontSize;
    }

    // Different scaling between normal text and VML text. This was found using
    // trial and error to get the same size as non VML text.
    computedStyle.size *= 0.981;

    return computedStyle;
  }

  function buildStyle(style) {
    return style.style + ' ' + style.variant + ' ' + style.weight + ' ' +
        style.size + 'px ' + style.family;
  }

  var lineCapMap = {
    'butt': 'flat',
    'round': 'round'
  };

  function processLineCap(lineCap) {
    return lineCapMap[lineCap] || 'square';
  }

  /**
   * This class implements CanvasRenderingContext2D interface as described by
   * the WHATWG.
   * @param {HTMLElement} canvasElement The element that the 2D context should
   * be associated with
   */
  function CanvasRenderingContext2D_(canvasElement) {
    this.m_ = createMatrixIdentity();

    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];

    // Canvas context properties
    this.strokeStyle = '#000';
    this.fillStyle = '#000';

    this.lineWidth = 1;
    this.lineJoin = 'miter';
    this.lineCap = 'butt';
    this.miterLimit = Z * 1;
    this.globalAlpha = 1;
    this.font = '10px sans-serif';
    this.textAlign = 'left';
    this.textBaseline = 'alphabetic';
    this.canvas = canvasElement;

    var cssText = 'width:' + canvasElement.clientWidth + 'px;height:' +
        canvasElement.clientHeight + 'px;overflow:hidden;position:absolute';
    var el = canvasElement.ownerDocument.createElement('div');
    el.style.cssText = cssText;
    canvasElement.appendChild(el);

    var overlayEl = el.cloneNode(false);
    // Use a non transparent background.
    overlayEl.style.backgroundColor = 'red';
    overlayEl.style.filter = 'alpha(opacity=0)';
    canvasElement.appendChild(overlayEl);

    this.element_ = el;
    this.arcScaleX_ = 1;
    this.arcScaleY_ = 1;
    this.lineScale_ = 1;
  }

  var contextPrototype = CanvasRenderingContext2D_.prototype;
  contextPrototype.clearRect = function() {
    if (this.textMeasureEl_) {
      this.textMeasureEl_.removeNode(true);
      this.textMeasureEl_ = null;
    }
    this.element_.innerHTML = '';
  };

  contextPrototype.beginPath = function() {
    // TODO: Branch current matrix so that save/restore has no effect
    //       as per safari docs.
    this.currentPath_ = [];
  };

  contextPrototype.moveTo = function(aX, aY) {
    var p = getCoords(this, aX, aY);
    this.currentPath_.push({type: 'moveTo', x: p.x, y: p.y});
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.lineTo = function(aX, aY) {
    var p = getCoords(this, aX, aY);
    this.currentPath_.push({type: 'lineTo', x: p.x, y: p.y});

    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                            aCP2x, aCP2y,
                                            aX, aY) {
    var p = getCoords(this, aX, aY);
    var cp1 = getCoords(this, aCP1x, aCP1y);
    var cp2 = getCoords(this, aCP2x, aCP2y);
    bezierCurveTo(this, cp1, cp2, p);
  };

  // Helper function that takes the already fixed cordinates.
  function bezierCurveTo(self, cp1, cp2, p) {
    self.currentPath_.push({
      type: 'bezierCurveTo',
      cp1x: cp1.x,
      cp1y: cp1.y,
      cp2x: cp2.x,
      cp2y: cp2.y,
      x: p.x,
      y: p.y
    });
    self.currentX_ = p.x;
    self.currentY_ = p.y;
  }

  contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    // the following is lifted almost directly from
    // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

    var cp = getCoords(this, aCPx, aCPy);
    var p = getCoords(this, aX, aY);

    var cp1 = {
      x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
      y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
    };
    var cp2 = {
      x: cp1.x + (p.x - this.currentX_) / 3.0,
      y: cp1.y + (p.y - this.currentY_) / 3.0
    };

    bezierCurveTo(this, cp1, cp2, p);
  };

  contextPrototype.arc = function(aX, aY, aRadius,
                                  aStartAngle, aEndAngle, aClockwise) {
    aRadius *= Z;
    var arcType = aClockwise ? 'at' : 'wa';

    var xStart = aX + mc(aStartAngle) * aRadius - Z2;
    var yStart = aY + ms(aStartAngle) * aRadius - Z2;

    var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
    var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

    // IE won't render arches drawn counter clockwise if xStart == xEnd.
    if (xStart == xEnd && !aClockwise) {
      xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                       // that can be represented in binary
    }

    var p = getCoords(this, aX, aY);
    var pStart = getCoords(this, xStart, yStart);
    var pEnd = getCoords(this, xEnd, yEnd);

    this.currentPath_.push({type: arcType,
                           x: p.x,
                           y: p.y,
                           radius: aRadius,
                           xStart: pStart.x,
                           yStart: pStart.y,
                           xEnd: pEnd.x,
                           yEnd: pEnd.y});

  };

  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
  };

  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.stroke();

    this.currentPath_ = oldPath;
  };

  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.fill();

    this.currentPath_ = oldPath;
  };

  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
    var gradient = new CanvasGradient_('gradient');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    return gradient;
  };

  contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
                                                   aX1, aY1, aR1) {
    var gradient = new CanvasGradient_('gradientradial');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.r0_ = aR0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    gradient.r1_ = aR1;
    return gradient;
  };

  contextPrototype.drawImage = function(image, var_args) {
    var dx, dy, dw, dh, sx, sy, sw, sh;

    // to find the original width we overide the width and height
    var oldRuntimeWidth = image.runtimeStyle.width;
    var oldRuntimeHeight = image.runtimeStyle.height;
    image.runtimeStyle.width = 'auto';
    image.runtimeStyle.height = 'auto';

    // get the original size
    var w = image.width;
    var h = image.height;

    // and remove overides
    image.runtimeStyle.width = oldRuntimeWidth;
    image.runtimeStyle.height = oldRuntimeHeight;

    if (arguments.length == 3) {
      dx = arguments[1];
      dy = arguments[2];
      sx = sy = 0;
      sw = dw = w;
      sh = dh = h;
    } else if (arguments.length == 5) {
      dx = arguments[1];
      dy = arguments[2];
      dw = arguments[3];
      dh = arguments[4];
      sx = sy = 0;
      sw = w;
      sh = h;
    } else if (arguments.length == 9) {
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else {
      throw Error('Invalid number of arguments');
    }

    var d = getCoords(this, dx, dy);

    var w2 = sw / 2;
    var h2 = sh / 2;

    var vmlStr = [];

    var W = 10;
    var H = 10;

    // For some reason that I've now forgotten, using divs didn't work
    vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

    // If filters are necessary (rotation exists), create them
    // filters are bog-slow, so only create them if abbsolutely necessary
    // The following check doesn't account for skews (which don't exist
    // in the canvas spec (yet) anyway.

    if (this.m_[0][0] != 1 || this.m_[0][1] ||
        this.m_[1][1] != 1 || this.m_[1][0]) {
      var filter = [];

      // Note the 12/21 reversal
      filter.push('M11=', this.m_[0][0], ',',
                  'M12=', this.m_[1][0], ',',
                  'M21=', this.m_[0][1], ',',
                  'M22=', this.m_[1][1], ',',
                  'Dx=', mr(d.x / Z), ',',
                  'Dy=', mr(d.y / Z), '');

      // Bounding box calculation (need to minimize displayed area so that
      // filters don't waste time on unused pixels.
      var max = d;
      var c2 = getCoords(this, dx + dw, dy);
      var c3 = getCoords(this, dx, dy + dh);
      var c4 = getCoords(this, dx + dw, dy + dh);

      max.x = m.max(max.x, c2.x, c3.x, c4.x);
      max.y = m.max(max.y, c2.y, c3.y, c4.y);

      vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
                  'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
                  filter.join(''), ", sizingmethod='clip');");

    } else {
      vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
    }

    vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, 'px;',
                ' height:', Z * dh, 'px"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

    this.element_.insertAdjacentHTML('BeforeEnd', vmlStr.join(''));
  };

  contextPrototype.stroke = function(aFill) {
    var lineStr = [];
    var lineOpen = false;

    var W = 10;
    var H = 10;

    lineStr.push('<g_vml_:shape',
                 ' filled="', !!aFill, '"',
                 ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
                 ' coordorigin="0,0"',
                 ' coordsize="', Z * W, ',', Z * H, '"',
                 ' stroked="', !aFill, '"',
                 ' path="');

    var newSeq = false;
    var min = {x: null, y: null};
    var max = {x: null, y: null};

    for (var i = 0; i < this.currentPath_.length; i++) {
      var p = this.currentPath_[i];
      var c;

      switch (p.type) {
        case 'moveTo':
          c = p;
          lineStr.push(' m ', mr(p.x), ',', mr(p.y));
          break;
        case 'lineTo':
          lineStr.push(' l ', mr(p.x), ',', mr(p.y));
          break;
        case 'close':
          lineStr.push(' x ');
          p = null;
          break;
        case 'bezierCurveTo':
          lineStr.push(' c ',
                       mr(p.cp1x), ',', mr(p.cp1y), ',',
                       mr(p.cp2x), ',', mr(p.cp2y), ',',
                       mr(p.x), ',', mr(p.y));
          break;
        case 'at':
        case 'wa':
          lineStr.push(' ', p.type, ' ',
                       mr(p.x - this.arcScaleX_ * p.radius), ',',
                       mr(p.y - this.arcScaleY_ * p.radius), ' ',
                       mr(p.x + this.arcScaleX_ * p.radius), ',',
                       mr(p.y + this.arcScaleY_ * p.radius), ' ',
                       mr(p.xStart), ',', mr(p.yStart), ' ',
                       mr(p.xEnd), ',', mr(p.yEnd));
          break;
      }


      // TODO: Following is broken for curves due to
      //       move to proper paths.

      // Figure out dimensions so we can do gradient fills
      // properly
      if (p) {
        if (min.x == null || p.x < min.x) {
          min.x = p.x;
        }
        if (max.x == null || p.x > max.x) {
          max.x = p.x;
        }
        if (min.y == null || p.y < min.y) {
          min.y = p.y;
        }
        if (max.y == null || p.y > max.y) {
          max.y = p.y;
        }
      }
    }
    lineStr.push(' ">');

    if (!aFill) {
      appendStroke(this, lineStr);
    } else {
      appendFill(this, lineStr, min, max);
    }

    lineStr.push('</g_vml_:shape>');

    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
  };

  function appendStroke(ctx, lineStr) {
    var a = processStyle(ctx.strokeStyle);
    var color = a.color;
    var opacity = a.alpha * ctx.globalAlpha;
    var lineWidth = ctx.lineScale_ * ctx.lineWidth;

    // VML cannot correctly render a line if the width is less than 1px.
    // In that case, we dilute the color to make the line look thinner.
    if (lineWidth < 1) {
      opacity *= lineWidth;
    }

    lineStr.push(
      '<g_vml_:stroke',
      ' opacity="', opacity, '"',
      ' joinstyle="', ctx.lineJoin, '"',
      ' miterlimit="', ctx.miterLimit, '"',
      ' endcap="', processLineCap(ctx.lineCap), '"',
      ' weight="', lineWidth, 'px"',
      ' color="', color, '" />'
    );
  }

  function appendFill(ctx, lineStr, min, max) {
    var fillStyle = ctx.fillStyle;
    var arcScaleX = ctx.arcScaleX_;
    var arcScaleY = ctx.arcScaleY_;
    var width = max.x - min.x;
    var height = max.y - min.y;
    if (fillStyle instanceof CanvasGradient_) {
      // TODO: Gradients transformed with the transformation matrix.
      var angle = 0;
      var focus = {x: 0, y: 0};

      // additional offset
      var shift = 0;
      // scale factor for offset
      var expansion = 1;

      if (fillStyle.type_ == 'gradient') {
        var x0 = fillStyle.x0_ / arcScaleX;
        var y0 = fillStyle.y0_ / arcScaleY;
        var x1 = fillStyle.x1_ / arcScaleX;
        var y1 = fillStyle.y1_ / arcScaleY;
        var p0 = getCoords(ctx, x0, y0);
        var p1 = getCoords(ctx, x1, y1);
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        angle = Math.atan2(dx, dy) * 180 / Math.PI;

        // The angle should be a non-negative number.
        if (angle < 0) {
          angle += 360;
        }

        // Very small angles produce an unexpected result because they are
        // converted to a scientific notation string.
        if (angle < 1e-6) {
          angle = 0;
        }
      } else {
        var p0 = getCoords(ctx, fillStyle.x0_, fillStyle.y0_);
        focus = {
          x: (p0.x - min.x) / width,
          y: (p0.y - min.y) / height
        };

        width  /= arcScaleX * Z;
        height /= arcScaleY * Z;
        var dimension = m.max(width, height);
        shift = 2 * fillStyle.r0_ / dimension;
        expansion = 2 * fillStyle.r1_ / dimension - shift;
      }

      // We need to sort the color stops in ascending order by offset,
      // otherwise IE won't interpret it correctly.
      var stops = fillStyle.colors_;
      stops.sort(function(cs1, cs2) {
        return cs1.offset - cs2.offset;
      });

      var length = stops.length;
      var color1 = stops[0].color;
      var color2 = stops[length - 1].color;
      var opacity1 = stops[0].alpha * ctx.globalAlpha;
      var opacity2 = stops[length - 1].alpha * ctx.globalAlpha;

      var colors = [];
      for (var i = 0; i < length; i++) {
        var stop = stops[i];
        colors.push(stop.offset * expansion + shift + ' ' + stop.color);
      }

      // When colors attribute is used, the meanings of opacity and o:opacity2
      // are reversed.
      lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
                   ' method="none" focus="100%"',
                   ' color="', color1, '"',
                   ' color2="', color2, '"',
                   ' colors="', colors.join(','), '"',
                   ' opacity="', opacity2, '"',
                   ' g_o_:opacity2="', opacity1, '"',
                   ' angle="', angle, '"',
                   ' focusposition="', focus.x, ',', focus.y, '" />');
    } else if (fillStyle instanceof CanvasPattern_) {
      if (width && height) {
        var deltaLeft = -min.x;
        var deltaTop = -min.y;
        lineStr.push('<g_vml_:fill',
                     ' position="',
                     deltaLeft / width * arcScaleX * arcScaleX, ',',
                     deltaTop / height * arcScaleY * arcScaleY, '"',
                     ' type="tile"',
                     // TODO: Figure out the correct size to fit the scale.
                     //' size="', w, 'px ', h, 'px"',
                     ' src="', fillStyle.src_, '" />');
       }
    } else {
      var a = processStyle(ctx.fillStyle);
      var color = a.color;
      var opacity = a.alpha * ctx.globalAlpha;
      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
                   '" />');
    }
  }

  contextPrototype.fill = function() {
    this.stroke(true);
  };

  contextPrototype.closePath = function() {
    this.currentPath_.push({type: 'close'});
  };

  function getCoords(ctx, aX, aY) {
    var m = ctx.m_;
    return {
      x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
      y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
    };
  };

  contextPrototype.save = function() {
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  contextPrototype.restore = function() {
    if (this.aStack_.length) {
      copyState(this.aStack_.pop(), this);
      this.m_ = this.mStack_.pop();
    }
  };

  function matrixIsFinite(m) {
    return isFinite(m[0][0]) && isFinite(m[0][1]) &&
        isFinite(m[1][0]) && isFinite(m[1][1]) &&
        isFinite(m[2][0]) && isFinite(m[2][1]);
  }

  function setM(ctx, m, updateLineScale) {
    if (!matrixIsFinite(m)) {
      return;
    }
    ctx.m_ = m;

    if (updateLineScale) {
      // Get the line scale.
      // Determinant of this.m_ means how much the area is enlarged by the
      // transformation. So its square root can be used as a scale factor
      // for width.
      var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      ctx.lineScale_ = sqrt(abs(det));
    }
  }

  contextPrototype.translate = function(aX, aY) {
    var m1 = [
      [1,  0,  0],
      [0,  1,  0],
      [aX, aY, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.rotate = function(aRot) {
    var c = mc(aRot);
    var s = ms(aRot);

    var m1 = [
      [c,  s, 0],
      [-s, c, 0],
      [0,  0, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.scale = function(aX, aY) {
    this.arcScaleX_ *= aX;
    this.arcScaleY_ *= aY;
    var m1 = [
      [aX, 0,  0],
      [0,  aY, 0],
      [0,  0,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
    var m1 = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
    var m = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, m, true);
  };

  /**
   * The text drawing function.
   * The maxWidth argument isn't taken in account, since no browser supports
   * it yet.
   */
  contextPrototype.drawText_ = function(text, x, y, maxWidth, stroke) {
    var m = this.m_,
        delta = 1000,
        left = 0,
        right = delta,
        offset = {x: 0, y: 0},
        lineStr = [];

    var fontStyle = getComputedStyle(processFontStyle(this.font),
                                     this.element_);

    var fontStyleString = buildStyle(fontStyle);

    var elementStyle = this.element_.currentStyle;
    var textAlign = this.textAlign.toLowerCase();
    switch (textAlign) {
      case 'left':
      case 'center':
      case 'right':
        break;
      case 'end':
        textAlign = elementStyle.direction == 'ltr' ? 'right' : 'left';
        break;
      case 'start':
        textAlign = elementStyle.direction == 'rtl' ? 'right' : 'left';
        break;
      default:
        textAlign = 'left';
    }

    // 1.75 is an arbitrary number, as there is no info about the text baseline
    switch (this.textBaseline) {
      case 'hanging':
      case 'top':
        offset.y = fontStyle.size / 1.75;
        break;
      case 'middle':
        break;
      default:
      case null:
      case 'alphabetic':
      case 'ideographic':
      case 'bottom':
        offset.y = -fontStyle.size / 2.25;
        break;
    }

    switch(textAlign) {
      case 'right':
        left = delta;
        right = 0.05;
        break;
      case 'center':
        left = right = delta / 2;
        break;
    }

    var d = getCoords(this, x + offset.x, y + offset.y);

    lineStr.push('<g_vml_:line from="', -left ,' 0" to="', right ,' 0.05" ',
                 ' coordsize="100 100" coordorigin="0 0"',
                 ' filled="', !stroke, '" stroked="', !!stroke,
                 '" style="position:absolute;width:1px;height:1px;">');

    if (stroke) {
      appendStroke(this, lineStr);
    } else {
      // TODO: Fix the min and max params.
      appendFill(this, lineStr, {x: -left, y: 0},
                 {x: right, y: fontStyle.size});
    }

    var skewM = m[0][0].toFixed(3) + ',' + m[1][0].toFixed(3) + ',' +
                m[0][1].toFixed(3) + ',' + m[1][1].toFixed(3) + ',0,0';

    var skewOffset = mr(d.x / Z) + ',' + mr(d.y / Z);

    lineStr.push('<g_vml_:skew on="t" matrix="', skewM ,'" ',
                 ' offset="', skewOffset, '" origin="', left ,' 0" />',
                 '<g_vml_:path textpathok="true" />',
                 '<g_vml_:textpath on="true" string="',
                 encodeHtmlAttribute(text),
                 '" style="v-text-align:', textAlign,
                 ';font:', encodeHtmlAttribute(fontStyleString),
                 '" /></g_vml_:line>');

    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
  };

  contextPrototype.fillText = function(text, x, y, maxWidth) {
    this.drawText_(text, x, y, maxWidth, false);
  };

  contextPrototype.strokeText = function(text, x, y, maxWidth) {
    this.drawText_(text, x, y, maxWidth, true);
  };

  contextPrototype.measureText = function(text) {
    if (!this.textMeasureEl_) {
      var s = '<span style="position:absolute;' +
          'top:-20000px;left:0;padding:0;margin:0;border:none;' +
          'white-space:pre;"></span>';
      this.element_.insertAdjacentHTML('beforeEnd', s);
      this.textMeasureEl_ = this.element_.lastChild;
    }
    var doc = this.element_.ownerDocument;
    this.textMeasureEl_.innerHTML = '';
    this.textMeasureEl_.style.font = this.font;
    // Don't use innerHTML or innerText because they allow markup/whitespace.
    this.textMeasureEl_.appendChild(doc.createTextNode(text));
    return {width: this.textMeasureEl_.offsetWidth};
  };

  /******** STUBS ********/
  contextPrototype.clip = function() {
    // TODO: Implement
  };

  contextPrototype.arcTo = function() {
    // TODO: Implement
  };

  contextPrototype.createPattern = function(image, repetition) {
    return new CanvasPattern_(image, repetition);
  };

  // Gradient / Pattern Stubs
  function CanvasGradient_(aType) {
    this.type_ = aType;
    this.x0_ = 0;
    this.y0_ = 0;
    this.r0_ = 0;
    this.x1_ = 0;
    this.y1_ = 0;
    this.r1_ = 0;
    this.colors_ = [];
  }

  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
    aColor = processStyle(aColor);
    this.colors_.push({offset: aOffset,
                       color: aColor.color,
                       alpha: aColor.alpha});
  };

  function CanvasPattern_(image, repetition) {
    assertImageIsValid(image);
    switch (repetition) {
      case 'repeat':
      case null:
      case '':
        this.repetition_ = 'repeat';
        break;
      case 'repeat-x':
      case 'repeat-y':
      case 'no-repeat':
        this.repetition_ = repetition;
        break;
      default:
        throwException('SYNTAX_ERR');
    }

    this.src_ = image.src;
    this.width_ = image.width;
    this.height_ = image.height;
  }

  function throwException(s) {
    throw new DOMException_(s);
  }

  function assertImageIsValid(img) {
    if (!img || img.nodeType != 1 || img.tagName != 'IMG') {
      throwException('TYPE_MISMATCH_ERR');
    }
    if (img.readyState != 'complete') {
      throwException('INVALID_STATE_ERR');
    }
  }

  function DOMException_(s) {
    this.code = this[s];
    this.message = s +': DOM Exception ' + this.code;
  }
  var p = DOMException_.prototype = new Error;
  p.INDEX_SIZE_ERR = 1;
  p.DOMSTRING_SIZE_ERR = 2;
  p.HIERARCHY_REQUEST_ERR = 3;
  p.WRONG_DOCUMENT_ERR = 4;
  p.INVALID_CHARACTER_ERR = 5;
  p.NO_DATA_ALLOWED_ERR = 6;
  p.NO_MODIFICATION_ALLOWED_ERR = 7;
  p.NOT_FOUND_ERR = 8;
  p.NOT_SUPPORTED_ERR = 9;
  p.INUSE_ATTRIBUTE_ERR = 10;
  p.INVALID_STATE_ERR = 11;
  p.SYNTAX_ERR = 12;
  p.INVALID_MODIFICATION_ERR = 13;
  p.NAMESPACE_ERR = 14;
  p.INVALID_ACCESS_ERR = 15;
  p.VALIDATION_ERR = 16;
  p.TYPE_MISMATCH_ERR = 17;

  // set up externs
  G_vmlCanvasManager = G_vmlCanvasManager_;
  CanvasRenderingContext2D = CanvasRenderingContext2D_;
  CanvasGradient = CanvasGradient_;
  CanvasPattern = CanvasPattern_;
  DOMException = DOMException_;
})();

} // if

//next
//$.jqplot.CategoryAxisRenderer
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {   
    /**
    *  class: $.jqplot.CategoryAxisRenderer
    *  A plugin for jqPlot to render a category style axis, with equal pixel spacing between y data values of a series.
    *  
    *  To use this renderer, include the plugin in your source
    *  > <script type="text/javascript" language="javascript" src="plugins/jqplot.categoryAxisRenderer.js"></script>
    *  
    *  and supply the appropriate options to your plot
    *  
    *  > {axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer}}}
    **/
    $.jqplot.CategoryAxisRenderer = function(options) {
        $.jqplot.LinearAxisRenderer.call(this);
        // prop: sortMergedLabels
        // True to sort tick labels when labels are created by merging
        // x axis values from multiple series.  That is, say you have
        // two series like:
        // > line1 = [[2006, 4],            [2008, 9], [2009, 16]];
        // > line2 = [[2006, 3], [2007, 7], [2008, 6]];
        // If no label array is specified, tick labels will be collected
        // from the x values of the series.  With sortMergedLabels
        // set to true, tick labels will be:
        // > [2006, 2007, 2008, 2009]
        // With sortMergedLabels set to false, tick labels will be:
        // > [2006, 2008, 2009, 2007]
        //
        // Note, this property is specified on the renderOptions for the 
        // axes when creating a plot:
        // > axes:{xaxis:{renderer:$.jqplot.CategoryAxisRenderer, rendererOptions:{sortMergedLabels:true}}}
        this.sortMergedLabels = false;
    };
    
    $.jqplot.CategoryAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.CategoryAxisRenderer.prototype.constructor = $.jqplot.CategoryAxisRenderer;
    
    $.jqplot.CategoryAxisRenderer.prototype.init = function(options){
        this.groups = 1;
        this.groupLabels = [];
        this._groupLabels = [];
        this._grouped = false;
        this._barsPerGroup = null;
        this.reverse = false;
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        // this.tickRenderer = $.jqplot.AxisTickRenderer;
        // this.labelRenderer = $.jqplot.AxisLabelRenderer;
        $.extend(true, this, {tickOptions:{formatString:'%d'}}, options);
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            if (s.groups) {
                this.groups = s.groups;
            }
            var d = s.data;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    if (d[j][0] < db.min || db.min == null) {
                        db.min = d[j][0];
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                    }
                }              
                else {
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                    }
                }              
            }
        }
        
        if (this.groupLabels.length) {
            this.groups = this.groupLabels.length;
        }
    };
 

    $.jqplot.CategoryAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;

        // if we already have ticks, use them.
        if (userTicks.length) {
            // adjust with blanks if we have groups
            if (this.groups > 1 && !this._grouped) {
                var l = userTicks.length;
                var skip = parseInt(l/this.groups, 10);
                var count = 0;
                for (var i=skip; i<l; i+=skip) {
                    userTicks.splice(i+count, 0, ' ');
                    count++;
                }
                this._grouped = true;
            }
            this.min = 0.5;
            this.max = userTicks.length + 0.5;
            var range = this.max - this.min;
            this.numberTicks = 2*userTicks.length + 1;
            for (i=0; i<userTicks.length; i++){
                tt = this.min + 2 * i * range / (this.numberTicks-1);
                // need a marker before and after the tick
                var t = new this.tickRenderer(this.tickOptions);
                t.showLabel = false;
                // t.showMark = true;
                t.setTick(tt, this.name);
                this._ticks.push(t);
                var t = new this.tickRenderer(this.tickOptions);
                t.label = userTicks[i];
                // t.showLabel = true;
                t.showMark = false;
                t.showGridline = false;
                t.setTick(tt+0.5, this.name);
                this._ticks.push(t);
            }
            // now add the last tick at the end
            var t = new this.tickRenderer(this.tickOptions);
            t.showLabel = false;
            // t.showMark = true;
            t.setTick(tt+1, this.name);
            this._ticks.push(t);
        }

        // we don't have any ticks yet, let's make some!
        else {
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
            
            // if max, min, and interval specified and interval won't fit, ignore interval.
            if (this.min != null && this.max != null && this.tickInterval != null) {
                if (parseInt((this.max-this.min)/this.tickInterval, 10) != (this.max-this.min)/this.tickInterval) {
                    this.tickInterval = null;
                }
            }
        
            // find out how many categories are in the lines and collect labels
            var labels = [];
            var numcats = 0;
            var min = 0.5;
            var max, val;
            var isMerged = false;
            for (var i=0; i<this._series.length; i++) {
                var s = this._series[i];
                for (var j=0; j<s.data.length; j++) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        val = s.data[j][0];
                    }
                    else {
                        val = s.data[j][1];
                    }
                    if ($.inArray(val, labels) == -1) {
                        isMerged = true;
                        numcats += 1;      
                        labels.push(val);
                    }
                }
            }
            
            if (isMerged && this.sortMergedLabels) {
                if (typeof labels[0] == "string") {
                    labels.sort();
                } else {
                    labels.sort(function(a,b) { return a - b; });
                }
            }
            
            // keep a reference to these tick labels to use for redrawing plot (see bug #57)
            this.ticks = labels;
            
            // now bin the data values to the right lables.
            for (var i=0; i<this._series.length; i++) {
                var s = this._series[i];
                for (var j=0; j<s.data.length; j++) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        val = s.data[j][0];
                    }
                    else {
                        val = s.data[j][1];
                    }
                    // for category axis, force the values into category bins.
                    // we should have the value in the label array now.
                    var idx = $.inArray(val, labels)+1;
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        s.data[j][0] = idx;
                    }
                    else {
                        s.data[j][1] = idx;
                    }
                }
            }
            
            // adjust with blanks if we have groups
            if (this.groups > 1 && !this._grouped) {
                var l = labels.length;
                var skip = parseInt(l/this.groups, 10);
                var count = 0;
                for (var i=skip; i<l; i+=skip+1) {
                    labels[i] = ' ';
                }
                this._grouped = true;
            }
        
            max = numcats + 0.5;
            if (this.numberTicks == null) {
                this.numberTicks = 2*numcats + 1;
            }

            var range = max - min;
            this.min = min;
            this.max = max;
            var track = 0;
            
            // todo: adjust this so more ticks displayed.
            var maxVisibleTicks = parseInt(3+dim/10, 10);
            var skip = parseInt(numcats/maxVisibleTicks, 10);

            if (this.tickInterval == null) {

                this.tickInterval = range / (this.numberTicks-1);

            }
            // if tickInterval is specified, we will ignore any computed maximum.
            for (var i=0; i<this.numberTicks; i++){
                tt = this.min + i * this.tickInterval;
                var t = new this.tickRenderer(this.tickOptions);
                // if even tick, it isn't a category, it's a divider
                if (i/2 == parseInt(i/2, 10)) {
                    t.showLabel = false;
                    t.showMark = true;
                }
                else {
                    if (skip>0 && track<skip) {
                        t.showLabel = false;
                        track += 1;
                    }
                    else {
                        t.showLabel = true;
                        track = 0;
                    } 
                    t.label = t.formatter(t.formatString, labels[(i-1)/2]);
                    t.showMark = false;
                    t.showGridline = false;
                }
                t.setTick(tt, this.name);
                this._ticks.push(t);
            }
        }
        
    };
    
    // called with scope of axis
    $.jqplot.CategoryAxisRenderer.prototype.draw = function(ctx, plot) {
        if (this.show) {
            // populate the axis label and value properties.
            // createTicks is a method on the renderer, but
            // call it within the scope of the axis.
            this.renderer.createTicks.call(this);
            // fill a div with axes labels in the right direction.
            // Need to pregenerate each axis to get its bounds and
            // position it and the labels correctly on the plot.
            var dim=0;
            var temp;
            // Added for theming.
            if (this._elem) {
                // this._elem.empty();
                // Memory Leaks patch
                this._elem.emptyForce();
            }

            this._elem = this._elem || $('<div class="jqplot-axis jqplot-'+this.name+'" style="position:absolute;"></div>');
            
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                this._elem.width(this._plotDimensions.width);
            }
            else {
                this._elem.height(this._plotDimensions.height);
            }
            
            // create a _label object.
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                var elem = this._label.draw(ctx, plot);
                elem.appendTo(this._elem);
            }
    
            var t = this._ticks;
            for (var i=0; i<t.length; i++) {
                var tick = t[i];
                if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    var elem = tick.draw(ctx, plot);
                    elem.appendTo(this._elem);
                }
            }
        
            this._groupLabels = [];
            // now make group labels
            for (var i=0; i<this.groupLabels.length; i++)
            {
                var elem = $('<div style="position:absolute;" class="jqplot-'+this.name+'-groupLabel"></div>');
                elem.html(this.groupLabels[i]);
                this._groupLabels.push(elem);
                elem.appendTo(this._elem);
            }
        }
        return this._elem;
    };
    
    // called with scope of axis
    $.jqplot.CategoryAxisRenderer.prototype.set = function() { 
        var dim = 0;
        var temp;
        var w = 0;
        var h = 0;
        var lshow = (this._label == null) ? false : this._label.show;
        if (this.show) {
            var t = this._ticks;
            for (var i=0; i<t.length; i++) {
                var tick = t[i];
                if (tick.showLabel && (!tick.isMinorTick || this.showMinorTicks)) {
                    if (this.name == 'xaxis' || this.name == 'x2axis') {
                        temp = tick._elem.outerHeight(true);
                    }
                    else {
                        temp = tick._elem.outerWidth(true);
                    }
                    if (temp > dim) {
                        dim = temp;
                    }
                }
            }
            
            var dim2 = 0;
            for (var i=0; i<this._groupLabels.length; i++) {
                var l = this._groupLabels[i];
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    temp = l.outerHeight(true);
                }
                else {
                    temp = l.outerWidth(true);
                }
                if (temp > dim2) {
                    dim2 = temp;
                }
            }
            
            if (lshow) {
                w = this._label._elem.outerWidth(true);
                h = this._label._elem.outerHeight(true); 
            }
            if (this.name == 'xaxis') {
                dim += dim2 + h;
                this._elem.css({'height':dim+'px', left:'0px', bottom:'0px'});
            }
            else if (this.name == 'x2axis') {
                dim += dim2 + h;
                this._elem.css({'height':dim+'px', left:'0px', top:'0px'});
            }
            else if (this.name == 'yaxis') {
                dim += dim2 + w;
                this._elem.css({'width':dim+'px', left:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
            else {
                dim += dim2 + w;
                this._elem.css({'width':dim+'px', right:'0px', top:'0px'});
                if (lshow && this._label.constructor == $.jqplot.AxisLabelRenderer) {
                    this._label._elem.css('width', w+'px');
                }
            }
        }  
    };
    
    // called with scope of axis
    $.jqplot.CategoryAxisRenderer.prototype.pack = function(pos, offsets) {
        var ticks = this._ticks;
        var max = this.max;
        var min = this.min;
        var offmax = offsets.max;
        var offmin = offsets.min;
        var lshow = (this._label == null) ? false : this._label.show;
        var i;

        for (var p in pos) {
            this._elem.css(p, pos[p]);
        }
        
        this._offsets = offsets;
        // pixellength will be + for x axes and - for y axes becasue pixels always measured from top left.
        var pixellength = offmax - offmin;
        var unitlength = max - min;
        
        if (!this.reverse) {
            // point to unit and unit to point conversions references to Plot DOM element top left corner.
            
            this.u2p = function(u){
                return (u - min) * pixellength / unitlength + offmin;
            };

            this.p2u = function(p){
                return (p - offmin) * unitlength / pixellength + min;
            };
                    
            if (this.name == 'xaxis' || this.name == 'x2axis'){
                this.series_u2p = function(u){
                    return (u - min) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + min;
                };
            }
            
            else {
                this.series_u2p = function(u){
                    return (u - max) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + max;
                };
            }
        }

        else {
            // point to unit and unit to point conversions references to Plot DOM element top left corner.
            
            this.u2p = function(u){
                return offmin + (max - u) * pixellength / unitlength;
            };

            this.p2u = function(p){
                return min + (p - offmin) * unitlength / pixellength;
            };
                    
            if (this.name == 'xaxis' || this.name == 'x2axis'){
                this.series_u2p = function(u){
                    return (max - u) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + max;
                };
            }
            
            else {
                this.series_u2p = function(u){
                    return (min - u) * pixellength / unitlength;
                };
                this.series_p2u = function(p){
                    return p * unitlength / pixellength + min;
                };
            }

        }
            
        
        if (this.show) {
            if (this.name == 'xaxis' || this.name == 'x2axis') {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {
                        var shim;
                        
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'xaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                    if (temp * t.angle < 0) {
                                        shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    }
                                    // position at start
                                    else {
                                        shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'end':
                                    shim = -t.getWidth() + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                case 'start':
                                    shim = -t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    break;
                                case 'middle':
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                                default:
                                    shim = -t.getWidth()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getWidth()/2;
                        }
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('left', val);
                        t.pack();
                    }
                }
                
                var labeledge=['bottom', 0];
                if (lshow) {
                    var w = this._label._elem.outerWidth(true);
                    this._label._elem.css('left', offmin + pixellength/2 - w/2 + 'px');
                    if (this.name == 'xaxis') {
                        this._label._elem.css('bottom', '0px');
                        labeledge = ['bottom', this._label._elem.outerHeight(true)];
                    }
                    else {
                        this._label._elem.css('top', '0px');
                        labeledge = ['top', this._label._elem.outerHeight(true)];
                    }
                    this._label.pack();
                }
                
                // draw the group labels
                var step = parseInt(this._ticks.length/this.groups, 10) + 1;
                for (i=0; i<this._groupLabels.length; i++) {
                    var mid = 0;
                    var count = 0;
                    for (var j=i*step; j<(i+1)*step; j++) {
                        if (j >= this._ticks.length-1) continue; // the last tick does not exist as there is no other group in order to have an empty one.
                        if (this._ticks[j]._elem && this._ticks[j].label != " ") {
                            var t = this._ticks[j]._elem;
                            var p = t.position();
                            mid += p.left + t.outerWidth(true)/2;
                            count++;
                        }
                    }
                    mid = mid/count;
                    this._groupLabels[i].css({'left':(mid - this._groupLabels[i].outerWidth(true)/2)});
                    this._groupLabels[i].css(labeledge[0], labeledge[1]);
                }
            }
            else {
                for (i=0; i<ticks.length; i++) {
                    var t = ticks[i];
                    if (t.show && t.showLabel) {                        
                        var shim;
                        if (t.constructor == $.jqplot.CanvasAxisTickRenderer && t.angle) {
                            // will need to adjust auto positioning based on which axis this is.
                            var temp = (this.name == 'yaxis') ? 1 : -1;
                            switch (t.labelPosition) {
                                case 'auto':
                                    // position at end
                                case 'end':
                                    if (temp * t.angle < 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'start':
                                    if (t.angle > 0) {
                                        shim = -t._textRenderer.height * Math.cos(-t._textRenderer.angle) / 2;
                                    }
                                    else {
                                        shim = -t.getHeight() + t._textRenderer.height * Math.cos(t._textRenderer.angle) / 2;
                                    }
                                    break;
                                case 'middle':
                                    // if (t.angle > 0) {
                                    //     shim = -t.getHeight()/2 + t._textRenderer.height * Math.sin(-t._textRenderer.angle) / 2;
                                    // }
                                    // else {
                                    //     shim = -t.getHeight()/2 - t._textRenderer.height * Math.sin(t._textRenderer.angle) / 2;
                                    // }
                                    shim = -t.getHeight()/2;
                                    break;
                                default:
                                    shim = -t.getHeight()/2;
                                    break;
                            }
                        }
                        else {
                            shim = -t.getHeight()/2;
                        }
                        
                        var val = this.u2p(t.value) + shim + 'px';
                        t._elem.css('top', val);
                        t.pack();
                    }
                }
                
                var labeledge=['left', 0];
                if (lshow) {
                    var h = this._label._elem.outerHeight(true);
                    this._label._elem.css('top', offmax - pixellength/2 - h/2 + 'px');
                    if (this.name == 'yaxis') {
                        this._label._elem.css('left', '0px');
                        labeledge = ['left', this._label._elem.outerWidth(true)];
                    }
                    else {
                        this._label._elem.css('right', '0px');
                        labeledge = ['right', this._label._elem.outerWidth(true)];
                    }   
                    this._label.pack();
                }
                
                // draw the group labels, position top here, do left after label position.
                var step = parseInt(this._ticks.length/this.groups, 10) + 1; // step is one more than before as we don't want to have overlaps in loops
                for (i=0; i<this._groupLabels.length; i++) {
                    var mid = 0;
                    var count = 0;
                    for (var j=i*step; j<(i+1)*step; j++) { // j must never reach (i+1)*step as we don't want to have overlap between loops
                        if (j >= this._ticks.length-1) continue; // the last tick does not exist as there is no other group in order to have an empty one.
                        if (this._ticks[j]._elem && this._ticks[j].label != " ") {
                            var t = this._ticks[j]._elem;
                            var p = t.position();
                            mid += p.top + t.outerHeight()/2;
                            count++;
                        }
                    }
                    mid = mid/count;
                    this._groupLabels[i].css({'top':mid - this._groupLabels[i].outerHeight()/2});
                    this._groupLabels[i].css(labeledge[0], labeledge[1]);
                    
                }
            }
        }
    };    
    
    
})(jQuery);

//next
//$.jqplot.CanvasTextRenderer 

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 *
 * included jsDate library by Chris Leonello:
 *
 * Copyright (c) 2010-2013 Chris Leonello
 *
 * jsDate is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly.
 *
 * jsDate borrows many concepts and ideas from the Date Instance 
 * Methods by Ken Snyder along with some parts of Ken's actual code.
 * 
 * Ken's original Date Instance Methods and copyright notice:
 * 
 * Ken Snyder (ken d snyder at gmail dot com)
 * 2008-09-10
 * version 2.0.2 (http://kendsnyder.com/sandbox/date/)     
 * Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 *
 * jqplotToImage function based on Larry Siden's export-jqplot-to-png.js.
 * Larry has generously given permission to adapt his code for inclusion
 * into jqPlot.
 *
 * Larry's original code can be found here:
 *
 * https://github.com/lsiden/export-jqplot-to-png
 * 
 * 
 */

(function($) {    
    // This code is a modified version of the canvastext.js code, copyright below:
    //
    // This code is released to the public domain by Jim Studt, 2007.
    // He may keep some sort of up to date copy at http://www.federated.com/~jim/canvastext/
    //
    $.jqplot.CanvasTextRenderer = function(options){
        this.fontStyle = 'normal';  // normal, italic, oblique [not implemented]
        this.fontVariant = 'normal';    // normal, small caps [not implemented]
        this.fontWeight = 'normal'; // normal, bold, bolder, lighter, 100 - 900
        this.fontSize = '10px'; 
        this.fontFamily = 'sans-serif';
        this.fontStretch = 1.0;
        this.fillStyle = '#666666';
        this.angle = 0;
        this.textAlign = 'start';
        this.textBaseline = 'alphabetic';
        this.text;
        this.width;
        this.height;
        this.pt2px = 1.28;

        $.extend(true, this, options);
        this.normalizedFontSize = this.normalizeFontSize(this.fontSize);
        this.setHeight();
    };
    
    $.jqplot.CanvasTextRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this.normalizedFontSize = this.normalizeFontSize(this.fontSize);
        this.setHeight();
    };
    
    // convert css spec into point size
    // returns float
    $.jqplot.CanvasTextRenderer.prototype.normalizeFontSize = function(sz) {
        sz = String(sz);
        var n = parseFloat(sz);
        if (sz.indexOf('px') > -1) {
            return n/this.pt2px;
        }
        else if (sz.indexOf('pt') > -1) {
            return n;
        }
        else if (sz.indexOf('em') > -1) {
            return n*12;
        }
        else if (sz.indexOf('%') > -1) {
            return n*12/100;
        }
        // default to pixels;
        else {
            return n/this.pt2px;
        }
    };
    
    
    $.jqplot.CanvasTextRenderer.prototype.fontWeight2Float = function(w) {
        // w = normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
        // return values adjusted for Hershey font.
        if (Number(w)) {
            return w/400;
        }
        else {
            switch (w) {
                case 'normal':
                    return 1;
                    break;
                case 'bold':
                    return 1.75;
                    break;
                case 'bolder':
                    return 2.25;
                    break;
                case 'lighter':
                    return 0.75;
                    break;
                default:
                    return 1;
                    break;
             }   
        }
    };
    
    $.jqplot.CanvasTextRenderer.prototype.getText = function() {
        return this.text;
    };
    
    $.jqplot.CanvasTextRenderer.prototype.setText = function(t, ctx) {
        this.text = t;
        this.setWidth(ctx);
        return this;
    };
    
    $.jqplot.CanvasTextRenderer.prototype.getWidth = function(ctx) {
        return this.width;
    };
    
    $.jqplot.CanvasTextRenderer.prototype.setWidth = function(ctx, w) {
        if (!w) {
            this.width = this.measure(ctx, this.text);
        }
        else {
            this.width = w;   
        }
        return this;
    };
    
    // return height in pixels.
    $.jqplot.CanvasTextRenderer.prototype.getHeight = function(ctx) {
        return this.height;
    };
    
    // w - height in pt
    // set heigh in px
    $.jqplot.CanvasTextRenderer.prototype.setHeight = function(w) {
        if (!w) {
            //height = this.fontSize /0.75;
            this.height = this.normalizedFontSize * this.pt2px;
        }
        else {
            this.height = w;   
        }
        return this;
    };

    $.jqplot.CanvasTextRenderer.prototype.letter = function (ch)
    {
        return this.letters[ch];
    };

    $.jqplot.CanvasTextRenderer.prototype.ascent = function()
    {
        return this.normalizedFontSize;
    };

    $.jqplot.CanvasTextRenderer.prototype.descent = function()
    {
        return 7.0*this.normalizedFontSize/25.0;
    };

    $.jqplot.CanvasTextRenderer.prototype.measure = function(ctx, str)
    {
        var total = 0;
        var len = str.length;
 
        for (var i = 0; i < len; i++) {
            var c = this.letter(str.charAt(i));
            if (c) {
                total += c.width * this.normalizedFontSize / 25.0 * this.fontStretch;
            }
        }
        return total;
    };

    $.jqplot.CanvasTextRenderer.prototype.draw = function(ctx,str)
    {
        var x = 0;
        // leave room at bottom for descenders.
        var y = this.height*0.72;
         var total = 0;
         var len = str.length;
         var mag = this.normalizedFontSize / 25.0;

         ctx.save();
         var tx, ty;
         
         // 1st quadrant
         if ((-Math.PI/2 <= this.angle && this.angle <= 0) || (Math.PI*3/2 <= this.angle && this.angle <= Math.PI*2)) {
             tx = 0;
             ty = -Math.sin(this.angle) * this.width;
         }
         // 4th quadrant
         else if ((0 < this.angle && this.angle <= Math.PI/2) || (-Math.PI*2 <= this.angle && this.angle <= -Math.PI*3/2)) {
             tx = Math.sin(this.angle) * this.height;
             ty = 0;
         }
         // 2nd quadrant
         else if ((-Math.PI < this.angle && this.angle < -Math.PI/2) || (Math.PI <= this.angle && this.angle <= Math.PI*3/2)) {
             tx = -Math.cos(this.angle) * this.width;
             ty = -Math.sin(this.angle) * this.width - Math.cos(this.angle) * this.height;
         }
         // 3rd quadrant
         else if ((-Math.PI*3/2 < this.angle && this.angle < Math.PI) || (Math.PI/2 < this.angle && this.angle < Math.PI)) {
             tx = Math.sin(this.angle) * this.height - Math.cos(this.angle)*this.width;
             ty = -Math.cos(this.angle) * this.height;
         }
         
         ctx.strokeStyle = this.fillStyle;
         ctx.fillStyle = this.fillStyle;
         ctx.translate(tx, ty);
         ctx.rotate(this.angle);
         ctx.lineCap = "round";
         // multiplier was 2.0
         var fact = (this.normalizedFontSize > 30) ? 2.0 : 2 + (30 - this.normalizedFontSize)/20;
         ctx.lineWidth = fact * mag * this.fontWeight2Float(this.fontWeight);
         
         for ( var i = 0; i < len; i++) {
            var c = this.letter( str.charAt(i));
            if ( !c) {
                continue;
            }

            ctx.beginPath();

            var penUp = 1;
            var needStroke = 0;
            for ( var j = 0; j < c.points.length; j++) {
              var a = c.points[j];
              if ( a[0] == -1 && a[1] == -1) {
                  penUp = 1;
                  continue;
              }
              if ( penUp) {
                  ctx.moveTo( x + a[0]*mag*this.fontStretch, y - a[1]*mag);
                  penUp = false;
              } else {
                  ctx.lineTo( x + a[0]*mag*this.fontStretch, y - a[1]*mag);
              }
            }
            ctx.stroke();
            x += c.width*mag*this.fontStretch;
         }
         ctx.restore();
         return total;
    };

    $.jqplot.CanvasTextRenderer.prototype.letters = {
         ' ': { width: 16, points: [] },
         '!': { width: 10, points: [[5,21],[5,7],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]] },
         '"': { width: 16, points: [[4,21],[4,14],[-1,-1],[12,21],[12,14]] },
         '#': { width: 21, points: [[11,25],[4,-7],[-1,-1],[17,25],[10,-7],[-1,-1],[4,12],[18,12],[-1,-1],[3,6],[17,6]] },
         '$': { width: 20, points: [[8,25],[8,-4],[-1,-1],[12,25],[12,-4],[-1,-1],[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]] },
         '%': { width: 24, points: [[21,21],[3,0],[-1,-1],[8,21],[10,19],[10,17],[9,15],[7,14],[5,14],[3,16],[3,18],[4,20],[6,21],[8,21],[10,20],[13,19],[16,19],[19,20],[21,21],[-1,-1],[17,7],[15,6],[14,4],[14,2],[16,0],[18,0],[20,1],[21,3],[21,5],[19,7],[17,7]] },
         '&': { width: 26, points: [[23,12],[23,13],[22,14],[21,14],[20,13],[19,11],[17,6],[15,3],[13,1],[11,0],[7,0],[5,1],[4,2],[3,4],[3,6],[4,8],[5,9],[12,13],[13,14],[14,16],[14,18],[13,20],[11,21],[9,20],[8,18],[8,16],[9,13],[11,10],[16,3],[18,1],[20,0],[22,0],[23,1],[23,2]] },
         '\'': { width: 10, points: [[5,19],[4,20],[5,21],[6,20],[6,18],[5,16],[4,15]] },
         '(': { width: 14, points: [[11,25],[9,23],[7,20],[5,16],[4,11],[4,7],[5,2],[7,-2],[9,-5],[11,-7]] },
         ')': { width: 14, points: [[3,25],[5,23],[7,20],[9,16],[10,11],[10,7],[9,2],[7,-2],[5,-5],[3,-7]] },
         '*': { width: 16, points: [[8,21],[8,9],[-1,-1],[3,18],[13,12],[-1,-1],[13,18],[3,12]] },
         '+': { width: 26, points: [[13,18],[13,0],[-1,-1],[4,9],[22,9]] },
         ',': { width: 10, points: [[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]] },
         '-': { width: 18, points: [[6,9],[12,9]] },
         '.': { width: 10, points: [[5,2],[4,1],[5,0],[6,1],[5,2]] },
         '/': { width: 22, points: [[20,25],[2,-7]] },
         '0': { width: 20, points: [[9,21],[6,20],[4,17],[3,12],[3,9],[4,4],[6,1],[9,0],[11,0],[14,1],[16,4],[17,9],[17,12],[16,17],[14,20],[11,21],[9,21]] },
         '1': { width: 20, points: [[6,17],[8,18],[11,21],[11,0]] },
         '2': { width: 20, points: [[4,16],[4,17],[5,19],[6,20],[8,21],[12,21],[14,20],[15,19],[16,17],[16,15],[15,13],[13,10],[3,0],[17,0]] },
         '3': { width: 20, points: [[5,21],[16,21],[10,13],[13,13],[15,12],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]] },
         '4': { width: 20, points: [[13,21],[3,7],[18,7],[-1,-1],[13,21],[13,0]] },
         '5': { width: 20, points: [[15,21],[5,21],[4,12],[5,13],[8,14],[11,14],[14,13],[16,11],[17,8],[17,6],[16,3],[14,1],[11,0],[8,0],[5,1],[4,2],[3,4]] },
         '6': { width: 20, points: [[16,18],[15,20],[12,21],[10,21],[7,20],[5,17],[4,12],[4,7],[5,3],[7,1],[10,0],[11,0],[14,1],[16,3],[17,6],[17,7],[16,10],[14,12],[11,13],[10,13],[7,12],[5,10],[4,7]] },
         '7': { width: 20, points: [[17,21],[7,0],[-1,-1],[3,21],[17,21]] },
         '8': { width: 20, points: [[8,21],[5,20],[4,18],[4,16],[5,14],[7,13],[11,12],[14,11],[16,9],[17,7],[17,4],[16,2],[15,1],[12,0],[8,0],[5,1],[4,2],[3,4],[3,7],[4,9],[6,11],[9,12],[13,13],[15,14],[16,16],[16,18],[15,20],[12,21],[8,21]] },
         '9': { width: 20, points: [[16,14],[15,11],[13,9],[10,8],[9,8],[6,9],[4,11],[3,14],[3,15],[4,18],[6,20],[9,21],[10,21],[13,20],[15,18],[16,14],[16,9],[15,4],[13,1],[10,0],[8,0],[5,1],[4,3]] },
         ':': { width: 10, points: [[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[5,2],[4,1],[5,0],[6,1],[5,2]] },
         ';': { width: 10, points: [[5,14],[4,13],[5,12],[6,13],[5,14],[-1,-1],[6,1],[5,0],[4,1],[5,2],[6,1],[6,-1],[5,-3],[4,-4]] },
         '<': { width: 24, points: [[20,18],[4,9],[20,0]] },
         '=': { width: 26, points: [[4,12],[22,12],[-1,-1],[4,6],[22,6]] },
         '>': { width: 24, points: [[4,18],[20,9],[4,0]] },
         '?': { width: 18, points: [[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7],[-1,-1],[9,2],[8,1],[9,0],[10,1],[9,2]] },
         '@': { width: 27, points: [[18,13],[17,15],[15,16],[12,16],[10,15],[9,14],[8,11],[8,8],[9,6],[11,5],[14,5],[16,6],[17,8],[-1,-1],[12,16],[10,14],[9,11],[9,8],[10,6],[11,5],[-1,-1],[18,16],[17,8],[17,6],[19,5],[21,5],[23,7],[24,10],[24,12],[23,15],[22,17],[20,19],[18,20],[15,21],[12,21],[9,20],[7,19],[5,17],[4,15],[3,12],[3,9],[4,6],[5,4],[7,2],[9,1],[12,0],[15,0],[18,1],[20,2],[21,3],[-1,-1],[19,16],[18,8],[18,6],[19,5]] },
         'A': { width: 18, points: [[9,21],[1,0],[-1,-1],[9,21],[17,0],[-1,-1],[4,7],[14,7]] },
         'B': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[-1,-1],[4,11],[13,11],[16,10],[17,9],[18,7],[18,4],[17,2],[16,1],[13,0],[4,0]] },
         'C': { width: 21, points: [[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5]] },
         'D': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[11,21],[14,20],[16,18],[17,16],[18,13],[18,8],[17,5],[16,3],[14,1],[11,0],[4,0]] },
         'E': { width: 19, points: [[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11],[-1,-1],[4,0],[17,0]] },
         'F': { width: 18, points: [[4,21],[4,0],[-1,-1],[4,21],[17,21],[-1,-1],[4,11],[12,11]] },
         'G': { width: 21, points: [[18,16],[17,18],[15,20],[13,21],[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[18,8],[-1,-1],[13,8],[18,8]] },
         'H': { width: 22, points: [[4,21],[4,0],[-1,-1],[18,21],[18,0],[-1,-1],[4,11],[18,11]] },
         'I': { width: 8, points: [[4,21],[4,0]] },
         'J': { width: 16, points: [[12,21],[12,5],[11,2],[10,1],[8,0],[6,0],[4,1],[3,2],[2,5],[2,7]] },
         'K': { width: 21, points: [[4,21],[4,0],[-1,-1],[18,21],[4,7],[-1,-1],[9,12],[18,0]] },
         'L': { width: 17, points: [[4,21],[4,0],[-1,-1],[4,0],[16,0]] },
         'M': { width: 24, points: [[4,21],[4,0],[-1,-1],[4,21],[12,0],[-1,-1],[20,21],[12,0],[-1,-1],[20,21],[20,0]] },
         'N': { width: 22, points: [[4,21],[4,0],[-1,-1],[4,21],[18,0],[-1,-1],[18,21],[18,0]] },
         'O': { width: 22, points: [[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21]] },
         'P': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,14],[17,12],[16,11],[13,10],[4,10]] },
         'Q': { width: 22, points: [[9,21],[7,20],[5,18],[4,16],[3,13],[3,8],[4,5],[5,3],[7,1],[9,0],[13,0],[15,1],[17,3],[18,5],[19,8],[19,13],[18,16],[17,18],[15,20],[13,21],[9,21],[-1,-1],[12,4],[18,-2]] },
         'R': { width: 21, points: [[4,21],[4,0],[-1,-1],[4,21],[13,21],[16,20],[17,19],[18,17],[18,15],[17,13],[16,12],[13,11],[4,11],[-1,-1],[11,11],[18,0]] },
         'S': { width: 20, points: [[17,18],[15,20],[12,21],[8,21],[5,20],[3,18],[3,16],[4,14],[5,13],[7,12],[13,10],[15,9],[16,8],[17,6],[17,3],[15,1],[12,0],[8,0],[5,1],[3,3]] },
         'T': { width: 16, points: [[8,21],[8,0],[-1,-1],[1,21],[15,21]] },
         'U': { width: 22, points: [[4,21],[4,6],[5,3],[7,1],[10,0],[12,0],[15,1],[17,3],[18,6],[18,21]] },
         'V': { width: 18, points: [[1,21],[9,0],[-1,-1],[17,21],[9,0]] },
         'W': { width: 24, points: [[2,21],[7,0],[-1,-1],[12,21],[7,0],[-1,-1],[12,21],[17,0],[-1,-1],[22,21],[17,0]] },
         'X': { width: 20, points: [[3,21],[17,0],[-1,-1],[17,21],[3,0]] },
         'Y': { width: 18, points: [[1,21],[9,11],[9,0],[-1,-1],[17,21],[9,11]] },
         'Z': { width: 20, points: [[17,21],[3,0],[-1,-1],[3,21],[17,21],[-1,-1],[3,0],[17,0]] },
         '[': { width: 14, points: [[4,25],[4,-7],[-1,-1],[5,25],[5,-7],[-1,-1],[4,25],[11,25],[-1,-1],[4,-7],[11,-7]] },
         '\\': { width: 14, points: [[0,21],[14,-3]] },
         ']': { width: 14, points: [[9,25],[9,-7],[-1,-1],[10,25],[10,-7],[-1,-1],[3,25],[10,25],[-1,-1],[3,-7],[10,-7]] },
         '^': { width: 16, points: [[6,15],[8,18],[10,15],[-1,-1],[3,12],[8,17],[13,12],[-1,-1],[8,17],[8,0]] },
         '_': { width: 16, points: [[0,-2],[16,-2]] },
         '`': { width: 10, points: [[6,21],[5,20],[4,18],[4,16],[5,15],[6,16],[5,17]] },
         'a': { width: 19, points: [[15,14],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'b': { width: 19, points: [[4,21],[4,0],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]] },
         'c': { width: 18, points: [[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'd': { width: 19, points: [[15,21],[15,0],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'e': { width: 18, points: [[3,8],[15,8],[15,10],[14,12],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'f': { width: 12, points: [[10,21],[8,21],[6,20],[5,17],[5,0],[-1,-1],[2,14],[9,14]] },
         'g': { width: 19, points: [[15,14],[15,-2],[14,-5],[13,-6],[11,-7],[8,-7],[6,-6],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'h': { width: 19, points: [[4,21],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]] },
         'i': { width: 8, points: [[3,21],[4,20],[5,21],[4,22],[3,21],[-1,-1],[4,14],[4,0]] },
         'j': { width: 10, points: [[5,21],[6,20],[7,21],[6,22],[5,21],[-1,-1],[6,14],[6,-3],[5,-6],[3,-7],[1,-7]] },
         'k': { width: 17, points: [[4,21],[4,0],[-1,-1],[14,14],[4,4],[-1,-1],[8,8],[15,0]] },
         'l': { width: 8, points: [[4,21],[4,0]] },
         'm': { width: 30, points: [[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0],[-1,-1],[15,10],[18,13],[20,14],[23,14],[25,13],[26,10],[26,0]] },
         'n': { width: 19, points: [[4,14],[4,0],[-1,-1],[4,10],[7,13],[9,14],[12,14],[14,13],[15,10],[15,0]] },
         'o': { width: 19, points: [[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3],[16,6],[16,8],[15,11],[13,13],[11,14],[8,14]] },
         'p': { width: 19, points: [[4,14],[4,-7],[-1,-1],[4,11],[6,13],[8,14],[11,14],[13,13],[15,11],[16,8],[16,6],[15,3],[13,1],[11,0],[8,0],[6,1],[4,3]] },
         'q': { width: 19, points: [[15,14],[15,-7],[-1,-1],[15,11],[13,13],[11,14],[8,14],[6,13],[4,11],[3,8],[3,6],[4,3],[6,1],[8,0],[11,0],[13,1],[15,3]] },
         'r': { width: 13, points: [[4,14],[4,0],[-1,-1],[4,8],[5,11],[7,13],[9,14],[12,14]] },
         's': { width: 17, points: [[14,11],[13,13],[10,14],[7,14],[4,13],[3,11],[4,9],[6,8],[11,7],[13,6],[14,4],[14,3],[13,1],[10,0],[7,0],[4,1],[3,3]] },
         't': { width: 12, points: [[5,21],[5,4],[6,1],[8,0],[10,0],[-1,-1],[2,14],[9,14]] },
         'u': { width: 19, points: [[4,14],[4,4],[5,1],[7,0],[10,0],[12,1],[15,4],[-1,-1],[15,14],[15,0]] },
         'v': { width: 16, points: [[2,14],[8,0],[-1,-1],[14,14],[8,0]] },
         'w': { width: 22, points: [[3,14],[7,0],[-1,-1],[11,14],[7,0],[-1,-1],[11,14],[15,0],[-1,-1],[19,14],[15,0]] },
         'x': { width: 17, points: [[3,14],[14,0],[-1,-1],[14,14],[3,0]] },
         'y': { width: 16, points: [[2,14],[8,0],[-1,-1],[14,14],[8,0],[6,-4],[4,-6],[2,-7],[1,-7]] },
         'z': { width: 17, points: [[14,14],[3,0],[-1,-1],[3,14],[14,14],[-1,-1],[3,0],[14,0]] },
         '{': { width: 14, points: [[9,25],[7,24],[6,23],[5,21],[5,19],[6,17],[7,16],[8,14],[8,12],[6,10],[-1,-1],[7,24],[6,22],[6,20],[7,18],[8,17],[9,15],[9,13],[8,11],[4,9],[8,7],[9,5],[9,3],[8,1],[7,0],[6,-2],[6,-4],[7,-6],[-1,-1],[6,8],[8,6],[8,4],[7,2],[6,1],[5,-1],[5,-3],[6,-5],[7,-6],[9,-7]] },
         '|': { width: 8, points: [[4,25],[4,-7]] },
         '}': { width: 14, points: [[5,25],[7,24],[8,23],[9,21],[9,19],[8,17],[7,16],[6,14],[6,12],[8,10],[-1,-1],[7,24],[8,22],[8,20],[7,18],[6,17],[5,15],[5,13],[6,11],[10,9],[6,7],[5,5],[5,3],[6,1],[7,0],[8,-2],[8,-4],[7,-6],[-1,-1],[8,8],[6,6],[6,4],[7,2],[8,1],[9,-1],[9,-3],[8,-5],[7,-6],[5,-7]] },
         '~': { width: 24, points: [[3,6],[3,8],[4,11],[6,12],[8,12],[10,11],[14,8],[16,7],[18,7],[20,8],[21,10],[-1,-1],[3,8],[4,10],[6,11],[8,11],[10,10],[14,7],[16,6],[18,6],[20,7],[21,10],[21,12]] }
     };
     
    $.jqplot.CanvasFontRenderer = function(options) {
        options = options || {};
        if (!options.pt2px) {
            options.pt2px = 1.5;
        }
        $.jqplot.CanvasTextRenderer.call(this, options);
    };
    
    $.jqplot.CanvasFontRenderer.prototype = new $.jqplot.CanvasTextRenderer({});
    $.jqplot.CanvasFontRenderer.prototype.constructor = $.jqplot.CanvasFontRenderer;

    $.jqplot.CanvasFontRenderer.prototype.measure = function(ctx, str)
    {
        // var fstyle = this.fontStyle+' '+this.fontVariant+' '+this.fontWeight+' '+this.fontSize+' '+this.fontFamily;
        var fstyle = this.fontSize+' '+this.fontFamily;
        ctx.save();
        ctx.font = fstyle;
        var w = ctx.measureText(str).width;
        ctx.restore();
        return w;
    };

    $.jqplot.CanvasFontRenderer.prototype.draw = function(ctx, str)
    {
        var x = 0;
        // leave room at bottom for descenders.
        var y = this.height*0.72;
        //var y = 12;

         ctx.save();
         var tx, ty;
         
         // 1st quadrant
         if ((-Math.PI/2 <= this.angle && this.angle <= 0) || (Math.PI*3/2 <= this.angle && this.angle <= Math.PI*2)) {
             tx = 0;
             ty = -Math.sin(this.angle) * this.width;
         }
         // 4th quadrant
         else if ((0 < this.angle && this.angle <= Math.PI/2) || (-Math.PI*2 <= this.angle && this.angle <= -Math.PI*3/2)) {
             tx = Math.sin(this.angle) * this.height;
             ty = 0;
         }
         // 2nd quadrant
         else if ((-Math.PI < this.angle && this.angle < -Math.PI/2) || (Math.PI <= this.angle && this.angle <= Math.PI*3/2)) {
             tx = -Math.cos(this.angle) * this.width;
             ty = -Math.sin(this.angle) * this.width - Math.cos(this.angle) * this.height;
         }
         // 3rd quadrant
         else if ((-Math.PI*3/2 < this.angle && this.angle < Math.PI) || (Math.PI/2 < this.angle && this.angle < Math.PI)) {
             tx = Math.sin(this.angle) * this.height - Math.cos(this.angle)*this.width;
             ty = -Math.cos(this.angle) * this.height;
         }
         ctx.strokeStyle = this.fillStyle;
         ctx.fillStyle = this.fillStyle;
        // var fstyle = this.fontStyle+' '+this.fontVariant+' '+this.fontWeight+' '+this.fontSize+' '+this.fontFamily;
        var fstyle = this.fontSize+' '+this.fontFamily;
         ctx.font = fstyle;
         ctx.translate(tx, ty);
         ctx.rotate(this.angle);
         ctx.fillText(str, x, y);
         // ctx.strokeText(str, x, y);

         ctx.restore();
    };
    
})(jQuery);


//next
//$.jqplot.CanvasAxisTickRenderer

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */

(function($) {
    /**
    *  Class: $.jqplot.CanvasAxisTickRenderer
    * Renderer to draw axis ticks with a canvas element to support advanced
    * featrues such as rotated text.  This renderer uses a separate rendering engine
    * to draw the text on the canvas.  Two modes of rendering the text are available.
    * If the browser has native font support for canvas fonts (currently Mozila 3.5
    * and Safari 4), you can enable text rendering with the canvas fillText method.
    * You do so by setting the "enableFontSupport" option to true. 
    * 
    * Browsers lacking native font support will have the text drawn on the canvas
    * using the Hershey font metrics.  Even if the "enableFontSupport" option is true
    * non-supporting browsers will still render with the Hershey font.
    */
    $.jqplot.CanvasAxisTickRenderer = function(options) {
        // Group: Properties
        
        // prop: mark
        // tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
        this.mark = 'outside';
        // prop: showMark
        // whether or not to show the mark on the axis.
        this.showMark = true;
        // prop: showGridline
        // whether or not to draw the gridline on the grid at this tick.
        this.showGridline = true;
        // prop: isMinorTick
        // if this is a minor tick.
        this.isMinorTick = false;
        // prop: angle
        // angle of text, measured clockwise from x axis.
        this.angle = 0;
        // prop:  markSize
        // Length of the tick marks in pixels.  For 'cross' style, length
        // will be stoked above and below axis, so total length will be twice this.
        this.markSize = 4;
        // prop: show
        // whether or not to show the tick (mark and label).
        this.show = true;
        // prop: showLabel
        // whether or not to show the label.
        this.showLabel = true;
        // prop: labelPosition
        // 'auto', 'start', 'middle' or 'end'.
        // Whether tick label should be positioned so the start, middle, or end
        // of the tick mark.
        this.labelPosition = 'auto';
        this.label = '';
        this.value = null;
        this._styles = {};
        // prop: formatter
        // A class of a formatter for the tick text.
        // The default $.jqplot.DefaultTickFormatter uses sprintf.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: prefix
        // String to prepend to the tick label.
        // Prefix is prepended to the formatted tick label.
        this.prefix = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily = '"Trebuchet MS", Arial, Helvetica, sans-serif';
        // prop: fontSize
        // CSS spec for font size.
        this.fontSize = '10pt';
        // prop: fontWeight
        // CSS spec for fontWeight
        this.fontWeight = 'normal';
        // prop: fontStretch
        // Multiplier to condense or expand font width.  
        // Applies only to browsers which don't support canvas native font rendering.
        this.fontStretch = 1.0;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor = '#666666';
        // prop: enableFontSupport
        // true to turn on native canvas font support in Mozilla 3.5+ and Safari 4+.
        // If true, tick label will be drawn with canvas tag native support for fonts.
        // If false, tick label will be drawn with Hershey font metrics.
        this.enableFontSupport = true;
        // prop: pt2px
        // Point to pixel scaling factor, used for computing height of bounding box
        // around a label.  The labels text renderer has a default setting of 1.4, which 
        // should be suitable for most fonts.  Leave as null to use default.  If tops of
        // letters appear clipped, increase this.  If bounding box seems too big, decrease.
        // This is an issue only with the native font renderering capabilities of Mozilla
        // 3.5 and Safari 4 since they do not provide a method to determine the font height.
        this.pt2px = null;
        
        this._elem;
        this._ctx;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
        
        $.extend(true, this, options);
        
        var ropts = {fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily};
        if (this.pt2px) {
            ropts.pt2px = this.pt2px;
        }
        
        if (this.enableFontSupport) {
            if ($.jqplot.support_canvas_text()) {
                this._textRenderer = new $.jqplot.CanvasFontRenderer(ropts);
            }
            
            else {
                this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
            }
        }
        else {
            this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts); 
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this._textRenderer.init({fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, fillStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily});
    };
    
    // return width along the x axis
    // will check first to see if an element exists.
    // if not, will return the computed text box width.
    $.jqplot.CanvasAxisTickRenderer.prototype.getWidth = function(ctx) {
        if (this._elem) {
         return this._elem.outerWidth(true);
        }
        else {
            var tr = this._textRenderer;
            var l = tr.getWidth(ctx);
            var h = tr.getHeight(ctx);
            var w = Math.abs(Math.sin(tr.angle)*h) + Math.abs(Math.cos(tr.angle)*l);
            return w;
        }
    };
    
    // return height along the y axis.
    $.jqplot.CanvasAxisTickRenderer.prototype.getHeight = function(ctx) {
        if (this._elem) {
         return this._elem.outerHeight(true);
        }
        else {
            var tr = this._textRenderer;
            var l = tr.getWidth(ctx);
            var h = tr.getHeight(ctx);
            var w = Math.abs(Math.cos(tr.angle)*h) + Math.abs(Math.sin(tr.angle)*l);
            return w;
        }
    };

    // return top.
    $.jqplot.CanvasAxisTickRenderer.prototype.getTop = function(ctx) {
        if (this._elem) {
         return this._elem.position().top;
        }
        else {
            return null;
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad = function() {
        var a = this.angle * Math.PI/180;
        return a;
    };
    
    
    $.jqplot.CanvasAxisTickRenderer.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        if (isMinor) {
            this.isMinorTick = true;
        }
        return this;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.draw = function(ctx, plot) {
        if (!this.label) {
            this.label = this.prefix + this.formatter(this.formatString, this.value);
        }
        
        // Memory Leaks patch
        if (this._elem) {
            if ($.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== undefined) {
                window.G_vmlCanvasManager.uninitElement(this._elem.get(0));
            }
            
            this._elem.emptyForce();
            this._elem = null;
        }

        // create a canvas here, but can't draw on it untill it is appended
        // to dom for IE compatability.

        var elem = plot.canvasManager.getCanvas();

        this._textRenderer.setText(this.label, ctx);
        var w = this.getWidth(ctx);
        var h = this.getHeight(ctx);
        // canvases seem to need to have width and heigh attributes directly set.
        elem.width = w;
        elem.height = h;
        elem.style.width = w;
        elem.style.height = h;
        elem.style.textAlign = 'left';
        elem.style.position = 'absolute';

        elem = plot.canvasManager.initCanvas(elem);

        this._elem = $(elem);
        this._elem.css(this._styles);
        this._elem.addClass('jqplot-'+this.axis+'-tick');

        elem = null;
        return this._elem;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.pack = function() {
        this._textRenderer.draw(this._elem.get(0).getContext("2d"), this.label);
    };
    
})(jQuery);

//next
//$.jqplot.CanvasOverlay

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */

(function($) {
    var objCounter = 0;
    // class: $.jqplot.CanvasOverlay
    $.jqplot.CanvasOverlay = function(opts){
        var options = opts || {};
        this.options = {
            show: $.jqplot.config.enablePlugins,
            deferDraw: false
        };
        // prop: objects
        this.objects = [];
        this.objectNames = [];
        this.canvas = null;
        this.markerRenderer = new $.jqplot.MarkerRenderer({style:'line'});
        this.markerRenderer.init();
        this.highlightObjectIndex = null;
        if (options.objects) {
            var objs = options.objects,
                obj;
            for (var i=0; i<objs.length; i++) {
                obj = objs[i];
                for (var n in obj) {
                    switch (n) {
                        case 'line':
                            this.addLine(obj[n]);
                            break;
                        case 'horizontalLine':
                            this.addHorizontalLine(obj[n]);
                            break;
                        case 'dashedHorizontalLine':
                            this.addDashedHorizontalLine(obj[n]);
                            break;
                        case 'verticalLine':
                            this.addVerticalLine(obj[n]);
                            break;
                        case 'dashedVerticalLine':
                            this.addDashedVerticalLine(obj[n]);
                            break;
                        case 'rectangle':
                            this.addRectangle(obj[n]);
                            break;
                        default:
                            break;
                    }
                }   
            }
        }
        $.extend(true, this.options, options);
    };
    
    // called with scope of a plot object
    $.jqplot.CanvasOverlay.postPlotInit = function (target, data, opts) {
        var options = opts || {};
        // add a canvasOverlay attribute to the plot
        this.plugins.canvasOverlay = new $.jqplot.CanvasOverlay(options.canvasOverlay);     
    };


    function LineBase() {
        this.uid = null;
        this.type = null;
        this.gridStart = null;
        this.gridStop = null;
        this.tooltipWidthFactor = 0;
        this.options = {           
            // prop: name
            // Optional name for the overlay object.
            // Can be later used to retrieve the object by name.
            name: null,
            // prop: show
            // true to show (draw), false to not draw.
            show: true,
            // prop: lineWidth
            // Width of the line.
            lineWidth: 2,
            // prop: lineCap
            // Type of ending placed on the line ['round', 'butt', 'square']
            lineCap: 'round',
            // prop: color
            // color of the line
            color: '#666666',
            // prop: shadow
            // whether or not to draw a shadow on the line
            shadow: true,
            // prop: shadowAngle
            // Shadow angle in degrees
            shadowAngle: 45,
            // prop: shadowOffset
            // Shadow offset from line in pixels
            shadowOffset: 1,
            // prop: shadowDepth
            // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
            shadowDepth: 3,
            // prop: shadowAlpha
            // Alpha channel transparency of shadow.  0 = transparent.
            shadowAlpha: '0.07',
            // prop: xaxis
            // X axis to use for positioning/scaling the line.
            xaxis: 'xaxis',
            // prop: yaxis
            // Y axis to use for positioning/scaling the line.
            yaxis: 'yaxis',
            // prop: showTooltip
            // Show a tooltip with data point values.
            showTooltip: false,
            // prop: showTooltipPrecision
            // Controls how close to line cursor must be to show tooltip.
            // Higher number = closer to line, lower number = farther from line.
            // 1.0 = cursor must be over line.
            showTooltipPrecision: 0.6,
            // prop: tooltipLocation
            // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
            tooltipLocation: 'nw',
            // prop: fadeTooltip
            // true = fade in/out tooltip, flase = show/hide tooltip
            fadeTooltip: true,
            // prop: tooltipFadeSpeed
            // 'slow', 'def', 'fast', or number of milliseconds.
            tooltipFadeSpeed: "fast",
            // prop: tooltipOffset
            // Pixel offset of tooltip from the highlight.
            tooltipOffset: 4,
            // prop: tooltipFormatString
            // Format string passed the x and y values of the cursor on the line.
            // e.g., 'Dogs: %.2f, Cats: %d'.
            tooltipFormatString: '%d, %d'
        };
    }
    
    
    function Rectangle(options) {
        LineBase.call(this);
        this.type = 'rectangle';
        var opts = {
         // prop: xmin
                // x value for the start of the line, null to scale to axis min.
                xmin: null,
                // prop: xmax
                // x value for the end of the line, null to scale to axis max.
                xmax: null,
                // prop xOffset
                // offset ends of the line inside the grid. Number
                xOffset: '6px', // number or string. Number interpreted as units, string as pixels.
                xminOffset: null,
                xmaxOffset: null,
                
                ymin: null,
                ymax: null,
                yOffset: '6px', // number or string. Number interpreted as units, string as pixels.
                yminOffset: null,
                ymaxOffset: null
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    Rectangle.prototype = new LineBase();
    Rectangle.prototype.constructor = Rectangle;

    
    /**
     * Class: Line
     * A straight line.
     */
    function Line(options) {
        LineBase.call(this);
        this.type = 'line';
        var opts = {
            // prop: start
            // [x, y] coordinates for the start of the line.
            start: [],
            // prop: stop
            // [x, y] coordinates for the end of the line.
            stop: []
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    Line.prototype = new LineBase();
    Line.prototype.constructor = Line;


    /**
     * Class: HorizontalLine
     * A straight horizontal line.
     */
    function HorizontalLine(options) {
        LineBase.call(this);
        this.type = 'horizontalLine';
        var opts = {
            // prop: y
            // y value to position the line
            y: null,
            // prop: xmin
            // x value for the start of the line, null to scale to axis min.
            xmin: null,
            // prop: xmax
            // x value for the end of the line, null to scale to axis max.
            xmax: null,
            // prop xOffset
            // offset ends of the line inside the grid.  Number 
            xOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            xminOffset: null,
            xmaxOffset: null
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    HorizontalLine.prototype = new LineBase();
    HorizontalLine.prototype.constructor = HorizontalLine;
    

    /**
     * Class: DashedHorizontalLine
     * A straight dashed horizontal line.
     */
    function DashedHorizontalLine(options) {
        LineBase.call(this);
        this.type = 'dashedHorizontalLine';
        var opts = {
            y: null,
            xmin: null,
            xmax: null,
            xOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            xminOffset: null,
            xmaxOffset: null,
            // prop: dashPattern
            // Array of line, space settings in pixels.
            // Default is 8 pixel of line, 8 pixel of space.
            // Note, limit to a 2 element array b/c of bug with higher order arrays.
            dashPattern: [8,8]
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    DashedHorizontalLine.prototype = new LineBase();
    DashedHorizontalLine.prototype.constructor = DashedHorizontalLine;
    

    /**
     * Class: VerticalLine
     * A straight vertical line.
     */
    function VerticalLine(options) {
        LineBase.call(this);
        this.type = 'verticalLine';
        var opts = {
            x: null,
            ymin: null,
            ymax: null,
            yOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            yminOffset: null,
            ymaxOffset: null
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    VerticalLine.prototype = new LineBase();
    VerticalLine.prototype.constructor = VerticalLine;
    

    /**
     * Class: DashedVerticalLine
     * A straight dashed vertical line.
     */
    function DashedVerticalLine(options) {
        LineBase.call(this);
        this.type = 'dashedVerticalLine';
        this.start = null;
        this.stop = null;
        var opts = {
            x: null,
            ymin: null,
            ymax: null,
            yOffset: '6px', // number or string.  Number interpreted as units, string as pixels.
            yminOffset: null,
            ymaxOffset: null,
            // prop: dashPattern
            // Array of line, space settings in pixels.
            // Default is 8 pixel of line, 8 pixel of space.
            // Note, limit to a 2 element array b/c of bug with higher order arrays.
            dashPattern: [8,8]
        };
        $.extend(true, this.options, opts, options);

        if (this.options.showTooltipPrecision < 0.01) {
            this.options.showTooltipPrecision = 0.01;
        }
    }

    DashedVerticalLine.prototype = new LineBase();
    DashedVerticalLine.prototype.constructor = DashedVerticalLine;
    
    $.jqplot.CanvasOverlay.prototype.addLine = function(opts) {
        var line = new Line(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addHorizontalLine = function(opts) {
        var line = new HorizontalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addDashedHorizontalLine = function(opts) {
        var line = new DashedHorizontalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addVerticalLine = function(opts) {
        var line = new VerticalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addDashedVerticalLine = function(opts) {
        var line = new DashedVerticalLine(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.addRectangle = function(opts) {
        var line = new Rectangle(opts);
        line.uid = objCounter++;
        this.objects.push(line);
        this.objectNames.push(line.options.name);
    };
    
    $.jqplot.CanvasOverlay.prototype.removeObject = function(idx) {
        // check if integer, remove by index
        if ($.type(idx) == 'number') {
            this.objects.splice(idx, 1);
            this.objectNames.splice(idx, 1);
        }
        // if string, remove by name
        else {
            var id = $.inArray(idx, this.objectNames);
            if (id != -1) {
                this.objects.splice(id, 1);
                this.objectNames.splice(id, 1);
            }
        }
    };
    
    $.jqplot.CanvasOverlay.prototype.getObject = function(idx) {
        // check if integer, remove by index
        if ($.type(idx) == 'number') {
            return this.objects[idx];
        }
        // if string, remove by name
        else {
            var id = $.inArray(idx, this.objectNames);
            if (id != -1) {
                return this.objects[id];
            }
        }
    };
    
    // Set get as alias for getObject.
    $.jqplot.CanvasOverlay.prototype.get = $.jqplot.CanvasOverlay.prototype.getObject;
    
    $.jqplot.CanvasOverlay.prototype.clear = function(plot) {
        this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(), this.canvas.getHeight());
    };
    
    $.jqplot.CanvasOverlay.prototype.draw = function(plot) {
        var obj, 
            objs = this.objects,
            mr = this.markerRenderer,
            start,
            stop;
        if (this.options.show) {
            this.canvas._ctx.clearRect(0,0,this.canvas.getWidth(), this.canvas.getHeight());
            for (var k=0; k<objs.length; k++) {
                obj = objs[k];
                var opts = $.extend(true, {}, obj.options);
                if (obj.options.show) {
                    // style and shadow properties should be set before
                    // every draw of marker renderer.
                    mr.shadow = obj.options.shadow;
                    obj.tooltipWidthFactor = obj.options.lineWidth / obj.options.showTooltipPrecision;
                    switch (obj.type) {
                        case 'line':
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            mr.style = 'line';
                            opts.closePath = false;
                            start = [plot.axes[obj.options.xaxis].series_u2p(obj.options.start[0]), plot.axes[obj.options.yaxis].series_u2p(obj.options.start[1])];
                            stop = [plot.axes[obj.options.xaxis].series_u2p(obj.options.stop[0]), plot.axes[obj.options.yaxis].series_u2p(obj.options.stop[1])];
                            obj.gridStart = start;
                            obj.gridStop = stop;
                            mr.draw(start, stop, this.canvas._ctx, opts);
                            break;
                        case 'horizontalLine':
                            
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.y != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                                if (obj.options.xmin != null) {
                                    xstart = xaxis.series_u2p(obj.options.xmin);
                                }
                                else if (xminoff != null) {
                                    if ($.type(xminoff) == "number") {
                                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                    }
                                    else if ($.type(xminoff) == "string") {
                                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                    }
                                }
                                if (obj.options.xmax != null) {
                                    xstop = xaxis.series_u2p(obj.options.xmax);
                                }
                                else if (xmaxoff != null) {
                                    if ($.type(xmaxoff) == "number") {
                                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                    }
                                    else if ($.type(xmaxoff) == "string") {
                                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                    }
                                }
                                if (xstop != null && xstart != null) {
                                    obj.gridStart = [xstart, y];
                                    obj.gridStop = [xstop, y];
                                    mr.draw([xstart, y], [xstop, y], this.canvas._ctx, opts);
                                }
                            }
                            break;

                        case 'dashedHorizontalLine':
                            
                            var dashPat = obj.options.dashPattern;
                            var dashPatLen = 0;
                            for (var i=0; i<dashPat.length; i++) {
                                dashPatLen += dashPat[i];
                            }

                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.y != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                                if (obj.options.xmin != null) {
                                    xstart = xaxis.series_u2p(obj.options.xmin);
                                }
                                else if (xminoff != null) {
                                    if ($.type(xminoff) == "number") {
                                        xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                    }
                                    else if ($.type(xminoff) == "string") {
                                        xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                    }
                                }
                                if (obj.options.xmax != null) {
                                    xstop = xaxis.series_u2p(obj.options.xmax);
                                }
                                else if (xmaxoff != null) {
                                    if ($.type(xmaxoff) == "number") {
                                        xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                    }
                                    else if ($.type(xmaxoff) == "string") {
                                        xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                    }
                                }
                                if (xstop != null && xstart != null) {
                                    obj.gridStart = [xstart, y];
                                    obj.gridStop = [xstop, y];
                                    var numDash = Math.ceil((xstop - xstart)/dashPatLen);
                                    var b=xstart, e;
                                    for (var i=0; i<numDash; i++) {
                                        for (var j=0; j<dashPat.length; j+=2) {
                                            e = b+dashPat[j];
                                            mr.draw([b, y], [e, y], this.canvas._ctx, opts);
                                            b += dashPat[j];
                                            if (j < dashPat.length-1) {
                                                b += dashPat[j+1];
                                            }
                                        }
                                    }
                                }
                            }
                            break;

                        case 'verticalLine':
                            
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.x != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var yaxis = plot.axes[obj.options.yaxis],
                                    ystart,
                                    ystop,
                                    x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                    yminoff = obj.options.yminOffset || obj.options.yOffset,
                                    ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                                if (obj.options.ymin != null) {
                                    ystart = yaxis.series_u2p(obj.options.ymin);
                                }
                                else if (yminoff != null) {
                                    if ($.type(yminoff) == "number") {
                                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                    }
                                    else if ($.type(yminoff) == "string") {
                                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                    }
                                }
                                if (obj.options.ymax != null) {
                                    ystop = yaxis.series_u2p(obj.options.ymax);
                                }
                                else if (ymaxoff != null) {
                                    if ($.type(ymaxoff) == "number") {
                                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                    }
                                    else if ($.type(ymaxoff) == "string") {
                                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                    }
                                }
                                if (ystop != null && ystart != null) {
                                    obj.gridStart = [x, ystart];
                                    obj.gridStop = [x, ystop];
                                    mr.draw([x, ystart], [x, ystop], this.canvas._ctx, opts);
                                }
                            }
                            break;

                        case 'dashedVerticalLine':
                            
                            var dashPat = obj.options.dashPattern;
                            var dashPatLen = 0;
                            for (var i=0; i<dashPat.length; i++) {
                                dashPatLen += dashPat[i];
                            }

                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            if (obj.options.x != null) {
                                mr.style = 'line';
                                opts.closePath = false;
                                var yaxis = plot.axes[obj.options.yaxis],
                                    ystart,
                                    ystop,
                                    x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                    yminoff = obj.options.yminOffset || obj.options.yOffset,
                                    ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                                if (obj.options.ymin != null) {
                                    ystart = yaxis.series_u2p(obj.options.ymin);
                                }
                                else if (yminoff != null) {
                                    if ($.type(yminoff) == "number") {
                                        ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                    }
                                    else if ($.type(yminoff) == "string") {
                                        ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                    }
                                }
                                if (obj.options.ymax != null) {
                                    ystop = yaxis.series_u2p(obj.options.ymax);
                                }
                                else if (ymaxoff != null) {
                                    if ($.type(ymaxoff) == "number") {
                                        ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                    }
                                    else if ($.type(ymaxoff) == "string") {
                                        ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                    }
                                }


                                if (ystop != null && ystart != null) {
                                    obj.gridStart = [x, ystart];
                                    obj.gridStop = [x, ystop];
                                    var numDash = Math.ceil((ystart - ystop)/dashPatLen);
                                    var firstDashAdjust = ((numDash * dashPatLen) - (ystart - ystop))/2.0;
                                    var b=ystart, e, bs, es;
                                    for (var i=0; i<numDash; i++) {
                                        for (var j=0; j<dashPat.length; j+=2) {
                                            e = b - dashPat[j];
                                            if (e < ystop) {
                                                e = ystop;
                                            }
                                            if (b < ystop) {
                                                b = ystop;
                                            }
                                            // es = e;
                                            // if (i == 0) {
                                            //  es += firstDashAdjust;
                                            // }
                                            mr.draw([x, b], [x, e], this.canvas._ctx, opts);
                                            b -= dashPat[j];
                                            if (j < dashPat.length-1) {
                                                b -= dashPat[j+1];
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                            
                        case 'rectangle':
                            // style and shadow properties should be set before
                            // every draw of marker renderer.
                            mr.style = 'line';
                            opts.closePath = true;
                            
                            var xaxis = plot.axes[obj.options.xaxis],
                                    xstart,
                                    xstop,
                                    y = plot.axes[obj.options.yaxis].series_u2p(obj.options.y),
                                    xminoff = obj.options.xminOffset || obj.options.xOffset,
                                    xmaxoff = obj.options.xmaxOffset || obj.options.xOffset;
                            if (obj.options.xmin != null) {
                                xstart = xaxis.series_u2p(obj.options.xmin);
                            }
                            else if (xminoff != null) {
                                if ($.type(xminoff) == "number") {
                                    xstart = xaxis.series_u2p(xaxis.min + xminoff);
                                }
                                else if ($.type(xminoff) == "string") {
                                    xstart = xaxis.series_u2p(xaxis.min) + parseFloat(xminoff);
                                }
                            }
                            if (obj.options.xmax != null) {
                                xstop = xaxis.series_u2p(obj.options.xmax);
                            }
                            else if (xmaxoff != null) {
                                if ($.type(xmaxoff) == "number") {
                                    xstop = xaxis.series_u2p(xaxis.max - xmaxoff);
                                }
                                else if ($.type(xmaxoff) == "string") {
                                    xstop = xaxis.series_u2p(xaxis.max) - parseFloat(xmaxoff);
                                }
                            }
                            
                            var yaxis = plot.axes[obj.options.yaxis],
                                ystart,
                                ystop,
                                x = plot.axes[obj.options.xaxis].series_u2p(obj.options.x),
                                yminoff = obj.options.yminOffset || obj.options.yOffset,
                                ymaxoff = obj.options.ymaxOffset || obj.options.yOffset;
                            if (obj.options.ymin != null) {
                                ystart = yaxis.series_u2p(obj.options.ymin);
                            }
                            else if (yminoff != null) {
                                if ($.type(yminoff) == "number") {
                                    ystart = yaxis.series_u2p(yaxis.min - yminoff);
                                }
                                else if ($.type(yminoff) == "string") {
                                    ystart = yaxis.series_u2p(yaxis.min) - parseFloat(yminoff);
                                }
                            }
                            if (obj.options.ymax != null) {
                                ystop = yaxis.series_u2p(obj.options.ymax);
                            }
                            else if (ymaxoff != null) {
                                if ($.type(ymaxoff) == "number") {
                                    ystop = yaxis.series_u2p(yaxis.max + ymaxoff);
                                }
                                else if ($.type(ymaxoff) == "string") {
                                    ystop = yaxis.series_u2p(yaxis.max) + parseFloat(ymaxoff);
                                }
                            }
                            

                            if (xstop != null && xstart != null && ystop != null && ystart != null) {
                                obj.gridStart = [xstart, ystart];
                                obj.gridStop = [xstop, ystop];
                                
                                this.canvas._ctx.fillStyle = obj.options.color;
                                this.canvas._ctx.fillRect(xstart, ystart, xstop - xstart, ystop - ystart);
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.CanvasOverlay.postPlotDraw = function() {
        var co = this.plugins.canvasOverlay;
        // Memory Leaks patch    
        if (co && co.highlightCanvas) {
            co.highlightCanvas.resetCanvas();
            co.highlightCanvas = null;
        }
        co.canvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(co.canvas.createElement(this._gridPadding, 'jqplot-overlayCanvas-canvas', this._plotDimensions, this));
        co.canvas.setContext();
        if (!co.deferDraw) {
            co.draw(this);
        }

        var elem = document.createElement('div');
        co._tooltipElem = $(elem);
        elem = null;
        co._tooltipElem.addClass('jqplot-canvasOverlay-tooltip');
        co._tooltipElem.css({position:'absolute', display:'none'});
        
        this.eventCanvas._elem.before(co._tooltipElem);
        this.eventCanvas._elem.bind('mouseleave', { elem: co._tooltipElem }, function (ev) { ev.data.elem.hide(); });

        var co = null;
    };


    function showTooltip(plot, obj, gridpos, datapos) {
        var co = plot.plugins.canvasOverlay;
        var elem = co._tooltipElem;

        var opts = obj.options, x, y;

        elem.html($.jqplot.sprintf(opts.tooltipFormatString, datapos[0], datapos[1]));
        
        switch (opts.tooltipLocation) {
            case 'nw':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
            case 'n':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true)/2;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
            case 'ne':
                x = gridpos[0] + plot._gridPadding.left + opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
            case 'e':
                x = gridpos[0] + plot._gridPadding.left + opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                x = gridpos[0] + plot._gridPadding.left + opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset;
                break;
            case 's':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true)/2;
                y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset;
                break;
            case 'sw':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top + opts.tooltipOffset;
                break;
            case 'w':
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                x = gridpos[0] + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset;
                y = gridpos[1] + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true);
                break;
        }

        elem.css('left', x);
        elem.css('top', y);
        if (opts.fadeTooltip) {
            // Fix for stacked up animations.  Thnanks Trevor!
            elem.stop(true,true).fadeIn(opts.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        elem = null;
    }


    function isNearLine(point, lstart, lstop, width) {
        // r is point to test, p and q are end points.
        var rx = point[0];
        var ry = point[1];
        var px = Math.round(lstop[0]);
        var py = Math.round(lstop[1]);
        var qx = Math.round(lstart[0]);
        var qy = Math.round(lstart[1]);

        var l = Math.sqrt(Math.pow(px-qx, 2) + Math.pow(py-qy, 2));

        // scale error term by length of line.
        var eps = width*l;
        var res = Math.abs((qx-px) * (ry-py) - (qy-py) * (rx-px));
        var ret = (res < eps) ? true : false;
        return ret;
    }
    
    function isNearRectangle(point, lstart, lstop, width) {
        // r is point to test, p and q are end points.
        var rx = point[0];
        var ry = point[1];
        var px = Math.round(lstop[0]);
        var py = Math.round(lstop[1]);
        var qx = Math.round(lstart[0]);
        var qy = Math.round(lstart[1]);
        
        var temp;
        if (px > qx) { temp = px; px = qx; qx = temp; }
        if (py > qy) { temp = py; py = qy; qy = temp; }
        
        var ret = (rx >= px && rx <= qx && ry >= py && ry <= qy);
        
        return ret;
    }


    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var co = plot.plugins.canvasOverlay;
        var objs = co.objects;
        var l = objs.length;
        var obj, haveHighlight=false;
        var elem;
        for (var i=0; i<l; i++) {
            obj = objs[i];
            if (obj.options.showTooltip) {
                var n;
                if (obj.type === 'rectangle') {
                 n = isNearRectangle([gridpos.x, gridpos.y], obj.gridStart, obj.gridStop, obj.tooltipWidthFactor);
                } else {
                 n = isNearLine([gridpos.x, gridpos.y], obj.gridStart, obj.gridStop, obj.tooltipWidthFactor);
                }
                datapos = [plot.axes[obj.options.xaxis].series_p2u(gridpos.x), plot.axes[obj.options.yaxis].series_p2u(gridpos.y)];

                // cases:
                //    near line, no highlighting
                //    near line, highliting on this line
                //    near line, highlighting another line
                //    not near any line, highlighting
                //    not near any line, no highlighting

                // near line, not currently highlighting
                if (n && co.highlightObjectIndex == null) {
                    switch (obj.type) {
                        case 'line':
                            showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                            break;

                        case 'horizontalLine':
                        case 'dashedHorizontalLine':
                            showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                            break;

                        case 'verticalLine':
                        case 'dashedVerticalLine':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        case 'rectangle':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        default:
                            break;
                    } 
                    co.highlightObjectIndex = i;
                    haveHighlight = true;
                    break;
                }

                // near line, highlighting another line.
                else if (n && co.highlightObjectIndex !== i) {
                    // turn off tooltip.
                    elem = co._tooltipElem;
                    if (obj.fadeTooltip) {
                        elem.fadeOut(obj.tooltipFadeSpeed);
                    }
                    else {
                        elem.hide();
                    }

                    // turn on right tooltip.
                    switch (obj.type) {
                        case 'line':
                            showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                            break;

                        case 'horizontalLine':
                        case 'dashedHorizontalLine':
                            showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                            break;

                        case 'verticalLine':
                        case 'dashedVerticalLine':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        case 'rectangle':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        default:
                            break;
                    }

                    co.highlightObjectIndex = i;
                    haveHighlight = true;
                    break;
                }

                // near line, already highlighting this line, update
                else if (n) {
                    switch (obj.type) {
                        case 'line':
                            showTooltip(plot, obj, [gridpos.x, gridpos.y], datapos);
                            break;

                        case 'horizontalLine':
                        case 'dashedHorizontalLine':
                            showTooltip(plot, obj, [gridpos.x, obj.gridStart[1]], [datapos[0], obj.options.y]);
                            break;

                        case 'verticalLine':
                        case 'dashedVerticalLine':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        case 'rectangle':
                            showTooltip(plot, obj, [obj.gridStart[0], gridpos.y], [obj.options.x, datapos[1]]);
                            break;
                            
                        default:
                            break;
                    }

                    haveHighlight = true;
                    break;
                }
            }
        }

        // check if we are highlighting and not near a line, turn it off.
        if (!haveHighlight && co.highlightObjectIndex !== null) {
            elem = co._tooltipElem;
            obj = co.getObject(co.highlightObjectIndex);
            if (obj.fadeTooltip) {
                elem.fadeOut(obj.tooltipFadeSpeed);
            }
            else {
                elem.hide();
            }
            co.highlightObjectIndex = null;
        }
    }
    
    $.jqplot.postInitHooks.push($.jqplot.CanvasOverlay.postPlotInit);
    $.jqplot.postDrawHooks.push($.jqplot.CanvasOverlay.postPlotDraw);
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);

})(jQuery);

//next
//$.jqplot.DateAxisRenderer

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */

(function($) {  
    /**
     * Class: $.jqplot.DateAxisRenderer
     * A plugin for a jqPlot to render an axis as a series of date values.
     * This renderer has no options beyond those supplied by the <Axis> class.
     * It supplies its own tick formatter, so the tickOptions.formatter option
     * should not be overridden.
     * 
     * Thanks to Ken Synder for his enhanced Date instance methods which are
     * included with this code <http://kendsnyder.com/sandbox/date/>.
     * 
     * To use this renderer, include the plugin in your source
     * > <script type="text/javascript" language="javascript" src="plugins/jqplot.dateAxisRenderer.js"></script>
     * 
     * and supply the appropriate options to your plot
     * 
     * > {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
     * 
     * Dates can be passed into the axis in almost any recognizable value and 
     * will be parsed.  They will be rendered on the axis in the format
     * specified by tickOptions.formatString.  e.g. tickOptions.formatString = '%Y-%m-%d'.
     * 
     * Accecptable format codes 
     * are:
     * 
     * > Code    Result                  Description
     * >             == Years ==
     * > %Y      2008                Four-digit year
     * > %y      08                  Two-digit year
     * >             == Months ==
     * > %m      09                  Two-digit month
     * > %#m     9                   One or two-digit month
     * > %B      September           Full month name
     * > %b      Sep                 Abbreviated month name
     * >             == Days ==
     * > %d      05                  Two-digit day of month
     * > %#d     5                   One or two-digit day of month
     * > %e      5                   One or two-digit day of month
     * > %A      Sunday              Full name of the day of the week
     * > %a      Sun                 Abbreviated name of the day of the week
     * > %w      0                   Number of the day of the week (0 = Sunday, 6 = Saturday)
     * > %o      th                  The ordinal suffix string following the day of the month
     * >             == Hours ==
     * > %H      23                  Hours in 24-hour format (two digits)
     * > %#H     3                   Hours in 24-hour integer format (one or two digits)
     * > %I      11                  Hours in 12-hour format (two digits)
     * > %#I     3                   Hours in 12-hour integer format (one or two digits)
     * > %p      PM                  AM or PM
     * >             == Minutes ==
     * > %M      09                  Minutes (two digits)
     * > %#M     9                   Minutes (one or two digits)
     * >             == Seconds ==
     * > %S      02                  Seconds (two digits)
     * > %#S     2                   Seconds (one or two digits)
     * > %s      1206567625723       Unix timestamp (Seconds past 1970-01-01 00:00:00)
     * >             == Milliseconds ==
     * > %N      008                 Milliseconds (three digits)
     * > %#N     8                   Milliseconds (one to three digits)
     * >             == Timezone ==
     * > %O      360                 difference in minutes between local time and GMT
     * > %Z      Mountain Standard Time  Name of timezone as reported by browser
     * > %G      -06:00              Hours and minutes between GMT
     * >             == Shortcuts ==
     * > %F      2008-03-26          %Y-%m-%d
     * > %T      05:06:30            %H:%M:%S
     * > %X      05:06:30            %H:%M:%S
     * > %x      03/26/08            %m/%d/%y
     * > %D      03/26/08            %m/%d/%y
     * > %#c     Wed Mar 26 15:31:00 2008  %a %b %e %H:%M:%S %Y
     * > %v      3-Sep-2008          %e-%b-%Y
     * > %R      15:31               %H:%M
     * > %r      3:31:00 PM          %I:%M:%S %p
     * >             == Characters ==
     * > %n      \n                  Newline
     * > %t      \t                  Tab
     * > %%      %                   Percent Symbol 
     */
    $.jqplot.DateAxisRenderer = function() {
        $.jqplot.LinearAxisRenderer.call(this);
        this.date = new $.jsDate();
    };

    var second = 1000;
    var minute = 60 * second;
    var hour = 60 * minute;
    var day = 24 * hour;
    var week = 7 * day;

    // these are less definitive
    var month = 30.4368499 * day;
    var year = 365.242199 * day;

    var daysInMonths = [31,28,31,30,31,30,31,30,31,30,31,30];
    // array of consistent nice intervals.  Longer intervals
    // will depend on days in month, days in year, etc.
    var niceFormatStrings = ['%M:%S.%#N', '%M:%S.%#N', '%M:%S.%#N', '%M:%S', '%M:%S', '%M:%S', '%M:%S', '%H:%M:%S', '%H:%M:%S', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%a %H:%M', '%a %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%v', '%v', '%v', '%v', '%v', '%v', '%v'];
    var niceIntervals = [0.1*second, 0.2*second, 0.5*second, second, 2*second, 5*second, 10*second, 15*second, 30*second, minute, 2*minute, 5*minute, 10*minute, 15*minute, 30*minute, hour, 2*hour, 4*hour, 6*hour, 8*hour, 12*hour, day, 2*day, 3*day, 4*day, 5*day, week, 2*week];

    var niceMonthlyIntervals = [];

    function bestDateInterval(min, max, titarget) {
        // iterate through niceIntervals to find one closest to titarget
        var badness = Number.MAX_VALUE;
        var temp, bestTi, bestfmt;
        for (var i=0, l=niceIntervals.length; i < l; i++) {
            temp = Math.abs(titarget - niceIntervals[i]);
            if (temp < badness) {
                badness = temp;
                bestTi = niceIntervals[i];
                bestfmt = niceFormatStrings[i];
            }
        }

        return [bestTi, bestfmt];
    }
    
    $.jqplot.DateAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.DateAxisRenderer.prototype.constructor = $.jqplot.DateAxisRenderer;
    
    $.jqplot.DateTickFormatter = function(format, val) {
        if (!format) {
            format = '%Y/%m/%d';
        }
        return $.jsDate.strftime(val, format);
    };
    
    $.jqplot.DateAxisRenderer.prototype.init = function(options){
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        // this.tickRenderer = $.jqplot.AxisTickRenderer;
        // this.labelRenderer = $.jqplot.AxisLabelRenderer;
        this.tickOptions.formatter = $.jqplot.DateTickFormatter;
        // prop: tickInset
        // Controls the amount to inset the first and last ticks from 
        // the edges of the grid, in multiples of the tick interval.
        // 0 is no inset, 0.5 is one half a tick interval, 1 is a full
        // tick interval, etc.
        this.tickInset = 0;
        // prop: drawBaseline
        // True to draw the axis baseline.
        this.drawBaseline = true;
        // prop: baselineWidth
        // width of the baseline in pixels.
        this.baselineWidth = null;
        // prop: baselineColor
        // CSS color spec for the baseline.
        this.baselineColor = null;
        this.daTickInterval = null;
        this._daTickInterval = null;
        
        $.extend(true, this, options);
        
        var db = this._dataBounds,
            stats, 
            sum,
            s,
            d,
            pd,
            sd,
            intv;
        
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            stats = {intervals:[], frequencies:{}, sortedIntervals:[], min:null, max:null, mean:null};
            sum = 0;
            s = this._series[i];
            d = s.data;
            pd = s._plotData;
            sd = s._stackData;
            intv = 0;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name == 'xaxis' || this.name == 'x2axis') {
                    d[j][0] = new $.jsDate(d[j][0]).getTime();
                    pd[j][0] = new $.jsDate(d[j][0]).getTime();
                    sd[j][0] = new $.jsDate(d[j][0]).getTime();
                    if ((d[j][0] != null && d[j][0] < db.min) || db.min == null) {
                        db.min = d[j][0];
                    }
                    if ((d[j][0] != null && d[j][0] > db.max) || db.max == null) {
                        db.max = d[j][0];
                    }
                    if (j>0) {
                        intv = Math.abs(d[j][0] - d[j-1][0]);
                        stats.intervals.push(intv);
                        if (stats.frequencies.hasOwnProperty(intv)) {
                            stats.frequencies[intv] += 1;
                        }
                        else {
                            stats.frequencies[intv] = 1;
                        }
                    }
                    sum += intv;
                    
                }              
                else {
                    d[j][1] = new $.jsDate(d[j][1]).getTime();
                    pd[j][1] = new $.jsDate(d[j][1]).getTime();
                    sd[j][1] = new $.jsDate(d[j][1]).getTime();
                    if ((d[j][1] != null && d[j][1] < db.min) || db.min == null) {
                        db.min = d[j][1];
                    }
                    if ((d[j][1] != null && d[j][1] > db.max) || db.max == null) {
                        db.max = d[j][1];
                    }
                    if (j>0) {
                        intv = Math.abs(d[j][1] - d[j-1][1]);
                        stats.intervals.push(intv);
                        if (stats.frequencies.hasOwnProperty(intv)) {
                            stats.frequencies[intv] += 1;
                        }
                        else {
                            stats.frequencies[intv] = 1;
                        }
                    }
                }
                sum += intv;              
            }

            if (s.renderer.bands) {
                if (s.renderer.bands.hiData.length) {
                    var bd = s.renderer.bands.hiData;
                    for (var j=0, l=bd.length; j < l; j++) {
                        if (this.name === 'xaxis' || this.name === 'x2axis') {
                            bd[j][0] = new $.jsDate(bd[j][0]).getTime();
                            if ((bd[j][0] != null && bd[j][0] > db.max) || db.max == null) {
                                db.max = bd[j][0];
                            }                        
                        }              
                        else {
                            bd[j][1] = new $.jsDate(bd[j][1]).getTime();
                            if ((bd[j][1] != null && bd[j][1] > db.max) || db.max == null) {
                                db.max = bd[j][1];
                            }
                        }
                    }
                }
                if (s.renderer.bands.lowData.length) {
                    var bd = s.renderer.bands.lowData;
                    for (var j=0, l=bd.length; j < l; j++) {
                        if (this.name === 'xaxis' || this.name === 'x2axis') {
                            bd[j][0] = new $.jsDate(bd[j][0]).getTime();
                            if ((bd[j][0] != null && bd[j][0] < db.min) || db.min == null) {
                                db.min = bd[j][0];
                            }                       
                        }              
                        else {
                            bd[j][1] = new $.jsDate(bd[j][1]).getTime();
                            if ((bd[j][1] != null && bd[j][1] < db.min) || db.min == null) {
                                db.min = bd[j][1];
                            }
                        }
                    }
                }
            }
            
            var tempf = 0,
                tempn=0;
            for (var n in stats.frequencies) {
                stats.sortedIntervals.push({interval:n, frequency:stats.frequencies[n]});
            }
            stats.sortedIntervals.sort(function(a, b){
                return b.frequency - a.frequency;
            });
            
            stats.min = $.jqplot.arrayMin(stats.intervals);
            stats.max = $.jqplot.arrayMax(stats.intervals);
            stats.mean = sum/d.length;
            this._intervalStats.push(stats);
            stats = sum = s = d = pd = sd = null;
        }
        db = null;
        
    };
    
    // called with scope of an axis
    $.jqplot.DateAxisRenderer.prototype.reset = function() {
        this.min = this._options.min;
        this.max = this._options.max;
        this.tickInterval = this._options.tickInterval;
        this.numberTicks = this._options.numberTicks;
        this._autoFormatString = '';
        if (this._overrideFormatString && this.tickOptions && this.tickOptions.formatString) {
            this.tickOptions.formatString = '';
        }
        this.daTickInterval = this._daTickInterval;
        // this._ticks = this.__ticks;
    };
    
    $.jqplot.DateAxisRenderer.prototype.createTicks = function(plot) {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
        var iv = this._intervalStats;
        var dim = (this.name.charAt(0) === 'x') ? this._plotDimensions.width : this._plotDimensions.height;
        var interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
        var threshold = 30;
        var insetMult = 1;
        var daTickInterval = null;
        
        // if user specified a tick interval, convert to usable.
        if (this.tickInterval != null)
        {
            // if interval is a number or can be converted to one, use it.
            // Assume it is in SECONDS!!!
            if (Number(this.tickInterval)) {
                daTickInterval = [Number(this.tickInterval), 'seconds'];
            }
            // else, parse out something we can build from.
            else if (typeof this.tickInterval == "string") {
                var parts = this.tickInterval.split(' ');
                if (parts.length == 1) {
                    daTickInterval = [1, parts[0]];
                }
                else if (parts.length == 2) {
                    daTickInterval = [parts[0], parts[1]];
                }
            }
        }

        var tickInterval = this.tickInterval;
        
        // if we already have ticks, use them.
        // ticks must be in order of increasing value.
        
        min = new $.jsDate((this.min != null) ? this.min : db.min).getTime();
        max = new $.jsDate((this.max != null) ? this.max : db.max).getTime();

        // see if we're zooming.  if we are, don't use the min and max we're given,
        // but compute some nice ones.  They will be reset later.

        var cursor = plot.plugins.cursor;

        if (cursor && cursor._zoom && cursor._zoom.zooming) {
            this.min = null;
            this.max = null;
        }

        var range = max - min;

        if (this.tickOptions == null || !this.tickOptions.formatString) {
            this._overrideFormatString = true;
        }
        
        if (userTicks.length) {
            // ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed
            for (i=0; i<userTicks.length; i++){
                var ut = userTicks[i];
                var t = new this.tickRenderer(this.tickOptions);
                if (ut.constructor == Array) {
                    t.value = new $.jsDate(ut[0]).getTime();
                    t.label = ut[1];
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(t.value, this.name);
                    this._ticks.push(t);
                }
                
                else {
                    t.value = new $.jsDate(ut).getTime();
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    t.setTick(t.value, this.name);
                    this._ticks.push(t);
                }
            }
            this.numberTicks = userTicks.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks-1].value;
            this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1)/1000, 'seconds'];
        }

        ////////
        // We don't have any ticks yet, let's make some!
        ////////

        // special case when there is only one point, make three tick marks to center the point
        else if (this.min == null && this.max == null && db.min == db.max)
        {
             var onePointOpts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null});
             var delta = 300000;
             this.min = db.min - delta;
             this.max = db.max + delta;
             this.numberTicks = 3;

             for(var i=this.min;i<=this.max;i+= delta)
             {
                 onePointOpts.value = i;

                 var t = new this.tickRenderer(onePointOpts);

                 if (this._overrideFormatString && this._autoFormatString != '') {
                    t.formatString = this._autoFormatString;
                 }

                 t.showLabel = false;
                 t.showMark = false;

                 this._ticks.push(t);
             }

             if(this.showTicks) {
                 this._ticks[1].showLabel = true;
             }
             if(this.showTickMarks) {
                 this._ticks[1].showTickMarks = true;
             }                   
        }
        // if user specified min and max are null, we set those to make best ticks.
        else if (this.min == null && this.max == null) {

            var opts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null});

            // want to find a nice interval 
            var nttarget,
                titarget;

            // if no tickInterval or numberTicks options specified,  make a good guess.
            if (!this.tickInterval && !this.numberTicks) {
                var tdim = Math.max(dim, threshold+1);
                // how many ticks to put on the axis?
                // date labels tend to be long.  If ticks not rotated,
                // don't use too many and have a high spacing factor.
                // If we are rotating ticks, use a lower factor.
                var spacingFactor = 115;
                if (this.tickRenderer === $.jqplot.CanvasAxisTickRenderer && this.tickOptions.angle) {
                    spacingFactor = 115 - 40 * Math.abs(Math.sin(this.tickOptions.angle/180*Math.PI));
                }

                nttarget =  Math.ceil((tdim-threshold)/spacingFactor + 1);
                titarget = (max - min) / (nttarget - 1);
            }

            // If tickInterval is specified, we'll try to honor it.
            // Not guaranteed to get this interval, but we'll get as close as
            // we can.
            // tickInterval will be used before numberTicks, that is if
            // both are specified, numberTicks will be ignored.
            else if (this.tickInterval) {
                titarget = new $.jsDate(0).add(daTickInterval[0], daTickInterval[1]).getTime();
            }

            // if numberTicks specified, try to honor it.
            // Not guaranteed, but will try to get close.
            else if (this.numberTicks) {
                nttarget = this.numberTicks;
                titarget = (max - min) / (nttarget - 1);
            }

            // If we can use an interval of 2 weeks or less, pick best one
            if (titarget <= 19*day) {
                var ret = bestDateInterval(min, max, titarget);
                var tempti = ret[0];
                this._autoFormatString = ret[1];

                min = new $.jsDate(min);
                min = Math.floor((min.getTime() - min.getUtcOffset())/tempti) * tempti + min.getUtcOffset();

                nttarget = Math.ceil((max - min) / tempti) + 1;
                this.min = min;
                this.max = min + (nttarget - 1) * tempti;

                // if max is less than max, add an interval
                if (this.max < max) {
                    this.max += tempti;
                    nttarget += 1;
                }
                this.tickInterval = tempti;
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    opts.value = this.min + i * tempti;
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = this.tickInterval;
            }

            // should we use a monthly interval?
            else if (titarget <= 9 * month) {

                this._autoFormatString = '%v';

                // how many months in an interval?
                var intv = Math.round(titarget/month);
                if (intv < 1) {
                    intv = 1;
                }
                else if (intv > 6) {
                    intv = 6;
                }

                // figure out the starting month and ending month.
                var mstart = new $.jsDate(min).setDate(1).setHours(0,0,0,0);

                // See if max ends exactly on a month
                var tempmend = new $.jsDate(max);
                var mend = new $.jsDate(max).setDate(1).setHours(0,0,0,0);

                if (tempmend.getTime() !== mend.getTime()) {
                    mend = mend.add(1, 'month');
                }

                var nmonths = mend.diff(mstart, 'month');

                nttarget = Math.ceil(nmonths/intv) + 1;

                this.min = mstart.getTime();
                this.max = mstart.clone().add((nttarget - 1) * intv, 'month').getTime();
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    if (i === 0) {
                        opts.value = mstart.getTime();
                    }
                    else {
                        opts.value = mstart.add(intv, 'month').getTime();
                    }
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = intv * month;
            }

            // use yearly intervals
            else {

                this._autoFormatString = '%v';

                // how many years in an interval?
                var intv = Math.round(titarget/year);
                if (intv < 1) {
                    intv = 1;
                }

                // figure out the starting and ending years.
                var mstart = new $.jsDate(min).setMonth(0, 1).setHours(0,0,0,0);
                var mend = new $.jsDate(max).add(1, 'year').setMonth(0, 1).setHours(0,0,0,0);

                var nyears = mend.diff(mstart, 'year');

                nttarget = Math.ceil(nyears/intv) + 1;

                this.min = mstart.getTime();
                this.max = mstart.clone().add((nttarget - 1) * intv, 'year').getTime();
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    if (i === 0) {
                        opts.value = mstart.getTime();
                    }
                    else {
                        opts.value = mstart.add(intv, 'year').getTime();
                    }
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = intv * year;
            }
        }

        ////////
        // Some option(s) specified, work around that.
        ////////
        
        else {      
            if (name == 'xaxis' || name == 'x2axis') {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
            
            if (this.tickInterval != null && daTickInterval != null) {
                this.daTickInterval = daTickInterval;
            }
            
            // if min and max are same, space them out a bit
            if (min == max) {
                var adj = 24*60*60*500;  // 1/2 day
                min -= adj;
                max += adj;
            }

            range = max - min;
            
            var optNumTicks = 2 + parseInt(Math.max(0, dim-100)/100, 10);
            
            
            var rmin, rmax;
            
            rmin = (this.min != null) ? new $.jsDate(this.min).getTime() : min - range/2*(this.padMin - 1);
            rmax = (this.max != null) ? new $.jsDate(this.max).getTime() : max + range/2*(this.padMax - 1);
            this.min = rmin;
            this.max = rmax;
            range = this.max - this.min;
            
            if (this.numberTicks == null){
                // if tickInterval is specified by user, we will ignore computed maximum.
                // max will be equal or greater to fit even # of ticks.
                if (this.daTickInterval != null) {
                    var nc = new $.jsDate(this.max).diff(this.min, this.daTickInterval[1], true);
                    this.numberTicks = Math.ceil(nc/this.daTickInterval[0]) +1;
                    // this.max = new $.jsDate(this.min).add(this.numberTicks-1, this.daTickInterval[1]).getTime();
                    this.max = new $.jsDate(this.min).add((this.numberTicks-1) * this.daTickInterval[0], this.daTickInterval[1]).getTime();
                }
                else if (dim > 200) {
                    this.numberTicks = parseInt(3+(dim-200)/100, 10);
                }
                else {
                    this.numberTicks = 2;
                }
            }
            
            insetMult = range / (this.numberTicks-1)/1000;

            if (this.daTickInterval == null) {
                this.daTickInterval = [insetMult, 'seconds'];
            }


            for (var i=0; i<this.numberTicks; i++){
                var min = new $.jsDate(this.min);
                tt = min.add(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
                var t = new this.tickRenderer(this.tickOptions);
                // var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
                if (!this.showTicks) {
                    t.showLabel = false;
                    t.showMark = false;
                }
                else if (!this.showTickMarks) {
                    t.showMark = false;
                }
                t.setTick(tt, this.name);
                this._ticks.push(t);
            }
        }

        if (this.tickInset) {
            this.min = this.min - this.tickInset * insetMult;
            this.max = this.max + this.tickInset * insetMult;
        }

        if (this._daTickInterval == null) {
            this._daTickInterval = this.daTickInterval;    
        }

        ticks = null;
    };
   
})(jQuery);


//next
//$.jqplot.Cursor

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */

(function($) {
    
    /**
     * Class: $.jqplot.Cursor
     * Plugin class representing the cursor as displayed on the plot.
     */
    $.jqplot.Cursor = function(options) {
        // Group: Properties
        //
        // prop: style
        // CSS spec for cursor style
        this.style = 'crosshair';
        this.previousCursor = 'auto';
        // prop: show
        // whether to show the cursor or not.
        this.show = $.jqplot.config.enablePlugins;
        // prop: showTooltip
        // show a cursor position tooltip.  Location of the tooltip
        // will be controlled by followMouse and tooltipLocation.
        this.showTooltip = true;
        // prop: followMouse
        // Tooltip follows the mouse, it is not at a fixed location.
        // Tooltip will show on the grid at the location given by
        // tooltipLocation, offset from the grid edge by tooltipOffset.
        this.followMouse = false;
        // prop: tooltipLocation
        // Where to position tooltip.  If followMouse is true, this is
        // relative to the cursor, otherwise, it is relative to the grid.
        // One of 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.tooltipLocation = 'se';
        // prop: tooltipOffset
        // Pixel offset of tooltip from the grid boudaries or cursor center.
        this.tooltipOffset = 6;
        // prop: showTooltipGridPosition
        // show the grid pixel coordinates of the mouse.
        this.showTooltipGridPosition = false;
        // prop: showTooltipUnitPosition
        // show the unit (data) coordinates of the mouse.
        this.showTooltipUnitPosition = true;
        // prop: showTooltipDataPosition
        // Used with showVerticalLine to show intersecting data points in the tooltip.
        this.showTooltipDataPosition = false;
        // prop: tooltipFormatString
        // sprintf format string for the tooltip.
        // Uses Ash Searle's javascript sprintf implementation
        // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
        // See http://perldoc.perl.org/functions/sprintf.html for reference
        // Note, if showTooltipDataPosition is true, the default tooltipFormatString
        // will be set to the cursorLegendFormatString, not the default given here.
        this.tooltipFormatString = '%.4P, %.4P';
        // prop: useAxesFormatters
        // Use the x and y axes formatters to format the text in the tooltip.
        this.useAxesFormatters = true;
        // prop: tooltipAxisGroups
        // Show position for the specified axes.
        // This is an array like [['xaxis', 'yaxis'], ['xaxis', 'y2axis']]
        // Default is to compute automatically for all visible axes.
        this.tooltipAxisGroups = [];
        // prop: zoom
        // Enable plot zooming.
        this.zoom = false;
        // zoomProxy and zoomTarget properties are not directly set by user.  
        // They Will be set through call to zoomProxy method.
        this.zoomProxy = false;
        this.zoomTarget = false;
        // prop: looseZoom
        // Will expand zoom range to provide more rounded tick values.
        // Works only with linear, log and date axes.
        this.looseZoom = true;
        // prop: clickReset
        // Will reset plot zoom if single click on plot without drag.
        this.clickReset = false;
        // prop: dblClickReset
        // Will reset plot zoom if double click on plot without drag.
        this.dblClickReset = true;
        // prop: showVerticalLine
        // draw a vertical line across the plot which follows the cursor.
        // When the line is near a data point, a special legend and/or tooltip can
        // be updated with the data values.
        this.showVerticalLine = false;
        // prop: showHorizontalLine
        // draw a horizontal line across the plot which follows the cursor.
        this.showHorizontalLine = false;
        // prop: constrainZoomTo
        // 'none', 'x' or 'y'
        this.constrainZoomTo = 'none';
        // // prop: autoscaleConstraint
        // // when a constrained axis is specified, true will
        // // auatoscale the adjacent axis.
        // this.autoscaleConstraint = true;
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        this._zoom = {start:[], end:[], started: false, zooming:false, isZoomed:false, axes:{start:{}, end:{}}, gridpos:{}, datapos:{}};
        this._tooltipElem;
        this.zoomCanvas;
        this.cursorCanvas;
        // prop: intersectionThreshold
        // pixel distance from data point or marker to consider cursor lines intersecting with point.
        // If data point markers are not shown, this should be >= 1 or will often miss point intersections.
        this.intersectionThreshold = 2;
        // prop: showCursorLegend
        // Replace the plot legend with an enhanced legend displaying intersection information.
        this.showCursorLegend = false;
        // prop: cursorLegendFormatString
        // Format string used in the cursor legend.  If showTooltipDataPosition is true,
        // this will also be the default format string used by tooltipFormatString.
        this.cursorLegendFormatString = $.jqplot.Cursor.cursorLegendFormatString;
        // whether the cursor is over the grid or not.
        this._oldHandlers = {onselectstart: null, ondrag: null, onmousedown: null};
        // prop: constrainOutsideZoom
        // True to limit actual zoom area to edges of grid, even when zooming
        // outside of plot area.  That is, can't zoom out by mousing outside plot.
        this.constrainOutsideZoom = true;
        // prop: showTooltipOutsideZoom
        // True will keep updating the tooltip when zooming of the grid.
        this.showTooltipOutsideZoom = false;
        // true if mouse is over grid, false if not.
        this.onGrid = false;
        $.extend(true, this, options);
    };
    
    $.jqplot.Cursor.cursorLegendFormatString = '%s x:%s, y:%s';
    
    // called with scope of plot
    $.jqplot.Cursor.init = function (target, data, opts){
        // add a cursor attribute to the plot
        var options = opts || {};
        this.plugins.cursor = new $.jqplot.Cursor(options.cursor);
        var c = this.plugins.cursor;

        if (c.show) {
            $.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
            $.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
            $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMouseMove]);
            
            if (c.showCursorLegend) {              
                opts.legend = opts.legend || {};
                opts.legend.renderer =  $.jqplot.CursorLegendRenderer;
                opts.legend.formatString = this.plugins.cursor.cursorLegendFormatString;
                opts.legend.show = true;
            }
            
            if (c.zoom) {
                $.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleMouseDown]);
                
                if (c.clickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotClick', handleClick]);
                }
                
                if (c.dblClickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotDblClick', handleDblClick]);
                }             
            }
    
            this.resetZoom = function() {
                var axes = this.axes;
                if (!c.zoomProxy) {
                    for (var ax in axes) {
                        axes[ax].reset();
                        axes[ax]._ticks = [];
                        // fake out tick creation algorithm to make sure original auto
                        // computed format string is used if _overrideFormatString is true
                        if (c._zoom.axes[ax] !== undefined) {
                            axes[ax]._autoFormatString = c._zoom.axes[ax].tickFormatString;
                        }
                    }
                    this.redraw();
                }
                else {
                    var ctx = this.plugins.cursor.zoomCanvas._ctx;
                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                    ctx = null;
                }
                this.plugins.cursor._zoom.isZoomed = false;
                this.target.trigger('jqplotResetZoom', [this, this.plugins.cursor]);
            };
            

            if (c.showTooltipDataPosition) {
                c.showTooltipUnitPosition = false;
                c.showTooltipGridPosition = false;
                if (options.cursor.tooltipFormatString == undefined) {
                    c.tooltipFormatString = $.jqplot.Cursor.cursorLegendFormatString;
                }
            }
        }
    };
    
    // called with context of plot
    $.jqplot.Cursor.postDraw = function() {
        var c = this.plugins.cursor;
        
        // Memory Leaks patch
        if (c.zoomCanvas) {
            c.zoomCanvas.resetCanvas();
            c.zoomCanvas = null;
        }
        
        if (c.cursorCanvas) {
            c.cursorCanvas.resetCanvas();
            c.cursorCanvas = null;
        }
        
        if (c._tooltipElem) {
            c._tooltipElem.emptyForce();
            c._tooltipElem = null;
        }

        
        if (c.zoom) {
            c.zoomCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding, 'jqplot-zoom-canvas', this._plotDimensions, this));
            c.zoomCanvas.setContext();
        }

        var elem = document.createElement('div');
        c._tooltipElem = $(elem);
        elem = null;
        c._tooltipElem.addClass('jqplot-cursor-tooltip');
        c._tooltipElem.css({position:'absolute', display:'none'});
        
        
        if (c.zoomCanvas) {
            c.zoomCanvas._elem.before(c._tooltipElem);
        }

        else {
            this.eventCanvas._elem.before(c._tooltipElem);
        }

        if (c.showVerticalLine || c.showHorizontalLine) {
            c.cursorCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.cursorCanvas.createElement(this._gridPadding, 'jqplot-cursor-canvas', this._plotDimensions, this));
            c.cursorCanvas.setContext();
        }

        // if we are showing the positions in unit coordinates, and no axes groups
        // were specified, create a default set.
        if (c.showTooltipUnitPosition){
            if (c.tooltipAxisGroups.length === 0) {
                var series = this.series;
                var s;
                var temp = [];
                for (var i=0; i<series.length; i++) {
                    s = series[i];
                    var ax = s.xaxis+','+s.yaxis;
                    if ($.inArray(ax, temp) == -1) {
                        temp.push(ax);
                    }
                }
                for (var i=0; i<temp.length; i++) {
                    c.tooltipAxisGroups.push(temp[i].split(','));
                }
            }
        }
    };
    
    // Group: methods
    //
    // method: $.jqplot.Cursor.zoomProxy
    // links targetPlot to controllerPlot so that plot zooming of
    // targetPlot will be controlled by zooming on the controllerPlot.
    // controllerPlot will not actually zoom, but acts as an
    // overview plot.  Note, the zoom options must be set to true for
    // zoomProxy to work.
    $.jqplot.Cursor.zoomProxy = function(targetPlot, controllerPlot) {
        var tc = targetPlot.plugins.cursor;
        var cc = controllerPlot.plugins.cursor;
        tc.zoomTarget = true;
        tc.zoom = true;
        tc.style = 'auto';
        tc.dblClickReset = false;
        cc.zoom = true;
        cc.zoomProxy = true;
              
        controllerPlot.target.bind('jqplotZoom', plotZoom);
        controllerPlot.target.bind('jqplotResetZoom', plotReset);

        function plotZoom(ev, gridpos, datapos, plot, cursor) {
            tc.doZoom(gridpos, datapos, targetPlot, cursor);
        } 

        function plotReset(ev, plot, cursor) {
            targetPlot.resetZoom();
        }
    };
    
    $.jqplot.Cursor.prototype.resetZoom = function(plot, cursor) {
        var axes = plot.axes;
        var cax = cursor._zoom.axes;
        if (!plot.plugins.cursor.zoomProxy && cursor._zoom.isZoomed) {
            for (var ax in axes) {
                // axes[ax]._ticks = [];
                // axes[ax].min = cax[ax].min;
                // axes[ax].max = cax[ax].max;
                // axes[ax].numberTicks = cax[ax].numberTicks; 
                // axes[ax].tickInterval = cax[ax].tickInterval;
                // // for date axes
                // axes[ax].daTickInterval = cax[ax].daTickInterval;
                axes[ax].reset();
                axes[ax]._ticks = [];
                // fake out tick creation algorithm to make sure original auto
                // computed format string is used if _overrideFormatString is true
                axes[ax]._autoFormatString = cax[ax].tickFormatString;
            }
            plot.redraw();
            cursor._zoom.isZoomed = false;
        }
        else {
            var ctx = cursor.zoomCanvas._ctx;
            ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
            ctx = null;
        }
        plot.target.trigger('jqplotResetZoom', [plot, cursor]);
    };
    
    $.jqplot.Cursor.resetZoom = function(plot) {
        plot.resetZoom();
    };
    
    $.jqplot.Cursor.prototype.doZoom = function (gridpos, datapos, plot, cursor) {
        var c = cursor;
        var axes = plot.axes;
        var zaxes = c._zoom.axes;
        var start = zaxes.start;
        var end = zaxes.end;
        var min, max, dp, span,
            newmin, newmax, curax, _numberTicks, ret;
        var ctx = plot.plugins.cursor.zoomCanvas._ctx;
        // don't zoom if zoom area is too small (in pixels)
        if ((c.constrainZoomTo == 'none' && Math.abs(gridpos.x - c._zoom.start[0]) > 6 && Math.abs(gridpos.y - c._zoom.start[1]) > 6) || (c.constrainZoomTo == 'x' && Math.abs(gridpos.x - c._zoom.start[0]) > 6) ||  (c.constrainZoomTo == 'y' && Math.abs(gridpos.y - c._zoom.start[1]) > 6)) {
            if (!plot.plugins.cursor.zoomProxy) {
                for (var ax in datapos) {
                    // make a copy of the original axes to revert back.
                    if (c._zoom.axes[ax] == undefined) {
                        c._zoom.axes[ax] = {};
                        c._zoom.axes[ax].numberTicks = axes[ax].numberTicks;
                        c._zoom.axes[ax].tickInterval = axes[ax].tickInterval;
                        // for date axes...
                        c._zoom.axes[ax].daTickInterval = axes[ax].daTickInterval;
                        c._zoom.axes[ax].min = axes[ax].min;
                        c._zoom.axes[ax].max = axes[ax].max;
                        c._zoom.axes[ax].tickFormatString = (axes[ax].tickOptions != null) ? axes[ax].tickOptions.formatString :  '';
                    }


                    if ((c.constrainZoomTo == 'none') || (c.constrainZoomTo == 'x' && ax.charAt(0) == 'x') || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'y')) {   
                        dp = datapos[ax];
                        if (dp != null) {           
                            if (dp > start[ax]) { 
                                newmin = start[ax];
                                newmax = dp;
                            }
                            else {
                                span = start[ax] - dp;
                                newmin = dp;
                                newmax = start[ax];
                            }

                            curax = axes[ax];

                            _numberTicks = null;

                            // if aligning this axis, use number of ticks from previous axis.
                            // Do I need to reset somehow if alignTicks is changed and then graph is replotted??
                            if (curax.alignTicks) {
                                if (curax.name === 'x2axis' && plot.axes.xaxis.show) {
                                    _numberTicks = plot.axes.xaxis.numberTicks;
                                }
                                else if (curax.name.charAt(0) === 'y' && curax.name !== 'yaxis' && curax.name !== 'yMidAxis' && plot.axes.yaxis.show) {
                                    _numberTicks = plot.axes.yaxis.numberTicks;
                                }
                            }
                            
                            if (this.looseZoom && (axes[ax].renderer.constructor === $.jqplot.LinearAxisRenderer || axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer )) { //} || axes[ax].renderer.constructor === $.jqplot.DateAxisRenderer)) {

                                ret = $.jqplot.LinearTickGenerator(newmin, newmax, curax._scalefact, _numberTicks);

                                // if new minimum is less than "true" minimum of axis display, adjust it
                                if (axes[ax].tickInset && ret[0] < axes[ax].min + axes[ax].tickInset * axes[ax].tickInterval) {
                                    ret[0] += ret[4];
                                    ret[2] -= 1;
                                }

                                // if new maximum is greater than "true" max of axis display, adjust it
                                if (axes[ax].tickInset && ret[1] > axes[ax].max - axes[ax].tickInset * axes[ax].tickInterval) {
                                    ret[1] -= ret[4];
                                    ret[2] -= 1;
                                }

                                // for log axes, don't fall below current minimum, this will look bad and can't have 0 in range anyway.
                                if (axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer && ret[0] < axes[ax].min) {
                                    // remove a tick and shift min up
                                    ret[0] += ret[4];
                                    ret[2] -= 1;
                                }

                                axes[ax].min = ret[0];
                                axes[ax].max = ret[1];
                                axes[ax]._autoFormatString = ret[3];
                                axes[ax].numberTicks = ret[2];
                                axes[ax].tickInterval = ret[4];
                                // for date axes...
                                axes[ax].daTickInterval = [ret[4]/1000, 'seconds'];
                            }
                            else {
                                axes[ax].min = newmin;
                                axes[ax].max = newmax;
                                axes[ax].tickInterval = null;
                                axes[ax].numberTicks = null;
                                // for date axes...
                                axes[ax].daTickInterval = null;
                            }

                            axes[ax]._ticks = [];
                        }
                    }
                            
                    // if ((c.constrainZoomTo == 'x' && ax.charAt(0) == 'y' && c.autoscaleConstraint) || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'x' && c.autoscaleConstraint)) {
                    //     dp = datapos[ax];
                    //     if (dp != null) {
                    //         axes[ax].max == null;
                    //         axes[ax].min = null;
                    //     }
                    // }
                }
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                plot.redraw();
                c._zoom.isZoomed = true;
                ctx = null;
            }
            plot.target.trigger('jqplotZoom', [gridpos, datapos, plot, cursor]);
        }
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Cursor.init);
    $.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);
    
    function updateTooltip(gridpos, datapos, plot) {
        var c = plot.plugins.cursor;
        var s = '';
        var addbr = false;
        if (c.showTooltipGridPosition) {
            s = gridpos.x+', '+gridpos.y;
            addbr = true;
        }
        if (c.showTooltipUnitPosition) {
            var g;
            for (var i=0; i<c.tooltipAxisGroups.length; i++) {
                g = c.tooltipAxisGroups[i];
                if (addbr) {
                    s += '<br />';
                }
                if (c.useAxesFormatters) {
                    for (var j=0; j<g.length; j++) {
                        if (j) {
                            s += ', ';
                        }
                        var af = plot.axes[g[j]]._ticks[0].formatter;
                        var afstr = plot.axes[g[j]]._ticks[0].formatString;
                        s += af(afstr, datapos[g[j]]);
                    }
                }
                else {
                    s += $.jqplot.sprintf(c.tooltipFormatString, datapos[g[0]], datapos[g[1]]);
                }
                addbr = true;
            }
        }
        
        if (c.showTooltipDataPosition) {
            var series = plot.series; 
            var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
            var addbr = false;
        
            for (var i = 0; i< series.length; i++) {
                if (series[i].show) {
                    var idx = series[i].index;
                    var label = series[i].label.toString();
                    var cellid = $.inArray(idx, ret.indices);
                    var sx = undefined;
                    var sy = undefined;
                    if (cellid != -1) {
                        var data = ret.data[cellid].data;
                        if (c.useAxesFormatters) {
                            var xf = series[i]._xaxis._ticks[0].formatter;
                            var yf = series[i]._yaxis._ticks[0].formatter;
                            var xfstr = series[i]._xaxis._ticks[0].formatString;
                            var yfstr = series[i]._yaxis._ticks[0].formatString;
                            sx = xf(xfstr, data[0]);
                            sy = yf(yfstr, data[1]);
                        }
                        else {
                            sx = data[0];
                            sy = data[1];
                        }
                        if (addbr) {
                            s += '<br />';
                        }
                        s += $.jqplot.sprintf(c.tooltipFormatString, label, sx, sy);
                        addbr = true;
                    }
                }
            }
            
        }
        c._tooltipElem.html(s);
    }
    
    function moveLine(gridpos, plot) {
        var c = plot.plugins.cursor;
        var ctx = c.cursorCanvas._ctx;
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        if (c.showVerticalLine) {
            c.shapeRenderer.draw(ctx, [[gridpos.x, 0], [gridpos.x, ctx.canvas.height]]);
        }
        if (c.showHorizontalLine) {
            c.shapeRenderer.draw(ctx, [[0, gridpos.y], [ctx.canvas.width, gridpos.y]]);
        }
        var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
        if (c.showCursorLegend) {
            var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
            for (var i=0; i<cells.length; i++) {
                var idx = $(cells[i]).data('seriesIndex');
                var series = plot.series[idx];
                var label = series.label.toString();
                var cellid = $.inArray(idx, ret.indices);
                var sx = undefined;
                var sy = undefined;
                if (cellid != -1) {
                    var data = ret.data[cellid].data;
                    if (c.useAxesFormatters) {
                        var xf = series._xaxis._ticks[0].formatter;
                        var yf = series._yaxis._ticks[0].formatter;
                        var xfstr = series._xaxis._ticks[0].formatString;
                        var yfstr = series._yaxis._ticks[0].formatString;
                        sx = xf(xfstr, data[0]);
                        sy = yf(yfstr, data[1]);
                    }
                    else {
                        sx = data[0];
                        sy = data[1];
                    }
                }
                if (plot.legend.escapeHtml) {
                    $(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                }
                else {
                    $(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                }
            }        
        }
        ctx = null;
    }
        
    function getIntersectingPoints(plot, x, y) {
        var ret = {indices:[], data:[]};
        var s, i, d0, d, j, r, p;
        var threshold;
        var c = plot.plugins.cursor;
        for (var i=0; i<plot.series.length; i++) {
            s = plot.series[i];
            r = s.renderer;
            if (s.show) {
                threshold = c.intersectionThreshold;
                if (s.showMarker) {
                    threshold += s.markerRenderer.size/2;
                }
                for (var j=0; j<s.gridData.length; j++) {
                    p = s.gridData[j];
                    // check vertical line
                    if (c.showVerticalLine) {
                        if (Math.abs(x-p[0]) <= threshold) {
                            ret.indices.push(i);
                            ret.data.push({seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]});
                        }
                    }
                } 
            }
        }
        return ret;
    }
   
    function moveTooltip(gridpos, plot)
    {
        var c = plot.plugins.cursor;
        var elem = c._tooltipElem;
        var tooltipOffset = c.tooltipOffset;
        var startPosX = gridpos.x + plot._gridPadding.left;
        var x = startPosX;
        var startPosY = gridpos.y + plot._gridPadding.top;
        var y = startPosY;
        var outerW = elem.outerWidth(true);
        var outerH = elem.outerHeight(true);

        switch (c.tooltipLocation)
        {
            case 'nw':
                x = (x - outerW - tooltipOffset);
                y =  (y - tooltipOffset - outerH);
                break;
            case 'n':
                x -= (outerW >> 1);
                y = (y - tooltipOffset - outerH);
                break;
            case 'ne':
                x += tooltipOffset;
                y = (y - tooltipOffset - outerH);
                break;
            case 'e':
                x += tooltipOffset;
                y -= (outerH >> 1);
                break;
            case 'se':
                x += tooltipOffset;
                y += tooltipOffset;
                break;
            case 's':
                x -= (outerW >> 1);
                y += tooltipOffset;
                break;
            case 'sw':
                x =  (x - outerW - tooltipOffset);
                y += tooltipOffset;
                break;
            case 'w':
                x = (x - outerW - tooltipOffset);
                y -= (outerH >> 1);
                break;
            default:
                x += tooltipOffset;
                y += tooltipOffset;
                break;
        }

        var parent = elem.parent();

        if (x < 0)
            x = (startPosX + tooltipOffset);
        else if (parent.length && ((x + outerW) > parent.width()))
            x = (startPosX - outerW - tooltipOffset);

        if (y < 0)
            y = (startPosY + tooltipOffset);
        else if (parent.length && ((y + outerH) > parent.height()))
            y = (startPosY - tooltipOffset - outerH);

        elem.css('left', x);
        elem.css('top', y);
        elem = null;
    }

    
    /*function moveTooltip(gridpos, plot) {
        var c = plot.plugins.cursor;  
        var elem = c._tooltipElem;
        switch (c.tooltipLocation) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default:
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
        }
            
        elem.css('left', x);
        elem.css('top', y);
        elem = null;
    }*/
    
    function positionTooltip(plot) { 
        // fake a grid for positioning
        var grid = plot._gridPadding; 
        var c = plot.plugins.cursor;
        var elem = c._tooltipElem;  
        switch (c.tooltipLocation) {
            case 'nw':
                var a = grid.left + c.tooltipOffset;
                var b = grid.top + c.tooltipOffset;
                elem.css('left', a);
                elem.css('top', b);
                break;
            case 'n':
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.top + c.tooltipOffset;
                elem.css('left', a);
                elem.css('top', b);
                break;
            case 'ne':
                var a = grid.right + c.tooltipOffset;
                var b = grid.top + c.tooltipOffset;
                elem.css({right:a, top:b});
                break;
            case 'e':
                var a = grid.right + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({right:a, top:b});
                break;
            case 'se':
                var a = grid.right + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
            case 's':
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'sw':
                var a = grid.left + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'w':
                var a = grid.left + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({left:a, top:b});
                break;
            default:  // same as 'se'
                var a = grid.right - c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
        }
        elem = null;
    }
    
    function handleClick (ev, gridpos, datapos, neighbor, plot) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        var c = plot.plugins.cursor;
        if (c.clickReset) {
            c.resetZoom(plot, c);
        }
        var sel = window.getSelection;
        if (document.selection && document.selection.empty)
        {
            document.selection.empty();
        }
        else if (sel && !sel().isCollapsed) {
            sel().collapse();
        }
        return false;
    }
    
    function handleDblClick (ev, gridpos, datapos, neighbor, plot) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        var c = plot.plugins.cursor;
        if (c.dblClickReset) {
            c.resetZoom(plot, c);
        }
        var sel = window.getSelection;
        if (document.selection && document.selection.empty)
        {
            document.selection.empty();
        }
        else if (sel && !sel().isCollapsed) {
            sel().collapse();
        }
        return false;
    }
    
    function handleMouseLeave(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        c.onGrid = false;
        if (c.show) {
            $(ev.target).css('cursor', c.previousCursor);
            if (c.showTooltip && !(c._zoom.zooming && c.showTooltipOutsideZoom && !c.constrainOutsideZoom)) {
                c._tooltipElem.empty();
                c._tooltipElem.hide();
            }
            if (c.zoom) {
                c._zoom.gridpos = gridpos;
                c._zoom.datapos = datapos;
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                var ctx = c.cursorCanvas._ctx;
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                ctx = null;
            }
            if (c.showCursorLegend) {
                var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
                for (var i=0; i<cells.length; i++) {
                    var idx = $(cells[i]).data('seriesIndex');
                    var series = plot.series[idx];
                    var label = series.label.toString();
                    if (plot.legend.escapeHtml) {
                        $(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
                    }
                    else {
                        $(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
                    }
                
                }        
            }
        }
    }
    
    function handleMouseEnter(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        c.onGrid = true;
        if (c.show) {
            c.previousCursor = ev.target.style.cursor;
            ev.target.style.cursor = c.style;
            if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
                else {
                    positionTooltip(plot);
                }
                c._tooltipElem.show();
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                moveLine(gridpos, plot);
            }
        }

    }    
    
    function handleMouseMove(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        if (c.show) {
            if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                moveLine(gridpos, plot);
            }
        }
    }
            
    function getEventPosition(ev) {
        var plot = ev.data.plot;
        var go = plot.eventCanvas._elem.offset();
        var gridPos = {x:ev.pageX - go.left, y:ev.pageY - go.top};
        //////
        // TO DO: handle yMidAxis
        //////
        var dataPos = {xaxis:null, yaxis:null, x2axis:null, y2axis:null, y3axis:null, y4axis:null, y5axis:null, y6axis:null, y7axis:null, y8axis:null, y9axis:null, yMidAxis:null};
        var an = ['xaxis', 'yaxis', 'x2axis', 'y2axis', 'y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis', 'yMidAxis'];
        var ax = plot.axes;
        var n, axis;
        for (n=11; n>0; n--) {
            axis = an[n-1];
            if (ax[axis].show) {
                dataPos[axis] = ax[axis].series_p2u(gridPos[axis.charAt(0)]);
            }
        }

        return {offsets:go, gridPos:gridPos, dataPos:dataPos};
    }    
    
    function handleZoomMove(ev) {
        var plot = ev.data.plot;
        var c = plot.plugins.cursor;
        // don't do anything if not on grid.
        if (c.show && c.zoom && c._zoom.started && !c.zoomTarget) {
            ev.preventDefault();
            var ctx = c.zoomCanvas._ctx;
            var positions = getEventPosition(ev);
            var gridpos = positions.gridPos;
            var datapos = positions.dataPos;
            c._zoom.gridpos = gridpos;
            c._zoom.datapos = datapos;
            c._zoom.zooming = true;
            var xpos = gridpos.x;
            var ypos = gridpos.y;
            var height = ctx.canvas.height;
            var width = ctx.canvas.width;
            if (c.showTooltip && !c.onGrid && c.showTooltipOutsideZoom) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
            }
            if (c.constrainZoomTo == 'x') {
                c._zoom.end = [xpos, height];
            }
            else if (c.constrainZoomTo == 'y') {
                c._zoom.end = [width, ypos];
            }
            else {
                c._zoom.end = [xpos, ypos];
            }
            var sel = window.getSelection;
            if (document.selection && document.selection.empty)
            {
                document.selection.empty();
            }
            else if (sel && !sel().isCollapsed) {
                sel().collapse();
            }
            drawZoomBox.call(c);
            ctx = null;
        }
    }
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        if(plot.plugins.mobile){
            $(document).one('vmouseup.jqplot_cursor', {plot:plot}, handleMouseUp);
        } else {
            $(document).one('mouseup.jqplot_cursor', {plot:plot}, handleMouseUp);
        }
        var axes = plot.axes;
        if (document.onselectstart != undefined) {
            c._oldHandlers.onselectstart = document.onselectstart;
            document.onselectstart = function () { return false; };
        }
        if (document.ondrag != undefined) {
            c._oldHandlers.ondrag = document.ondrag;
            document.ondrag = function () { return false; };
        }
        if (document.onmousedown != undefined) {
            c._oldHandlers.onmousedown = document.onmousedown;
            document.onmousedown = function () { return false; };
        }
        if (c.zoom) {
            if (!c.zoomProxy) {
                var ctx = c.zoomCanvas._ctx;
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                ctx = null;
            }
            if (c.constrainZoomTo == 'x') {
                c._zoom.start = [gridpos.x, 0];
            }
            else if (c.constrainZoomTo == 'y') {
                c._zoom.start = [0, gridpos.y];
            }
            else {
                c._zoom.start = [gridpos.x, gridpos.y];
            }
            c._zoom.started = true;
            for (var ax in datapos) {
                // get zoom starting position.
                c._zoom.axes.start[ax] = datapos[ax];
            }  
           if(plot.plugins.mobile){
                $(document).bind('vmousemove.jqplotCursor', {plot:plot}, handleZoomMove);              
            } else {
                $(document).bind('mousemove.jqplotCursor', {plot:plot}, handleZoomMove);              
            }

        }
    }
    
    function handleMouseUp(ev) {
        var plot = ev.data.plot;
        var c = plot.plugins.cursor;
        if (c.zoom && c._zoom.zooming && !c.zoomTarget) {
            var xpos = c._zoom.gridpos.x;
            var ypos = c._zoom.gridpos.y;
            var datapos = c._zoom.datapos;
            var height = c.zoomCanvas._ctx.canvas.height;
            var width = c.zoomCanvas._ctx.canvas.width;
            var axes = plot.axes;
            
            if (c.constrainOutsideZoom && !c.onGrid) {
                if (xpos < 0) { xpos = 0; }
                else if (xpos > width) { xpos = width; }
                if (ypos < 0) { ypos = 0; }
                else if (ypos > height) { ypos = height; }
                
                for (var axis in datapos) {
                    if (datapos[axis]) {
                        if (axis.charAt(0) == 'x') {
                            datapos[axis] = axes[axis].series_p2u(xpos);
                        }
                        else {
                            datapos[axis] = axes[axis].series_p2u(ypos);
                        }
                    }
                }
            }
            
            if (c.constrainZoomTo == 'x') {
                ypos = height;
            }
            else if (c.constrainZoomTo == 'y') {
                xpos = width;
            }
            c._zoom.end = [xpos, ypos];
            c._zoom.gridpos = {x:xpos, y:ypos};
            
            c.doZoom(c._zoom.gridpos, datapos, plot, c);
        }
        c._zoom.started = false;
        c._zoom.zooming = false;
        
        $(document).unbind('mousemove.jqplotCursor', handleZoomMove);
        
        if (document.onselectstart != undefined && c._oldHandlers.onselectstart != null){
            document.onselectstart = c._oldHandlers.onselectstart;
            c._oldHandlers.onselectstart = null;
        }
        if (document.ondrag != undefined && c._oldHandlers.ondrag != null){
            document.ondrag = c._oldHandlers.ondrag;
            c._oldHandlers.ondrag = null;
        }
        if (document.onmousedown != undefined && c._oldHandlers.onmousedown != null){
            document.onmousedown = c._oldHandlers.onmousedown;
            c._oldHandlers.onmousedown = null;
        }

    }
    
    function drawZoomBox() {
        var start = this._zoom.start;
        var end = this._zoom.end;
        var ctx = this.zoomCanvas._ctx;
        var l, t, h, w;
        if (end[0] > start[0]) {
            l = start[0];
            w = end[0] - start[0];
        }
        else {
            l = end[0];
            w = start[0] - end[0];
        }
        if (end[1] > start[1]) {
            t = start[1];
            h = end[1] - start[1];
        }
        else {
            t = end[1];
            h = start[1] - end[1];
        }
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1.0;
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        ctx.clearRect(l, t, w, h);
        // IE won't show transparent fill rect, so stroke a rect also.
        ctx.strokeRect(l,t,w,h);
        ctx = null;
    }
    
    $.jqplot.CursorLegendRenderer = function(options) {
        $.jqplot.TableLegendRenderer.call(this, options);
        this.formatString = '%s';
    };
    
    $.jqplot.CursorLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.CursorLegendRenderer.prototype.constructor = $.jqplot.CursorLegendRenderer;
    
    // called in context of a Legend
    $.jqplot.CursorLegendRenderer.prototype.draw = function() {
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null;
        }
        if (this.show) {
            var series = this._series, s;
            // make a table.  one line label per row.
            var elem = document.createElement('table');
            this._elem = $(elem);
            elem = null;
            this._elem.addClass('jqplot-legend jqplot-cursor-legend');
            this._elem.css('position', 'absolute');
        
            var pad = false;
            for (var i = 0; i< series.length; i++) {
                s = series[i];
                if (s.show && s.showLabel) {
                    var lt = $.jqplot.sprintf(this.formatString, s.label.toString());
                    if (lt) {
                        var color = s.color;
                        if (s._stack && !s.fill) {
                            color = '';
                        }
                        addrow.call(this, lt, color, pad, i);
                        pad = true;
                    }
                    // let plugins add more rows to legend.  Used by trend line plugin.
                    for (var j=0; j<$.jqplot.addLegendRowHooks.length; j++) {
                        var item = $.jqplot.addLegendRowHooks[j].call(this, s);
                        if (item) {
                            addrow.call(this, item.label, item.color, pad);
                            pad = true;
                        } 
                    }
                }
            }
            series = s = null;
            delete series;
            delete s;
        }
        
        function addrow(label, color, pad, idx) {
            var rs = (pad) ? this.rowSpacing : '0';
            var tr = $('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem);
            tr.data('seriesIndex', idx);
            $('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:'+rs+';">'+
                '<div style="border:1px solid #cccccc;padding:0.2em;">'+
                '<div class="jqplot-cursor-legend-swatch" style="background-color:'+color+';"></div>'+
                '</div></td>').appendTo(tr);
            var td = $('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:'+rs+';"></td>');
            td.appendTo(tr);
            td.data('seriesIndex', idx);
            if (this.escapeHtml) {
                td.text(label);
            }
            else {
                td.html(label);
            }
            tr = null;
            td = null;
        }
        return this._elem;
    };
    
})(jQuery);


//next
//$.jqplot.Highlighter


/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */

(function($) {
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
    
    /**
     * Class: $.jqplot.Highlighter
     * Plugin which will highlight data points when they are moused over.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.highlighter.js"></script>
     * 
     * A tooltip providing information about the data point is enabled by default.
     * To disable the tooltip, set "showTooltip" to false.
     * 
     * You can control what data is displayed in the tooltip with various
     * options.  The "tooltipAxes" option controls whether the x, y or both
     * data values are displayed.
     * 
     * Some chart types (e.g. hi-low-close) have more than one y value per
     * data point. To display the additional values in the tooltip, set the
     * "yvalues" option to the desired number of y values present (3 for a hlc chart).
     * 
     * By default, data values will be formatted with the same formatting
     * specifiers as used to format the axis ticks.  A custom format code
     * can be supplied with the tooltipFormatString option.  This will apply 
     * to all values in the tooltip.  
     * 
     * For more complete control, the "formatString" option can be set.  This
     * Allows conplete control over tooltip formatting.  Values are passed to
     * the format string in an order determined by the "tooltipAxes" and "yvalues"
     * options.  So, if you have a hi-low-close chart and you just want to display 
     * the hi-low-close values in the tooltip, you could set a formatString like:
     * 
     * > highlighter: {
     * >     tooltipAxes: 'y',
     * >     yvalues: 3,
     * >     formatString:'<table class="jqplot-highlighter">
     * >         <tr><td>hi:</td><td>%s</td></tr>
     * >         <tr><td>low:</td><td>%s</td></tr>
     * >         <tr><td>close:</td><td>%s</td></tr></table>'
     * > }
     * 
     */
    $.jqplot.Highlighter = function(options) {
        // Group: Properties
        //
        //prop: show
        // true to show the highlight.
        this.show = $.jqplot.config.enablePlugins;
        // prop: markerRenderer
        // Renderer used to draw the marker of the highlighted point.
        // Renderer will assimilate attributes from the data point being highlighted,
        // so no attributes need set on the renderer directly.
        // Default is to turn off shadow drawing on the highlighted point.
        this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
        // prop: showMarker
        // true to show the marker
        this.showMarker  = true;
        // prop: lineWidthAdjust
        // Pixels to add to the lineWidth of the highlight.
        this.lineWidthAdjust = 2.5;
        // prop: sizeAdjust
        // Pixels to add to the overall size of the highlight.
        this.sizeAdjust = 5;
        // prop: showTooltip
        // Show a tooltip with data point values.
        this.showTooltip = true;
        // prop: tooltipLocation
        // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.tooltipLocation = 'nw';
        // prop: fadeTooltip
        // true = fade in/out tooltip, flase = show/hide tooltip
        this.fadeTooltip = true;
        // prop: tooltipFadeSpeed
        // 'slow', 'def', 'fast', or number of milliseconds.
        this.tooltipFadeSpeed = "fast";
        // prop: tooltipOffset
        // Pixel offset of tooltip from the highlight.
        this.tooltipOffset = 2;
        // prop: tooltipAxes
        // Which axes to display in tooltip, 'x', 'y' or 'both', 'xy' or 'yx'
        // 'both' and 'xy' are equivalent, 'yx' reverses order of labels.
        this.tooltipAxes = 'both';
        // prop; tooltipSeparator
        // String to use to separate x and y axes in tooltip.
        this.tooltipSeparator = ', ';
        // prop; tooltipContentEditor
        // Function used to edit/augment/replace the formatted tooltip contents.
        // Called as str = tooltipContentEditor(str, seriesIndex, pointIndex)
        // where str is the generated tooltip html and seriesIndex and pointIndex identify
        // the data point being highlighted. Should return the html for the tooltip contents.
        this.tooltipContentEditor = null;
        // prop: useAxesFormatters
        // Use the x and y axes formatters to format the text in the tooltip.
        this.useAxesFormatters = true;
        // prop: tooltipFormatString
        // sprintf format string for the tooltip.
        // Uses Ash Searle's javascript sprintf implementation
        // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
        // See http://perldoc.perl.org/functions/sprintf.html for reference.
        // Additional "p" and "P" format specifiers added by Chris Leonello.
        this.tooltipFormatString = '%.5P';
        // prop: formatString
        // alternative to tooltipFormatString
        // will format the whole tooltip text, populating with x, y values as
        // indicated by tooltipAxes option.  So, you could have a tooltip like:
        // 'Date: %s, number of cats: %d' to format the whole tooltip at one go.
        // If useAxesFormatters is true, values will be formatted according to
        // Axes formatters and you can populate your tooltip string with 
        // %s placeholders.
        this.formatString = null;
        // prop: yvalues
        // Number of y values to expect in the data point array.
        // Typically this is 1.  Certain plots, like OHLC, will
        // have more y values in each data point array.
        this.yvalues = 1;
        // prop: bringSeriesToFront
        // This option requires jQuery 1.4+
        // True to bring the series of the highlighted point to the front
        // of other series.

        this.tooltipFormatCallback = null;
        // prop: callback function
        // A function that takes the x, y, x_label values and returns a string.
        /*
        Modified by: Artur Gołdyn
        Modified thanks to: John L. Cheng
        https://groups.google.com/forum/#!topic/jqplot-users/pjjpjrqxr3c
         */

        this.bringSeriesToFront = false;
        this._tooltipElem;
        this.isHighlighting = false;
        this.currentNeighbor = null;

        $.extend(true, this, options);
    };
    
    var locations = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    var locationIndicies = {'nw':0, 'n':1, 'ne':2, 'e':3, 'se':4, 's':5, 'sw':6, 'w':7};
    var oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];
    var mirrorLocations = ['ne', 'n', 'nw', 'w', 'sw', 's', 'se', 'e'];
    
    // axis.renderer.tickrenderer.formatter
    
    // called with scope of plot
    $.jqplot.Highlighter.init = function (target, data, opts){
        var options = opts || {};
        // add a highlighter attribute to the plot
        this.plugins.highlighter = new $.jqplot.Highlighter(options.highlighter);
    };
    
    // called within scope of series
    $.jqplot.Highlighter.parseOptions = function (defaults, options) {
        // Add a showHighlight option to the series 
        // and set it to true by default.
        this.showHighlight = true;
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.Highlighter.postPlotDraw = function() {
        // Memory Leaks patch    
        if (this.plugins.highlighter && this.plugins.highlighter.highlightCanvas) {
            this.plugins.highlighter.highlightCanvas.resetCanvas();
            this.plugins.highlighter.highlightCanvas = null;
        }

        if (this.plugins.highlighter && this.plugins.highlighter._tooltipElem) {
            this.plugins.highlighter._tooltipElem.emptyForce();
            this.plugins.highlighter._tooltipElem = null;
        }

        this.plugins.highlighter.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding, 'jqplot-highlight-canvas', this._plotDimensions, this));
        this.plugins.highlighter.highlightCanvas.setContext();

        var elem = document.createElement('div');
        this.plugins.highlighter._tooltipElem = $(elem);
        elem = null;
        this.plugins.highlighter._tooltipElem.addClass('jqplot-highlighter-tooltip');
        this.plugins.highlighter._tooltipElem.css({position:'absolute', display:'none'});
        
        this.eventCanvas._elem.before(this.plugins.highlighter._tooltipElem);
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Highlighter.init);
    $.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions);
    $.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw);
    
    function draw(plot, neighbor) {
        var hl = plot.plugins.highlighter;
        var s = plot.series[neighbor.seriesIndex[0]];       //changed Jayesh
        var smr = s.markerRenderer;
        var mr = hl.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + hl.lineWidthAdjust;
        mr.size = smr.size + hl.sizeAdjust;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var newrgb = [rgba[0], rgba[1], rgba[2]];
        var alpha = (rgba[3] >= 0.6) ? rgba[3]*0.6 : rgba[3]*(2-rgba[3]);
        mr.color = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex[0]][0], s.gridData[neighbor.pointIndex[0]][1], hl.highlightCanvas._ctx);
    }
    
    function showTooltip(plot, series, neighbor) {
        // neighbor looks like: {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]}
        // gridData should be x,y pixel coords on the grid.
        // add the plot._gridPadding to that to get x,y in the target.

        //console.log("series:", series, "neighbor:", neighbor);

        var hl = plot.plugins.highlighter;
        var elem = hl._tooltipElem;
        var serieshl = series.highlighter || {};

        var opts = $.extend(true, {}, hl, serieshl);

        if (opts.useAxesFormatters) {
            var xf = series._xaxis._ticks[0].formatter;
            var yf = series._yaxis._ticks[0].formatter;
            //var xfstr = series._xaxis._ticks[0].formatString;
            var xfstr = '%Y/%m/%d';
            var yfstr = series._yaxis._ticks[0].formatString;
            var str;
            var xstr = xf(xfstr, neighbor.data[0]);
            var ystrs = [];
            for (var i=1; i<opts.yvalues+1; i++) {
                ystrs.push(yf(yfstr, neighbor.data[i]));
            }
            if (typeof opts.formatString === 'string') {
                switch (opts.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        ystrs.unshift(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'yx':
                        ystrs.push(xstr); 
                        //ystrs.push(xf());
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'x':
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, xstr]);
                        break;
                    case 'y':
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    default: // same as xy
                        ystrs.unshift(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                } 
            }
            else {
                switch (opts.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += opts.tooltipSeparator + ystrs[i];
                        }
                        break;
                    case 'yx':
                        str = '';
                        for (var i=0; i<ystrs.length; i++) {
                            str += ystrs[i] + opts.tooltipSeparator;
                        }
                        str += xstr;
                        break;
                    case 'x':
                        str = xstr;
                        break;
                    case 'y':
                        str = ystrs.join(opts.tooltipSeparator);
                        break;
                    default: // same as 'xy'
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += opts.tooltipSeparator + ystrs[i];
                        }
                        break;
                    
                }                
            }
        }
        /*
         Modified by: Artur Gołdyn
         Modified thanks to: John L. Cheng
         https://groups.google.com/forum/#!topic/jqplot-users/pjjpjrqxr3c
         */
        else if (typeof(hl.tooltipFormatCallback)=='function') {
            str = hl.tooltipFormatCallback(neighbor.data[0], neighbor.data[1], series._plotValues.x[neighbor.data[0]-1]);
        }
        else {
            var str;
            if (typeof opts.formatString ===  'string') {
                //str = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString].concat(neighbor.data));
                str = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, neighbor.data[0][0], neighbor.data[0][1]]);  //changed
            }

            else {
                if (opts.tooltipAxes == 'both' || opts.tooltipAxes == 'xy') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]) + opts.tooltipSeparator + $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]);
                }
                else if (opts.tooltipAxes == 'yx') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]) + opts.tooltipSeparator + $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]);
                }
                else if (opts.tooltipAxes == 'x') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]);
                }
                else if (opts.tooltipAxes == 'y') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]);
                } 
            }
        }
        if ($.isFunction(opts.tooltipContentEditor)) {
            // args str, seriesIndex, pointIndex are essential so the hook can look up
            // extra data for the point.
            //str = opts.tooltipContentEditor(str, neighbor.seriesIndex, neighbor.pointIndex, plot);
            //changed -- jayesh (12/02/2014)
            str = opts.tooltipContentEditor(str, neighbor, plot, series);
        }
        elem.html(str);
        var gridpos = {x:neighbor.gridData[0][0], y:neighbor.gridData[0][1]};
        var ms = 0;
        var fact = 0.707;
        if (series.markerRenderer.show == true) { 
            ms = (series.markerRenderer.size + opts.sizeAdjust)/2;
        }

        var loc = locations;
        /*if (series.fillToZero && series.fill && neighbor.data[1] < 0) {
          loc = oppositeLocations;
        }*/

        var locCode = loc[locationIndicies[opts.tooltipLocation]];

        if(((gridpos.x + elem.outerWidth()) > plot._width-45) && locCode.indexOf("e")!==-1) {
          loc = mirrorLocations;
          $('.jqplot-highlighter-tooltip').css('background-position', 'right');
        } else if((gridpos.x < elem.outerWidth()) && locCode.indexOf("w")!==-1) {
          loc = mirrorLocations;
        } else if (series.fillToZero && series.fill && neighbor.data[1] < 0) {
          loc = oppositeLocations;
        }else{
            $('.jqplot-highlighter-tooltip').css('background-position', 'left');
        }

        switch (loc[locationIndicies[opts.tooltipLocation]]) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - ms;
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + fact * ms;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + ms;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + fact * ms;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
        }
        elem.css('left', x);
        elem.css('top', y);
        if (opts.fadeTooltip) {
            // Fix for stacked up animations.  Thnanks Trevor!
            elem.stop(true,true).fadeIn(opts.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        elem = null;
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var hl = plot.plugins.highlighter;
        var c = plot.plugins.cursor;
        if (hl.show) {
            if (neighbor.seriesIndex.length == 0 && hl.isHighlighting) {
                var evt = jQuery.Event('jqplotHighlighterUnhighlight');
                plot.target.trigger(evt);

                var ctx = hl.highlightCanvas._ctx;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (hl.fadeTooltip) {
                    hl._tooltipElem.fadeOut(hl.tooltipFadeSpeed);
                }
                else {
                    hl._tooltipElem.hide();
                }
                if (hl.bringSeriesToFront) {
                    plot.restorePreviousSeriesOrder();
                }
                hl.isHighlighting = false;
                hl.currentNeighbor = null;
                ctx = null;
            }
            //modified by Jayesh
            //else if (neighbor != null && plot.series[neighbor.seriesIndex[0]].showHighlight && !hl.isHighlighting) {        //changed Jayesh
            else if (neighbor.seriesIndex.length != 0 && plot.series[neighbor.seriesIndex[0]].showHighlight && !hl.isHighlighting) {      //changed Jayesh

                //for(var i = 0; i < neighbor.seriesIndex.length; i++){
                    var evt = jQuery.Event('jqplotHighlighterHighlight');
                    evt.which = ev.which;
                    evt.pageX = ev.pageX;
                    evt.pageY = ev.pageY;
                    var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data, plot];
                    plot.target.trigger(evt, ins);

                    hl.isHighlighting = true;
                    hl.currentNeighbor = neighbor;
                    if (hl.showMarker) {
                        draw(plot, neighbor);
                    }
                    if (plot.series[neighbor.seriesIndex[0]].show && hl.showTooltip && (!c || !c._zoom.started)) {      //changed Jayesh
                        showTooltip(plot, plot.series[neighbor.seriesIndex[0]], neighbor);                              //changed Jayesh
                    }
                    if (hl.bringSeriesToFront) {
                        plot.moveSeriesToFront(neighbor.seriesIndex);
                    }    
                //}
                
            }
            //changed Jayesh
            // check to see if we're highlighting the wrong point.
            else if (neighbor.seriesIndex.length != 0 && hl.isHighlighting && hl.currentNeighbor != neighbor) {
                // highlighting the wrong point.

                // if new series allows highlighting, highlight new point.
                if (plot.series[neighbor.seriesIndex[0]].showHighlight) {                                   
                    var ctx = hl.highlightCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    hl.isHighlighting = true;
                    hl.currentNeighbor = neighbor;
                    if (hl.showMarker) {
                        draw(plot, neighbor);
                    }
                    if (plot.series[neighbor.seriesIndex[0]].show && hl.showTooltip && (!c || !c._zoom.started)) {  //changed Jayesh
                        showTooltip(plot, plot.series[neighbor.seriesIndex[0]], neighbor);  //changed Jayesh 
                    }
                    if (hl.bringSeriesToFront) {
                        plot.moveSeriesToFront(neighbor.seriesIndex);
                    }                    
                }                
            }
        }
    }
})(jQuery);

//next
//$.jqplot.PointLabels

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.8
 * Revision: 1250
 *
 * Copyright (c) 2009-2013 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */

(function($) {
    
    /**
     * Class: $.jqplot.PointLabels
     * Plugin for putting labels at the data points.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.pointLabels.js"></script>
     * 
     * By default, the last value in the data ponit array in the data series is used
     * for the label.  For most series renderers, extra data can be added to the 
     * data point arrays and the last value will be used as the label.
     * 
     * For instance, 
     * this series:
     * 
     * > [[1,4], [3,5], [7,2]]
     * 
     * Would, by default, use the y values in the labels.
     * Extra data can be added to the series like so:
     * 
     * > [[1,4,'mid'], [3 5,'hi'], [7,2,'low']]
     * 
     * And now the point labels would be 'mid', 'low', and 'hi'.
     * 
     * Options to the point labels and a custom labels array can be passed into the
     * "pointLabels" option on the series option like so:
     * 
     * > series:[{pointLabels:{
     * >    labels:['mid', 'hi', 'low'],
     * >    location:'se',
     * >    ypadding: 12
     * >    }
     * > }]
     * 
     * A custom labels array in the options takes precendence over any labels
     * in the series data.  If you have a custom labels array in the options,
     * but still want to use values from the series array as labels, set the
     * "labelsFromSeries" option to true.
     * 
     * By default, html entities (<, >, etc.) are escaped in point labels.  
     * If you want to include actual html markup in the labels, 
     * set the "escapeHTML" option to false.
     * 
     */
    $.jqplot.PointLabels = function(options) {
        // Group: Properties
        //
        // prop: show
        // show the labels or not.
        this.show = $.jqplot.config.enablePlugins;
        // prop: location
        // compass location where to position the label around the point.
        // 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.location = 'n';
        // prop: labelsFromSeries
        // true to use labels within data point arrays.
        this.labelsFromSeries = false;
        // prop: seriesLabelIndex
        // array index for location of labels within data point arrays.
        // if null, will use the last element of the data point array.
        this.seriesLabelIndex = null;
        // prop: labels
        // array of arrays of labels, one array for each series.
        this.labels = [];
        // actual labels that will get displayed.
        // needed to preserve user specified labels in labels array.
        this._labels = [];
        // prop: stackedValue
        // true to display value as stacked in a stacked plot.
        // no effect if labels is specified.
        this.stackedValue = false;
        // prop: ypadding
        // vertical padding in pixels between point and label
        this.ypadding = 6;
        // prop: xpadding
        // horizontal padding in pixels between point and label
        this.xpadding = 6;
        // prop: escapeHTML
        // true to escape html entities in the labels.
        // If you want to include markup in the labels, set to false.
        this.escapeHTML = true;
        // prop: edgeTolerance
        // Number of pixels that the label must be away from an axis
        // boundary in order to be drawn.  Negative values will allow overlap
        // with the grid boundaries.
        this.edgeTolerance = -5;
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: hideZeros
        // true to not show a label for a value which is 0.
        this.hideZeros = false;
        this._elems = [];
        
        $.extend(true, this, options);
    };
    
    var locations = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    var locationIndicies = {'nw':0, 'n':1, 'ne':2, 'e':3, 'se':4, 's':5, 'sw':6, 'w':7};
    var oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];
    
    // called with scope of a series
    $.jqplot.PointLabels.init = function (target, data, seriesDefaults, opts, plot){
        var options = $.extend(true, {}, seriesDefaults, opts);
        options.pointLabels = options.pointLabels || {};
        if (this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal' && !options.pointLabels.location) {
            options.pointLabels.location = 'e';
        }
        // add a pointLabels attribute to the series plugins
        this.plugins.pointLabels = new $.jqplot.PointLabels(options.pointLabels);
        this.plugins.pointLabels.setLabels.call(this);
    };
    
    // called with scope of series
    $.jqplot.PointLabels.prototype.setLabels = function() {   
        var p = this.plugins.pointLabels; 
        var labelIdx;
        if (p.seriesLabelIndex != null) {
            labelIdx = p.seriesLabelIndex;
        }
        else if (this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal') {
           labelIdx = (this._plotData[0].length < 3) ? 0 : this._plotData[0].length -1;
        }
        else {
            labelIdx = (this._plotData.length === 0) ? 0 : this._plotData[0].length -1;
        }
        p._labels = [];
        if (p.labels.length === 0 || p.labelsFromSeries) {    
            if (p.stackedValue) {
                if (this._plotData.length && this._plotData[0].length){
                    // var idx = p.seriesLabelIndex || this._plotData[0].length -1;
                    for (var i=0; i<this._plotData.length; i++) {
                        p._labels.push(this._plotData[i][labelIdx]);
                    }
                }
            }
            else {
                // var d = this._plotData;
                var d = this.data;
                if (this.renderer.constructor === $.jqplot.BarRenderer && this.waterfall) {
                    d = this._data;
                }
                if (d.length && d[0].length) {
                    // var idx = p.seriesLabelIndex || d[0].length -1;
                    for (var i=0; i<d.length; i++) {
                        p._labels.push(d[i][labelIdx]);
                    }
                }
                d = null;
            }
        }
        else if (p.labels.length){
            p._labels = p.labels;
        }
    };
    
    $.jqplot.PointLabels.prototype.xOffset = function(elem, location, padding) {
        location = location || this.location;
        padding = padding || this.xpadding;
        var offset;
        
        switch (location) {
            case 'nw':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            case 'n':
                offset = -elem.outerWidth(true)/2;
                break;
            case 'ne':
                offset =  this.xpadding;
                break;
            case 'e':
                offset = this.xpadding;
                break;
            case 'se':
                offset = this.xpadding;
                break;
            case 's':
                offset = -elem.outerWidth(true)/2;
                break;
            case 'sw':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            case 'w':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            default: // same as 'nw'
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
        }
        return offset; 
    };
    
    $.jqplot.PointLabels.prototype.yOffset = function(elem, location, padding) {
        location = location || this.location;
        padding = padding || this.xpadding;
        var offset;
        
        switch (location) {
            case 'nw':
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
            case 'n':
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
            case 'ne':
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
            case 'e':
                offset = -elem.outerHeight(true)/2;
                break;
            case 'se':
                offset = this.ypadding;
                break;
            case 's':
                offset = this.ypadding;
                break;
            case 'sw':
                offset = this.ypadding;
                break;
            case 'w':
                offset = -elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
        }
        return offset; 
    };
    
    // called with scope of series
    $.jqplot.PointLabels.draw = function (sctx, options, plot) {
        var p = this.plugins.pointLabels;
        // set labels again in case they have changed.
        p.setLabels.call(this);
        // remove any previous labels
        for (var i=0; i<p._elems.length; i++) {
            // Memory Leaks patch
            // p._elems[i].remove();
            p._elems[i].emptyForce();
        }
        p._elems.splice(0, p._elems.length);

        if (p.show) {
            var ax = '_'+this._stackAxis+'axis';
        
            if (!p.formatString) {
                p.formatString = this[ax]._ticks[0].formatString;
                p.formatter = this[ax]._ticks[0].formatter;
            }
        
            var pd = this._plotData;
            var ppd = this._prevPlotData;
            var xax = this._xaxis;
            var yax = this._yaxis;
            var elem, helem;

            for (var i=0, l=p._labels.length; i < l; i++) {
                var label = p._labels[i];
                
                if (label == null || (p.hideZeros && parseInt(label, 10) == 0)) {
                    continue;
                }
                
                label = p.formatter(p.formatString, label);

                helem = document.createElement('div');
                p._elems[i] = $(helem);

                elem = p._elems[i];


                elem.addClass('jqplot-point-label jqplot-series-'+this.index+' jqplot-point-'+i);
                elem.css('position', 'absolute');
                elem.insertAfter(sctx.canvas);

                if (p.escapeHTML) {
                    elem.text(label);
                }
                else {
                    elem.html(label);
                }
                var location = p.location;
                if ((this.fillToZero && pd[i][1] < 0) || (this.fillToZero && this._type === 'bar' && this.barDirection === 'horizontal' && pd[i][0] < 0) || (this.waterfall && parseInt(label, 10)) < 0) {
                    location = oppositeLocations[locationIndicies[location]];
                }


                var ell = xax.u2p(pd[i][0]) + p.xOffset(elem, location);
                var elt = yax.u2p(pd[i][1]) + p.yOffset(elem, location);

                // we have stacked chart but are not showing stacked values,
                // place labels in center.
                if (this._stack && !p.stackedValue) {
                    if (this.barDirection === "vertical") {
                        elt = (this._barPoints[i][0][1] + this._barPoints[i][1][1]) / 2 + plot._gridPadding.top - 0.5 * elem.outerHeight(true);
                    }
                    else {
                        ell = (this._barPoints[i][2][0] + this._barPoints[i][0][0]) / 2 + plot._gridPadding.left - 0.5 * elem.outerWidth(true);
                    }
                }

                if (this.renderer.constructor == $.jqplot.BarRenderer) {
                    if (this.barDirection == "vertical") {
                        ell += this._barNudge;
                    }
                    else {
                        elt -= this._barNudge;
                    }
                }
                elem.css('left', ell);
                elem.css('top', elt);
                var elr = ell + elem.width();
                var elb = elt + elem.height();
                var et = p.edgeTolerance;
                var scl = $(sctx.canvas).position().left;
                var sct = $(sctx.canvas).position().top;
                var scr = sctx.canvas.width + scl;
                var scb = sctx.canvas.height + sct;
                // if label is outside of allowed area, remove it
                if (ell - et < scl || elt - et < sct || elr + et > scr || elb + et > scb) {
                    elem.remove();
                }

                elem = null;
                helem = null;
            }

            // finally, animate them if the series is animated
            // if (this.renderer.animation && this.renderer.animation._supported && this.renderer.animation.show && plot._drawCount < 2) {
            //     var sel = '.jqplot-point-label.jqplot-series-'+this.index;
            //     $(sel).hide();
            //     $(sel).fadeIn(1000);
            // }

        }
    };
    
    $.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);
    $.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);
})(jQuery);


vmf.jqplot = function($){
    return {
            drawPlot: function(chartTargetId, dataToPlot, optionsToPlot){
                return $.jqplot(chartTargetId, dataToPlot, optionsToPlot);
            }, 
            redrawPlot: function(obj, options){
                obj.replot(options);
            }
    };
}(jQuery);
