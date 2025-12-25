"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Copy, CheckCircle, Users } from "lucide-react"
import { formatNaira } from "@/lib/currency"

interface ReferralProgramProps {
  userId: string
  referralCode?: string
  referralCount?: number
  totalEarned?: number
}

export function ReferralProgram({
  userId,
  referralCode = "HAIB2025",
  referralCount = 3,
  totalEarned = 15000,
}: ReferralProgramProps) {
  const [copied, setCopied] = useState(false)
  const referralLink = `https://haibtailor.com/signup?ref=${referralCode}`

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Referral Program
        </CardTitle>
        <CardDescription>Earn {formatNaira(5000)} for each friend who completes their first order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Referrals</p>
            </div>
            <p className="text-2xl font-bold">{referralCount}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
            <p className="text-2xl font-bold">{formatNaira(totalEarned)}</p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Referral Code</p>
          <div className="flex gap-2">
            <Input value={referralCode} readOnly className="bg-muted" />
            <Button onClick={() => copyToClipboard(referralCode)} className="gap-2">
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Referral Link</p>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="bg-muted text-sm" />
            <Button onClick={() => copyToClipboard(referralLink)} variant="outline" className="gap-2 bg-transparent">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* How it Works */}
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="font-medium">How It Works</p>
          <div className="space-y-2">
            {[
              { step: "1", text: "Share your referral code or link with friends" },
              { step: "2", text: "They sign up using your code" },
              { step: "3", text: `When they complete their first order, you both get ${formatNaira(5000)}!` },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <Badge className="h-6 w-6 flex items-center justify-center p-0 rounded-full">{item.step}</Badge>
                <p className="text-sm text-muted-foreground flex-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referrals */}
        {referralCount > 0 && (
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="font-medium">Recent Referrals</p>
            <div className="space-y-2">
              {[
                { name: "Sade O.", date: "Jan 15, 2025", earned: formatNaira(5000) },
                { name: "Michael A.", date: "Jan 10, 2025", earned: formatNaira(5000) },
                { name: "Emeka L.", date: "Jan 5, 2025", earned: formatNaira(5000) },
              ]
                .slice(0, referralCount)
                .map((referral) => (
                  <div key={referral.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{referral.name}</p>
                      <p className="text-xs text-muted-foreground">{referral.date}</p>
                    </div>
                    <Badge variant="secondary">{referral.earned}</Badge>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
