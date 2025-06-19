import Article from "../models/ArticleModel.js";
import mongoose from "mongoose";

export const createArticle = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if article with the same name already exists
        const existingArticle = await Article.findOne({ name });
        if (existingArticle) {
            return res.status(400).json({ message: "Article already exists" });
        }

        // Only include fields that are present in the request
        const allowedFields = [
            "name", "type", "category", "nationality", "about", "born", "died",
            "known_for", "designed_by", "medium", "dimensions", "location",
            "developer", "notable_work", "year"
        ];

        const articleData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                articleData[field] = req.body[field];
            }
        }

        const article = new Article(articleData);
        await article.save();

        res.status(201).json(article);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getAllArticles = async (req, res) => {
    const articles = await Article.find();
    res.status(200).json(articles);
}

export const getArticle = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid article ID"});
    }
    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({message: "Article not found"});
    }
    res.status(200).json(article);
}

export const updateArticle = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
    }

    const updateFields = {};

    // Only add properties that are provided in the request body
    const allowedFields = [
        "name", "type", "category", "nationality", "about", "born", "died",
        "known_for", "designed_by", "medium", "dimensions", "location",
        "developer", "notable_work", "year"
    ];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field];
        }
    }

    try {
        const article = await Article.findByIdAndUpdate(id, updateFields, { new: true });

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.status(200).json(article);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


export const deleteArticle = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid article ID"});
    }
    const article = await Article.findByIdAndDelete(id);
    res.status(200).json({message: "Article deleted successfully"});
    if (!article) {
        return res.status(404).json({message: "Article not found"});
    }
}