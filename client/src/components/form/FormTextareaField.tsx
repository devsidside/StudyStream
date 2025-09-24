import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  testId?: string;
  required?: boolean;
  rows?: number;
  description?: React.ReactNode;
}

export function FormTextareaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  testId,
  required = false,
  rows = 3,
  description
}: FormTextareaFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && " *"}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              {...field}
              data-testid={testId}
            />
          </FormControl>
          {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}