import type { TFunction } from 'i18next'

/** Local validation stores i18n codes (`titleRequired`); server errors are already sentences. */
export function formErrorText(t: TFunction, message?: string): string | undefined {
    if (!message) return undefined
    return /^[a-zA-Z]+$/.test(message) ? t(`taskManagement:form.errors.${message}`) : message
}
