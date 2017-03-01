
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
    $scope.addNewProfile = addNewProfile;
    $scope.editProfile = editProfile;

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



    function removeProfile(ev, id) {
      /* Confirm remove tasks */

         // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
               .title('Czy na pewno usunąć zaznaczone zadania?')
               .textContent('')
               .ariaLabel('Usuń zadania')
               .targetEvent(ev)
               .ok('Tak, usuń')
               .cancel('Anuluj');
    $mdDialog.show(confirm).then(function() {
      return dataservice.removeProfile(id)
              .then(function(data) {
                vm.loadProfiles();
                return data;
              })
              .catch(function(err){
                console.error(err);
              });
    }, function() {
      console.log('Anulowano usuwanie');
    })


    }

    function addNewProfile(ev) {
      $mdDialog.show({
        locals: {
          profile : {},
          editMode: false
        },
        controller: DialogController,
        controllerAs: 'dc',
        templateUrl: '/layout.home/profile.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false
      })
      .then(function(answer) {
        console.log('Dialog - OK.');
      }, function() {
        console.log('Cancel dialog.');
      });
    }

    function editProfile(ev, item) {
      $mdDialog.show({
        locals: {
          profile: item,
          editMode: true
        },
        controller: DialogController,
        controllerAs: 'dc',
        templateUrl: '/layout.home/profile.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false

      })
      .then(function(answer) {
        console.log('Dialog - OK.');
      }, function() {
        console.log('Cancel dialog.');
      });

    }
    //-------------------------------------------------
    //  DialogController
    //-------------------------------------------------

    function DialogController($scope, $mdDialog, dataservice, profile, editMode) {

      var self = this;
      self.hide = hide;
      self.cancel = cancel;
      self.answer = answer;
      // form
      self.profile = profile || {};
      self.addProject = addProject;
      self.addCategory = addCategory;
      self.saveProfile = saveProfile;
      self.addProfile = addProfile;
      $scope.editMode = editMode;

      // remove profile properties
      self.removeCategory = removeCategory;
      self.removeProject = removeProject;

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
        if (angular.isUndefined(self.profile.projects)) {
          self.profile.projects = [];
        }
        self.profile.projects.unshift("");
      }

      function addCategory() {
        if(angular.isUndefined(self.profile.categories)) {
          self.profile.categories = [];
        }
        self.profile.categories.unshift("");
      }

      function addProfile(profile) {
        //console.log(profile);
        return dataservice.addProfile(profile)
                .then(function(data) {
                  vm.loadProfiles();
                  if(data.status === 400) {
                    self.errmsg = "Profil o podanej nazwie już istnieje!";
                  } else {
                    self.hide();
                  }

                  return data;
                });

      }// #addProfile

      function saveProfile(profile) {
        return dataservice.editProfile(profile)
                .then(function(data) {
                  vm.loadProfiles();
                  if(data.status >= 400) {
                    self.errmsg = "Wystąpił błąd. Sprawdź wprowadzone dane.";
                  } else {
                    self.hide();
                  }
                  return data;
                });
      }// #saveProfile


      function removeProject(index) {
        self.profile.projects.splice(index, 1);
      }

      function removeCategory(index) {
        self.profile.categories.splice(index, 1);
      }

    }// #DialogController

  }// #ProfilesController

})();
