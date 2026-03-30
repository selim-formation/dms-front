import React, { useCallback, useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { MessageSquare, Heart } from 'lucide-react';

interface Comment {
    id: number;
    author: string;
    role: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
}

interface DocumentCommentsCardProps {
    comments: Comment[];
    onAddComment?: (comment: string) => void;
}

const DocumentCommentsCard: React.FC<DocumentCommentsCardProps> = ({ comments, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = useCallback(() => {
        if (newComment.trim()) {
            onAddComment?.(newComment);
            setNewComment('');
        }
    }, [newComment, onAddComment]);

    return (
        <Card>
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
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end gap-2 mt-3">
                                <button
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                                    onClick={() => setNewComment('')}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    onClick={handleSubmit}
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
        </Card>
    );
};

export default React.memo(DocumentCommentsCard);
