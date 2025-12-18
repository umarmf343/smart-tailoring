"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"

interface InvoiceData {
  orderId: string
  customerName: string
  customerEmail: string
  customerAddress: string
  tailorName: string
  tailorAddress: string
  service: string
  price: number
  paymentMethod: string
  transactionId: string
  orderDate: Date
  items?: Array<{
    description: string
    quantity: number
    price: number
  }>
}

interface InvoiceGeneratorProps {
  data: InvoiceData
}

export function InvoiceGenerator({ data }: InvoiceGeneratorProps) {
  function generatePDF() {
    // Mock PDF generation - in production, use a library like jsPDF or pdfmake
    const invoiceContent = `
INVOICE
--------------------
Order #: ${data.orderId}
Date: ${data.orderDate.toLocaleDateString()}

CUSTOMER INFORMATION:
${data.customerName}
${data.customerEmail}
${data.customerAddress}

TAILOR INFORMATION:
${data.tailorName}
${data.tailorAddress}

SERVICES:
${data.service} - $${data.price}

PAYMENT DETAILS:
Payment Method: ${data.paymentMethod}
Transaction ID: ${data.transactionId}

TOTAL: $${data.price}

Thank you for your business!
    `

    // Create a blob and download
    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `invoice-${data.orderId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-2">From:</p>
            <p className="text-sm text-muted-foreground">{data.tailorName}</p>
            <p className="text-sm text-muted-foreground">{data.tailorAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">To:</p>
            <p className="text-sm text-muted-foreground">{data.customerName}</p>
            <p className="text-sm text-muted-foreground">{data.customerEmail}</p>
            <p className="text-sm text-muted-foreground">{data.customerAddress}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">Order Number:</p>
            <p className="text-sm">{data.orderId}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">Date:</p>
            <p className="text-sm">{data.orderDate.toLocaleDateString()}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">Payment Method:</p>
            <p className="text-sm">{data.paymentMethod}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-medium">Transaction ID:</p>
            <p className="text-sm font-mono text-xs">{data.transactionId}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm">{data.service}</p>
              <p className="text-sm font-medium">${data.price}</p>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-border pt-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Total Amount:</p>
            <p className="text-2xl font-bold">${data.price}</p>
          </div>
        </div>

        <Button onClick={generatePDF} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Download Invoice (PDF)
        </Button>
      </CardContent>
    </Card>
  )
}
