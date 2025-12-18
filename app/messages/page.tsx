import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { MessagingInterface } from "@/components/messaging/messaging-interface"

export default async function MessagesPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  return <MessagingInterface user={user} />
}
