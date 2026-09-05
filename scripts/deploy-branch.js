import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const DIST_DIR = path.resolve(process.cwd(), "dist");

try {
  console.log("🚀 Deploying dist to gh-pages branch...");
  const gitDist = path.join(DIST_DIR, ".git");
  if (fs.existsSync(gitDist)) {
    fs.rmSync(gitDist, { recursive: true, force: true });
  }

  const normalizedDist = DIST_DIR.replace(/\\/g, "/");
  try {
    execSync(`git config --global --add safe.directory "${normalizedDist}"`, { stdio: "ignore" });
    execSync(`git config --global --add safe.directory *`, { stdio: "ignore" });
  } catch {}

  const gitCmd = (cmd) => execSync(`git -c safe.directory=* ${cmd}`, { cwd: DIST_DIR, stdio: "inherit" });

  gitCmd("init");
  gitCmd("checkout -b gh-pages");
  gitCmd('config user.name "Apumukherjee819"');
  gitCmd('config user.email "arpanmukherjeegithub2026@gmail.com"');
  gitCmd("config http.postBuffer 524288000");
  gitCmd("add .");
  gitCmd('commit -m "deploy: update academic portfolio live site"');
  gitCmd("remote add origin https://github.com/Apumukherjee819/Apumukherjee819.github.io.git");
  gitCmd("push -f origin gh-pages");
  
  if (fs.existsSync(gitDist)) {
    fs.rmSync(gitDist, { recursive: true, force: true });
  }
  console.log("🎉 Successfully deployed to gh-pages branch!");
} catch (err) {
  console.error("Deploy failed:", err.message);
  process.exit(1);
}
