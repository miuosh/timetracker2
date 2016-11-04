var assert = require('assert');

describe("sideNavCtrl", function() {
  var controller,
      scope;

  beforeEach(angular.mock.module('app.layout'));

  beforeEach(angular.mock.inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        controller = $controller('SideNavController', function() {
          $scope: scope;
        });
  }));

  it('should have a SideNavCtrl controller', function() {
      expect(controller).toBeDefined();
  });


})
