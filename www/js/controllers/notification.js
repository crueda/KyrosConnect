notifications = [];
iconos = [];
var num_notifications = 0;
var lastNotificationTimestamp = 0;

 function pad(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
  }

  function getEventCategoryDescription(eventCategory) {
    if (eventCategory==0)
      return "basicas";
    else if (eventCategory==1)
      return "seguridad";
    else if (eventCategory==2)
      return "geofencing";
    else if (eventCategory==3)
      return "conduccion";
    else
      return "otras";
  }

  function getEventCategory(eventType) {
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].category;      
    }
    return "5";
  }

  function getEventDescription(eventType) {
    //var evento = EVENT_ENUM.getByValue('value', eventType);
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].description;      
    }
    return "";
  }

  function getEventIcon(eventType) {
    if (eventType==0) {
      return 'img/event.png'; 
    } else {
       var evento = EventEnum[eventType];
       if (evento!=undefined) {
        return 'img/events/' + EventEnum.properties[evento].icon; 
      } else {
        return "";
      }
    }
  }

  function getEventDate(timestamp, timezone) {
    if (moment.tz.zone(timezone)!=null) {
      var localDate = moment.tz(new Date(timestamp), timezone);
      return localDate.format("DD/MM/YYYY HH:mm:ss") + " - GMT" + localDate.format("Z");       
      //return localDate.format("DD/MM/YYYY HH:mm:ss");       
    } else {
      var localDate = moment.tz(new Date(timestamp), "Europe/Madrid");
      return localDate.format("DD/MM/YYYY HH:mm:ss") + " - GMT" + localDate.format("Z");         
      //return localDate.format("DD/MM/YYYY HH:mm:ss");       
    }
  }

  
  function getEventDate_old(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    var hours = pad(date.getHours());
    var minutes = pad(date.getMinutes());
    var seconds = pad(date.getSeconds());
    var strDate = day + "/" + month + "/" + year + " - " + hours + ":" + minutes + ":" + seconds;
    return strDate;
  }

  function getLastNotifications($http, $scope, URL, APP) {
      // Comprobar si hay notificaciones nuevas
      var url = APP.api_base + URL.getLastNotifications;
      $http({
      method: 'POST',
      url: url,
        data: {username: localStorage.getItem("username"), 
          timestamp: lastNotificationTimestamp},
        headers: {
          'x-access': localStorage.getItem("token_api")
      }})
      .success(function(data, status, headers,config){
        if (data.result!=undefined) {
          for (var i=0; i<data.result.length; i++) {

            if (data.result[i].location!=undefined) {
              lat = data.result[i].location.coordinates[1].toFixed(4);
              lon = data.result[i].location.coordinates[0].toFixed(4);            
            } else {
              lat = 0;
              lon = 0;                        
            }

            var timezone = "Europe/Madrid";
            if (data.result[i].time_zone!=undefined) {
              timezone = data.result[i].time_zone;
            }

          notification = { mongoId: data.result[i]._id,
            id: i,
            categoryDescription: getEventCategoryDescription(getEventCategory(data.result[i].subtype)),
            category: getEventCategory(data.result[i].subtype),
            vehicleLicense: data.result[i].vehicle_license,
            deviceId: data.result[i].device_id,
            name: getEventDescription(data.result[i].subtype),
            icon: getEventIcon(data.result[i].subtype),
            timestamp: data.result[i].timestamp,       
            date: getEventDate(data.result[i].timestamp, timezone),
            timezone: timezone,
            eventType: data.result[i].subtype,
            latitude: lat,
            longitude: lon,
            speed: data.result[i].speed.toFixed(1),
            heading: data.result[i].heading.toFixed(1), 
            altitude: data.result[i].altitude.toFixed(0),
            geocoding: data.result[i].geocoding,
            battery: data.result[i].battery          
          }

          if (i==0){
            lastNotificationTimestamp = data.result[i].timestamp;
          }

          notifications.splice(0, 0, notification);
          num_notifications = num_notifications + 1;    
          $scope.num_notifications = num_notifications;    
          }

        }
      })
      .error(function(data, status, headers,config){
      });

  }

  function archiveAllNotification ($http, $scope, $ionicPopup, URL, APP) {
    var url = APP.api_base + URL.archiveAllNotifications + "/" + localStorage.getItem("username");
    console.log(url);
    $http({
      method: 'GET',
      url: url,
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){            
      if (data=="ok") {
        notifications = [];
        num_notifications = 0;

        $scope.notifications = notifications;
        $scope.num_notifications = 0;
        if (ionic.Platform.isIOS()) {
          $scope.top_bubble = 24;
        } else {
          $scope.top_bubble = 6;            
        }        

      } else {
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: msg_error_archive_all
          });

      }

      })
      .error(function(data, status, headers,config){
      });
      
  }

  function archiveNotification ($http, notificationId, URL, APP) {
    var url = APP.api_base + URL.archiveNotification;
    console.log(url);
    $http({
      method: 'POST',
      url: url,
      data: {username: localStorage.getItem("username"), notificationId: notificationId},
      headers: {
        'x-access': localStorage.getItem("token_api"),
      }})
    .success(function(data, status, headers,config){       
      })
      .error(function(data, status, headers,config){
      });
  }
  
  function onConfirm(buttonIndex) {
    if (buttonIndex==1) {
      archiveAllNotification ($http, $scope, $ionicPopup, URL, APP);
    }
  }

 
