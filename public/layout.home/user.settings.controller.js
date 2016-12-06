
(function(){
  'use strict';

  angular.module('app.layout')
  .controller('UserSettingsController', UserSettingsController);

  /* @ngInject */
  UserSettingsController.$inject = ['$scope', 'dataservice'];

  function UserSettingsController($scope, dataservice) {
    var vm = this;
    vm.name = "UserSettingsController";

    vm.profile = null;
    vm.selectedProfile = null;

    // all profiles
    vm.profiles = {};
    vm.loadProfiles = loadProfiles;
    vm.getProfile = getProfile; // by name

    // user settings
    vm.user = {};
    vm.loadUserSettings = loadUserSettings;
    vm.saveUserSettings = saveUserSettings;

    loadUserSettings()

    function loadUserSettings() {
      return dataservice.getUserSettings()
              .then(function(data) {
                  vm.user.config = data;
                  return data;
              })
              .then(function(data) {
                 getProfile(vm.user.config.profile);
              })
    }; // #loadUserSettings

    function getProfile(name) {
      return dataservice.getProfile(name)
              .then(function(data) {
                vm.selectedProfile = data[0];
                console.log(vm.selectedProfile);
              })
    }

    function loadProfiles() {
      return dataservice.getProfiles()
              .then(function(data) {
                vm.profiles = data;
                console.log(data);
              })
              .then(function(data){

              });
    }// #loadProfiles

   function saveUserSettings() {
     var config = {
       profile : vm.selectedProfile
     }
     return dataservice.saveUserSettings(config)
            .then(function(data) {
              console.log('saveUserSettings..');
              console.log(data);
              loadUserSettings();
            })
  }// #saveUserSettings

  }// #UserSettingsController
})();
