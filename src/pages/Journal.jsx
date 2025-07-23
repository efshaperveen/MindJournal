import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiFilter, FiX } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'
import { useJournal } from '../contexts/JournalContext'
import EntryCard from '../components/journal/EntryCard'
import MoodIcon from '../components/journal/MoodIcon'

const moodOptions = ['great', 'good', 'okay', 'bad', 'awful']

const Journal = () => {
  const { entries, deleteEntry } = useJournal()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    mood: [],
    search: '',
  })
  const [showMoodDropdown, setShowMoodDropdown] = useState(false)
  const dropdownRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMoodDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleFilters = () => setShowFilters(prev => !prev)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const toggleMoodFilter = (mood) => {
    setFilters(prev => ({
      ...prev,
      mood: prev.mood.includes(mood)
        ? prev.mood.filter(m => m !== mood)
        : [...prev.mood, mood],
    }))
  }

  const clearFilters = () => {
    setFilters({ mood: [], search: '' })
    setShowMoodDropdown(false)
  }

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (filters.mood.length > 0 && !filters.mood.includes(entry.mood)) {
        return false
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        return (
          entry.title.toLowerCase().includes(searchTerm) ||
          entry.content.toLowerCase().includes(searchTerm)
        )
      }
      return true
    })
  }, [entries, filters])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntry(id)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">Journal</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
          </p>
        </div>

        <div className="flex space-x-2">
          {/* Filter Toggle */}
          <button
            onClick={toggleFilters}
            className={`btn btn-outline flex items-center space-x-2 ${
              showFilters || filters.mood.length > 0 || filters.search
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700'
                : ''
            }`}
            aria-expanded={showFilters}
          >
            <FiFilter size={18} />
            <span>Filter</span>
            {(filters.mood.length > 0 || filters.search) && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-xs">
                {filters.mood.length + (filters.search ? 1 : 0)}
              </span>
            )}
          </button>

          {/* New Entry */}
          <Link to="/journal/new" className="btn btn-primary flex items-center space-x-2">
            <FiPlus size={18} />
            <span>New Entry</span>
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="card p-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 flex items-center"
              >
                <FiX size={16} className="mr-1" />
                Clear all
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="input"
                  placeholder="Search entries..."
                />
              </div>

              {/* Mood Dropdown */}
              <div className="relative sm:w-64" ref={dropdownRef}>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Mood
                </label>
                <button
                  onClick={() => setShowMoodDropdown(!showMoodDropdown)}
                  className="w-full input text-left flex justify-between items-center"
                >
                  <span>
                    {filters.mood.length > 0 ? `${filters.mood.length} selected` : 'All moods'}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showMoodDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showMoodDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute z-20 mt-1 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg p-2 space-y-2 max-h-60 overflow-y-auto"
                    >
                      {moodOptions.map(mood => (
                        <label
                          key={mood}
                          className="flex items-center gap-2 px-2 py-1 text-sm text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded cursor-pointer capitalize"
                        >
                          <input
                            type="checkbox"
                            checked={filters.mood.includes(mood)}
                            onChange={() => toggleMoodFilter(mood)}
                          />
                          <div className="flex items-center gap-1">
                            <MoodIcon mood={mood} size={16} />
                            {mood}
                          </div>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entry List */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          {entries.length > 0 ? (
            <>
              <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                No entries match your filters
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button onClick={clearFilters} className="btn btn-outline">
                Clear filters
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                Your journal is empty
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Create your first entry to start your journaling journey
              </p>
              <Link to="/journal/new" className="btn btn-primary">
                Create first entry
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Journal
