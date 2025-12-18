"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign, AlertCircle, CheckCircle } from "lucide-react"

interface RefundRequest {
  id: string
  orderId: string
  customerName: string
  tailorName: string
  orderAmount: number
  requestedAmount: number
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
}

const MOCK_REFUND_REQUESTS: RefundRequest[] = [
  {
    id: "REF-001",
    orderId: "ORD-005",
    customerName: "John Doe",
    tailorName: "Master Tailor Co.",
    orderAmount: 450,
    requestedAmount: 450,
    reason: "Incorrect measurements, garment does not fit",
    status: "pending",
    createdAt: new Date("2025-01-17"),
  },
  {
    id: "REF-002",
    orderId: "ORD-006",
    customerName: "Jane Smith",
    tailorName: "Elite Stitches",
    orderAmount: 120,
    requestedAmount: 60,
    reason: "Partial refund for delayed delivery",
    status: "approved",
    createdAt: new Date("2025-01-15"),
  },
]

export function RefundManager() {
  const [requests, setRequests] = useState<RefundRequest[]>(MOCK_REFUND_REQUESTS)
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null)
  const [refundAmount, setRefundAmount] = useState(0)
  const [adminNotes, setAdminNotes] = useState("")

  function processRefund(requestId: string, approved: boolean) {
    setRequests(
      requests.map((req) => (req.id === requestId ? { ...req, status: approved ? "approved" : "rejected" } : req)),
    )
    setSelectedRequest(null)
    setRefundAmount(0)
    setAdminNotes("")
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Refund Management
        </CardTitle>
        <CardDescription>Process refund requests from customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <p className="font-medium">Refund #{request.id}</p>
                  <Badge className={statusColors[request.status]}>{request.status}</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Order:</span> #{request.orderId}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Customer:</span> {request.customerName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tailor:</span> {request.tailorName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Requested:</span> ${request.requestedAmount} of $
                    {request.orderAmount}
                  </p>
                  <p className="text-muted-foreground">Submitted: {request.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                {request.status === "pending" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setRefundAmount(request.requestedAmount)
                        }}
                      >
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Process Refund Request</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg space-y-2">
                          <p className="font-medium">Request Details</p>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-muted-foreground">Order:</span> #{request.orderId}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Customer:</span> {request.customerName}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Order Amount:</span> ${request.orderAmount}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Customer Reason</Label>
                          <p className="text-sm p-3 bg-muted rounded-lg">{request.reason}</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="refundAmount">Refund Amount ($)</Label>
                          <Input
                            id="refundAmount"
                            type="number"
                            step="0.01"
                            max={request.orderAmount}
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(Number.parseFloat(e.target.value))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                          <Textarea
                            id="adminNotes"
                            placeholder="Add any notes about this refund decision..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => processRefund(request.id, true)} className="flex-1 gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Approve Refund
                          </Button>
                          <Button
                            onClick={() => processRefund(request.id, false)}
                            variant="destructive"
                            className="flex-1 gap-2"
                          >
                            <AlertCircle className="h-4 w-4" />
                            Reject Request
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {request.status === "approved" && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Refunded
                  </Badge>
                )}
                {request.status === "rejected" && (
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Rejected
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
