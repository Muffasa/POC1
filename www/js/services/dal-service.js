angular.module("dal.service",[])

 .service("UsersService", ['$rootScope','$q','$firebaseArray','$firebaseObject','$http',
   function($rootScope,$q,$firebaseArray,$firebaseObject,$http) {

    var usersRef = new Firebase("https://mtdemo.firebaseio.com/users");
    
        var getUserById=function (uid){
              var userRef = new Firebase("https://mtdemo.firebaseio.com/users/"+uid);
              return $firebaseObject(userRef);
            }
      
        return {

            getAllAppUsers: function(){  

              return $firebaseArray(usersRef);
            },
            getUserById:getUserById ,
            getUserByPhoneNumber:function(phone_number){
              var d = $q.defer();
                         $http.get('http://188.226.198.99:3000/getUidByPhoneNumber/'+phone_number)
                     .success(function(uid){
                      if(uid=="no user found")
                        d.reject("no user found on db");
                      else
                        d.resolve(getUserById(uid));
                      },function(error){
                        d.reject(error);
                      });
                     return d.promise;
             },
             getUidByPhoneNumber:function(phone_number){
              var d = $q.defer();
                         $http.get('http://188.226.198.99:3000/getUidByPhoneNumber/'+phone_number)
                     .success(function(uid){
                      if(uid=="no user found")
                        d.reject("no user found on db");
                      else
                        d.resolve(uid);
                      },function(error){
                        d.reject(error);
                      });
                     return d.promise;
             },
             getUidByFacebookId:function(facebook_id){

              var d = $q.defer();
                         $http.get('http://188.226.198.99:3000/getUidByFacebookId/'+facebook_id)
                     .success(function(uid){
                      if(uid=="no user found")
                        d.reject("no user found on db");
                      else
                        d.resolve(uid);
                      },function(error){
                        d.reject(error);
                      });
                     return d.promise;

             },
             addProperty:function(propertyName,propertyValue){
                    var data = {
                              uid:$rootScope.MainUser.uid,
                              propName:propertyName,
                              propValue:propertyValue
                            };
                    var d = $q.defer();
                         $http.post('http://188.226.198.99:3000/addProperty/',data)
                           .success(function(){
                            d.resolve()
                            },function(error){
                              d.reject(error);
                            });
                     return d.promise;

             },
             createPhoneValidatedUser:function(user){
                  var d = $q.defer();
                  var usersRef= new Firebase("https://mtdemo.firebaseio.com/users");

                 var userID =  usersRef.push().key();

                 if(userID){
                  user.uid=userID;
                  usersRef.child(userID).set(user,function(error){
                    error? d.reject(error):d.resolve(userID);
                  });
                  
                 }
                 else{
                  d.reject();
                 }

                return d.promise;
             },     
             mergeFullUser: function(phone_number,socialData){
                              var d = $q.defer();
                              var data = {
                                user_phone_number:phone_number,
                                data_to_add:socialData
                              };
                         $http.post('http://188.226.198.99:3000/mergeFullUser/',data)
                     .success(function(fullUser){
                        d.resolve(fullUser);
                      },function(error){
                        d.reject(error);
                      });
                     return d.promise;
             }
        };
    }])

      .service("CampaignsService", ['$q','$firebaseArray','$firebaseObject','$http',
   function($q,$firebaseArray,$firebaseObject,$http) {

    var campaignsRef = new Firebase("https://mtdemo.firebaseio.com/campaigns");
    
        var getCampaignById=function (cid){
              var campaignRef = new Firebase("https://mtdemo.firebaseio.com/campaigns/"+cid);
              return $firebaseObject(campaignRef);
            }
      
        return {

            getAllCampaigns: function(){  

              return $firebaseArray(campaignsRef);
            },
            getCampaignById:getCampaignById ,
            getCampaignByName:function(name){
              var d = $q.defer();

                     return d.promise;
             }
        };
    }])

    .factory("ConversationF", ['$rootScope','$q','$http','$firebaseArray','$firebaseObject','UsersService','$timeout',
    function($rootScope,$q,$http,$firebaseArray,$firebaseObject,UsersService,$timeout){
  

      var usersRef = new Firebase("https://mtdemo.firebaseio.com/users");

        

        var init= function(){

            var d = $q.defer();

            if(!$rootScope.MainUser.convManager){

              createConvManager().then(function(convId){

                    bindSelfConvM().then(function(){
                      d.resolve();
                    },function(error){
                      d.reject(error);
                    })
                    
                },function(error){
                    d.reject(error);
                })
            }
            else{
              resetConveManager().then(function(){

                  bindSelfConvM().then(function(){
                    d.resolve();
                  },function(error){
                    d.reject();
                  })
                
              },function(error){
                d.reject(error);
              });
              
            }
            

            return d.promise;


        }
        var createConvManager = function(){
            var d = $q.defer();
            
            var convM = {
                status:'idle',//idle connecting canceld ongoing ended
                peerCaller:"",
                currentCampaign:""
              }
                     usersRef.child($rootScope.MainUser.uid).child("convManager").set(convM,function(error){
                     error? d.reject(error):d.resolve();
              })
            return d.promise;


        }
        var resetConveManager = function(){
          var d = $q.defer();
          $rootScope.callType="";
             var resetCM = {
                status:'idle',
                peerCaller:"",
                currentCampaign:""
              }
              var convMRef = new Firebase("https://mtdemo.firebaseio.com/users/"+$rootScope.MainUser.uid+"/convManager");
              convMRef.set(resetCM,function(error){
                error? d.reject(error):d.resolve();
              });
              return d.promise;
          };

        var bindSelfConvM = function (){
          var d = $q.defer();
              var convMRef = new Firebase("https://mtdemo.firebaseio.com/users/"+$rootScope.MainUser.uid+"/convManager");
              $rootScope.binds.convManager=$firebaseArray(convMRef);
              $rootScope.binds.convManager.$loaded(function(){
                $rootScope.$broadcast("convManagerSet");
                d.resolve();
              },function(error){
                d.reject(error);
              })
              
              return d.promise;
            };
       var bindPeerConvM=function (peer_phone_number){
              UsersService.getUidByPhoneNumber(peer_phone_number).then(function(peer_uid){
                var peerConvMRef = new Firebase("https://mtdemo.firebaseio.com/users/"+peer_uid+"/convManager");
                var peerRef = new Firebase("https://mtdemo.firebaseio.com/users/"+peer_uid);
                $rootScope.binds.peerConvManager=$firebaseArray(peerConvMRef);
                $rootScope.peerUser = $firebaseObject(peerRef);
                $rootScope.peerUser.$loaded().then(function(){
                      if($rootScope.peerUser.convManager.status=="idle"){
                          $rootScope.binds.peerConvManager.$ref().child('peerCaller').set($rootScope.MainUser,function(error){
                          console.log(error);
                          });
                          $rootScope.binds.peerConvManager.$ref().child('status').set("connecting",function(error){
                            console.log(error);
                          });
                          $rootScope.binds.peerConvManager.$loaded(function(data){

                          })
                          $rootScope.peerUser.$loaded(function(data){
                            $rootScope.$broadcast('outgoingCall',peer_uid);
                          })
                      }
                      else{
                        alert("line is busy");
                      }

                })
                
                
                
              })

              }  
        var getStatus=function(){
           if($rootScope.callType=="incoming")
              return $rootScope.MainUserBinding.convManager.status;
           if($rootScope.callType=="outgoing")
              return $rootScope.peerUser.convManager.status;
        }      

        var endConnection=function(){
          if($rootScope.callType=="incoming")
          {
            if(getStatus()!="idle"&&getStatus!="ended"){
            $rootScope.binds.convManager.$ref().child("status").set("ended");
            //Log call and init conv Manager
            resetConveManager();
            $rootScope.$broadcast('connection-ended');
            console.log("connection-ended fired");
            }
           }
           else{
            if($rootScope.binds.peerConvManager)
                {
                $rootScope.binds.peerConvManager.$destroy(); 
                $rootScope.$broadcast('connection-ended');
               console.log("connection-ended fired");  
               }        
           }
          console.log("connection-ended not fired");
          //if($rootScope.callType=="outgoing")
           // if(getStatus()!="idle"&&getStatus!="ended")
             // $rootScope.binds.PeerConvManager.$ref().child("status").set("ended"); 

          }

        return { 

          init:init,
          connect:bindPeerConvM,
          answer:function(){
            if(getStatus()=="connecting")
            $rootScope.binds.convManager.$ref().child("status").set("ongoing");
          },
          reject:function(){
            if(getStatus()=="connecting")
            {
              $rootScope.binds.convManager.$ref().child("status").set("rejected");
              setTimeout(function() {endConnection();}, 100);
            }
          },
          abort:function(){
            if(getStatus()=="connecting")
            {
              $rootScope.binds.peerConvManager.$ref().child("status").set("canceled");
              setTimeout(function() {endConnection();}, 100);
            }
          },
          endConnection:endConnection,
          reset:resetConveManager,
          getStatus:getStatus

        };


}])