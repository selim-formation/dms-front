import type { ApiResponse } from '@/api/types';
import type { Document, DocumentFilters } from '../types';

// ── Mock data (replace with real API calls) ──────────────────────────
const MOCK_DOCUMENTS: Document[] = [
  { id: 1, title: 'Q4 2024 Financial Report', category: { id: 1, name: 'Financial' }, department: { id: 1, name: 'Finance' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'critical', status: 'active', file_type: 'pdf', file_size: 2456000, reminder_date: '2025-01-15', created_by: { id: 1, name: 'Sarah Chen' }, created_at: '2024-12-01T10:00:00Z', updated_at: '2024-12-15T14:30:00Z' },
  { id: 2, title: 'Employment Contract Template v3', category: { id: 2, name: 'Legal' }, department: { id: 3, name: 'Human Resources' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'high', status: 'active', file_type: 'docx', file_size: 184000, reminder_date: null, created_by: { id: 2, name: 'James Park' }, created_at: '2024-11-20T09:00:00Z', updated_at: '2024-11-20T09:00:00Z' },
  { id: 3, title: 'Data Processing Agreement – CloudVault', category: { id: 2, name: 'Legal' }, department: { id: 4, name: 'Engineering' }, entity: { id: 2, name: 'ACME EU' }, importance: 'high', status: 'active', file_type: 'pdf', file_size: 530000, reminder_date: '2025-06-01', created_by: { id: 3, name: 'Lisa Müller' }, created_at: '2024-10-15T08:00:00Z', updated_at: '2024-12-01T11:00:00Z' },
  { id: 4, title: 'Brand Guidelines 2025', category: { id: 5, name: 'Marketing' }, department: { id: 5, name: 'Marketing' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'medium', status: 'draft', file_type: 'pdf', file_size: 8900000, reminder_date: null, created_by: { id: 4, name: 'Aisha Patel' }, created_at: '2024-12-10T16:00:00Z', updated_at: '2024-12-12T10:00:00Z' },
  { id: 5, title: 'ISO 27001 Compliance Checklist', category: { id: 6, name: 'Compliance' }, department: { id: 6, name: 'Operations' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'critical', status: 'active', file_type: 'xlsx', file_size: 120000, reminder_date: '2025-03-01', created_by: { id: 5, name: 'Tom Richards' }, created_at: '2024-09-01T08:00:00Z', updated_at: '2024-12-20T09:00:00Z' },
  { id: 6, title: 'API Architecture Decision Record', category: { id: 4, name: 'Technical' }, department: { id: 4, name: 'Engineering' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'medium', status: 'active', file_type: 'md', file_size: 45000, reminder_date: null, created_by: { id: 6, name: 'David Kim' }, created_at: '2024-11-05T14:00:00Z', updated_at: '2024-11-05T14:00:00Z' },
  { id: 7, title: 'Q3 2024 Revenue Analysis', category: { id: 1, name: 'Financial' }, department: { id: 1, name: 'Finance' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'high', status: 'archived', file_type: 'pdf', file_size: 1800000, reminder_date: null, created_by: { id: 1, name: 'Sarah Chen' }, created_at: '2024-10-01T10:00:00Z', updated_at: '2024-10-15T12:00:00Z' },
  { id: 8, title: 'Office Lease Agreement – Berlin HQ', category: { id: 2, name: 'Legal' }, department: { id: 6, name: 'Operations' }, entity: { id: 2, name: 'ACME EU' }, importance: 'critical', status: 'active', file_type: 'pdf', file_size: 3200000, reminder_date: '2025-09-01', created_by: { id: 3, name: 'Lisa Müller' }, created_at: '2024-08-15T09:00:00Z', updated_at: '2024-08-15T09:00:00Z' },
  { id: 9, title: 'Employee Onboarding Handbook', category: { id: 3, name: 'HR' }, department: { id: 3, name: 'Human Resources' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'medium', status: 'active', file_type: 'pdf', file_size: 5600000, reminder_date: null, created_by: { id: 2, name: 'James Park' }, created_at: '2024-07-01T08:00:00Z', updated_at: '2024-11-30T16:00:00Z' },
  { id: 10, title: 'Incident Response Plan', category: { id: 6, name: 'Compliance' }, department: { id: 4, name: 'Engineering' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'critical', status: 'active', file_type: 'pdf', file_size: 890000, reminder_date: '2025-02-01', created_by: { id: 5, name: 'Tom Richards' }, created_at: '2024-06-15T10:00:00Z', updated_at: '2024-12-01T08:00:00Z' },
  { id: 11, title: 'Social Media Campaign Brief – Q1', category: { id: 5, name: 'Marketing' }, department: { id: 5, name: 'Marketing' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'low', status: 'draft', file_type: 'docx', file_size: 230000, reminder_date: null, created_by: { id: 4, name: 'Aisha Patel' }, created_at: '2024-12-18T11:00:00Z', updated_at: '2024-12-18T11:00:00Z' },
  { id: 12, title: 'Vendor NDA – DataSync Inc', category: { id: 2, name: 'Legal' }, department: { id: 6, name: 'Operations' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'high', status: 'expired', file_type: 'pdf', file_size: 150000, reminder_date: null, created_by: { id: 3, name: 'Lisa Müller' }, created_at: '2023-12-01T09:00:00Z', updated_at: '2024-12-01T09:00:00Z' },
  { id: 13, title: 'Kubernetes Migration Runbook', category: { id: 4, name: 'Technical' }, department: { id: 4, name: 'Engineering' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'high', status: 'active', file_type: 'md', file_size: 78000, reminder_date: null, created_by: { id: 6, name: 'David Kim' }, created_at: '2024-11-25T15:00:00Z', updated_at: '2024-12-10T10:00:00Z' },
  { id: 14, title: 'Annual Benefits Summary 2024', category: { id: 3, name: 'HR' }, department: { id: 3, name: 'Human Resources' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'medium', status: 'archived', file_type: 'pdf', file_size: 1200000, reminder_date: null, created_by: { id: 2, name: 'James Park' }, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 15, title: 'GDPR Data Mapping Register', category: { id: 6, name: 'Compliance' }, department: { id: 2, name: 'Legal' }, entity: { id: 2, name: 'ACME EU' }, importance: 'critical', status: 'active', file_type: 'xlsx', file_size: 340000, reminder_date: '2025-05-25', created_by: { id: 3, name: 'Lisa Müller' }, created_at: '2024-05-25T08:00:00Z', updated_at: '2024-12-15T14:00:00Z' },
  { id: 16, title: 'Product Roadmap H1 2025', category: { id: 4, name: 'Technical' }, department: { id: 4, name: 'Engineering' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'high', status: 'active', file_type: 'pdf', file_size: 2100000, reminder_date: null, created_by: { id: 6, name: 'David Kim' }, created_at: '2024-12-05T09:00:00Z', updated_at: '2024-12-19T17:00:00Z' },
  { id: 17, title: 'Tax Filing Instructions – APAC Region', category: { id: 1, name: 'Financial' }, department: { id: 1, name: 'Finance' }, entity: { id: 3, name: 'ACME Asia' }, importance: 'high', status: 'active', file_type: 'pdf', file_size: 670000, reminder_date: '2025-04-15', created_by: { id: 7, name: 'Wei Zhang' }, created_at: '2024-11-01T06:00:00Z', updated_at: '2024-11-01T06:00:00Z' },
  { id: 18, title: 'Press Kit – Product Launch', category: { id: 5, name: 'Marketing' }, department: { id: 5, name: 'Marketing' }, entity: { id: 1, name: 'ACME Corp' }, importance: 'medium', status: 'active', file_type: 'zip', file_size: 45000000, reminder_date: null, created_by: { id: 4, name: 'Aisha Patel' }, created_at: '2024-12-20T12:00:00Z', updated_at: '2024-12-20T12:00:00Z' },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── API functions (mock implementation) ──────────────────────────────

export async function getDocuments(
  _tenant: string,
  filters: DocumentFilters
): Promise<ApiResponse<Document[]>> {
  await delay(800);

  let results = [...MOCK_DOCUMENTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((d) => d.title.toLowerCase().includes(q));
  }
  if (filters.category_id) {
    results = results.filter((d) => d.category.id === filters.category_id);
  }
  if (filters.department_id) {
    results = results.filter((d) => d.department.id === filters.department_id);
  }
  if (filters.importance) {
    results = results.filter((d) => d.importance === filters.importance);
  }
  if (filters.status) {
    results = results.filter((d) => d.status === filters.status);
  }

  const sortBy = filters.sort_by || 'created_at';
  const sortDir = filters.sort_dir || 'desc';
  results.sort((a, b) => {
    const aVal = String((a as unknown as Record<string, unknown>)[sortBy] ?? '');
    const bVal = String((b as unknown as Record<string, unknown>)[sortBy] ?? '');
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const page = filters.page || 1;
  const perPage = filters.per_page || 10;
  const total = results.length;
  const paginated = results.slice((page - 1) * perPage, page * perPage);

  return {
    data: paginated,
    meta: {
      current_page: page,
      last_page: Math.ceil(total / perPage),
      per_page: perPage,
      total,
    },
  };
}

export async function getDocument(
  _tenant: string,
  id: number
): Promise<Document | null> {
  await delay(500);
  return MOCK_DOCUMENTS.find((d) => d.id === id) ?? null;
}

// Filter options for dropdowns
export const CATEGORIES = [
  { id: 1, name: 'Financial' },
  { id: 2, name: 'Legal' },
  { id: 3, name: 'HR' },
  { id: 4, name: 'Technical' },
  { id: 5, name: 'Marketing' },
  { id: 6, name: 'Compliance' },
];

export const DEPARTMENTS = [
  { id: 1, name: 'Finance' },
  { id: 2, name: 'Legal' },
  { id: 3, name: 'Human Resources' },
  { id: 4, name: 'Engineering' },
  { id: 5, name: 'Marketing' },
  { id: 6, name: 'Operations' },
];
