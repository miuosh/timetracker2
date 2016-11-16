(function(){
  'use strict';

  angular.module('app.layout')
  .controller('layoutController', layoutController);

  /* @ngInject */

  function layoutController() {
    var vm = this;
    vm.name = "layoutController";

    // init value
    vm.subPage = '/layout.home/dashboard.html';

  }


})();
