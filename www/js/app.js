function saveToken ($http, URL) {
    $http({
           method: 'POST',
           url: url,
           data: {username: localStorage.getItem("username"), token: localStorage.getItem("token")}
         }).success(function(data, status, headers,config){            
      })
      .error(function(data, status, headers,config){
      });
}

angular.module('main', ['ionic', 'main.intro', 'main.controllers', 'main.graphs', 'main.login', 'main.notification', 'main.device', 'main.map', 'main.config', 'main.services', 'ngCordova', 'ionic.ion.autoListDivider', 'pascalprecht.translate', 'chart.js'])

.run(function($rootScope, $ionicPlatform, $http, $ionicPopup, $cordovaTouchID, $cordovaPushV5, $state, URL, APP) {
  $ionicPlatform.ready(function() {

    //screen.lockOrientation('portrait');
    console.log('Orientation is ' + screen.orientation);

    localStorage.setItem("login_completed", 0);

    var push = PushNotification.init({
        "android": {
            "senderID": "972815935814"
        },
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        "ios": {
            "alert": "true",
            "badge": "true",
            "sound": "true"
        },
        "windows": {}
    });

    push.on('registration', function(data) {
      /*
         var alertPopup = $ionicPopup.alert({
            title: '*token*',
            template: 'token:' +data.registrationId + ' ---login_completed: ' + localStorage.getItem("login_completed") + ' *---username:' + localStorage.getItem("username")
         });
      */  
      localStorage.setItem("token", data.registrationId); 
      if (localStorage.getItem("login_completed") == 1) {
        saveToken($http, URL);     

      } 
    }); // on_registration


    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    var isWebView = ionic.Platform.isWebView();
    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var isWindowsPhone = ionic.Platform.isWindowsPhone();

    try {
      localStorage.setItem("device_model", device.model);
      localStorage.setItem("device_platform", device.platform);
      localStorage.setItem("device_version", device.version);
      localStorage.setItem("device_manufacturer", device.manufacturer);
      localStorage.setItem("device_serial", device.serial);
      localStorage.setItem("device_uuid", device.uuid);      
    } catch (error) {}

    localStorage.setItem("device_height", window.innerHeight);
    localStorage.setItem("device_width", window.innerWidth);

    try {   
    navigator.globalization.getPreferredLanguage(
        function (language) {
          localStorage.setItem("device_language", language.value);
        },
        function () {localStorage.setItem("device_language", "unknow")}
    );
    } catch (error) {}

    // inicializar valores de storage
    localStorage.setItem("token", "");      
    localStorage.setItem("token_api", "");      
    localStorage.setItem("username", "");
    localStorage.setItem("notificationSelected", "");  
    localStorage.setItem("notificationPushMongoId", "");
    localStorage.setItem("notificationPushLongitude", "");      
    localStorage.setItem("notificationPushLatitude", "");      
    localStorage.setItem("notificationSelectedDeviceId", "");      
    localStorage.setItem("notificationPushEventType", "");      
    localStorage.setItem("notificationPushTimestamp", "");      
    localStorage.setItem("notificationSelectedVehicleLicense", "");
    localStorage.setItem("mapmode", 0);      
    localStorage.setItem("deviceId", "");                
    localStorage.setItem("vehicleLicense", "");               
    localStorage.setItem("deviceSelected", "");  
    localStorage.setItem("group_notifications", "1");
    localStorage.setItem("max_show_notifications", "100");
    


    push.on('notification', function(data) {
      // Comprobar el tipo de push recibido
      // 1-> nueva notificacion
      // 2-> nueva version de la app disponible
      if (data.additionalData.tag==1) {

        try {
          localStorage.setItem("notificationPushMongoId", data.additionalData._id);
          localStorage.setItem("username", data.additionalData.username);      
          localStorage.setItem("notificationPushLongitude", data.additionalData.coordinates[0]);
          localStorage.setItem("notificationPushLatitude", data.additionalData.coordinates[1]);
          localStorage.setItem("notificationSelectedDeviceId", data.additionalData.device_id);
          localStorage.setItem("notificationPushEventType", data.additionalData.event_type);
          localStorage.setItem("notificationPushTimestamp", data.additionalData.timestamp);
          localStorage.setItem("notificationPushTimezone", data.additionalData.time_zone);
          localStorage.setItem("notificationSelectedVehicleLicense", data.additionalData.vehicle_license);
        } catch (e) {}

        localStorage.setItem("mapmode", 3);

        $state.go('tab.map');
      } else if (data.additionalData.tag==2) {
          window.open(data.additionalData.url, '_system'); 
      }
    }); // on_notification

    push.on('error', function(e) {
      // e.message    
    }); // on_error

    }); // ready
})


