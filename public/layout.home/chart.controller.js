(function() {
  'use strict';
    angular.module('app.layout')
    .controller('ChartController', ChartController);

    ChartController.$inject = ['$scope', 'dataservice'];

    function ChartController($scope, dataservice) {
      var vm = this;
      vm.getData = getData;
      vm.summaryTime = 0;
      // data for chart
      vm.projectData = {};
      vm.categoryData = {};

      vm.toDate = new Date().getTime();
      vm.fromDate = vm.toDate - (24 * 3600 * 30 * 1000);

      console.log('Init ChartController...');
      getData();

      function getData() {
        console.log('Pobieranie danych...')
        //var to = new Date().getTime();
        //var from = to - (24 * 3600 * 30 * 1000);
        return dataservice.getCompletedTasksBetweenDate(vm.fromDate, vm.toDate)
          .then(function(data) {
            console.log('Pobrano dane.');
            console.log(data);
            prepareCategoryDataset(data);
            prepareProjectDataset(data);
            vm.summaryTime = sumByProperty(data, 'duration')
          })
      }



      function prepareCategoryDataset(data) {
       var result = getCategoryReducedObject(data);
       vm.categoryData = prepareChartData(result);
       vm.categoryData.options = {
         responsive : true,
         title : {
           display : false,
           text: 'Kategorie [%]',
           position: 'top'
         },
         legend: {
             display: true,
             labels: {
                 fontColor: 'rgb(255, 99, 132)'
             },
             position: 'right',
             fullWidth : true,
             reverse: true
         }
       }
       console.log(vm.categoryData);
     }//#

      function prepareProjectDataset(data) {
        var result = getProjectReducedObject(data);
        vm.projectData = prepareChartData(result);
        vm.projectData.options = {
          responsive: true,
          title : {
            display : false,
            text: 'Projekty [%]',
            position: 'top'
          },
          legend: {
              display: true,
              labels: {
                  fontColor: 'rgb(255, 99, 132)'
              },
              position: 'right'
          }
        }
      }//#

      function getCategoryReducedObject(tasks) {
        // result is object with { key: value }, value - summary duration by key
        var result = tasks.reduce(function(prev, curr) {
          prev[curr.category] = (prev[curr.category] || 0) + curr.duration
          return prev;
        }, {});

        return result;
      } //#

      function getProjectReducedObject(tasks) {
        var result = tasks.reduce(function(prev, curr) {
          prev[curr.project] = (prev[curr.project] || 0) + curr.duration
          return prev;
        }, {});

        return result;
      }//#


      function prepareChartData(result) {

        var summaryDuration = 0;
        for(var key in result) {
          summaryDuration += result[key];
        }

        var chartData = {
          labels         : [],
          data           : [],
          dataOverride: []
        }

        for(var key in result) {
          chartData.labels.push(key);
          let percent = Math.round((result[key] / summaryDuration) * 100.0, 1 )
          chartData.data.push(percent);
          chartData.dataOverride.push(result[key]);
        }
        return chartData;
      }//#prepareChartData


      // function groupBy(list, property) {
      //   var map = new Map();
      //   list.forEach(function(item) {
      //       const key = property;
      //       if(!map.has(key)) {
      //         map.set(key, [item[key]])
      //       } else {
      //         map.get(key).push(item[key])
      //       }
      //   })
      //   return map;
      // }
      //
      function sumByProperty(items, property) {
        if (items === 0) return 0;
        return items.reduce(function(previous, current) {
            return current[property] === (null || undefined) ? previous : previous + parseFloat(current[property]);
        }, 0)
      }


      function compareFn(a, b) {

      }

    }// #ChartController
}());
