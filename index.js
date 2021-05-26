#!/usr/bin/env node

const fs = require("fs");
const { spawn } = require("child_process");
const chalk = require("chalk");
const inquirer = require("inquirer");
const argv = require("yargs/yargs")(process.argv.slice(2)).option(
  "interactive",
  {
    alias: "i",
    type: "boolean",
    description: "Run interactively and select a script",
  }
).argv;

catscripts(argv.i);

function catscripts(interactive = false) {
  const lockFiles = {
    npm: `${process.cwd()}/package-lock.json`,
    yarn: `${process.cwd()}/yarn.lock`,
  };
  const packageLocation = `${process.cwd()}/package.json`;
  const packageExists = fs.existsSync(packageLocation);
  const isYarn = fs.existsSync(lockFiles.yarn);

  if (!packageExists) {
    process.stdout.write("There is no package.json in this directory");
  }

  try {
    const rawContents = fs.readFileSync(packageLocation);
    const rawStr = rawContents.toString("utf8");
    const jsonContents = JSON.parse(rawStr);

    const choices = Object.keys(jsonContents.scripts).map((key) => {
      return `${chalk.green(key)}: ${jsonContents.scripts[key]}`;
    });

    if (!interactive) {
      choices.forEach((c) => {
        process.stdout.write(c + "\n");
      });
    } else {
      inquirer
        .prompt([
          {
            type: "list",
            name: "scripts",
            message: `${isYarn ? "yarn" : "npm"} run `,
            choices,
          },
        ])
        .then((answer) => {
          const index = choices.indexOf(answer.scripts);
          const script = Object.keys(jsonContents.scripts)[index];

          run(isYarn ? "yarn" : "npm", ["run", script]);
        })
        .catch((error) => {
          if (error.isTtyError) {
            return;
          }

          process.stdout.write(error);
        });
    }
  } catch (ex) {
    process.stdout.write("Sorry. Something went wrong.");
  }
}

function run(cmd, options) {
  const task = spawn(cmd, options);

  task.stdout.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  task.stderr.on("data", (data) => {
    process.stderr.write(`${data}`);
  });

  task.on("error", (error) => {
    process.stderr.write(`${error.message}`);
  });
}
