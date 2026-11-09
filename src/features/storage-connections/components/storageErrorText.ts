import type { TFunction } from 'i18next'
import { isCode } from '../utils/storagePayload'

/** Local validation stores i18n codes (`required`); server errors are already sentences. */
export function storageErrorText(t: TFunction, message?: string): string | undefined {
    if (!message) return undefined
    return isCode(message) ? t(`storage:form.errors.${message}`) : message
}
