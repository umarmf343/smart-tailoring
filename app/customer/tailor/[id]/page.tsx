import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TailorPublicProfile } from "@/components/customer/tailor-public-profile"

export default async function TailorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  const { id } = await params

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return <TailorPublicProfile tailorId={id} user={user} />
}
