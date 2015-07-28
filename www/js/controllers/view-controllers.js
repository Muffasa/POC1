/* global angular, document, window */
'use strict';


angular.module('view.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal,$state, $ionicPopover, $timeout,User) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    $scope.logout=function (){
       User.unauth();
       $state.go("welcome.home");
    }
    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
    $scope.myClearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length  ) {
            fabs[0].remove();
        }
    };
    $scope.socialLogin =  function(provider) {
        $rootScope.showLoading();
        if(provider)
        {
          User.socialAuth(provider).then(function(authData) {
          console.log("Logged in as:", authData.uid);
          $rootScope.hideLoading();
        },function(error) {
          if(error=="no user found on db"){

            $ionicPopup.alert({
              title:"Not registered",
              subTitle:"Your are not registered yet, please verify your phone number first."

            }).then(function(res){
              $ionicHistory.goBack();
            })
          }
          console.error("Authentication failed:", error);
          $rootScope.hideLoading();
        });
      }
      else{
        User.regularAuth($scope.email,$scope.password).then(function(authData){
          console.log("regular login success");
          $rootScope.hideLoading();
        },
        function(error){
          console.log("wrong email or password");
          $rootScope.hideLoading(); 
        });
      }
  };
})


.controller('AllUsersCtrl', function($scope,$rootScope, $stateParams,$ionicModal,$ionicPopup, $timeout, ionicMaterialInk, ionicMaterialMotion,UsersService) {

    $scope.allAppUsers = UsersService.getAllAppUsers();
    
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
.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion,CampaignsService) {
  $scope.allCampaigns = CampaignsService.getAllCampaigns();
  $scope.allCampaigns.$watch(function(event){
    if($scope.allowMotion)
    {
        campaignsMotion();
    }
  })

  var campaignsMotion = function(){
            $timeout(function() {
              $scope.isExpanded = true;
              $scope.$parent.setExpanded(true);
          }, 300);


          

          ionicMaterialInk.displayEffect();

          ionicMaterialMotion.pushDown({
              selector: '.push-down'
          });
          ionicMaterialMotion.fadeSlideInRight({
              selector: '.animate-fade-slide-in .item'
          });
  }

    
    $scope.allowMotion=false;
    

    $scope.$on('$ionicView.beforeEnter', function() {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('left');

    $scope.$on('ngRepeatFinished', function() {
      $scope.allowMotion=true;
      campaignsMotion();
    })
    if($scope.allowMotion)
    {
        campaignsMotion();
    }


  
  });

 
})
.controller('ProfileCtrl', function($scope,$rootScope,$state, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    
$scope.$on('$ionicView.beforeEnter', function() {
  $scope.$parent.myClearFabs();



    // Set Header

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
   /* $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);*/

    // Set Ink
    ionicMaterialInk.displayEffect();
    });

    $scope.isFull =false;
     $scope.$on('$ionicView.beforeEnter', function() {
     
     if($rootScope.MainUser)
      if($rootScope.MainUser.isFull){
          $scope.isFull =true;
          $scope.profilePicture=$rootScope.MainUser.profileImageURL;
       // $scope.coverPhotoUrl=$rootScope.MainUser.facebookData.coverPhotoUrl;
        $scope.displayName= $rootScope.MainUser.displayName;
      }
      else
      {
        $scope.isFull =false;
      }
 
       });

    
    $rootScope.$on('MainUserSet',function(){
        $scope.isFull = $rootScope.MainUser.isFull? true:false;
        $scope.profilePicture=$rootScope.MainUser.profileImageURL;
       // $scope.coverPhotoUrl=$rootScope.MainUser.facebookData.coverPhotoUrl;
        $scope.displayName= $rootScope.MainUser.displayName;
      });
    
    $scope.test=false;
    $scope.isExpanded = false;





    $scope.goToSingin=function()
    {
      $state.go('app.sing-up');
    } 

})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  $scope.$on('$ionicView.enter', function() {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('left');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
  });
})



.controller('DialpadCtrl', function($scope,$rootScope,$state,$ionicPopup, $http,User,$ionicModal,socket,ionicMaterialInk) {
            
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
     ionicMaterialInk.displayEffect();

            $scope.dialpadInput="";

               
            // Make a Twilio call.
            $scope.call = function (to) {
              if(to == "tom"){
                $rootScope.connection=$rootScope.TwilioClient.call('+972-tom');
                //$state.go('live-connection');
              }
              else{
                var addPrefix = "+972-"+to;

                $rootScope.connection=$rootScope.TwilioClient.call(addPrefix);    
                //$rootScope.peerUser = user;
                socket.emit('outgoingCall',addPrefix);
 
               /*UsersService.getUserByPhoneNumber(addPrefix).then(function(user){
               $rootScope.connection=$rootScope.TwilioClient.call(addPrefix);    
                $rootScope.peerUser = user;
                socket.emit('outgoingCall',addPrefix);
                
               },function(error){
                alert("user dosent exist");
               })*/
              }

            };

            $scope.answer = function(){
              $rootScope.connection = $rootScope.TwilioClient.answer();
              //Ring.stop();
            };

            // Hang up a Twilio call.
            $scope.hangUp = function () {
              $rootScope.TwilioClient.hangup(); // Disconnect our call.
            };

            $scope.pressed = function (num){
              $scope.dialpadInput+=num;
              $rootScope.TwilioClient.sendDigits(num);
            };

            $scope.removed = function (){
              $scope.dialpadInput=$scope.dialpadInput.slice(0,$scope.dialpadInput.length - 1);
            }


              $scope.speakerON=false;
            $scope.toggleSpeaker = function() {
              $scope.speakerON=!$scope.speakerON;
              $scope.speakerON? $rootScope.TwilioClient.setSpeaker('on'):$rootScope.TwilioClient.setSpeaker('off');
            };
         
            $scope.IncomingCall=false;
            socket.on("IncomingCall",function(from){
              $scope.IncomingCall=true;
            })





         })





;
