(function() {
  'use strict';
  //-------------------------------------------------
  //  DialogTaskEditController - edit Task
  //-------------------------------------------------
  angular.module('app.layout')
  .controller('DialogTaskEditController', DialogTaskEditController);

  /* @ngInject */

  DialogTaskEditController.$inject = ['$scope', '$interval', '$timeout', '$mdDialog', 'dataservice', 'task'];

  function DialogTaskEditController ($scope, $interval, $timeout, $mdDialog, dataservice, task) {
    var self = this;
    self.hide            = hide;
    self.cancel          = cancel;
    self.answer          = answer;
    self.removeTimeSpan  = removeTimeSpan;
    // change time / date
    self.addHour         = addHour;
    self.substractHour   = substractHour;
    self.addMinute       = addMinute;
    self.substractMinute = substractMinute;

    self.init = init; // init dialog


    //form
    self.task = task || {};
    self.save = save;

    //data validation
    self.task.history.isValid = {};


    //intervals
    var interval = null;
    self.initInterval = initInterval;
    self.cancelInterval = cancelInterval;
    var ms = 125; //interval and cancel interval timeout

    //Internal functions
    var sumByProperty = sumByProperty;
    var calcDuration = calcDuration;
    var addTime = addTime;
    var substractTime = substractTime;

    var getIndexOfTimespan = getIndexOfTimespan;

    // data validation
    var setValidationMessage = setValidationMessage;
    var initValidation = initValidation;


    initValidation();
    init();
    //////////////////////////////////////////////////////////////////////
    function init() {
      $timeout(function(){
          console.log(self.task);
      }, 2000)


    }
    function hide() {
      $mdDialog.hide();
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function answer(answer) {
      $mdDialog.hide(answer);
    }

    function removeTimeSpan(index) {
      self.task.history.splice(index, 1);
      self.task.duration = sumByProperty(self.task.history, 'dt');
    }

    function save(item) {
      console.log('DialogTaskEditController:  save task clicked');
      return dataservice.editTask(item)
              .then(function(data) {
                self.hide();
                return data;
              })
              .then(function(data) {
                vm.getTasks(); //from parent controller
              });
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

    function addHour(item, property) {
      ms=200;
      self.initInterval( function() {
        addTime(item, property, 'HH'); //interval execution
      });

    }

    function substractHour(item, property) {
      ms=200;
      self.initInterval( function() {
        substractTime(item, property, 'HH');
      });
    }

    function addMinute(item, property) {
      ms=150;
      self.initInterval( function() {
          addTime(item, property, 'mm');
      });
    }

    function substractMinute(item, property) {
      ms=150;
      self.initInterval( function() {
          substractTime(item, property, 'mm');
      });
    }
    /*
    Internal use functions
    */
    function addTime(item, property, timeProperty) {
      var tmp = new Date(item[property]);

      if (timeProperty === 'HH') {
        tmp.setHours(tmp.getHours() + 1);
      }
      if (timeProperty === "mm") {
        tmp.setMinutes(tmp.getMinutes() + 1);
      }

      item[property] = tmp.toISOString();
      item.dt = calcDuration(item);
      self.task.duration = sumByProperty(self.task.history, 'dt');
    }

    function substractTime(item, property, timeProperty) {
        var tmp = new Date(item[property]);
        if (timeProperty === 'HH') {
          tmp.setHours(tmp.getHours() - 1);
        }
        if (timeProperty === "mm") {
          tmp.setMinutes(tmp.getMinutes() - 1);
        }

        item[property] = tmp.toISOString();
        item.dt = calcDuration(item);
        self.task.duration = sumByProperty(self.task.history, 'dt');

    }

    function sumByProperty(items, property) {

      if (items === 0) return 0;

      return items.reduce(function(previous, current) {
        return current[property] === null ? previous : previous + parseFloat(current[property]);
      }, 0)
    }

    function calcDuration(item){
      var start = new Date(item.startTime);
      var stop = new Date(item.stopTime);
      var isValid = isValidTimeSpan(item);

      initValidation();
      if (isValid) {
        setValidationMessage("", false);
        return (stop.getTime() - start.getTime()) / 1000;
      } else {
        setValidationMessage("Sprawdź czy próbki na siebie nie nachodzą.");
        return item.dt;
      }

    }


  function isValidTimeSpan(item) {
    var start = new Date(item.startTime);
    var stop  = new Date(item.stopTime);
    //check current item
    if (start.getTime() > stop.getTime()) { console.log('starTime większy od stopTime'); return false; }
    if (stop.getTime() > new Date().getTime() ) { console.log('stopTime większy od aktualnego czasu'); return false; } // gt than current Time
    if (stop.getDate() > start.getDate() || start.getDate() > stop.getDate()) { console.log('Odcinek czasu posiada rożne daty'); return false; } //different days

    // compare timespan with previous/next timespan
    var history     = self.task.history;
    var index       = getIndexOfTimespan(item);
    var currentItem = history[index];
    console.log('index:' + index + ' - ' + self.task.history[index]);

    if (index === undefined || index === null || index === -1) {
       console.log('Item undefined, null or -1');
       return false;
    }

    //check middle items
    if (index > 0 && index < history.length - 2) {
            var previousItem = history[index + 1];
            var nextItem     = history[index - 1];
            console.group('Środkowy element tabeli');
            console.log('nextItem');
            console.log(nextItem);
            console.log('currentItem');
            console.log(currentItem);
            console.log('previousItem');
            console.log(previousItem);
            console.log('currentIndex: ' + index)

            if (new Date(previousItem.stopTime).getTime() > new Date(currentItem.startTime).getTime() ) {
                console.log('Poprzedni stopTime większy od startTime bieżacego elementu');
                console.log('previousItem: ' + previousItem._id + ' ' + new Date(previousItem.stopTime).getTime() );
                console.log('currentItem: ' + + currentItem._id + '' + new Date(currentItem.startTime).getTime() );
                return false;
            }

            if ( new Date(currentItem.stopTime).getTime() > new Date(nextItem.startTime).getTime()) {
                console.log('stopTime bieżacego elementu większy od starTime następnego elementu');
                return false;
            }
            console.groupEnd();
    }
    if (index === 0 && history.length > 1) {
            var previousItem = history[index + 1];
            console.group('Pierwszy element tabeli');
            if (new Date(previousItem.stopTime).getTime() > new Date(currentItem.startTime).getTime()) {
                console.log('Poprzedni stopTime większy od startTime bieżacego elementu');
                return false;
            }
            console.groupEnd();
    }

    if (index === history.length-1 && history.length > 1 ) {
      console.group('Ostatni element tabeli');
      var nextItem = history[index-1];
      if ( new Date(currentItem.stopTime).getTime() > new Date(nextItem.startTime).getTime() ) {
          console.log('nextItem');
          console.log(nextItem);
          console.log('stopTime: ' + new Date(nextItem.stopTime).getTime() )
          console.log('currentItem');
          console.log(currentItem);
          console.log('startTime: ' + new Date(currentItem.startTime).getTime() )
          console.log('Ostatni element stopTime większy od starTime następnego elementu');
          console.log('index: ' + index);
          return false;
      }
      console.groupEnd();
    }

    return true;
  }// #isValidTimeSpan

  function initValidation() {
      var history = self.task.history;
      var len = history.length;
      console.log('Validate ' + len + ' objects');

      for (var i = 0; i < len; i++) {

        if (!isValidTimeSpan(history[i])) {
          self.task.history[i].isValid = false;
        } else {
          self.task.history[i].isValid = true;
        }

      }
      console.log('Validation end');
      console.log(self.task.history);
  }


  function getIndexOfTimespan(item) {
    var index = self.task.history.map(function(e) { return e._id; }).indexOf(item._id);
    return index;
  }

  function setValidationMessage(message, error = true) {
      self.task.history.isValid.message = message || {};
      self.task.history.isValid.error   = error || {};
  }

  }// #DialogTaskEditController

}());
