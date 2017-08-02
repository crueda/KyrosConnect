var devices = [{"vehicle_license": "a"},{"vehicle_license": "b"},{"vehicle_license": "c"}] 
devices = devices.sort(function(a, b) {

  var deviceA = a.vehicle_license.toLowerCase();
  var deviceB = b.vehicle_license.toLowerCase();

  if(deviceA > deviceB) return 1;
  if(deviceA < deviceB) return -1;
  return 0;
});


function getEventDescription(eventType) {
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].description;      
    }
    return "";
  }

angular.module('main.device', ['ionic'])

.controller('DevicesCtrl', function($scope, $state, $http, DevicesDataService, $ionicLoading, $timeout, URL, APP) {

  $scope.selectDevice = function(device) {
    localStorage.setItem("vehicleSelected", device.vehicle_license); 
    localStorage.setItem("deviceSelected", device.device_id);
    $state.go('tab.device-detail');
  }

  if (localStorage.getItem("username")=="") {
    $state.go('login');
  } else {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    var url = APP.api_base + URL.listDevices + "/" + localStorage.getItem("username");
    $http({
      method: 'GET',
      url: url,
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){   
      devices = data;
      $scope.data = { "devices" : devices, "search" : '' };
      $scope.search = function() {
      DevicesDataService.searchDevices($scope.data.search).then(
        function(matches) {
          $scope.data.devices = matches;
        }
      )}

      $ionicLoading.hide();         
    })
    .error(function(data, status, headers,config){
        $ionicLoading.hide();
          $ionicLoading.show({
            template: 'Error de red',
            scope: $scope
          });
        $timeout(function() {
             $ionicLoading.hide();
             //$state.go('login');
          }, 1500);
    })
  }

})


.controller('DeviceDetailCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, $timeout, URL, APP, MAP_MODE) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });    
    var url = APP.api_base + URL.getConfigNotifications + "/" + localStorage.getItem("username");
    $http({
      method: 'POST',
      url: url,
      data: {deviceId: localStorage.getItem("deviceSelected")},
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){   
        if (data!=undefined) {

          var notificationsConfig = [];
          for (var i=0; i<data.length; i++) {
            var notificationConfig = {};
            if (data[i].enabled==1) {
              notificationConfig = {
                id: data[i]._id,
                enabled: true,
                name: getEventDescription(data[i].event_type),
                eventType: data[i].event_type
              }
            } else {
              notificationConfig = {
                id: data[i]._id,
                enabled: false,
                name: getEventDescription(data[i].event_type),
                eventType: data[i].event_type
              }
            }
            notificationsConfig.push(notificationConfig);
          }
          $scope.notificationsConfig = notificationsConfig;
          if (notificationsConfig.length>0) {
            $scope.showNotifications = true;
          } else {
            $scope.showNotifications = false;
          }
        }   
        $ionicLoading.hide();        
      })
      .error(function(data, status, headers,config){
        $ionicLoading.hide();
            $ionicLoading.show({
              template: 'Error de red',
              scope: $scope
            });
            $timeout(function() {
               $ionicLoading.hide();
               //$state.go('login');
            }, 1500);
      });


   var mapmode = MAP_MODE.device;
   $scope.titulo_device = localStorage.getItem("vehicleSelected");

   $scope.configNotificationChange = function(id, eventType) {
    for (var i=0; i<$scope.notificationsConfig.length; i++) {
      var config = $scope.notificationsConfig[i];
      if (config.eventType == eventType) {

        var enableConfig = 0;
        if (config.enabled)
          enableConfig = 1;
        
        var url = APP.api_base + URL.configEventChange;
        $http({
          method: 'POST',
          url: url,
          data: {username: localStorage.getItem("username"), deviceId: localStorage.getItem("deviceSelected"), eventType: event_type, enabled: enableConfig},
          headers: {
            'x-access': localStorage.getItem("token_api")
          }})
        .success(function(data, status, headers,config){            
        })
        .error(function(data, status, headers,config){
        });

      }
    }

   }

   $scope.showGraphsDevice = function() {
      localStorage.setItem("mapmode", mapmode); 
      $state.go('tab.graphs'); 
      
   }

   $scope.showMapDevice = function() {
    var url = APP.api_base + URL.tracking1device + "/" + localStorage.getItem("deviceSelected");
    $http({
      method: 'GET',
      url: url,
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){  
      if (data[0]!=undefined) {
        localStorage.setItem("deviceSelectedVehicleLicense", data[0].vehicle_license);  
        localStorage.setItem("deviceSelectedLatitude", data[0].location.coordinates[1]);  
        localStorage.setItem("deviceSelectedLongitude", data[0].location.coordinates[0]);  
        localStorage.setItem("deviceSelectedIcon", data[0].icon);  
        localStorage.setItem("deviceSelectedAlias", data[0].alias);    
        localStorage.setItem("mapmode", mapmode); 
        $state.go('tab.map');         
      } else {
        localStorage.setItem("deviceSelectedLatitude", 0);  
        localStorage.setItem("mapmode", mapmode); 
        $state.go('tab.map');               
      }
    })
    .error(function(data, status, headers,config){
    });      
  }    

  $scope.setAsDefault = function() {
    var selectedVehicle = localStorage.getItem("deviceSelected");
    var url = APP.api_base + URL.setDefaultVehicle;
    $http({
      method: 'POST',
      url: url,
      data: {username: localStorage.getItem("username"), deviceId: localStorage.getItem("deviceSelected")},
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){  
      if (data[0]!=undefined) {
        //localStorage.setItem("defaultVehicleLicense", selectedVehicle);  
        localStorage.setItem("vehicleLicense", selectedVehicle);  
        var urlTracking = APP.api_base + URL.tracking1device + "/" + localStorage.getItem("deviceSelected");
        $http.get(urlTracking).success(function(data, status, headers,config){  
          if (data[0]!=undefined) {
            localStorage.setItem("deviceSelectedLatitude", data[0].location.coordinates[1]);  
            localStorage.setItem("deviceSelectedLongitude", data[0].location.coordinates[0]);  
            localStorage.setItem("deviceSelectedIcon", data[0].icon);  
            localStorage.setItem("deviceSelectedAlias", data[0].alias);   
            localStorage.setItem("mapmode", mapmode);   
            $state.go('tab.map');         
          } else {
            localStorage.setItem("deviceSelectedLatitude", 0); 
            localStorage.setItem("mapmode", mapmode);  
            $state.go('tab.map');               
          }
        })
        .error(function(data, status, headers,config){
        });   

      } 
    })
    .error(function(data, status, headers,config){
    });      
  }   


})