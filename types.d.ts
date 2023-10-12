import { Request } from 'express';

declare module 'express' {
    export interface Request {
        user?: any; // Or replace 'any' with the specific type you expect here
    }
}
