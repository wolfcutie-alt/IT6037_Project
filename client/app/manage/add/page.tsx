"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useArticles } from "@/contexts/articles-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, ArrowLeft, User, LogOut, Save, X } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function AddArticlePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
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
  const [userRole, setUserRole] = useState("")

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

  const categories = ["Mathematics", "Technology", "Arts"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.name.trim()) {
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
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/articles/`, formData,
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      )

      setSuccess("Article created successfully!")

      // Reset form
      setFormData({
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

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/manage")
      }, 1500)
    } catch (err) {
      setError("Failed to create article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (formData.name || formData.content || formData.category) {
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
              <h1 className="text-xl font-semibold">Add New Article</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant="secondary">{user?.role}</Badge>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle>Create New Article</CardTitle>
            <CardDescription>Fill in the details below to create a new article for the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter a compelling title for your article"
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Choose a clear and descriptive title that summarizes your article.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for your article" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select the most appropriate category for your article.</p>
              </div>

              {/* Content */}
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
                  <p className="text-xs text-muted-foreground">
                    Write engaging and informative content for your readers.
                  </p>
                  <span className="text-xs text-muted-foreground">{formData.content.length} characters</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Author:</span>
                  <span className="text-sm">{user?.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">This article will be published under your name.</p>
              </div>

              {/* Alerts */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Creating Article..." : "Create Article"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-8 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg">Writing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use a clear and descriptive title that captures the essence of your article</li>
              <li>• Structure your content with proper paragraphs for better readability</li>
              <li>• Include relevant examples and explanations to support your points</li>
              <li>• Proofread your content before publishing to ensure accuracy</li>
              <li>• Choose the most appropriate category to help readers find your article</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
