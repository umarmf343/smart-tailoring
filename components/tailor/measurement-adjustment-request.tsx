"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({
    canScrollDown: false,
    canScrollUp: false,
    hasOverflow: false,
  })

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

  useEffect(() => {
    const viewport = scrollAreaRef.current
    if (!viewport || !isDialogOpen) return

    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport
      const hasOverflow = scrollHeight > clientHeight + 1
      setScrollState({
        hasOverflow,
        canScrollUp: hasOverflow && scrollTop > 8,
        canScrollDown: hasOverflow && scrollTop + clientHeight < scrollHeight - 8,
      })
    }

    updateScrollState()
    viewport.addEventListener("scroll", updateScrollState)
    window.addEventListener("resize", updateScrollState)

    return () => {
      viewport.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [isDialogOpen, measurements])

  useEffect(() => {
    const viewport = scrollAreaRef.current
    if (isDialogOpen && viewport) {
      viewport.scrollTo({ top: 0 })
    }
  }, [isDialogOpen, measurements])

  const handleScrollButtonClick = (direction: "up" | "down") => {
    const viewport = scrollAreaRef.current
    if (!viewport) return

    const delta = direction === "up" ? -260 : 260
    viewport.scrollBy({ top: delta, behavior: "smooth" })
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
          <DialogDescription>
            Ask {customerName} to clarify or adjust measurements for Order #{orderId}
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <div ref={scrollAreaRef} className="space-y-4 max-h-[70vh] overflow-y-auto pr-10">
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

          {scrollState.hasOverflow && (
            <div className="pointer-events-none absolute inset-y-0 right-2 flex flex-col justify-between gap-2 py-4">
              <Button
                size="icon"
                variant="secondary"
                className="pointer-events-auto rounded-full shadow-md bg-background/90"
                onClick={() => handleScrollButtonClick("up")}
                disabled={!scrollState.canScrollUp}
                aria-label="Scroll up"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="pointer-events-auto rounded-full shadow-md bg-background/90"
                onClick={() => handleScrollButtonClick("down")}
                disabled={!scrollState.canScrollDown}
                aria-label="Scroll down"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
