import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TailorHeader } from "@/components/tailor/tailor-header"
import { FabricCatalog } from "@/components/tailor/fabric-catalog"

export default async function FabricsPage() {
  const user = await getSession()

  if (!user || user.role !== "tailor") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <TailorHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fabric Catalog</h1>
          <p className="text-muted-foreground">Manage your available fabrics for customer selection</p>
        </div>

        <FabricCatalog />
      </main>
    </div>
  )
}
