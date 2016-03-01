angular.module('modalPopupMod', [])
.directive('modalPopup', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace:true,
        scope: {
            size: '@',
            title:'@',
            buttonTitle:'@',
            backbutton:'@',
            id:'@',
            onback:'&'
        },
        //template:'Helo helo',
        templateUrl: "/vmf/m/components/modal/modalTemplate.tpl.html",
        link: function(scope, elem) {
            scope.$watch("modalShown", function(newValue, OldValue, scope) {
                //alert(scope.modalShown);
                if (scope.modalShown) {
                    angular.element('html').addClass('modal-open');
                    angular.element('.modalLoad .modal').addClass('in');
                 } else {
                    angular.element('html').removeClass('modal-open');
                    angular.element('.modalLoad .modal').removeClass('in');
                }
            });

            scope.hideModal = function() {
                //console.log(scope.modalSize);
                //console.log('hide/show');  
                scope.modalShown = false;
            };

            scope.primaryBtn = function() {
                //console.log(scope.modalSize);
                //console.log('primaryBtn');
            };

            scope.test = function($event) {
                // console.log($event.which);
                if($event.which === 27) {
                    scope.modalShown = false;
                    elem.find('.modal-backdrop').hide();
                }
            };
            elem.find('.modal-backdrop').show();
        }
    };
});