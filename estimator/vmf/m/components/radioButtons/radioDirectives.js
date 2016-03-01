angular.module('vmfRadioGroupMod', [])
.directive('vmfRadioGroup', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'EA',
        priority:1,
        replace: true,
        scope: {
            rtitle: '=',
            options: '=',
            name: '=',
            model: '=',
            mandatory: '@',
            customClass:'=',
            titleColMod:'@',
            type: '@',
            rLabel: '=',
            rChecked: '=',
            rDisabled: '=',
            rValue: '=',
            clickCallback: '&'
        },
        link: function(scope, elem, attrs) {
            var template;
            
            if(scope.type === "1") {
                if(scope.mandatory === 'true') {
                    if(typeof scope.titleColMod !== "undefined")
                        template = '<div class="formSection clearfix">  <div class="labelHeader {{titleColMod}}"><span class="mandatory">* </span> ';
                    else
                        template = '<div class="formSection clearfix">  <div class="labelHeader col-md-2"><span class="mandatory">* </span> ';
                                
                    if(scope.rtitle) {
                        template += scope.rtitle; 
                    }
                                
                    template += '</div><div class="col-md-8 radioContainer"><fieldset>';
                }
                else {
                    template = '<div class="formSection clearfix">  <div class="labelHeader col-md-2">';
                    if(scope.rtitle) {
                        template += scope.rtitle; 
                    }
                                
                    template += '</div><div class="col-md-8 radioContainer"><fieldset>';
                }                

                angular.forEach(scope.options, function(item, index) {
                    
                    template += '<label class="custom-radio" ng-click="optionClicked(\'' + item.value + '\', ' + index + ')"><span class="customRadioBox icn" ng-disabled="options['+ index +'].disabled"><input type="radio" ng-model="model" vmf-radio-value="'+ item.value +'" ng-disabled="options['+ index +'].disabled" name="'
                        + scope.name 
                        + '" value="'
                        + item.value
                        + '"></span>'
                        + item.text 
                        + '</label>';    
                      
                });

                template += '</fieldset></div> </div>';
                
                elem.append(template);

                if(scope.customClass){
                    angular.forEach(scope.customClass, function(item) {
                        elem.find(item.selector).addClass(item.cusclass);
                        
                        
                    });
                }


                $compile(elem.contents())(scope);

                /*
                * label click for IE7
                */

                scope.optionClicked = function(value, index) {
                   
                    if(!scope.options[index].disabled && scope.model !== value) {
                        scope.model = value;
                    }
                    
                };
                
                scope.$watch('model', function(n, o) {
                    if(n === null) {
                        $timeout(function() {
                            elem.find('label.custom-radio').removeClass('selected');
                            elem.find('span.customRadioBox').removeClass('selected'); 
                            angular.forEach(scope.options, function(item) {
                                item.checked = false;
                            });
                        });    
                    }
                    else {
                        
                        angular.forEach(scope.options, function(item) {
                            item.checked = false;
                        });
                        
                        angular.forEach(scope.options, function(item, index) {
                           
                            if(item.value === scope.model) {
                                item.checked = true;
                                $timeout(function() {
                                    
                                    angular.element(elem.find('label.custom-radio')[index]).addClass('selected'); 
                                    angular.element(elem.find('span.customRadioBox')[index]).addClass('selected'); 
                                    
                                });        
                            }
                            else {
                                $timeout(function() {
                                    
                                    angular.element(elem.find('label.custom-radio')[index]).removeClass('selected'); 
                                    angular.element(elem.find('span.customRadioBox')[index]).removeClass('selected'); 
                                    
                                });           
                            }

                        });
                        
                    }
                  
                });

                scope.$watch('options', function(n, o) {
                                       
                    angular.forEach(n, function(option, index) {
                        if(option.disabled) {
                            if(option.checked) {
                                disableAll = true;
                            }

                            $timeout(function() {
                                angular.element(elem.find('label.custom-radio')[index]).addClass('disabledColor'); 
                                angular.element(elem.find('span.customRadioBox')[index]).addClass('disabled'); 
                                
                            });    
                            
                        }
                        else {
                            $timeout(function() {
                                angular.element(elem.find('label.custom-radio')[index]).removeClass('disabledColor'); 
                                angular.element(elem.find('span.customRadioBox')[index]).removeClass('disabled'); 
                                
                            });           
                        }


                    });

                    

                }, true);            

            }
            else if(scope.type === '2') {
                template = '';
                if(scope.rLabel) {
                    template += '<label class="custom-radio" ng-click="optionClicked(\'' + scope.rValue + '\')"><span class="customRadioBox icn" ng-disabled="rDisabled"><input type="radio" ng-model="model" vmf-radio-value="' + scope.rValue + '" ng-disabled="rDisabled" name="' + scope.name + '" value="' + scope.rValue + '" ng-checked="rChecked" ng-click="clickCallback({$event:$event})" ></span>' + scope.rLabel + '</label>'; 
                }
                else {
                    template += '<label class="custom-radio" ng-click="optionClicked(\'' + scope.rValue + '\')"><span class="customRadioBox icn" ng-disabled="rDisabled"><input type="radio" ng-model="model" vmf-radio-value="' + scope.rValue + '" ng-disabled="rDisabled" name="' + scope.name + '" value="' + scope.rValue + '" ng-checked="rChecked" ng-click="clickCallback({$event:$event})" ></span></label>';     
                }    

                var repl = $compile(template)(scope);
                elem.replaceWith(repl);

                
                /*
                * label click for IE7
                */

                scope.optionClicked = function(value) {
                   
                    if(!scope.rDisabled && scope.model !== value) {
                        scope.model = value;
                    }
                    
                };

                scope.$watch('model', function(n, o) {
                    
                    if(n === null) {
                        $timeout(function() {
                            repl.removeClass('selected');
                            repl.find('span.customRadioBox').removeClass('selected'); 
                            scope.rChecked = false;
                        });    
                    }
                    else {
                        if(scope.rValue === n) {
                    
                            $timeout(function() {
                                repl.addClass('selected');
                                repl.find('span.customRadioBox').addClass('selected'); 
                                scope.rChecked = true;
                            });     
                        }
                        else {
                    
                            $timeout(function() {
                                repl.removeClass('selected');
                                repl.find('span.customRadioBox').removeClass('selected'); 
                                scope.rChecked = false;
                            });     
                        }
                    }
                    
                });

                scope.$watch('rDisabled', function(n, o) {
                    if(scope.rDisabled) {
                        $timeout(function() {
                            repl.addClass('disabledColor'); 
                            repl.find('span.customRadioBox').addClass('disabled'); 
                            
                        });  
                    }
                    else {
                        $timeout(function() {
                            repl.removeClass('disabledColor'); 
                            repl.find('span.customRadioBox').removeClass('disabled'); 
                            
                        });     
                    }
                });
            }

        }
        
    };
}])

/*
* vmfRadioValue directive for programmatic value binding in IE7
*/

.directive('vmfRadioValue', [function() {
    return {
        require: "ngModel",
        restrict: "A",
        link: function(scope, elem, attrs, controller) {

            while (attrs.value !== attrs.vmfRadioValue) {

                attrs.value = attrs.vmfRadioValue;
                controller.$render();
    
            }

        }        
    };
}]);
