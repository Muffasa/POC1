angular.module('MTPOC')

.controller("incomingCallCtrl",function ($scope,$rootScope,$state,$http,$q,$ionicHistory,MediaSrv,socket,CampaignsService,ConversationF){
      

      
      $rootScope.$on("incomingCallModal.show",function(){
         initRington().then(function(){
          $rootScope.rington.play();
        },function(error){
          console.log(error);
        });
          
       // $scope.$broadcast('timer-set-countdown',$rootScope.currentCampaign.lenght);
        $scope.$broadcast('timer-start');
      });
      $scope.peerUser = $rootScope.MainUserBinding.convManager.peerCaller;
      var campaign = CampaignsService.getCampaignById($rootScope.MainUserBinding.convManager.currentCampaignId);
      campaign.$loaded(function(data){
        $scope.currentCampaign = data;
      })
      $scope.currentCampaign=$rootScope.MainUserBinding.convManager.currentCampaign;
      var initRington = function(){
        var d =$q.defer();
        MediaSrv.loadMedia('./Assets/rington.mp3').then(function(media)
          {
            if(!$rootScope.rington)
            $rootScope.rington=media;
            d.resolve();
          

            
          },function(error){
            d.reject(error);
          })
        return d.promise;
      };

      
     // $scope.From = JSON.parse($scope.from);
      //$scope.CurrentCampaign = JSON.parse($scope.currentCampaign);


      $scope.answer = function(){
              if(window.cordova)
              $rootScope.TwilioClient.answer();
              else
                ConversationF.answer();
              $rootScope.rington.pause();
              $rootScope.rington.reset(); 
              $scope.incomingCallModal.remove();

              socket.emit("answered",$rootScope.MainUser.phone_number);

              

              
            
      };
      $scope.reject = function(){
        if(window.cordova)
        $rootScope.TwilioClient.reject();
        else
          ConversationF.reject();
        $rootScope.rington.pause();
        $rootScope.rington.reset();
        initRington();
        $scope.incomingCallModal.remove();
        $state.go("app.profile");
     }
      /*$scope.reject = function(){
        $rootScope.rington.pause();
        $rootScope.rington.reset();
        initRington();
        $scope.$broadcast('timer-reset');
        $scope.incomingCallModal.remove();
        socket.emit("rejectCall");
        $rootScope.MainUser.convManager.status = "canceled";
      };*/
      $scope.messege = function(){
        //new modal  with templat es messeges and text box
      };
      $scope.$on('$destroy',function(){
        unRegisterEnded();
        $rootScope.rington.pause();
        $rootScope.rington.reset();
        initRington();
        $scope.incomingCallModal.remove();

      })

      
     var unRegisterEnded =  $scope.$on('incomingCall:ended',function(){
         $rootScope.rington.pause();
         $rootScope.rington.reset();
         initRington();
         $scope.incomingCallModal.remove();

      });

    })
.controller("userOptionsCtrl",function ($scope,$rootScope,$state,ConversationF){
      
      
      

      $scope.messege = function(){
        alert("messege to" +$scope.selectedUser.phone_number );
        $scope.userOptionsModal.remove().then(function(){

        
        });
      }

      $scope.call = function(){
        
        $scope.userOptionsModal.remove();
        $rootScope.peerUser=$scope.selectedUser;
        if(window.cordova)
        $rootScope.TwilioClient.call($scope.selectedUser.phone_number);
        else
        ConversationF.connect($scope.selectedUser.phone_number);
      }
        
    })