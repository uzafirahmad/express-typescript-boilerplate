import User from "./Models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET: string = "298fhn98b87vh!@ERFE$G$%Rbrtrbh";

const fetchUser = (req: Request, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
        return;
    }

    try {
        const data: any = jwt.verify(token, JWT_SECRET);  // You might want to specify a more specific type than 'any' if you know the shape of your JWT payload.
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

const signupUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Both email and password are required." });
            return;
        }

        if (await User.findOne({ email })) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        } 

        const salt = await bcrypt.genSalt(10);
        const securepassword = await bcrypt.hash(password, salt);

        await User.create({
            email: email,
            password: securepassword,
        });

        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating user" });
    }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Both email and password are required." });
            return;
        }

        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
            const accesstoken = jwt.sign(payload, JWT_SECRET);
            res.status(201).json({ accesstoken });
        } else {
            res.status(500).json({ message: "Error Logging In" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error Logging In" });
    }
};

export {
    loginUser,
    fetchUser,
    signupUser,
};
