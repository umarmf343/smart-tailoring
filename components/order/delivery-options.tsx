"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Package, Home } from "lucide-react"

export type DeliveryOption = "pickup" | "delivery"

interface DeliveryOptionsProps {
  value: DeliveryOption
  onChange: (value: DeliveryOption) => void
  deliveryAddress?: string
  onDeliveryAddressChange?: (address: string) => void
  deliveryInstructions?: string
  onDeliveryInstructionsChange?: (instructions: string) => void
  pickupAddress?: string
}

export function DeliveryOptions({
  value,
  onChange,
  deliveryAddress,
  onDeliveryAddressChange,
  deliveryInstructions,
  onDeliveryInstructionsChange,
  pickupAddress,
}: DeliveryOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Options</CardTitle>
        <CardDescription>Choose how you'd like to receive your order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={value} onValueChange={(v) => onChange(v as DeliveryOption)}>
          <div className="flex items-start space-x-3 border border-border rounded-lg p-4">
            <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="pickup" className="flex items-center gap-2 font-medium cursor-pointer">
                <Package className="h-4 w-4" />
                Pickup from Tailor
              </Label>
              <p className="text-sm text-muted-foreground mt-2">
                Pick up your order directly from the tailor's location
              </p>
              {value === "pickup" && pickupAddress && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Pickup Address:</p>
                  <p className="text-sm text-muted-foreground">{pickupAddress}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 border border-border rounded-lg p-4">
            <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="delivery" className="flex items-center gap-2 font-medium cursor-pointer">
                <Home className="h-4 w-4" />
                Home Delivery
              </Label>
              <p className="text-sm text-muted-foreground mt-2">Get your order delivered to your doorstep</p>
              {value === "delivery" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      placeholder="Enter your complete delivery address"
                      value={deliveryAddress}
                      onChange={(e) => onDeliveryAddressChange?.(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                    <Textarea
                      id="deliveryInstructions"
                      placeholder="E.g., Leave at front door, Call upon arrival"
                      value={deliveryInstructions}
                      onChange={(e) => onDeliveryInstructionsChange?.(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
