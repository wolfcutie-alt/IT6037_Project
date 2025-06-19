"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "student" | "tutor" | "admin"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: "student" | "tutor" | "admin") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: User[] = [
  { id: "1", name: "John Student", email: "student@school.edu", role: "student" },
  { id: "2", name: "Jane Tutor", email: "tutor@school.edu", role: "tutor" },
  { id: "3", name: "Admin User", email: "admin@school.edu", role: "admin" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find((u) => u.email === email)
    if (!foundUser || password !== "password") {
      throw new Error("Invalid credentials")
    }

    setUser(foundUser)
    localStorage.setItem("user", JSON.stringify(foundUser))
  }

  const signup = async (name: string, email: string, password: string, role: "student" | "tutor" | "admin") => {
    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
    }

    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
