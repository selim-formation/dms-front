import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FilterSidebarProps {
    onFiltersChange: (filters: Filters) => void;
    onClearFilters: () => void;
}

interface Filters {
    types: string[];
    departments: string[];
    entities: string[];
    renewals: string[];
    importances: string[];
}

interface FilterSection {
    label: string;
    labelArabic: string;
    items: { label: string; id: string }[];
}

export default function DocumentFilterSidebar({
    onFiltersChange,
    onClearFilters,
}: FilterSidebarProps) {
    const { t } = useTranslation(['documents', 'common']);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['types', 'departments'])
    );
    const [filters, setFilters] = useState<Filters>({
        types: [],
        departments: [],
        entities: [],
        renewals: [],
        importances: [],
    });

    const filterSections: Record<string, FilterSection> = {
        types: {
            label: t('documentFilterSidebar.sections.type'),
            labelArabic: t('documentFilterSidebar.sections.typeArabic'),
            items: [
                { label: t('documentFilterSidebar.types.licenses'), id: 'licenses' },
                { label: t('documentFilterSidebar.types.permits'), id: 'permits' },
                { label: t('documentFilterSidebar.types.authorizations'), id: 'authorizations' },
                { label: t('documentFilterSidebar.types.cards'), id: 'cards' },
                { label: t('documentFilterSidebar.types.approvals'), id: 'approvals' },
                { label: t('documentFilterSidebar.types.equipment'), id: 'equipment' },
            ],
        },
        entities: {
            label: t('documentFilterSidebar.sections.entity'),
            labelArabic: t('documentFilterSidebar.sections.entityArabic'),
            items: [
                { label: t('entityType.operational'), id: 'operational' },
                { label: t('entityType.establishment'), id: 'establishment' },
            ],
        },
        renewals: {
            label: t('documentFilterSidebar.sections.renewal'),
            labelArabic: t('documentFilterSidebar.sections.renewalArabic'),
            items: [
                { label: t('renewalType.oneTime'), id: 'one-time' },
                { label: t('renewalType.renewable'), id: 'renewable' },
            ],
        },
        importances: {
            label: t('documentFilterSidebar.sections.importance'),
            labelArabic: t('documentFilterSidebar.sections.importanceArabic'),
            items: [
                { label: t('common:priority.critical'), id: 'critical' },
                { label: t('common:priority.high'), id: 'high' },
                { label: t('common:priority.medium'), id: 'medium' },
            ],
        },
    };

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const handleFilterChange = (
        category: keyof Filters,
        itemId: string,
        checked: boolean
    ) => {
        const newFilters = { ...filters };
        if (checked) {
            newFilters[category] = [...newFilters[category], itemId];
        } else {
            newFilters[category] = newFilters[category].filter((id) => id !== itemId);
        }
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            types: [],
            departments: [],
            entities: [],
            renewals: [],
            importances: [],
        });
        onClearFilters();
    };

    const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

    return (
        <div className="w-80 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-fit sticky top-6">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-muted">
                <h3 className="text-sm font-bold text-foreground">{t('documentFilterSidebar.title')}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t('documentFilterSidebar.titleArabic')}</p>
            </div>

            {/* Filter Sections */}
            <div className="flex-1 overflow-y-auto">
                {Object.entries(filterSections).map(([key, section]) => (
                    <div key={key} className="border-b border-border last:border-b-0">
                        {/* Section Header */}
                        <button
                            onClick={() => toggleSection(key)}
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-muted transition-colors"
                        >
                            <div className="text-start">
                                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                    {section.label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">{section.labelArabic}</p>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-muted-foreground transition-transform ${expandedSections.has(key) ? '' : '-rotate-90'
                                    }`}
                            />
                        </button>

                        {/* Section Content */}
                        {expandedSections.has(key) && (
                            <div className="px-6 py-3 bg-muted space-y-2.5">
                                {section.items.map((item) => {
                                    const isChecked =
                                        filters[key as keyof Filters]?.includes(item.id) || false;

                                    return (
                                        <label
                                            key={item.id}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        key as keyof Filters,
                                                        item.id,
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                {item.label}
                                            </span>
                                            {isChecked && (
                                                <span className="ms-auto px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                                    ✓
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            {hasActiveFilters && (
                <div className="px-6 py-4 border-t border-border bg-muted">
                    <button
                        onClick={handleClearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:bg-muted transition-colors font-medium text-sm"
                    >
                        <X size={16} />
                        {t('documentFilterSidebar.clearAllFilters')}
                    </button>
                </div>
            )}
        </div>
    );
}
