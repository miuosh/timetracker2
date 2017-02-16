(function() {
  'use strict';
  angular.module('app')
.directive('myTimePicker', myTimePicker)

myTimePicker.$inject = ['$interval', '$timeout']

function myTimePicker($interval, $timeout) {
  return {
    scope : {
      time : "="
    },
    restrict: 'AE',

    replace: false,
    templateUrl: '/layout.home/template.timepicker.html',
    link: function(scope, elem, attrs) {
      scope.addHour         = addHour;
      scope.substractHour   = substractHour;
      scope.addMinute       = addMinute;
      scope.substractMinute = substractMinute;

      var tmpTime = new Date(scope.time);

      //intervals
      var interval = null;
      scope.initInterval = initInterval;
      scope.cancelInterval = cancelInterval;
      var ms = 125; //interval and cancel interval timeout


      function addMinute() {
        ms=125;
        scope.initInterval(function() {
          tmpTime.setMinutes(tmpTime.getMinutes() + 1);
          scope.time = tmpTime.toISOString();
        })
      }

      function substractMinute() {
        ms = 125;
        scope.initInterval(function() {
          tmpTime.setMinutes(tmpTime.getMinutes() - 1);
          scope.time = tmpTime.toISOString();
        });
      }

      function addHour() {
        ms = 200;

        scope.initInterval(function() {
          tmpTime.setHours(tmpTime.getHours() + 1);
          scope.time = tmpTime.toISOString();
        }, ms);
      }

      function substractHour() {
        ms = 200;
        scope.initInterval(function() {
          tmpTime.setHours(tmpTime.getHours() - 1);
          scope.time = tmpTime.toISOString();
        }, ms);
      }

      function initInterval(fn) {
        if (!interval) {
         interval = $interval(function() {
             fn();
         }, ms);
       }
      }

      function cancelInterval() {
        if(interval) {
          $timeout (function() {
            $interval.cancel(interval);
            interval = null;
          }, ms);
        }
      }


    }// #link
  }// #return
}// #myTimePicker
}());
