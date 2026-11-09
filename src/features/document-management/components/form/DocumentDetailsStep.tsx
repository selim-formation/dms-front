import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/components/ui/input";
import DepartmentFormField from "@/features/departments/components/DepartmentFormField";
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
    <div className="grid grid-cols-1 items-start gap-x-5 gap-y-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <DepartmentFormField
          label={t("form.title")}
          htmlFor="doc-title"
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
        </DepartmentFormField>
      </div>

      <div className="md:col-span-2">
        <DepartmentFormField
          label={t("form.description")}
          htmlFor="doc-description"
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
        </DepartmentFormField>
      </div>

      <DepartmentFormField
        label={t("form.importance")}
        error={formErrorText(t, errors.importance)}
      >
        <DepartmentFilterSelect
          label={t("form.importance")}
          value={values.importance}
          options={importanceOptions}
          onChange={(v) => onChange("importance", v)}
        />
      </DepartmentFormField>
      <DepartmentFormField
        label={t("form.category")}
        error={formErrorText(t, errors.category)}
      >
        <DepartmentFilterSelect
          label={t("form.category")}
          value={values.category}
          options={categoryOptions}
          onChange={(v) => onChange("category", v)}
        />
      </DepartmentFormField>
    </div>
  );
}

export default memo(DocumentDetailsStep);
