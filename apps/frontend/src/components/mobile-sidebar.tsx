"use client"

import { useState } from "react"
import { Menu, X, LightbulbIcon, Bell, Tag, Archive, Trash2, Rocket, Zap, Star } from "lucide-react"

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-cyan-900/20 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-cyan-100 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-cyan-100">
              <div className="flex items-center">
                <div className="mr-2 h-10 w-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full shadow-lg">
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
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-3">
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md shadow-cyan-200/50"
                  >
                    <LightbulbIcon className="mr-4 h-5 w-5" />
                    <span className="font-medium">Notes</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-cyan-50 transition-colors"
                  >
                    <Bell className="mr-4 h-5 w-5 text-pink-500" />
                    <span>Reminders</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-pink-50 transition-colors"
                  >
                    <Rocket className="mr-4 h-5 w-5 text-purple-500" />
                    <span>Inspiration</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-yellow-50 transition-colors"
                  >
                    <Star className="mr-4 h-5 w-5 text-yellow-500" />
                    <span>Personal</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-purple-50 transition-colors"
                  >
                    <Zap className="mr-4 h-5 w-5 text-cyan-500" />
                    <span>Work</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-cyan-50 transition-colors"
                  >
                    <Tag className="mr-4 h-5 w-5 text-pink-500" />
                    <span>Edit labels</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-pink-50 transition-colors"
                  >
                    <Archive className="mr-4 h-5 w-5 text-purple-500" />
                    <span>Archive</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center rounded-full px-6 py-3 text-slate-700 hover:bg-yellow-50 transition-colors"
                  >
                    <Trash2 className="mr-4 h-5 w-5 text-yellow-500" />
                    <span>Trash</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
