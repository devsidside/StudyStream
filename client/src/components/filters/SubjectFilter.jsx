import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Business Studies',
  'Economics',
  'Accounting',
  'History',
  'Geography',
  'Political Science',
  'English Literature',
  'Psychology',
  'Sociology'
];

export default function SubjectFilter({ value = [], onChange, label = 'Subjects' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (subject) => {
    const newValue = value.includes(subject)
      ? value.filter(s => s !== subject)
      : [...value, subject];
    onChange(newValue);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2" data-testid="container-subject-filter">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-black dark:text-white" data-testid="label-subjects">
          {label}
          {value.length > 0 && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400" data-testid="text-selected-count">
              ({value.length} selected)
            </span>
          )}
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid="button-toggle-subjects"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800" data-testid="container-subjects-expanded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400" data-testid="text-select-subjects">Select subjects</span>
            {value.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs"
                data-testid="button-clear-subjects"
              >
                Clear all
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-48" data-testid="scroll-subjects">
            <div className="space-y-2">
              {SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2" data-testid={`item-subject-${subject.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={value.includes(subject)}
                    onCheckedChange={() => handleToggle(subject)}
                    data-testid={`checkbox-subject-${subject.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <label
                    htmlFor={`subject-${subject}`}
                    className="text-sm text-black dark:text-white cursor-pointer"
                    data-testid={`label-subject-${subject.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {subject}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {!isExpanded && value.length > 0 && (
        <div className="flex flex-wrap gap-1" data-testid="container-selected-subjects">
          {value.slice(0, 3).map((subject) => (
            <span
              key={subject}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
              data-testid={`badge-subject-${subject.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {subject}
            </span>
          ))}
          {value.length > 3 && (
            <span
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
              data-testid="badge-more-subjects"
            >
              +{value.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
