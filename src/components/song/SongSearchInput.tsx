import { useState, useRef, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useItunesSearch, type ItunesTrack } from '../../hooks/useItunesSearch'

interface SongSearchInputProps {
  title: string
  artist: string
  onTitleChange: (value: string) => void
  onArtistChange: (value: string) => void
  onSelect: (track: ItunesTrack) => void
  titleError?: string
  artistError?: string
}

export function SongSearchInput({
  title,
  artist,
  onTitleChange,
  onArtistChange,
  onSelect,
  titleError,
  artistError,
}: SongSearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isManualMode, setIsManualMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { results, loading, clearResults } = useItunesSearch(title)

  // 外側クリックで候補を閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTitleChange = (value: string) => {
    onTitleChange(value)
    setIsManualMode(false)
    if (value.length >= 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSelect = (track: ItunesTrack) => {
    onTitleChange(track.trackName)
    onArtistChange(track.artistName)
    onSelect(track)
    setShowSuggestions(false)
    clearResults()
  }

  const handleManualInput = () => {
    setIsManualMode(true)
    setShowSuggestions(false)
    clearResults()
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {/* 曲名入力 */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          曲名
        </label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={() => {
              if (title.length >= 2 && results.length > 0 && !isManualMode) {
                setShowSuggestions(true)
              }
            }}
            placeholder="曲名を入力して検索"
            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              titleError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 size={20} className="animate-spin text-gray-400" />
            ) : (
              <Search size={20} className="text-gray-400" />
            )}
          </div>
        </div>
        {titleError && (
          <p className="mt-1 text-sm text-red-500">{titleError}</p>
        )}

        {/* 検索候補リスト */}
        {showSuggestions && !isManualMode && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {results.length > 0 ? (
              <>
                {results.map((track) => (
                  <button
                    key={track.trackId}
                    type="button"
                    onClick={() => handleSelect(track)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  >
                    {track.artworkUrl100 && (
                      <img
                        src={track.artworkUrl100}
                        alt=""
                        className="w-10 h-10 rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {track.trackName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {track.artistName}
                      </p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleManualInput}
                  className="w-full px-3 py-2 text-left text-indigo-600 hover:bg-indigo-50 text-sm font-medium"
                >
                  見つからない場合は手入力 →
                </button>
              </>
            ) : (
              !loading && title.length >= 2 && (
                <div className="p-3">
                  <p className="text-sm text-gray-500 mb-2">
                    該当する曲が見つかりません
                  </p>
                  <button
                    type="button"
                    onClick={handleManualInput}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    手入力で登録する →
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* アーティスト入力 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          アーティスト
        </label>
        <input
          type="text"
          value={artist}
          onChange={(e) => onArtistChange(e.target.value)}
          placeholder="アーティスト名"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            artistError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {artistError && (
          <p className="mt-1 text-sm text-red-500">{artistError}</p>
        )}
      </div>
    </div>
  )
}
