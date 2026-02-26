import { FileText, Share2, Download, MoreVertical, Star, Lock } from 'lucide-react';
import { useState } from 'react';

interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  size: string;
  dateModified: string;
  status: 'Active' | 'Review' | 'Draft' | 'Archived';
  department: string;
  author: string;
  icon: string;
  color: string;
}

const statusConfig = {
  Active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  Review: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  Draft: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  Archived: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
};

export default function DocumentCard({
  id,
  title,
  description,
  type,
  size,
  dateModified,
  status,
  department,
  author,
  icon,
  color,
}: DocumentCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
      {/* Header with Gradient */}
      <div className={`relative h-20 bg-gradient-to-br ${color} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-white" />
        <div className="relative h-full flex items-center justify-between px-4">
          <span className="text-3xl">{icon}</span>
          <Lock size={16} className="text-white opacity-60" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">By {author}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Star
                size={16}
                className={`transition-colors ${
                  isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                }`}
              />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical size={16} className="text-gray-400" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors">
                    Preview
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors">
                    Share
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors border-t border-gray-200 text-red-600">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{description}</p>

        {/* Status and Type */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
              statusConfig[status].bg
            } ${statusConfig[status].text} ${statusConfig[status].border}`}
          >
            {status}
          </span>
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {type}
          </span>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-gray-500">Modified</p>
            <p className="font-medium text-gray-900">{dateModified}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Size</p>
            <p className="font-medium text-gray-900">{size}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors">
            <Download size={14} />
            Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium transition-colors">
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
