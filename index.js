#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packageLocation = `${process.cwd()}/package.json`;
const packageExists = fs.existsSync(packageLocation);

if( packageExists ) {
  try {
    const rawContents = fs.readFileSync(packageLocation);
    const rawStr = rawContents.toString('utf8');
    const jsonContents = JSON.parse(rawStr);

    const scripts = Object.keys(jsonContents.scripts).map(key => {
      return `${key}: ${jsonContents.scripts[key]}`;
    });

    const scriptStrs = scripts.join('\n');

    process.stdout.write(scriptStrs);
  } catch( ex ) {
    process.stdout.write('Something went wrong parsing package.json');
  }
} else {
  process.stdout.write('There is no package.json in this directory');
}