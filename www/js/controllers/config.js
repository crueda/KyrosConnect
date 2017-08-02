// Return 1 if a > b
// Return -1 if a < b
// Return 0 if a == b
function compare(a, b) {
    if (a === b) {
       return 0;
    }

    var a_components = a.split(".");
    var b_components = b.split(".");

    var len = Math.min(a_components.length, b_components.length);

    // loop while the components are equal
    for (var i = 0; i < len; i++) {
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
            return 1;
        }

        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
            return -1;
        }
    }

    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) {
        return 1;
    }

    if (a_components.length < b_components.length) {
        return -1;
    }

    // Otherwise they are the same.
    return 0;
}

angular.module('main.config', [])
.controller('ConfigCtrl', function($scope, $state, $http, $state, URL, APP, $translate, $ionicPopup) {

    $translate(['MESSAGE', 'APP_IN_LAST_VERSION']).then(function (translations) {
      msg_message = translations.MESSAGE;
      msg_app_in_last_version = translations.APP_IN_LAST_VERSION;
    });



  $scope.updateApp = function() {
    if (compare(APP.version, localStorage.getItem("lastAppVersion"))==-1) {
      $scope.lastVersion = false; 
      window.open(localStorage.getItem("lastAppUrl"), '_system'); 
    } else {
      var alertPopup = $ionicPopup.alert({
            title: msg_message,
            template: msg_app_in_last_version
        });   
    }
  }

  $scope.version = APP.version 
  $scope.version_date = APP.version_date   
  $scope.itemsNotifications = ["10", "25", "50", "75", "100"];
  $scope.dataNotifications = {};
  $scope.dataNotifications.index = 0;

  if (localStorage.getItem("language")=='en') {
    $scope.itemsLanguage = ["Spanish", "English"];
  }
  else {
    $scope.itemsLanguage = ["Español", "Inglés"];
  }
  $scope.dataLanguage = {};
  $scope.dataLanguage.index = 0;

  // comprobar si es la ultima version
  if (compare(APP.version, localStorage.getItem("lastAppVersion"))==-1) {
    $scope.lastVersion = false; 
  } else {
    $scope.lastVersion = true;     
  }

  if (localStorage.getItem("username")=="") {
    $state.go('login');
  } else {

    var url = APP.api_base + URL.getConfigUser + "/" + localStorage.getItem("username");
    $http({
      method: 'GET',
      url: url,
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){ 
    	if (data!=undefined) {
        if (data.push_enabled==1) {
          $scope.settings = {
            enableNotifications: true,
          };          
        }
    	   else {
    		   $scope.settings = {
    			   enableNotifications: false,
  			   };
    	   }

         if (data.max_show_notifications!=undefined) {
            if (data.max_show_notifications==10) {
              $scope.dataNotifications.index = 0;
            } 
            else if (data.max_show_notifications==25) {
              $scope.dataNotifications.index = 1;
            } 
            else if (data.max_show_notifications==50) {
              $scope.dataNotifications.index = 2;
            } 
            else if (data.max_show_notifications==75) {
              $scope.dataNotifications.index = 3;
            } 
            else if (data.max_show_notifications==100) {
              $scope.dataNotifications.index = 4;
            } 
         }
       }
      })
      .error(function(data, status, headers,config){
      });
 }

$scope.switchLanguage = function() {
  if ($scope.dataLanguage.index==0) {
    localStorage.setItem("language", 'es');
    $translate.use('es');
  }
  else {
    localStorage.setItem("language", 'en');
    $translate.use('en');
  }
};

  $scope.configChangeNumNotifications = function() {
    var optionSelected = 10;
    if ($scope.dataNotifications.index==0) {
      optionSelected = 10;
    } else if ($scope.dataNotifications.index==1) {
      optionSelected = 25;
    } else if ($scope.dataNotifications.index==2) {
      optionSelected = 50;
    } else if ($scope.dataNotifications.index==3) {
      optionSelected = 75;
    } else if ($scope.dataNotifications.index==4) {
      optionSelected = 100;
    } 

    localStorage.setItem("max_show_notifications", optionSelected);
    
    var url;
    var push_mode = 0;
    var group_mode = 0;
    if ($scope.settings.enableNotifications) {
      push_mode = 1;
    } 
    if ($scope.settings.enableGroupNotifications) {
      group_mode = 1;
      localStorage.setItem("group_notifications", 1);
    } else {
      localStorage.setItem("group_notifications", 0);
    } 
    url = APP.api_base + URL.configUserPreferences + "/" + localStorage.getItem("username");// + "?push_mode=" + push_mode + "&group_mode=" + group_mode + "&max_show_notifications=" + optionSelected;    
    $http({
      method: 'POST',
      url: url,
      data: {push_mode: push_mode, group_mode: group_mode, max_show_notifications: optionSelected},
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){            
    })
    .error(function(data, status, headers,config){
    });
 }

 $scope.configChange = function() {
    var url;
    var push_mode = 0;
    var group_mode = 0;
    if ($scope.settings.enableNotifications) {
    	push_mode = 1;
    } 
    if ($scope.settings.enableGroupNotifications) {
    	group_mode = 1;
    	localStorage.setItem("group_notifications", 1);
    } else {
    	localStorage.setItem("group_notifications", 0);
    } 
    url = APP.api_base + URL.configUserPreferences + "/" + localStorage.getItem("username");// + "?push_mode=" + push_mode + "&group_mode=" + group_mode;    
    $http({
      method: 'POST',
      url: url,
      data: {push_mode: push_mode, group_mode: group_mode},
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
     .success(function(data, status, headers,config){            
      })
      .error(function(data, status, headers,config){
      });
   };

  $scope.logout = function() {
    localStorage.setItem("username", "");
    localStorage.setItem("token_api", "");
    $scope.data = {};
    $state.go('login');
  };

})