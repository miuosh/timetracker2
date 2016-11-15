(function(){
  'use strict';

  angular.module('app.layout')
  .controller('layoutController', layoutController);

  /* @ngInject */

  function layoutController() {
    var lvm = this;
    lvm.name = "layoutController";

    // init value
    lvm.subPage = '/layout.home/dashboard.html';

  }


})();
