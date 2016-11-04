
(function(){
  'use strict';
  angular.module('app')
  .run(runBlock);

  //runBlock.$inject([]) // i.e. 'authenticator', 'translator'
  /*
  runBlock(authenticator, translator) {
    authenticator.initialize();
    translator.initialize();
  }
  */
  function runBlock() {
    console.log('run app');
  }


})();
