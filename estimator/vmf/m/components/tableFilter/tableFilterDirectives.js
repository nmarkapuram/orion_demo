angular.module('vmfTableFilterMod', [])
.service("vmfUtils", function($filter){
            this.getGroupingCollection = function (array, f) {

                var groups = {};

                array = array || [];

                array.forEach(function (o) {
                    var group = f(o), parentObj;

                    if (!groups[group]) {
                        parentObj = {};
                        //var parentObj = angular.extend({}, o);
                        parentObj.type = group; //TODO
                        parentObj.isParent = true;
                    }

                    groups[group] = groups[group] || [];

                    if (parentObj) {
                        groups[group].push(parentObj);
                    }

                    groups[group].push(o);
                });

                var groupData = Object.keys(groups).map(function (group) {
                    return groups[group];
                });

                groupData = groupData || [];

                return groupData.reduce(function (a, b) {
                        return a.concat(b);
                });
            };

            this.toggleTriStateCheckbox = function (data, input, column, item, bulkActionCallback) {
                var isAllSelected = false,
                    isSelectedAll = true,
                    checked = input.checked,                
                    checkboxField = column.checkboxField,
                    isAnySelected = false;

                item[checkboxField] = checked;

                if (checked) {
                    $.each(data, function (idx, row) {
                        if (!row[checkboxField]) {
                            isSelectedAll = false;
                            return false;
                        } 
                    });                        
                } else {
                    isSelectedAll = false;
                }                                     

                column[checkboxField] = isSelectedAll;

                $.each(data, function (idx, row) {
                    if (row[checkboxField]) {
                        isAnySelected = true;
                    } 
                });
                if(isAnySelected) {
                    bulkActionCallback(true);
                } else {
                    bulkActionCallback(false);
                }
            };    

            this.toggleAllCheckboxState = function(data, column, checked, bulkActionCallback){
                column[column.checkboxField] = checked;

                if (column) {
                    angular.forEach(data, function (row) {
                        row[column.checkboxField] = checked;
                    });
                }
                bulkActionCallback(checked);
            };  

            this.sortByColumn = function(data, column, columns, sortingParams){

                var params = sortingParams;
                
                if (params.field === column.field) {
                    params.reverse = !params.reverse;
                }

                params.field = column.field;

                angular.forEach(columns, function (col) {
                    col.sorted = '';
                });

                column.sorted = (params.reverse) ? 'sort-desc' : 'sort-asc';

                return $filter('orderBy')(data, column.field, params.reverse);             
            };

            this.getUnique = function (arr, field, value) {
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if(item[field] === value){
                        result.push(item);
                    }
                }

                return result;
            };
            this.filterByColumn = function(data, text, column){
                return $filter('vmfTableSearch')(data, text, column || 'product'); 
            };
        this.getSelectedItems = function(data) {
                var selectedItems = [];
                angular.forEach(data, function(itemObj) {
                    if(itemObj.isCheckboxSelected) {
                        selectedItems.push(angular.copy(itemObj));
                    }
                });
                return selectedItems;
            };

        })
.directive('vmfTableAutoComplete', ['$timeout','$parse','$http', function($timeout, $parse, $http) {
    return {
        restrict: 'A',
        scope: {
          url:"@",
          filterBy:"@",
          data:"=",          
          onSelect:"&"
        },         
        link: function(scope, elem, attrs) {
          //scope.url = "../data/countries.json";

            scope.$watch("data", function(newValue){
                // if(newValue && newValue.length == 0) return;

                var sourceArray = scope.data;

                $timeout(function(){
                      elem.autocomplete().autocomplete("destroy").autocomplete({            
                        source: function(request, response){

                          var term = request.term;
                          var searchRegex= "^"+term;

                          var regex = new RegExp(searchRegex,'i');
                          //var regex = new RegExp("^"+term,"gi");
                          var result =[];

                         angular.forEach(sourceArray, function(item){
                             if(item && regex.test(item.name)){
                                  result.push(item);
                              }
                          });

                          //console.log("result",result);

                          response(result);
                        },
                        minLength: 1,
                        select: function( event, ui ) {                          
                          event.stopImmediatePropagation();                   
                          scope.onSelect({item:ui.item});
                          //scope.onSelect(ui.item);
                        }
                      })
                      .autocomplete( "instance" )._renderItem = function( ul, item ) {
                          return $( "<li>" )
                            .append( "<a>" + item.name + "</a>" )
                            .appendTo( ul );
                      };
              },0);              
            });            
        }           
    };
}])

