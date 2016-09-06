'use strict';

var colors = require('colors/safe');
var fs = require('fs');
var os = require('os');

var configPath="data/settings.json";

if (!fs.existsSync("data")){
  fs.mkdirSync("data");
}
var config = module.exports = {
  config: {
    region: null,
    regions: null,
    btcAddress: null,
    proxy: null,
    binPath: null,
    autostart:null,
    benchmarks: null,
    benchTime: null,
    rigName: null,
    cores: null,
    writeMinerLog: null
  },
  algos: {
    lyra2re: {id: 9, name: "Lyra2RE", port: 3342, profitability: null, submitUnit: 2, profUnit: 2},
    cryptonight: {id: 22, name: "CryptoNight", port:3355, profitability: null, submitUnit: 1, profUnit: 2}
  },
  cpuModel: os.cpus()[0].model.trim(),
  getConfig: function () {
    return config.config;
  },
  setConfig: function (newConfig) {
    config.config = newConfig;
  },
  saveConfig: function () {
    console.log(colors.grey("writing config to file.."));
    fs.writeFile(configPath, JSON.stringify(config.config), function (err) {
      if (err) {
        return console.log(err);
      }
    });
  },
  loadConfig: function () {
    fs.stat(configPath, function (err, stat) {
      if (err == null) {
        fs.readFile(configPath, 'utf8', function (err, data) {
          if (err) throw err;
          config.config = JSON.parse(data);
          Object.keys(config.config.benchmarks).forEach(function (key) {
            config.config.benchmarks[key].benchRunning=false;
          });
          if (Object.keys(config.algos).length!==Object.keys(config.config.benchmarks).length){
            Object.keys(config.algos).forEach(function (key) {
              if(!(config.config.benchmarks.hasOwnProperty(key))){
                var newAlgo = {};
                newAlgo.name=config.algos[key].name;
                newAlgo.id=config.algos[key].id;
                newAlgo.submitUnit=config.algos[key].submitUnit;
                newAlgo.hashrate=null;
                newAlgo.enabled=true;
                newAlgo.benchRunning=null;
                newAlgo.binPath=null;
                newAlgo.cores=null;
                config.config.benchmarks[key]=newAlgo;
              }
            });
          }else{
            Object.keys(config.config.benchmarks).forEach(function (key) {
              if(config.config.benchmarks[key].id===undefined)
                config.config.benchmarks[key].id=config.algos[key].id;
              if(config.config.benchmarks[key].submitUnit===undefined)
                config.config.benchmarks[key].submitUnit=config.algos[key].submitUnit;
              if(config.config.benchmarks[key].cores===undefined)
                config.config.benchmarks[key].cores=null;
            });
          }
        });
      } else if (err.code == 'ENOENT') {
        //default conf
        config.config.regions = [{id: 0, name: "Nicehash EU"}, {id: 1, name: "Nicehash USA"}];
        config.config.region = 1;
        config.config.btcAddress = '12gotm1HbU1zv9FMnuNfPakpn7rsRjB1no';
        config.config.cores = 2;
        var isWin = /^win/.test(process.platform);
        if (isWin)
          config.config.binPath = "bin\\cpuminer.exe";
        else
          config.config.binPath = "bin/cpuminer";
        config.config.autostart=false;
        config.config.benchmarks = {
        };
        config.config.benchTime=60;
        config.config.rigName=process.env.WNAME;
        config.config.writeMinerLog=true;
        config.saveConfig();
        setTimeout(function(){
          config.loadConfig();
        },500);
      }
    });
  }
};
console.log("initializing, please wait...");
config.loadConfig();
