import { Skeleton } from "@/components/ui/skeleton"

export default function HelpLoading() {
  return (
    <div className="container mx-auto py-6">
      <Skeleton className="mb-6 h-10 w-64" />

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <div className="space-y-2">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
