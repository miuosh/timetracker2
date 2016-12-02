(function(){
  'use strict';

  angular.module('app.layout')
  .controller('AutocompleteController', AutocompleteController);

  /* @ngInject */
  AutocompleteController.$inject = ['$scope', '$log', '$q', '$timeout'];

  function AutocompleteController($scope, $log, $q, $timeout) {
    var self = this;

     self.simulateQuery = false;
     self.isDisabled    = false;

     // list of `state` value/display objects
     self.states        = loadAll();
     self.querySearch   = querySearch;
     self.selectedItemChange = selectedItemChange;
     self.searchTextChange   = searchTextChange;
     self.searchText = '';
////////////////////////////////////////////////////////////////////////////////
    // my test data
    self.profile = {
        "name": "default",
        "projects": ["TelWin", "TelNOM"],
        "categories": ["Instalacja", "Konfiguracja", "Poprawka", "Testy"]
      };

    self.categories =  ["Instalacja", "Konfiguracja", "Poprawka", "Testy"];



/////////////////////////////////////////////////////////////////////////////////
    // init value
    console.log('Init autocompleteController');
    initEvents();


///////////////////////////////////////////////////////////////////
    function initEvents() {
      $scope.$on('$destroy', function() {
        console.log('autocompleteController scope destroyed.');
      });
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
      emit(text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      emit(item);

    }

    function emit(value) {
      $scope.$emit('categoryChanged', value);
    }

    // ******************************
        // Internal methods
        // ******************************
    function loadAll() {
      console.log('loadAll..');
      return self.categories;
    }

    function querySearch(query) {
        console.log('querySearch..');
        if (query) {
          var results = self.categories.filter(function(category) {
              return (category.toUpperCase().indexOf(query.toUpperCase()) !== -1)
            });
            console.log('Results: ' + results);
          return results;
        } else {
          return self.categories;
        }
      }

    function match(item){
      return self.categories.indexOf(item);
    }


  }// #autocompleteController
})();
