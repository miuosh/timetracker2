(function(){
  'use strict';

  angular.module('app.layout')
  .controller('LayoutController', LayoutController);

  /* @ngInject */
  LayoutController.$inject = ['$scope'];

  function LayoutController($scope) {
    var vm = this;
    vm.name = "LayoutController";

    // init value
    vm.subPage = '/layout.home/dashboard.html';

    console.log('Init LayoutController');

    initEvents();
///////////////////////////////////////////////////////////////////
    function initEvents() {
      $scope.$on('$destroy', function() {
        //vm.stopTimer();
        console.log('LayoutController scope destroyed.');
      });
    }

  }// #layoutController




})();
