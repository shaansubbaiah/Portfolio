import util from "util";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
const asyncExec = util.promisify(exec);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "..", "config.json");
const BUILD_DIR = path.join(__dirname, "..", "dist");
const BRANCH_NAME = "main"; // "master"

async function runCommand(command, params = {}) {
  const { stdout, stderr } = await asyncExec(command, params);
  if (stdout) console.log("stdout:", stdout);
  if (stderr) console.error("stderr:", stderr);
}

export async function deploy() {
  let cfg = {};

  const exists = fs.existsSync(CONFIG_PATH);
  if (exists) {
    cfg = await fs.readJson(CONFIG_PATH, { throws: false });
  }

  const distFolderExists = fs.existsSync(BUILD_DIR);
  if (distFolderExists) {
    // Adapted from https://vitejs.dev/guide/static-deploy.html

    // abort on errors
    await runCommand("set -e");

    // place .nojekyll to bypass Jekyll processing
    await runCommand("echo > .nojekyll", { cwd: BUILD_DIR });

    await runCommand("git init", { cwd: BUILD_DIR });
    await runCommand("git checkout -B main", { cwd: BUILD_DIR });
    await runCommand("git add -A", { cwd: BUILD_DIR });
    await runCommand("git commit -m 'deploy'", { cwd: BUILD_DIR });

    // deploying to https://<USERNAME>.github.io
    await runCommand(
      `git push -f git@github.com:${cfg.username}/${cfg.username}.github.io.git ${BRANCH_NAME}`,
      { cwd: BUILD_DIR }
    );

    console.log(
      `If all went well it should have been pushed to ${cfg.username}/${cfg.username}.github.io and should be accessible at https://${cfg.username}/${cfg.username}.github.io \n`
    );
  } else {
    console.log(
      "Could not find 'dist/' directory, you may have not built the site yet! \n"
    );
  }
}
