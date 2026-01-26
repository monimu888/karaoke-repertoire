import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA_d-lqGX2OUMOK1aOnCUgibVSgzxJDQIg",
  authDomain: "karaoke-repertoire.firebaseapp.com",
  projectId: "karaoke-repertoire",
  storageBucket: "karaoke-repertoire.firebasestorage.app",
  messagingSenderId: "169220302989",
  appId: "1:169220302989:web:b52c401ffe88a5688bdac4"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
