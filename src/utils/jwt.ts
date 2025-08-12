import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string; // Change in prod

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export const generateToken = ({ userId, email, role, name }: TokenPayload) => {
  return jwt.sign({ userId, email, role, name }, JWT_SECRET, { expiresIn: '2h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
