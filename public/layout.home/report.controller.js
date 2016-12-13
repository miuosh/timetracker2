/* IIFE - Immediately Invoked Function Expression
 without IIFE i.e. function SideNavController() is defined as global variable
*/
(function(){
  'use strict';

  angular.module('app.layout')
  .controller('ReportController', ReportController);

  /* @ngInject */
  ReportController.$inject = ['$scope', '$mdDialog', 'dataservice'];
  function ReportController($scope, $mdDialog, dataservice) {
    var vm = this;
    vm.name = "ReportController";
    vm.tasks = {};

    vm.getTasks = getTasks;
    vm.editTask = editTask;

    // filter table
    $scope.sortType = 'updated';
    $scope.sortReverse = true;
    $scope.searchType = '';

    init();

    //////////////////////////////////

    function init() {
      getTasks();
    }

    function getTasks() {
      return dataservice.getTasks()
        .then(function(data) {
          vm.tasks = data;
          return data;
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    function editTask(ev, item) {
      $mdDialog.show({
        locals: {
          task: item
        },
        controller: EditTaskDialogController,
        controllerAs: 'edc',
        templateUrl: '/layout.home/edit.completed.task.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: true
      })
      .then(function(answer) {
        console.log('Dialog OK: ' + answer);
      }, function(){
        console.log('Cancel dialog.')
      })
    }// #editTask


    //-------------------------------------------------
    //  EditTaskDialogController - edit Task
    //-------------------------------------------------

    function EditTaskDialogController ($scope, $mdDialog, dataservice, task) {
      var self = this;
      self.hide = hide;
      self.cancel = cancel;
      self.answer = answer;

      //form
      self.task = task || {};
      self.save = save;

      //////////////////////////////////////////////////////////////////////
      function hide() {
        $mdDialog.hide();
      }

      function cancel() {
        $mdDialog.cancel();
        vm.getTasks();//from parent controller
      }

      function answer(answer) {
        $mdDialog.hide(answer);
      }

      function save(item) {
        console.log('EditDialogController:  save task clicked');
        return dataservice.editTask(item)
                .then(function(data) {
                  self.hide();
                  return data;
                })
                .then(function(data) {
                  vm.getTasks(); //from parent controller
                })
      }

    }// #EditDialogController


  }// #ReportController

})();
