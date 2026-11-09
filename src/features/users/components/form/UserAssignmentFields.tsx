import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import DepartmentFormField from '@/features/departments/components/DepartmentFormField'
import UserChipList from '../UserChipList'
import UserOptionPicker from './UserOptionPicker'
import { userChips } from '../userChips'
import { useDepartmentOptions, useRoleOptions } from '../../hooks/useUserOptions'
import type { ManagedUser, UserOption } from '../../types/user.types'

interface UserAssignmentFieldsProps {
    /** Edit target; used for the read-only view when editing yourself. */
    user: ManagedUser | null
    isSelf: boolean
    roleIds: number[]
    departmentIds: number[]
    sectionIds: number[]
    sectionOptions: UserOption[]
    sectionsLoading: boolean
    errors: { roles?: string; departments?: string; sections?: string }
    disabled: boolean
    onRolesChange: (ids: number[]) => void
    onDepartmentsChange: (ids: number[]) => void
    onSectionsChange: (ids: number[]) => void
}

/**
 * Roles, departments and sections. Yourself you cannot change them, so they are
 * shown read-only. Sections are enabled once a department is picked and are
 * limited to the picked departments.
 */
function UserAssignmentFields(p: UserAssignmentFieldsProps) {
    const { t } = useTranslation('users')
    const { roles, isLoading: rolesLoading, isError: rolesError, refetch } = useRoleOptions()
    const { departments, isLoading: departmentsLoading } = useDepartmentOptions()
    const chips = useMemo(() => (p.user ? userChips(p.user) : null), [p.user])

    if (p.isSelf && chips) {
        return (
            <div className="space-y-4 rounded-xl border border-dashed border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">{t('form.selfLocked')}</p>
                <DepartmentFormField label={t('form.roles')}><UserChipList items={chips.roles} max={99} /></DepartmentFormField>
                <DepartmentFormField label={t('form.departments')}><UserChipList items={chips.departments} max={99} /></DepartmentFormField>
                <DepartmentFormField label={t('form.sections')}><UserChipList items={chips.sections} max={99} /></DepartmentFormField>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <DepartmentFormField label={t('form.roles')} hint={t('form.rolesHint')} error={p.errors.roles}>
                {rolesError ? (
                    <button type="button" onClick={() => refetch()} className="text-sm text-destructive underline">
                        {t('form.optionsError')}
                    </button>
                ) : (
                    <UserOptionPicker
                        options={roles}
                        selectedIds={p.roleIds}
                        onChange={p.onRolesChange}
                        isLoading={rolesLoading}
                        disabled={p.disabled}
                        invalid={!!p.errors.roles}
                        searchPlaceholder={t('form.search')}
                        emptyLabel={t('form.noOptions')}
                        selectedLabel={t('form.selected', { count: p.roleIds.length })}
                    />
                )}
            </DepartmentFormField>

            <div className="grid gap-4 md:grid-cols-2">
                <DepartmentFormField label={t('form.departments')} error={p.errors.departments}>
                    <UserOptionPicker
                        options={departments}
                        selectedIds={p.departmentIds}
                        onChange={p.onDepartmentsChange}
                        isLoading={departmentsLoading}
                        disabled={p.disabled}
                        invalid={!!p.errors.departments}
                        searchPlaceholder={t('form.search')}
                        emptyLabel={t('form.noOptions')}
                        selectedLabel={t('form.selected', { count: p.departmentIds.length })}
                    />
                </DepartmentFormField>

                <DepartmentFormField label={t('form.sections')} error={p.errors.sections}>
                    <UserOptionPicker
                        options={p.sectionOptions}
                        selectedIds={p.sectionIds}
                        onChange={p.onSectionsChange}
                        isLoading={p.sectionsLoading}
                        disabled={p.disabled || p.departmentIds.length === 0}
                        invalid={!!p.errors.sections}
                        searchPlaceholder={t('form.search')}
                        emptyLabel={t('form.noSections')}
                        selectedLabel={t('form.selected', { count: p.sectionIds.length })}
                        disabledHint={p.departmentIds.length === 0 ? t('form.sectionsNeedDepartment') : undefined}
                    />
                </DepartmentFormField>
            </div>
        </div>
    )
}

export default memo(UserAssignmentFields)
