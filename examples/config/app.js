module.exports = {
    name: '${package.name}',
    version: '${package.version}',
    redisConfig: '@{orm.redis}'
};

module.exports.afterSolver = function(config){
    console.log('After Solver:', config.get('orm.database'));
};
