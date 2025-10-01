"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MapPin, Send, CheckCircle, Camera, ImageIcon } from "lucide-react"
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
  const [selectedCategory, setSelectedCategory] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isValidatingImage, setIsValidatingImage] = useState(false)
  const [validationMessage, setValidationMessage] = useState<{
    type: "success" | "warning" | "error"
    text: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

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

  const validateImageWithAI = async (file: File, category: string) => {
    if (!category) {
      setValidationMessage({ type: "warning", text: "Please select a category first" })
      return
    }

    setIsValidatingImage(true)
    setValidationMessage(null)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        try {
          console.log("[v0] Starting image validation for category:", category)

          // Convert base64 to blob for API
          const base64Data = (reader.result as string).split(",")[1]
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: file.type })

          // Try Hugging Face API with proper format
          const response = await fetch("https://api-inference.huggingface.co/models/google/vit-base-patch16-224", {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
            },
            body: blob,
          })

          console.log("[v0] API Response status:", response.status)

          if (!response.ok) {
            console.log("[v0] API Error:", await response.text())
            throw new Error(`API returned ${response.status}`)
          }

          const result = await response.json()
          console.log("[v0] AI Classification Result:", result)

          // Enhanced category keywords with more variations
          const categoryKeywords: Record<string, string[]> = {
            pothole: [
              "road",
              "street",
              "pavement",
              "asphalt",
              "crack",
              "hole",
              "highway",
              "path",
              "sidewalk",
              "concrete",
            ],
            garbage: ["garbage", "trash", "litter", "waste", "rubbish", "bin", "bag", "plastic", "bottle", "can"],
            streetlight: ["light", "lamp", "pole", "electric", "wire", "cable", "bulb", "street", "traffic", "signal"],
            sewageissue: ["water", "drain", "pipe", "sewer", "manhole", "gutter", "drainage", "canal"],
            stagnantwater: ["water", "puddle", "pond", "pool", "flood", "lake", "rain", "wet"],
            constructiondebris: [
              "construction",
              "debris",
              "rubble",
              "concrete",
              "brick",
              "building",
              "wall",
              "structure",
            ],
          }

          const keywords = categoryKeywords[category] || []

          // Check if result is an array
          if (!Array.isArray(result)) {
            console.log("[v0] Unexpected result format:", result)
            throw new Error("Unexpected API response format")
          }

          const topPredictions = result.slice(0, 10) // Check more predictions
          console.log("[v0] Top predictions:", topPredictions)

          // More lenient matching - check if any keyword appears in any prediction
          const isRelevant = topPredictions.some((pred: { label: string; score: number }) => {
            const label = pred.label.toLowerCase()
            const matches = keywords.some((keyword) => label.includes(keyword))
            if (matches) {
              console.log("[v0] Match found:", label, "with score:", pred.score)
            }
            return matches
          })

          if (isRelevant) {
            setValidationMessage({
              type: "success",
              text: "✓ Image matches the selected category",
            })
          } else {
            // Show what was detected to help user understand
            const topLabel = topPredictions[0]?.label || "unknown"
            setValidationMessage({
              type: "warning",
              text: `⚠ Image detected as "${topLabel}". Please verify it matches "${category}" or upload a different photo.`,
            })
          }
        } catch (error) {
          console.error("[v0] Error validating image:", error)
          setValidationMessage({
            type: "error",
            text: "Could not validate image. You can still submit.",
          })
        } finally {
          setIsValidatingImage(false)
        }
      }

      reader.onerror = () => {
        console.error("[v0] Error reading file")
        setIsValidatingImage(false)
        setValidationMessage({
          type: "error",
          text: "Error reading image file",
        })
      }
    } catch (error) {
      console.error("[v0] Error processing image:", error)
      setIsValidatingImage(false)
      setValidationMessage({
        type: "error",
        text: "Error processing image",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
        validateImageWithAI(file, selectedCategory)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
        validateImageWithAI(file, selectedCategory)
      }
      reader.readAsDataURL(file)
    }
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
            <Select required value={selectedCategory} onValueChange={setSelectedCategory}>
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
            {uploadedImage ? (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border-2 border-border">
                  <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" className="w-full h-48 object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setUploadedImage(null)
                      setImageFile(null)
                      setValidationMessage(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>
                {isValidatingImage && (
                  <p className="text-sm text-muted-foreground text-center">🔍 Validating image with AI...</p>
                )}
                {validationMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      validationMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : validationMessage.type === "warning"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {validationMessage.text}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 bg-transparent"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Take Photo</span>
                </Button>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs">Upload Image</span>
                </Button>
              </div>
            )}
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
