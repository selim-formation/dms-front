import type { DocumentEntity, EntityLocale } from '../types/entity.types'

/** Title in the UI language, falling back to the other language, then `title`. */
export function pickEntityTitle(entity: DocumentEntity, lang: string): string | null {
    const primary: EntityLocale = lang.startsWith('ar') ? 'ar' : 'en'
    const other: EntityLocale = primary === 'ar' ? 'en' : 'ar'
    return entity.translations?.[primary]?.title || entity.translations?.[other]?.title || entity.title
}

/** The title in the language the UI is NOT using (shown as secondary text). */
export function pickSecondaryTitle(entity: DocumentEntity, lang: string): string | null {
    const secondary: EntityLocale = lang.startsWith('ar') ? 'en' : 'ar'
    return entity.translations?.[secondary]?.title ?? null
}
