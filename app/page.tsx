import { ReportForm } from "@/components/report-form"
import { SimpleHeader } from "@/components/simple-header"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <SimpleHeader />

      {/* Greenery background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lush-green-trees-and-plants-nature-background.jpg')`,
        }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
        </div>

        <div className="flex justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md">
            <ReportForm />
          </div>
        </div>
      </div>
    </div>
  )
}
