import { IUser } from './src/models/User';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DB_URL?: string;
      PORT?: number;
      TOKEN_SECRET?: string;
    }
  }

  namespace Express {
    export interface User extends IUser {
      id: string;
    }
  }
}
