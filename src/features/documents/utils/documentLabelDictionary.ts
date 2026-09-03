/**
 * Frontend-only EN→AR stopgap for entity-type/department names.
 * The API returns a single-language `type`/`department` string (no name_ar/name_en
 * pair) — real fix belongs on the backend; this dictionary just covers the known
 * fixed set of names until then. Unknown names pass through untranslated.
 */

const ENTITY_TYPE_NAME_AR: Record<string, string> = {
    'proxies': 'توكيلات',
    'permits': 'تصاريح',
    'delegations': 'تفويضات',
};

/** Document `types` group names — /documents-by-types & /categorized `type` field. */
const DOCUMENT_TYPE_GROUP_NAME_AR: Record<string, string> = {
    'contracts': 'العقود',
    'licenses': 'التراخيص',
    'permits': 'التصاريح',
    'records': 'السجلات',
    'plans': 'الخطط',
    'reports': 'التقارير',
    'cards': 'البطاقات',
    'permissions': 'الصلاحيات',
    'memberships': 'العضويات',
    'approvals': 'الموافقات',
    'certifications': 'الشهادات',
    'equipment': 'المعدات',
    'authorizations': 'التفويضات',
};

const DEPARTMENT_NAME_AR: Record<string, string> = {
    'machine': 'الآلات',
    'administration department': 'قسم الإدارة',
    'administration': 'الإدارة',
    'project': 'مشروع',
    'logistics': 'الخدمات اللوجستية',
    'hr': 'الموارد البشرية',
    'human resources': 'الموارد البشرية',
    'finance': 'المالية',
    'legal': 'الشؤون القانونية',
    'it': 'تقنية المعلومات',
    'operations': 'العمليات',
    'procurement': 'المشتريات',
    'maintenance': 'الصيانة',
};

function lookup(dictionary: Record<string, string>, name: string, language: string): string {
    if (language !== 'ar') return name;
    const match = dictionary[name.trim().toLowerCase()];
    return match ?? name;
}

export function translateDocumentTypeName(name: string, language: string): string {
    return lookup(ENTITY_TYPE_NAME_AR, name, language);
}

/** For the "Types" tab group names (Contracts/Licenses/...), not the entity badge above. */
export function translateTypeGroupName(name: string, language: string): string {
    return lookup(DOCUMENT_TYPE_GROUP_NAME_AR, name, language);
}

export function translateDepartmentName(name: string, language: string): string {
    return lookup(DEPARTMENT_NAME_AR, name, language);
}
