import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "..", "config.json");
let cfg;

function getSanitizedLink(link) {
  if (!/^https?:\/\//i.test(link)) {
    return "https://" + link;
  }
  return link;
}

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
    cfg.navLinks.push({
      name: linkInquiry.name,
      link: getSanitizedLink(linkInquiry.link),
    });
  else if (type === "infoLink")
    cfg.infoLinks.push({
      name: linkInquiry.name,
      link: getSanitizedLink(linkInquiry.link),
    });

  if (linkInquiry.addMore) {
    await inquireLink(type);
  }
}

export async function setConfig() {
  cfg = {};

  const exists = fs.existsSync(CONFIG_PATH);
  if (exists) {
    cfg = await fs.readJson(CONFIG_PATH, { throws: false });
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

  await fs.writeJson(CONFIG_PATH, cfg, { spaces: "\t" });
  console.log("\nConfig written to config.json");
  console.log(cfg);

  console.log("Config set!");
}
