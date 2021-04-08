#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const packageLocation = `${process.cwd()}/package.json`;
const packageExists = fs.existsSync(packageLocation);

if( packageExists ) {
  try {
    const rawContents = fs.readFileSync(packageLocation);
    const rawStr = rawContents.toString('utf8');
    const jsonContents = JSON.parse(rawStr);

    Object.keys(jsonContents.scripts).forEach(key => {
      process.stdout.write(chalk.green(key));
      process.stdout.write(': ' + jsonContents.scripts[key] + '\n');
    });
  } catch( ex ) {
    process.stdout.write('Something went wrong parsing package.json');
  }
} else {
  process.stdout.write('There is no package.json in this directory');
}