import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NotificationsCenter } from "@/components/notifications/notifications-center"

export default async function NotificationsPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  return <NotificationsCenter user={user} />
}
