import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const STREAMS = [
  { value: 'all', label: 'All Streams' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts' },
  { value: 'science', label: 'Science' },
  { value: 'law', label: 'Law' },
  { value: 'management', label: 'Management' },
  { value: 'design', label: 'Design' }
];

export default function StreamFilter({ value, onChange, label = 'Stream' }) {
  return (
    <div className="space-y-2" data-testid="container-stream-filter">
      <Label htmlFor="stream-select" className="text-sm font-medium text-black dark:text-white" data-testid="label-stream">
        {label}
      </Label>
      <Select value={value || 'all'} onValueChange={onChange}>
        <SelectTrigger id="stream-select" data-testid="select-stream-trigger">
          <SelectValue placeholder="Select stream" />
        </SelectTrigger>
        <SelectContent data-testid="select-stream-content">
          {STREAMS.map((stream) => (
            <SelectItem key={stream.value} value={stream.value} data-testid={`option-stream-${stream.value}`}>
              {stream.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
