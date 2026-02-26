export interface HomeSummary {
  totalDocuments: number;
  foldersCount: number;
  sharedDocsCount: number;
  inReviewCount: number;
}

export interface HomeActivityItem {
  id: string;
  documentId: string;
  documentTitle: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: 'Created' | 'Edited' | 'Deleted' | 'Shared' | 'Commented' | 'Viewed';
  timestamp: string;
  status?: 'Active' | 'Approved' | 'Pending' | 'Followers';
}

export interface AssignedItem {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  type: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string; // 'PDF', 'DOC', 'TXT', 'XLS', etc.
  updatedAt: string;
  status?: 'Approved' | 'Pending' | 'Draft';
  followers?: boolean;
}

export interface HomeStatistics {
  byCategory: { category: string; count: number }[];
  byType: { type: string; count: number }[];
  monthlyProgress: { month: string; uploaded: number; reviewed: number; approved: number; archived: number }[];
}
