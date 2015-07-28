angular.module("MTPOC")

.directive('incomingCall',['$state','$rootScope',function($state,$rootScope) {
  return {

    restrict: 'E',
    templateUrl: 'templates/myDirectives/incoming-call-directive.html',
    scope:false,/*{

    	from:"@",
      currentCampaign:"@",
      test:"=test"

    },*/

    controller: 'incomingCallCtrl'
    	


    }
 
}])