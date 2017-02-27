(function(){
  'user strict';

  angular.module('app.core')
  .constant('dataUrl', {
    'url' : '/tasks/'
  })
  .constant('profileUrl', {
    'url' : '/profiles/'
  })
  .constant('userUrl', {
    'url': '/users/'
  })
  .constant('reportsUrl', {
    'url' : '/reports/'
  })

  .factory('dataservice', dataservice);

  /* @ngInject */
//  dataservice.$inject = ['$http', 'dataUrl'];

  function dataservice($http, dataUrl, profileUrl, userUrl, reportsUrl) {
    return {
      getTasks                    : getTasks,
      getTask                     : getTask,
      addTask                     : addTask,
      removeTasks                 : removeTasks,
      toggleTask                  : toggleTask,
      getCategories               : getCategories,
      getProjects                 : getProjects,
      setAsCompleted              : setAsCompleted,
      editTask                    : editTask,
      editTaskHistoryItem         : editTaskHistoryItem, // POST timespan object
      removeTaskHistoryItem       : removeTaskHistoryItem, //remove timespan of given ID
      getTasksByDate              : getTasksByDate,
      /* Task profiles */
      getProfiles                 : getProfiles,
      getProfile                  : getProfile, // by name
      addProfile                  : addProfile,
      editProfile                 : editProfile,
      removeProfile               : removeProfile,
      /* User settings */
      saveUserSettings            : saveUserSettings,
      getUserSettings             : getUserSettings,

      /* dayView */

      /* Reports data */
      getCompletedTasksBetweenDate: getCompletedTasksBetweenDate

    };


///////////////////////////////////

    function successCallback(response) {
      //console.log(response.data);
        return response.data;
    }

    function errorCallback(err) {
      console.log('Error: ');
      console.log(err);
      return err;
    }

    function getTasks() {
      return $http.get(dataUrl.url)
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function getTask(id) {
      return $http.get(dataUrl.url + id)
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function addTask(task) {
      return $http.post(dataUrl.url, task, { headers: {'Content-Type': 'application/json' }})
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function removeTasks(ids) {
      return $http.post(dataUrl.url + 'remove', JSON.stringify(ids), { headers:  {'Content-Type': 'application/json' }})
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function toggleTask(id) {
      return $http.post(dataUrl.url + 'toggle/' + id)
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function getCategories() {
      return $http.get( '/addtask/categories/')
                    .then(successCallback)
                    .catch(errorCallback);
    }


    function getProjects() {
          return $http.get('/addtask/projects/')
                        .then(successCallback)
                        .catch(errorCallback);
    }

    function setAsCompleted(item) {
          return $http.post('/edittask/setAsCompleted/', item)
                        .then(successCallback)
                        .catch(errorCallback);
    }

    function editTask(item) {
      return $http.put('/edittask/edit', item, { headers: {'Content-Type': 'application/json' }})
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function editTaskHistoryItem(item) {
      return $http.post('/edit/history/' + item._id, item, { headers: {'Content-Type': 'application/json' }})
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function getTasksByDate(date) {
      return $http.get(dataUrl.url + '/dayView/' + date)
                    .then(successCallback)
                    .catch(errorCallback);
    }

    /* Task Profiles */

    function getProfiles() {
      return $http.get(profileUrl.url)
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function getProfile(name) {
      return $http.get(profileUrl.url + name)
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function addProfile(profile) {
      return $http.post(profileUrl.url, profile, { headers: {'Content-Type': 'application/json' }})
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function editProfile(profile) {
      return $http.put(profileUrl.url, profile, { headers: {'Content-Type': 'application/json' }})
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function removeProfile(id) {
      return $http.delete(profileUrl.url + id)
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function getUserSettings() {
      return $http.get(userUrl.url + '/settings/')
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function saveUserSettings(config) {
      console.log(config);
      return $http.post(userUrl.url + '/settings/', JSON.stringify(config), { headers: {'Content-Type': 'application/json' }})
                    .then(successCallback)
                    .catch(errorCallback);
    }

    function editTaskHistoryItem(item) {
      return $http.post(dataUrl.url + 'edit/history/', JSON.stringify(item), { headers: {'Content-Type': 'application/json' }})
                .then(successCallback)
                .catch(errorCallback);
    }

    function removeTaskHistoryItem(id) {
      return $http.delete(dataUrl.url + 'edit/history/' + id)
              .then(successCallback)
              .catch(errorCallback);
    }

      /* Reports data */

    function getCompletedTasksBetweenDate(from, to, completed) {
      return $http.get(reportsUrl.url + from + '-' + to + '?completed=' + completed)
                    .then(successCallback)
                    .catch(errorCallback);
    }

  } //#dataservice
})();
