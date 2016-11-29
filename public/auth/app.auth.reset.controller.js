(function() {
  'use strict';
    angular.module('app.auth')
    .controller('resetController', resetController);

    resetController.$inject = ['AuthService'];

    function resetController(AuthService) {
      var vm = this;
      vm.reset = reset;
      /*
      dodac metode reset() do vm,
      dodać meteode resetPassword() do usługi
      + backend
      */
      function reset() {
        vm.error = false;
        AuthService.resetPassword(vm.resetForm.email)
          .then(function(data) {
            console.log(data);

          })
          .catch(function(err) {
            vm.error = true;
            vm.errorMessage = err;
          })
      }
    }

}());
