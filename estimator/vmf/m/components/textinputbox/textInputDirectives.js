angular.module('vmfTextInputMod', [])
.directive('vmfTextInput', ['$compile', '$document', '$timeout', 
    function($compile, $document, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                type: '@',
                optionId: '@',
                name: '@',
                title: '@',
                model: '=',
                searchCallback: '&',
                psearchCallback: '=',
                hint: '@',
                rows: '@',
                clearTextLength: '@',
                searchModel: '=',
                mandatory: '@',
                customClass: '=',
                shortDescription: '@'
            },
            controller: ['$scope',
                function($scope) {

                    $scope.defaults = {
                        rows: 10,
                        hint: '',
                        clearTextLength: 3

                    };


                    $scope.options = {};
                    
                    if ($scope.rows) {
                        $scope.options.rows = $scope.rows;
                    } else {
                        $scope.options.rows = $scope.defaults.rows;
                    }

                    if ($scope.hint) {
                        $scope.options.hint = $scope.hint;
                    } else {
                        $scope.options.hint = $scope.defaults.hint;
                    }

                    if ($scope.clearTextLength) {
                        $scope.options.clearTextLength = $scope.clearTextLength;
                    } else {
                        $scope.options.clearTextLength = $scope.defaults.clearTextLength;
                    }

                }
            ],

            link: function(scope, elem, attrs) {
                var template;

                var shortDesc;


                scope.checkDesc = function() {
                    if (scope.shortDescription) {
                        shortDesc = scope.shortDescription;
                    } else {
                        shortDesc = "";
                    }
                    return shortDesc;

                };

                if (attrs.type === 'normal') {
                    if (scope.mandatory === 'true') {
                        template = '<div class="formRow"><label class="col-md-3 formLabel"><span class="mandatory">*</span> ' + scope.title + '   <span class="shortDesc">{{ checkDesc()}}</span></label><div class="col-md-4"><input type="text" name="name" ng-model="model" id={{options.optionId}} placeholder={{options.hint}} /></div></div>';
                    } else {
                        template = '<div class="formRow"><label class="col-md-3 formLabel">' + scope.title + '<span class="shortDesc">{{ checkDesc()}}</span></label><div class="col-md-4"><input type="text" id={{options.optionId}} name="name" ng-model="model" placeholder={{options.hint}} /></div></div>';
                    }

                    elem.append(template);
                    if (scope.customClass) {
                        angular.forEach(scope.customClass, function(item) {
                            elem.find(item.selector).addClass(item.cusclass);


                        });
                    }
                    $compile(elem.contents())(scope);

                } else if (attrs.type === 'password') {
                    
                    if (scope.mandatory === 'true') {
                        template = '<div class="formRow"><label class="col-md-3 formLabel"><span class="mandatory">*</span> ' + scope.title + '</label><div class="col-md-4 placeholderWrap"><input type="password" ng-model="model" id="' + scope.optionId + '" ng-focus="placeholderFocus(this)" ng-blur="placeholderBlur(this)"  /><span class="placeholder" ng-click="placeholderFocusSpan(this)">{{options.hint}}</span></div></div>';
                    } else {
                        template = '<div class="formRow"><label class="col-md-3 formLabel">' + scope.title + '</label><div class="col-md-4 placeholderWrap"><input type="password" id="' + scope.optionId + '" ng-model="model" name="name" ng-focus="placeholderFocus(this)" ng-blur="placeholderBlur(this)" /><span class="placeholder" ng-click="placeholderFocus(this)">{{options.hint}}</span></div></div>';
                    }

                    elem.append(template);
                    if (scope.customClass) {
                        angular.forEach(scope.customClass, function(item) {
                            elem.find(item.selector).addClass(item.cusclass);


                        });
                    }
                    $compile(elem.contents())(scope);

                } else if (attrs.type === 'search') {
                    template = '<form autocomplete="off" class="searchArea"><input type="text" name="name" ng-model="model" ng-focus="onsearchFocus()" ng-blur="onsearchBlur()" ng-keyup="keyPressSearch($event)" placeholder={{options.hint}} id={{options.optionId}} /><input type="button" class="vmf-search-button" ng-click="searchAction()"/></form>';
                    elem.append(template);
                    if (scope.customClass) {
                        angular.forEach(scope.customClass, function(item) {
                            elem.find(item.selector).addClass(item.cusclass);


                        });
                    }
                    $compile(elem.contents())(scope);

                    scope.$watch('model', function(n, o) {

                        
                        if (n && n.length >= scope.options.clearTextLength) {
                            elem.find('.searchArea').addClass('active');
                        } else {
                            elem.find('.searchArea').removeClass('active');
                        }

                    });
                } else if (attrs.type === 'psearch') {

                    template = '<form autocomplete="off" class="searchArea psearch"><input  type="text" ng-model="model" name="name" ng-keyup="keyPressSearch($event)" placeholder={{options.hint}} id={{options.optionId}} /><input type="button" class="searchBtn" ng-click="psearchAction()"/><ul class="searchWrap"><li ng-repeat="item in filteredData = (searchModel | filter:model:comparator)" ng-bind-html="item | highlight:model" ng-click="optionSelect(item)" ng-keyup="optionSelectByKey($event, item)" tabindex="0"></li></ul></form>';
                    elem.append(template);
                    if (scope.customClass) {
                        angular.forEach(scope.customClass, function(item) {
                            elem.find(item.selector).addClass(item.cusclass);


                        });
                    }
                    $compile(elem.contents())(scope);

                    scope.$watch('model', function(n, o) {
                        $timeout(function() {
                            if (n && n.length >= 1) {
                                elem.find('.searchArea').addClass('active');
                                if (!scope.empty) {
                                    elem.find('.searchWrap').show();
                                    $(elem[0]).closest('.form-group').addClass('active');
                                }    
                            } else {
                                elem.find('.searchArea').removeClass('active');
                                elem.find('.searchWrap').hide();
                                $(elem[0]).closest('.form-group').removeClass('active');
                            }
                        });

                    });

                    scope.empty = false;

                    scope.$watchCollection('filteredData', function(n, o) {
                        if (n.length === 0) {
                            scope.empty = true;
                            
                            elem.find('.searchWrap').hide();
                            $(elem[0]).closest('.form-group').removeClass('active');
                        } else {
                            scope.empty = false;
                            
                        }

                    });


                }


                scope.searchAction = function() {
                    /*if (scope.model.length >= scope.options.clearTextLength) {
                        scope.clearText();
                    } else {*/
                        scope.searchCallback(scope.model);
                    /*}*/
                };

                scope.selected = false;

                scope.psearchAction = function() {
                    if (scope.model.length >= 1 && !scope.selected) {
                        scope.clearText();
                    } else {
                        
                        scope.psearchCallback(elem.find(':text').val());
                        scope.selected = false;
                    }
                };

                scope.clearText = function() {
                    
                    elem.find(':text').val('');
                    scope.model = '';
                    elem.find('.searchArea').removeClass('active');
                };

                scope.keyPressSearch = function($event) {
                    if ($event.keyCode === 13) {
                        if (scope.type === 'search') {
                            scope.searchCallback();
                        } else {
                            scope.selected = true;
                            scope.psearchAction();
                            elem.find('.searchArea').removeClass('active');
                        }
                    }
                };


                scope.optionSelect = function(item) {
                    
                    elem.find(':text').val(item);
                    elem.find('.searchArea').removeClass('active');
                    
                    scope.selected = true;
                };

                scope.optionSelectByKey = function($event, item) {
                    

                    if ($event.keyCode === 13) {
                        
                        elem.find(':text').val(item);
                        elem.find('.searchArea').removeClass('active');
                        
                        scope.selected = true;
                    }

                };
                scope.onsearchBlur = function() {
                    
                    elem.find('.searchArea').removeClass('active');
                };
                
                scope.onsearchFocus = function() {
                    elem.find('.searchArea').addClass('active');

                };
                scope.placeholderFocus = function(target) {
                    
                    $('#' + scope.optionId).closest('.placeholderWrap').find('.placeholder').hide();
                };
                scope.placeholderBlur = function(target) {
                    
                    if (scope.model === null || scope.model === "") {
                        $('#' + scope.optionId).closest('.placeholderWrap').find('.placeholder').show();
                    } else {
                        $('#' + scope.optionId).closest('.placeholderWrap').find('.placeholder').hide();
                    }
                };

                scope.placeholderFocusSpan = function() {

                    $('#' + scope.optionId).closest('.placeholderWrap').find('.placeholder').hide();
                    $('#' + scope.optionId).focus();

                };

                $document.on('click', function() {
                    
                    elem.find('.psearch').removeClass('active');
                    elem.find('.searchWrap').hide();
                    $(elem[0]).closest('.form-group').removeClass('active');

                });

                scope.comparator = function(actual, expected) {
                    var actualWords = actual.split(' ');
                    var expectedWords = expected.split(' ');
                    
                    var i, j;

                    var match = true;

                    for (i = 0; i < expectedWords.length; i++) {
                        expectedWords[i] = expectedWords[i].toLowerCase();
                    
                    }

                    for (j = 0; j < actualWords.length; j++) {
                        actualWords[j] = actualWords[j].toLowerCase();
                    }

                    
                    var startingIndex = 0;
                    for (i = 0; i < expectedWords.length; i++) {
                        var found = false;

                        for (j = startingIndex; j < actualWords.length; j++) {
                            
                            if (actualWords[j].indexOf(expectedWords[i]) !== -1) {
                                found = true;
                                startingIndex = j + 1;
                                break;
                            }
                        }

                        if (!found) {
                            return false;
                        }

                    }

                    return true;
                };

            }

        };
    }
])
    .filter('highlight', function() {
        return function(text, phrases) {

            /* returns position of ith occurrence of m in str */
            var getPosition = function(str, m, i) {
                return str.split(m, i).join(m).length;
            };


            if (phrases) {
                phrases = phrases.split(' ');

                angular.forEach(phrases, function(phrase, index) {

                    /* word boundary */
                    var splitIndex = getPosition(text, ' ', index);


                    if (splitIndex !== 0) {
                        var subText = text.substring(splitIndex + 1).replace('<span>', '', 'gi');
                        subText = subText.replace('</span>', '', 'gi');
                        text = text.substring(0, splitIndex + 1) + subText.replace(new RegExp('(' + phrase + ')', 'gi'), '<span>$1</span>');

                    } else {
                        text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span>$1</span>');

                    }

                });

            }

            text = '<a href="javascript: void(0);" tabindex="-1">' + text + '</a>';
            return text;
        };
    });