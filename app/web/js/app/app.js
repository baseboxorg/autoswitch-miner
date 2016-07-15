/**
 * @name app module configuration
 *
 * @author Felix Brucker
 * @version v0.0.1
 *
 * @description
 * hanldes top level configuration
 *
 */
(function () {
  'use strict';

  var app = angular.module('app', ['ui.router', 'angular-loading-bar'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', config])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 1;
    }]);
  app.directive('updateTitle', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
      return {
        link: function (scope, element) {

          var listener = function (event, toState) {

            var title = 'Autoswitch-Miner';
            if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;

            $timeout(function () {
              element.text(title);
            }, 0, false);
          };

          $rootScope.$on('$stateChangeSuccess', listener);
        }
      };
    }
  ]);
  app.directive('highlighter', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      scope: {
        model: '=highlighter'
      },
      link: function(scope, element) {
        scope.$watch('model', function (nv, ov) {
          if (nv !== ov) {
            element.addClass('highlight');
            $timeout(function () {
              element.removeClass('highlight');
            }, 2000);
          }
        });
      }
    };
  }]);
  app.filter('bytes', function() {
    return function(bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
      if (typeof precision === 'undefined') precision = 1;
      var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
          number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
  });
  app.filter('hashrate', function() {
    return function(bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '';
      if (typeof precision === 'undefined') precision = 1;
      var units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
  });

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    //define module-specific routes here
    $stateProvider
      .state('stats', {
        url: '/',
        templateUrl: 'views/partials/stats.html',
        controller: 'statsCtrl',
        controllerAs: 'statsVm',
        data: {
          pageTitle: 'Autoswitch-Miner Stats'
        }
      })
      .state('config', {
        url: '/config',
        templateUrl: 'views/partials/config.html',
        controller: 'configCtrl',
        controllerAs: 'configVm',
        data: {
          pageTitle: 'Autoswitch-Miner Config'
        }
      })
      .state('setup', {
        url: '/setup',
        templateUrl: 'views/partials/setup.html',
        controller: 'setupCtrl',
        controllerAs: 'setupVm',
        data: {
          pageTitle: 'Autoswitch-Miner Setup'
        }
      });
    $urlRouterProvider.otherwise('/');
  }

})();
