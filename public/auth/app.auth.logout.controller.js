(function() {
  'use strict';
  angular.module('app.auth')
  .controller('logoutController', logoutController);

  /* @ngInject */
  logoutController.$inject = ['$location', 'AuthService'];

  function logoutController($location, AuthService) {
    var vm = this;
    vm.logout = logout;
    vm.isLoggedIn = isLoggedIn;

    function logout() {
      AuthService.logout()
        .then(function() {
          $location.path('/login');
        });
    }

    function isLoggedIn() {
      return AuthService.isLoggedIn();
    }
  }
}());
