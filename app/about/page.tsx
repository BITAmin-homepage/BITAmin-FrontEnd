import Curriculum from "./components/curriculum"
import ActivitiesSection from "./components/activities"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AwardsSection from "./components/awards"
export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      <Header />
      <Curriculum />
      <ActivitiesSection />
      <AwardsSection />
      <Footer />
    </div>
  )
}