angular.module('main.notification', [])
.controller('NotificationsCtrl', function($rootScope, $scope, $state, $http, ClockSrv, Notifications, $ionicPopup, $ionicLoading, $timeout, URL, APP, $sce, $translate) {

    $translate(['MSG_CONFIRM_TITLE', 'MSG_CONFIRM_ARCHIVE_ALL', 'MSG_ERROR_ARCHIVE_ALL']).then(function (translations) {
      msg_confirm_title = translations.MSG_CONFIRM_TITLE;
      msg_confirm_archive_all = translations.MSG_CONFIRM_ARCHIVE_ALL;
      msg_error_archive_all = translations.MSG_ERROR_ARCHIVE_ALL;
    });

    ClockSrv.startClock(function(){
      getLastNotifications($http, $scope, URL, APP);
    });

    $scope.archiveNotifications = function() {

    /*
    navigator.notification.confirm(
        'Tienes ' + num_notifications + ' notificaciones.\r\n¿Deseas eliminarlas todas?', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Confirmar',           // title
        ['Si','No']     // buttonLabels
    );
    */
    var confirmPopup = $ionicPopup.confirm({
     title: msg_confirm_title,
     template: msg_confirm_archive_all
    });

     confirmPopup.then(function(res) {
       if(res) {
          archiveAllNotification ($http, $scope, $ionicPopup, URL, APP);
       } 
     });   
    }



  $scope.doRefresh = function() {
    $timeout( function() {
    var max_notifications = 100;
    if (localStorage.getItem("max_show_notifications")!=undefined) {
      max_notifications = localStorage.getItem("max_show_notifications");
    }
    var url = APP.api_base + URL.getNotificationsLimit;

    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

    console.log(url);
    notifications = [];
    iconos = [];

    $http({
    method: 'POST',
    url: url,
      data: {username: localStorage.getItem("username"), 
        max: max_notifications,
        group: localStorage.getItem("group_notifications")},
    headers: {
        'x-access': localStorage.getItem("token_api")
    }})
    .success(function(data, status, headers,config){
      $ionicLoading.hide();
      for (var i=0; i<data.result.length; i++) {

          if (data.result[i].location!=undefined) {
            lat = data.result[i].location.coordinates[1].toFixed(4);
            lon = data.result[i].location.coordinates[0].toFixed(4);            
          } else {
            lat = 0;
            lon = 0;                        
          }

            var timezone = "Europe/Madrid";
            if (data.result[i].time_zone!=undefined) {
              timezone = data.result[i].time_zone;
            }
        notification = { mongoId: data.result[i]._id,
          id: i,
          categoryDescription: getEventCategoryDescription(getEventCategory(data.result[i].subtype)),
          category: getEventCategory(data.result[i].subtype),
          vehicleLicense: data.result[i].vehicle_license,
          deviceId: data.result[i].device_id,
          name: getEventDescription(data.result[i].subtype),
          icon: getEventIcon(data.result[i].subtype),
          timestamp: data.result[i].timestamp,       
          date: getEventDate(data.result[i].timestamp, timezone),
          timezone: timezone,
          eventType: data.result[i].subtype,
          latitude: lat,
          longitude: lon,
          speed: data.result[i].speed.toFixed(1),
          heading: data.result[i].heading.toFixed(1),
          altitude: data.result[i].altitude.toFixed(0),
          geocoding: data.result[i].geocoding,
          battery: data.result[i].battery          
        }
        notifications.push(notification);
        if (i==0) {
          lastNotificationTimestamp = data.result[i].timestamp;
        }
        //iconos.push($sce.trustAsHtml($rootScope.eventIcon[data.result[i].subtype].svg));
          /*
          if ($rootScope.eventIcon!=undefined)  
          {
            if ($rootScope.eventIcon[data.result[i].subtype]!=undefined)
              iconos.push($sce.trustAsHtml($rootScope.eventIcon[data.result[i].subtype].svg));
            else
              iconos.push($sce.trustAsHtml($rootScope.eventIcon[0].svg));
          }*/
        }
      
        $scope.notifications = notifications;
        //$scope.trustedHtmlIcon = iconos;

        // Texto del indicador
        num_notifications = data.num_notifications;
        $scope.num_notifications = num_notifications;
        //$rootScope.num_notifications = num_notifications;

          // Anchura del indicador
          if (num_notifications > 999) {
            $scope.width_bubble = 57;
          } else if (num_notifications > 99) {
            $scope.width_bubble = 47;
          } else if (num_notifications > 9){
            $scope.width_bubble = 37;            
          } else {
            $scope.width_bubble = 27;                        
          }

          // Altura del indicador  
          if (ionic.Platform.isIOS()) {
            $scope.top_bubble = 24;
          } else {
            $scope.top_bubble = 6;            
          }

        $ionicLoading.show({
          template: 'Actualizado',
          duration: 700,
          scope: $scope
        });

          $scope.$broadcast('scroll.refreshComplete');
        })
        .error(function(data, status, headers,config){
          //$scope.notifications = notifications;
          $ionicLoading.show({
            template: 'Error de red',
            scope: $scope
          });
          $timeout(function() {
             $scope.$broadcast('scroll.refreshComplete');
             $ionicLoading.hide();
             //$state.go('login');
          }, 1500);
        });

    
    }, 200); //2000
  };

$scope.filterCategory = function(category) {  
  $scope.busquedaCategory = category;
}

  $scope.remove = function(notification, $scope, URL) {
    notifications.splice(notifications.indexOf(notification), 1);
    num_notifications = num_notifications + 1;    
    $scope.num_notifications = num_notifications;    


    var url = APP.api_base + URL.archiveNotification;// + "?username="+ localStorage.getItem("username") + "&notificationId="+notification['mongoId'];
    $http({
      method: 'POST',
      url: url,
      data: {username: localStorage.getItem("username"), notificationId: notification['mongoId']},
      headers: {
        'x-access': localStorage.getItem("token_api")
    }})
    .success(function(data, status, headers,config){            
    })
    .error(function(data, status, headers,config){
    });

  }

  if (localStorage.getItem("username")=="") {
    $state.go('login');
  } else {

 var max_notifications = 100;
  if (localStorage.getItem("max_show_notifications")!=undefined) {
    max_notifications = localStorage.getItem("max_show_notifications");
  }

  var url = APP.api_base + URL.getNotificationsLimit;
  notifications = [];
  iconos = [];
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  $http({
    method: 'POST',
    url: url,
    data: {username: localStorage.getItem("username"), 
        max: max_notifications,
        group: localStorage.getItem("group_notifications")},
    headers: {
        'x-access': localStorage.getItem("token_api")
    }})
    .success(function(data, status, headers,config){
      $ionicLoading.hide(); 


      if (data.result==undefined) {
        $ionicLoading.show({
          template: 'Error de red',
          scope: $scope
        });
        $timeout(function() {
          $ionicLoading.hide();
          //$state.go('login');
        }, 1500);        
      } else {
  

        for (var i=0; i<data.result.length; i++) {      

          if (data.result[i].location!=undefined) {
            lat = data.result[i].location.coordinates[1].toFixed(4);
            lon = data.result[i].location.coordinates[0].toFixed(4);            
          } else {
            lat = 0;
            lon = 0;                        
          }

            var timezone = "Europe/Madrid";
            if ('time_zone' in data.result[i]) {
              timezone = data.result[i].time_zone;
            }

          //console.log ("-->"+ $sce.trustAsHtml(data.result[i].subtype));
          notification = { mongoId: data.result[i]._id,
            id: i,
            categoryDescription: getEventCategoryDescription(getEventCategory(data.result[i].subtype)),
            category: getEventCategory(data.result[i].subtype),
            vehicleLicense: data.result[i].vehicle_license,
            deviceId: data.result[i].device_id,
            name: getEventDescription(data.result[i].subtype),
            eventType: data.result[i].subtype,
            icon: getEventIcon(data.result[i].subtype),     
            timestamp: data.result[i].timestamp,       
            date: getEventDate(data.result[i].timestamp, timezone),
            timezone: timezone,
            latitude: lat,
            longitude: lon,
            speed: data.result[i].speed.toFixed(1),
            heading: data.result[i].heading.toFixed(1),
            altitude: data.result[i].altitude.toFixed(0),
            geocoding: data.result[i].geocoding,
            battery: data.result[i].battery,

          }
          notifications.push(notification);
          if (i==0) {
            lastNotificationTimestamp = data.result[i].timestamp;            
          }

          eventType = data.result[i].subtype;


          //913
          //iconos.push($sce.trustAsHtml($rootScope.eventIcon[913].svg));

          /* 
          if ($rootScope.eventIcon!=undefined) {
            if ($rootScope.eventIcon[eventType]!=undefined)
              iconos.push($sce.trustAsHtml($rootScope.eventIcon[eventType].svg));
            else
              iconos.push($sce.trustAsHtml($rootScope.eventIcon[0].svg));            
          } */

          
        }

        $scope.notifications = notifications;
        num_notifications = data.num_notifications;
        $scope.num_notifications = num_notifications;    

        // Altura del indicador
        if (ionic.Platform.isIOS()) {
              $scope.top_bubble = 24;
        } else {
              $scope.top_bubble = 6;            
        }

        // Anchura del indicador
        if (num_notifications > 999) {
          $scope.width_bubble = 57;
        } else if (num_notifications > 99) {
          $scope.width_bubble = 47;
        } else if (num_notifications > 9){
          $scope.width_bubble = 37;            
        } else {
          $scope.width_bubble = 27;                        
        }

      } // else
  }) // success
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
  
  } // else
})

