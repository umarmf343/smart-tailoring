import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scissors, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Haib Tailor</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-6 text-balance">Custom Tailoring Made Simple</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
            Connect with expert tailors, order bespoke clothing, and track your orders from measurement to delivery.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup?role=customer">
              <Button size="lg">Find a Tailor</Button>
            </Link>
            <Link href="/auth/signup?role=tailor">
              <Button size="lg" variant="outline">
                I'm a Tailor
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg border border-border">
                <Users className="h-12 w-12 mb-4" />
                <h4 className="text-xl font-bold mb-3">For Customers</h4>
                <p className="text-muted-foreground">
                  Browse local tailors, submit measurements, place orders, and track progress in real-time.
                </p>
              </div>
              <div className="bg-background p-8 rounded-lg border border-border">
                <Scissors className="h-12 w-12 mb-4" />
                <h4 className="text-xl font-bold mb-3">For Tailors</h4>
                <p className="text-muted-foreground">
                  Manage orders, communicate with customers, and grow your tailoring business online.
                </p>
              </div>
              <div className="bg-background p-8 rounded-lg border border-border">
                <BarChart3 className="h-12 w-12 mb-4" />
                <h4 className="text-xl font-bold mb-3">For Admins</h4>
                <p className="text-muted-foreground">
                  Oversee operations, manage users, resolve disputes, and track platform analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Haib Tailor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
