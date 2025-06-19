"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useArticles } from "@/contexts/articles-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ArrowLeft, User, LogOut, Settings, Calendar, MapPin, Award } from "lucide-react"
import Link from "next/link"

interface ArticleDetailPageProps {
  params: Promise<{
    id: string
  }>
}

type Article = {
  _id: string;
  title: string;
  name?: string;
  category: string;
  author: string;
  content: string;
  about?: string;
  createdAt: string;
  type?: string;
  born?: string;
  designed_by?: string;
  developer?: string;
  died?: string;
  dimensions?: string;
  known_for?: string;
  location?: string;
  medium?: string;
  nationality?: string;
  notable_work?: string;
  year?: string;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { user, logout } = useAuth()
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const resolvedParams = use(params);
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        
        const response = await fetch(`http://localhost:3000/articles`, {
          headers: {
            'Authorization': `${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
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
                type: item.type || "",
                born: item.born || "",
                designed_by: item.designed_by || "",
                developer: item.developer || "",
                died: item.died || "",
                dimensions: item.dimensions || "",
                known_for: item.known_for || "",
                location: item.location || "",
                medium: item.medium || "",
                nationality: item.nationality || "",
                notable_work: item.notable_work || "",
                year: item.year || ""
              }))
            : []
        );
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

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

  useEffect(() => {
    // Only redirect if we have articles loaded and still can't find the article
    if (articles.length > 0) {
      const foundArticle = articles.find((a) => a._id === resolvedParams.id);
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        console.error(`Article with ID ${resolvedParams.id} not found`);
        router.push("/articles");
      }
    }
  }, [resolvedParams.id, articles, router]);

  if (!article) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    )
  }

  const canManageArticles = userRole === "tutor" || userRole === "admin"

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
                  Back to Articles
                </Button>
              </Link>
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold">Article Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant="secondary">{user?.role}</Badge>
              </div>
              {canManageArticles && (
                <Link href="/manage">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <Card className="border-blue-100 shadow-lg mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {article.category}
                  </Badge>
                  {article.type && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {article.type}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl sm:text-3xl mb-2">{article.title}</CardTitle>
                <CardDescription className="text-base">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By {article.author || "NonRemo"}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card className="border-blue-100 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{article.content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Article Metadata */}
        <Card className="border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Article Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-sm text-gray-900">{article.name || article.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">About</label>
                    <p className="text-sm text-gray-900">{article.about || "No description available"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-sm text-gray-900">{article.type || "Article"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Year</label>
                    <p className="text-sm text-gray-900">{article.year || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Additional Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Known For</label>
                    <p className="text-sm text-gray-900">{article.known_for || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notable Work</label>
                    <p className="text-sm text-gray-900">{article.notable_work || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nationality</label>
                    <p className="text-sm text-gray-900">{article.nationality || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      {article.location && <MapPin className="h-3 w-3" />}
                      {article.location || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-700">Technical Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Developer</label>
                    <p className="text-sm text-gray-900">{article.developer || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Designed By</label>
                    <p className="text-sm text-gray-900">{article.designed_by || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Medium</label>
                    <p className="text-sm text-gray-900">{article.medium || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dimensions</label>
                    <p className="text-sm text-gray-900">{article.dimensions || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Biographical Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-700">Biographical Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Born</label>
                    <p className="text-sm text-gray-900">{article.born || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Died</label>
                    <p className="text-sm text-gray-900">{article.died || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Article ID */}
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Article ID:</span> {article._id}
            </div>
          </CardContent>
        </Card>

        {/* Edit Button for Tutors/Admins */}
        {canManageArticles && (
          <div className="mt-8 flex justify-center">
            <Link href={`/manage/edit/${article._id}`}>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Edit Article
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
