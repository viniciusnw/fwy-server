require('path');
require('./baseurl.hack')();
require('dotenv').config();
const util = require('util');

import { Runner } from './runner';
declare var process;

let args = process.argv[2];
let mode = args.split(':')[0];
let action = args.split(':')[1];
let param = process.argv[3];

console.log(`[SERVER][start][PARAMS]:`, util.inspect({ args: process.argv, mode, action, param }, false, null, true));

switch (mode) {
  case 'job':
    Runner.exec(`./worker/${action}.job`, param, true);
    break;
  case 'worker':
    Runner.exec(`./worker/${action}.worker`, param, false);
    break;
  case 'server':
    Runner.exec(`./server`, null, true);
    break;
}