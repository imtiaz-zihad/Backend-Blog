import {auth as betterAuth} from "../lib/auth.js"
import { NextFunction, Request, Response } from "express";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get user session from request
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authenticated" });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified, Please verify your email",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role as string,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
    };
    if (roles.length && !roles.includes(session.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden, You don't have permission to access this resource",
      });
    }

    //console.log("Session", session);

    next();
    } catch (error) {
       next(error); 
    }
  };
};

export default auth;