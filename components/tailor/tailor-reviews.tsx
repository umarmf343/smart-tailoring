"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/date"
import { Star, MessageCircle } from "lucide-react"
import { useState } from "react"

// Mock data
const MOCK_REVIEWS = [
  {
    id: "1",
    customerName: "John Doe",
    rating: 5,
    comment: "Excellent work! The suit fits perfectly and the attention to detail is outstanding.",
    date: new Date("2025-01-10"),
    orderId: "ORD-001",
    tailorResponse: null,
  },
  {
    id: "2",
    customerName: "Jane Smith",
    rating: 4,
    comment: "Great service, but delivery was a bit delayed. Overall happy with the results.",
    date: new Date("2025-01-08"),
    orderId: "ORD-002",
    tailorResponse:
      "Thank you for your feedback! We apologize for the delay and are working to improve our delivery times.",
  },
  {
    id: "3",
    customerName: "Mike Johnson",
    rating: 5,
    comment: "Best tailor in town! Will definitely come back for more custom work.",
    date: new Date("2025-01-05"),
    orderId: "ORD-003",
    tailorResponse: null,
  },
]

export function TailorReviews() {
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [response, setResponse] = useState("")

  const averageRating = (MOCK_REVIEWS.reduce((acc, review) => acc + review.rating, 0) / MOCK_REVIEWS.length).toFixed(1)

  function handleSubmitResponse(reviewId: string) {
    setRespondingTo(null)
    setResponse("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Summary</CardTitle>
          <CardDescription>Your customer satisfaction metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${Number(averageRating) >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{MOCK_REVIEWS.length}</div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {Math.round((MOCK_REVIEWS.filter((r) => r.rating >= 4).length / MOCK_REVIEWS.length) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Positive Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>Read and respond to customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{review.customerName}</p>
                    <p className="text-sm text-muted-foreground">Order #{review.orderId}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                  </div>
                </div>

                <p className="text-sm mb-4">{review.comment}</p>

                {review.tailorResponse ? (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Your Response</Badge>
                    </div>
                    <p className="text-sm">{review.tailorResponse}</p>
                  </div>
                ) : respondingTo === review.id ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write your response..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSubmitResponse(review.id)}>
                        Submit Response
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRespondingTo(null)
                          setResponse("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setRespondingTo(review.id)} className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Respond
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
