import { useState, useEffect } from 'react';
import { navLinks } from '../data/siteData';
import { useBooking } from './booking/BookingContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open: openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-md shadow-[0_12px_40px_rgba(27,28,28,0.06)]'
          : 'bg-white/70 backdrop-blur-md shadow-[0_12px_40px_rgba(27,28,28,0.06)]'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <a href="#" className="flex-shrink-0">
          <img src="/logo.jpeg" alt="San Diego IPS" className="h-12 w-auto" />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-headline font-semibold text-sm tracking-tight transition-colors ${
                link.active
                  ? 'text-orange-500 border-b-2 border-orange-500 pb-1'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        <button onClick={() => openBooking()} className="hidden md:block primary-gradient text-white px-6 py-2.5 rounded-lg font-headline font-bold text-sm tracking-tight hover:opacity-90 transition-all duration-200 active:scale-95">
          Agendar valoración
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-8 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block font-headline font-semibold text-sm tracking-tight ${
                link.active ? 'text-orange-500' : 'text-gray-600'
              }`}
            >
              {link.label}
            </a>
          ))}
          <button onClick={() => { setMenuOpen(false); openBooking(); }} className="w-full primary-gradient text-white px-6 py-3 rounded-lg font-headline font-bold text-sm mt-4 active:scale-95">
            Agendar valoración
          </button>
        </div>
      )}
    </nav>
  );
}
