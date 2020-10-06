const fs = require("fs-extra");
const readline = require("readline");
const path = require("path");
const { build } = require("./utils/build");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// helper function to handle async readline functions
// @SEE: https://stackoverflow.com/a/57416896
function question(theQuestion, defaultValue) {
  return new Promise((resolve) => {
    rl.question(theQuestion, (ans) => resolve(ans));
    if (defaultValue) {
      rl.write(defaultValue);
    }
  });
}

function getChoice(theQuestion) {
  return new Promise((resolve) =>
    rl.question(theQuestion, (ans) => {
      if (ans.toLowerCase() == "y" || ans.toLowerCase() == "yes") {
        resolve("yes");
      } else if (ans.toLowerCase() == "n" || ans.toLowerCase() == "no") {
        resolve("no");
      } else {
        resolve("invalid");
      }
    })
  );
}

async function setToken() {
  try {
    const token = await question(
      "\n// Github token should have at least public_repo, read:user permissions\n" +
      "// A token can be created at https://github.com/settings/tokens/new .\n" +
      "Github token: "
    );
    await fs.outputFile(`./.env`, `GITHUB_TOKEN="${token}"`);
    console.log(`🎉 Token Set!`);
  } catch (err) {
    console.error(err);
  }
  return;
}

async function setConfig() {
  let cfg = {};

  try {
    const exists = await fs.existsSync(path.join(__dirname, "config.json"));

    if (exists) {
      cfg = await fs.readJson("config.json", { throws: false });
    }

    data = await question("\nGitHub username: ", cfg.username);
    cfg.username = data ? data : null;

    data = await question("No. of repositories: ", cfg.repos);
    cfg.repos = data ? data : null;

    data = await question("Avatar path or url: ", cfg.avatar);
    cfg.avatar = data ? data : null;

    data = await question("Linkedin URL: ", cfg.linkedinURL);
    cfg.linkedinURL = data ? data : null;

    data = await question("Twitter ID: ", cfg.twitterId);
    cfg.twitterId = data ? data : null;

    data = await question("GitLab username: ", cfg.gitlabId);
    cfg.gitlabId = data ? data : null;

    let choice, i;

    cfg.navLinks = [];
    i = 0;
    console.log("Add Navigation links: (don't exceed 3)");
    do {
      choice = await getChoice(`  Link ${i} (Y/n): `);
      if (choice == "yes") {
        let obj = {};
        obj.name = await question("    Display name: ");
        obj.link = await question("    Link: ");
        cfg.navLinks[i] = obj;
        i++;
      } else if (choice == "no") {
        break;
      }
    } while (choice != "no");

    cfg.infoLinks = [];
    i = 0;
    console.log("Add Information links: (don't exceed 4)");
    do {
      choice = await getChoice(`  Link ${i} (Y/n): `);
      if (choice == "yes") {
        let obj = {};
        obj.name = await question("    Display name: ");
        obj.link = await question("    Link: ");
        cfg.infoLinks[i] = obj;
        i++;
      } else if (choice == "no") {
        break;
      }
    } while (choice != "no");

    choice = await getChoice(`Display Social Preview Image (Y/n): `);
    cfg.socialPreviewImage = choice == "yes" ? "enabled" : "disabled";

    await fs.writeJson("config.json", cfg, { spaces: "\t" });
    const obj = await fs.readJson("config.json", { throws: false });
    console.log("\nConfig written to config.json");
    console.log(obj); // => null

    console.log("🎉 Config set!");
  } catch (err) {
    console.error(err);
    rl.close();
  }

  return;
}

async function portfolio() {
  console.log(
    "█▀█ █▀█ █▀█ ▀█▀ █▀▀ █▀█ █░░ █ █▀█\n" +
    "█▀▀ █▄█ █▀▄ ░█░ █▀░ █▄█ █▄▄ █ █▄█\n" +
    "https://github.com/shaansubbaiah/Portfolio"
  );

  let ch;
  do {
    ch = await question(
      "\n1. Set Github Token \n2. Set configuration options \n3. Build Portfolio \n4. Exit \nChoice: "
    );
    switch (ch) {
      case "1":
        await setToken();
        break;
      case "2":
        await setConfig();
        break;
      case "3":
        await build();
      case "4":
        rl.close();
        break;
      default:
        console.log("Invalid choice.");
    }
  } while (ch != "3" && ch != "4");
}

portfolio();
