import { getConfig } from "../../config/index.ts";

export const getDefine = (): Record<string, string> => {
  const { githubUrl, githubName } = getConfig();

  return {
    "import.meta.env.GITHUB_URL": JSON.stringify(githubUrl),
    "import.meta.env.GITHUB_NAME": JSON.stringify(githubName),
  };
};
