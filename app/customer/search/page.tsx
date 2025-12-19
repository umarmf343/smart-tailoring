import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { TailorSearch } from "@/components/customer/tailor-search"

export default async function TailorSearchPage() {
  const user = await getSession()

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return <TailorSearch user={user} />
}
