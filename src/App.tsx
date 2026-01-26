import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { HomePage, AddSongPage, SongDetailPage, EditSongPage } from './pages'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-500 mt-2">このページは後で実装します</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddSongPage />} />
          <Route path="/song/:id" element={<SongDetailPage />} />
          <Route path="/song/:id/edit" element={<EditSongPage />} />
          <Route path="/tags" element={<PlaceholderPage title="タグ管理" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
