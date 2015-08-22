angular.module("settings.controllers",[])

.controller('MapModalController', function($rootScope,$scope, $ionicLoading) {
 
    var unRegisterMapModalShow = $scope.$on("mapModal.shown",function() {
    	if(!$rootScope.map)
    	initializeMap();
        else{
        	google.maps.Map.getMap(document.getElementById("map"));
        	google.maps.event.trigger($rootScope.map, 'resize');
            $scope.$parent.map.setZoom( $rootScope.map.getZoom() );
        }
        unRegisterMapModalShow();
    });
	 var initializeMap = function(){
	       var myLatlng = new google.maps.LatLng($scope.$parent.lat,$scope.$parent.lon);
		   var mapOptions = {
			            center: myLatlng,
			            zoom: 16,
			            bounds: {},
					    control: {},
					    events: {
					        tilesloaded: function (map) {
					                $scope.$apply(function () {
					                    google.maps.event.trigger(map, "resize");
					                });
					            }
					        },
			            mapTypeId: google.maps.MapTypeId.ROADMAP
			        };
			 
			var map = new google.maps.Map(document.getElementById("map"), mapOptions);

			     placeMarker(myLatlng, map);

			     google.maps.event.addListener(map, 'click', function(e) {
				    placeMarker(e.latLng, map);
				 });

            	
			        $rootScope.map = map;
					        
		        }

    $scope.$parent.userMarker={};
    function placeMarker(position, map) {
	  var marker = new google.maps.Marker({
	    position: position,
	    map: map
	  });
	  if($scope.$parent.userMarker.map)
	  	$scope.$parent.userMarker.setMap(null);
      $scope.$parent.userMarker={};
      $scope.$parent.userMarker=marker;
	  map.panTo(position);
	  $scope.$parent.lat = position.G;
	  $scope.$parent.lon = position.K;
	}


    $scope.getGPSLocation = function()
    {
    	    navigator.geolocation.getCurrentPosition(function(pos) {
    	    	if(pos){
    	    		var latLngPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    	    		/*map.setCenter(latLngPos);
		            var myLocation = new google.maps.Marker({
		                position: latLngPos,
		                map: map,
		                title: "My Location"
		            });*/
		            placeMarker(latLngPos, $rootScope.map);
    	    	}
    	    	else{
    	    		alert("please turn on GPS");
    	    	}
            
        });
    }


    $scope.setFixedLocation = function(){
    	$rootScope.MainUserBind.location.lat = $scope.$parent.lat;  
    	$rootScope.MainUserBind.location.lon = $scope.$parent.lon;           
    }

     $scope.$on("mapModal.removed",function(){

      })
     $scope.$on("$destroy",function(){

      })
 
})

.controller('MapCtrl', function($rootScope,$scope, $ionicLoading) {

	
	$scope.$on("$ionicView.enter",function() {
       if($rootScope.MainUserBind.location)
            {
              
              $scope.lat = $rootScope.MainUserBind.location.lat;
              $scope.lon = $rootScope.MainUserBind.location.lon;
            }
            else{
              $scope.lat=32.06083103065693;
              $scope.lon=34.77649688720703;
            }

    });

    $scope.$on('mapInitialized', function(event, map) {
    	var center= new google.maps.LatLng($scope.lat,$scope.lon);
      map.setCenter(center);
      placeMarker(center, map);
      google.maps.event.addListener(map, 'click', function(e) {
				    placeMarker(e.latLng, map);
				 });
      $rootScope.map=map;
    });

    $scope.$on("$ionicView.afterEnter",function() {
    	/*if(!$rootScope.map)
    	initializeMap();
        else{
        	
        	google.maps.event.trigger($rootScope.map, 'resize');
            $scope.$parent.map.setZoom( $rootScope.map.getZoom() );
        }*/
        if($rootScope.map)
        {
            google.maps.event.trigger($rootScope.map, 'resize');
            $scope.map.setZoom( $rootScope.map.getZoom() );
        }
    });
	 var initializeMap = function(){
	       var myLatlng = new google.maps.LatLng($scope.lat,$scope.lon);
		   var mapOptions = {
			            center: myLatlng,
			            zoom: 14,
			            mapTypeId: google.maps.MapTypeId.ROADMAP
			        };
			 
			var map = new google.maps.Map(document.getElementById("gmap"), mapOptions);

			     placeMarker(myLatlng, map);

			     google.maps.event.addListener(map, 'click', function(e) {
				    placeMarker(e.latLng, map);
				 });
				/*google.maps.event.addListenerOnce(map, 'idle', function() {
					google.maps.event.trigger(map, 'resize');
				});*/
            	
			        $rootScope.map = map;
					        
		        }

    $scope.userMarker={};
    function placeMarker(position, map) {
	  var marker = new google.maps.Marker({
	    position: position,
	    map: map
	  });
	  if($scope.userMarker.map)
	  	$scope.userMarker.setMap(null);
      $scope.userMarker={};
      $scope.userMarker=marker;
	  map.panTo(position);
	  $scope.lat = position.G;
	  $scope.lon = position.K;
	  if($scope.$root)
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
	}


    $scope.getGPSLocation = function()
    {
    	     if(window.cordova)
    	     {
                $rootScope.getCurrentPosition();
    	     }
    	     else
    	     {


		    	    navigator.geolocation.getCurrentPosition(function(pos) {
		    	    	if(pos){
		    	    		var latLngPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				            placeMarker(latLngPos, $rootScope.map);
		    	    	}
		    	    	else{
		    	    		alert("no location, please turn on GPS");
		    	    	}
		            
		             });
		    	}
    }


    $scope.setFixedLocation = function(){
    	if(!$rootScope.MainUserBind.location)
    		$rootScope.MainUserBind.location={lat:0,lon:0};
    	$rootScope.MainUserBind.location.lat = $scope.lat;  
    	$rootScope.MainUserBind.location.lon = $scope.lon;           
    }
 
})
.controller('FixedUsersCtrl', function($scope,$rootScope, $stateParams,$ionicModal,$ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion,UsersService) {

    $scope.fixedUsers = UsersService.getAllAppUsers();//fixed users
    
    $scope.showOptions=function(user){
        //$rootScope.selectedUser=user;
        $scope.selectedUser=user;

       $ionicModal.fromTemplateUrl('templates/modals/user-options-modal.html', {
              scope: $scope,
              animation: 'slide-in-up',
              backdropClickToClose: true,
              hardwareBackButtonClose: true
            }).then(function(modal) {
              $scope.userOptionsModal = modal;
              $scope.userOptionsModal.show();
              $rootScope.$broadcast('userOptionsModal.show');
            },function(error){
              console.log(error);
            });
         /*$ionicPopup.show({
            templateUrl:'templates/modals/user-options-modal.html'

         })   */



            
              
              

    }
        var usersMotion = function(){
          $timeout(function() {
            $scope.isExpanded = true;
            $scope.$parent.setExpanded(true);
        }, 300);


        ionicMaterialMotion.fadeSlideInRight();


        ionicMaterialInk.displayEffect();
         }

    
    $scope.allowMotion=false;
    

    $scope.$on('$ionicView.beforeEnter', function() {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.$on('ngRepeatFinished', function() {
      $scope.allowMotion=true;
      usersMotion();
    })
    if($scope.allowMotion)
    {
        usersMotion();
    }


  
  });
    
})