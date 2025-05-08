import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function RevenueReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[500px] mt-2" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-[150px] mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[150px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="flex space-x-2 mb-4">
        <Skeleton className="h-10 w-[150px] rounded-full" />
        <Skeleton className="h-10 w-[120px] rounded-full" />
        <Skeleton className="h-10 w-[120px] rounded-full" />
        <Skeleton className="h-10 w-[180px] rounded-full" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}
