import { User, BlacklistedToken, RefreshToken, IUser } from "./Models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import randomString from 'randomstring';

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

const signupUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { email, password, confirmPassword, username } = req.body;

        // Check if email, password, username, and confirmPassword are provided
        if (!email || !password || !confirmPassword || !username) {
            return res
                .status(400)
                .json({
                    message:
                        "Email, password, username, and confirm password are required.",
                });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters long, include at least 1 uppercase letter, and at least 1 special character.",
            });
        }

        if (await User.findOne({ email })) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        }
        else if (await User.findOne({ username })) {
            return res
                .status(400)
                .json({ message: "User with this username already exists." });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const securepassword = await bcrypt.hash(password, salt);

            await User.create({
                email: email,
                username: username,
                password: securepassword,
            });

            res.status(201).json({ message: "User created successfully" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating user" });
    }
};

const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Both email and password are required." });
            return;
        }

        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = {
                id: user.id,
                email: user.email,
                username: user.username
            }
            // Generate Refresh Token
            const refreshTokenString = randomString.generate(192);

            // Create a new refresh token document
            const refreshToken = new RefreshToken({
                refreshToken: refreshTokenString,
                user: user.id,
                // expires field will be automatically set to 10 days in the future
            });

            // Save the refresh token in the database
            await refreshToken.save();
            const accessToken = jwt.sign(payload, JWT_SECRET, {
              expiresIn: "5m",
            });
            res.status(201).json({ accessToken, refreshToken: refreshTokenString });
        }
        else {
            res.status(500).json({ message: "Error Logging In" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error Logging In" });
    }
};

const getToken = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { refreshToken } = req.body;
  
      // Check if refreshToken is provided
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required." });
      }
  
      // Check if the refreshToken is blacklisted
      const isBlacklisted = await BlacklistedToken.findOne({
        token: refreshToken,
      });
      if (isBlacklisted) {
        return res.status(401).json({ message: "Invalid refresh token." });
      }
  
      // Verify if the refreshToken exists in the database and is not expired
      // Also, retrieve the associated user
      const storedToken = await RefreshToken.findOne({ refreshToken }).populate('user');
  
      if (!storedToken || storedToken.expires < new Date()) {
        return res
          .status(401)
          .json({ message: "Refresh token expired or invalid." });
      }
  
      const user = storedToken.user as any;
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }
  
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
        // include any other user data needed in the token
      };
  
      // Generate new Access Token
      const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "5m" });
  
      // Generate new Refresh Token
      const newRefreshTokenString = randomString.generate(192);
  
      // Save the new Refresh Token in the database
      const newRefreshToken = new RefreshToken({
        refreshToken: newRefreshTokenString,
        user: user._id,
      });
      await newRefreshToken.save();
  
      // Blacklist the old refresh token
      const blacklistedToken = new BlacklistedToken({ token: refreshToken });
      await blacklistedToken.save();
  
      // Delete the old refresh token from the database
      await RefreshToken.deleteOne({ refreshToken });
  
      // Send new tokens to the client
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshTokenString,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

const verify = async (req: Request, res: Response): Promise<Response | void> => {
    const { accesstoken } = req.body;
    try {
      // Verify the token
      const decoded = jwt.verify(accesstoken, JWT_SECRET);
   
      // If verification is successful
      res.status(201).json({ valid: true, message: "Token is valid" });
    } catch (error) {
      // If verification fails
      res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
  };

export {
    loginUser,
    fetchUser,
    signupUser,
    verify,
    getToken,
};
