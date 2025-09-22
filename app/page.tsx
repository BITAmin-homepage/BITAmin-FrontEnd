import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d3431a] via-black to-orange-600">
      <Header />
      <Hero />
      <About />
      <Footer />
    </div>
  )
}
