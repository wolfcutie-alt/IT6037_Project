import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './src/routers/user.js';
import articleRouter from './src/routers/article.js';
import { verifyToken } from './src/middleware/verifyToken.js';
dotenv.config();

const PORT = process.env.PORT || 3001;
const dbURL = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@assessment.mytzgmp.mongodb.net/school`;
const app = express();

app.use(express.json());
app.use(cors());

// Public routes (no authentication required)
app.use('/auth', userRouter);

// Protected routes (authentication required)
app.use('/articles', verifyToken, articleRouter);

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log('Connected to database successfully!!!');
    } catch (error) {
        console.error(`Cannot connect to database: ${error.message}`);
        process.exit(1); 
    }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});