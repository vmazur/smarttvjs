#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
//console.dir(argv);

if (argv.version) {
  var T = require('./tasks/util');
  console.log(T.version());
} else if (argv._.length >= 1 && argv._[0] == 'init') {
  var T = require('./tasks/init');
  (new T()).run(argv.debug);
} else if (argv._.length >= 1 && argv._[0] == 'server') {
  var T = require('./tasks/server');
  (new T()).run(argv._[1] || 80, argv._[2] || process.cwd());
} else if (argv._.length >= 2 && argv._[0] == 'build') {
  var T = require('./tasks/build');
  (new T()).run(argv._[1]);
} else if (argv._.length >= 2 && argv._[0] == 'run') {
  var T = require('./tasks/run');
  (new T()).run(argv._[1]);
} else if (argv._.length >= 1 && argv._[0] == 'console') {
  require('xconsole.io');
} else {
  console.log("orangeejs init");
  console.log("orangeejs build samsung|lg|ios|roku");
  console.log("orangeejs run samsung|lg|ios");
  console.log("orangeejs server <port>");
}


