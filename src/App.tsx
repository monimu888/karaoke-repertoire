import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import {
  HomePage,
  AddSongPage,
  SongDetailPage,
  EditSongPage,
  TagManagePage,
} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddSongPage />} />
          <Route path="/song/:id" element={<SongDetailPage />} />
          <Route path="/song/:id/edit" element={<EditSongPage />} />
          <Route path="/tags" element={<TagManagePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
