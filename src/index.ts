import { IndexApp } from "./app";

const app = new IndexApp().getApp();
declare global {
    namespace Express {
      interface Request {
        user?: any;
        lang?: string;
      }
    }
  }
export { app };