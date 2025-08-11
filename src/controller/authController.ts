import { Request, Response } from "express";
import { SignInSchema, SignUpSchema } from "../validators/auth.js";
import prisma from "../db/db.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/hash.js";

export const signup = async (req: Request, res: Response) => {
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

  const token = generateToken(user.id);
  res
    .status(201)
    .json({ token, user: { id: user.id, email: user.email, name: user.name } });
};

export const signIn = async (req: Request, res: Response) => {
  const result = SignInSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  const { email, password } = result.data;

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
};
