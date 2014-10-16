'use strict';

angular.module('droneNameApp')
  .service('scroll', function ($location, $anchorScroll) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
    };
  });
