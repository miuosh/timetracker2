(function() {
  'use strict';
    angular.module('app.auth')
    .factory('AuthService', AuthService);

    /* @ngInject */
    AuthService.$inject = ['$q', '$timeout', '$http'];

    function AuthService($q, $timeout, $http) {

      var user = null;

        return ({
          isLoggedIn: isLoggedIn,
          getUserStatus: getUserStatus,
          login: login,
          logout: logout,
          register: register,
          resetPassword: resetPassword,
          getUsername: getUsername
        });

        function getUsername() {
          return $http.get('/users/username')
                  .success(function(data) {
                    username = data.username;
                  })
                  .error(function(err) {
                    console.log(err);
                  })
        }

        function isLoggedIn() {
          if (user) {
            return true;
          } else {
            return false;
          }
        }

        function getUserStatus() {
          return $http.get('/users/status')
                  .success(function (data) {
                    if(data.status) {
                      user = true;
                    } else {
                      user = false;
                    }
                  })
                  .error(function (data) {
                    user = false;
                  })

        }// #getUserStatus

        function login(username, password) {
          // create a new instance of deferred
          var deferred = $q.defer();
          $http.post('/users/login', {
            username: username,
            password: password
          }).success(function (data, status) {
            if (status === 200 && data.status) {
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          }).error(function(err) {
            user = false;
            deferred.reject(err);
          })
          // return promise object
          return deferred.promise;
        } // #login


        function logout() {
          var deferred = $q.defer();

        $http.get('/users/logout')
          .success(function (data) {
            user = false;
            deferred.resolve();
          })
          .error(function (err) {
            user = false;
            deferred.reject(err);
          })

          return deferred.promise;
        }// #logout

        function register(username, password, email) {

          var deferred = $q.defer();

          $http.post('/users/register', {
            username: username,
            password: password,
            email: email

          })
          .success(function (data, status) {
            if(status === 200 && data.status) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          .error(function (err) {
            deferred.reject(err);
          });

          return deferred.promise;
        }

        function resetPassword(email) {
          var deffered = $q.defer();

          $http.post('/users/resetPassword', { email })
            .success(function (data, status) {
              if(status === 200 && data.status) {
                deferred.resolve();
              } else {
                deffered.reject(data.status);
              }
            })
            .error(function(err) {
              deffered.reject(err);
            });

            return deffered.promise;
        }// #resetPassword

    }// #AuthService

}());
