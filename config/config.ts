import { readEnv } from "./env.ts";
import type { AppConfig } from "./types.ts";

const parsePort = (value: string): number => {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer from 1 to 65535, got "${value}"`);
  }

  return port;
};

export const getConfig = (): AppConfig => {
  const env = readEnv();

  return {
    port: parsePort(env.PORT),
    base: "./",
    githubUrl: env.GITHUB_URL,
    githubName: env.GITHUB_NAME,
  };
};
