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

      vm.groupedProjects = {};

      vm.groupedDatasetByCategory = [];

      var initDatasetByCategory = initDatasetByCategory; // group tasks by project and then each project by category
//-----------------------------------------------------------------------------------
      console.log('Init ChartController...');
      init()

//-----------------------------------------------------------------------------------
      function init() {
        var now = new Date();
        vm.fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 23, 59, 59, 0);
        vm.toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0, 0);
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
            prepareCategoryDataset(data);
            prepareProjectDataset(data);
            vm.summaryTime = sumByProperty(data, 'duration');
            vm.projectData.count = countProjects(data);
            vm.categoryData.count = countCategories(data);
            console.log( vm.projectData);
            console.log( vm.categoryData);

            /* reduce to single object with key (name) = <name of project>
            and value => array of tasks with the same project name
            */
            initDatasetByCategory(data);
          })
      }

      function initDatasetByCategory(data) {
        vm.groupedProjects = {};
        vm.groupedDatasetByCategory = [];

        vm.groupedProjects = groupBy(data, 'project');
        console.log(vm.groupedProjects);
        console.log('--------------- Chart dataset ------------------');

        for (var key in vm.groupedProjects) {
          console.log('----------------- ' + key + '------------------');
          var dataset = getCategoryDataset(vm.groupedProjects[key]);

          vm.groupedDatasetByCategory.push({
            chartDataset : dataset,
            project : key
          })
        }
        console.log('---- groupedDatasetByCategory ----');
        console.log(vm.groupedDatasetByCategory);
      }//#initDatasetByCategory

      function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

      function getCategoryDataset(tasks) {
        var result = getCategoryReducedObject(tasks); //group by category
        var categoryDataset = prepareChartData(result); //
        categoryDataset.options = {
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
        return categoryDataset;
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

      /*
      Convert function argument - object - pair <key> : <value> to chart data.
      label -> array of <keys>
      rawData -> array of coresponding <values>
      data -> % values of rawData
      */
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
        chartData.summaryDuration = summaryDuration;
        return chartData;
      }//#prepareChartData


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
