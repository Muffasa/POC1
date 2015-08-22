angular.module('MTPOC')

.run(function($rootScope,$q,$ionicLoading ,$cordovaGeolocation){
   document.addEventListener("deviceready", onDeviceReady, false);

   function onDeviceReady(){
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


             $cordovaGeolocation.getCurrentPosition(watchOptions);
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

            $rootScope.getCurrentPosition = function(){

                 var options = {			
			enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
			};
                     $ionicLoading.show({
				            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location...'
				        });
		            $cordovaGeolocation.getCurrentPosition(options).then(
		            	
					function(position) {
						$ionicLoading.hide();
					var latitude = position.coords.latitude,
					longitude = position.coords.longitude;
					var location={
						lat:position.coords.latitude,
						lon:position.coords.longitude,

					}
					$rootScope.MainUserBind.location = position;
					$rootScope.MainUserBind.location.lat = position.coords.latitude;
					$rootScope.MainUserBind.location.lon = position.coords.longitude;

					  
					},function(error){
						$ionicLoading.hide();
						alert(error.message);
					});

            };
          	
         

  };
});
