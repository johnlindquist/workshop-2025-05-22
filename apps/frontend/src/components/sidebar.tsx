import {
  LightbulbIcon,
  Bell,
  Tag,
  Archive,
  Trash2,
  Rocket,
  Zap,
  Star,
} from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-cyan-100 overflow-y-auto hidden md:block relative z-10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-300 rounded-full filter blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-300 rounded-full filter blur-3xl opacity-10" />

      <nav className="p-3 relative z-10">
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md shadow-cyan-200/50 hover:shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-all w-full"
            >
              <LightbulbIcon className="mr-4 h-5 w-5" />
              <span className="font-medium">Notes</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-cyan-50 transition-colors w-full"
            >
              <Bell className="mr-4 h-5 w-5 text-pink-500" />
              <span>Reminders</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-pink-50 transition-colors w-full"
            >
              <Rocket className="mr-4 h-5 w-5 text-purple-500" />
              <span>Inspiration</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-yellow-50 transition-colors w-full"
            >
              <Star className="mr-4 h-5 w-5 text-yellow-500" />
              <span>Personal</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-purple-50 transition-colors w-full"
            >
              <Zap className="mr-4 h-5 w-5 text-cyan-500" />
              <span>Work</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-cyan-50 transition-colors w-full"
            >
              <Tag className="mr-4 h-5 w-5 text-pink-500" />
              <span>Edit labels</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-pink-50 transition-colors w-full"
            >
              <Archive className="mr-4 h-5 w-5 text-purple-500" />
              <span>Archive</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-yellow-50 transition-colors w-full"
            >
              <Trash2 className="mr-4 h-5 w-5 text-yellow-500" />
              <span>Trash</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
