/* IIFE - Immediately Invoked Function Expression
 without IIFE i.e. function SideNavController() is defined as global variable
*/
(function(){
  'use strict'; // ECMAScript version 5

  angular.module('app.layout')
  .controller('SideNavController', SideNavController);

  /* @ngInject */
  SideNavController.$inject = ['AuthService'];
  function SideNavController(AuthService) {
    var vm = this;
    vm.name = "SideNavController";
    vm.username = getUsername;

    function getUsername() {
      return AuthService.getUsername()
              .then(function(data) {
                vm.username = data;
              })
    }


  }// #SideNavController
})();
