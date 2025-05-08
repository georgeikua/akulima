import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { SidebarNav } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Loading() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <Skeleton className="h-10 w-[250px]" />
                  <Skeleton className="mt-2 h-4 w-[350px]" />
                </div>
                <Skeleton className="h-10 w-[180px]" />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-10 w-full sm:w-[300px]" />
                  <Skeleton className="h-10 w-full sm:w-[250px]" />
                </div>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="mt-2 h-4 w-[300px]" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-[120px]" />
                        </div>
                        <div className="flex-1">
                          <Skeleton className="h-5 w-[100px]" />
                        </div>
                        <div className="flex-1">
                          <Skeleton className="h-5 w-[80px]" />
                        </div>
                        <div className="flex-1">
                          <Skeleton className="h-5 w-[60px]" />
                        </div>
                        <div className="flex-1">
                          <Skeleton className="h-5 w-[100px]" />
                        </div>
                        <div className="flex-1">
                          <Skeleton className="h-5 w-[80px]" />
                        </div>
                      </div>

                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                          <div className="flex-1">
                            <Skeleton className="h-5 w-[120px]" />
                          </div>
                          <div className="flex-1">
                            <Skeleton className="h-5 w-[100px]" />
                          </div>
                          <div className="flex-1">
                            <Skeleton className="h-5 w-[80px]" />
                          </div>
                          <div className="flex-1">
                            <Skeleton className="h-5 w-[60px]" />
                          </div>
                          <div className="flex-1">
                            <Skeleton className="h-5 w-[100px]" />
                          </div>
                          <div className="flex-1">
                            <Skeleton className="h-5 w-[80px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-full max-w-[300px]" />
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
