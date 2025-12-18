"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2 } from "lucide-react"

// Mock data
const MOCK_REVIEWS = [
  {
    id: "1",
    customerName: "John Doe",
    tailorName: "Master Tailor Co.",
    rating: 5,
    comment: "Excellent work! The suit fits perfectly.",
    date: new Date("2025-01-10"),
    flagged: false,
  },
  {
    id: "2",
    customerName: "Jane Smith",
    tailorName: "Elite Stitches",
    rating: 4,
    comment: "Great service, but delivery was delayed.",
    date: new Date("2025-01-08"),
    flagged: false,
  },
  {
    id: "3",
    customerName: "Mike Johnson",
    tailorName: "Precision Tailoring",
    rating: 1,
    comment: "This is spam content and inappropriate.",
    date: new Date("2025-01-12"),
    flagged: true,
  },
]

export function AdminReviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Moderation</CardTitle>
        <CardDescription>Monitor and moderate customer reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className={`border rounded-lg p-4 ${review.flagged ? "border-destructive bg-destructive/5" : "border-border"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{review.customerName}</p>
                    {review.flagged && <Badge variant="destructive">Flagged</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Reviewing: {review.tailorName}</p>
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
                  <p className="text-sm text-muted-foreground">{review.date.toLocaleDateString()}</p>
                </div>
              </div>

              <p className="text-sm mb-4">{review.comment}</p>

              <div className="flex gap-2">
                {review.flagged && <Button size="sm">Approve Review</Button>}
                <Button size="sm" variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Remove Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
