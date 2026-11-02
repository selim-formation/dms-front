import type { DocumentType, TypeLocale } from '../types/type.types'

/** Title in the UI language, falling back to the other language, then `title`. */
export function pickTypeTitle(type: DocumentType, lang: string): string | null {
    const primary: TypeLocale = lang.startsWith('ar') ? 'ar' : 'en'
    const other: TypeLocale = primary === 'ar' ? 'en' : 'ar'
    return type.translations?.[primary]?.title || type.translations?.[other]?.title || type.title
}

/** The title in the language the UI is NOT using (shown as secondary text). */
export function pickSecondaryTitle(type: DocumentType, lang: string): string | null {
    const secondary: TypeLocale = lang.startsWith('ar') ? 'en' : 'ar'
    return type.translations?.[secondary]?.title ?? null
}
