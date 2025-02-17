"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react"
import { auth, db, googleProvider } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

interface User {
  uid: string
  name: string
  email: string
  role: "user" | "admin"
  orders: any[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            setUser(userDoc.data() as User)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const register = async (name: string, email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    const newUser: User = {
      uid: user.uid,
      name,
      email,
      role: "user",
      orders: []
    }
    await setDoc(doc(db, "users", user.uid), newUser)
    setUser(newUser)
  }

  const login = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, "users", user.uid))
    if (userDoc.exists()) {
      setUser(userDoc.data() as User)
    }
  }

  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider)
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      const newUser: User = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        role: "user",
        orders: []
      }
      await setDoc(doc(db, "users", user.uid), newUser)
      setUser(newUser)
    } else {
      setUser(userDoc.data() as User)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) as AuthContextType
