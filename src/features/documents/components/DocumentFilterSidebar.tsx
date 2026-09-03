import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface FilterOption {
  id: string;
  label: string;
}

export interface Filters {
  types: string[];
  departments: string[];
  entities: string[];
  renewals: string[];
  importances: string[];
}

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  typeOptions: FilterOption[];
  departmentOptions: FilterOption[];
}

interface FilterSection {
  label: string;
  items: FilterOption[];
}

export default function DocumentFilterSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
  typeOptions,
  departmentOptions,
}: FilterSidebarProps) {
  const { t } = useTranslation(["documents", "common"]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["types", "departments", "entities", "renewals", "importances"]),
  );

  const filterSections: Record<string, FilterSection> = {
    // types: {
    //   label: t("documentFilterSidebar.sections.type"),
    //   items: typeOptions,
    // },
    // departments: {
    //   label: t("documentFilterSidebar.sections.department"),
    //   items: departmentOptions,
    // },
    entities: {
      label: t("documentFilterSidebar.sections.entity"),
      items: [
        { label: t("entityType.operational"), id: "operational" },
        { label: t("entityType.establishment"), id: "establishment" },
      ],
    },
    renewals: {
      label: t("documentFilterSidebar.sections.renewal"),
      items: [
        { label: t("renewalType.oneTime"), id: "one-time" },
        { label: t("renewalType.renewable"), id: "renewable" },
      ],
    },
    importances: {
      label: t("documentFilterSidebar.sections.importance"),
      items: [
        { label: t("common:priority.critical"), id: "critical" },
        { label: t("common:priority.high"), id: "high" },
        { label: t("common:priority.medium"), id: "medium" },
      ],
    },
  };

  // entities/renewals are single-value dimensions on the backend
  // (category / has_expire_date) — a document can't be both at once —
  // so checking one clears the other instead of accumulating.
  const singleSelectCategories = new Set<keyof Filters>([
    "entities",
    "renewals",
  ]);

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
    checked: boolean,
  ) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters[category] = singleSelectCategories.has(category)
        ? [itemId]
        : [...newFilters[category], itemId];
    } else {
      newFilters[category] = newFilters[category].filter((id) => id !== itemId);
    }
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

  return (
    <div className="w-80 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-fit sticky top-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted">
        <h3 className="text-sm font-bold text-foreground">
          {t("documentFilterSidebar.title")}
        </h3>
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
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                {section.label}
              </p>
              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform ${
                  expandedSections.has(key) ? "" : "-rotate-90"
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
                            e.target.checked,
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
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:bg-muted transition-colors font-medium text-sm"
          >
            <X size={16} />
            {t("documentFilterSidebar.clearAllFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
