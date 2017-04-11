"use strict";

var config = require('..')({
    basepath: __dirname,
    packagePath: '../package'
});

var handler = {
  get: function (receiver, name) {
      console.log('name', name);
    return receiver.data[name];
  }
};

var c = new Proxy(config, handler);

//remove noise...
delete config.data.package;

console.log(JSON.stringify(c.orm.redis.port, null, 4));
console.log(JSON.stringify(c.app.redisConfig, null, 4));
