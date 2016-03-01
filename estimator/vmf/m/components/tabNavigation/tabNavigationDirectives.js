/*jshint scripturl:true*/

angular.module('vmfTabsMod', [])
  .directive('vmfTabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope) {
        var panes = $scope.panes = [];
         var currentPane = 0;
        $scope.onKeydown = function(e) { 
          //console.log(panes);
          if(e.keyCode === 37){    //left 37
            var i = 0;
            for(;;){
              if (panes[i].selected) {
                break;
              }else{
                i = i + 1;  
              }
            }
            
            
            if(i> 0){
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
             
              //console.log(i);
              $scope.ieselect(panes[i-1]);
            }
          }
          if(e.keyCode === 39){    //right 39
            var j = 0;
            for(;;){
              if (panes[j].selected) {
                break;
              }else{
                j = j + 1;  
              }
            }
           
            if ((j+1) !== panes.length){
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
              $scope.ieselect(panes[j+1]);
            }
          }
         
        };
        $scope.select = function(pane) {
          
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };
        // $scope.iflink = function(l){
        //   if(l){
        //     return l;
        //   }else{
        //     return 'javascript: void(0)';
        //   }

        // };
        $scope.ieselect = function(pane,currentIndex,curEvent) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
            $(".tab-content").find("vmf-pane[tabno="+pane.tabno+"]").children().hide();
          });
          pane.selected = true;
          
          $(".tab-content").find("vmf-pane[tabno="+pane.tabno+"]").children().show();
          //$(".navbar-collapse ul").find("li a").removeClass("activeState");
         // $(".navbar-collapse ul").find("li a").eq(currentIndex).addClass("activeState");
          $(curEvent.target).parents("ul").find("li a").removeClass("activeState");
          $(curEvent.target).addClass("activeState");
        };

        this.addPane = function(pane) {
           $(".tab-content").find("vmf-pane").children().hide();
          if (panes.length === 0) {
            $scope.select(pane);
            
          }
          panes.push(pane);
          $.each($(".tab-content"),function(){
            $(this).children().first().children().show();
          });

          
        };
      },

      template: "<div class=' vmfTab'><div class='navbar-header'><a class='navbar-toggle'></a></div><div class='collapse navbar-collapse' ><ul class=' '><li ng-keyup='onKeydown($event)' ng-repeat='pane in panes' ng-class='{active:pane.selected}'><a href='javascript:void(0);' ng-class='{activeState:pane.selected}' ng-click='select(pane);ieselect(pane,$index,$event);'>{{pane.listlabel}}</a></li></ul></div></div><div class='tab-content' ng-transclude></div>"

    };
  })
  .directive('vmfPane', function($timeout) {
    return {
      require: '^vmfTabs',
      restrict: 'E',
      transclude: true,
      scope: {
        tabno: '@',
        listlabel:'@',
        link:'@'
      },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
        $timeout(function() {
          $(".navbar-collapse ul").find("li a").eq(0).addClass("activeState");
        });
        
      },
      template: "<div class='tab-pane' ng-show='selected' ng-transclude></div>"
    };
})
  .directive('vmfTabsone', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function($scope) {
        
        var panes = $scope.panes = [];
         var currentPane = 0;
        $scope.onKeydown = function(e) {
         
          if(e.keyCode === 37){    //left 37
            var i = 0;
            for(;;){
              if (panes[i].selected) {
                break;
              }else{
                i = i + 1;  
              }
              
        
            }
            
            
            if(i> 0){
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
             
             
              $scope.ieselect(panes[i-1]);


            }
            

          }
          if(e.keyCode === 39){    //right 39
            var j = 0;
            for(;;){
              if (panes[j].selected) {
                break;
              }else{
                j = j + 1;  
              }
              
        
            }
            
            if ((j+1) !== panes.length){
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
             
              
              $scope.ieselect(panes[j+1]);

            }

            
           
           

          }
          
        };
        $scope.select = function(pane) {
          // console.log('select called');
          // console.log(pane);
          // currentPane = index;
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };
        $scope.ieselect = function(pane,currentIndex,curEvent) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
            $(".tab-content").find("vmf-paneone[tabno="+pane.tabno+"]").children().hide();
          });
          pane.selected = true;
          
          $(".tab-content").find("vmf-paneone[tabno="+pane.tabno+"]").children().show();
          //$(".navbar-collapse ul").find("li a").removeClass("activeState");
         //alert(currentIndex);
          //$(".navbar-collapse ul").find("li a").eq(currentIndex).addClass("activeState");
          $(curEvent.target).parents("ul").find("li a").removeClass("activeState");
          $(curEvent.target).addClass("activeState");
        };

        this.addPane = function(pane) {
           $(".tab-content").find("vmf-paneone").children().hide();
          if (panes.length === 0) {
            $scope.select(pane);
            
          }
          panes.push(pane);
          $.each($(".tab-content"),function(){
            $(this).children().first().children().show();
          });

          //$(".navbar-collapse ul").find("li a").eq(0).addClass("activeState");
          //alert("e");
        };

      },

      template: "<div class=' vmfTab vmfTab1'><ul class=''><li ng-keyup='onKeydown($event)' ng-repeat='pane in panes' ng-class='{active:pane.selected}'><a href='{{pane.tabhref}}' ng-class='{activeState:pane.selected}' class='{{pane.customClass}}' ng-click='select(pane);ieselect(pane,$index,$event);'>{{pane.listlabel}}</a></li></ul></div><div class='tab-content' ng-transclude></div>"

    };
  })
