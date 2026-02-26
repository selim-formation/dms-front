import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

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
            label: 'Type',
            labelArabic: 'نوع المستند',
            items: [
                { label: 'Licenses (تراخيص)', id: 'licenses' },
                { label: 'Permits (تصاريح)', id: 'permits' },
                { label: 'Authorizations (تفويضات)', id: 'authorizations' },
                { label: 'Cards (بطاقات)', id: 'cards' },
                { label: 'Approvals (اذونات)', id: 'approvals' },
                { label: 'Equipment (الات)', id: 'equipment' },
            ],
        },
        entities: {
            label: 'Entity',
            labelArabic: 'الكيان',
            items: [
                { label: 'Operational', id: 'operational' },
                { label: 'Establishment', id: 'establishment' },
            ],
        },
        renewals: {
            label: 'Renewal',
            labelArabic: 'التجديد',
            items: [
                { label: 'One-Time', id: 'one-time' },
                { label: 'Renewable', id: 'renewable' },
            ],
        },
        importances: {
            label: 'Importance',
            labelArabic: 'الأهمية',
            items: [
                { label: 'Critical', id: 'critical' },
                { label: 'High', id: 'high' },
                { label: 'Medium', id: 'medium' },
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
        <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit sticky top-6">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900">Advanced Filters</h3>
                <p className="text-xs text-gray-500 mt-0.5">تصفية متقدمة</p>
            </div>

            {/* Filter Sections */}
            <div className="flex-1 overflow-y-auto">
                {Object.entries(filterSections).map(([key, section]) => (
                    <div key={key} className="border-b border-gray-100 last:border-b-0">
                        {/* Section Header */}
                        <button
                            onClick={() => toggleSection(key)}
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <div className="text-left">
                                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                    {section.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{section.labelArabic}</p>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform ${expandedSections.has(key) ? '' : '-rotate-90'
                                    }`}
                            />
                        </button>

                        {/* Section Content */}
                        {expandedSections.has(key) && (
                            <div className="px-6 py-3 bg-gray-50 space-y-2.5">
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
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                                {item.label}
                                            </span>
                                            {isChecked && (
                                                <span className="ml-auto px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
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
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleClearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                        <X size={16} />
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
