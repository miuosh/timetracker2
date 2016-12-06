
(function(){
  'use strict';

  angular.module('app.layout')
  .controller('ProfilesController', ProfilesController);

  /* @ngInject */
  ProfilesController.$inject = ['$scope', '$mdDialog', 'dataservice'];
  function ProfilesController($scope, $mdDialog, dataservice) {
    var vm = this;
    vm.name = "ProfilesController";
    vm.profiles = {};
    vm.loadProfiles = loadProfiles;
    vm.removeProfile = removeProfile;

    // Dialog
    $scope.status = '';
    $scope.showCustomDialog = showCustomDialog;

    // initialize events and load data
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

    function showCustomDialog(ev) {
      $mdDialog.show({
        controller: DialogController,
        controllerAs: 'dc',
        templateUrl: '/layout.home/new-profile.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false
      })
      .then(function(answer) {
        console.log('Dialog - OK.')
      }, function() {
        console.log('Cancel dialog.')
      })
    }

    //-------------------------------------------------
    //  DialogController
    //-------------------------------------------------

    function DialogController($scope, $mdDialog, dataservice) {

      var self = this;
      self.hide = hide;
      self.cancel = cancel;
      self.answer = answer;
      // form
      self.newProfile = {};
      self.addProject = addProject;
      self.addCategory = addCategory;
      self.saveProfile = saveProfile;


      ////////////////////////////////////////////////////////////////////////////////
      function hide() {
        $mdDialog.hide();
      }

      function cancel() {
        $mdDialog.cancel();
      }

      function answer(answer) {
        $mdDialog.hide(answer);
      }

      function addProject() {
        if (angular.isUndefined(self.newProfile.projects)) {
          self.newProfile.projects = [];
        }
        self.newProfile.projects.unshift("");
      }

      function addCategory() {
        if(angular.isUndefined(self.newProfile.categories)) {
          self.newProfile.categories = [];
        }
        self.newProfile.categories.unshift("");
      }

      function saveProfile(profile) {
        return dataservice.addProfile(profile)
                .then(function(data) {
                  vm.loadProfiles();
                  if(data.status === 400) {
                    self.errmsg = "Profil o podanej nazwie już istnieje!";
                  } else {
                    self.hide();
                  }

                  return data;
                })

      }

    }// $DialogController

  }// #ProfilesController

})();
