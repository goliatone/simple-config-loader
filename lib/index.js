"use strict";

/*
 * simple-config-loader
 * https://github.com/goliatone/simple-config-loader
 *
 * Copyright (c) 2016 goliatone
 * Licensed under the MIT license.
 */


var glob = require('glob');
var extend = require('gextend');

var _join = require('path').join;
var _resolve = require('path').resolve;
var _inherit = require('util').inherits;
var _basename = require('path').basename;

var Solver = require('gsolver');
var Keypath = require('gkeypath');

var EventEmitter = require('events').EventEmitter;

var DEFAULTS = {
    strict: true,
    logger: console,
    autoinitialize: true,
    config: {
        environment: process.env.NODE_ENV || 'production'
    },
    packagePath: '../package',
    configsPath: './',
    basepath: _resolve(_join(__dirname, '../../../')),
    dirname: 'config',
    globOptions: {
        matchPatterh: '**.js',
        ignorePattern: 'index.js'
    },
    getConfigFiles: function(){
        var target = _join(this.basepath, this.dirname, this.globOptions.matchPatterh);
        var ignore = _join(this.basepath, this.dirname, this.globOptions.ignorePattern);
        var files = glob.sync(target, {ignore: ignore});

        if(!files || files.length === 0){
            var msg = 'Not config files found at ' + target;
            if(this.strict) throw new Error(msg);
            else console.log(msg);
        }
        return files;
    },
    getPackage: function(data, path){
        try{
            data.package = require(path);
            delete data.package.readme;
        } catch(e) {
            this.logger.error('Error loading package');
            data = {};
        }
        return data;
    }
};

function ConfigLoader(opts){
    EventEmitter.call(this);
    opts = extend({}, this.constructor.DEFAULTS, opts);

    if(opts.autoinitialize ) this.init(opts);
}

_inherit(ConfigLoader, EventEmitter);

ConfigLoader.DEFAULTS = DEFAULTS;

ConfigLoader.prototype.init = function(opts){
    if(this.initialized) return;
    this.initialized = true;

    var solver = new Solver();

    extend(this, this.constructor.DEFAULTS, opts);

    var data = extend({}, this.config);

    //We might want to remove unused props of
    //the package. For instance, the "readme"
    //portion might introduce errors by adding ${}
    if(this.packagePath){
        this.getPackage(data, this.packagePath);
    }

    data = this.loadConfigs(data);

    data = solver.solve(data);

    this.config = Keypath.wrap(data, null, 'data');

    /*
     * Need to do this otherwise we bork
     * Flattener if we include libraries
     * or complex objects, or introduce
     * cyclical dependencies :/
     */
    var section;
    Object.keys(data).map(function(prop){
        section = data[prop];
        if(typeof section.afterSolver !== 'function') return;
        section.afterSolver(this.config, prop);
        delete section.afterSolver;
    }, this);
};

ConfigLoader.prototype.loadConfigs = function(defaults){
    var configs = [defaults], conf, name;
    this.getConfigFiles().map(function(filepath){
        conf = {};
        name = _basename(filepath).split('.')[0];
        conf[name] = require(filepath);
        configs.push(conf);
    });

    if(configs.length === 1) {
        var msg = 'No configuration files found';
        if(this.strict) throw new Error(msg);
        else console.warn(msg);
    }

    return extend.apply(null, configs);
};


ConfigLoader.prototype.logger = console;

/**
 * Exports module
 */
module.exports = function(opts){
    var loader = new ConfigLoader(opts);
    return loader.config;
};
