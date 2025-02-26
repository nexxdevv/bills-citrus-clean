"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuthPage() {
  const { login, register, loginWithGoogle, user } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegistering) {
      await register(name, email, password)
    } else {
      await login(email, password)
    }
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-12  text-gray-900">
      <div className="w-full max-w-md bg-lightMode p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-semibold text-center mb-6">
          {isRegistering ? "Create an Account" : "Welcome Back"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          )}
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full text-lg">
            {isRegistering ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <div className="mt-6 flex flex-col items-center space-y-3">
          <Button
            onClick={loginWithGoogle}
            className="w-full bg-gray-900 text-white hover:bg-gray-700"
          >
            Continue with Google
          </Button>
          <p
            className="text-gray-600 text-sm cursor-pointer hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </p>
        </div>
      </div>
    </div>
  )
}
