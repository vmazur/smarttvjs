#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

if (argv._.length == 2 && argv._[0] == 'create') {
  var OrangeeJSCreateTask = require('../lib/create');
  (new OrangeeJSCreateTask()).run(argv._[1]);
} else {
  console.log("orangeejs create <projectname>");
}

