import { AlertTriangle, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

const REVIEWS = [
  'Contract Renewal',
  'Policy Update',
  'Budget v2',
];

interface Props { tenant: string }

export default function NeedsReview({ tenant }: Props) {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-accent" />
          <h3 className="text-base font-bold text-foreground">Needs your review</h3>
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">3</span>
        </div>
        <div className="space-y-2">
          {REVIEWS.map((r) => (
            <div key={r} className="flex items-center gap-2 text-sm text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {r}
            </div>
          ))}
        </div>
        <Link to={`/${tenant}/documents`}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold">
            Review All
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
