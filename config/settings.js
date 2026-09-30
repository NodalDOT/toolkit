const DEFAULTS = {
  port: 3000,
  base: "./",
  githubUrl: "https://github.com/NodalDOT/toolkit",
  githubName: "NodalDOT",
};

export const getSettings = (env = process.env) => ({
  port: Number(env.PORT) || DEFAULTS.port,
  base: env.BASE_PATH || DEFAULTS.base,
  githubUrl: env.GITHUB_URL || DEFAULTS.githubUrl,
  githubName: env.GITHUB_NAME || DEFAULTS.githubName,
});
