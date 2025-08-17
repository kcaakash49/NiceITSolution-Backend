import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET; // Change in prod
console.log("JWT SECRET", JWT_SECRET);
console.log("DATABASE_URl", process.env.DATABASE_URL);
export const generateToken = ({ userId, email, role, name }) => {
    return jwt.sign({ userId, email, role, name }, JWT_SECRET, { expiresIn: '2h' });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
