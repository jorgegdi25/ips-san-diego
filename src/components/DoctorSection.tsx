export default function DoctorSection() {
  const credentials = [
    'Odontólogo – Universidad Javeriana (1998)',
    'Especialista en Rehabilitación Oral – Universidad El Bosque',
    'Diplomado en Implantología Avanzada – NYU College of Dentistry',
    'Miembro de la Federación Odontológica Colombiana',
  ];

  const highlights = [
    { icon: 'school', label: '+25 años de experiencia clínica' },
    { icon: 'workspace_premium', label: 'Certificación internacional' },
    { icon: 'groups', label: '+18.000 pacientes atendidos' },
    { icon: 'favorite', label: 'Enfoque humano y personalizado' },
  ];

  return (
    <section id="especialistas" className="py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-primary-container mb-4 block">
            Conoce a tu especialista
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-on-surface">
            Dr. Gustavo Sánchez
          </h2>
          <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto text-lg">
            Director Clínico &amp; Especialista en Rehabilitación Oral
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Photo */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden editorial-shadow">
                <img
                  src="/doctor-gustavo.png"
                  alt="Dr. Gustavo Sánchez"
                  className="w-full h-[550px] object-cover object-top"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-4 -right-4 bg-white p-5 rounded-2xl editorial-shadow hidden md:flex items-center gap-3 border border-outline-variant/10">
                <span className="material-symbols-outlined filled text-primary-container text-3xl">
                  verified
                </span>
                <div>
                  <span className="font-headline font-bold text-sm block">Certificado</span>
                  <span className="text-xs text-on-surface-variant">Federación Odontológica</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-7 space-y-8">
            <blockquote className="text-xl md:text-2xl font-display italic text-on-surface-variant leading-relaxed border-l-4 border-primary-container pl-6">
              "Mi compromiso es transformar la experiencia odontológica en un momento de confianza y bienestar para cada paciente."
            </blockquote>

            <p className="text-on-surface-variant leading-relaxed">
              Con más de 25 años dedicados a la odontología de precisión, el Dr.
              Gustavo Sánchez lidera San Diego IPS con una filosofía centrada en
              el paciente. Su formación internacional y su pasión por la
              tecnología de vanguardia le permiten ofrecer tratamientos con los
              más altos estándares clínicos, combinando ciencia y arte en cada
              procedimiento.
            </p>

            {/* Credentials */}
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-secondary mb-4">
                Formación Académica
              </h3>
              <ul className="space-y-3">
                {credentials.map((cred) => (
                  <li key={cred} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container text-lg mt-0.5">
                      check_circle
                    </span>
                    <span className="text-sm text-on-surface-variant">{cred}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl editorial-shadow"
                >
                  <span className="material-symbols-outlined text-primary-container">
                    {h.icon}
                  </span>
                  <span className="font-headline font-semibold text-xs text-on-surface">
                    {h.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
