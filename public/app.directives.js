(function(){
  'use strict';

  angular.module('app')
  .directive("timerDirective",
              function( $interval ) {
                  // I bind the User Interface events to the $scope.
                  function link( $scope, element, attributes ) {
                      // When the timeout is defined, it returns a
                      // promise object.
                      console.log('scope: ' + $scope);
                      console.log('element' + element);
                      console.log('attrs' + attr);
                      var timer = $interval(
                          function() {
                              console.log( "Timeout executed", Date.now() );
                          },
                          1000
                      );
                      // Let's bind to the resolve/reject handlers of
                      // the timer promise so that we can make sure our
                      // cancel approach is actually working.
                      timer.then(
                          function() {
                              console.log( "Timer resolved!", Date.now() );
                          },
                          function() {
                              console.log( "Timer rejected!", Date.now() );
                          }
                      );
                      // When the DOM element is removed from the page,
                      // AngularJS will trigger the $destroy event on
                      // the scope. This gives us a chance to cancel any
                      // pending timer that we may have.
                      $scope.$on(
                          "$destroy",
                          function( event ) {
                              $interval.cancel( timer );
                          }
                      );
                  }
                  // Return the directive configuration.
                  return({
                      link: link,
                      scope: false
                  });
              }
          );

})();
