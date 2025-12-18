import { DesignGallery } from "@/components/design-gallery"
import Link from "next/link"
import { Scissors, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DesignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="h-6 w-6" />
              <span className="text-xl font-bold">Haib Tailor</span>
            </Link>
            <Link href="/customer/dashboard">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Design Gallery</h1>
          <p className="text-muted-foreground text-lg">Browse our curated collection of design templates</p>
        </div>

        <DesignGallery />
      </main>
    </div>
  )
}
