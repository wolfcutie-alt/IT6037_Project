"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, User, LogOut, Settings, ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

type Article = {
  _id: string | number;
  title: string;
  category: string;
  author: string;
  content: string;
  createdAt: string;
  developer: string;
}

export default function ManagePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState("")
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchUserRoleAndRedirect = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) return;
  
      try {
        const response = await fetch(`http://localhost:3000/auth/role/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUserRole(data.role);
  
        // Redirect if not tutor or admin
        if (data.role !== "tutor" && data.role !== "admin") {
          router.push("/articles");
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
  
    fetchUserRoleAndRedirect();
  }, [router]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/articles`, {
          headers: {
            'Authorization': `${token}`
          }
        });
        const data = await response.json();
        setArticles(
          Array.isArray(data)
            ? data.map((item) => ({
                _id: item._id,
                title: item.name,
                category: item.category,
                author: item.author || "",
                content: item.about,
                createdAt: item.createdAt || "",
                developer: item.developer || ""
              }))
            : []
        );
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, [])

  const handleDelete = async (articleId: string) => {
    if (userRole !== 'admin') return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/articles/${articleId}`,
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      // Option 1: Reload the page to refresh articles
      window.location.reload();
      // Option 2: You could refetch articles here if you have a fetchArticles function
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  if (userRole !== "tutor" && userRole !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/articles">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold">Article Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant="secondary">{userRole}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Article Button */}
        <div className="mb-8">
          <Link href="/manage/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Article
            </Button>
          </Link>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article: Article) => (
            <Card
              key={article._id}
              className="border-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all duration-200"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>By {article.author || article.developer || "None"}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/manage/edit/${article._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {userRole === "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(String(article._id))}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No articles yet</h3>
            <p className="text-sm text-muted-foreground">Start by adding your first article to the system.</p>
          </div>
        )}
      </main>
    </div>
  )
}
