import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setConfig() {
  let cfg = {};

  const exists = fs.existsSync(path.join(__dirname, "config.json"));
  if (exists) {
    cfg = await fs.readJson("config.json", { throws: false });
  }

  const config = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "GitHub username?",
      default: cfg.username || "",
    },
    {
      type: "input",
      name: "repos",
      message: "No. of repositories?",
      default: cfg.repos || "",
      filter: Number,
    },
    {
      type: "input",
      name: "avatar",
      message: "Avatar path or url?",
      default: cfg.avatar || "",
    },
    {
      type: "input",
      name: "linkedinURL",
      message: "LinkedIn url?",
      default: cfg.linkedinURL || "",
    },
    {
      type: "input",
      name: "twitterId",
      message: "Twitter ID?",
      default: cfg.twitterId || "",
    },
    {
      type: "input",
      name: "gitlabId",
      message: "GitLab username?",
      default: cfg.gitlabId || "",
    },
    {
      type: "confirm",
      name: "socialPreviewImage",
      message: "Display social preview images? (default - yes)",
      default: true,
    },
    {
      type: "confirm",
      name: "profileREADME",
      message: "Display profile readme? (default - no)",
      default: false,
    },
  ]);

  cfg = JSON.parse(JSON.stringify(config));

  cfg.navLinks = [];
  cfg.infoLinks = [];

  async function inquireLink(type) {
    const linkInquiry = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "-- Link name?",
        default: "",
      },
      {
        type: "input",
        name: "link",
        message: "-- Link url?",
        default: "",
      },
      {
        type: "confirm",
        name: "addMore",
        message: "Want to add another?",
        default: false,
      },
    ]);

    if (type === "navLink")
      cfg.navLinks.push({ name: linkInquiry.name, link: linkInquiry.link });
    else if (type === "infoLink")
      cfg.infoLinks.push({ name: linkInquiry.name, link: linkInquiry.link });

    if (linkInquiry.addMore) {
      await inquireLink(type);
    }
  }

  const addNavInquiry = await inquirer.prompt({
    type: "confirm",
    name: "addNavLinks",
    message: "Add navigation links (top right of page)?",
    default: false,
  });
  if (addNavInquiry.addNavLinks) {
    await inquireLink("navLink");
  }

  const addInfoInquiry = await inquirer.prompt({
    type: "confirm",
    name: "addInfoLinks",
    message: "Add information links (under avatar)?",
    default: false,
  });

  if (addInfoInquiry.addInfoLinks) {
    await inquireLink("infoLink");
  }

  await fs.writeJson("config.json", cfg, { spaces: "\t" });
  const obj = await fs.readJson("config.json", { throws: false });
  console.log("\nConfig written to config.json");
  console.log(obj);

  console.log("Config set!");
}

async function setToken() {
  // ui.updateBottomBar(
  //   "Github token should have at least public_repo, read:user permissions. A token can be created at https://github.com/settings/tokens/new ."
  // );
  const answer = await inquirer.prompt({
    type: "password",
    name: "token",
    message: "Enter GitHub token:",
    mask: "*",
  });
  await fs.outputFile(`./.env`, `GITHUB_TOKEN="${answer.token}"`);
}

async function portfolio() {
  console.log(
    "" +
      "█▀█ █▀█ █▀█ ▀█▀ █▀▀ █▀█ █░░ █ █▀█\n" +
      "█▀▀ █▄█ █▀▄ ░█░ █▀░ █▄█ █▄▄ █ █▄█\n" +
      "https://github.com/shaansubbaiah/Portfolio\n"
  );

  const choice = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "Set Github Token",
      "Set configuration options",
      "Build Portfolio",
      "Exit",
    ],
  });
  if (choice.action === "Set Github Token") await setToken();
  else if (choice.action === "Set configuration options") await setConfig();
  else if (choice.action === "Build Portfolio")
    console.log("~ gestures like its building ~");
  else process.exit(0);
}

portfolio();
