(function(){
  'use strict';

  angular.module('app.layout')
  .controller('AutocompleteController', AutocompleteController);

  /* @ngInject */
  AutocompleteController.$inject = ['$scope', '$log'];

  function AutocompleteController($scope, $log) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.querySearch = querySearch;


////////////////////////////////////////////////////////////////////////////////
    // my test data
    self.profile = {
        "name": "profil1",
        "projects": ["TelWin", "TelNOM"],
        "categories": ["Instalacja", "Konfiguracja", "Poprawka", "Testy"]
      };

    self.categories =  ["Instalacja", "Konfiguracja", "Poprawka", "Testy"];
    self.selectedItem = "";
    self.typedItem = "";


/////////////////////////////////////////////////////////////////////////////////
    // init value
    console.log('Init autocompleteController');
    initEvents();
    console.log(self.states);

///////////////////////////////////////////////////////////////////
    function initEvents() {
      $scope.$on('$destroy', function() {
        console.log('autocompleteController scope destroyed.');
      });
    }


    // ******************************
        // Internal methods
        // ******************************

    function getMatches(item) {
      return console.log(item);
    }

  }// #autocompleteController
})();
