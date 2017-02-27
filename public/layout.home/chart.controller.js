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

      vm.toDate = new Date();
      //vm.fromDate = vm.toDate - (24 * 3600 * 30 * 1000);
      vm.fromDate = new Date(vm.toDate.getFullYear(), vm.toDate.getMonth(), vm.toDate.getDate() - 30, 0, 0, 0, 0);
      //completed tasks
      vm.completed = false;


      console.log('Init ChartController...');
      getData();

      function getData(to, from) {
        console.log('Pobieranie danych...')
        // var to = new Date().getTime();
        // var from = to - (24 * 3600 * 30 * 1000);

        return dataservice.getCompletedTasksBetweenDate(vm.fromDate.getTime(), vm.toDate.getTime(), vm.completed)
          .then(function(data) {
            console.log('Pobrano dane.');
            console.log(data);
            prepareCategoryDataset(data);
            prepareProjectDataset(data);
            vm.summaryTime = sumByProperty(data, 'duration');
            vm.projectData.count = countProjects(data);
            vm.categoryData.count = countCategories(data);
            console.log( vm.projectData);
            console.log( vm.categoryData);

          })
      }



      function prepareCategoryDataset(data) {
       var result = getCategoryReducedObject(data);
       console.log(result);
       vm.categoryData = prepareChartData(result);
       console.log(vm.categoryData);
       vm.categoryData.options = {
         responsive : true,
         title : {
           display : true,
           text: 'Kategorie [%]',
           position: 'top'
         },
         legend: {
             display: true,
             labels: {
                 fontColor: 'rgb(255, 99, 132)'
             },
             position: 'bottom',
             fullWidth : true,
             reverse: true
         }
       }
     }//#

      function prepareProjectDataset(data) {
        var result = getProjectReducedObject(data);
        console.log(result);
        vm.projectData = prepareChartData(result);
        vm.projectData.options = {
          responsive: true,
          title : {
            display : true,
            text: 'Projekty [%]',
            position: 'top'
          },
          legend: {
              display: true,
              labels: {
                  fontColor: 'rgb(255, 99, 132)'
              },
              position: 'bottom'
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
        console.log('Prepare chart data..');
        var summaryDuration = 0;
        for(var key in result) {
          summaryDuration += result[key];
        }

        var chartData = {
          labels         : [],
          data           : [],
          dataOverride: [],
          rawData: []
        }

        for(var key in result) {
          chartData.labels.push(key);
          let percent = Math.round((result[key] / summaryDuration) * 100.0, 1 )
          chartData.data.push(percent);
          chartData.dataOverride.push(result[key]);
        }
        chartData.rawData = result;
        console.log(chartData);
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

      function countProjects(tasks) {
        var result = tasks.reduce(function(prev, curr) {
          prev[curr.project] = (prev[curr.project] || 0) + 1
          return prev;
        }, {});

        return result;
      }

      function countCategories(tasks) {
        var result = tasks.reduce(function(prev, curr) {
          prev[curr.category] = (prev[curr.category] || 0) + 1
          return prev;
        }, {});

        return result;
      }

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
