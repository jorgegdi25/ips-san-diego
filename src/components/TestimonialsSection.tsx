import { testimonials } from '../data/siteData';

function Stars() {
  return (
    <div className="flex gap-1 text-primary-container mb-4">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="material-symbols-outlined filled">
          star
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 bg-surface-container-lowest rounded-2xl editorial-shadow relative"
            >
              <Stars />
              <p className="text-on-surface italic mb-8">{t.text}</p>
              <div className="flex items-center gap-4">
                <img
                  alt="Paciente"
                  className="w-12 h-12 rounded-full object-cover"
                  src={t.avatar}
                />
                <div>
                  <span className="block font-headline font-bold text-sm">
                    {t.name}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
