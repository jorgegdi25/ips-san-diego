import { resultImages } from '../data/siteData';

export default function ResultsSection() {
  return (
    <section className="py-24 bg-surface-container-high/30">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="font-display text-4xl font-bold text-on-surface text-center mb-16">
          Resultados reales en pacientes reales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resultImages.map((src, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden editorial-shadow group h-64"
            >
              <img
                alt="Resultado clínico"
                className="w-full h-full object-cover"
                src={src}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-headline font-bold px-4 py-2 border border-white rounded-full text-sm">
                  Ver Caso Clínico
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
