(function() {
  'use strict';
    angular.module('app.layout')
    .controller('ChartController', ChartController);

    ChartController.$inject = ['$scope', 'dataservice'];

    function ChartController($scope, dataservice) {
      var vm = this;
      vm.getData = getData;

      $scope.labels = ["Konfiguracja", "Instalacja", "Poprawka"];
      $scope.data = [300, 500, 100];
      $scope.dataOverride = ['300sek', '500sek', '100sek'];


      console.log('Init ChartController...');


      function getData() {
        console.log('Pobieranie danych...')
        var to = new Date().getTime();
        var from = to - (24 * 3600 * 30 * 1000);
        return dataservice.getCompletedTasksBetweenDate(from, to)
          .then(function(data) {
            console.log(data);
          })
      }



    }// #ChartController
}());
