import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ProcessingLoading() {
  return (
    <div className="max-w-2xl mx-auto py-8 text-center">
      {/* Header */}
      <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
      <Skeleton className="h-8 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-80 mx-auto mb-8" />

      {/* Elf Timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 text-left">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="mt-8">
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}
