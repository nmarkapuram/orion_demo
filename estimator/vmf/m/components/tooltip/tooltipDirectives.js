angular.module('vmfTooltipMod', [])
.directive("vmfTooltip", ['$compile', function($compile) {
    return{
        restrict: "EA",
        priority:2,      
        scope: true,
        link: function (scope, element, attrs) {
            scope.userOptions = scope.$eval(attrs.tooltipOptions);
            scope.options = angular.extend({}, {
                skin: 'dark',
                position: "right",
                radius: true,
                size: 'large',
                hideDelay: 500,
                showOn: 'mouseover',
                hideOn: 'mouseleave',
                maxWidth: "180",
                close: false,
                customClass: "tempClass",
                offsetX: 0,
                offsetY: 0
            }, scope.userOptions);
            scope.showTipOn = scope.options.showOn;
            scope.hideTipOn = scope.options.hideOn;
            var targetElement = typeof attrs.targetEle === "undefined" ? element : element.find("."+attrs.targetEle);
            var ele = Tipped.create(targetElement, scope.options.text, {
                skin: scope.options.skin,
                inline: true,
                position: scope.options.position,
                radius: scope.options.radius,
                hideDelay: scope.options.hideDelay,
                size: scope.options.size,
                hideOthers: false,
                hideOn: scope.hideTipOn,
                showOn: scope.showTipOn,
                maxWidth: scope.options.maxWidth,
                close: scope.options.close,
                offset: { x: scope.options.offsetX, y: scope.options.offsetY },
                onShow: function(content, element) {
                    $(element).addClass('highlight');
                    $(content).addClass(scope.options.customClass);
                    $(content).parents(".tpd-tooltip").removeClass("tpd-skin-dark").addClass("tpd-skin-"+scope.options.skin);
                    if($(element).hasClass("disableTooltip")){
                        $(content).parents(".tpd-tooltip").remove();
                    }
                },
                afterHide: function(content, element) {
                    $(element).removeClass('highlight');
                    $(content).removeClass(scope.options.customClass);
                    $(content).parents(".tpd-tooltip").removeClass("tpd-skin-dark").removeClass("tpd-skin-"+scope.options.skin);
                }
            });
            Tipped.hideTooltip = function(element){
                var tempEle = Tipped.get(element);
                var tempEleItems = tempEle.items();
                $(tempEleItems[0]._tooltip).hide();
            };
            Tipped.showTooltip = function(element){
                var tempEle = Tipped.get(element);
                var tempEleItems = tempEle.items();
                $(tempEleItems[0]._tooltip).show();
            };
            Tipped.removeTooltip = function(element){
                Tipped.remove(element);
            };
            Tipped.enableTooltip = function(element){
                $(element).removeClass("disableTooltip");
            };
            Tipped.disableTooltip = function(element){
                $(element).addClass("disableTooltip");
            };
            Tipped.updatePosition = function(element,value) {
                var tempEle = Tipped.get(element);
                var tempEleItems = tempEle.items();
                
                $(tempEleItems[0]._tooltip).find(".tpd-content").text(value);
                Tipped.refresh(element);

                // Tipped.remove(element);
                // Tipped.create(element,value);
                // Tipped.showTooltip(element);

                //$(tempEleItems[0]._tooltip).css({"left":(element.offset().left - ($(tempEleItems[0]._tooltip).width()/2)) + 5,"top":element.offset().top - ($(tempEleItems[0]._tooltip).height())});
                //$(tempEleItems[0]._tooltip).find(".tpd-content").text(value);
            };

        }
    };
}]);