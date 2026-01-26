import { useState, useEffect, useCallback } from 'react'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null)
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました')
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setError(null)
      await firebaseSignOut(auth)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログアウトに失敗しました')
    }
  }, [])

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  }
}
