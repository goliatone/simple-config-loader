module.exports = {
    version: '${package.version}',
    name: '${package.name}'
};

module.exports.afterSolver = function(config){
    console.log('After Solver:', config.get('orm.database'));
};
