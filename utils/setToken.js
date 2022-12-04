import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, "..", ".env");

export async function setToken() {
  console.log(
    "---- Github token should have at least public_repo, read:user permissions. \n" +
      "---- A token can be created at https://github.com/settings/tokens/new"
  );

  const answer = await inquirer.prompt({
    type: "password",
    name: "token",
    message: "Enter GitHub token:",
    mask: "*",
  });

  try {
    await fs.outputFile(ENV_PATH, `GITHUB_TOKEN="${answer.token}"`);
    console.log("Token written to " + ENV_PATH + "\n");
  } catch (err) {
    console.log("Error setting token: " + err);
  }
}
