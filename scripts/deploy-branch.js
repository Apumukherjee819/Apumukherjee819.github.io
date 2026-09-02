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

  execSync("git init", { cwd: DIST_DIR, stdio: "inherit" });
  execSync("git checkout -b gh-pages", { cwd: DIST_DIR, stdio: "inherit" });
  execSync("git add .", { cwd: DIST_DIR, stdio: "inherit" });
  execSync('git commit -m "deploy: update academic portfolio live site"', { cwd: DIST_DIR, stdio: "inherit" });
  execSync("git config http.postBuffer 524288000", { cwd: DIST_DIR, stdio: "inherit" });
  execSync("git remote add origin https://github.com/Apumukherjee819/Apumukherjee819.github.io.git", { cwd: DIST_DIR, stdio: "inherit" });
  execSync("git push -f origin gh-pages", { cwd: DIST_DIR, stdio: "inherit" });
  fs.rmSync(gitDist, { recursive: true, force: true });
  console.log("🎉 Successfully deployed to gh-pages branch!");
} catch (err) {
  console.error("Deploy failed:", err.message);
  process.exit(1);
}
