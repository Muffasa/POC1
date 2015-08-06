angular.module('MTPOC')

.run(function($rootScope,$q,$cordovaGeolocation){

      $rootScope.$on('MainUserSet',function(){
      	if(window.cordova)
        initialize();

      });


          var initialize = function(){
			var watchId = {},
			watchOptions = {
			frequency: 10000,//15 * 60 * 1000,
			timeout : 5000,//1 * 60 * 1000,
			enableHighAccuracy: true
			};

			var watchId = $cordovaGeolocation.watchPosition(watchOptions);

			watchId.then(
			null,
			function(err) {
			console.log('Error: ' + err);
			},
			function(position) {
			var latitude = position.coords.latitude,
			longitude = position.coords.longitude;
			var location={
				lat:position.coords.latitude,
				lon:position.coords.longitude,

			}
			$rootScope.MainUserBind.location = position;
			$rootScope.MainUserBind.location.lat = position.coords.latitude;
			$rootScope.MainUserBind.location.lon = position.coords.longitude;

			  //localStorageService.add('keyGPS', watchId);
			});

          };
          	
         


});
