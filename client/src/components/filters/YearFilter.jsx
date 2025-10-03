import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const YEARS = [
  { value: 'all', label: 'All Years' },
  { value: '1', label: 'First Year' },
  { value: '2', label: 'Second Year' },
  { value: '3', label: 'Third Year' },
  { value: '4', label: 'Fourth Year' },
  { value: '5', label: 'Fifth Year' }
];

export default function YearFilter({ value, onChange, label = 'Year' }) {
  return (
    <div className="space-y-2" data-testid="container-year-filter">
      <Label htmlFor="year-select" className="text-sm font-medium text-black dark:text-white" data-testid="label-year">
        {label}
      </Label>
      <Select value={value || 'all'} onValueChange={onChange}>
        <SelectTrigger id="year-select" data-testid="select-year-trigger">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent data-testid="select-year-content">
          {YEARS.map((year) => (
            <SelectItem key={year.value} value={year.value} data-testid={`option-year-${year.value}`}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
