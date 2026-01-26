import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { Button, Input, StarRating, TagBadge, Modal, ConfirmDialog } from './components/common'
import { PRESET_TAGS } from './types'

function DemoPage() {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="p-4 space-y-6">
      <section>
        <h2 className="text-lg font-bold mb-3">Button</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Input</h2>
        <div className="space-y-3">
          <Input label="曲名" placeholder="曲名を入力" />
          <Input label="アーティスト" placeholder="アーティスト名" error="必須項目です" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">StarRating</h2>
        <div className="flex items-center gap-4">
          <StarRating value={rating} onChange={setRating} />
          <span className="text-gray-600">得意度: {rating}</span>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">TagBadge</h2>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map((tag) => (
            <TagBadge key={tag.name} name={tag.name} color={tag.color} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Modal / ConfirmDialog</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowModal(true)}>モーダルを開く</Button>
          <Button variant="danger" onClick={() => setShowConfirm(true)}>削除確認</Button>
        </div>
      </section>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="モーダルタイトル">
        <p>これはモーダルの内容です。</p>
        <div className="mt-4">
          <Button onClick={() => setShowModal(false)}>閉じる</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => alert('削除しました')}
        title="削除確認"
        message="この曲を削除しますか？この操作は取り消せません。"
        confirmText="削除"
      />
    </div>
  )
}

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
          <Route path="/" element={<DemoPage />} />
          <Route path="/add" element={<PlaceholderPage title="曲追加" />} />
          <Route path="/tags" element={<PlaceholderPage title="タグ管理" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
