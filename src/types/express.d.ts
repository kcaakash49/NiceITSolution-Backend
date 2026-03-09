// types/express.d.ts
declare namespace Express {
    interface Request {
      userId: string;  // user ID from auth middleware
      role?: string;    // optional: user role
    }
  }
  