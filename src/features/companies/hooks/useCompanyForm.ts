/**
 * Form state for the company dialog: values, name → slug → id derivation,
 * client-side validation (the server stays the authority) and the logo choice.
 */
import { useCallback, useRef, useState } from 'react'
import type { TFunction } from 'i18next'
import {
    COMPANY_NAME_MAX,
    COMPANY_SLUG_MAX,
    initialFormValues,
    isValidSlug,
    slugify,
    type CompanyFormValues,
} from '../utils/companyPayload'
import type { Company } from '../types/company.types'

export type CompanyFormErrors = Partial<Record<'name' | 'slug' | 'id' | 'permissions' | 'logo', string>>

export function useCompanyForm(company: Company | null) {
    const isEdit = !!company
    const [values, setValues] = useState<CompanyFormValues>(() => initialFormValues(company))
    const [errors, setErrors] = useState<CompanyFormErrors>({})
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [removeLogo, setRemoveLogo] = useState(false)

    // Slug follows the name and id follows the slug until the user edits them by hand.
    const slugTouched = useRef(false)
    const idTouched = useRef(false)

    const clearError = useCallback((key: keyof CompanyFormErrors) => {
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    }, [])

    const setName = useCallback(
        (name: string) => {
            setValues((prev) => {
                const slug = slugTouched.current ? prev.slug : slugify(name)
                const id = idTouched.current ? prev.id : slug
                return { ...prev, name, slug, id }
            })
            clearError('name')
            clearError('slug')
            clearError('id')
        },
        [clearError],
    )

    const setSlug = useCallback(
        (raw: string) => {
            slugTouched.current = true
            const slug = raw.toLowerCase()
            setValues((prev) => ({ ...prev, slug, id: idTouched.current ? prev.id : slug }))
            clearError('slug')
            clearError('id')
        },
        [clearError],
    )

    const setId = useCallback(
        (raw: string) => {
            idTouched.current = true
            setValues((prev) => ({ ...prev, id: raw.toLowerCase() }))
            clearError('id')
        },
        [clearError],
    )

    const setPermissionIds = useCallback(
        (permissionIds: number[]) => {
            setValues((prev) => ({ ...prev, permissionIds }))
            clearError('permissions')
        },
        [clearError],
    )

    const pickLogo = useCallback(
        (file: File | null) => {
            setLogoFile(file)
            if (file) setRemoveLogo(false)
            clearError('logo')
        },
        [clearError],
    )

    const validate = useCallback(
        (t: TFunction): boolean => {
            const next: CompanyFormErrors = {}
            if (!isEdit) {
                const name = values.name.trim()
                if (!name) next.name = t('companies:form.errors.nameRequired')
                else if (name.length > COMPANY_NAME_MAX) next.name = t('companies:form.errors.nameTooLong')

                if (!values.slug) next.slug = t('companies:form.errors.slugRequired')
                else if (!isValidSlug(values.slug)) next.slug = t('companies:form.errors.slugInvalid', { max: COMPANY_SLUG_MAX })
                if (!values.id) next.id = t('companies:form.errors.idRequired')
                else if (!isValidSlug(values.id)) next.id = t('companies:form.errors.slugInvalid', { max: COMPANY_SLUG_MAX })
            }
            if (values.permissionIds.length === 0) next.permissions = t('companies:form.errors.permissionsRequired')
            setErrors(next)
            return Object.keys(next).length === 0
        },
        [values, isEdit],
    )

    return {
        values, errors, logoFile, removeLogo, setRemoveLogo,
        setName, setSlug, setId, setPermissionIds, pickLogo, validate,
    }
}
