import { stats } from '../data/siteData';

export default function AuthoritySection() {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-1">
            <h2 className="font-display text-4xl font-bold text-secondary leading-tight mb-6">
              Experiencia que marca la diferencia
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Combinamos décadas de práctica clínica con tecnología de
              vanguardia para garantizar resultados predecibles y una
              experiencia libre de dolor.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-8 bg-surface-container-lowest rounded-2xl editorial-shadow text-center"
              >
                <span className="block text-4xl font-extrabold text-primary-container mb-2">
                  {stat.value}
                </span>
                <span className="font-headline font-bold text-secondary uppercase tracking-widest text-xs">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
