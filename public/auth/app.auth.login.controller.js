(function() {
  'use strict';
    angular.module('app.auth')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthService'];
    /* @ngInject */

    function LoginController ($location, AuthService) {
      var vm = this;
      vm.login = login;
      vm.getUsername = getUsername;
      vm.username = null;

      ///////////////////////////////

      function login() {
        vm.error = false;
        vm.disabled = true;

        // service.login return promise
        AuthService.login(vm.loginForm.username, vm.loginForm.password)
          // handle success
          .then(function () {
            $location.path('/');
            vm.disabled = false;
            vm.loginForm = {};
            getUsername();
          })
          // handle error
          .catch(function (err) {
            vm.error = true;
            vm.errorMessage = "Invalid username and/or password";
            vm.disabled = false;
            vm.loginForm = {};
          });
      }

      function getUsername(){
         AuthService.getUsername()
                .then(function(data) {
                  vm.username = data;
                  console.log(data);
                  return data;
                })
      }

    }
})();
