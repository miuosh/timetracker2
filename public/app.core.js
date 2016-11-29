(function(){
  'use strict';

  angular.module('app.core', [
    /* AngularJS modules */
    'ngMaterial',
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    /* Cross-app modules */
    'app.auth',
    'toast'
    /* 3rd party modules */
  ]);
})();
