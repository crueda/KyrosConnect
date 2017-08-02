 function pad(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
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

  function getStrDate_old(timestamp) {
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

  function getStrDateMap(timestamp, timezone) {
    if (moment.tz.zone(timezone)!=null) {
      var localDate = moment.tz(new Date(timestamp), timezone);
      //return localDate.format("DD/MM/YYYY HH:mm:ss") + " - GMT" + localDate.format("Z");       
      return localDate.format("DD/MM/YYYY HH:mm:ss");       
    } else {
      var localDate = moment.tz(new Date(timestamp), "Europe/Madrid");
      return localDate.format("DD/MM/YYYY HH:mm:ss");       
    }
  }

  function getEventDescription(eventType) {
    //var evento = EVENT_ENUM.getByValue('value', eventType);
    var evento = EventEnum[eventType];
    if (evento!=undefined) {
      return EventEnum.properties[evento].description;      
    }
    return "";
  }

  function drawMapElements($scope, $rootScope, $timeout, $compile, $http, $state, $ionicPopup, URL, MAP_MODE, APP) {
        if (localStorage.getItem("mapmode") == MAP_MODE.notification) {  

        var latLngNotification = new google.maps.LatLng(localStorage.getItem("notificationSelectedLatitude"), localStorage.getItem("notificationSelectedLongitude"));
        /*
        var icono = "";
        if ($rootScope.eventIcon!=undefined)
          icono = 'data:image/svg+xml;utf-8,' + $sce.trustAsHtml($rootScope.eventIcon[localStorage.getItem("notificationSelectedEventType")].svg);
        else
           icono = getEventIcon(localStorage.getItem("notificationPushEventType")),
        */

      var marker = new google.maps.Marker({
          map: $scope.map,
          icon: {
            scaledSize: new google.maps.Size(40, 40),
            url: getEventIcon(localStorage.getItem("notificationSelectedEventType"))
            //url: 'data:image/svg+xml;utf-8,' + $sce.trustAsHtml($rootScope.eventIcon[localStorage.getItem("notificationSelectedEventType")].svg)
          },
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: latLngNotification
      });   


      // InfoWindow content
      var content = '<div id="iw-container">' +
        '<div class="iw-title">' + localStorage.getItem("notificationSelectedName") + '</div>' +
        '<div class="iw-content">' +
        '<div class="iw-subTitle">' + msg_vehicle_license + ':</div>' +
        '<p>' + localStorage.getItem("notificationSelectedVehicleLicense") + '</p>' +
        '<div class="iw-subTitle">' + msg_date + ':</div>' +
        '<p>' + getStrDateMap(parseInt(localStorage.getItem("notificationSelectedTimestamp")),localStorage.getItem("notificationSelectedTimezone")) + '</p>' + 
        '<button class="button button-block button-balanced tooltipButton" ng-click="historic()">' + msg_historic + ' 24h.</button>'+
        '</div>' +
        '<div class="iw-bottom-gradient"></div>' +
        '</div>';

      var compiled = $compile(content)($scope);
      var infoWindow = new google.maps.InfoWindow({
          content: compiled[0],
          maxWidth: 180
      });
     
      infoWindowOld = infoWindow;

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      }); 
      google.maps.event.addListener($scope.map, 'click', function() {
        infoWindow.close();
      });
     
      google.maps.event.addListener(infoWindow, 'domready', function() {
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        iwOuter.parent().parent().css({left: '10px'});
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
        var iwCloseBtn = iwOuter.next();
        iwCloseBtn.css({opacity: '1', right: '1px', top: '1px', border: '7px solid #48b5e9', 'border-radius': '23px', 'box-shadow': '0 0 5px #3990B9'});

        if($('.iw-content').height() < 140){
          $('.iw-bottom-gradient').css({display: 'none'});
        } 

        iwCloseBtn.mouseout(function(){
          $(this).css({opacity: '1'});
        });
      });

      $scope.map.setCenter(latLngNotification);  
      $scope.map.setZoom(15);
    }
    else if (localStorage.getItem("mapmode") == MAP_MODE.push) {  


    var latLngNotification = new google.maps.LatLng(localStorage.getItem("notificationPushLatitude"), localStorage.getItem("notificationPushLongitude"));
        var image = {
          scaledSize: new google.maps.Size(40, 40),
          //url: 'data:image/svg+xml;utf-8,' + $sce.trustAsHtml($rootScope.eventIcon[data[0].subtype].svg) 
          url: getEventIcon(localStorage.getItem("notificationPushEventType")),
        };

      var marker = new google.maps.Marker({
          map: $scope.map,
          icon: image,
          animation: google.maps.Animation.DROP,
          position: latLngNotification
      });   

      // InfoWindow content
      var content = '<div id="iw-container">' +
        '<div class="iw-title">' + getEventDescription(localStorage.getItem("notificationPushEventType")) + '</div>' +
        //'<div class="iw-title">' + getEventDescription(data[0].subtype) + '</div>' +
        '<div class="iw-content">' +
        '<div class="iw-subTitle">' + msg_vehicle_license + ':</div>' +
        '<p>' + localStorage.getItem("notificationSelectedVehicleLicense") + '</p>' +
        '<div class="iw-subTitle">' + msg_date + ':</div>' +
        '<p>'  + getStrDateMap(parseInt(localStorage.getItem("notificationPushTimestamp")),localStorage.getItem("notificationPushTimezone")) + '</p>' + 
        //'<p>'  + getStrDate(parseInt(data[0].timestamp)) + '</p>' + 
        '<button class="button button-block button-balanced tooltipButton" ng-click="historic()">' + msg_historic + ' 24h.</button>'+
        '</div>' +
        '<div class="iw-bottom-gradient"></div>' +
        '</div>';

      var compiled = $compile(content)($scope);
      var infoWindow = new google.maps.InfoWindow({
          content: compiled[0],
          maxWidth: 180
      });
     
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      }); 
      google.maps.event.addListener($scope.map, 'click', function() {
        infoWindow.close();
      });
     
      google.maps.event.addListener(infoWindow, 'domready', function() {
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        iwOuter.parent().parent().css({left: '10px'});
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
        var iwCloseBtn = iwOuter.next();
        iwCloseBtn.css({opacity: '1', right: '1px', top: '1px', border: '7px solid #48b5e9', 'border-radius': '23px', 'box-shadow': '0 0 5px #3990B9'});

        if($('.iw-content').height() < 140){
          $('.iw-bottom-gradient').css({display: 'none'});
        } 

        iwCloseBtn.mouseout(function(){
          $(this).css({opacity: '1'});
        });
      });
      
      $scope.map.setCenter(latLngNotification);  
      $scope.map.setZoom(15);

      //})
      //.error(function(data, status, headers,config){
      //});
      
    }else if (localStorage.getItem("mapmode") == MAP_MODE.device) {   
      if (localStorage.getItem("deviceSelectedLatitude") != 0) {
        var latLngDevice = new google.maps.LatLng(localStorage.getItem("deviceSelectedLatitude"), localStorage.getItem("deviceSelectedLongitude"));
        var image = {
          url: 'img/devices/' + localStorage.getItem("deviceSelectedIcon"),
          //anchor: new google.maps.Point(20, 20),
          scaledSize: new google.maps.Size(50, 50)
        };
        var imageNull = {
          url: 'img/devices/kyros.svg',
          scaledSize: new google.maps.Size(50, 50)
        };
        var marker = new google.maps.Marker({
            map: $scope.map,
            icon: image,
            animation: google.maps.Animation.DROP,
            position: latLngDevice
        });   
        var i = new Image();
        i.src = 'img/devices/' + localStorage.getItem("deviceSelectedIcon");
        //i.onload = function () {
        //  marker.setIcon(icon); 
        //}
        i.onerror = function () {
          marker.setIcon(imageNull); //This displays brick colored standard marker icon in case image is not found.
        }
       
        google.maps.event.addListener(marker, 'click', function () {
            //infoWindow.open($scope.map, marker);
            $state.go('tab.device-detail');   
        }); 
        $scope.map.setCenter(latLngDevice);  
        $scope.map.setZoom(15);

      
      } else {
          var alertPopup = $ionicPopup.alert({
            title: msg_message,
            template: msg_error_no_tracking
          });
          //var actualLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var latLng = new google.maps.LatLng(40.416897, -3.703442);
          $scope.map.setCenter(latLng);
          $scope.map.setZoom(5);
          /*
          var marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: actualLatLng
          });   
          var infoWindow = new google.maps.InfoWindow({
              content: "Estoy aqui"
          });
          google.maps.event.addListener(marker, 'click', function () {
              infoWindow.open($scope.map, marker);
          });*/ 
      }
    }else if (localStorage.getItem("mapmode") == MAP_MODE.report) {   
      if ($rootScope.tracking.length>0) {
        var pathCoordinates = [];
        var bounds = new google.maps.LatLngBounds();
        var infoWindowStart;
        var infoWindowEnd;
        var markers = [];
        for (var t=0; t<$rootScope.tracking.length; t++) {
          var latLng = new google.maps.LatLng($rootScope.tracking[t].latitude, $rootScope.tracking[t].longitude);         
          var point = {lat: $rootScope.tracking[t].latitude, lng: $rootScope.tracking[t].longitude};
          pathCoordinates.push(point);
          var image = {
            url: 'img/beacon_ball_blue.gif',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20)
          };
          var marker = new google.maps.Marker({
              map: $scope.map,
              icon: image,
              position: latLng
          }); 
          markers.push(marker);

          if (t==0) {
            // InfoWindow content
            var content = '<div id="iw-container">' +
              '<div class="iw-title">' + msg_init_work + '</div>' +
              '<div class="iw-content">' +
              '<div class="iw-subTitle">Coordenadas:</div>' +
              '<p>' + $rootScope.tracking[t].latitude.toFixed(4) + ',' + $rootScope.tracking[t].longitude.toFixed(4) + '</p>' +
              '<div class="iw-subTitle">' + msg_date + ':</div>' +
              '<p>'  + getStrDateMap(parseInt($rootScope.tracking[t].timestamp), $rootScope.report_timezone) + '</p>' + 
              '</div>' +
              '<div class="iw-bottom-gradient"></div>' +
              '</div>';

            var compiled = $compile(content)($scope);
            infoWindowStart = new google.maps.InfoWindow({
                content: compiled[0],
                maxWidth: 180
            });
          
          } else if (t==$rootScope.tracking.length-1) {

            // InfoWindow content
            var content = '<div id="iw-container">' +
              '<div class="iw-title">' + msg_init_work + '</div>' +
              '<div class="iw-content">' +
              '<div class="iw-subTitle">Coordenadas:</div>' +
              '<p>' + $rootScope.tracking[t].latitude.toFixed(4) + ',' + $rootScope.tracking[t].longitude.toFixed(4) + '</p>' +
              '<div class="iw-subTitle">' + msg_date + ':</div>' +
              '<p>'  + getStrDateMap(parseInt($rootScope.tracking[t].timestamp), $rootScope.report_timezone) + '</p>' + 
              '</div>' +
              '<div class="iw-bottom-gradient"></div>' +
              '</div>';

            var compiled = $compile(content)($scope);
            infoWindowEnd = new google.maps.InfoWindow({
                content: compiled[0],
                maxWidth: 180
            });
          }

            google.maps.event.addListener(marker, 'click', function () {
                infoWindowStart.open($scope.map, markers[0]);
                infoWindowEnd.open($scope.map, markers[$rootScope.tracking.length-1]);
            }); 

          bounds.extend(latLng);
        } // for    

            google.maps.event.addListener($scope.map, 'click', function() {
              infoWindowStart.close();
              infoWindowEnd.close();
            });
           
            google.maps.event.addListener(infoWindowStart, 'domready', function() {
              var iwOuter = $('.gm-style-iw');
              var iwBackground = iwOuter.prev();
              iwBackground.children(':nth-child(2)').css({'display' : 'none'});
              iwBackground.children(':nth-child(4)').css({'display' : 'none'});
              iwOuter.parent().parent().css({left: '10px'});
              iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
              var iwCloseBtn = iwOuter.next();
              iwCloseBtn.css({opacity: '1', right: '1px', top: '1px', border: '7px solid #48b5e9', 'border-radius': '23px', 'box-shadow': '0 0 5px #3990B9'});

              if($('.iw-content').height() < 140){
                $('.iw-bottom-gradient').css({display: 'none'});
              } 

              iwCloseBtn.mouseout(function(){
                $(this).css({opacity: '1'});
              });
            });

            google.maps.event.addListener(infoWindowEnd, 'domready', function() {
              var iwOuter = $('.gm-style-iw');
              var iwBackground = iwOuter.prev();
              iwBackground.children(':nth-child(2)').css({'display' : 'none'});
              iwBackground.children(':nth-child(4)').css({'display' : 'none'});
              iwOuter.parent().parent().css({left: '10px'});
              iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
              var iwCloseBtn = iwOuter.next();
              iwCloseBtn.css({opacity: '1', right: '1px', top: '1px', border: '7px solid #48b5e9', 'border-radius': '23px', 'box-shadow': '0 0 5px #3990B9'});

              if($('.iw-content').height() < 140){
                $('.iw-bottom-gradient').css({display: 'none'});
              } 

              iwCloseBtn.mouseout(function(){
                $(this).css({opacity: '1'});
              });
            });

        var historicPath = new google.maps.Polyline({
          path: pathCoordinates,
          strokeColor: '#0000FF',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });
        historicPath.setMap($scope.map);
        $scope.map.fitBounds(bounds);


      
      } else {
          var alertPopup = $ionicPopup.alert({
            title: msg_message,
            template: msg_error_no_tracking
          });
          //var actualLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var latLng = new google.maps.LatLng(40.416897, -3.703442);
          $scope.map.setCenter(latLng);
          $scope.map.setZoom(5);
      }
    }

    else if (localStorage.getItem("deviceId")!=0) {    

      var bounds = new google.maps.LatLngBounds();
      var url = APP.api_base + URL.tracking1device + "/" + localStorage.getItem("deviceId");
      $http({
        method: 'GET',
        url: url,
        headers: {
          'x-access': localStorage.getItem("token_api")
        }
      }).success(function(data, status, headers,config){  
        var latLngVehicle = new google.maps.LatLng(data[0].location.coordinates[1], data[0].location.coordinates[0]);
        var image = {
          url: 'img/devices/' + data[0].icon,
          //anchor: new google.maps.Point(15, 15),
          scaledSize: new google.maps.Size(50, 50)
        };
        var imageNull = {
          url: 'img/devices/kyros.svg',
          scaledSize: new google.maps.Size(50, 50)
        };
      var marker = new google.maps.Marker({
          map: $scope.map,
          icon: image,
          animation: google.maps.Animation.DROP,
          position: latLngVehicle
      });   
      var i = new Image();
      i.src = 'img/devices/' + data[0].icon;
      //i.onload = function () {
      //  marker.setIcon(icon); 
      //}
      i.onerror = function () {
        //marker.setIcon(null); 
        marker.setIcon(imageNull); 
      }

      var infoWindow = new google.maps.InfoWindow({
          content: data[0].alias
      });
     
      bounds.extend(marker.position);

      // InfoWindow content
      var content = '<div id="iw-container">' +
        '<div class="iw-title">' + msg_my_vehicle + '</div>' +
        '<div class="iw-content">' +
        '<div class="iw-subTitle">' + msg_vehicle_license + ':</div>' +
        '<p>' + localStorage.getItem("vehicleLicense") + '</p>' +
        '<div class="iw-subTitle">' + msg_date + ':</div>' +
        '<p>' + getStrDateMap(parseInt(data[0].pos_date), data[0].time_zone) + '</p>' + 
        '<button class="button button-block button-balanced tooltipButton" ng-click="historicDefault()">' + msg_historic + ' 24h.</button>'+
        '</div>' +
        '<div class="iw-bottom-gradient"></div>' +
        '</div>';

      var compiled = $compile(content)($scope);
      var infoWindow = new google.maps.InfoWindow({
          content: compiled[0],
          maxWidth: 180
      });
     
      infoWindowOld = infoWindow;

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      }); 
      google.maps.event.addListener($scope.map, 'click', function() {
        infoWindow.close();
      });
     
      google.maps.event.addListener(infoWindow, 'domready', function() {
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        iwOuter.parent().parent().css({left: '10px'});
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
        var iwCloseBtn = iwOuter.next();
        iwCloseBtn.css({opacity: '1', right: '1px', top: '1px', border: '7px solid #48b5e9', 'border-radius': '23px', 'box-shadow': '0 0 5px #3990B9'});

        if($('.iw-content').height() < 140){
          $('.iw-bottom-gradient').css({display: 'none'});
        } 

        iwCloseBtn.mouseout(function(){
          $(this).css({opacity: '1'});
        });
      });



       $scope.map.setCenter(bounds.getCenter());  
      $scope.map.setZoom(15);

      })
      .error(function(data, status, headers,config){
      })
      .then(function(result){
        things = result.data;
      });

    } else {
      var latLng = new google.maps.LatLng(40.416897, -3.703442);
      $scope.map.setCenter(latLng);
      $scope.map.setZoom(5);
    }
  }


  var infoWindowOld = null;

