(function(){
  'use strict';

  angular.module('app')
  .filter('formatDuration', formatDuration)
  .filter("customSearch", customSearch);

  /* @ngInject */

  function formatDuration() {
    return function formatTime(duration, sec) {
      var seconds_num,
          seconds_float,
          seconds,
          minutes,
          hours;

        seconds_num   = parseInt(duration);
        seconds_float = parseFloat(duration);
        hours         = Math.floor(seconds_num / 3600);
        minutes       = Math.floor((seconds_num - (hours * 3600) ) / 60);
        seconds       = Math.round( seconds_float - (hours * 3600) - (minutes * 60) );

        if (hours < 10) { hours     = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }
        if (sec === true || sec === undefined) {
          return hours + ':' + minutes + '.' + seconds;
        } else {
          return hours + ':' + minutes;
        }

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
