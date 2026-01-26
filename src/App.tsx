import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import {
  HomePage,
  AddSongPage,
  SongDetailPage,
  EditSongPage,
  TagManagePage,
  LoginPage,
} from './pages'

function AppRoutes() {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddSongPage />} />
        <Route path="/song/:id" element={<SongDetailPage />} />
        <Route path="/song/:id/edit" element={<EditSongPage />} />
        <Route path="/tags" element={<TagManagePage />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
