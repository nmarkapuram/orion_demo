angular.module('vmfCheckboxGroupMod', [])
.directive('vmfCheckboxGroup', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'EA',
        priority:1,
        replace: true,
        scope: {
            ctitle: '=',
            options: '=',
            name: '=',
            model: '=',
            mandatory: '@',
            customClass: '=',
            type: '@',
            cLabel: '=',
            cDisabled: '=',
            cFoldertype: '=',
            clickCallback: '&',
            changeCallback: '&',
            append:'@'
        },
        link: function(scope, elem, attrs) {
            
            scope.invoke=function(method,evt) {
                scope.$emit('invoke',{method:method,evt:evt});
            };
            
            var template;
            if(scope.type === '1') {
                if(scope.mandatory === 'true') {
                    template = '<span class="mandatory">*</span>';
                }
                else {
                    template = '';
                }
                if(!scope.cLabel) {                    
                    template += '<label class="custom-checkbox"><span class="customCheckBox icn" ng-disabled="cDisabled"><input type="checkbox" ng-model="model" ng-click="clickCallback({$event:$event})" ng-change="changeCallback({$event:$event})" ng-disabled="cDisabled" /></span></label>';       
                }
                else {
                    template += '<label class="custom-checkbox"><span class="customCheckBox icn" ng-disabled="cDisabled"><input type="checkbox" ng-model="model" ng-click="clickCallback({$event:$event})" ng-change="changeCallback({$event:$event})" ng-disabled="cDisabled" /></span>' + scope.cLabel + '<span class="badge" ng-if="cFoldertype == \'ASP\' || cFoldertype == \'VCE\' || cFoldertype == \'CPL\'" badgeType="{{cFoldertype}}">{{cFoldertype}}</span></label>';    
                }
                
                var repl = $compile(template)(scope);
                if(scope.append === "true")
                    elem.append(repl);
                else
                elem.replaceWith(repl);
                
                scope.$watch('model', function(n, o) {
                    if(n) {
                        $timeout(function() { 
                            repl.addClass('selected');
                        });    
                    }
                    else {
                        $timeout(function() {
                            repl.removeClass('selected');
                        });    
                    }
                });


                scope.$watch('cDisabled', function(n, o) {
                    if(n) {
                            $timeout(function() {
                                repl.addClass('disabledColor'); 
                                repl.find('span.customCheckBox').addClass('disabled'); 
                                
                            });        
                        }
                        else {
                            $timeout(function() {
                                repl.removeClass('disabledColor'); 
                                repl.find('span.customCheckBox').removeClass('disabled'); 
                                
                            });           
                        }
                });
            }
            else if(scope.type === '2') {
                if(scope.mandatory === 'true') {
                    if(scope.ctitle) {
                        template = '<div class=" formSection clearfix">  <div class="labelHeader col-md-3"><span class="mandatory">*</span> '
                                    + scope.ctitle 
                                    + '</div><div class="col-md-9"><fieldset>';
                    }   
                    else {
                        template = '<div class=" formSection clearfix no-title">  <div class="mandatoryCB"><span class="mandatory">*</span></div><div class="col-md-9"><fieldset>';
                        //console.log('no title');
                    }         
                }
                else {
                    if(scope.ctitle) {
                        template = '<div class=" formSection clearfix">  <div class="labelHeader col-md-3">'
                                    + scope.ctitle 
                                    + '</div><div class="col-md-8"><fieldset>';
                    }                
                    else {
                        template = '<div class=" formSection clearfix no-title"> <div class="col-md-12"><fieldset>';
                        
                    }         

                }                

                angular.forEach(scope.options, function(item, index) {
                      
                    template += '<label class="custom-checkbox"><span class="customCheckBox icn" ng-disabled="options['+ index +'].disabled"><input type="checkbox" ng-model="options[' + index + '].checked" ng-disabled="options['+ index +'].disabled" name="'
                                + scope.name 
                                + '" value="'
                                + item.value
                                + '"></span>'
                                + item.text 
                                + '</label>';                
                    
                });

                template += '</fieldset></div> </div>';

                elem.append($compile(template)(scope));

                if(scope.customClass){
                    angular.forEach(scope.customClass, function(item) {
                        elem.find(item.selector).addClass(item.cusclass);
                        
                        
                    });
                }

                $timeout(function(){
                    elem.find('.badge').each(function(){
                            var getType = $(this).attr('badgeType');
                            $(this).attr('title',globalVariables['staticTextfor'+getType]);
                        });
                },100);

                scope.$watch('options', function(n, o) {
                    // console.log(n);console.log(o);
                    angular.forEach(n, function(option, index) {
                        if(option.checked) {
                            $timeout(function() {
                                angular.element(elem.find('label.custom-checkbox')[index]).addClass('selected'); 
                            });     
                        }
                        else {
                            $timeout(function() {
                                angular.element(elem.find('label.custom-checkbox')[index]).removeClass('selected');
                            }); 
                            
                        }

                        if(option.disabled) {
                            $timeout(function() {
                                angular.element(elem.find('label.custom-checkbox')[index]).addClass('disabledColor'); 
                                angular.element(elem.find('span.customCheckBox')[index]).addClass('disabled'); 
                                
                            });        
                        }
                        else {
                            $timeout(function() {
                                angular.element(elem.find('label.custom-checkbox')[index]).removeClass('disabledColor'); 
                                angular.element(elem.find('span.customCheckBox')[index]).removeClass('disabled'); 
                                
                            });           
                        }
                    });
                }, true);
            }

        }

    };
}]);