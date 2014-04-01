#!/usr/bin/env node

require('shelljs/global');

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

if (argv._.length >= 1 && argv._[0] == 'init') {
  var T = require('./tasks/init');
  (new T()).run();
} else if (argv._.length >= 1 && argv._[0] == 'server') {
  var T = require('./tasks/server');
  (new T()).run(argv._[1] || 80);
} else if (argv._.length >= 1 && argv._[0] == 'build') {
  var T = require('./tasks/build');
  (new T()).run(argv._[1]);
} else if (argv._.length >= 1 && argv._[0] == 'icon') {
  var T = require('./tasks/icon');
  (new T()).run();
} else if (argv._.length >= 2 && argv._[0] == 'run') {
  var T = require('./tasks/run');
  (new T()).run(argv._[1]);
} else {
  console.log("orangeejs init");
  console.log("orangeejs build");
  console.log("orangeejs run samsung");
}


