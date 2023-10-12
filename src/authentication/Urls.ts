import express, { Router, Request, Response, NextFunction } from 'express';
import { signupUser, loginUser, fetchUser } from './Views';

interface IRequestWithUser extends Request {
    user?: any;  // Or replace 'any' with the specific type you expect here
}

const router: Router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
    signupUser(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
    loginUser(req, res);
});

router.post("/test", fetchUser, async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    let user = req.user;
    console.log(user.email);  // Assuming `user` has a property `email`
    res.send("inside auth api");
});
 
export default router;
