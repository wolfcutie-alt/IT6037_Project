import Article from "../models/ArticleModel.js";
import mongoose from "mongoose";

export const createArticle = async (req, res) => {
    const existingArticle = await Article.findOne({name: req.body.name});
    if (existingArticle) {
        return res.status(400).json({message: "Article already exists"});
    }
    const {name, type, category, nationality, about, born, died, known_for, designed_by, medium, dimensions, location, developer, notable_work, year} = req.body;
    const article = new Article({name, type, category, nationality, about, born, died, known_for, designed_by, medium, dimensions, location, developer, notable_work, year});
    await article.save();
    res.status(201).json(article);
}

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
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid article ID"});
    }
    const {name, type, category, nationality, about, born, died, known_for, designed_by, medium, dimensions, location, developer, notable_work, year} = req.body;
    const article = await Article.findByIdAndUpdate(id, {name, type, category, nationality, about, born, died, known_for, designed_by, medium, dimensions, location, developer, notable_work, year}, {new: true});
    res.status(200).json(article);
    if (!article) {
        return res.status(404).json({message: "Article not found"});
    }
}

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