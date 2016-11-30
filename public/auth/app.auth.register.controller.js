(function() {
  'use strict';
    angular.module('app.auth')
    .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', 'AuthService'];

    function RegisterController($location, AuthService) {
      var vm = this;
      vm.error = false;
      vm.disabled = true;
      vm.register = register;

      /////////////////////////////
      function register() {
        vm.error = false;
        vm.disabled = true;
          console.log('registering...');

        AuthService.register(
           vm.registerForm.username,
           vm.registerForm.password,
           vm.registerForm.email)
          .then(function() {
            $location.path('/login');
            vm.disabled = false;
            vm.registerForm = {};
          })
          .catch(function(error) {
            vm.error = true;
            vm.errorMessage = error.err.message;
            vm.disabled = false;
            vm.registerForm = {};
          });
      }
    }
})();
