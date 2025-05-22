'use client'

import { useState } from 'react'
import {
  Share2,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  ExternalLink,
  Copy,
} from 'lucide-react'
import { Task, taskUtils } from '@/lib/api'

interface NoteCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (id: string) => void
  onShare?: (id: string) => Promise<string | null>
  onUnshare?: (id: string) => Promise<boolean>
}

export default function NoteCard({
  task,
  onEdit,
  onDelete,
  onShare,
  onUnshare,
}: NoteCardProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(
    task.shareId ? taskUtils.generateShareUrl(task.shareId) : null,
  )

  const color = taskUtils.getTaskColor(task)
  const textColor = 'text-white'
  const isOverdue = task.isOverdue

  const handleShare = async () => {
    if (!onShare) return

    setIsSharing(true)
    try {
      if (task.isPublic && task.shareId) {
        // Task is already shared, copy URL
        const url = taskUtils.generateShareUrl(task.shareId)
        await navigator.clipboard.writeText(url)
        // You could show a toast notification here
      } else {
        // Share the task
        const url = await onShare(task.id)
        if (url) {
          setShareUrl(url)
          await navigator.clipboard.writeText(url)
          // You could show a toast notification here
        }
      }
    } catch (error) {
      console.error('Failed to share task:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleUnshare = async () => {
    if (!onUnshare) return

    try {
      const success = await onUnshare(task.id)
      if (success) {
        setShareUrl(null)
      }
    } catch (error) {
      console.error('Failed to unshare task:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className={`rounded-3xl ${color} p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg ${
        isOverdue ? 'ring-2 ring-red-500 ring-opacity-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${textColor} mb-1`}>
            {task.title}
          </h3>
          {isOverdue && task.dueDate && (
            <div className="flex items-center text-red-100 text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{taskUtils.formatDueDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-1">
          {task.isPublic && (
            <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
              <Share2 className="w-3 h-3 text-white" />
            </div>
          )}
          {isOverdue && (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {task.content && (
        <p className={`${textColor} opacity-90 mb-3`}>{task.content}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/20 text-white"
            >
              <Tag className="w-2 h-2 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Due date (if not overdue) */}
      {task.dueDate && !isOverdue && (
        <div className="flex items-center text-white/80 text-sm mb-3">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Due {taskUtils.formatDueDate(task.dueDate)}</span>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/30 flex justify-between items-center">
        <div className="flex space-x-2">
          {/* Edit button */}
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </button>

          {/* Share/Unshare button */}
          <button
            type="button"
            onClick={task.isPublic ? handleUnshare : handleShare}
            disabled={isSharing}
            className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors disabled:opacity-50"
            title={task.isPublic ? 'Unshare task' : 'Share task'}
          >
            {isSharing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : task.isPublic ? (
              <ExternalLink className="w-4 h-4 text-white" />
            ) : (
              <Share2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Copy share URL button (only if shared) */}
          {task.isPublic && task.shareId && (
            <button
              type="button"
              onClick={() => {
                const url = taskUtils.generateShareUrl(task.shareId!)
                navigator.clipboard.writeText(url)
              }}
              className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-white/40 transition-colors"
              title="Copy share URL"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
          )}

          {/* Delete button */}
          <button
            type="button"
            onClick={() => onDelete?.(task.id)}
            className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-red-400/40 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Timestamp */}
        <span className={`text-xs ${textColor} opacity-70`}>
          {formatDate(task.updatedAt)}
        </span>
      </div>
    </div>
  )
}
