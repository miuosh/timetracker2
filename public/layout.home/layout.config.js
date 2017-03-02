(function() {
  'use strict';
  angular.module('app.layout')
  .config(function($mdDateLocaleProvider) {

    $mdDateLocaleProvider.months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

    $mdDateLocaleProvider.shortMonths = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE',
    'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];

    $mdDateLocaleProvider.days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    $mdDateLocaleProvider.shortDays = ['Niedz.', 'Pn.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.'];

    // Can change week display to start on Monday.
   $mdDateLocaleProvider.firstDayOfWeek = 1;
  })
}());
