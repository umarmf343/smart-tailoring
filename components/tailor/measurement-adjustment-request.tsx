"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, MessageCircle } from "lucide-react"
import { formatConvertedMeasurement } from "@/lib/measurement-system"

interface MeasurementAdjustmentRequestProps {
  orderId: string
  customerName: string
  measurements: Record<string, number>
  unit?: "inch" | "cm"
  onRequestSent?: () => void
}

export function MeasurementAdjustmentRequest({
  orderId,
  customerName,
  measurements,
  unit = "inch",
  onRequestSent,
}: MeasurementAdjustmentRequestProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")
  const [concernedMeasurements, setConcernedMeasurements] = useState<string[]>([])

  function toggleMeasurement(key: string) {
    setConcernedMeasurements((prev) => (prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]))
  }

  function sendRequest() {
    if (!requestMessage.trim() || concernedMeasurements.length === 0) return

    // Mock sending adjustment request
    console.log("[v0] Sending measurement adjustment request:", {
      orderId,
      concernedMeasurements,
      message: requestMessage,
    })

    setIsDialogOpen(false)
    setRequestMessage("")
    setConcernedMeasurements([])
    onRequestSent?.()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <AlertCircle className="h-4 w-4" />
          Request Measurement Clarification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Measurement Adjustment</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Ask {customerName} to clarify or adjust measurements for Order #{orderId}
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Measurements to Question</CardTitle>
              <CardDescription>Click on measurements that need clarification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(measurements).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleMeasurement(key)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      concernedMeasurements.includes(key)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-medium capitalize mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-lg font-bold">
                      {value} {unit}
                      {concernedMeasurements.includes(key) && (
                        <Badge className="ml-2" variant="secondary">
                          Selected
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ≈ {formatConvertedMeasurement(value, unit)}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {concernedMeasurements.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message to Customer</label>
              <Textarea
                placeholder="Explain what measurements need clarification and why..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Selected measurements: {concernedMeasurements.map((m) => m.replace(/([A-Z])/g, " $1")).join(", ")}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={sendRequest}
              disabled={!requestMessage.trim() || concernedMeasurements.length === 0}
              className="flex-1 gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Send Adjustment Request
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
