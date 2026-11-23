import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/components/ui/input";
import { AlertTriangle, Building2, FileText, Flag, Lightbulb, MessageSquare } from "lucide-react";
import FormSection from "./FormSection";
import SectionField from "./SectionField";
import DepartmentFilterSelect from "@/features/departments/components/DepartmentFilterSelect";
import { formErrorText } from "./formErrorText";
import { CATEGORIES, IMPORTANCES } from "../../utils/managementPayload";
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  type DocumentFormValues,
  type FormErrors,
} from "../../utils/documentForm";

interface DocumentDetailsStepProps {
  values: Pick<
    DocumentFormValues,
    "title" | "description" | "importance" | "category"
  >;
  errors: FormErrors;
  onChange: <F extends "title" | "description" | "importance" | "category">(
    field: F,
    value: DocumentFormValues[F],
  ) => void;
  disabled?: boolean;
}

/** Step 1: title, description, importance, category. */
function DocumentDetailsStep({
  values,
  errors,
  onChange,
  disabled,
}: DocumentDetailsStepProps) {
  const { t } = useTranslation("management");

  const importanceOptions = useMemo(
    () => [
      { value: "" as const, label: t("form.choose") },
      ...IMPORTANCES.map((v) => ({ value: v, label: t(`importance.${v}`) })),
    ],
    [t],
  );
  const categoryOptions = useMemo(
    () => [
      { value: "" as const, label: t("form.choose") },
      ...CATEGORIES.map((v) => ({ value: v, label: t(`category.${v}`) })),
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <FormSection
        icon={FileText}
        title={t("form.cards.details.title")}
        subtitle={t("form.cards.details.subtitle")}
      >
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <SectionField
            label={t("form.title")}
            htmlFor="doc-title"
            required
            hint={t("form.cards.titleHint")}
            icon={Lightbulb}
            error={formErrorText(t, errors.title)}
          >
            <Input
              id="doc-title"
              value={values.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder={t("form.titlePlaceholder")}
              maxLength={TITLE_MAX}
              disabled={disabled}
              autoFocus
              dir="auto"
            />
          </SectionField>
          <SectionField
            label={t("form.description")}
            htmlFor="doc-description"
            hint={t("form.cards.descriptionHint")}
            icon={MessageSquare}
            error={formErrorText(t, errors.description)}
          >
            <Input
              id="doc-description"
              value={values.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder={t("form.descriptionPlaceholder")}
              maxLength={DESCRIPTION_MAX}
              disabled={disabled}
              dir="auto"
            />
          </SectionField>
        </div>
      </FormSection>

      <FormSection
        icon={Flag}
        title={t("form.cards.classification.title")}
        subtitle={t("form.cards.classification.subtitle")}
      >
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <SectionField
            label={t("form.importance")}
            required
            hint={t("form.cards.importanceHint")}
            icon={AlertTriangle}
            error={formErrorText(t, errors.importance)}
          >
            <DepartmentFilterSelect
              fullWidth
              label={t("form.importance")}
              value={values.importance}
              options={importanceOptions}
              onChange={(v) => onChange("importance", v)}
            />
          </SectionField>
          <SectionField
            label={t("form.category")}
            required
            hint={t("form.cards.categoryHint")}
            icon={Building2}
            error={formErrorText(t, errors.category)}
          >
            <DepartmentFilterSelect
              fullWidth
              label={t("form.category")}
              value={values.category}
              options={categoryOptions}
              onChange={(v) => onChange("category", v)}
            />
          </SectionField>
        </div>
      </FormSection>
    </div>
  );
}

export default memo(DocumentDetailsStep);
