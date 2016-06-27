"use strict";

var config = require('..')({
    basepath: __dirname,
    packagePath: '../package'
});

//remove noise...
delete config.data.package;

console.log(config.data)
