(function() {
  'use strict';
  angular.module('app')
.directive('myTimePicker', myTimePicker)

myTimePicker.$inject = ['$interval', '$timeout']

function myTimePicker($interval, $timeout) {
  return {
    scope : {
      timespan : "=",
      onChange: "=", //parent controller,
      isStartTime: "@",
      isStopTime : "@"
    },
    restrict: 'AE',
    transclude: true,
    replace: false,
    templateUrl: '/layout.home/template.timepicker.html',
    link: function(scope, elem, attrs) {
      scope.addHour         = addHour;
      scope.substractHour   = substractHour;
      scope.addMinute       = addMinute;
      scope.substractMinute = substractMinute;
      scope.calculateDiff   = calculateDiff;


      var tmpTime = '';
      var initTime = angular.copy(scope.timespan);
      var property = '';
      //console.log('Init directive... Copy time: scope: ' + scope.timespan + ' initTime: ' + initTime );

      //intervals
      var interval = null;
      scope.initInterval = initInterval;
      scope.cancelInterval = cancelInterval;
      var ms = 125; //interval and cancel interval timeout


      /* Init directive */
      init();


      /* time calculation */
      var calculateDiff = calculateDiff;

      function initCalculateDiff() {
          scope.timespan.dt = calculateDiff(scope.timespan.startTime, scope.timespan.stopTime);
      }

      /* data validation */
      scope.isValid = true;
      var checkValidity = checkValidity;

      function checkValidity() {
        var startTime = new Date(scope.timespan.startTime);
        var stopTime = new Date(scope.timespan.stopTime);

        if (startTime.getTime() > stopTime.getTime()) {
          return false;
        }

        if (startTime.getDate() != stopTime.getDate()) {
          return false;
        }

        return true;
      }

      function init() {
        var isStart = scope.isStartTime == 'true';
        var isStop = scope.isStopTime == 'true';

        if (isStart) {
          property = 'startTime';
        } else if (isStop) {
          property = 'stopTime';
        }
        tmpTime = new Date(scope.timespan[property]);

        scope.property = property;

      }



      scope.$on('$destroy', function() {
        cancelInterval();
      })


      function calculateDiff(startTime, stopTime) {
        var time0 = new Date(startTime).getTime();
        var time1 = new Date(stopTime).getTime();
        var diff = Math.round((time1 - time0) / 1000, 1);
        return diff;
      }

      function addMinute() {
        ms=125;

        scope.initInterval(function() {
          tmpTime.setMinutes(tmpTime.getMinutes() + 1);
          scope.timespan[property] = tmpTime.toISOString();
          scope.isValid = checkValidity();
          if (scope.isValid) {
            initCalculateDiff();
            scope.onChange(scope.timespan._id);
          }

        }, ms)
      }

      function substractMinute() {

        ms = 125;
        scope.initInterval(function() {
          tmpTime.setMinutes(tmpTime.getMinutes() - 1);
          scope.timespan[property] = tmpTime.toISOString();
          scope.isValid = checkValidity();
          if (scope.isValid) {
              initCalculateDiff();
              scope.onChange(scope.timespan._id);
          }

        }, ms);
      }

      function addHour() {
        ms = 200;
        scope.initInterval(function() {
          tmpTime.setHours(tmpTime.getHours() + 1);
          scope.timespan[property] = tmpTime.toISOString();
          scope.isValid = checkValidity();
          if (scope.isValid) {
            initCalculateDiff();
            scope.onChange(scope.timespan._id);
          }
        }, ms);

      }

      function substractHour() {
        ms = 200;
        scope.initInterval(function() {
          tmpTime.setHours(tmpTime.getHours() - 1);
          scope.timespan[property] = tmpTime.toISOString();
          scope.isValid = checkValidity();
          if (scope.isValid) {
            initCalculateDiff();
            scope.onChange(scope.timespan._id);
          }
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
