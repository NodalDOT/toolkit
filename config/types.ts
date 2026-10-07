export type Env = Record<string, string>;

export type AppConfig = {
  port: number;
  base: string;
  githubUrl: string;
  githubName: string;
};
