declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      /**
       * This is a base URL that the application will use to communicate to the server
       */
      REACT_APP_API_BASE_URL: string;
    }
  }
}

export {};
