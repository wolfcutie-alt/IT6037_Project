"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ArrowLeft, User, LogOut, Save, X, FileText, Info, Calendar, MapPin } from "lucide-react"
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

export default function EditArticlePage({ params }: ArticleDetailPageProps) {
  const { user, logout } = useAuth()
  const [userRole, setUserRole] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const router = useRouter()
  const resolvedParams = use(params)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    type: "",
    name: "",
    about: "",
    born: "",
    designed_by: "",
    developer: "",
    died: "",
    dimensions: "",
    known_for: "",
    location: "",
    medium: "",
    nationality: "",
    notable_work: "",
    year: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [originalArticle, setOriginalArticle] = useState<Article | null>(null)

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
                title: item.title || item.name,
                name: item.name,
                category: item.category,
                author: item.author || "",
                content: item.content || item.about,
                about: item.about,
                createdAt: item.createdAt || "",
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
    if (articles.length === 0) return; // Wait until articles are loaded

    const article = articles.find((a) => a._id === resolvedParams.id)
    if (article) {
      setOriginalArticle(article)
      setFormData({
        title: article.title || "",
        content: article.content || "",
        category: article.category || "",
        name: article.name || "",
        about: article.about || "",
        born: article.born || "",
        designed_by: article.designed_by || "",
        developer: article.developer || "",
        died: article.died || "",
        dimensions: article.dimensions || "",
        known_for: article.known_for || "",
        location: article.location || "",
        medium: article.medium || "",
        nationality: article.nationality || "",
        notable_work: article.notable_work || "",
        year: article.year || "",
        type: article.type || "",
      })
    } else {
      router.push("/manage")
    }
  }, [articles, router, resolvedParams.id])

  const categories = ["Mathematics", "Technology", "Arts"]
  const types = ["Article", "Theory", "Theorem", "Biography", "Research", "Tutorial", "Review"]

  const updateArticle = async (id: string, articleData: Partial<Article>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`http://localhost:3000/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      throw new Error('Failed to update article');
    }

    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }

    if (!formData.content.trim()) {
      setError("Content is required")
      return
    }

    if (!formData.category) {
      setError("Category is required")
      return
    }

    setLoading(true)

    try {
      await updateArticle(resolvedParams.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        about: formData.about.trim(),
        name: formData.name.trim() || formData.title.trim(),
        category: formData.category,
        type: formData.type,
        born: formData.born,
        designed_by: formData.designed_by,
        developer: formData.developer,
        died: formData.died,
        dimensions: formData.dimensions,
        known_for: formData.known_for,
        location: formData.location,
        medium: formData.medium,
        nationality: formData.nationality,
        notable_work: formData.notable_work,
        year: formData.year
      })

      setSuccess("Article updated successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/manage")
      }, 1500)
    } catch (err) {
      setError("Failed to update article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (!originalArticle) return;

    const hasChanges = Object.keys(formData).some((key) => {
      const formValue = formData[key as keyof typeof formData];
      const originalValue = originalArticle[key as keyof Article] || "";
      return formValue !== originalValue;
    });

    if (hasChanges) {
      if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
        router.push("/manage")
      }
    } else {
      router.push("/manage")
    }
  }

  if (userRole !== "tutor" && userRole !== "admin") {
    return null
  }

  if (!originalArticle) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/manage">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Management
                </Button>
              </Link>
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold">Edit Article</h1>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle>Edit Article</CardTitle>
            <CardDescription>Update the article details and metadata below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="biographical" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Biographical
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Technical
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Article Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter article title"
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alternative name or title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select article type" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about">About</Label>
                    <Textarea
                      id="about"
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      placeholder="Brief description or summary"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Article Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your article content here..."
                      rows={12}
                      className="resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Main content of the article.</p>
                      <span className="text-xs text-muted-foreground">{formData.content.length} characters</span>
                    </div>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="known_for">Known For</Label>
                      <Input
                        id="known_for"
                        value={formData.known_for}
                        onChange={(e) => setFormData({ ...formData, known_for: e.target.value })}
                        placeholder="What is this known for?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notable_work">Notable Work</Label>
                      <Input
                        id="notable_work"
                        value={formData.notable_work}
                        onChange={(e) => setFormData({ ...formData, notable_work: e.target.value })}
                        placeholder="Notable works or achievements"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        placeholder="Nationality or origin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Geographic location"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="Year or time period"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Biographical Tab */}
                <TabsContent value="biographical" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="born">Born</Label>
                      <Input
                        id="born"
                        value={formData.born}
                        onChange={(e) => setFormData({ ...formData, born: e.target.value })}
                        placeholder="Birth date or period"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="died">Died</Label>
                      <Input
                        id="died"
                        value={formData.died}
                        onChange={(e) => setFormData({ ...formData, died: e.target.value })}
                        placeholder="Death date or period"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Technical Tab */}
                <TabsContent value="technical" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="developer">Developer</Label>
                      <Input
                        id="developer"
                        value={formData.developer}
                        onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                        placeholder="Developer or creator"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designed_by">Designed By</Label>
                      <Input
                        id="designed_by"
                        value={formData.designed_by}
                        onChange={(e) => setFormData({ ...formData, designed_by: e.target.value })}
                        placeholder="Designer or architect"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medium">Medium</Label>
                      <Input
                        id="medium"
                        value={formData.medium}
                        onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                        placeholder="Medium or material"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        placeholder="Size or dimensions"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Author Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Original Author:</span>
                  <span className="text-sm">{originalArticle.author}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last modified: {new Date(originalArticle.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 mt-6">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating Article..." : "Update Article"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
