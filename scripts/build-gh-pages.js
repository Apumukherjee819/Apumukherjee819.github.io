import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const PORT = 3456;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), "dist");
const PUBLIC_DIR = path.resolve(process.cwd(), ".output/public");

const routes = [
  "/",
  "/education",
  "/projects",
  "/resume",
  "/skills",
  "/positions",
  "/achievements",
  "/gallery",
  "/codeforces",
  "/github",
  "/blogs",
];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  console.log("🚀 Starting static site generation for GitHub Pages...");

  // 1. Prepare dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // 2. Start node server
  console.log("📦 Launching Nitro server on port", PORT);
  const server = spawn("node", [".output/server/index.mjs"], {
    env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1" },
    stdio: "inherit",
  });

  // Wait for server to become ready
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL + "/");
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {
      await delay(200);
    }
  }

  if (!ready) {
    server.kill();
    throw new Error("Server failed to start on port " + PORT);
  }

  console.log("✨ Server ready. Pre-rendering all routes...");

  // 3. Render and save each route
  for (const r of routes) {
    const url = BASE_URL + r;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ Failed to fetch route ${r}: ${res.status}`);
      continue;
    }
    const html = await res.text();

    if (r === "/") {
      fs.writeFileSync(path.join(DIST_DIR, "index.html"), html, "utf-8");
      fs.writeFileSync(path.join(DIST_DIR, "404.html"), html, "utf-8");
      console.log(`✅ Pre-rendered / -> dist/index.html & dist/404.html`);
    } else {
      const routeDir = path.join(DIST_DIR, r.slice(1));
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, "index.html"), html, "utf-8");
      fs.writeFileSync(path.join(DIST_DIR, `${r.slice(1)}.html`), html, "utf-8");
      console.log(`✅ Pre-rendered ${r} -> dist/${r.slice(1)}/index.html & dist/${r.slice(1)}.html`);
    }
  }

  // 4. Copy all static public assets
  console.log("📂 Copying assets and public documents into dist...");
  await copyDir(PUBLIC_DIR, DIST_DIR);

  // 5. Add .nojekyll so GitHub Pages serves _assets and dotfiles properly
  fs.writeFileSync(path.join(DIST_DIR, ".nojekyll"), "");
  console.log("📄 Added .nojekyll");

  // 6. Terminate server
  server.kill();
  console.log("🎉 Static export completed successfully in dist/");
  process.exit(0);
}

main().catch((err) => {
  console.error("Static export failed:", err);
  process.exit(1);
});
