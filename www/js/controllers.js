

angular.module('main.controllers', [])
/*.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('login');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

console.log("-->");
   $scope.data = {};
  $scope.data.bgColors = [];
  $scope.data.currentPage = 0;

  for (var i = 0; i < 10; i++) {
    $scope.data.bgColors.push("bgColor_" + i);
  }

  var setupSlider = function() {
    //some options to pass to our slider
    $scope.data.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300 //0.3s transition
    };

    //create delegate reference to link with slider
    $scope.data.sliderDelegate = null;

    //watch our sliderDelegate reference, and use it when it becomes available
    $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
      if (newVal != null) {
        $scope.data.sliderDelegate.on('slideChangeEnd', function() {
          $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
          //use $scope.$apply() to refresh any content external to the slider
          $scope.$apply();
        });
      }
    });
  };

  setupSlider();

});
*/

.controller('TestCtrl', function($scope, $rootScope, $compile, $http, $state, $ionicPopup, $cordovaGeolocation) {

  //var options = {timeout: 10000, enableHighAccuracy: true};
  //$cordovaGeolocation.getCurrentPosition(options).then(function(position){    


    var latLng = new google.maps.LatLng(41, -3);
      var mapOptions = {
        center: latLng,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    
  //  if ( $rootScope.map == null) {

    $rootScope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log("Mapa creado");
//}
//google.maps.event.trigger(map, "resize");

    //} else {
     // console.log("reattachMap");
     // var div = document.getElementById("map");
     //reattachMap($rootScope.map,div);
    //}
    


    // Cuando el mapa esta cargado  , pintar el vehiculo 
    google.maps.event.addListenerOnce($rootScope.map, 'idle', function(){

      console.log("Mapa preparado");

      $rootScope.map.setCenter(latLng);
      $rootScope.map.setZoom(15);
      
      var marker = new google.maps.Marker({
          map: $rootScope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });   
      var infoWindow = new google.maps.InfoWindow({
          content: "Estoy aqui2"
      });
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($rootScope.map, marker);
      });


    });


//});
       



})

