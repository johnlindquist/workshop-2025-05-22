interface NoteCardProps {
  title: string
  content: string
  color?: string
  textColor?: string
}

export default function NoteCard({ title, content, color = "bg-white", textColor = "text-slate-700" }: NoteCardProps) {
  return (
    <div
      className={`rounded-3xl ${color} p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={textColor}
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </div>
      </div>
      <p className={`${textColor} opacity-90`}>{content}</p>

      <div className="mt-4 pt-3 border-t border-white/30 flex justify-between">
        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={textColor}
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={textColor}
            >
              <rect width="18" height="18" x="3" y="3" rx="8" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </button>
        </div>
        <span className={`text-xs ${textColor} opacity-70`}>Just now</span>
      </div>
    </div>
  )
}
