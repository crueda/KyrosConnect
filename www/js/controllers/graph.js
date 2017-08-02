
function getEventDescription(eventType) {
    //var evento = EVENT_ENUM.getByValue('value', eventType);
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].description;      
    }
    return "";
  }

function getGraphVehicleLicense(MAP_MODE) {
  var vehicleLicense = "";
  if (localStorage.getItem("mapmode") == MAP_MODE.push) { 
    vehicleLicense = localStorage.getItem("notificationSelectedVehicleLicense");
  } 
  else if (localStorage.getItem("mapmode") == MAP_MODE.notification) { 
    vehicleLicense = localStorage.getItem("notificationSelectedVehicleLicense");
  } 
  else if (localStorage.getItem("mapmode") == MAP_MODE.device) { 
    vehicleLicense = localStorage.getItem("vehicleSelected");
  }  
  else { 
    vehicleLicense = localStorage.getItem("vehicleLicense");
  } 
  return vehicleLicense;
}


function getGraphDeviceId(MAP_MODE) {
  var deviceId = 0;
  if (localStorage.getItem("mapmode") == MAP_MODE.push) { 
    deviceId = localStorage.getItem("notificationSelectedDeviceId");
  } 
  else if (localStorage.getItem("mapmode") == MAP_MODE.notification) { 
    deviceId = localStorage.getItem("notificationSelectedDeviceId");
  } 
  else if (localStorage.getItem("mapmode") == MAP_MODE.device) { 
    deviceId = localStorage.getItem("deviceSelected");
  }  
  else { 
    deviceId = localStorage.getItem("deviceId");
  } 
  return deviceId;
}

function getEventDescription(eventType) {
    //var evento = EVENT_ENUM.getByValue('value', eventType);
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].description;      
    }
    return "";
  }

angular.module('main.graphs', [])
.controller('GraphCtrl', function($scope, $rootScope, $compile, $timeout, $http, $state, $ionicPopup, $ionicLoading, $cordovaGeolocation, APP, URL, MAP_MODE, $translate) {


    $translate(['MSG_CONFIRM_TITLE', 'MSG_CONFIRM_COUNTERS', 'NO_EVENTS', 'NOTIFICATIONS', 'TRACKINGS', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).then(function (translations) {
      msg_confirm_title = translations.MSG_CONFIRM_TITLE;
      msg_confirm = translations.MSG_CONFIRM_COUNTERS;
      msg_noevents = translations.NO_EVENTS;
      msg_trackings = translations.TRACKINGS;
      msg_notifications = translations.NOTIFICATIONS;
      msg_mon = translations.MONDAY;
      msg_tue = translations.TUESDAY;
      msg_wed = translations.WEDNESDAY;
      msg_thu = translations.THURSDAY;
      msg_fri = translations.FRIDAY;
      msg_sat = translations.SATURDAY;
      msg_sun = translations.SUNDAY;
    });

  
    $scope.goLeft = function() {
      $scope.showLeftArrow = true;
      $scope.showRightArrow = true;

      if ($scope.showSumary) {
        // ir a odometro
        $scope.subtitulo_graphs = "Odometro";  
        $scope.showOdometer = true;
        $scope.showReport = false;
        $scope.showSumary = false;
        $scope.showLeftArrow = false;
      } else if ($scope.showReport) {
        // ir a graficos
        $scope.subtitulo_graphs = "Resumen global";  
        $scope.showSumary = true;
        $scope.showOdometer = false;
        $scope.showLeftArrow = true;
        $scope.showReport = false;
      } 
      $state.go('tab.graphs', {cache: false});
    }
    $scope.goRight = function() {
      $scope.showLeftArrow = true;
      $scope.showRightArrow = true;

      if ($scope.showSumary) {
        // ir a informe
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        $scope.subtitulo_graphs = "Informe diario: " + yesterday.getDate() + "/" + (yesterday.getMonth() +1) + "/" + yesterday.getFullYear();
        $scope.showReport = true;
        $scope.showOdometer = false;
        $scope.showSumary = false;
        $scope.showRightArrow = false;
      } else if ($scope.showOdometer) {
        // ir a graficos
        $scope.subtitulo_graphs = "Resumen global";  
        $scope.showSumary = true;
        $scope.showOdometer = false;
        $scope.showReport = false;
        $scope.showRightArrow = true;
      } 
      $state.go('tab.graphs', {cache: false});
    }

  $scope.showMapHistoricDevice = function() {
      localStorage.setItem("mapmode", MAP_MODE.report);
      $state.go('tab.map', {cache: false});
  }

  $scope.resetCounters = function() {

    var deviceId = getGraphDeviceId(MAP_MODE);  

    var confirmPopup = $ionicPopup.confirm({
     title: msg_confirm_title,
     template: msg_confirm
    });
    confirmPopup.then(function(res) {
      if(res) {
        var vehicleLicense = getGraphVehicleLicense(MAP_MODE);
        var url = APP.api_base + URL.resetGraphData + "/" + deviceId;
        console.log(url);
        $http({
          method: 'GET',
          url: url,
          headers: {
            'x-access': localStorage.getItem("token_api")
          }})
        .success(function(data, status, headers,config){    
            $scope.graph1_labels = [no_events];
            $scope.graph1_data = [1];
            $scope.graph2_data = [[0],[0]];      
            $scope.graph3_data = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];        
          })
          .error(function(data, status, headers,config){
          })
          .then(function(data, status, headers,config){
          })
      } 
    });   
  }


  $scope.showSumary = true;
  $scope.showReport = false;
  $scope.showOdometer = false;
  $scope.showLeftArrow = true;
  $scope.showRightArrow = true;

  var vehicleLicense = getGraphVehicleLicense(MAP_MODE);  
  var deviceId = getGraphDeviceId(MAP_MODE);  
  $scope.titulo_graphs = vehicleLicense;  
  $scope.subtitulo_graphs = "Resumen global";  



  localStorage.setItem("vehicleSelected", vehicleLicense);
  localStorage.setItem("deviceSelected", deviceId);

 
})