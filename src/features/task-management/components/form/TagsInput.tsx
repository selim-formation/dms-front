import { memo, useCallback, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'

interface TagsInputProps {
    id?: string
    tags: string[]
    onChange: (tags: string[]) => void
    max: number
    maxLength: number
    placeholder?: string
    disabled?: boolean
}

/** Chip input: Enter or comma adds, Backspace on an empty box removes the last; duplicates are ignored. */
function TagsInput({ id, tags, onChange, max, maxLength, placeholder, disabled }: TagsInputProps) {
    const { t } = useTranslation('taskManagement')
    const [draft, setDraft] = useState('')

    const commit = useCallback(() => {
        const value = draft.trim().slice(0, maxLength)
        setDraft('')
        if (!value || tags.length >= max || tags.some((x) => x.toLowerCase() === value.toLowerCase())) return
        onChange([...tags, value])
    }, [draft, tags, max, maxLength, onChange])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commit()
        } else if (e.key === 'Backspace' && !draft && tags.length) {
            onChange(tags.slice(0, -1))
        }
    }

    const remove = useCallback((tag: string) => onChange(tags.filter((x) => x !== tag)), [tags, onChange])

    return (
        <div className="space-y-2">
            <Input
                id={id}
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(',', ''))}
                onKeyDown={handleKeyDown}
                onBlur={commit}
                placeholder={tags.length >= max ? t('form.tagsLimit', { max }) : placeholder}
                maxLength={maxLength}
                disabled={disabled || tags.length >= max}
                dir="auto"
            />
            {tags.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <li key={tag}>
                            <Badge variant="secondary" className="gap-1 ps-2.5 pe-1" dir="auto">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => remove(tag)}
                                    disabled={disabled}
                                    aria-label={t('form.removeTag', { tag })}
                                    className="rounded-full p-0.5 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default memo(TagsInput)