.controller('NotificationDetailCtrl', function($scope, $rootScope, $http, $state, $ionicPopup, $ionicLoading, $cordovaNativeAudio, $stateParams, Notifications, MAP_MODE, URL, APP, $sce) {

$scope.setAsDefault = function() {
    $scope.notification = notifications[parseInt(localStorage.getItem("notificationSelected"))];
    localStorage.setItem("notificationSelected", $scope.notification.id);  
    localStorage.setItem("notificationSelectedVehicleLicense", $scope.notification.vehicleLicense);  
    localStorage.setItem("notificationSelectedDeviceId", $scope.notification.deviceId);  
    localStorage.setItem("notificationSelectedLatitude", $scope.notification.latitude);  
    localStorage.setItem("notificationSelectedLongitude", $scope.notification.longitude);  
    localStorage.setItem("notificationSelectedIcon", $scope.notification.icon);  
    localStorage.setItem("notificationSelectedEventType", $scope.notification.eventType);  
    localStorage.setItem("notificationSelectedName", $scope.notification.name); 
    localStorage.setItem("notificationSelectedDate", $scope.notification.date); 
    localStorage.setItem("notificationSelectedTimestamp", $scope.notification.timestamp); 
    localStorage.setItem("notificationSelectedTimezone", $scope.notification.timezone); 




    var selectedDevice = localStorage.getItem("notificationSelectedDeviceId");
    localStorage.setItem("deviceSelected", selectedDevice);
    var url = APP.api_base + URL.setDefaultVehicle;
    //console.log(url);
    $http({
      method: 'POST',
      url: url,
      data: {
        username: localStorage.getItem("username"), 
        deviceId: localStorage.getItem("deviceSelected")
      },
      headers: {
        'x-access': localStorage.getItem("token_api")
      }})
    .success(function(data, status, headers,config){  
        localStorage.setItem("mapmode", MAP_MODE.notification);
        $state.go('tab.map');
    })
    .error(function(data, status, headers,config){       
    });      
  }  

    localStorage.setItem("notificationSelected", $stateParams.notificationId);  
    $scope.notification = notifications[$stateParams.notificationId];  
  
  
  $scope.archiveSelectNotification = function(notificationId) { 


    go_notificationId =  parseInt(localStorage.getItem("notificationSelected")) + 1;
    if (go_notificationId > notifications.length -2) {
      go_notificationId = notifications.length -1;
    }
    $scope.notification = notifications[go_notificationId];    
    localStorage.setItem("notificationSelected", go_notificationId);
    
    archiveNotification ($http, notificationId, URL, APP);
    notifications.splice(go_notificationId-1, 1);


      $ionicLoading.show({
        template: 'Notificación borrada',
        duration: 666,
        scope: $scope
      });

    num_notifications = num_notifications - 1;
    $scope.num_notifications = num_notifications;    

    if (notifications.length>0) {
      $state.go('tab.notification-detail', {cache: false});
    } else {
      $state.go('tab.notifications', {cache: false, mode: localStorage.getItem("group_notifications")});      
    }

  }

  $scope.goPreviousNotification = function() {
    go_notificationId =  parseInt(localStorage.getItem("notificationSelected")) - 1;
    if (go_notificationId < 0) {
      go_notificationId = 0;
    }
    $scope.notification = notifications[go_notificationId];   
    //if ($rootScope.eventIcon!=undefined)   
      //$scope.trustedHtmlIconEvent = $sce.trustAsHtml($rootScope.eventIcon[notifications[go_notificationId].eventType].svg);   
    localStorage.setItem("notificationSelected", go_notificationId);
    $state.go('tab.notifications-detail', {cache: false});
  }

  $scope.goNextNotification = function() {
    go_notificationId =  parseInt(localStorage.getItem("notificationSelected")) + 1;
    if (go_notificationId > notifications.length -2) {
      go_notificationId = notifications.length -1;
    }
    $scope.notification = notifications[go_notificationId]; 
    //if ($rootScope.eventIcon!=undefined)  
      //$scope.trustedHtmlIconEvent = $sce.trustAsHtml($rootScope.eventIcon[notifications[go_notificationId].eventType].svg);   
    localStorage.setItem("notificationSelected", go_notificationId);
    $state.go('tab.notifications-detail', {cache: false});
  }
  $scope.showGraphsDevice = function() {
    
    //$scope.notification = notifications[$stateParams.notificationId];
    $scope.notification = notifications[parseInt(localStorage.getItem("notificationSelected"))];
    localStorage.setItem("notificationSelected", $scope.notification.id);  
    localStorage.setItem("notificationSelectedVehicleLicense", $scope.notification.vehicleLicense);  
    localStorage.setItem("notificationSelectedDeviceId", $scope.notification.deviceId);  
    localStorage.setItem("notificationSelectedLatitude", $scope.notification.latitude);  
    localStorage.setItem("notificationSelectedLongitude", $scope.notification.longitude);  
    localStorage.setItem("notificationSelectedIcon", $scope.notification.icon);  
    localStorage.setItem("notificationSelectedEventType", $scope.notification.eventType);  
    localStorage.setItem("notificationSelectedName", $scope.notification.name); 
    localStorage.setItem("notificationSelectedDate", $scope.notification.date); 
    localStorage.setItem("notificationSelectedTimestamp", $scope.notification.timestamp); 
    localStorage.setItem("notificationSelectedTimezone", $scope.notification.timezone); 

    localStorage.setItem("mapmode", MAP_MODE.notification);

    $state.go('tab.graphs');

  };

    $scope.showMapNotification = function() {
    
    //$scope.notification = notifications[$stateParams.notificationId];
    $scope.notification = notifications[parseInt(localStorage.getItem("notificationSelected"))];
    localStorage.setItem("notificationSelected", $scope.notification.id);  
    localStorage.setItem("notificationSelectedVehicleLicense", $scope.notification.vehicleLicense);  
    localStorage.setItem("notificationSelectedDeviceId", $scope.notification.deviceId);  
    localStorage.setItem("notificationSelectedLatitude", $scope.notification.latitude);  
    localStorage.setItem("notificationSelectedLongitude", $scope.notification.longitude);  
    localStorage.setItem("notificationSelectedIcon", $scope.notification.icon);  
    localStorage.setItem("notificationSelectedEventType", $scope.notification.eventType);  
    localStorage.setItem("notificationSelectedName", $scope.notification.name); 
    localStorage.setItem("notificationSelectedDate", $scope.notification.date); 
    localStorage.setItem("notificationSelectedTimestamp", $scope.notification.timestamp); 
    localStorage.setItem("notificationSelectedTimezone", $scope.notification.timezone); 

    localStorage.setItem("mapmode", MAP_MODE.notification);

    //$scope.titulo_mapa = localStorage.getItem("notificationSelected");          
    $state.go('tab.map');

  };

$scope.notificationArchiveChange = function() {
  //console.log("archive:" + $scope.notification.value);

  if ($scope.notification.value) {
    //notifications.splice($stateParams.notificationId, 1);

    archiveNotification($http, $scope.notification['mongoId'], URL, APP);
    $state.go('tab.notifications',  {cache: false, mode: localStorage.getItem("group_notifications")});
  }

};

})





