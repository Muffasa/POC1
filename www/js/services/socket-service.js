angular.module("MTPOC")

.factory('socket',function(socketFactory,$rootScope,$state,$ionicModal,UsersService){
        
         var myIoSocket = io.connect('http://188.226.198.99:3000');
        
          mySocket = socketFactory({
            ioSocket: myIoSocket
          });

          $rootScope.$on('MainUserSet',function(){
            mySocket.emit('identify',$rootScope.MainUser.phone_number);
          });
          
          mySocket.on('incomingCall',function(fromUserNumber){

            console.log("incoming call from " + fromUserNumber +" recived");
            $state.go("app.live-connection",{connectionState:"ringing"});

            /*$rootScope.callerUser=fromUserNumber;
            //$rootScope.currentCampaign=
            
            $ionicModal.fromTemplateUrl('templates/modals/incoming-call-modal.html', {
              scope: $rootScope,
              animation: 'slide-in-up',
              backdropClickToClose: false,
              hardwareBackButtonClose: false
            }).then(function(modal) {
              $rootScope.incomingCallModal = modal;

            },function(error){
              console.log(error);
            });

            setTimeout(function() {
              $rootScope.incomingCallModal.show();
              $rootScope.$broadcast('incomingCallModal.show')}
              , 3000);*/



            
            

            
          })

        return mySocket;
    })