angular.module('MTPOC')

.controller("incomingCallCtrl",function ($scope,$rootScope,$state,$http,$q,$ionicHistory,MediaSrv,socket,CampaignsService,ConversationF){
      

      
      $rootScope.$on("incomingCallModal.show",function(){
          //mainInitRington();
          if(!$scope.rington)
          initRington().then(function(){
            $scope.rington.play();
          });
       // $scope.$broadcast('timer-set-countdown',$rootScope.currentCampaign.lenght);
        $scope.$broadcast('timer-start');
      });
      $scope.$on('timer-stopped', function (event, data){
                //Works!!!
            });



      $scope.peerUser = $rootScope.MainUserBinding.convManager.peerCaller;
      $scope.currentCampaign = CampaignsService.getCampaignById($rootScope.MainUserBinding.convManager.currentCampaignId);
      //campaign.$loaded(function(data){
      //  $scope.currentCampaign = data;
    // })

      var initRington = function(){
        var d =$q.defer();
        if(!$scope.rington){
        MediaSrv.loadMedia('./Assets/rington.mp3').then(function(media)
          {
             media.setLoop(true);

            $scope.rington=media;
            d.resolve();
        
          },function(error){
            d.reject(error);
          })
        
      };
      d.resolve();
      return d.promise;
    }

      
     // $scope.From = JSON.parse($scope.from);
      //$scope.CurrentCampaign = JSON.parse($scope.currentCampaign);


      $scope.answer = function(){
              if(window.cordova)
              $rootScope.TwilioClient.answer();
              else
                ConversationF.answer();
              $scope.rington.pause();
              $scope.rington.reset(); 
              $scope.incomingCallModal.remove();
              $rootScope.$broadcast("incomingCallModal.removed");

              socket.emit("answered",$rootScope.MainUser.phone_number);

              

              
            
      };
      $scope.reject = function(){
        if(window.cordova)
        $rootScope.TwilioClient.reject();
        else
          ConversationF.reject();
        $scope.rington.pause();
        $scope.rington.reset();
        $scope.incomingCallModal.remove();
        $rootScope.$broadcast("incomingCallModal.removed");
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
        $scope.rington.pause();
        $scope.rington.reset();
        $scope.incomingCallModal.remove();

      })

      
     var unRegisterEnded =  $scope.$on('end-connection',function(){
         $scope.rington.pause();
         $scope.rington.reset();
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