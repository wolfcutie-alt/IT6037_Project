"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Article {
  id: string
  title: string
  content: string
  category: string
  author: string
  createdAt: string
  // Additional metadata fields
  type?: string
  name?: string
  about?: string
  born?: string
  designed_by?: string
  developer?: string
  died?: string
  dimensions?: string
  known_for?: string
  location?: string
  medium?: string
  nationality?: string
  notable_work?: string
  year?: string
}

interface ArticlesContextType {
  articles: Article[]
  addArticle: (article: Omit<Article, "id" | "createdAt">) => Promise<void>
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined)

// Update the mock articles to include some of these fields
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Introduction to Quantum Physics",
    content:
      "Quantum physics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.",
    category: "Science",
    author: "Dr. Smith",
    createdAt: "2024-01-15T10:00:00Z",
    type: "Theory",
    name: "Quantum Physics Introduction",
    about:
      "A comprehensive introduction to the fundamental principles of quantum physics and its applications in modern science.",
    year: "2024",
    known_for: "Quantum mechanics fundamentals",
    nationality: "International",
  },
  {
    id: "2",
    title: "Advanced Calculus Concepts",
    content:
      "Calculus is a branch of mathematics focused on limits, functions, derivatives, integrals, and infinite series. This article explores advanced concepts in differential and integral calculus, including multivariable calculus and vector analysis.",
    category: "Mathematics",
    author: "Prof. Johnson",
    createdAt: "2024-01-14T14:30:00Z",
    type: "Theorem",
    name: "Pythagorean theorem",
    about:
      "In mathematics, the Pythagorean theorem, also known as Pythagoras' theorem, is a fundamental relation in Euclidean geometry.",
    year: "Ancient",
    known_for: "Mathematical relationships in right triangles",
    nationality: "Greek",
    born: "c. 570 BC",
    died: "c. 495 BC",
  },
  {
    id: "3",
    title: "Shakespeare and Modern Literature",
    content:
      "William Shakespeare's influence on modern literature cannot be overstated. His works continue to inspire writers, poets, and playwrights centuries after his death. This article examines how Shakespearean themes and techniques appear in contemporary works.",
    category: "Literature",
    author: "Dr. Williams",
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    title: "The Industrial Revolution Impact",
    content:
      "The Industrial Revolution was a period of major industrialization and innovation that took place during the late 1700s and early 1800s. It fundamentally changed the way people lived and worked, leading to significant social, economic, and technological changes.",
    category: "History",
    author: "Prof. Brown",
    createdAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "5",
    title: "Machine Learning Fundamentals",
    content:
      "Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.",
    category: "Technology",
    author: "Dr. Davis",
    createdAt: "2024-01-11T11:20:00Z",
  },
]

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    // Load articles from localStorage or use mock data
    const storedArticles = localStorage.getItem("articles")
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles))
    } else {
      setArticles(mockArticles)
      localStorage.setItem("articles", JSON.stringify(mockArticles))
    }
  }, [])

  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles)
    localStorage.setItem("articles", JSON.stringify(newArticles))
  }

  const addArticle = async (articleData: Omit<Article, "id" | "createdAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    const updatedArticles = [newArticle, ...articles]
    saveArticles(updatedArticles)
  }

  const updateArticle = async (id: string, articleData: Partial<Article>) => {
    const updatedArticles = articles.map((article) => (article.id === id ? { ...article, ...articleData } : article))
    saveArticles(updatedArticles)
  }

  const deleteArticle = async (id: string) => {
    const updatedArticles = articles.filter((article) => article.id !== id)
    saveArticles(updatedArticles)
  }

  return (
    <ArticlesContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle }}>
      {children}
    </ArticlesContext.Provider>
  )
}

export function useArticles() {
  const context = useContext(ArticlesContext)
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticlesProvider")
  }
  return context
}
