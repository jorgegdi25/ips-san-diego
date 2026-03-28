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
import { ContentProvider } from './components/ContentContext'
import AdminDashboard from './components/admin/AdminDashboard'
import EditorToolbar from './components/editor/EditorToolbar'

import { useContent } from './components/ContentContext'

function AppContent() {
  const { content } = useContent();
  const isAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';

  if (isAdmin) {
    return <AdminDashboard />;
  }

  const features = content?.features || {
    aiChat: true,
    booking: true,
    whatsappFloating: true
  };

  return (
    <BookingProvider>
      <EditorToolbar />
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
      
      {/* Módulos Condicionales */}
      {features.whatsappFloating && <FloatingWhatsApp />}
      {features.aiChat && <AssistantBot />}
      {features.booking && <BookingDrawer />}
    </BookingProvider>
  );
}

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  )
}

export default App
