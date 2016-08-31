/**
 * @namespace statsCtrl
 *
 * @author: Felix Brucker
 * @version: v0.0.1
 *
 * @description
 * handles functionality for the stats page
 *
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('statsCtrl', statsController);

  function statsController($scope, $interval, $http) {

    var vm = this;
    vm.statsInterval = null;
    vm.current = {
      running: null,
      hashrate: null,
      speedSuffix: null,
      algorithm: null,
      cores: null,
      miner: null,
      accepted: null,
      rejected: null,
      acceptedPerMinute: null,
      difficulty: null,
      uptime: null,
      temperature: null,
      profitability: null,
      btcAddress: null,
      benchRunning:null
    };
    vm.waiting = null;

    // controller API
    vm.init = init;
    vm.getStats = getStats;
    vm.startMiner = startMiner;
    vm.stopMiner = stopMiner;


    /**
     * @name init
     * @desc data initialization function
     * @memberOf statsCtrl
     */
    function init() {
      angular.element(document).ready(function () {
        vm.getStats();
        vm.statsInterval = $interval(vm.getStats, 2000);
      });
    }

    /**
     * @name getStats
     * @desc get the stats
     * @memberOf statsCtrl
     */
    function getStats() {
      $http({
        method: 'GET',
        url: 'api/mining/stats'
      }).then(function successCallback(response) {
        vm.current.accepted = response.data.accepted;
        vm.current.acceptedPerMinute = response.data.acceptedPerMinute;
        vm.current.algorithm = response.data.algorithm;
        vm.current.cores = response.data.cores;
        vm.current.difficulty = response.data.difficulty;
        vm.current.hashrate = response.data.hashrate;
        vm.current.speedSuffix = response.data.speedSuffix;
        vm.current.miner = response.data.miner;
        vm.current.profitability = response.data.profitability;
        vm.current.rejected = response.data.rejected;
        vm.current.running = response.data.running;
        vm.current.temperature = response.data.temperature;
        vm.current.uptime = response.data.uptime;
        vm.current.btcAddress = response.data.btcAddress;
        vm.current.benchRunning=response.data.benchRunning;
      }, function errorCallback(response) {
        console.log(response);
      });
    }

    /**
     * @name startMiner
     * @desc start the Miner
     * @memberOf statsCtrl
     */
    function startMiner() {
      vm.waiting = true;
      $http({
        method: 'POST',
        url: 'api/mining/start'
      }).then(function successCallback(response) {
        setTimeout(function(){vm.waiting = false;}, 1000);
        if (response.data.success === true) {
          vm.getStats();
        }
      }, function errorCallback(response) {
        console.log(response);
      });
    }


    /**
     * @name stopMiner
     * @desc stop the Miner
     * @memberOf statsCtrl
     */
    function stopMiner() {
      vm.waiting = true;
      $http({
        method: 'POST',
        url: 'api/mining/stop'
      }).then(function successCallback(response) {
        setTimeout(function(){vm.waiting = false;}, 1000);
        if (response.data.success === true) {
          vm.getStats();
        }
      }, function errorCallback(response) {
        console.log(response);
      });
    }


    $scope.$on('$destroy', function () {
      if (vm.statsInterval)
        $interval.cancel(vm.statsInterval);
    });

    // call init function on firstload
    vm.init();
  }

})();
