(function() {
  'use strict';
  angular.module('app.auth')
  .controller('LogoutController', LogoutController);

  /* @ngInject */
  LogoutController.$inject = ['$location', 'AuthService'];

  function LogoutController($location, AuthService) {
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
})();
