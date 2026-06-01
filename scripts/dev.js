import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import build from "./build/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, "..");
const WATCH_DIRS = [path.join(ROOT_DIR, "base"), path.join(ROOT_DIR, "content")];
const WATCH_EXTENSIONS = new Set([".html", ".css", ".js", ".ejs"]);

let serverProcess = null;
let restartTimer = null;
let isRestarting = false;
let watchers = [];

const shouldHandleFile = (fileName) => {
  if (!fileName) {
    return true;
  }

  return WATCH_EXTENSIONS.has(path.extname(fileName));
};

const getDirectories = (startDir) => {
  const directories = [startDir];
  const entries = fs.readdirSync(startDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    directories.push(...getDirectories(path.join(startDir, entry.name)));
  }

  return directories;
};

const closeWatchers = () => {
  for (const watcher of watchers) {
    watcher.close();
  }

  watchers = [];
};

const refreshWatchers = () => {
  closeWatchers();

  for (const watchDir of WATCH_DIRS) {
    if (!fs.existsSync(watchDir)) {
      continue;
    }

    const directories = getDirectories(watchDir);

    for (const directory of directories) {
      const watcher = fs.watch(directory, (_eventType, fileName) => {
        if (!shouldHandleFile(fileName)) {
          return;
        }

        scheduleRestart();
      });

      watchers.push(watcher);
    }
  }
};

const startServer = () => {
  console.log("start server");

  serverProcess = spawn(process.execPath, ["index.js"], {
    cwd: ROOT_DIR,
    stdio: "inherit",
  });

  serverProcess.on("exit", () => {
    serverProcess = null;
  });
};

const stopServer = async () => {
  if (!serverProcess) {
    return;
  }

  const currentServer = serverProcess;

  await new Promise((resolve) => {
    currentServer.once("exit", resolve);
    currentServer.kill("SIGTERM");
  });
};

const rebuildAndRestart = async () => {
  if (isRestarting) {
    return;
  }

  isRestarting = true;

  try {
    console.log("server restart");
    refreshWatchers();
    build();
    await stopServer();
    startServer();
  } catch (error) {
    console.error(error);
  } finally {
    isRestarting = false;
  }
};

const scheduleRestart = () => {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    void rebuildAndRestart();
  }, 100);
};

const shutdown = async () => {
  clearTimeout(restartTimer);
  closeWatchers();
  await stopServer();
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

build();
refreshWatchers();
startServer();
