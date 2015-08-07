angular.module('register.services',[])
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://mtdemo.firebaseio.com");
    return $firebaseAuth(ref);
  }
])
.factory("User", ["$firebaseObject","$firebaseAuth","$rootScope","$q","$state","facebookService","TokensGenerator","$timeout","UsersService",
  function($firebaseObject,$firebaseAuth,$rootScope,$q,$state,facebookService,TokensGenerator,$timeout,UsersService) {
    var ref = new Firebase("https://mtdemo.firebaseio.com");
    var userRef = new Firebase("https://mtdemo.firebaseio.com/users");
    var users = $firebaseObject(userRef);
    var Auth=$firebaseAuth(ref);
    var currentUserId=null;
    var setCurrentUser =function(uid){
         var d = $q.defer();
         if(uid)
         {
                    if(uid=="no user found"){
                      unauth();
                      console.log("no user found on the db");
                    }
                     console.log("set corrent user! how meny times?");

                  currentUserRef = new Firebase("https://mtdemo.firebaseio.com/users/"+uid);
                  var result = $firebaseObject(currentUserRef);
                  result.$loaded().then(function(){
                    $rootScope.MainUserBinding = result;
                    //$rootScope.MainUserBind={};
                    result.$bindTo($rootScope,"MainUserBind").then(function(){

                    })
                  })
                  
                  //result.$loaded().then(function(data){
                    currentUserRef.on("value",function(data){
                      var currentUser = data.val();
                      if(!$rootScope.MainUser){
                              $rootScope.MainUser = currentUser;                    
                             // $timeout(function() {$rootScope.$broadcast('MainUserSet');}, 50);
                             $rootScope.$broadcast('MainUserSet');
                              d.resolve(data.val());
                        }
                        else{

                          if(!$rootScope.MainUser.isFull&&currentUser.isFull){
                              $rootScope.MainUser = currentUser;
                              $rootScope.$broadcast('MainUserSet');
                          }
                          d.resolve($rootScope.MainUser);
                        }
                  });
          }
          else{
            d.reject();
          }
                  return d.promise;

          
      };
    var getCurrentUser =function(callback){
      if(typeof callback === 'function'){
        if(currentUser)
          callback(currentUser);    
        if($rootScope.MainUser)
          callback($rootScope.User);
        else
            callback();   
          }
          
      };
      var unauth =  function(){
        Auth.$unauth();
        currentUser =null;
        currentUserId=null;
        $rootScope.MainUser=null;
        window.localStorage.removeItem('phoneNumber');
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('isSocial');
        console.log("anauth!!!!");
        $state.go('welcome.home');
      }
      var saveAuthTokenLocally= function(authToken,user_phone_number){
        //if(!window.localStorage.getItem("authToken")||window.localStorage.getItem("authToken")=="user do not exist"){
          window.localStorage.setItem("authToken",authToken);
          window.localStorage.setItem("phoneNumber",user_phone_number);
        //}
      }

    return{
      saveAuthTokenLocally:saveAuthTokenLocally ,
      deleteLocalAuthToken: function(){
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("phoneNumber");
        $rootScope.MainUser=null;
      },
      gotAuthToken:function(){

        return window.localStorage.getItem('authToken')&&window.localStorage.getItem('phoneNumber');
      },
      isAuth: function(){
         return Auth.$getAuth();

      },
      auth: function(){
        var d = $q.defer();

          Auth.$authWithCustomToken(window.localStorage.getItem('authToken')).then(function(authData){
                
                      TokensGenerator.getUidByPhoneNumber(window.localStorage.getItem('phoneNumber')).then(function(uid){
                         setCurrentUser(uid).then(function(user){
                          //reRequireTokens(user);
                          
                          if(!user.isFull)
                          $state.go('app.sing-up');
                          else
                          $state.go('app.profile');
                          //$state.go('test');
                          d.resolve(user);
                        });
                      })




            });
      
        return d.promise;
        
      },
      socialAuth:function(provider){
        var d = $q.defer();
       Auth.$authWithOAuthPopup(provider).then(function(authData) {
        
        
            var sociaData = authData.facebook? authData.facebook:authData.google;
           
          if($rootScope.MainUser)
          {
              if(!$rootScope.MainUser.isFull)
              {
                TokensGenerator.mergeFullUser(window.localStorage.getItem("phoneNumber"),sociaData).then(function(fullUser){
                  setCurrentUser(fullUser.uid);
                  $state.go('app.profile');
                  d.resolve(fullUser);
                });
              }
              else{
                setCurrentUser($rootScope.MainUser.uid);
                $state.go('app.profile');
                d.resolve($rootScope.MainUser);

              } 
          }
          else{//user existed, log in with facebook
             UsersService.getUidByFacebookId(sociaData.id).then(function(uid){
              setCurrentUser(uid);
              TokensGenerator.getFirebaseAuthToken(uid).then(function(token){
                saveAuthTokenLocally(token,$rootScope.MainUser.phone_number);
                $state.go('app.profile');
                d.resolve($rootScope.MainUser.uid);
              })
              
              
             },function(error){
              d.reject(error);
             })
            
          }   
      }).catch(function(error) {
              console.error("Authentication failed:", error);
              d.reject(error);
            });

          return d.promise;
      },
      unauth:unauth,
      debugAuth: function(toState)
      {
        Auth.$authWithCustomToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Ii1KdG9XN2ZVeFFjdVBwSGZJdm9QIn0sImlhdCI6MTQzNjQ3MzkyMX0.oEkOclaBEkonPHzPr8iuD2l1JKGp2Lxz6Hyyvd71sp4")
        .then(function(user){
        	                   $rootScope.MainUser={
                                     country:"Israel",
                                     ionic_push_token:"DEV-329ccea3-5182-4f4a-9681-83a6a9028a12",
                                     phone_number: "+972-0544637999",
                                     propName: "eyJ0eXAiOi",                                   
                                     uid: "-Ju1NhqCQ2NLATxQZ-ER",
                                     isFull:true

                                    };  
          $rootScope.$broadcast('MainUserSet'); 
          if(toState)
             $state.go(toState);
          else                         
          $state.go("app.profile");
        })
      },
      createUser: function(user){
      	var d = $q.defer();
      	Auth.$createUser(user).then(function(userData){
        //http to server merge accounts! no need to reauth yet
      	}).then(function(userData) {
           console.log("User " + userData.uid + " created successfully!");
           regularAuth(user.email,user.password).then(function(authData){
           	d.resolve(authData);
           },function(error){
           	d.reject();
           })
            });
      	return d.promise;
      },

      regularAuth:function(email,password){
      	var d = $q.defer();
      	    Auth.$authWithPassword({
			email:email,
            password:password

		}).then(function(authData){
			d.resolve(authData);
		})
		.catch(function(error){
			d.reject(error);
		});
		return d.promise;
      },


      getCurrentUser: getCurrentUser

    }


  }
])
.factory("TokensGenerator",['$http','$ionicUser','$ionicPush','$q',
	function($http,$ionicUser,$ionicPush,$q){


    return{
            	getTwilioToken:function (user_phone_number){
        			  var d = $q.defer();

        			   $http.get('http://188.226.198.99:3333/twilioTokenGen/'+user_phone_number)
        			             .success(function(twilioToken){
        			                d.resolve(twilioToken);
        			              },function(error){
        			                d.reject(error);
        			              });

                        return d.promise; 
                    },
                getFirebaseAuthToken: function (uid){
        				  var d = $q.defer();

        				   $http.get('http://188.226.198.99:3333/createFirebaseToken/'+uid)
        				             .success(function(firebaseAuthToken){
        				                d.resolve(firebaseAuthToken);
        				              },function(error){
        				                d.reject(error);
        				              });

        				    return d.promise;         

          			},   
                ionicIdentifyUser:function(user_phone_number,uuid) {
        			  var d = $q.defer();

        			    var user = $ionicUser.get();
        			    if(!user.user_id) {
        			      user.user_id = user_phone_number;
        			      user.uuid=uuid;
        			    };

        			    // Identify your user with the Ionic User Service
        			    $ionicUser.identify(user).then(function(){
        			      d.resolve();
        			    },function (error) {
        			      d.reject(error);
        			    });
        			    return d.promise;
                    },  
                ionicPushRegister: function() {
        			    var d =$q.defer();
        			  

        			    $ionicPush.register({
        			      canShowAlert: true, //Can pushes show an alert on your screen?
        			      canSetBadge: true, //Can pushes update app icon badges?
        			      canPlaySound: true, //Can notifications play a sound?
        			      canRunActionsOnWake: true, //Can run actions outside the app,
        			      onNotification: function(notification) {
        			        
        			         console.log(notification);
        			        return true;
        			      }
        			    }).then(function(){
        			      d.resolve();
        			    })

        			    return d.promise;

                 },
                createPhoneValidatedUser:function(user){
        				  var d = $q.defer();
                  $http.post('http://188.226.198.99:3333/CreateUser/',{newUser:user}).then(function(uid){
                    d.resolve(uid.data);
                  },function(error){
                    d.reject(error);
                  })
                  
        				 /* var usersRef= new Firebase("https://mtdemo.firebaseio.com/users");

        				 var userID =  usersRef.push().key();

        				 if(userID){
        				  user.uid=userID;
        				  usersRef.child(userID).set(user,function(error){
                    error? d.reject(error):d.resolve(userID);
                  });
        				  
        				 }
        				 else{
        				  d.reject();
        				 }*/

         				return d.promise;
        		 },
             getUidByPhoneNumber: function(phone_number){
              var d = $q.defer();
                         $http.get('http://188.226.198.99:3333/getUidByPhoneNumber/'+phone_number)
                     .success(function(uid){
                        d.resolve(uid);
                      },function(error){
                        d.reject(error);
                      });
                     return d.promise;
             },
             mergeFullUser: function(phone_number,socialData){
                              var d = $q.defer();
                              var data = {
                                user_phone_number:phone_number,
                                data_to_add:socialData
                              };
                         $http.post('http://188.226.198.99:3333/mergeFullUser/',data)
                     .success(function(fullUser){
                        d.resolve(fullUser);
                      },function(error){
                        d.reject(error);
                      });
                     return d.promise;
             }

        }
        }])

