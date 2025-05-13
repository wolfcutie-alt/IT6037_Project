import { Router } from "express";
import { createArticle, getArticle, updateArticle, deleteArticle, getAllArticles } from "../controllers/articles.js";

const router = Router();

router.post("/", createArticle);
router.get("/:id", getArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);
router.get("/", getAllArticles);

export default router;