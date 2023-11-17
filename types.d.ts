import { Request } from 'express';
import IUser from './src/authentication/Models'

// declare module 'express' {
//     export interface Request {
//         user: IUser; // Or replace 'any' with the specific type you expect here
//     }
// }

declare global {
    namespace Express {
      interface Request {
        user: IUser;
      }
    }
  }