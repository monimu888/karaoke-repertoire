import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useFirestoreTags } from '../hooks/useFirestoreTags'
import { useFirestoreSongs } from '../hooks/useFirestoreSongs'
import { useAuthContext } from '../contexts/AuthContext'
import type { Tag } from '../types'

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#6366F1', '#8B5CF6', '#EC4899', '#06B6D4',
]

export function TagManagePage() {
  const { user } = useAuthContext()
  const { tags, addTag, updateTag, deleteTag } = useFirestoreTags(user?.uid)
  const { songs } = useFirestoreSongs(user?.uid)

  const songsWithTagSet = useMemo(() => {
    const tagIds = new Set<string>()
    for (const song of songs) {
      for (const tagId of song.tags) {
        tagIds.add(tagId)
      }
    }
    return tagIds
  }, [songs])

  const isTagUsed = (tagId: string) => {
    return songsWithTagSet.has(tagId)
  }
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null)
  const [deleteWarning, setDeleteWarning] = useState('')

  const handleAddStart = () => {
    setIsAdding(true)
    setNewName('')
    setNewColor(PRESET_COLORS[0])
  }

  const handleAddSave = async () => {
    if (!newName.trim()) return
    await addTag({ name: newName.trim(), color: newColor })
    setIsAdding(false)
    setNewName('')
  }

  const handleEditStart = (tag: Tag) => {
    setEditingId(tag.id)
    setNewName(tag.name)
    setNewColor(tag.color)
  }

  const handleEditSave = async () => {
    if (!editingId || !newName.trim()) return
    await updateTag(editingId, { name: newName.trim(), color: newColor })
    setEditingId(null)
    setNewName('')
  }

  const handleDeleteClick = (tag: Tag) => {
    const used = isTagUsed(tag.id)
    if (used) {
      setDeleteWarning('このタグは曲に使用されています。削除すると曲からも削除されます。')
    } else {
      setDeleteWarning('')
    }
    setDeleteTarget(tag)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await deleteTag(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">タグ管理</h2>
        {!isAdding && (
          <Button size="sm" onClick={handleAddStart}>
            <Plus size={18} className="mr-1" />
            追加
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <Input
            label="タグ名"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="例: 定番"
            autoFocus
          />
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カラー
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className={`w-8 h-8 rounded-full ${
                    newColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="flex-1"
            >
              <X size={18} className="mr-1" />
              キャンセル
            </Button>
            <Button
              size="sm"
              onClick={handleAddSave}
              disabled={!newName.trim()}
              className="flex-1"
            >
              <Check size={18} className="mr-1" />
              追加
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-white rounded-lg shadow p-3 flex items-center gap-3"
          >
            {editingId === tag.id ? (
              <>
                <div className="flex-1 space-y-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewColor(color)}
                        className={`w-6 h-6 rounded-full ${
                          newColor === color ? 'ring-2 ring-offset-1 ring-indigo-500' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={!newName.trim()}
                  className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full disabled:opacity-50"
                >
                  <Check size={20} />
                </button>
              </>
            ) : (
              <>
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1 font-medium">{tag.name}</span>
                <button
                  onClick={() => handleEditStart(tag)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(tag)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {tags.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          タグがありません
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="タグを削除"
        message={
          deleteWarning ||
          `「${deleteTarget?.name}」を削除しますか？`
        }
        confirmText="削除"
      />
    </div>
  )
}
