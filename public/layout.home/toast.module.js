(function(){
  'use strict'; // ECMAScript version 5

  angular.module('toast', ['ngMaterial'])
  .controller('toastController', toastController);

  toastController.$inject = [];

  function toastController($scope, $mdToast ) {
    var vm = this;
    vm.showSimple = showSimple;



////////////////////////////////////////
    function showSimple(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .hideDelay(3000)
      );
    }; //#showSimple


  }; //#toastController
})();
