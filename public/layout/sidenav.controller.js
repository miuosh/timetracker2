/* IIFE - Immediately Invoked Function Expression
 without IIFE i.e. function SideNavController() is defined as global variable
*/
(function(){
  'use strict'; // ECMAScript version 5

  angular.module('app.layout', [])
  .controller('SideNavController', SideNavController);

  /* @ngInject */
  function SideNavController() {
    var vm = this;
    vm.name = "SideNavController";
  }


})();
