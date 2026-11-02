import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { ImportMode } from '../types/import.types'

const MODES: ImportMode[] = ['create_only', 'append_versions']

interface ImportModeSelectorProps {
    value: ImportMode
    onChange: (mode: ImportMode) => void
    disabled?: boolean
}

/** Two radio cards: each explains what the mode does with an existing external_ref. */
function ImportModeSelector({ value, onChange, disabled }: ImportModeSelectorProps) {
    const { t } = useTranslation('imports')
    return (
        <div role="radiogroup" aria-label={t('form.mode')} className="grid gap-2 sm:grid-cols-2">
            {MODES.map((mode) => {
                const active = value === mode
                return (
                    <label
                        key={mode}
                        className={cn(
                            'flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                            active ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/40',
                            disabled && 'pointer-events-none opacity-60',
                        )}
                    >
                        <input
                            type="radio"
                            name="import-mode"
                            className="mt-1 h-4 w-4 shrink-0 accent-primary"
                            checked={active}
                            onChange={() => onChange(mode)}
                            disabled={disabled}
                        />
                        <span>
                            <span className="block text-sm font-medium text-foreground">{t(`mode.${mode}`)}</span>
                            <span className="block text-xs text-muted-foreground">{t(`mode.${mode}Hint`)}</span>
                        </span>
                    </label>
                )
            })}
        </div>
    )
}

export default memo(ImportModeSelector)
