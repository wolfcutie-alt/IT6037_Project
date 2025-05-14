import User from "../models/UserModel.js";
import bcrypt from 'bcryptjs';
import { getAccessToken } from '../utils/getAccessToken.js';
import mongoose from 'mongoose';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = new User({
            name,
            role: "student",
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // Generate token
        const token = getAccessToken(user);
        
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        
        // Generate token
        const token = getAccessToken(user);
        
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid user ID"});
        }
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid user ID"});
        }
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const token = getAccessToken(user);
        
        res.status(200).json({
            message: "Token refreshed successfully",
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};