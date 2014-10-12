'use strict';

angular.module('droneNameApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.drones = [];
    $scope.master = {};

    $http.get('/api/drones').success(function(drones) {
      $scope.drones = drones;
      socket.syncUpdates('drone', $scope.drones, function(event, drone, drones) {

        angular.forEach(drones, function(currentDrone, index) {
          if (currentDrone.name == drone.name) {
            if (currentDrone.$$hashKey != drone.$$hashKey) {
              $scope.drones.splice(index, 1);
            }
          }
        });

        drones.sort(function(a, b) {
          a = a.name;
          b = b.name;
          return a<b ? -1 : a>b ? 1 : 0;
        });
      });
    });

    $scope.reset = function() {
      $scope.drone = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(drone) {
      return angular.equals(drone, $scope.drones);
    };

    $scope.submitForm = function(isValid, drone) {
      $scope.master = angular.copy(drone);

      // check to make sure the form is completely valid
      if (isValid) {
        $http.post('/api/drones', { nickname: drone.nickname, name: drone.name });
        $scope.newDrone = '';
        $scope.form.$setPristine();
      }

    };

    $scope.reset();

  });