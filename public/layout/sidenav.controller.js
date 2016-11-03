angular.module('app.layout', [])
.controller('SideNavController', SideNavController);

function SideNavController(){
  var vm = this;
  vm.name = "sideNav"
}
