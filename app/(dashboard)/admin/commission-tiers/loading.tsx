import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CommissionTiersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[500px] mt-2" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-5 w-[100px]" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
