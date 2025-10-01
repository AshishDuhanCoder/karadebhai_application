import { MapPin, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-xl">KaradeBhai</h1>
            <p className="text-xs text-muted-foreground">Chhoti ho ya badi baat, Karade Bhai sab set kare.</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#report" className="text-sm font-medium hover:text-primary transition-colors">
            Report Issue
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
          <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </a>
          <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden text-foreground">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
