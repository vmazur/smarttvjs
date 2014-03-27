#!/usr/bin/env node

require('shelljs/global');

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

if (argv._.length >= 1 && argv._[0] == 'init') {
  var OrangeeJSInitTask = require('./tasks/init');
  (new OrangeeJSInitTask()).run(argv._[1]);
} else if (argv._.length >= 1 && argv._[0] == 'build') {
  var OrangeeJSBuildTask = require('./tasks/build');
  (new OrangeeJSBuildTask()).run(argv._[1]);
} else if (argv._.length >= 1 && argv._[0] == 'icon') {
  var OrangeeJSIconTask = require('./tasks/icon');
  (new OrangeeJSIconTask()).run(argv._[1]);
} else {
  console.log("orangeejs init");
  console.log("orangeejs build");
}


