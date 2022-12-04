import util from "util";
import { exec } from "child_process";
const asyncExec = util.promisify(exec);

const BUILD_CMD = "npm run build";
const PREVIEW_CMD = "npm run preview";

async function runCommand(command) {
  const { stdout, stderr } = await asyncExec(command);
  if (stdout) console.log("stdout:", stdout);
  if (stderr) console.error("stderr:", stderr);
}

export async function runBuild() {
  console.log("Running '" + BUILD_CMD + "'");
  await runCommand(BUILD_CMD);
  console.log("Built site.");
  console.log("To preview the built site, run '" + PREVIEW_CMD + "'. \n");
}
