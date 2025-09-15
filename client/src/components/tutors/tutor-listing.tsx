import { Card, CardContent } from "@/components/ui/card";
import type { TutorSearchFilters } from "@shared/schema";

interface TutorListingProps {
  searchFilters: TutorSearchFilters;
  onFiltersChange: (filters: TutorSearchFilters) => void;
  "data-testid"?: string;
}

export default function TutorListing({ searchFilters, onFiltersChange, "data-testid": testId }: TutorListingProps) {
  return (
    <div className="space-y-4" data-testid={testId}>
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Find Expert Tutors</h3>
          <p className="text-muted-foreground">
            Browse through our qualified tutors and book sessions that fit your schedule.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}