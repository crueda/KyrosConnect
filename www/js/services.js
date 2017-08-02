angular.module('main.services', ['ionic'])

.factory('DevicesDataService', function($q, $timeout) {

    var searchDevices = function(searchFilter) {         
      //console.log('Searching devices for ' + searchFilter);

      var deferred = $q.defer();

      var matches = devices.filter( function(device) {
        if(device.vehicle_license.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1 ) return true;
      })

      $timeout( function(){        
        deferred.resolve( matches );
      }, 100);

      return deferred.promise;
    };

    return {
        searchDevices : searchDevices
    }
})


.factory('LoginService', function($q) {

  return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name == 'a' && pw == 'a') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.factory('ClockSrv', function($interval){
  var clock = null;
  var service = {
    startClock: function(fn){
      if(clock === null){
        clock = $interval(fn, 10000);
      }
    },
    stopClock: function(){
      if(clock !== null){
        $interval.cancel(clock);
        clock = null;
      }
    }
  };

  return service;
})

.factory('Notifications', function() {

  return {
    all: function() {
      return notifications;
    },
    remove: function(notifications) {
      notifications.splice(notifications.indexOf(notification), 1);
    },
    get: function(notificationId) {
      for (var i = 0; i < notifications.length; i++) {
        if (notifications[i].id === parseInt(notificationId)) {
          return notifications[i];
        }
      }
      return null;
    }
  };
});





