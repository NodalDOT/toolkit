import { getConfig } from "../config/index.ts";

export const getDefine = (): Record<string, string> => {
  const { githubUrl, githubName, defaultTheme, storageKeys } = getConfig();

  return {
    "import.meta.env.GITHUB_URL": JSON.stringify(githubUrl),
    "import.meta.env.GITHUB_NAME": JSON.stringify(githubName),
    "import.meta.env.DEFAULT_THEME": JSON.stringify(defaultTheme),
    "import.meta.env.THEME_STORAGE_KEY": JSON.stringify(storageKeys.theme),
    "import.meta.env.SIDEBAR_STORAGE_KEY": JSON.stringify(storageKeys.sidebar),
    "import.meta.env.NAV_GROUPS_STORAGE_KEY": JSON.stringify(
      storageKeys.navGroups,
    ),
  };
};
