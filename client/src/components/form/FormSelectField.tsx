import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[] | string[];
  testId?: string;
  required?: boolean;
  description?: React.ReactNode;
}

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  testId,
  required = false,
  description
}: FormSelectFieldProps<T>) {
  const normalizedOptions = options.map(option => 
    typeof option === 'string' ? { value: option, label: option } : option
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && " *"}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger data-testid={testId}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {normalizedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}