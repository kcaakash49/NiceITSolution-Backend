import { Request, Response } from "express";
import { SignInSchema, SignUpSchema } from "../validators/auth.js";
import prisma from "../db/db.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";


//Signup Controller
export const signup = async (req: Request, res: Response) => {
  try {
    const result = SignUpSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const { email, password, name, role } = result.data;

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: { email, passwordHash: hashed, name, role },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res
      .status(201)
      .json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Login Controller
export const signIn = async (req: Request, res: Response) => {
  try {
    const result = SignInSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }

    const { email, password } = result.data;

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Set token in HttpOnly cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in production
      sameSite: "lax", // or "strict", adjust as per your needs
      maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds, same as token expiry
      path: "/", // cookie available for entire domain
    });

    // Return user info only (no token in body)
    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


//Token Verification Controller
export const verifyCookie = async (req: Request, res: Response) => {
  try {
    // Get token from cookie instead of header

    console.log("Verify Token Called");
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const payload = verifyToken(token);
    res.json({
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role
      }
    })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};


//signout


export const signOut = async (req: Request, res: Response) => {
  console.log("Api called");
  try {

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // must match the path used when setting the cookie
    });

    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Signout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





// export const signup2 = async (req: Request, res: Response) => {
//   const result = SignUpSchema.safeParse(req.body);
//   if (!result.success) {
//     return res.status(400).json({ error: result.error.issues });
//   }

//   const { email, password, name, role } = result.data;

//   try {
//     const response = await prisma.$transaction(async (tx: P) => {
//       // Check if user already exists
//       const existing = await tx.adminUser.findUnique({ where: { email } });
//       if (existing) {
//         throw new Error('User already exists');
//       }

//       const hashed = await hashPassword(password);

//       // Create the user
//       const user = await tx.adminUser.create({
//         data: { email, passwordHash: hashed, name, role },
//       });

//       // Generate token (non-db operation)
//       const token = generateToken({
//         userId: user.id,
//         email: user.email,
//         role: user.role,
//         name: user.name,
//       });

//       return { token, user };
//     });

//     const { token, user } = response;

//     return res.status(201).json({
//       token,
//       user: { id: user.id, email: user.email, name: user.name },
//     });

//   } catch (error: any) {
//     console.error('Signup error:', error);

//     if (error.message === 'User already exists') {
//       return res.status(409).json({ error: error.message });
//     }

//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };
