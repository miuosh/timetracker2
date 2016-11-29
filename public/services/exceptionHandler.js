(function(){
  'user strict';

  angular.module('app.core')
  .factory('$exceptionHandler', exceptionHandler);

  /* @ngInject */
  exceptionHandler.$inject = ['$log'];

  function exceptionHandler($log) {
    return function (exception, cause) {
      $log.error("Komunikat: " + exception.message);
      $log.error("Przyczyna: " + cause);
    };


///////////////////////////////////



  } //#exceptionHandler
})();
