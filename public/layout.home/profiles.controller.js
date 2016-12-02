
(function(){
  'use strict';

  angular.module('app.layout')
  .controller('ProfilesController', ProfilesController);

  /* @ngInject */
  ProfilesController.$inject = ['$scope', 'dataservice'];
  function ProfilesController($scope, dataservice) {
    var vm = this;
    vm.name = "ProfilesController";
    vm.profiles = {};
    vm.newProfile = {};
    vm.addProject = addProject;
    vm.addCategory = addCategory;
    vm.saveProfile = saveProfile;
    vm.loadProfiles = loadProfiles;
    vm.removeProfile = removeProfile;

    init();

    //////////////////////////////////

    function init() {
      loadProfiles();
    }

    function loadProfiles() {
      return dataservice.getProfiles()
        .then(function(data) {
          vm.profiles = data;
          return data;
        })
        .catch(function(err) {
          console.error(err);
        });
    }

    function addProject() {
      if (angular.isUndefined(vm.newProfile.projects)) {
        vm.newProfile.projects = [];
      }
      vm.newProfile.projects.unshift("");
    }

    function addCategory() {
      if(angular.isUndefined(vm.newProfile.categories)) {
        vm.newProfile.categories = [];
      }
      vm.newProfile.categories.unshift("");
    }

    function saveProfile(profile) {
      return dataservice.addProfile(profile)
              .then(function(data) {
                vm.loadProfiles();
                return data;
              })
              .catch(function(err) {
                console.error(err);
              })
    }

    function removeProfile(id) {
      return dataservice.removeProfile(id)
              .then(function(data) {
                vm.loadProfiles();
                return data;
              })
              .catch(function(err){
                console.error(err);
              })
    }

    function editProfile(id, profile) {
      return dataservice.editProfile(id, profile)
                .then(function(data) {
                  vm.loadProfiles();
                  return data;
                })
                .catch(function(err) {
                  console.error(err);
                })
    }


  }// #ProfilesController

})();
