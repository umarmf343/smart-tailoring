"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Plus } from "lucide-react"

interface Appointment {
  id: string
  customerName: string
  service: string
  date: Date
  time: string
  status: "confirmed" | "pending" | "completed"
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customerName: "John Doe",
    service: "Suit Fitting",
    date: new Date("2025-01-20"),
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    service: "Initial Consultation",
    date: new Date("2025-01-20"),
    time: "2:00 PM",
    status: "pending",
  },
  {
    id: "3",
    customerName: "Mike Johnson",
    service: "Final Fitting",
    date: new Date("2025-01-21"),
    time: "11:00 AM",
    status: "confirmed",
  },
]

export function AvailabilityCalendar() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const statusColors = {
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  }

  const todayAppointments = appointments.filter((apt) => apt.date.toDateString() === selectedDate.toDateString())

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Calendar
              </CardTitle>
              <CardDescription>Manage your customer appointments and availability</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {appointments
                  .filter((apt) => apt.date >= new Date())
                  .slice(0, 5)
                  .map((apt) => (
                    <div key={apt.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{apt.customerName}</p>
                          <p className="text-sm text-muted-foreground">{apt.service}</p>
                        </div>
                        <Badge className={statusColors[apt.status]}>{apt.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {apt.date.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {apt.time}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Available Time Slots</h3>
              <div className="space-y-2">
                {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => {
                  const isBooked = appointments.some(
                    (apt) => apt.time === time && apt.date.toDateString() === selectedDate.toDateString(),
                  )
                  return (
                    <div
                      key={time}
                      className={`p-3 border border-border rounded-lg flex items-center justify-between ${isBooked ? "bg-muted" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </span>
                      {isBooked ? (
                        <Badge variant="secondary">Booked</Badge>
                      ) : (
                        <Badge variant="outline">Available</Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Time Slot</DialogTitle>
            <DialogDescription>Mark a time slot as unavailable</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <input type="date" className="w-full p-2 border border-border rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9am">9:00 AM</SelectItem>
                  <SelectItem value="10am">10:00 AM</SelectItem>
                  <SelectItem value="11am">11:00 AM</SelectItem>
                  <SelectItem value="2pm">2:00 PM</SelectItem>
                  <SelectItem value="3pm">3:00 PM</SelectItem>
                  <SelectItem value="4pm">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Block Slot</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