.directive('vmfTableFilterButton', ['$compile','$templateCache','$timeout','$document', function( $compile, $templateCache,$timeout,$document) {
    return {
        restrict: 'A',
        scope: {
            title: '@',
            name: '@',            
            data: '=',
            url: '@',
            mandatoryDate:'@',
            onChange :'&'
        },
        controller: function($scope, $http) {

           $scope.$on('vmfTable.event.resetfilter', function (event, data) {
              //console.log("vmfTable.event.resetfilter data, data"); // 'Data to send'
              $scope.selectedItems = [];
              $scope.selectedDate=null;
              $scope.clearAll();
           });
            
            $scope.clearAll = function(target){
              if(target){
            $(target.currentTarget).closest('.dropdown').removeClass('open'); 
                 }
            $scope.selectedItems = [];             
              angular.forEach($scope.parsedData, function(item){
                item.selected = false;
              });
            };

            $scope.applyFilter = function(event){
              $(event.currentTarget).closest('.dropdown').removeClass('open');
              $scope.selectedItems = [];
              angular.forEach($scope.parsedData, function(item){
                if(item.selected){
                    $scope.selectedItems.push(item);
                }
              });

              var params = {event:event, target: $scope.name, items : $scope.selectedItems};              
              $scope.onChange({params:params});
            };
             
             $scope.onDateSelect =function(item, $event){               
                item.label = $($event.target).closest(".checkbox").find("input.vmf-calInput").val();
               //$scope.apply();                   
             };

            $scope.deleteItem = function (item, index, event) {
              $scope.selectedItems.splice(index, 1);                
                item.selected = false;

                if(item.isDateField){
                  $(event.target).closest(".selected-item-container")                                 
                                 .siblings(".table-filter").find("input.vmf-calInput").val("");   
                }

               // $scope.tempParsedData = angular.copy($scope.parsedData);
              };
            
            $scope.liClickHandler = function($event){
              $event.stopPropagation();
            };
                  
            $scope.loadData = function(){
                if($scope.url){                   
                    $http.get($scope.url).success(function (result) {
                        $scope.data = result.data;
                    })
                    .error(function (data, status, headers, config) {
                        //console.log("TABLE FILTER SERVICE FOR "+ $scope.name + " NOT ABLE");                       
                    });
                }
            };

            $scope.init = function(){
                $scope.loadData();
            };

            $scope.init();
                   

        }, 
        
        link: function(scope, elem, attrs) {
            scope.selectedItems=[];
            scope.parsedData = [];
            scope.selectedDate = '';            
          
            scope.$watch("data", function(newValue){
                scope.parsedData = scope.data;
            });
             
            var hideDropdownFlag = false;
            elem.find('.btn-group.dropdown.table-filter').on('hide.bs.dropdown', function (e) {
              if( hideDropdownFlag ){
                hideDropdownFlag = false;
                return false;
              }
            });
           
            elem.find('.dropdown-menu').off('click').on('click', function(e){
              if( $(e.target).hasClass('.dropdown-menu') || $(e.target).closest('.dropdown-menu').length ){
                hideDropdownFlag = true;
              }
            });

            scope.subscribe('closeAllFilters', function(){
                elem.find('.btn-group.dropdown.table-filter').removeClass('open');
            });

            $document.on("click", function(e){  
                var found = false;                      

              if (!elem.find('.btn-group.dropdown.table-filter').is(e.target) 
                  && elem.find('.btn-group.dropdown.table-filter').has(e.target).length === 0 
                  && elem.find('.open').has(e.target).length === 0
              ) {
                  elem.find('.btn-group.dropdown.table-filter').removeClass('open');
              }
              
              if($(e.target).closest(".btn-group.dropdown").length === 0){                        
                    //scope.parsedData = angular.copy(scope.tempParsedData);    
                    if(scope.selectedItems && scope.selectedItems.length === 0){
                        scope.clearAll();
                    }else{

                      angular.forEach(scope.parsedData, function(item){     
                          found = false;                     
                          angular.forEach(scope.selectedItems, function(selItems){
                              if(item === selItems){
                                item.selected = true;
                                found = true;
                              }
                          });

                          if(!found){
                            item.selected = false;
                          }
                      });   
                  }

                }

                scope.$apply();
            });

            $timeout(function(){
                $('.dropdown-menu li').click(function(e) {
                    e.stopPropagation();
                });

                if(scope.mandatoryDate===true){
                    var tableFilterDateContainer = $(elem).find('.table-filter-date-container');
                    $(tableFilterDateContainer).datepicker({
                        format: "dd/mm/yyyy"
                    });  
                }
            }, 1000);
        },
         templateUrl: '/vmf/m/components/tableFilter/filterDropDown.html' 
        
    };
}])


.directive('vmfTableFilter', ['$timeout', function($timeout) {
    return {
        restrict: 'EA',
        scope: {
            title: '=',
            filterData: '=', 
            name:"=",
            onItemSelected:'&',
            autoCompleteData:"="
        },
       controller:function($scope) {
          var filterItems = {};
          
          $scope.onChange = function(params){    
            if(params){
                filterItems[params.target] = params.items;
                $scope.onItemSelected({event: params.event, target:params.target, itemSelected: params.items, allSelectedItems: filterItems});
            }
          };

          $scope.isLocation = function(item){
              return item && item.type === "location";
          };  

          $scope.filterReset = function(){
            //console.log("filterReset trigger");
            $scope.$broadcast("vmfTable.event.resetfilter",{}); 
          };     
         
          angular.forEach($scope.filterData, function(item){
                //console.log(item.tableFilterTitle, item.data, item.url);            
                filterItems[item.name] = [];
          });

        },
       template : '<div id="dropdown-holder">'+
                    '<div class="dropdowns-container">'+
                        '<div ng-repeat="item in filterData" class="each-dropdown">'+
                            '<div vmf-table-filter-button  ng-if="!isLocation(item)" name="{{item.name}}" mandatory-date="{{item.mandatoryDate}}" data="item.data" url="{{item.url}}" on-change="onChange(params)"></div>'+
                            '<div vmf-table-filter-button-location auto-complete-data="autoCompleteData" ng-if="isLocation(item)" name="{{item.name}}" mandatory-date="{{item.mandatoryDate}}" data="item.data" url="{{item.url}}" on-change="onChange(params)"></div>'+                            
                        '</div>'+
                    '</div>' +
                  '</div>'
    };
}]);