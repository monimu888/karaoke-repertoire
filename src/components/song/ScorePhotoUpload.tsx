import { useRef } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import { Button } from '../common/Button'

interface ScorePhotoUploadProps {
  previewUrl: string | null
  loading: boolean
  error: string | null
  onSelectImage: (file: File) => void
  onClear: () => void
}

export function ScorePhotoUpload({
  previewUrl,
  loading,
  error,
  onSelectImage,
  onClear,
}: ScorePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onSelectImage(file)
    }
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        得点写真
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="得点写真"
            className="w-full rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full py-8 border-2 border-dashed border-gray-300 flex flex-col items-center gap-2"
        >
          {loading ? (
            <Loader2 size={32} className="animate-spin text-gray-400" />
          ) : (
            <>
              <Camera size={32} className="text-gray-400" />
              <span className="text-gray-500">タップして写真を選択</span>
            </>
          )}
        </Button>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
