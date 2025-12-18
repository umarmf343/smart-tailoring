"use client"

import type { User } from "@/lib/types"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CustomerHeader } from "./customer-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, CreditCard, Sparkles, Wallet } from "lucide-react"
import {
  MEASUREMENT_LIBRARY,
  describeGarmentType,
  formatConvertedMeasurement,
  generateMeasurementAlerts,
  getFieldsForGarment,
  type GarmentType,
} from "@/lib/measurement-system"

interface OrderPlacementProps {
  user: User
}

// Mock tailor data
const MOCK_TAILOR = {
  id: "1",
  businessName: "Master Tailor Co.",
  services: [
    { name: "Custom Suit", price: 450, description: "Full bespoke suit with consultation" },
    { name: "Shirt Making", price: 120, description: "Custom fitted shirts" },
    { name: "Alterations", price: 50, description: "Basic alterations" },
  ],
}

const SERVICE_GARMENT_MAP: Record<string, GarmentType> = {
  "Custom Suit": "blazer",
  "Shirt Making": "shirt",
  Alterations: "pants",
}

export function OrderPlacement({ user }: OrderPlacementProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tailorId = searchParams.get("tailorId")

  const [step, setStep] = useState(1)
  const [orderData, setOrderData] = useState({
    service: "",
    measurementId: "",
    fabricChoice: "",
    customDesign: "",
    specialInstructions: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet")

  const measurementProfiles = MEASUREMENT_LIBRARY
  const selectedService = MOCK_TAILOR.services.find((s) => s.name === orderData.service)
  const recommendedGarmentType = (orderData.service && SERVICE_GARMENT_MAP[orderData.service]) || undefined
  const requiredFields = recommendedGarmentType ? getFieldsForGarment(recommendedGarmentType) : []
  const selectedMeasurementProfile = measurementProfiles.find((profile) => profile.id === orderData.measurementId)
  const selectedMeasurementAlerts = selectedMeasurementProfile ? generateMeasurementAlerts(selectedMeasurementProfile) : []
  const price = selectedService?.price || 0
  const walletBalance = 250

  function handleNext() {
    if (step < 3) setStep(step + 1)
  }

  function handleBack() {
    if (step > 1) setStep(step - 1)
  }

  function handlePlaceOrder() {
    router.push("/customer/order/confirmation")
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Place New Order</h1>
            <p className="text-muted-foreground">Order from {MOCK_TAILOR.businessName}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {["Service & Details", "Measurements", "Payment"].map((stepName, i) => (
                <div key={stepName} className="flex items-center">
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                      step > i + 1
                        ? "bg-primary border-primary text-primary-foreground"
                        : step === i + 1
                          ? "border-primary text-primary"
                          : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {step > i + 1 ? <CheckCircle className="h-5 w-5" /> : i + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {stepName}
                  </span>
                  {i < 2 && <div className="w-20 h-0.5 mx-4 bg-border" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Service & Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Service & Provide Details</CardTitle>
                <CardDescription>Choose the tailoring service you need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service">Service Type</Label>
                  <Select
                    value={orderData.service}
                    onValueChange={(value) => setOrderData({ ...orderData, service: value })}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_TAILOR.services.map((service) => (
                        <SelectItem key={service.name} value={service.name}>
                          {service.name} - ${service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedService && <p className="text-sm text-muted-foreground">{selectedService.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fabric">Fabric Choice (Optional)</Label>
                  <Input
                    id="fabric"
                    placeholder="e.g., Navy Blue Wool, Linen"
                    value={orderData.fabricChoice}
                    onChange={(e) => setOrderData({ ...orderData, fabricChoice: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="design">Custom Design Details (Optional)</Label>
                  <Textarea
                    id="design"
                    placeholder="Describe any specific design preferences..."
                    value={orderData.customDesign}
                    onChange={(e) => setOrderData({ ...orderData, customDesign: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requests or notes for the tailor..."
                    value={orderData.specialInstructions}
                    onChange={(e) => setOrderData({ ...orderData, specialInstructions: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={!orderData.service}>
                    Continue to Measurements
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Measurements */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Measurements</CardTitle>
                <CardDescription>Choose a saved profile and review alerts before sending to the tailor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={orderData.measurementId}
                  onValueChange={(value) => setOrderData({ ...orderData, measurementId: value })}
                >
                  {measurementProfiles.map((measurement) => {
                    const alerts = generateMeasurementAlerts(measurement)
                    const recommended =
                      recommendedGarmentType ? measurement.garmentType === recommendedGarmentType : false
                    return (
                      <div
                        key={measurement.id}
                        className="flex items-start space-x-3 border border-border rounded-lg p-4"
                      >
                        <RadioGroupItem value={measurement.id} id={measurement.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={measurement.id} className="font-medium cursor-pointer">
                            {measurement.name}
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="secondary">{describeGarmentType(measurement.garmentType)}</Badge>
                            <Badge variant="outline">{measurement.unit.toUpperCase()}</Badge>
                            <Badge
                              variant={measurement.status === "verified" ? "default" : "outline"}
                              className={measurement.status === "verified" ? "" : "border-amber-500/40 text-amber-700"}
                            >
                              {measurement.status.replace("-", " ")}
                            </Badge>
                            {recommended && <Badge className="bg-primary/10 text-primary">Recommended for service</Badge>}
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {Object.entries(measurement.measurements).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}:
                                </span>
                                <span className="font-medium">
                                  {value} {measurement.unit}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatConvertedMeasurement(value, measurement.unit)}
                                </span>
                              </div>
                            ))}
                          </div>
                          {alerts.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {alerts.map((alert, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="border-amber-500/40 text-amber-700 dark:text-amber-200"
                                >
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {alert.message}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </RadioGroup>

                {recommendedGarmentType && (
                  <Card className="bg-muted/70">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Measurement checklist for {orderData.service}
                      </CardTitle>
                      <CardDescription>
                        We&apos;ll forward these fields to your tailor and flag any values that need a second look.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                      {requiredFields.map((field) => (
                        <div key={field.key} className="p-3 border rounded-lg bg-background">
                          <p className="font-medium">{field.label}</p>
                          <p className="text-xs text-muted-foreground">{field.helper}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!orderData.measurementId}>
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Choose your payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedMeasurementProfile && (
                  <Card className="bg-muted/70">
                    <CardHeader>
                      <CardTitle className="text-base">Measurement set attached</CardTitle>
                      <CardDescription className="flex flex-wrap gap-2 items-center">
                        <Badge variant="secondary">{selectedMeasurementProfile.name}</Badge>
                        <Badge variant="outline">
                          {describeGarmentType(selectedMeasurementProfile.garmentType)} • {selectedMeasurementProfile.unit}
                        </Badge>
                        {selectedMeasurementAlerts.length > 0 ? (
                          <Badge variant="destructive" className="bg-amber-100 text-amber-800">
                            {selectedMeasurementAlerts.length} alert(s) to confirm
                          </Badge>
                        ) : (
                          <Badge variant="outline">No alerts</Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(selectedMeasurementProfile.measurements).map(([key, value]) => (
                        <div key={key} className="flex justify-between border rounded-md p-2 bg-background">
                          <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className="font-medium">
                            {value} {selectedMeasurementProfile.unit} (
                            {formatConvertedMeasurement(value, selectedMeasurementProfile.unit)})
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{orderData.service}</span>
                  </div>
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${price}</span>
                  </div>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "wallet" | "card")}
                >
                  <div className="flex items-start space-x-3 border border-border rounded-lg p-4">
                    <RadioGroupItem value="wallet" id="wallet" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="wallet" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Wallet className="h-4 w-4" />
                        Wallet Balance
                      </Label>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">Available balance: ${walletBalance}</span>
                        {walletBalance < price && <Badge variant="destructive">Insufficient funds</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 border border-border rounded-lg p-4">
                    <RadioGroupItem value="card" id="card" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="card" className="flex items-center gap-2 font-medium cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">Pay securely with your card</p>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 border border-border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={paymentMethod === "wallet" && walletBalance < price}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Place Order - ${price}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
