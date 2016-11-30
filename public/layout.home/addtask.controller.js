(function(){
  'use strict';

  angular.module('app.layout')
  .controller('AddTaskController', AddTaskController);

  AddTaskController.$inject = ['$scope', '$log', 'dataservice'];

  function AddTaskController($scope, $log, dataservice) {
    var vm = this;
    //vm.projects = loadProjects();
  //  vm.categories = loadCategories();
    vm.newTask = {};
    vm.addTask = addTask;
    $scope.newTaskForm = {};

    //
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange   = searchTextChange;
    vm.newState = newState;

    function init() {
      console.log('Init addTaskCtrl');
    }

    function loadCategories(){
      return dataservice.getCategories()
              .then(function(data) {
                //console.log('kategorie: ' + typeof data)
                  var cat = 'Instalacja, Konfiguracja, Poprawka, Konsultacja';
                  return cat.split(/, +/g).map( function (state) {
                    return {
                      value: state.toLowerCase(),
                      display: state
                    };
                  });

              });
    }

    function loadProjects(){
      return dataservice.getProjects()
              .then(function(data) {
                if (data.status === 200) {

                  return data.split(/, +/g).map( function (state) {
                    return {
                      value: state.toLowerCase(),
                      display: state
                    };
                  });
                } else {
                  console.log('Błąd przy pobieraniu listy projektow');
                  //.log(data.message);
                }
              });
    }


    function addTask(task) {
      return dataservice.addTask(task)
              .then(function(data) {
                  // pass data to DashboardController through event
                  $scope.$emit('addNewTask', data);
                  return data;
                })
              .then(function(data) {
                //clear new task fields
                vm.newTask = angular.copy({});
                //$scope.newTaskForm.$setPristine();
                //$scope.newTaskForm.$setUntouched();
              });
    }

    function searchTextChange(text) {

      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    function newState(state) {
      alert("Dodaj nową kategorie");
      console.log('newState: ' + state);
      console.log(self.states);
      self.states.push({
        value: state.toLowerCase(),
        display: state
      });
    }

    /**
     * Search for... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query, data) {
      var results = query ? data.filter( createFilterFor(query, data) ) : self.states,
          deferred;
      if (data.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    /**
     * Create filter function for a query string
     */
     function createFilterFor(query, data) {
       var lowercaseQuery = angular.lowercase(query);
      console.log('state1:' + data);
      console.log('query:' + data);
        return function filterFn(data) {
          console.log('state2:' + data);
          return (data.value.indexOf(lowercaseQuery) === 0);
        };

      }

  }// #AddTaskController
})();