angular.module('main.map', [])
.controller('MapCtrl', function($scope, $rootScope, $timeout, $compile, $http, $state, $ionicPopup, $cordovaGeolocation, $translate, URL, MAP_MODE, APP, $sce) {

$translate(['MY_VEHICLE', 'VEHICLE_LICENSE', 'HISTORIC', 'MESSAGE', 'ERROR_NO_TRACKING', 'TRACKING_LAST_HOURS', 'DATE', 'INIT_WORK', 'END_WORK', 'SPEED']).then(function (translations) {
      msg_my_vehicle = translations.MY_VEHICLE;
      msg_vehicle_license = translations.VEHICLE_LICENSE;
      msg_historic = translations.HISTORIC;
      msg_message = translations.MESSAGE;
      msg_error_no_tracking = translations.ERROR_NO_TRACKING;
      msg_tracking_last_hours = translations.TRACKING_LAST_HOURS;
      msg_date = translations.DATE,
      msg_speed = translations.SPEED,
      msg_init_work = translations.INIT_WORK;
      msg_end_work = translations.END_WORK;
    });

  $scope.historic = function() {
     if (localStorage.getItem("mapmode") == MAP_MODE.notification || localStorage.getItem("mapmode") == MAP_MODE.push) { 

      if (infoWindowOld!=null)
         infoWindowOld.close();

      var actualDate = new Date().getTime();
      var initDate = actualDate - 86400000

      var bounds = new google.maps.LatLngBounds();
      var url = APP.api_base + URL.trackingDevice + "/" + localStorage.getItem("notificationSelectedDeviceId");
      $http({
        method: 'POST',
        url: url,
        data: {initDate: initDate, endDate: actualDate},
        headers: {
          'x-access': localStorage.getItem("token_api")
        }}).success(function(data, status, headers,config){  
        if (data.status=="ok" && data.result.tracking.length > 0) {
        var pathCoordinates = [];
        for (var i=0; i<data.result.tracking.length; i++) {
 
          var point = {lat: data.result.tracking[i].location.coordinates[1], lng: data.result.tracking[i].location.coordinates[0]};
          pathCoordinates.push(point);
          var latLng = new google.maps.LatLng(data.result.tracking[i].location.coordinates[1], data.result.tracking[i].location.coordinates[0]);
         
         var image = {
            url: 'img/beacon_ball_blue.gif',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20)
          };
          var marker = new google.maps.Marker({
              map: $scope.map,
              icon: image,
              strDate: getStrDateMap(parseInt(data.result.tracking[i].pos_date), data.result.time_zone),
              speed: data.result.tracking[i].speed,
              //animation: google.maps.Animation.DROP,
              position: latLng
          });   
                   
          var infoWindow = new google.maps.InfoWindow({
            content: '',
            maxWidth: 180
          });


          marker.addListener('click', function() {
                  var content = '<div id="iw-container">' +
        '<div class="iw-title">' + msg_historic + '</div>' +
        '<div class="iw-content">' +
        '<div class="iw-subTitle">' + msg_date + ':</div>' +
        '<p>' + this.strDate + '</p>' + 
        '<div class="iw-subTitle">' + msg_speed + ':</div>' +
        '<p>' + this.speed + 'Km/h</p>' + 
        '</div>' +
        '<div class="iw-bottom-gradient"></div>' +
        '</div>';
        var compiled = $compile(content)($scope);

              infoWindow.setContent(compiled[0]);
              infoWindow.open($scope.map, marker);
              infoWindow.setPosition(this.position);
          });

      google.maps.event.addListener($scope.map, 'click', function() {
        infoWindow.close();
      });

         google.maps.event.addListener(infoWindow, 'domready', function() {
              var iwOuter = $('.gm-style-iw');
              var iwBackground = iwOuter.prev();
              iwBackground.children(':nth-child(2)').css({'display' : 'none'});
              iwBackground.children(':nth-child(4)').css({'display' : 'none'});
              iwOuter.parent().parent().css({left: '10px'});
              iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
              var iwCloseBtn = iwOuter.next();
              iwCloseBtn.css({opacity: '1', right: '1px', top: '1px', border: '7px solid #48b5e9', 'border-radius': '23px', 'box-shadow': '0 0 5px #3990B9'});

              if($('.iw-content').height() < 140){
                $('.iw-bottom-gradient').css({display: 'none'});
              } 

              iwCloseBtn.mouseout(function(){
                $(this).css({opacity: '1'});
              });
            });

          bounds.extend(latLng);



        }
        var historicPath = new google.maps.Polyline({
          path: pathCoordinates,
          //geodesic: true,
          strokeColor: '#0000FF',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });

        historicPath.setMap($scope.map);
        $scope.map.fitBounds(bounds);
      } else {
        if (status==200) {
          var alertPopup = $ionicPopup.alert({
              title: msg_tracking_last_hours,
              template: msg_error_no_tracking
          });          
        } else {  // vengo de un push
          //$state.go('login');   
        }

      }
      })
      .error(function(data, status, headers,config){
         //$state.go('login');  
      });
     }
  };

  $scope.historicDefault = function() {
         
      if (infoWindowOld!=null)
         infoWindowOld.close();

      var actualDate = new Date().getTime();
      var initDate = actualDate - 86400000;

      var bounds = new google.maps.LatLngBounds();
      var url = APP.api_base + URL.trackingDevice + "/" + localStorage.getItem("deviceId");
      $http({
        method: 'POST',
        url: url,
        data: {initDate: initDate, endDate: actualDate},
        headers: {
          'x-access': localStorage.getItem("token_api")
        }}).success(function(data, status, headers,config){  
        if (data.status=="ok" && data.result.tracking.length > 0) {
        var pathCoordinates = [];
        for (var i=0; i<data.result.tracking.length; i++) {
 
          var point = {lat: data.result.tracking[i].location.coordinates[1], lng: data.result.tracking[i].location.coordinates[0]};
          pathCoordinates.push(point);
          var latLng = new google.maps.LatLng(data.result.tracking[i].location.coordinates[1], data.result.tracking[i].location.coordinates[0]);
         
         var image = {
            url: 'img/beacon_ball_blue.gif',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20)
          };
          var marker = new google.maps.Marker({
              map: $scope.map,
              icon: image,
              strDate: getStrDateMap(parseInt(data.result.tracking[i].pos_date), data.result.time_zone),
              speed: data.result.tracking[i].speed,
              //animation: google.maps.Animation.DROP,
              position: latLng
          });   

          var infoWindow = new google.maps.InfoWindow({
             content: '',
             maxWidth: 180,
             pixelOffset: new google.maps.Size(0,0)
          });


          marker.addListener('click', function() {
            var content = '<div id="iw-container">' +
            '<div class="iw-title">' + msg_historic + '</div>' +
            '<div class="iw-content">' +
            '<div class="iw-subTitle">' + msg_date + ':</div>' +
            '<p>' + this.strDate + '</p>' + 
            '<div class="iw-subTitle">' + msg_speed + ':</div>' +
            '<p>' + this.speed + 'Km/h</p>' + 
            '</div>' +
            '<div class="iw-bottom-gradient"></div>' +
            '</div>';
            var compiled = $compile(content)($scope);

              infoWindow.setContent(compiled[0]);
              infoWindow.open($scope.map, marker);
              infoWindow.setPosition(this.position);
          });

          google.maps.event.addListener($scope.map, 'click', function() {
            infoWindow.close();
          });

         google.maps.event.addListener(infoWindow, 'domready', function() {
              var iwOuter = $('.gm-style-iw');
              var iwBackground = iwOuter.prev();
              iwBackground.children(':nth-child(2)').css({'display' : 'none'});
              iwBackground.children(':nth-child(4)').css({'display' : 'none'});
              iwOuter.parent().parent().css({left: '10px'});
              iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 96px !important;'});
              iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
              var iwCloseBtn = iwOuter.next();
              iwCloseBtn.css({opacity: '1', right: '1px', top: '1px', border: '7px solid #48b5e9', 'border-radius': '23px', 'box-shadow': '0 0 5px #3990B9'});

              if($('.iw-content').height() < 140){
                $('.iw-bottom-gradient').css({display: 'none'});
              } 

              iwCloseBtn.mouseout(function(){
                $(this).css({opacity: '1'});
              });
            });

          bounds.extend(latLng);

        }
        var historicPath = new google.maps.Polyline({
          path: pathCoordinates,
          strokeColor: '#0000FF',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });

        historicPath.setMap($scope.map);
        $scope.map.fitBounds(bounds);
      } else {
        if (status==200) {
          var alertPopup = $ionicPopup.alert({
              title: msg_tracking_last_hours,
              template: msg_error_no_tracking
          });          
        } else {  // vengo de un push
          //$state.go('login');   
        }

      }
      })
      .error(function(data, status, headers,config){
         //$state.go('login');  
      });
  };

  var titulo = "";
  if (localStorage.getItem("mapmode") == MAP_MODE.push) { 
    titulo = localStorage.getItem("notificationSelectedVehicleLicense");
  } 
  else if (localStorage.getItem("mapmode") == MAP_MODE.notification) { 
    titulo = localStorage.getItem("notificationSelectedVehicleLicense") + " - " + localStorage.getItem("notificationSelectedName");
  } 
  else if (localStorage.getItem("mapmode") == MAP_MODE.device) { 
    titulo = localStorage.getItem("vehicleSelected");
  }  
  else if (localStorage.getItem("mapmode") == MAP_MODE.report) { 
    titulo = localStorage.getItem("vehicleSelected");
  }  
  else { 
    titulo = localStorage.getItem("vehicleLicense");
  }  

  $scope.titulo_mapa = titulo;  

  //var options = {timeout: 10000, enableHighAccuracy: true};
  //$cordovaGeolocation.getCurrentPosition(options).then(function(position){

    $scope.$on('$destroy', function () {
      $scope.map = null;
    });

    /*
    $scope.$on('$ionicView.loaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.loaded', viewInfo, state);
    });
    $scope.$on('$ionicView.unloaded', function (viewInfo, state) {
        console.log('CTRL - $ionicView.unloaded', viewInfo, state);
    });*/

$timeout(function () {
      //console.log('timeout');
      google.maps.event.trigger($scope.map,'resize');     
}, 100);

$timeout(function () {
      //console.log('timeout2');
      drawMapElements($scope, $rootScope, $timeout, $compile, $http, $state, $ionicPopup, URL, MAP_MODE, APP); 
}, 150);

    var latLng = new google.maps.LatLng(40.416897, -3.703442);
      
    if ($scope.map ==null) {
      var mapOptions = {
        center: latLng,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    } 
 
      $scope.map.setCenter(latLng);
      $scope.map.setZoom(5);

    // Cuando el mapa esta cargado, pintar el vehiculo 
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
     

        //drawMapElements($scope, $rootScope, $timeout, $compile, $http, $state, $ionicPopup, URL, MAP_MODE, APP);

    });



})
