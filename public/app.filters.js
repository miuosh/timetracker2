(function(){
  'use strict';

  angular.module('app')
  .filter('formatDuration', formatDuration)
  .filter("customSearch", customSearch);

  /* @ngInject */

  function formatDuration() {
    return function formatTime(duration) {
      var seconds_num,
            seconds,
            minutes,
            hours;
        seconds_num = parseInt(duration);
        hours = Math.floor(seconds_num / 3600);
        minutes = Math.floor((seconds_num - (hours * 3600) ) / 60);
        seconds = seconds_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        return hours + ':' + minutes + '.' + seconds;
    };

  }// #formatDuration

  function customSearch() {
    return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value).toLowerCase();
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  };
} // #customSearch

})();
