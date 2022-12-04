import inquirer from "inquirer";
import { getData } from "./utils/getData.js";
import { setConfig } from "./utils/setConfig.js";
import { setToken } from "./utils/setToken.js";
import { runBuild } from "./utils/runBuild.js";
import { deploy } from "./utils/deploy.js";

async function portfolio() {
  console.log(
    "\n" +
      "    █▀█ █▀█ █▀█ ▀█▀ █▀▀ █▀█ █░░ █ █▀█\n" +
      "    █▀▀ █▄█ █▀▄ ░█░ █▀░ █▄█ █▄▄ █ █▄█\n" +
      "https://github.com/shaansubbaiah/Portfolio\n"
  );

  while (true) {
    const choice = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "Set Github Token",
        "Set configuration options",
        "Build Portfolio",
        "Deploy to GitHub Pages",
        "Exit",
      ],
    });
    if (choice.action === "Set Github Token") {
      await setToken();
    } else if (choice.action === "Set configuration options") {
      await setConfig();
    } else if (choice.action === "Build Portfolio") {
      await getData();
      await runBuild();
    } else if (choice.action === "Deploy to GitHub Pages") {
      await deploy();
    } else {
      process.exit(0);
    }
  }
}

portfolio();
