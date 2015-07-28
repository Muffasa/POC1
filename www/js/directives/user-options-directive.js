angular.module("MTPOC")

.directive("userOptions",function(){
	
return {

    restrict: 'E',
    templateUrl: 'templates/myDirectives/user-options-directive.html',
    scope:false,

    controller: 'userOptionsCtrl'
    	


    }

})