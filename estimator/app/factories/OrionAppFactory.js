angular.module('orionAppFactoryModule',[])
.factory('OrionAppFactory',['$http','ajaxCall','$anchorScroll','Restangular',function($http,ajaxCall,$anchorScroll, Restangular){

	var factory = {};
	factory.product_view = {};
	factory.product_view.device_type = "";
	factory.product_view.json_data = "";


	factory.getServices = function(callbackFn,url,data,method){		
		ajaxCall.call(url, method, data, callbackFn);
	}

	factory.postServices = function(successFn,errorFn,url,data,method){		
		ajaxCall.call(url, method, data, successFn, errorFn);
	}

	factory.restServices = function(successFn, errorFn, url, data, method) {
        if(method == "GET"){
           return Restangular.one(url).get().then(function(success){
                if(angular.isObject(success) && !$.isEmptyObject(success.plain())){
                    successFn(success.plain());
                }else{
                    errorFn(success);
                }
           }, function(failure){
                  errorFn(failure)
           })   
        }else if(method == "POST"){
            return Restangular.one(url).post('', data, null).then(function(success){
                if(angular.isObject(success) && !$.isEmptyObject(success.plain())){
                    successFn(success.plain());
                }else{
                    errorFn(success);
                }
           }, function(failure){
                  errorFn(failure)
           })
        }else if(method == "DELETE"){
           return Restangular.one(url, data).remove().then(function(success){
                if(angular.isObject(success) && !$.isEmptyObject(success.plain())){
                    successFn(success.plain());
                }else{
                    errorFn(success);
                }
           }, function(failure){
                  errorFn(failure)
           })
        }
    }
	
    return factory;
}]);