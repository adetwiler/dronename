'use strict';

angular.module('droneNameApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.drones = [];
    $scope.master = {};

    $http.get('/api/drones').success(function(drones) {
      $scope.drones = drones;
      console.log(drones)
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
        var $statusDiv = $('[data-id="statusDiv"]');
        $('[data-dismiss="alert"]').on('click', function() {
          $statusDiv.slideUp();
        });
        $statusDiv.slideUp().slideDown();

        $http.post('/api/drones', { nickname: drone.nickname, name: drone.name })
          .success(function(data, status, headers, config) {
            $statusDiv.removeClass('alert-success alert-danger').addClass('alert-success');

            if (status == 201) {
              var found = false;
              angular.forEach($scope.drones, function(currentDrone, index) {
                if (currentDrone.name == drone.name) {
                  found = true;
                }
              });

              if (!found) {
                $('[data-id="message"]').html('Thanks for your feedback! \'<strong>'+drone.name+'</strong>\' has been added to the list.');
              } else {
                $('[data-id="message"]').html('Thanks for your feedback! \'<strong>'+drone.name+'</strong>\' has been registered as a vote.');
              }
            }
          })
          .error(function(data, status, headers, config) {
            $statusDiv.removeClass('alert-success alert-danger').addClass('alert-danger');
            $('[data-id="message"]').html('You have already voted for <strong>\''+drone.name+'</strong>\'.');
          });
        $scope.newDrone = '';
        $scope.form.$setPristine();
      }

    };

    $scope.vote = function(drone) {
      drone.nickname = 'Anonymous';
      this.submitForm(true, drone);
    };

    $scope.reset();

  });
