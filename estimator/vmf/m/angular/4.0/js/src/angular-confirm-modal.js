(function(){
"use strict";

//== Controllers =============================================================//
// confirmDialog.controllers: module declaration
var ctrlrs = angular.module('confirmDialog.controllers',['ui.bootstrap.modal']);
/**
 * Confirm Dialog Controller 
 */
ctrlrs.controller('confirmDialogCtrl',['$scope','$modalInstance','data',function($scope,$modalInstance,data){
  //-- Variables -----//
  //{size:'lg',keyboard: true,backdrop: false,windowClass: 'my-class'}
  $scope.header = data.header;
  $scope.msg = data.msg;
  $scope.btnYesText = data.btnYesText;
  $scope.btnNoText = data.btnNoText;
  $scope.confirmIconType = data.confirmIconType;
  if($scope.confirmIconType == '' || $scope.confirmIconType == null || $scope.confirmIconType == undefined){
    $scope.confirmIconTypeShow = false;
  }
  else{
    $scope.confirmIconTypeShow = true; 
  }

  if($scope.btnNoText == '' || $scope.btnNoText == null || $scope.btnNoText == undefined){
    $scope.btnNoTextShow = false;
  }
  else{
    $scope.btnNoTextShow = true; 
  }

  if($scope.header == '' || $scope.header == null || $scope.header == undefined){
    $scope.headerShow = false;
  }
  else{
    $scope.headerShow = true; 
  }

  //-- Methods -----//
  
  $scope.confirmNo = function(){
    $modalInstance.dismiss('no');
  }; // end close
  
  $scope.confirmYes = function(){
    $modalInstance.close('yes');
  }; // end yes
}]); // end ConfirmDialogCtrl / confirmDialog.controllers
//== Services ================================================================//

angular.module('confirmDialog.services',['ui.bootstrap.modal','confirmDialog.controllers'])

  .provider('confirmDialog',[function(){
    var _b = true; // backdrop
    var _k = true; // keyboard
    var _w = 'dialogs-default'; // windowClass
    var _copy = true; // controls use of angular.copy
    var _wTmpl = null; // window template
    var _wSize = 'lg'; // large modal window default
    var modalObj = {};

    var _setOpts = function(opts){
      var _opts = {};
      opts = opts || {};
      _opts.kb = (angular.isDefined(opts.keyboard)) ? opts.keyboard : _k; // values: true,false
      _opts.bd = (angular.isDefined(opts.backdrop)) ? opts.backdrop : _b; // values: 'static',true,false
      _opts.ws = (angular.isDefined(opts.size) && (angular.equals(opts.size,'sm') || angular.equals(opts.size,'lg') || angular.equals(opts.size,'md'))) ? opts.size : _wSize; // values: 'sm', 'lg', 'md'
      _opts.wc = (angular.isDefined(opts.windowClass)) ? opts.windowClass : _w; // additional CSS class(es) to be added to a modal window

      return _opts;
    }; // end _setOpts

    /**
     * Use Backdrop
     * 
     * Sets the use of the modal backdrop.  Either to have one or not and
     * whether or not it responds to mouse clicks ('static' sets the 
     * backdrop to true and does not respond to mouse clicks).
     *
     * @param val   mixed (true, false, 'static')
     */
    this.useBackdrop = function(val){ // possible values : true, false, 'static'
      if(angular.isDefined(val))
        _b = val;
    }; // end useStaticBackdrop

    /**
     * Use ESC Close
     * 
     * Sets the use of the ESC (escape) key to close modal windows.
     *
     * @param val   boolean
     */
    this.useEscClose = function(val){ // possible values : true, false
      if(angular.isDefined(val))
        _k = (!angular.equals(val,0) && !angular.equals(val,'false') && !angular.equals(val,'no') && !angular.equals(val,null) && !angular.equals(val,false)) ? true : false;
    }; // end useESCClose

    /**
     * Use Class
     *
     * Sets the additional CSS window class of the modal window template.
     *
     * @param val   string
     */
    this.useClass = function(val){
      if(angular.isDefined(val))
        _w = val;
    }; // end useClass

    /**
     * Use Copy
     * 
     * Determines the use of angular.copy when sending data to the modal controller.
     *
     * @param val   boolean
     */
    this.useCopy = function(val){
      if(angular.isDefined(val))
        _copy = (!angular.equals(val,0) && !angular.equals(val,'false') && !angular.equals(val,'no') && !angular.equals(val,null) && !angular.equals(val,false)) ? true : false;
    }; // end useCopy

    /**
     * Set Window Template
     *
     * Sets a path to a template to use overriding modal's window template.
     *
     * @param val   string
     */
    this.setWindowTmpl = function(val){
      if(angular.isDefined(val))
        _wTmpl = val;
    }; // end setWindowTmpl

    /**
     * Set Size
     *
     * Sets the modal size to use (sm,lg,md), requires Angular-ui-Bootstrap 0.11.0 and Bootstrap 3.1.0 + 
     *
     * @param val   string (sm,lg,md)
     */
    this.setSize = function(val){
      if(angular.isDefined(val))
        _wSize = (angular.equals(val,'sm') || angular.equals(val,'lg') || angular.equals(val,'md')) ? val : _wSize;
    }; // end setSize


    this.$get = ['$modal',function ($modal){
      
      return {
        /**
         * Confirm Dialog
         *
         * @param header  string
         * @param msg   string
         * @param opts  object
         */
        confirm : function(modalObj,opts){
          opts = _setOpts(opts);

          return $modal.open({
            templateUrl : '/confirmDialog/confirmModal.html',
            controller : 'confirmDialogCtrl',
            backdrop: opts.bd,
            keyboard: opts.kb,
            windowClass: opts.wc,
            size: opts.ws,
            resolve : {
              data : function(){
                return {
                  header : angular.copy(modalObj.header),
                  msg : angular.copy(modalObj.msg),
                  btnYesText : angular.copy(modalObj.btnYesText),
                  btnNoText : angular.copy(modalObj.btnNoText),
                  confirmIconType : angular.copy(modalObj.confirmIconType)
                };
              }
            }
          }); // end modal.open
        } // end confirm

      }; // end return

    }]; // end $get
  }]); // end provider confirmDialog
//== confirmDialog.Main Module =====================================================//

/**
 * Include this module 'confirmDialog.main' in your module's dependency list where you
 * intend to use it.  Then inject the 'confirmDialog' service in your controllers that
 * need it.
 */

angular.module('confirmDialog.main',['confirmDialog.services','ngSanitize']) // requires angular-sanitize.min.js (ngSanitize) //code.angularjs.org/1.2.1/angular-sanitize.min.js
    
  // Add default templates via $templateCache
  .run(['$templateCache','$interpolate',function($templateCache,$interpolate){
    
      // get interpolation symbol (possible that someone may have changed it in their application instead of using '{{}}')
      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
    
      $templateCache.put('/confirmDialog/confirmModal.html',
        // '<div class="modal-header dialog-header-confirm">\
        //   <button type="button" class="close" ng-click="confirmNo()">&times;</button>\
        //   <h4 class="modal-title"><span class="glyphicon glyphicon-check"></span> '+startSym+'header'+endSym+'</h4>\
        // </div>\
        // <div class="modal-body" ng-bind-html="msg">\
        // </div>\
        // <div class="modal-footer">\
        // <button type="button" class="btn btn-default" ng-click="confirmYes()">'+startSym+'btnYesText'+endSym+'</button>\
        // <button type="button" class="btn btn-primary" ng-click="confirmNo()">'+startSym+'btnNoText'+endSym+'</button>\
        // </div>'
      
      '<div class="modal-header">\
        <span class="close" data-dismiss="modal" aria-hidden="true" ng-click="confirmNo()"></span>\
        <h4 ng-if="headerShow" class="modal-title" ng-bind-html="header"></h4>\
      </div>\
      <div class="modal-body">\
        <div ng-if="confirmIconTypeShow" class="'+startSym+'confirmIconType'+endSym+'-icon">\
         <span></span>\
        </div>\
        <div class="confirm-msg">\
          <p ng-bind-html="msg"></p>\
        </div>\
      </div>\
      <div class="modal-footer">\
        <a data-dismiss="modal" class="btn btn-primary" ng-click="confirmYes()">'+startSym+'btnYesText'+endSym+'</a>\
        <a ng-if="btnNoTextShow" data-dismiss="modal" class="btn btn-default margin-left-20" ng-click="confirmNo()">'+startSym+'btnNoText'+endSym+'</a>\
      </div>'
      );
  }]); // end run / confirmDialog.main
})();