angular.module('pdtCtrlModule',[])
.directive('productsTab',function(){
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:true,
        templateUrl: Orion.globalVars.orion_path +'templates/orion/directives/productsTab.html'
    }
})
.directive('servicesTab',function(){
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:true,
        templateUrl: Orion.globalVars.orion_path +'templates/orion/directives/servicesTab.html'
    }
})
.directive('ngOrionEstimatorTable',function(){
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:true,
        templateUrl: Orion.globalVars.orion_path +'templates/orion/directives/orionEstimatorTable.html'
    }
})
.controller('EstimatorTableController',['DTOptionsBuilder', 'DTColumnDefBuilder',function (DTOptionsBuilder, DTColumnDefBuilder) {
    var DTable = this;

    DTable.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('bPaginate', false)
                .withOption("bInfo", false)
                .withOption('scrollY', 410)
                .withOption('bAutoWidth', false)
                .withLanguage({
                    "sEmptyTable": Orion.globalVars.defaultTableMsgEstimator
                });

}])
.controller('orionSearchResultsTableController',['DTOptionsBuilder', 'DTColumnDefBuilder',function (DTOptionsBuilder, DTColumnDefBuilder) {
    var DTable = this;

    DTable.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('bPaginate', false)
                .withOption("bInfo", false)
                .withOption('scrollY', 250)
                .withOption('bAutoWidth', false)
                .withLanguage({
                    "sEmptyTable": Orion.globalVars.noDataAvaiable
                });
                
}])
.controller('startHereTableController',['DTOptionsBuilder', 'DTColumnDefBuilder',function (DTOptionsBuilder, DTColumnDefBuilder) {
    var DTable = this;

    DTable.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('bPaginate', false)
                .withOption("bInfo", false)
                .withOption('scrollY', 250)
                .withOption('bAutoWidth', false)
                .withLanguage({
                    "sEmptyTable": Orion.globalVars.noDataAvaiable
                });
                
}])
.controller('ProductViewCtrl', ['$scope','$state','$http','$compile','$timeout','$modal','OrionAppFactory', function($scope, $state, $http, $compile, $timeout,$modal, OrionAppFactory){
    
	$scope.globalVars = {};
	$scope.globalUrls = {};
	$scope.productFamilies = {};
	angular.copy(Orion.globalVars,$scope.globalVars);
	angular.copy(Orion.globalUrls,$scope.globalUrls);

	$scope.isEmpty = function(val) {
		return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

  	OrionAppFactory.restServices(
	  	function(successData){

		    $timeout(function(){
		      if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
		        $scope.ajaxFundLoader = false;
		        vmf.msg.page("");
		        $scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true);
		        } else {
		          $scope.ajaxFundLoader = false;                
		          angular.copy(successData, $scope.productFamilies);
		          $scope.showProdLine = false;
		          $scope.showProdDetail = false;
		        }
		    });
	  	},function(errorData){
		    $timeout(function(){
		      $scope.ajaxFundLoader = false;
		      vmf.msg.page("");
		      $scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true);
		    },200);
		},
		$scope.globalUrls.productFolderTreeRequest,   
		"", 
		'GET'
	);

	$scope.estimatorTableObject = {};
	$scope.estimatorTableObject.cartDetails = [];
	$scope.selectProduct = function(prodItem){
	    var itemExist = false;
	    angular.forEach($scope.estimatorTableObject.cartDetails, function(item){
	          if(item.licInvItemID == prodItem.licInvItemID){
	            itemExist = true;
	          }
	        });

             setTimeout(function() {
                if($("#orionEstimatorTable div.dataTables_scrollBody table").height() > "410"){
                    $("#orionEstimatorTable div.dataTables_scrollHeadInner").css("cssText","width: 99% !important");
                }else{
                    $("#orionEstimatorTable div.dataTables_scrollHeadInner").css("cssText","width: 100% !important");
                    $("#orionEstimatorTable div.dataTables_scrollHeadInner").addClass('dataTableBefore');
                };

                $("#orionEstimatorTable div.dataTables_scrollHeadInner table>thead>tr>th").on("click", function(){
                    if($("#orionEstimatorTable div.dataTables_scrollBody table").height() > "410"){
                        $("#orionEstimatorTable div.dataTables_scrollHeadInner").css("cssText","width: 99% !important");
                    }else{
                        $("#orionEstimatorTable div.dataTables_scrollHeadInner").css("cssText","width: 100% !important");
                        $("#orionEstimatorTable div.dataTables_scrollHeadInner").addClass('dataTableBefore');
                    };
                    $("#orionEstimatorTable div.dataTables_scrollHeadInner table").css("cssText","width: 100% !important");
                });

            }, 100);

	    if(!itemExist){
	       $scope.estimatorTableObject.cartDetails.push(prodItem);
	    }
	}
	$scope.inputKeyPressHandler = function(event){
		if(event.which === 13){
			$scope.getOranSearchResult();
		}
	}
	$scope.getOranSearchResult = function(event){
		var searchResultObj = {};
		$scope.showSearchResultLoader = true;
		OrionAppFactory.restServices(
		function(successData) {
			$scope.showSearchResultLoader = false;
      console.log(successData);
			if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
  				searchResultObj.oranSearchResultsErrorMessage = Orion.globalVars.ERROR_MESSAGE;
  				showOranSearchResultPopup(searchResultObj);
  			} 
      else { 
  				searchResultObj.oranSearchResultsErrorMessage = null;
  				searchResultObj.oranSearchDetails = successData;
  				
          if( successData.oranDetails.length > 1 ){
  					showOranSearchResultPopup(searchResultObj);
  				}else if( successData.oranDetails.length === 1 ){
  					applySelectedOran( successData.oranDetails[0] );
  				}else{
  					searchResultObj.oranSearchResultsErrorMessage = Orion.globalVars.ERROR_MESSAGE;
  					showOranSearchResultPopup(searchResultObj);
  				}
			}

		}, function(errorData) {
			$scope.showSearchResultLoader = false;
			searchResultObj.oranSearchResultsErrorMessage = errorData.ERROR_MESSAGE || Orion.globalVars.ERROR_MESSAGE;
			showOranSearchResultPopup(searchResultObj);
		},
		$scope.globalUrls.oranSearchResultsUrl,
		"",
		'GET'
		);
	}

	function applySelectedOran(appliedOranObj){
		$scope.isOranSelected = true;
		$scope.appliedOranObj = appliedOranObj;
	}

	$scope.showOranDetailsPopup = function(){

  }

	$scope.removeSelectedOran = function(){
		$scope.isOranSelected = false;
		$scope.appliedOranObj = null;
	}

	function showOranSearchResultPopup( searchResultObj ){
		$scope.oranSearchResults = $scope.$new();
		
		$scope.oranSearchResults.oranSearchResultsErrorMessage = searchResultObj.oranSearchResultsErrorMessage;
		$scope.oranSearchResults.oranSearchDetails = searchResultObj.oranSearchDetails;

		$scope.CurrModal = $modal.open({
		  templateUrl: '/static/myvmware/modules/estimator/templates/orion/directives/oranSearchResults.tpl.html',
		  scope: $scope.oranSearchResults,
		  windowClass: 'overlay-lg'
		});      
    }

	$scope.startHere = function(){
	$scope.startHere = $scope.$new();
	$scope.startHere.startHereModalSpinner = true;
	$scope.startHere.startHereErrorMessage = null;
	        
	$scope.CurrModal = $modal.open({
	  templateUrl: '/static/myvmware/modules/estimator/templates/orion/directives/startHere.tpl.html',
	  scope: $scope.startHere,
	  windowClass: 'overlay-lg'
	});      

	OrionAppFactory.restServices(
	  function(successData) {
	      $timeout(function(){
	          $scope.startHere.startHereModalSpinner = false;
	          
	          if (!$scope.isEmpty(successData.ERROR_MESSAGE)) {
	              $scope.startHere.startHereErrorMessage = Orion.globalVars.ERROR_MESSAGE;
	          } else { 
	              $scope.startHere.startHereErrorMessage = null;
	              $scope.startHere.startHereModaldata = successData;
	          }
	      },200); 
	  }, function(errorData) {
	      $timeout(function() {
	          $scope.startHere.startHereModalSpinner = false;
	          $scope.startHere.startHereModaldata = data;
	          $scope.startHere.startHereErrorMessage = Orion.globalVars.ERROR_MESSAGE;
	      },200);
	  },
	  $scope.globalUrls.startHereUrl,
	  "",
	  'GET'
	);
  
        
    }
	$scope.startHere();

	$scope.modalClose = function(omniture_tag) {
	    if(omniture_tag =='oran-search-results')
	       { }
	    else
	       { }
	    $scope.CurrModal.close();
	}

	$scope.close = function(omniture_tag) {
	    if(omniture_tag =='oran-search-results')
	       { }
	    else
	       { }
	    $scope.CurrModal.close();
	}

}])

.controller('ServicesStep1', ['$scope', '$http', function($scope, $http){
	$scope.serviceDetails = null;
	if( $scope.serviceDetails ){}
	//Orion.globalVars.orion_path +'templates/orion
}]);
