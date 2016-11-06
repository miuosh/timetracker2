(function(){
  'user strict';

  angular.module('app.core')
  .factory('dataservice', dataservice);

  /* @ngInject */

  function dataservice($http) {
    return {
      getTasks: getTasks
    };

    function getTasks() {
      return $http.get('tasks/tasks')
                    .then(getTasksComplete)
                    .catch(getTasksFailed);

            function getTasksComplete(response) {
              return response.data.result;
            }
            
            function getTasksFailed(err) {
              console.log('Error load Tasks data: ' + err);
            }
    }

  }


})();
