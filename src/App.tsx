import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const AddSongPage = lazy(() => import('./pages/AddSongPage').then(m => ({ default: m.AddSongPage })))
const SongDetailPage = lazy(() => import('./pages/SongDetailPage').then(m => ({ default: m.SongDetailPage })))
const EditSongPage = lazy(() => import('./pages/EditSongPage').then(m => ({ default: m.EditSongPage })))
const TagManagePage = lazy(() => import('./pages/TagManagePage').then(m => ({ default: m.TagManagePage })))

function PageFallback() {
  return (
    <div className="p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-12 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

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
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddSongPage />} />
          <Route path="/song/:id" element={<SongDetailPage />} />
          <Route path="/song/:id/edit" element={<EditSongPage />} />
          <Route path="/tags" element={<TagManagePage />} />
        </Routes>
      </Suspense>
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
