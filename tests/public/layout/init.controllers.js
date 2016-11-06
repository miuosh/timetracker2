var assert = require('assert');

describe("Layout", function() {
  var controller,
      scope;

  beforeEach(angular.mock.module('app.layout'));

  beforeEach(angular.mock.inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        controller = $controller('SideNavController', function() {
          $scope: scope;
        });
  }));

  it('should have a SideNav controller', function() {
      expect(controller).toBeDefined();
  });


})
