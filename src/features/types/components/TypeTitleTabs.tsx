import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TYPE_LOCALES, type TypeLocale } from '../types/type.types'
import { TYPE_TITLE_MAX } from '../utils/typePayload'

interface TypeTitleTabsProps {
    titles: Record<TypeLocale, string>
    errors: Partial<Record<TypeLocale, string>>
    activeLocale: TypeLocale
    onActiveChange: (locale: TypeLocale) => void
    onTitleChange: (locale: TypeLocale, value: string) => void
    disabled?: boolean
}

/** One tab per supported language, with an error dot on tabs that have problems. */
function TypeTitleTabs({ titles, errors, activeLocale, onActiveChange, onTitleChange, disabled }: TypeTitleTabsProps) {
    const { t } = useTranslation('types')

    return (
        <Tabs value={activeLocale} onValueChange={(v) => onActiveChange(v as TypeLocale)}>
            <TabsList>
                {TYPE_LOCALES.map((lang) => (
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

            {TYPE_LOCALES.map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-3 space-y-1.5">
                    <label htmlFor={`type-title-${lang}`} className="text-sm font-medium text-foreground">
                        {t('form.titleLabel', { language: t(`locales.${lang}`) })}
                    </label>
                    <Input
                        id={`type-title-${lang}`}
                        value={titles[lang]}
                        onChange={(e) => onTitleChange(lang, e.target.value)}
                        placeholder={t('form.titlePlaceholder')}
                        maxLength={TYPE_TITLE_MAX}
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

export default memo(TypeTitleTabs)
