import { Menu, RotateCcw, Grid3X3, Settings, Search } from "lucide-react"

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-cyan-100 relative z-20">
      <div className="flex items-center">
        <button className="mr-4 p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <div className="mr-2 h-10 w-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full shadow-lg shadow-cyan-200/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Cosmo Notes
          </span>
        </div>
      </div>
      <div className="relative flex-1 max-w-xl mx-4">
        <div className="flex items-center rounded-full bg-white border border-cyan-200 px-4 py-2 shadow-sm">
          <Search className="mr-2 h-5 w-5 text-cyan-400" />
          <input type="text" placeholder="Search" className="flex-1 bg-transparent outline-none text-slate-700" />
        </div>
      </div>
      <div className="flex items-center">
        <button className="p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors">
          <RotateCcw className="h-5 w-5" />
        </button>
        <button className="p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
          <Grid3X3 className="h-5 w-5" />
        </button>
        <button className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className="ml-2 h-10 w-10 overflow-hidden rounded-full border-2 border-cyan-300 shadow-lg shadow-cyan-200/50">
          <img src="/placeholder.svg?height=40&width=40" alt="User avatar" className="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  )
}
