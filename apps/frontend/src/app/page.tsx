import { Search } from 'lucide-react'
import NoteCard from '@/components/note-card'
import Sidebar from '@/components/sidebar'
import TopBar from '@/components/top-bar'

export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-indigo-50 to-purple-50 text-slate-800 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <TopBar />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 rounded-full bg-white border border-cyan-200 p-3 flex items-center shadow-lg shadow-cyan-100/50 backdrop-blur-sm">
              <div className="bg-cyan-500 text-white p-2 rounded-full mr-3">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Take a note..."
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <span className="sr-only">Checkbox</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Add checkbox"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                >
                  <span className="sr-only">Edit</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Edit note"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                >
                  <span className="sr-only">Image</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Add image"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="8" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NoteCard
                title="Three"
                content="Good job!"
                color="bg-gradient-to-br from-cyan-400 to-cyan-300"
                textColor="text-white"
              />
              <NoteCard
                title="Two"
                content="Another note"
                color="bg-gradient-to-br from-pink-400 to-pink-300"
                textColor="text-white"
              />
              <NoteCard
                title="One"
                content="Hello world"
                color="bg-gradient-to-br from-yellow-400 to-yellow-300"
                textColor="text-white"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