.factory('facebookService',function($rootScope,$q,OpenFB){


      return {
        getUserCoverPhoto: function(id) {
            var deferred = $q.defer();
            OpenFB.get('/v2.3/'+id+"?fields=cover").success(function(data){
              deferred.resolve(data);
            })
            .error(function(data){
              deferred.reject('Error occured');
            });
            return deferred.promise;
        }
    }
})
.factory('OpenFB', function ($rootScope, $q, $window, $http) {

        var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth',

        // By default we store fbtoken in sessionStorage. This can be overriden in init()
            tokenStore = window.sessionStorage,

            fbAppId,
            oauthRedirectURL,

        // Because the OAuth login spans multiple processes, we need to keep the success/error handlers as variables
        // inside the module instead of keeping them local within the login function.
            deferredLogin,

        // Indicates if the app is running inside Cordova
            runningInCordova,

        // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
            loginProcessed;

        document.addEventListener("deviceready", function () {
            runningInCordova = true;
        }, false);

        /**
         * Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
         * use any other function.
         * @param appId - The id of the Facebook app
         * @param redirectURL - The OAuth redirect URL. Optional. If not provided, we use sensible defaults.
         * @param store - The store used to save the Facebook token. Optional. If not provided, we use sessionStorage.
         */
        function init(appId, redirectURL, store) {
            fbAppId = appId;
            if (redirectURL) oauthRedirectURL = redirectURL;
            if (store) tokenStore = store;
        }

        /**
         * Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
         * If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
         * plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
         * @param fbScope - The set of Facebook permissions requested
         */
        function login(fbScope) {

            if (!fbAppId) {
                return error({error: 'Facebook App Id not set.'});
            }

            var loginWindow;

            fbScope = fbScope || '';

            deferredLogin = $q.defer();

            loginProcessed = false;

            logout();

            // Check if an explicit oauthRedirectURL has been provided in init(). If not, infer the appropriate value
            if (!oauthRedirectURL) {
                if (runningInCordova) {
                    oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';
                } else {
                    // Trying to calculate oauthRedirectURL based on the current URL.
                    var index = document.location.href.indexOf('index.html');
                    if (index > 0) {
                        oauthRedirectURL = document.location.href.substring(0, index) + 'oauthcallback.html';
                    } else {
                        return alert("Can't reliably infer the OAuth redirect URI. Please specify it explicitly in openFB.init()");
                    }
                }
            }

            loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + fbAppId + '&redirect_uri=' + oauthRedirectURL +
                '&response_type=token&display=popup&scope=' + fbScope, '_blank', 'location=no');

            // If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
            if (runningInCordova) {
                loginWindow.addEventListener('loadstart', function (event) {
                    var url = event.url;
                    if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                        loginWindow.close();
                        oauthCallback(url);
                    }
                });

                loginWindow.addEventListener('exit', function () {
                    // Handle the situation where the user closes the login window manually before completing the login process
                    deferredLogin.reject({error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled"});
                });
            }
            // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
            // oauthCallback() function. See oauthcallback.html for details.

            return deferredLogin.promise;

        }

        /**
         * Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
         * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
         * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
         * OAuth workflow.
         */
        function oauthCallback(url) {
            // Parse the OAuth data received from Facebook
            var queryString,
                obj;

            loginProcessed = true;
            if (url.indexOf("access_token=") > 0) {
                queryString = url.substr(url.indexOf('#') + 1);
                obj = parseQueryString(queryString);
                tokenStore['fbtoken'] = obj['access_token'];
                deferredLogin.resolve();
            } else if (url.indexOf("error=") > 0) {
                queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
                obj = parseQueryString(queryString);
                deferredLogin.reject(obj);
            } else {
                deferredLogin.reject();
            }
        }

        /**
         * Application-level logout: we simply discard the token.
         */
        function logout() {
            tokenStore['fbtoken'] = undefined;
        }

        /**
         * Helper function to de-authorize the app
         * @param success
         * @param error
         * @returns {*}
         */
        function revokePermissions() {
            return api({method: 'DELETE', path: '/me/permissions'})
                .success(function () {
                    console.log('Permissions revoked');
                });
        }

        /**
         * Lets you make any Facebook Graph API request.
         * @param obj - Request configuration object. Can include:
         *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
         *  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
         *  params:  queryString parameters as a map - Optional
         */
        function api(obj) {

            var method = obj.method || 'GET',
                params = obj.params || {};

            params['access_token'] = tokenStore['fbtoken'];

            return $http({method: method, url: 'https://graph.facebook.com' + obj.path, params: params})
                .error(function(data, status, headers, config) {
                    if (data.error && data.error.type === 'OAuthException') {
                        $rootScope.$emit('OAuthException');
                    }
                });
        }

        /**
         * Helper function for a POST call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
        function post(path, params) {
            return api({method: 'POST', path: path, params: params});
        }

        /**
         * Helper function for a GET call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
        function get(path, params) {
            return api({method: 'GET', path: path, params: params});
        }

        function parseQueryString(queryString) {
            var qs = decodeURIComponent(queryString),
                obj = {},
                params = qs.split('&');
            params.forEach(function (param) {
                var splitter = param.split('=');
                obj[splitter[0]] = splitter[1];
            });
            return obj;
        }

        return {
            init: init,
            login: login,
            logout: logout,
            revokePermissions: revokePermissions,
            api: api,
            post: post,
            get: get,
            oauthCallback: oauthCallback
        }

    })
;