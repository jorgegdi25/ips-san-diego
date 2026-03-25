import './index.css'
import { BookingProvider } from './components/booking/BookingContext'
import BookingDrawer from './components/booking/BookingDrawer'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AuthoritySection from './components/AuthoritySection'
import DoctorSection from './components/DoctorSection'
import ServicesSection from './components/ServicesSection'
import ResultsSection from './components/ResultsSection'
import TestimonialsSection from './components/TestimonialsSection'
import CtaSection from './components/CtaSection'
import LocationSection from './components/LocationSection'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import AssistantBot from './components/AssistantBot'

function App() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <HeroSection />
        <AuthoritySection />
        <DoctorSection />
        <ServicesSection />
        <ResultsSection />
        <TestimonialsSection />
        <CtaSection />
        <LocationSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <AssistantBot />
      <BookingDrawer />
    </BookingProvider>
  )
}

export default App
