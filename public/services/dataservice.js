(function(){
  'user strict';

  angular.module('app.core')
  .constant('dataUrl', {
    'url' : 'tasks/tasks/'
  })
  .factory('dataservice', dataservice);

  /* @ngInject */
//  dataservice.$inject = ['$http', 'dataUrl'];

  function dataservice($http, dataUrl) {
    return {
      getTasks: getTasks,
      getTask: getTask
    };


///////////////////////////////////

    function getTasksComplete(response) {
      return response.data.result;
    }

    function getTasksFailed(err) {
      console.log('Error load Tasks data: ');
      console.log(err);
    }

    function getTasks() {
      return $http.get(dataUrl.url)
                    .then(getTasksComplete)
                    .catch(getTasksFailed);
    }

    function getTask(id) {
      return $http.get(dataUrl.url + ':' + id)
                    .then(getTasksComplete)
                    .catch(getTasksFailed);
    }


  } //#dataservice
})();
