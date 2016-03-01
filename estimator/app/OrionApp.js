'use strict';
var app=angular.module('myApp',['ui.router','ui.bootstrap','ajaxModule','vmfSplitContainerMod','orionAppFactoryModule','pdtCtrlModule','angular-bootstrap-select','angular-bootstrap-select.extra','LocalStorageModule','datatables','datatables.scroller','restangular']);
app.config(function ($stateProvider, $urlRouterProvider, $sceProvider){
	$urlRouterProvider.otherwise('/');
	$sceProvider.enabled(false);
	$stateProvider
	.state('productsTab',{
		url:'/',
		views:{
			'productView':{
				templateUrl:Orion.globalVars.orion_path+'templates/orion/steps/ProductView.tpl.html',
				controller:'ProductViewCtrl'
			}
		}
	})
}).config(function ($tooltipProvider) { 
    $tooltipProvider.setTriggers({'openTrigger': 'closeTrigger'});
})

