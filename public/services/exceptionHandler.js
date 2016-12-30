(function(){
  'user strict';

  angular.module('app.core')
  .constant('dataUrl', {
    'url' : '/tasks/'
  })
  .factory('$exceptionHandler', exceptionHandler);

  /* @ngInject */
  exceptionHandler.$inject = ['$injector'];

  function exceptionHandler($http, dataUrl) {
    return function (exception, cause) {
      // var $rootScope = $rootScope.errors || [];
      // $rootScope.errors.push(exception.message);
      console.error('Exception:\n'+ exception.message + ' \nCause: ' + cause);
      console.info(exception);


///////////////////////////////////



  } //#dataservice
})();
