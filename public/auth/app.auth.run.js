(function() {
  'use strict';
  angular.module('app.auth')
  .run(run);

  /* @ngInject */

  run.$inject = ['$rootScope', '$location', '$route', 'AuthService'];

  function run ($rootScope, $location, $route, AuthService) {
    console.log('run auth module');
    /*
    The $routeChangeStart event fires before the actual route change occurs.
    So, whenever a route is accessed, before the view is served,
     we ensure that the user is logged in.
    */
      $rootScope.$on('$routeChangeStart',
      function (event, next, current) {
        AuthService.getUserStatus()
        .then(function () {
          //if (AuthService.isLoggedIn() === false) {
          if (next.access.restricted && !AuthService.isLoggedIn()) {
          // if (!AuthService.isLoggedIn()) {
            $location.path('/login');
            $route.reload();
          }
        });

      })
  }
}());
