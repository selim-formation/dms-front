import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyRound, Loader2, TriangleAlert } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { errorMessage, errorStatus } from '@/features/departments/utils/departmentErrors'
import ProviderFields from './ProviderFields'
import ExpiryField from './ExpiryField'
import { useReplaceCredentials } from '../hooks/useSaveStorage'
import { pickSection, serverFieldErrors, validateExpiry, validateSection, type FormErrors } from '../utils/storagePayload'
import type { StorageConnection } from '../types/storage.types'

interface StorageCredentialsDialogProps {
    connection: StorageConnection
    onOpenChange: (open: boolean) => void
    onSaved: () => void
    onBlocked: (error: unknown) => void
}

/** Secrets are write-only: the full set is typed again, nothing is ever shown back. */
function StorageCredentialsDialog({ connection, onOpenChange, onSaved, onBlocked }: StorageCredentialsDialogProps) {
    const { t } = useTranslation('storage')
    const [credentials, setCredentials] = useState<Record<string, string>>({})
    const [expires, setExpires] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [formError, setFormError] = useState<string | null>(null)
    const replace = useReplaceCredentials()
    const saving = replace.isPending

    const handleField = useCallback((_section: string, key: string, value: string) => {
        setCredentials((c) => ({ ...c, [key]: value }))
        setErrors((e) => (e[`credentials.${key}`] ? { ...e, [`credentials.${key}`]: '' } : e))
    }, [])
    const handleExpiry = useCallback((value: string) => {
        setExpires(value)
        setErrors((e) => (e.credentials_expires_at ? { ...e, credentials_expires_at: '' } : e))
    }, [])
    const close = useCallback((open: boolean) => !open && !saving && onOpenChange(false), [saving, onOpenChange])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (saving) return
        setFormError(null)
        const next = { ...validateSection(connection.provider, 'credentials', credentials), ...validateExpiry(expires) }
        setErrors(next)
        if (Object.keys(next).length) return

        replace.mutate(
            {
                id: connection.id,
                payload: {
                    credentials: pickSection(connection.provider, 'credentials', credentials),
                    ...(expires ? { credentials_expires_at: expires } : {}),
                },
            },
            {
                onSuccess: onSaved,
                onError: (err) => {
                    const status = errorStatus(err)
                    if (status === 403 || status === 404) return onBlocked(err)
                    const fields = status === 422 ? serverFieldErrors(err) : {}
                    setErrors(fields)
                    setFormError(Object.keys(fields).length === 0 ? (errorMessage(err) ?? t('form.failed')) : null)
                },
            },
        )
    }

    return (
        <Dialog open onOpenChange={close}>
            <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" />
                        {t('credentials.title')}
                    </DialogTitle>
                    <DialogDescription>{t('credentials.description', { name: connection.name })}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <p role="status" className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                        {connection.is_default ? t('credentials.warningDefault') : t('credentials.warning')}
                    </p>

                    <ProviderFields
                        provider={connection.provider}
                        section="credentials"
                        idPrefix={`cred-${connection.id}`}
                        values={credentials}
                        errors={errors}
                        onChange={handleField}
                        disabled={saving}
                    />
                    <ExpiryField id={`cred-${connection.id}-expires`} value={expires} error={errors.credentials_expires_at} onChange={handleExpiry} disabled={saving} />
                    <p className="text-xs text-muted-foreground">{t('credentials.expiryReplaced')}</p>

                    {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => close(false)} disabled={saving}>
                            {t('actions.cancel', { ns: 'common' })}
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t('credentials.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default memo(StorageCredentialsDialog)
