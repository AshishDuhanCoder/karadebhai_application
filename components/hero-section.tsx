import { ArrowRight, Camera, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Apne Mohalle Ko Banaye
              <span className="text-primary block">Behtar Saath Mein</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sadak ke gadde, toote streetlight, ya kachra ki samasya - sab kuch report kariye. KaradeBhai ke saath
              local authorities ko jaldi pata chale aur aapka mohalla rahe hamesha sundar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90">
              Report an Issue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-background text-foreground border-border hover:bg-accent"
            >
              View Recent Reports
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Snap a Photo</h3>
              <p className="text-sm text-muted-foreground">Take a quick photo of the issue you want to report</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Add Location</h3>
              <p className="text-sm text-muted-foreground">
                We'll automatically detect your location or let you choose
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Get Results</h3>
              <p className="text-sm text-muted-foreground">Track your report and see when it gets resolved</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
