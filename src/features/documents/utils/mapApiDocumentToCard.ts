/**
 * Maps a real ApiDocument onto the props DocumentCardGrid expects.
 * Single source of truth so every real-data list (All/Types/Departments
 * tabs, search results) renders documents identically.
 *
 * Renewal/status rule (from the backend docs, applied consistently):
 * no expire_date = one-time, has an expire_date = renewal. Status splits
 * that further into Active (has an expiry, not yet due), Expires (inside
 * the reminder window) and Expired (past expire_date).
 *
 * Dates from this endpoint are `d/m/Y` (date-only) — a different format
 * from every other module, parsed locally rather than via a shared parser.
 */
import type { ApiDocument } from '../types/api.types';

export interface DocumentCardData {
    id: string;
    name: string;
    department: string;
    entity: string;
    renewal: 'Renewable' | 'One-Time';
    importance: 'Critical' | 'High' | 'Medium';
    importanceLabel: string;
    expiryDate: string;
    status: 'Expires' | 'Expired' | 'Active';
}

function parseDMY(value: string | null): Date | null {
    if (!value) return null;
    const [day, month, year] = value.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
}

function importanceBucket(raw: string): 'Critical' | 'High' | 'Medium' {
    const lower = raw.toLowerCase();
    if (lower === 'critical') return 'Critical';
    if (lower === 'high') return 'High';
    return 'Medium';
}

function resolveStatus(doc: ApiDocument): 'Expires' | 'Expired' | 'Active' {
    const expireDate = parseDMY(doc.expire_date);
    if (!expireDate) return 'Active';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expireDate < today) return 'Expired';

    if (doc.reminder_before) {
        const reminderStart = new Date(expireDate);
        reminderStart.setDate(reminderStart.getDate() - doc.reminder_before);
        if (today >= reminderStart) return 'Expires';
    }

    return 'Active';
}

export function mapApiDocumentToCard(doc: ApiDocument): DocumentCardData {
    return {
        id: String(doc.id),
        name: doc.title,
        department: doc.departments[0]?.title ?? doc.origin_department?.title ?? '—',
        entity: doc.entities[0]?.title ?? '—',
        renewal: doc.expire_date ? 'Renewable' : 'One-Time',
        importance: importanceBucket(doc.importance),
        importanceLabel: doc.importance,
        expiryDate: doc.expire_date ?? '—',
        status: resolveStatus(doc),
    };
}

export function mapApiDocumentsToCards(docs: ApiDocument[]): DocumentCardData[] {
    return docs.map(mapApiDocumentToCard);
}
