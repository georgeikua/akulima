import { Loader2 } from "lucide-react"

export default function MyBidsLoadingPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
