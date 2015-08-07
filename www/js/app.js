// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('MTPOC', ['ionic','ionic-material','ngCordova','ngAudio','ionic.service.push','ionic.service.core','firebase','btford.socket-io','MTPOC.controllers','MTPOC.services','timer'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();

    }
  });

})

.config(['$ionicAppProvider', function($ionicAppProvider) {
  
  $ionicAppProvider.identify({
    
    app_id: 'fe0f0dc6',
    
    api_key: '98f3518c158248bbd24d46e26edb29c8ea344c7468530882',

    gcm_id:'558835618221',

    dev_push: true
  });
}])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(10);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider

    .state('welcome', {
        url: '/welcome',
        abstract: true,
        templateUrl: 'templates/welcome.html',
        controller: 'BaseWelcomeCtrl'
    })
   .state('welcome.home', {
        url: '/home',
        views: {
            'partialContent': {
                templateUrl: 'templates/welcome-templates/home.html',
                controller: 'WelcomeCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
   .state('welcome.post-sms', {
        url: '/post-sms/:userPhoneNumber',
        views: {
            'partialContent': {
                templateUrl: 'templates/welcome-templates/post-sms.html',
                controller: 'WelcomePostCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
       .state('welcome.login', {
        url: '/login',
        views: {
            'partialContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

   .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })


    .state('app.sing-up', {
        url: '/sing-up',
        views: {
            'menuContent': {
                templateUrl: 'templates/sing-up.html',
                controller: 'SingUpCtrl'
            },
            'fabContent': ''
            }
        
    })
    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.allUsers', {
        url: '/allUsers',
        views: {
            'menuContent': {
                templateUrl: 'templates/allUsers.html',
                controller: 'AllUsersCtrl'
            },
            'fabContent': {
                template: '<button id="fab-allUsers" class="button button-fab button-fab-top-left expanded button-balanced-900 spin"><i class="icon ion-ios-personadd"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-allUsers').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })
        .state('app.allCampaigns', {
        url: '/allCampaigns',
        views: {
            'menuContent': {
                templateUrl: 'templates/allCampaigns.html',
                controller: 'AllCampaignsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-allCampaigns" class="button button-fab button-fab-top-left expanded button-balanced-900 spin"><i class="icon ion-plus-circled"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-allCampaigns').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-bottom-right expanded button-royal drop"><i class="icon ion-plus-round"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })



    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent':''
            /*,
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);
                }
            }*/
        }

    })

    .state('app.dialpad', {
    url: '/dialpad',
    views: {
      'menuContent': {
        templateUrl: 'templates/dialpad.html',
        controller: 'DialpadCtrl'
      },
      'fabContent': ''
    }
  })
   .state('app.live-connection', {
    url: '/live-connection/:connectionState',
    views: {
      'menuContent': {
        templateUrl: 'templates/live-connection.html',
        controller: 'LiveConnectionCtrl'
      },
      'fabContent': ''
    },
    cantNavigate:true
  })

   .state('loading', {
    url: '/loading',
    views: {
      'menuContent': {
        templateUrl: 'templates/loading.html'
      },
      'fabContent': ''
    }
  })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/loading');
});