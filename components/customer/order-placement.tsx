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
import { formatNaira } from "@/lib/currency"
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
  businessName: "Aso Oke Atelier",
  services: [
    { name: "Agbada Set", price: 180000, description: "Three-piece agbada with embroidery and inner kaftan" },
    { name: "Kaftan & Trousers", price: 95000, description: "Classic kaftan with fitted trousers" },
    { name: "Senator Suit", price: 120000, description: "Modern senator suit with sharp tailoring" },
    { name: "Buba & Wrapper", price: 110000, description: "Traditional buba with iro and gele styling" },
    { name: "Aso Ebi Group Order", price: 250000, description: "Coordinated family or bridal party set" },
    { name: "Alterations", price: 20000, description: "Resizing, tapering, and finishing adjustments" },
  ],
}

const SERVICE_GARMENT_MAP: Record<string, GarmentType> = {
  "Agbada Set": "agbada",
  "Kaftan & Trousers": "kaftan",
  "Senator Suit": "senator",
  "Buba & Wrapper": "buba",
  "Aso Ebi Group Order": "buba",
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
    occasion: "",
    outfitStyle: "",
    fabricType: "",
    embroideryStyle: "",
    sleeveStyle: "",
    necklineStyle: "",
    fitPreference: "",
    deliveryLocation: "",
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
  const walletBalance = 75000

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
                <CardDescription>Choose the Nigerian tailoring service you need</CardDescription>
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
                          {service.name} - {formatNaira(service.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedService && <p className="text-sm text-muted-foreground">{selectedService.description}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="occasion">Occasion</Label>
                    <Select
                      value={orderData.occasion}
                      onValueChange={(value) => setOrderData({ ...orderData, occasion: value })}
                    >
                      <SelectTrigger id="occasion">
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Wedding", "Naming ceremony", "Festival", "Office wear", "Friday traditional"].map(
                          (occasion) => (
                            <SelectItem key={occasion} value={occasion}>
                              {occasion}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outfitStyle">Outfit Style</Label>
                    <Select
                      value={orderData.outfitStyle}
                      onValueChange={(value) => setOrderData({ ...orderData, outfitStyle: value })}
                    >
                      <SelectTrigger id="outfitStyle">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Agbada", "Kaftan", "Senator", "Buba & Wrapper", "Iro & Buba", "Isi Agu"].map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fabricType">Fabric Type</Label>
                    <Select
                      value={orderData.fabricType}
                      onValueChange={(value) => setOrderData({ ...orderData, fabricType: value })}
                    >
                      <SelectTrigger id="fabricType">
                        <SelectValue placeholder="Select fabric" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Ankara", "Aso Oke", "Lace", "Adire", "George", "Guinea", "Damask"].map((fabric) => (
                          <SelectItem key={fabric} value={fabric}>
                            {fabric}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="embroideryStyle">Embroidery Style</Label>
                    <Select
                      value={orderData.embroideryStyle}
                      onValueChange={(value) => setOrderData({ ...orderData, embroideryStyle: value })}
                    >
                      <SelectTrigger id="embroideryStyle">
                        <SelectValue placeholder="Select embroidery" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Minimal threadwork", "Heavy chest panel", "Beads & stones", "No embroidery"].map(
                          (style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sleeveStyle">Sleeve Style</Label>
                    <Select
                      value={orderData.sleeveStyle}
                      onValueChange={(value) => setOrderData({ ...orderData, sleeveStyle: value })}
                    >
                      <SelectTrigger id="sleeveStyle">
                        <SelectValue placeholder="Select sleeve" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Straight", "Wide agbada sleeve", "Cuffed", "Short sleeve"].map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="necklineStyle">Neckline Style</Label>
                    <Select
                      value={orderData.necklineStyle}
                      onValueChange={(value) => setOrderData({ ...orderData, necklineStyle: value })}
                    >
                      <SelectTrigger id="necklineStyle">
                        <SelectValue placeholder="Select neckline" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Round", "V-neck", "Buttoned placket", "Open chest panel"].map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fitPreference">Fit Preference</Label>
                    <Select
                      value={orderData.fitPreference}
                      onValueChange={(value) => setOrderData({ ...orderData, fitPreference: value })}
                    >
                      <SelectTrigger id="fitPreference">
                        <SelectValue placeholder="Select fit" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Classic", "Relaxed", "Slim", "Extra flowing"].map((fit) => (
                          <SelectItem key={fit} value={fit}>
                            {fit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryLocation">Delivery Location</Label>
                    <Select
                      value={orderData.deliveryLocation}
                      onValueChange={(value) => setOrderData({ ...orderData, deliveryLocation: value })}
                    >
                      <SelectTrigger id="deliveryLocation">
                        <SelectValue placeholder="Select delivery option" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Pickup in Lagos", "Home delivery (Lagos)", "Interstate delivery", "Pickup in Abuja"].map(
                          (option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="design">Custom Design Details (Optional)</Label>
                  <Textarea
                    id="design"
                    placeholder="Describe embroidery placement, lining, or beadwork preferences..."
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
                <div className="space-y-2">
                  <Label htmlFor="measurement-profile">Measurement profile</Label>
                  <Select
                    value={orderData.measurementId}
                    onValueChange={(value) => setOrderData({ ...orderData, measurementId: value })}
                  >
                    <SelectTrigger id="measurement-profile">
                      <SelectValue placeholder="Select a saved profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {measurementProfiles.map((measurement) => (
                        <SelectItem key={measurement.id} value={measurement.id}>
                          {measurement.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!selectedMeasurementProfile && (
                  <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                    Choose a saved profile to review the measurements that will be sent to the tailor.
                  </div>
                )}

                {selectedMeasurementProfile && (() => {
                  const alerts = generateMeasurementAlerts(selectedMeasurementProfile)
                  const recommended =
                    recommendedGarmentType
                      ? selectedMeasurementProfile.garmentType === recommendedGarmentType
                      : false
                  return (
                    <div className="space-y-4">
                      <Card className="bg-muted/70">
                        <CardHeader>
                          <CardTitle className="text-base">{selectedMeasurementProfile.name}</CardTitle>
                          <CardDescription className="flex flex-wrap gap-2">
                            <Badge variant="secondary">
                              {describeGarmentType(selectedMeasurementProfile.garmentType)}
                            </Badge>
                            <Badge variant="outline">{selectedMeasurementProfile.unit.toUpperCase()}</Badge>
                            <Badge
                              variant={selectedMeasurementProfile.status === "verified" ? "default" : "outline"}
                              className={
                                selectedMeasurementProfile.status === "verified"
                                  ? ""
                                  : "border-amber-500/40 text-amber-700"
                              }
                            >
                              {selectedMeasurementProfile.status.replace("-", " ")}
                            </Badge>
                            {recommended && (
                              <Badge className="bg-primary/10 text-primary">Recommended for service</Badge>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(selectedMeasurementProfile.measurements).map(([key, value]) => (
                            <div key={key} className="flex justify-between border rounded-md p-2 bg-background">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                              </span>
                              <span className="font-medium">
                                {value} {selectedMeasurementProfile.unit}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatConvertedMeasurement(value, selectedMeasurementProfile.unit)}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {alerts.length > 0 && (
                        <div className="flex flex-wrap gap-2">
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
                  )
                })()}

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
                    <span>{formatNaira(price)}</span>
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
                        <span className="text-sm text-muted-foreground">
                          Available balance: {formatNaira(walletBalance)}
                        </span>
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
                    Place Order - {formatNaira(price)}
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
