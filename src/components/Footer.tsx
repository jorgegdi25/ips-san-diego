import { contactInfo } from '../data/siteData';

export default function Footer() {
  return (
    <footer className="bg-gray-100 w-full py-16 px-8 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        <div className="col-span-1">
          <img src="/logo.jpeg" alt="San Diego IPS" className="h-10 w-auto mb-6" />
          <p className="font-body text-sm leading-relaxed text-gray-500">
            Excelencia clínica y calidad humana en cada tratamiento
            odontológico.
          </p>
        </div>

        <div className="col-span-1">
          <h4 className="font-headline font-bold text-gray-700 mb-6">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-4">
            {['Tratamientos', 'Preguntas Frecuentes', 'Privacidad', 'Contacto'].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-headline font-bold text-gray-700 mb-6">
            Especialidades
          </h4>
          <ul className="space-y-4">
            {['Ortodoncia Invisible', 'Implantes Dentales', 'Blanqueamiento Láser'].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-body text-sm text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-headline font-bold text-gray-700 mb-6">
            Contáctanos
          </h4>
          <div className="space-y-4">
            <p className="font-body text-sm text-gray-500">
              {contactInfo.email}
            </p>
            <p className="font-body text-sm text-gray-500">
              {contactInfo.phone}
            </p>
            <div className="flex gap-4 mt-6">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-sm text-orange-500">
                  share
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-sm text-orange-500">
                  favorite
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-16 border-t border-gray-200 text-center">
        <p className="font-body text-xs text-gray-500">
          © 2024 San Diego IPS Odontología. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
