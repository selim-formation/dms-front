import { memo, useCallback, useMemo, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useDepartments } from '@/core/reference-data/hooks/useDepartments';
import { useSections } from '@/core/reference-data/hooks/useSections';
import { useShareRecipientSearch } from '../../hooks/useShareRecipientSearch';
import ShareTargetList from './ShareTargetList';
import SelectedTargetChips from './SelectedTargetChips';
import { SHARE_TARGET_META, SHARE_TARGET_TYPES, targetKey } from './shareTargetMeta';
import type { ReferenceItem } from '@/core/reference-data/types/referenceData.types';
import type {
    DocumentShareTargetType,
    SelectedShareTarget,
} from '../../types/documentShare.types';

interface ShareTargetPickerProps {
    value: SelectedShareTarget[];
    onChange: (next: SelectedShareTarget[]) => void;
    disabled?: boolean;
}

interface TabProps {
    selectedKeys: Set<string>;
    onToggle: (target: SelectedShareTarget) => void;
    disabled?: boolean;
}

const MIN_QUERY_LENGTH = 2;

const toGroupTarget = (type: 'department' | 'section', item: ReferenceItem): SelectedShareTarget => ({
    type,
    id: item.id,
    name: item.name ?? item.title,
});

const UsersTab = memo(function UsersTab({ selectedKeys, onToggle, disabled }: TabProps) {
    const { t } = useTranslation('documents');
    const { query, setQuery, results, isLoading, isError } = useShareRecipientSearch();

    const items = useMemo<SelectedShareTarget[]>(
        () => results.map((u) => ({ type: 'user', id: u.id, name: u.name, description: u.email })),
        [results],
    );
    const tooShort = query.trim().length < MIN_QUERY_LENGTH;

    return (
        <ShareTargetList
            items={items}
            selectedKeys={selectedKeys}
            onToggle={onToggle}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder={t('documentShares.form.recipientSearchPlaceholder')}
            hint={tooShort ? t('documentShares.form.recipientTypeToSearch') : null}
            emptyLabel={t('documentShares.form.recipientNoResults')}
            errorLabel={isError ? t('documentShares.form.recipientSearchError') : null}
            isLoading={isLoading}
            disabled={disabled}
        />
    );
});

/** Departments and sections are small flat lookups: load once, filter locally. */
function useGroupTab(
    type: 'department' | 'section',
    source: { items: ReferenceItem[]; isLoading: boolean; isError: boolean },
) {
    const [query, setQuery] = useState('');
    const items = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const mapped = source.items.map((item) => toGroupTarget(type, item));
        return needle ? mapped.filter((i) => i.name.toLowerCase().includes(needle)) : mapped;
    }, [source.items, query, type]);

    return { query, setQuery, items, isLoading: source.isLoading, isError: source.isError };
}

const DepartmentsTab = memo(function DepartmentsTab({ selectedKeys, onToggle, disabled }: TabProps) {
    const { t } = useTranslation('documents');
    const { departments, isLoading } = useDepartments();
    const source = useMemo(() => ({ items: departments, isLoading, isError: false }), [departments, isLoading]);
    const { query, setQuery, items } = useGroupTab('department', source);

    return (
        <ShareTargetList
            items={items}
            selectedKeys={selectedKeys}
            onToggle={onToggle}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder={t('documentShares.form.departmentSearchPlaceholder')}
            emptyLabel={t('documentShares.form.departmentNoResults')}
            isLoading={isLoading}
            disabled={disabled}
        />
    );
});

const SectionsTab = memo(function SectionsTab({ selectedKeys, onToggle, disabled }: TabProps) {
    const { t } = useTranslation('documents');
    const { sections, isLoading, isError } = useSections();
    const source = useMemo(() => ({ items: sections, isLoading, isError }), [sections, isLoading, isError]);
    const { query, setQuery, items } = useGroupTab('section', source);

    return (
        <ShareTargetList
            items={items}
            selectedKeys={selectedKeys}
            onToggle={onToggle}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder={t('documentShares.form.sectionSearchPlaceholder')}
            emptyLabel={t('documentShares.form.sectionNoResults')}
            errorLabel={isError ? t('documentShares.form.sectionLoadError') : null}
            isLoading={isLoading}
            disabled={disabled}
        />
    );
});

const TAB_CONTENT: Record<DocumentShareTargetType, ComponentType<TabProps>> = {
    user: UsersTab,
    department: DepartmentsTab,
    section: SectionsTab,
};

/**
 * Multi-target "share with" picker: Users (searchable, any department),
 * Departments and Sections tabs feeding one shared selection, shown as chips.
 */
function ShareTargetPicker({ value, onChange, disabled }: ShareTargetPickerProps) {
    const { t } = useTranslation('documents');
    const selectedKeys = useMemo(() => new Set(value.map(targetKey)), [value]);
    const counts = useMemo(() => {
        const acc: Record<DocumentShareTargetType, number> = { user: 0, department: 0, section: 0 };
        value.forEach((v) => (acc[v.type] += 1));
        return acc;
    }, [value]);

    const handleToggle = useCallback(
        (target: SelectedShareTarget) => {
            const key = targetKey(target);
            onChange(
                selectedKeys.has(key) ? value.filter((v) => targetKey(v) !== key) : [...value, target],
            );
        },
        [onChange, selectedKeys, value],
    );

    const handleRemove = useCallback(
        (target: SelectedShareTarget) => onChange(value.filter((v) => targetKey(v) !== targetKey(target))),
        [onChange, value],
    );

    return (
        <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">{t('documentShares.form.recipientLabel')}</span>

            <SelectedTargetChips targets={value} onRemove={handleRemove} disabled={disabled} />

            <Tabs defaultValue="user">
                <TabsList className="grid w-full grid-cols-3">
                    {SHARE_TARGET_TYPES.map((type) => {
                        const { icon: Icon } = SHARE_TARGET_META[type];
                        return (
                            <TabsTrigger key={type} value={type} className="gap-1.5">
                                <Icon className="h-3.5 w-3.5" />
                                {t(`documentShares.targetTypePlural.${type}`)}
                                {counts[type] > 0 && (
                                    <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                                        {counts[type]}
                                    </span>
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {SHARE_TARGET_TYPES.map((type) => {
                    const Content = TAB_CONTENT[type];
                    return (
                        <TabsContent key={type} value={type} className="mt-2">
                            <Content selectedKeys={selectedKeys} onToggle={handleToggle} disabled={disabled} />
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}

export default memo(ShareTargetPicker);
