declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        GITHUB_ACCESS_TOKEN: string;
        OPENAI_API_KEY: string;
      }
    }
  }
}
