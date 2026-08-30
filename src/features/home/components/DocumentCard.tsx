import { FileText, Share2, Download, MoreVertical, Star, Lock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  Active: { bg: 'bg-success/10', text: 'text-success', border: 'border-success' },
  Review: { bg: 'bg-info/10', text: 'text-info', border: 'border-info' },
  Draft: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
  Archived: { bg: 'bg-secondary', text: 'text-secondary-foreground', border: 'border-border' },
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
  const { t } = useTranslation(['home', 'common']);
  const statusLabels: Record<DocumentCardProps['status'], string> = {
    Active: t('common:status.active'),
    Review: t('home:documentCard.status.review'),
    Draft: t('common:status.draft'),
    Archived: t('common:status.archived'),
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-border hover:shadow-lg transition-all duration-300 group">
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
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{t('home:documentCard.by', { author })}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1.5 hover:bg-accent rounded-lg transition-colors"
            >
              <Star
                size={16}
<<<<<<< Updated upstream
                className={`transition-colors ${
                  isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                }`}
=======
                className={`transition-colors ${isFavorite ? 'fill-warning text-warning' : 'text-muted-foreground'
                  }`}
>>>>>>> Stashed changes
              />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors"
              >
                <MoreVertical size={16} className="text-muted-foreground" />
              </button>
              {showMenu && (
<<<<<<< Updated upstream
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors">
                    Preview
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors">
                    Share
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors border-t border-gray-200 text-red-600">
                    Delete
=======
                <div className="absolute end-0 mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg z-10">
                  <button className="w-full text-start px-3 py-2 text-xs hover:bg-accent transition-colors">
                    {t('common:actions.pin')}
>>>>>>> Stashed changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{description}</p>

        {/* Status and Type */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
              statusConfig[status].bg
            } ${statusConfig[status].text} ${statusConfig[status].border}`}
          >
            {statusLabels[status]}
          </span>
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {type}
          </span>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
          <div>
            <p className="text-muted-foreground">{t('home:documentCard.modified')}</p>
            <p className="font-medium text-foreground">{dateModified}</p>
          </div>
          <div className="text-end">
            <p className="text-muted-foreground">{t('home:documentCard.size')}</p>
            <p className="font-medium text-foreground">{size}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors">
            <Download size={14} />
            {t('common:actions.download')}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-accent text-muted-foreground rounded-lg text-xs font-medium transition-colors">
            <Share2 size={14} />
            {t('common:actions.share')}
          </button>
        </div>
      </div>
    </div>
  );
}
