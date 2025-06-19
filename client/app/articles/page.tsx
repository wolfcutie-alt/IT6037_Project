"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Article = {
  _id: string | number;
  title: string;
  category: string;
  author: string;
  content: string;
  createdAt: string;
  developer: string;
}

export default function ArticlesPage() {
  const { user, logout } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const router = useRouter();
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const fetchUserRole = async () => {
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
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
  
    fetchUserRole();
  }, []);

  // Compute categories from fetched articles
  const categories = [
    "all",
    ...Array.from(new Set(articles.map((article) => article.category)))
  ]

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
        console.log(data)
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

  useEffect(() => {
    let filtered = articles
    // Only apply search/filter for students
    if (userRole === "student") {
      if (searchTerm) {
        filtered = filtered.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.category.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }
      if (selectedCategory !== "all") {
        filtered = filtered.filter((article) => article.category === selectedCategory)
      }
    }
    setFilteredArticles(filtered)
  }, [searchTerm, selectedCategory, articles, user?.role])

  const canManageArticles = userRole === "tutor" || userRole === "admin"

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold">School Articles</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant="secondary">{userRole}</Badge>
              </div>
              {canManageArticles && (
                <Link href="/manage">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={() => {
                logout();
                router.push("/login")
              }}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter - Only for Students */}
        {userRole === "student" && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link key={article._id} href={`/articles/${article._id}`}>
              <Card className="hover:shadow-lg hover:shadow-blue-100 transition-all duration-200 border-blue-100 cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>By {article.author || article.developer || "None"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No articles found</h3>
            <p className="text-sm text-muted-foreground">
              {user?.role === "student" && (searchTerm || selectedCategory !== "all")
                ? "Try adjusting your search or filter criteria."
                : "No articles have been published yet."}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
