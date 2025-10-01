import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SimpleHeader() {
  return (
    <header className="relative z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and tagline */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">KaradeBhai</h1>
            <p className="text-sm text-gray-600">Chhoti ho ya badi baat, Karade Bhai sab set kare.</p>
          </div>
        </div>

        {/* About button */}
        <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent">
          About
        </Button>
      </div>
    </header>
  )
}