.directive('vmfPaneone', function($timeout) {
    return {
      require: '^vmfTabsone',
      restrict: 'E',
      transclude: true,
      scope: {
        tabno: '@',
        listlabel:'@',
        link:'@',
        tabhref:'@',
        customClass:'@'
      },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
        $timeout(function() {
          $(".vmfTab.vmfTab1 ul").find("li a").eq(0).addClass("activeState");
        });
      },
      template: "<div class='tab-pane' ng-show='selected' ng-transclude></div>"
    };
})
.directive('vmfTabstwo', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        labelmessage:'@'
      },
      controller: function($scope) {
        
        var panes = $scope.panes = [];
         var currentPane = 0;
        $scope.onKeydown = function(e) {
         
          if(e.keyCode === 37){    //left 37
            var i = 0;
            for(;;){
              if (panes[i].selected) {
                break;
              }else{
                i = i + 1;  
              }
              
        
            }
            
            
            if(i> 0){
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
             
             
              $scope.ieselect(panes[i-1]);


            }
            

          }
          if(e.keyCode === 39){    //right 39
            var j = 0;
            for(;;){
              if (panes[j].selected) {
                break;
              }else{
                j = j + 1;  
              }
              
        
            }
            
            if ((j+1) !== panes.length){
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
             
              
              $scope.ieselect(panes[j+1]);

            }

            
           
           

          }
          
        };
        $scope.select = function(pane) {
          // console.log('select called');
          // console.log(pane);
          // currentPane = index;
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        };
        $scope.ieselect = function(pane,currentIndex,curEvent) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
            $(".tab-content").find("vmf-panetwo[tabno="+pane.tabno+"]").children().hide();
          });
          pane.selected = true;
          
          $(".tab-content").find("vmf-panetwo[tabno="+pane.tabno+"]").children().show();

         // $(".navbar-collapse ul").find("li a").removeClass("activeState");
          //$(".navbar-collapse ul").find("li a").eq(currentIndex).addClass("activeState");
          $(curEvent.target).parents("ul").find("li a").removeClass("activeState");
          $(curEvent.target).addClass("activeState");
        };

        this.addPane = function(pane) {
           $(".tab-content").find("vmf-panetwo").children().hide();
          if (panes.length === 0) {
            $scope.select(pane);
            
          }
          panes.push(pane);
          $.each($(".tab-content"),function(){
            $(this).children().first().children().show();
          });

          
        };
      },

      template: "<div class='  vmfTab2'><span class='tab_head_txt pull-left'>{{labelmessage}}</span><ul class=''><li ng-keyup='onKeydown($event)' ng-repeat='pane in panes' ng-class='{active:pane.selected}'><a href='javascript:void(0);' ng-class='{activeState:pane.selected}' ng-click='select(pane);ieselect(pane,$index,$event);'>{{pane.listlabel}}</a></li></ul></div><div class='tab-content' ng-transclude></div>"

    };
  })
.directive('vmfPanetwo', function($timeout) {
    return {
      require: '^vmfTabstwo',
      restrict: 'E',
      transclude: true,
      scope: {
        tabno: '@',
        listlabel:'@',
        link:'@'
      },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
        $timeout(function() {
          $(".vmfTab2 ul").find("li a").eq(0).addClass("activeState");
        });
      },
      template: "<div class='tab-pane' ng-show='selected' ng-transclude></div>"
    };
});



