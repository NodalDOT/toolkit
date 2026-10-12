export type Env = Record<string, string>;

export type StorageKeys = {
  theme: string;
  sidebar: string;
  navGroups: string;
};

export type AppConfig = {
  port: number;
  base: string;
  githubUrl: string;
  githubName: string;
  defaultTheme: "dark" | "light";
  storageKeys: StorageKeys;
};
