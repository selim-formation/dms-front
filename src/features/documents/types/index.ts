export interface DocumentCategory {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Entity {
  id: number;
  name: string;
}

export interface UserSummary {
  id: number;
  name: string;
}

export type Importance = 'low' | 'medium' | 'high' | 'critical';
export type DocumentStatus = 'draft' | 'active' | 'archived' | 'expired';

export interface Document {
  id: number;
  title: string;
  category: DocumentCategory;
  department: Department;
  entity: Entity;
  importance: Importance;
  status: DocumentStatus;
  file_type: string;
  file_size: number;
  reminder_date: string | null;
  created_by: UserSummary;
  created_at: string;
  updated_at: string;
}

export interface DocumentFilters {
  category_id?: number;
  department_id?: number;
  entity_id?: number;
  importance?: Importance;
  status?: DocumentStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}
