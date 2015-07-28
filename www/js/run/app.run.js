angular.module("MTPOC")

.run(function($ionicPlatform,$rootScope,$ionicLoading,$cordovaSplashscreen,User) {
  $ionicPlatform.ready(function() {
    //if(window.cordova)
    //$cordovaSplashscreen.show();

	if(window.debugMode)
    User.debugAuth(window.debugState);
    else{
    	 if(User.gotAuthToken()){
            console.log("device have auth token, Authing user...");
            User.auth().then(function(user){
              console.log("user has a token, connected as user:"+$rootScope.MainUser.phone_number);

              if(window.cordova)
               $cordovaSplashscreen.hide();

            });
          }
          else{
            console.log("no auth token on device..fresh start...");

            User.unauth();

            if(window.cordova)
            $cordovaSplashscreen.hide();
          }
    }

        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
          
          if($rootScope.MainUser){
            if(toState.name.search('welcome')>=0){
              event.preventDefault();
            }
            if($rootScope.MainUser.isFull){
              if(toState.name=="app.sing-up"){
                event.preventDefault();
               }
            }
          }

  
    });


    $rootScope.showLoading = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };
 
 
    $rootScope.hideLoading = function() {
      $ionicLoading.hide();
    };
      $rootScope.currentCampaign = {
                                            id: 0,
                                            name: 'Dayatsu',
                                            length:'14',
                                            pps: '0.02',
                                            ppfl: '0.5',
                                            audioUrl:'./Assets/dayatsu_14s.mp3',
                                            face: './Assets/logo.jpg'
                                          };
     $rootScope.peerUser={
                                     id: 0,
                                      displayName: 'Ben Sparrow',
                                      phone_number: '+972-0544552644',
                                      face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',
                                      profileImageURL: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
                                    };
                                  });
    
})