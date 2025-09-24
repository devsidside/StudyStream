import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  testId?: string;
  description?: React.ReactNode;
}

export function FormCheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  testId,
  description
}: FormCheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              data-testid={testId}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm">{label}</FormLabel>
            {description && <div className="text-xs text-muted-foreground">{description}</div>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}