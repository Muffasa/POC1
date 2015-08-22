angular.module('init.controllers', [])
.controller('BaseWelcomeCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    $scope.userPhoneNumber=null;


})

.controller('WelcomeCtrl', function($scope,$rootScope,$state,$ionicPopup,$ionicUser,Auth,User, Countries,socket,$timeout,ionicMaterialInk) {

/* var deregister = $ionicPlatform.registerBackButtonAction(
                    function () {
                        alert("Show on the home page")
                    }, 1000
            );
            $scope.$on('$destroy', deregister)*/

      $scope.countries = Countries.all();
      $scope.selectedCountry= $scope.countries[102];
      $scope.usernumber=null;
      $scope.userCodeInput=null;

     

      
      $scope.goToLoginState = function(){
        $state.go('welcome.login');
      }

      $scope.ConfirmNumber = function(number) {

        if(true)//number.isValid and number is not registered yet) 9-10 digits 0on start or not insert
        {

		          var confirmPopup = $ionicPopup.confirm({
		            title: 'Confirmation',
		            template: 'Are you sure this is your phone number? an SMS will be send to this number: ' + $scope.selectedCountry.dial_code+'-'+number,
		            cancelText:'Cancel',
		            okText:'Send'

		          });
             
		        

		      confirmPopup.then(function(res) {
				        if(res) {
				            $rootScope.showLoading();
				            socket.emit("MiniRegister", $scope.selectedCountry.dial_code+'-'+number);

				            socket.on("MiniRegisterSuccess",function(){
				              $rootScope.user_phone_number=$scope.selectedCountry.dial_code+'-'+number;
				              $rootScope.hideLoading();
				            $state.go('welcome.post-sms',{userPhoneNumber:$scope.selectedCountry.dial_code+'-'+number,country:$scope.selectedCountry.name});
				            });
                     socket.on("UserPhoneNumberExists",function(){
                      socket.removeListener("UserPhoneNumberExists");
                      $rootScope.hideLoading();
                      console.log("UserPhoneNumberExists emited");
                      $ionicPopup.confirm({
                       title: 'Number Allready Exists',
                       template: 'The number you entered allready registered. \n Please login or re send sms activision code for this device',
                       cancelText:'Cancel',
		               okText:'Re-send'
                     }).then(function(res){
                                 if(res)
                                 {
                                 	socket.emit("ForceMiniRegister", $scope.selectedCountry.dial_code+'-'+number);
                                 	//TBD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                 }
                        });

                    });
				            
				            
				          }

		                                        
				         else {
				          
				        }
		    		})

        }

        else{//this number is in use, please login or re send sms activision code for this device

        }

      };

    

})
.controller('WelcomePostCtrl',function($scope,$rootScope,$http,$state,$stateParams,$ionicUser,$ionicPush,$ionicPopup,$q,$cordovaDevice,User,Countries,socket,TokensGenerator,$timeout){


  $scope.deviceUUID="no device";
  $scope.fullnumber=$stateParams.userPhoneNumber;

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    console.log('Ionic Push: Got token ', data.token, data.platform);
    $scope.ionicPushToken = data.token;
    if(window.cordova)
    {
    $scope.deviceUUID=$cordovaDevice.getUUID();
    console.log("cordovePush token:"+data.token+" Device uuid:"+$cordovaDevice.getUUID());
    }
  });

 $scope.ConfirmSmsCode =function(user_code){
  $rootScope.showLoading();
    flow(user_code).then(function(){
          console.log("flow resolved");
          compeleteMiniRegistrationAndLogin().then(function(){
            $rootScope.hideLoading();
          },
          function(error){
            $ionicPopup.alert({
            title: 'Smthing went wrong ):',
            template: 'En error occured:' +error
            });
          });
     });
  };

 var flow = function(user_code){
  var d = $q.defer();
  console.log("entered flow");
  socket.emit('ConfirmSmsCode',user_code,$stateParams.userPhoneNumber);

    socket.on("SmsCodeConfirmed",function(MyCustomToken){
      //the user input code matchs the DB temp user phone_number sms_code bound,
      //deeping the register to untempuser and generates API tokens:
      socket.removeListener('WrongCode');


        TokensGenerator.ionicIdentifyUser($stateParams.userPhoneNumber,$scope.deviceUUID).then(function(){
          console.log("ionic identify user identified");
            TokensGenerator.ionicPushRegister().then(function(){
              console.log("ionic push registered");

              d.resolve();

            },function(error){
              console.log("ionic push register error:" + error);
              d.reject(error);
            })
        },function(error){
          console.log("ionic idenification error:" + error);
          d.reject(error);
        })


      
      
      socket.removeListener('SmsCodeConfirmed');
      
    });

    socket.on('WrongCode',function(){
      socket.removeListener('WrongCode');
      $rootScope.hideLoading();
      $ionicPopup.alert({
      title: 'Wrong code',
      template: 'The code you entered is wrong, please try again'
      });
      
    });

 return d.promise;
  
 };

 var compeleteMiniRegistrationAndLogin = function(){

  var d = $q.defer();
        TokensGenerator.createPhoneValidatedUser({
        balance: 0,
        phone_number: $stateParams.userPhoneNumber,
        country: Countries.getByDialCode($stateParams.userPhoneNumber.slice(0,$stateParams.userPhoneNumber.indexOf('-'))),
        language:"Hebrew",
        device_uuid:$scope.deviceUUID,        
        ionic_push_token: $scope.ionicPushToken//update commonly
        

        
      }).then(function(uid) {

          TokensGenerator.getFirebaseAuthToken(uid).then(function(firebaseAuthToken){
              User.saveAuthTokenLocally(firebaseAuthToken,$stateParams.userPhoneNumber);
              User.auth($stateParams.userPhoneNumber).then(function(user){
              console.log("all set up, current user validate number:" +user.phone_number);
              var userSocial = user.isFull? "user fully registered":"user only validated phone number";
              console.log(userSocial);
              d.resolve();
              
      })
          },function(error){
          d.reject(error);
          });
       
      });
      return d.promise;

 };

})

.controller("SingUpCtrl", function($scope,$rootScope,$state,$stateParams, $rootScope,Auth,User,$timeout,ionicMaterialInk) {
 
 $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

  $scope.user = null;
  $scope.email=null;
  $scope.password=null;
  $scope.firstName=null;
  $scope.lastName=null;
  // Logs a user in with inputted provider
  $scope.singUp = function() {
    //validation-----------------------------------------
  $rootScope.showLoading();

var new_user ={
  email:$scope.email,
  password: $scope.password,
  user_phone_number:$rootScope.MainUser.user_phone_number,
  user_fist_name:$scope.firstName,
  user_last_name:$scope.lastName
};

  User.createUser(new_user).then(function(userData) {
           console.log("User " + userData.uid + " created successfully!");
           $rootScope.hide();
  
  });

};
    $scope.login = function(provider) {
      $rootScope.showLoading();
      User.socialAuth(provider).then(function(authData) {
      console.log("Logged in as:", authData.uid);
      $rootScope.hideLoading();
    },function(error) {
      console.error("Authentication failed:", error);
      $rootScope.hideLoading();
    });
  };
  $scope.goToProfile = function(){
    $state.go('app.profile');
  }


})

.controller("LoginCtrl", function($scope, $rootScope,User,ionicMaterialInk,$timeout,$ionicHistory,$ionicPopup) {


  $scope.email=null;
  $scope.password=null;
  // Logs a user in with inputted provider
  $scope.login = function(provider) {
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
  // Logs a user out
  $scope.logout = function() {
    User.unauth();
  };

})