.config(function($stateProvider, $ionicConfigProvider, $urlRouterProvider, $translateProvider, ChartJsProvider) {

ChartJsProvider.setOptions({ chartColors : [ '#00ADF9', '#b30000', '#FDB45C', '#46BFBD', '#ff3399', '#949FB1', '#4D5360'] });


var language = localStorage.getItem("language");
if (language==undefined) {
  if (localStorage.getItem("device_language")!=undefined) {
    var device_lang = localStorage.getItem("device_language");
    language = device_lang.substring(0, 2);
  } else {
    language = 'es';    
  }
}

$translateProvider
      .useStaticFilesLoader({
        prefix: 'locales/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en', 'es'], {
        'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
        'es' : 'es', 'es_SP': 'es', 'es_ES': 'es'
      })
      .preferredLanguage(language)
      .fallbackLanguage(language)
      .determinePreferredLanguage()
      .useSanitizeValueStrategy('escapeParameters');

  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider

  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('login', {
      url: '/login',
      cache: false,
      templateUrl: 'templates/login/login.html',
      controller: 'LoginCtrl'
  })

  .state('tab.map', {
    url: '/map',
    cache: false,
    views: {
      'tab-map': {
        templateUrl: 'templates/map/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.graphs', {
    url: '/graphs',
    cache: false,
    views: {
      'tab-graphs': {
        templateUrl: 'templates/graph/tab-graphs.html',
        controller: 'GraphCtrl'
      }
    }
  })

  .state('tab.devices', {
    url: '/devices',
    cache: false,
    views: {
      'tab-devices': {
        templateUrl: 'templates/device/tab-devices.html',
        controller: 'DevicesCtrl'
      }
    }
  })

  .state('tab.device-detail', {
    url: '/device-detail',
    cache: true,
    views: {
      'tab-devices': {
        templateUrl: 'templates/device/device-detail.html',
        controller: 'DeviceDetailCtrl'
      }
    }
  })

  .state('tab.notifications', {
      url: '/notifications/:mode/',
      cache: false,
      views: {
        'tab-notifications': {
          templateUrl: function ($stateParams){
                /*
                if (localStorage.getItem("group_notifications") == 0) {
                    return 'templates/notification/tab-notifications.html'
                }
                else {
                    return 'templates/notification/tab-notifications-group.html'
                }*/
                return 'templates/notification/tab-notifications.html'
            },
          controller: 'NotificationsCtrl'
        }
      }
    })
  
    .state('tab.notification-detail', {
      url: '/notifications/:notificationId',
      cache: true,
      views: {
        'tab-notifications': {
          templateUrl: 'templates/notification/notification-detail.html',
          controller: 'NotificationDetailCtrl',
          params: {
            mongoId: 7
          }
        }
      }
    })

  .state('tab.config', {
    url: '/config',
    cache: true,
    views: {
      'tab-config': {
        templateUrl: 'templates/config/tab-config.html',
        controller: 'ConfigCtrl'
      }
    }
  })


  .state('tab.test', {
    url: '/test',
    cache: false,
    views: {
      'tab-test': {
        templateUrl: 'templates/others/test.html',
        controller: 'TestCtrl'
      }
    }
  });


  if (localStorage.getItem("intro_status")==1) {
      $urlRouterProvider.otherwise('login');
    } else {

      //$urlRouterProvider.otherwise('login');
      $urlRouterProvider.otherwise('intro');
    }

});



