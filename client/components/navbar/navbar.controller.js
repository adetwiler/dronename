'use strict';

angular.module('droneNameApp')
  .controller('NavbarCtrl', function ($scope, $location, scroll) {
    $scope.menu = [{
      'title': 'Home',
      'link': 'wrapper'
    }, {
      'title': 'About Us',
      'link': 'about'
    }, {
      'title': 'View Entries',
      'link': 'entries'
    }];

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.scrollTo = scroll.scrollTo;

  });