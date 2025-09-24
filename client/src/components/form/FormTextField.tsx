import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  testId?: string;
  required?: boolean;
  description?: React.ReactNode;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  testId,
  required = false,
  description
}: FormTextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && " *"}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
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