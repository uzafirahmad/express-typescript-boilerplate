import express, { Router, Request, Response, NextFunction } from 'express';
import { signupUser, loginUser, fetchUser, verify, getToken } from './Views';

const router: Router = express.Router();

//payload must have username, email, confirm password and password
router.post("/register", async (req: Request, res: Response) => {
    signupUser(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
    loginUser(req, res);
});

//payload must have refreshToken
router.post("/gettoken", async (req, res) => {
    getToken(req,res)
});

//payload must have acesstoken
router.post("/verify", async (req, res) => {
    verify(req,res)
});

router.post("/test", fetchUser, async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    console.log(user.email);  // Assuming `user` has a property `email`
    res.send("inside auth api");
});
 
export default router;
