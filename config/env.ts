import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { ROOT_DIR } from "./paths.ts";
import type { Env } from "./types.ts";

const ENV_FILE = path.join(ROOT_DIR, ".env");
const ENV_EXAMPLE_FILE = path.join(ROOT_DIR, ".env.example");

const parseEnvFile = (filePath: string) =>
  parseEnv(fs.readFileSync(filePath, "utf-8"));

export const readEnv = (): Env => {
  if (!fs.existsSync(ENV_EXAMPLE_FILE)) {
    throw new Error(
      `${ENV_EXAMPLE_FILE} not found: it defines the required env keys`,
    );
  }

  const requiredKeys = Object.keys(parseEnvFile(ENV_EXAMPLE_FILE));
  const env = {
    ...(fs.existsSync(ENV_FILE) ? parseEnvFile(ENV_FILE) : {}),
    ...process.env,
  };
  const missingKeys = requiredKeys.filter((key) => !env[key]?.trim());

  if (missingKeys.length) {
    throw new Error(
      `Missing env variables: ${missingKeys.join(", ")}. ` +
        "Copy .env.example to .env and fill them in, or set them in the environment.",
    );
  }

  return Object.fromEntries(
    requiredKeys.map((key) => [key, env[key]?.trim() ?? ""]),
  );
};
