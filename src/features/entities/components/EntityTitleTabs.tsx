import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ENTITY_LOCALES, type EntityLocale } from '../types/entity.types'
import { ENTITY_TITLE_MAX } from '../utils/entityPayload'

interface EntityTitleTabsProps {
    titles: Record<EntityLocale, string>
    errors: Partial<Record<EntityLocale, string>>
    activeLocale: EntityLocale
    onActiveChange: (locale: EntityLocale) => void
    onTitleChange: (locale: EntityLocale, value: string) => void
    disabled?: boolean
}

/** One tab per supported language, with an error dot on tabs that have problems. */
function EntityTitleTabs({ titles, errors, activeLocale, onActiveChange, onTitleChange, disabled }: EntityTitleTabsProps) {
    const { t } = useTranslation('entities')

    return (
        <Tabs value={activeLocale} onValueChange={(v: string) => onActiveChange(v as EntityLocale)}>
            <TabsList>
                {ENTITY_LOCALES.map((lang) => (
                    <TabsTrigger key={lang} value={lang} className="gap-1.5">
                        {t(`locales.${lang}`)}
                        {errors[lang] && (
                            <span
                                className="h-2 w-2 rounded-full bg-destructive"
                                role="img"
                                aria-label={t('form.tabHasError')}
                            />
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>

            {ENTITY_LOCALES.map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-3 space-y-1.5">
                    <label htmlFor={`entity-title-${lang}`} className="text-sm font-medium text-foreground">
                        {t('form.titleLabel', { language: t(`locales.${lang}`) })}
                    </label>
                    <Input
                        id={`entity-title-${lang}`}
                        value={titles[lang]}
                        onChange={(e) => onTitleChange(lang, e.target.value)}
                        placeholder={t('form.titlePlaceholder')}
                        maxLength={ENTITY_TITLE_MAX}
                        disabled={disabled}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        className={cn(errors[lang] && 'border-destructive')}
                    />
                    {errors[lang] && <p className="text-sm text-destructive">{errors[lang]}</p>}
                </TabsContent>
            ))}
        </Tabs>
    )
}

export default memo(EntityTitleTabs)
