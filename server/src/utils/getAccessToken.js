import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const getAccessToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1y' });
}