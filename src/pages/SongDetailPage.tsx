import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit2, Trash2, ArrowLeft } from 'lucide-react'
import { Button, StarRating, TagBadge, ConfirmDialog } from '../components/common'
import { useFirestoreSongs, useFirestoreSong, useFirestoreTags } from '../hooks'
import { useAuthContext } from '../contexts/AuthContext'

export function SongDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { song, loading } = useFirestoreSong(user?.uid, id)
  const { deleteSong } = useFirestoreSongs(user?.uid)
  const { tags } = useFirestoreTags(user?.uid)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Photo is now stored as URL directly in scorePhotoId
  const photoUrl = song?.scorePhotoId || null

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">曲が見つかりません</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          一覧に戻る
        </Button>
      </div>
    )
  }

  const songTags = tags.filter((tag) => song.tags.includes(tag.id))

  const handleDelete = async () => {
    await deleteSong(song.id, song.scorePhotoId)
    navigate('/')
  }

  return (
    <div className="p-4">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-gray-600 mb-4"
      >
        <ArrowLeft size={20} />
        <span>戻る</span>
      </button>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{song.title}</h1>
          <p className="text-gray-600">{song.artist}</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-500 block mb-1">得意度</span>
            <StarRating value={song.proficiency} readonly />
          </div>
          {song.highScore !== null && (
            <div>
              <span className="text-sm text-gray-500 block mb-1">最高得点</span>
              <span className="text-2xl font-bold text-indigo-600">
                {song.highScore}点
              </span>
            </div>
          )}
        </div>

        {song.key.adjustment !== 0 && (
          <div>
            <span className="text-sm text-gray-500 block mb-1">キー調整</span>
            <span className="text-lg">
              {song.key.adjustment > 0 ? '+' : ''}{song.key.adjustment}
            </span>
          </div>
        )}

        {songTags.length > 0 && (
          <div>
            <span className="text-sm text-gray-500 block mb-2">タグ</span>
            <div className="flex flex-wrap gap-2">
              {songTags.map((tag) => (
                <TagBadge key={tag.id} name={tag.name} color={tag.color} />
              ))}
            </div>
          </div>
        )}

        {song.memo && (
          <div>
            <span className="text-sm text-gray-500 block mb-1">メモ</span>
            <p className="text-gray-700 whitespace-pre-wrap">{song.memo}</p>
          </div>
        )}

        {photoUrl && (
          <div>
            <span className="text-sm text-gray-500 block mb-2">得点写真</span>
            <img
              src={photoUrl}
              alt="得点写真"
              className="w-full rounded-lg border border-gray-200"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={() => navigate(`/song/${song.id}/edit`)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Edit2 size={18} />
            編集
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            削除
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="曲を削除"
        message={`「${song.title}」を削除しますか？この操作は取り消せません。`}
        confirmText="削除"
      />
    </div>
  )
}
