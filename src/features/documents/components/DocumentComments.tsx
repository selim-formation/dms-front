import React, { useState, useCallback } from 'react';
import { MessageSquare, Heart } from 'lucide-react';

interface Comment {
    id: string;
    author: string;
    role: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
}

interface DocumentCommentsProps {
    comments: Comment[];
    onAddComment?: (comment: string) => void;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({
    comments,
    onAddComment,
}) => {
    const [newComment, setNewComment] = useState('');

    const handlePostComment = useCallback(() => {
        if (newComment.trim()) {
            onAddComment?.(newComment);
            setNewComment('');
        }
    }, [newComment, onAddComment]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20} />
                Comments ({comments.length})
            </h3>

            {/* New Comment */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-4">
                    <span className="text-3xl">👤</span>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => setNewComment('')}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <span className="text-3xl flex-shrink-0">{comment.avatar}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900">{comment.author}</p>
                                    <p className="text-xs text-gray-500">{comment.role}</p>
                                </div>
                                <p className="text-xs text-gray-500">{comment.time}</p>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
                                <Heart size={16} />
                                <span>{comment.likes}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(DocumentComments);
