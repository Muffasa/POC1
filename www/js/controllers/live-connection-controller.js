angular.module("live-connection.controller",[])

.controller('LiveConnectionCtrl', function($scope,$rootScope,$state,$stateParams,$ionicModal,$ionicHistory,socket,ConversationF,CampaignsService) {


        $scope.$on('$ionicView.beforeEnter', function() {

         $scope.dialpadInput="";

       

        $scope.unRegisterAnswered = $scope.$on("outgoingCall:answered",function(){
              console.log("outgoing call answered");
                $scope.callingModal.remove();
                $scope.$broadcast('timer-start');
                //unRegisterAnswered();
            })
        $scope.unRegisterRejected = $scope.$on("outgoingCall:rejected",function(){
             // alert("סוננת");
               // $scope.callingModal.remove();
                if(window.cordova)
                 $rootScope.TwilioClient.hangup();
                else
                 ConversationF.endConnection();
             //swipeAndClean();

             //unRegisterRejected();
                //$ionicHistory.goBack(); 
            })
        $scope.unRegisterCanceled = $scope.$on('incomingCall:canceled',function(){
        	if(window.cordova)
             $rootScope.TwilioClient.hangup();
            else
             ConversationF.endConnection();	
         //swipeAndClean();
        })
        $scope.unRegisterConnectionEnded =  $scope.$on('connection-ended',function(){
              console.log("call ended");
              swipeAndClean();
              //if($ionicHistory.backView())
             // $ionicHistory.goBack();
             // else
              	$state.go("app.allUsers");
              $scope.unRegisterConnectionEnded();

            });
        $scope.unRegisterIncomingEnded =  $scope.$on('incomingCall:ended',function(){
             // console.log("incoming call ended");
             // swipeAndClean();
              $scope.unRegisterConnectionEnded();

            });
        $scope.unRegisterOutgoingEnded =  $scope.$on('outgoingCall:ended',function(){
                    //console.log("outgouing call ended");
                    
                   // swipeAndClean();
                   // unRegisterOutgoingEnded();
                    
            });
        })
     $scope.$on('$ionicView.afterLeave', function() {
     	$scope.unRegisterCanceled();
     	$scope.unRegisterAnswered();
     	$scope.unRegisterRejected();
     	$scope.unRegisterConnectionEnded();
     	$scope.unRegisterIncomingEnded();
     	$scope.unRegisterOutgoingEnded();
     })
     $scope.$on('$ionicView.enter', function() {
         $scope.$parent.hideHeader();
         $scope.$parent.myClearFabs();
         $scope.peerUser=$rootScope.peerUser;

         if($rootScope.callType=="incoming")
         {    

              //$scope.currentCampaign =CampaignsService.getCampaignById($rootScope.binds.convManager.currentCampaignId);
              $scope.peerUser = $rootScope.MainUserBinding.convManager.peerCaller;
              $scope.convManager=$rootScope.binds.convManager;
              
              $ionicModal.fromTemplateUrl('templates/modals/incoming-call-modal.html', {
              scope: $scope,
              animation: 'slide-in-up',
              backdropClickToClose: false,
              hardwareBackButtonClose: false
            }).then(function(modal) {
              $scope.incomingCallModal = modal;

              $scope.incomingCallModal.show();
              setTimeout(function() {
                $rootScope.$broadcast('incomingCallModal.show');
              }, 500);
              

            },function(error){
              console.log(error);
            });

            

            
         }
         if($rootScope.callType=="outgoing"){
          $scope.canCancel=false;
            $scope.currentCampaign = $rootScope.binds.peerConvManager.currentCampaign;
            $scope.convManager=$rootScope.binds.peerConvManager;
            $scope.peerUser=$rootScope.peerUser;
           $ionicModal.fromTemplateUrl('templates/modals/calling-modal.html', {
              scope: $scope,
              animation: 'slide-in-up',
              backdropClickToClose: false,
              hardwareBackButtonClose: false
            }).then(function(modal) {
              $scope.callingModal = modal;
            $scope.callingModal.show();
              $rootScope.$broadcast('callingModal.show');

            },function(error){
              console.log(error); 
            });

           
            $scope.$on("canCancel",function(){
              $scope.canCancel=true;
            })

                $scope.abortCall = function(){
                  if($scope.canCancel){


                      if(window.cordova)
                      $rootScope.TwilioClient.abort();
                      else
                      ConversationF.abort();
                     // $scope.callingModal.remove();
                      //$ionicHistory.goBack();
                }
              }
               
            

         }

        


       });

     $scope.$on('$ionicView.leave', function() {

      $scope.$broadcast('timer-reset');
       });
      $scope.$on('$destroy', function () {
         swipeAndClean();
      });

          var swipeAndClean = function(){

            // if(window.cordova)
             //	$rootScope.TwilioClient.hangup();
             //else
             	//ConversationF.endConnection();

             if($scope.incomingCallModal)
            $scope.incomingCallModal.remove();
          if($scope.callingModal)
            $scope.callingModal.remove();
          if($scope.dialpadModal)
            $scope.dialpadModal.remove();

             
          }
           $scope.pressed = function (num){
              $scope.dialpadInput+=num;
              $rootScope.TwilioClient.sendDigits(num);
            };
              $scope.removed = function (){
              $scope.dialpadInput=$scope.dialpadInput.slice(0,$scope.dialpadInput.length - 1);
            }
 
      
        $scope.micOn=false;
     $scope.speaker = function(){
          $scope.micOn=!$scope.micOn;
          $scope.micOn? $rootScope.TwilioClient.setSpeaker("on"):$rootScope.TwilioClient.setSpeaker("off");
        };

       $scope.showForm=false; 
       $scope.focusInput=false;
       $scope.dialpadShow=false;
     $scope.toggleDialpad = function(){
          $scope.dialpadShow=!$scope.dialpadShow;
          $scope.showForm=!$scope.showForm; 
          $scope.focusInput=!$scope.focusInput;
        };

     $scope.hangup = function(){
      if(window.cordova)
      $rootScope.TwilioClient.hangup();
      else
        ConversationF.endConnection();
      //$ionicHistory.goBack(); 


     }   
 

     $scope.showDialpad = function(){
        $scope.dialpadShow=!$scope.dialpadShow;
        if(!$scope.dialpadShow)
        {
          $scope.dialpadModal.hide();
        }
        else{
                $ionicModal.fromTemplateUrl('templates/modals/dialpad-modal.html', {
                  scope: $scope,
                  animation: 'slide-in-up',
                  backdropClickToClose: true,
                  hardwareBackButtonClose: true
                }).then(function(modal) {
                  $scope.dialpadModal = modal;

                  $scope.dialpadModal.show();
                  $scope.$broadcast('dialpadModal.show');

                },function(error){
                  console.log(error);
                });
               
           }

     }

     
     
     

                 $scope.$on('callingModal.removed', function() {
                  if($scope.dialpadModal)
                        $scope.dialpadModal.remove();
                        $scope.$broadcast('timer-start');
                  });
                 $scope.$on('incomingCallModal.removed', function() {
                  if($scope.dialpadModal)
                        $scope.dialpadModal.remove();
                        $scope.$broadcast('timer-start');
                  });
                 $scope.$on('dialpadModal.hidden', function() {
                        $scope.dialpadShow=false;
                  });






})