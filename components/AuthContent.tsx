"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

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
      router.push("/dashboard")
    } else {
      await login(email, password)
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isRegistering ? "Sign Up" : "Sign In"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-80 space-y-4">
        {isRegistering && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {isRegistering ? "Register" : "Sign In"}
        </button>
      </form>
      <button
        onClick={loginWithGoogle}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Sign in with Google
      </button>
      <p
        className="mt-4 cursor-pointer text-blue-600"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering
          ? "Already have an account? Sign In"
          : "No account? Sign Up"}
      </p>
    </div>
  )
}
