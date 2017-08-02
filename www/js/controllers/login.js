function saveToken ($http, URL, APP) {
  var url = APP.api_base + URL.saveToken; // + "?username="+ localStorage.getItem("username") + "&token="+ localStorage.getItem("token");
    $http({
    method: 'POST',
    url: url,
    data: {username: localStorage.getItem("username"), token: localStorage.getItem("token")},
    headers: {
        'x-access': localStorage.getItem("token_api")
    }}).success(function(data, status, headers,config){ 
      })
      .error(function(data, status, headers,config){
      });
}

function saveDeviceInfo ($http, URL, APP) {
  var url = APP.api_base + URL.saveDeviceInfo + "/" + localStorage.getItem("username"); 
    $http({
    method: 'POST',
    url: url,
    data: {
      token: localStorage.getItem("token"), 
      device_model: localStorage.getItem("device_model"), 
      device_platform: localStorage.getItem("device_platform"), 
      device_version: localStorage.getItem("device_version"), 
      device_manufacturer: localStorage.getItem("device_manufacturer"), 
      device_serial: localStorage.getItem("device_serial"), 
      device_uuid: localStorage.getItem("device_uuid"), 
      device_height: localStorage.getItem("device_height"), 
      device_width: localStorage.getItem("device_width"), 
      device_language: localStorage.getItem("device_language"),
      app_version: APP.version,
      app_type: APP.type
    },
    headers: {
        'x-access': localStorage.getItem("token_api")
    }}).success(function(data, status, headers,config){ 
      })
      .error(function(data, status, headers,config){
      });
}

angular.module('main.login', [])
.controller('LoginCtrl', function($scope, $rootScope, $http, LoginService, $ionicLoading, $timeout, $ionicPopup, $state, $translate, URL, MAP_MODE, APP) {

  $translate(['LOGIN_INCORRECT_TITLE', 'LOGIN_INCORRECT_MSG', 'NETWORK_ERROR', 'LOGIN_USER_BLOCKED', 'WARNING', 'TOKEN_EMPTY']).then(function (translations) {
      msg_login_incorrect_title = translations.LOGIN_INCORRECT_TITLE;
      msg_login_incorrect_msg = translations.LOGIN_INCORRECT_MSG;
      msg_login_user_blocked = translations.LOGIN_USER_BLOCKED;
      msg_network_error = translations.NETWORK_ERROR;
      msg_warning = translations.WARNING;
      msg_token_empty = translations.TOKEN_EMPTY;
    });

  $scope.clean = function() {
      $scope.data = {}; 
       $scope.settings = {
        remember: false
      };  
  }

  $scope.version = function() {
    //navigator.notification.alert("Versión : " + APP.version, null, "Kyros App", "Ok");
    var alertPopup = $ionicPopup.alert({
      //title: 'MyGps App',
      title: 'Kyros MyPush App',
      template: 'Versión: ' + APP.version
    });
  }

    if (localStorage.getItem("check_remember")=="true") {
      $scope.data = {username: localStorage.getItem("login_username"), password: localStorage.getItem("login_password")};
    } else {
      $scope.data = {};      
    }
    $scope.data = {username: 'crueda', password: 'dat1234'};

    if (localStorage.getItem("check_remember")=="true") {
      $scope.settings = {
        remember: true
      };          
    } else {
      $scope.settings = {
        remember: false
      };                
    }

    //$scope.check_remember = localStorage.getItem("check_remember");
    $scope.remember = function() {      
      console.log ($scope.settings.remember);
      if ($scope.settings.remember){
        localStorage.setItem("check_remember", "true");         
      } else {
        localStorage.setItem("check_remember", "false");         
      }
    }

    $scope.login = function() {      
      // Mostrar loading
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      // peticion de login
      var url = APP.api_base + URL.login;
      console.log(url);
        $http({
           method: 'POST',
           url: url,
           data: {username: $scope.data.username, password: $scope.data.password, app_type: APP.type}
         })
          .success(function(data, status, headers,config){     
            $ionicLoading.hide();        
            if (data.status=="msg") {
              var alertPopup = $ionicPopup.alert({
                  title: data.title,
                  template: data.message
              });
            }
            else if (data.status=="ok") {
              if (data.result[0].device_id!=undefined) {
                localStorage.setItem("deviceId", data.result[0].device_id);                  
                localStorage.setItem("vehicleLicense", data.result[0].vehicle_license);                  
                localStorage.setItem("lastAppVersion", data.result[0].last_app_version);                  
                localStorage.setItem("lastAppUrl", data.result[0].last_app_url);              
              } else {
                localStorage.setItem("vehicleLicense", "");                  
                localStorage.setItem("deviceId", 0);                  
              }
              
              // cargar los iconos
              //var icons = JSON.parse(localStorage.getItem("eventIconStorage"));
              //$rootScope.eventIcon = icons;

              localStorage.setItem("username", $scope.data.username);
              localStorage.setItem("token_api", data.result[0].token_api);  
              localStorage.setItem("notificationSelected", "");  
              localStorage.setItem("deviceSelected", "");  
              localStorage.setItem("mapmode", MAP_MODE.init);  
              localStorage.setItem("group_notifications", "1");
              localStorage.setItem("max_show_notifications", "100");
              if (data.result[0].max_show_notifications!=undefined) {
                localStorage.setItem("max_show_notifications", data.result[0].max_show_notifications);
              }  

              if (data.result[0].group_notifications!=undefined) {
                localStorage.setItem("group_notifications", data.result[0].group_notifications);
              }  


              saveDeviceInfo($http, URL, APP);
              localStorage.setItem("login_completed", 1);
             



              if (localStorage.getItem("check_remember")=="true") {
                localStorage.setItem("login_username", $scope.data.username); 
                localStorage.setItem("login_password", $scope.data.password); 
              }

              // ir a pestaña de notificaciones
              $state.go('tab.notifications',  {cache: false, mode: localStorage.getItem("group_notifications")});      


            } else if (data.status=="blk") {
              var alertPopup = $ionicPopup.alert({
                title: msg_login_incorrect_title,
                template: msg_login_user_blocked
              });
            } else {
              var alertPopup = $ionicPopup.alert({
                title: msg_login_incorrect_title,
                template: msg_login_incorrect_msg
              });
            }
          })
          .error(function(data, status, headers,config){
            $ionicLoading.hide();
            $ionicLoading.show({
              template: msg_network_error,
              scope: $scope
            });
            $timeout(function() {
               $ionicLoading.hide();
               $state.go('login');
            }, 1500);
          });

    }
});