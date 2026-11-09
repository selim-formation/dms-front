/**
 * Form state for the user dialog: values, the department → section dependency,
 * client-side validation (the server stays the authority) and payload building.
 */
import { useCallback, useMemo, useState } from 'react'
import type { TFunction } from 'i18next'
import { useSectionOptions } from './useUserOptions'
import {
    USER_EMAIL_MAX,
    USER_NAME_MAX,
    USER_PASSWORD_MAX,
    USER_PASSWORD_MIN,
    USER_ROLES_MAX,
    buildCreatePayload,
    buildUpdatePayload,
    initialFormValues,
    isValidEmail,
    type UserFormValues,
} from '../utils/userPayload'
import type { ManagedUser, UserOption, UserPayload } from '../types/user.types'

export type UserFormErrors = Partial<Record<keyof UserFormValues | 'roles' | 'departments' | 'sections', string>>

export function useUserForm(user: ManagedUser | null, isSelf: boolean) {
    const isEdit = !!user
    const [values, setValues] = useState<UserFormValues>(() => initialFormValues(user))
    const [errors, setErrors] = useState<UserFormErrors>({})
    const { sections: allSections, isLoading: sectionsLoading } = useSectionOptions()

    const setField = useCallback(<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }))
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    }, [])

    /** Removing a department drops the sections that depended on it. */
    const sectionDepartment = useMemo(() => {
        const map = new Map<number, number | null | undefined>()
        allSections.forEach((s) => map.set(s.id, s.departmentId))
        user?.sections.forEach((s) => map.set(s.id, s.department_id))
        return map
    }, [allSections, user])

    const setDepartments = useCallback(
        (ids: number[]) => {
            setValues((prev) => {
                const keep = new Set(ids)
                return {
                    ...prev,
                    departmentIds: ids,
                    sectionIds: prev.sectionIds.filter((id) => {
                        const dep = sectionDepartment.get(id)
                        return dep != null && keep.has(dep)
                    }),
                }
            })
            setErrors((prev) => ({ ...prev, departments: undefined, sections: undefined }))
        },
        [sectionDepartment],
    )

    /** Sections of the chosen departments only (plus the user's own, so they can be unchecked). */
    const sectionOptions = useMemo<UserOption[]>(() => {
        const deps = new Set(values.departmentIds)
        const map = new Map<number, UserOption>()
        user?.sections.forEach((s) => {
            if (deps.has(s.department_id)) map.set(s.id, { id: s.id, label: s.name, departmentId: s.department_id })
        })
        allSections.forEach((s) => {
            if (s.departmentId != null && deps.has(s.departmentId)) map.set(s.id, s)
        })
        return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
    }, [allSections, values.departmentIds, user])

    const validate = useCallback(
        (t: TFunction): boolean => {
            const next: UserFormErrors = {}
            const name = values.name.trim()
            const email = values.email.trim()

            if (!name) next.name = t('users:form.errors.nameRequired')
            else if (name.length > USER_NAME_MAX) next.name = t('users:form.errors.nameTooLong')

            if (!email) next.email = t('users:form.errors.emailRequired')
            else if (!isValidEmail(email)) next.email = t('users:form.errors.emailInvalid')
            else if (email.length > USER_EMAIL_MAX) next.email = t('users:form.errors.emailTooLong')

            if (!isEdit || values.password) {
                if (!values.password) next.password = t('users:form.errors.passwordRequired')
                else if (values.password.length < USER_PASSWORD_MIN) next.password = t('users:form.errors.passwordTooShort', { min: USER_PASSWORD_MIN })
                else if (values.password.length > USER_PASSWORD_MAX) next.password = t('users:form.errors.passwordTooLong')
                if (isSelf && values.password && !values.currentPassword) next.currentPassword = t('users:form.errors.currentPasswordRequired')
            }

            if (!isSelf) {
                if (values.roleIds.length === 0) next.roles = t('users:form.errors.rolesRequired')
                else if (values.roleIds.length > USER_ROLES_MAX) next.roles = t('users:form.errors.rolesTooMany', { max: USER_ROLES_MAX })
            }

            setErrors(next)
            return Object.keys(next).length === 0
        },
        [values, isEdit, isSelf],
    )

    const buildPayload = useCallback(
        (): UserPayload => (user ? buildUpdatePayload(user, values, isSelf) : buildCreatePayload(values)),
        [user, values, isSelf],
    )

    return { values, errors, setField, setDepartments, sectionOptions, sectionsLoading, validate, buildPayload }
}
