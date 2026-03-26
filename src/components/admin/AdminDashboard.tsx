import { useState } from 'react';

interface Booking {
  id: number;
  created: string;
  appointment: string;
  name: string;
  phone: string;
  service: string;
  doctor: string;
  status: string;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      setIsLoggedIn(true);
      fetchBookings(password);
    }
  };

  const fetchBookings = async (pass: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin-bookings', {
        headers: {
          'Authorization': `Bearer ${pass}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings);
      } else {
        setError(data.error || 'Error al cargar los datos');
        setIsLoggedIn(false);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-neutral-800 rounded-3xl p-8 shadow-2xl space-y-8 border border-white/5">
          <div className="text-center">
             <div className="w-16 h-16 bg-amber-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white text-3xl">lock</span>
             </div>
            <h2 className="font-display text-2xl font-bold text-white">Panel de Control</h2>
            <p className="text-sm text-neutral-400">San Diego IPS · Administración</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña Maestra"
              className="w-full bg-neutral-900 border-b-2 border-white/10 focus:border-amber-600 rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-4 rounded-xl font-headline font-bold text-base shadow-lg hover:bg-amber-700 transition-all active:scale-[0.98]"
            >
              Entrar al CRM
            </button>
          </form>
          <p className="text-center text-[10px] text-neutral-500 uppercase tracking-widest">Acceso Restringido</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Panel de Pacientes</h1>
            <p className="text-neutral-400">Gestiona tus citas de Google Sheets en tiempo real</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all flex items-center gap-2 border border-white/10"
          >
             <span className="material-symbols-outlined text-sm">refresh</span>
             Actualizar Lista
          </button>
        </div>

        <div className="bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-xs font-headline font-bold text-neutral-400 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">F. Cita</th>
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Servicio / Doctor</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                       <span className="animate-spin inline-block mr-2 text-amber-600">⏳</span> Cargando pacientes...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 italic">No hay citas registradas aún.</td>
                  </tr>
                ) : bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="font-bold text-amber-500">{b.appointment.split(' ')[0]}</div>
                      <div className="text-xs text-neutral-400">{b.appointment.split(' ')[1]}</div>
                    </td>
                    <td className="px-6 py-4 font-display text-base font-medium">{b.name}</td>
                    <td className="px-6 py-4">
                      <a 
                        href={`https://wa.me/${b.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-amber-600 hover:text-amber-500 hover:underline flex items-center gap-1"
                      >
                         <span className="material-symbols-outlined text-base">chat</span>
                         {b.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-neutral-300 uppercase">{b.service}</div>
                      <div className="text-xs text-neutral-500 italic">{b.doctor}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                         b.status === 'Nueva' ? 'bg-amber-600/20 text-amber-500' : 'bg-green-500/20 text-green-500'
                       }`}>
                         {b.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <button className="text-neutral-500 hover:text-white transition-colors">
                          <span className="material-symbols-outlined">edit</span>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-center">
           <p className="text-xs text-neutral-600 uppercase tracking-widest">Base de Datos: Google Sheets Conectado</p>
        </div>
      </div>
    </div>
  );
}
