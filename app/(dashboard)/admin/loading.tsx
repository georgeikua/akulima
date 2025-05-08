import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AdminDashboardLoading() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Skeleton className="h-10 w-[100px] rounded-full" />
            <Skeleton className="h-10 w-[100px] rounded-full" />
            <Skeleton className="h-10 w-[100px] rounded-full" />
            <Skeleton className="h-10 w-[120px] rounded-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-7 w-[150px]" />
                    <Skeleton className="h-4 w-[100px] mt-1" />
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full rounded-lg" />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-4 w-[200px] mt-1" />
              </CardHeader>
              <CardContent className="grid gap-2">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-4 w-[200px] mt-1" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array(3)
                        .fill(null)
                        .map((_, j) => (
                          <div key={j} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Skeleton className="h-5 w-[150px]" />
                              <Skeleton className="h-4 w-[100px]" />
                            </div>
                            <div className="text-right">
                              <Skeleton className="h-5 w-[100px]" />
                              <Skeleton className="h-4 w-[80px] mt-1" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
