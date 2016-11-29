(function(){
  'use strict';

  angular.module('app.layout')
  .controller('layoutController', layoutController);

  /* @ngInject */
  layoutController.$inject = ['$scope'];

  function layoutController($scope) {
    var vm = this;
    vm.name = "layoutController";

    // init value
    vm.subPage = '/layout.home/dashboard.html';

    console.log('Init layoutController');

    initEvents();
///////////////////////////////////////////////////////////////////
    function initEvents() {
      $scope.$on('$destroy', function() {
        //vm.stopTimer();
        console.log('layoutController scope destroyed.');
      })
    }

  }// #layoutController




})();
