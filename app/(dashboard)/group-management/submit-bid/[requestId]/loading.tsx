import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-5 w-48 mb-1" />
              <Skeleton className="h-4 w-36" />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            <Separator />

            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full mt-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-24 mb-1" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-[100px] w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="aspect-square rounded-md" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full mt-1" />
                    <Skeleton className="h-3 w-full mt-1" />
                    <Skeleton className="h-3 w-full mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="flex justify-between border-t bg-muted/50 px-6 py-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </Card>
      </div>
    </div>
  )
}
