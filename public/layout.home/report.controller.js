(function() {
  'use strict';
    angular.module('app.layout')
    .controller('ReportController', ReportController)

    ReportController.$inject = ['$scope', 'dataservice']

    function ReportController($scope, dataservice) {
      console.log('Init ReportController...');
      var vm = this;
      vm.toDate = new Date();
      //vm.fromDate = vm.toDate - (24 * 3600 * 30 * 1000);
      vm.fromDate = new Date(vm.toDate.getFullYear(), vm.toDate.getMonth(), vm.toDate.getDate() - 30, 0, 0, 0, 0);
      //completed tasks
      vm.completed = true;

      vm.groupedProjects = {};
      vm.getData = getData;
      $scope.sumValue = sumValue;

      init();

      function init() {
        var now = new Date();

        vm.fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        vm.toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 0);
        getData();
      }

      function getData(to, from) {
        console.log('Pobieranie danych...')
        // var to = new Date().getTime();
        // var from = to - (24 * 3600 * 30 * 1000);

        return dataservice.getCompletedTasksBetweenDate(vm.fromDate.getTime(), vm.toDate.getTime(), vm.completed)
          .then(function(data) {
            console.log('Pobrano dane.');
            console.log(data);
            vm.groupedProjects = groupBy(data, 'project');
            console.log(vm.groupedProjects);
          })
      }

      function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
    };

    function sumValue(value) {
      var sum = 0;
      var property = 'duration';
      if (value.length === 0) return sum;
      return value.reduce(function(previous, current) {
          return current[property] === (null || undefined) ? previous : previous + parseFloat(current[property]);
      }, 0)
    }


    }//#ReportController
}());
