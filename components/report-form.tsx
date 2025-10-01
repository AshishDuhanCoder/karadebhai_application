"use client"

import type React from "react"

import { useState } from "react"
import { Upload, MapPin, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function ReportForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locationDetected, setLocationDetected] = useState(false)
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const handleLocationDetect = () => {
    setIsLoading(true)

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoordinates({ lat: latitude, lng: longitude })

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "User-Agent": "KaradeBhai-App",
              },
            },
          )
          const data = await response.json()

          const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          setLocation(address)
          setLocationDetected(true)
        } catch (error) {
          console.error("[v0] Error fetching address:", error)
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setLocationDetected(true)
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        console.error("[v0] Error getting location:", error)
        alert("Unable to detect location. Please enable location services.")
        setIsLoading(false)
      },
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Report Submitted!</h3>
              <p className="text-muted-foreground mt-2">
                Thank you for helping improve your community. We'll review your report and take appropriate action.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Report ID: #KB2024-001</p>
              <p className="text-xs text-muted-foreground mt-1">
                You can track the status of your report using this ID
              </p>
            </div>
            <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
              Submit Another Report
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-foreground">Report a civic issue</CardTitle>
        <p className="text-center text-sm text-muted-foreground">Apne Mohalle Ko Banaye Behtar 30 Second me.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Issue Category</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="garbage">Garbage/Litter</SelectItem>
                <SelectItem value="streetlight">Electric Hazard</SelectItem>
                <SelectItem value="sewageissue">Sewage Issue</SelectItem>
                <SelectItem value="stagnantwater">Stagnant Water</SelectItem>
                <SelectItem value="constructiondebris">Construction Debris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Upload Photo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tap or Drag to Upload Image</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Location</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start bg-transparent text-foreground"
              onClick={handleLocationDetect}
              disabled={isLoading}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {isLoading ? "Detecting Location..." : locationDetected ? "Location Detected ✓" : "Detect My Location"}
            </Button>
            {locationDetected && location && (
              <Textarea
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your detected location"
                className="mt-2 min-h-[80px] text-sm"
                rows={3}
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Submitting Report..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
