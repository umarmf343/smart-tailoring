"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/date"
import { formatNaira } from "@/lib/currency"
import { Wallet, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock data
const MOCK_TRANSACTIONS = [
  {
    id: "1",
    type: "credit" as const,
    amount: 50000,
    description: "Added funds",
    date: new Date("2025-01-15"),
  },
  {
    id: "2",
    type: "debit" as const,
    amount: 120000,
    description: "Payment to Lagos Heritage Tailors",
    date: new Date("2025-01-10"),
  },
  {
    id: "3",
    type: "credit" as const,
    amount: 35000,
    description: "Refund from Abuja Threadworks",
    date: new Date("2025-01-05"),
  },
]

export function WalletManager() {
  const [showAddFunds, setShowAddFunds] = useState(false)
  const balance = 250000

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription>Manage your payment balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-6">{formatNaira(balance, 2)}</div>

          {showAddFunds ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setShowAddFunds(false)
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Add</Label>
                <Input id="amount" type="number" placeholder="5000.00" step="0.01" min="1" required />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Funds</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddFunds(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setShowAddFunds(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Funds
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div
                  className={`font-bold ${transaction.type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {transaction.type === "credit" ? "+" : "-"}
                  {formatNaira(transaction.amount, 2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
