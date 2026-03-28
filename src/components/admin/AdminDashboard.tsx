import { useState } from 'react';
import { useContent } from '../ContentContext';
import AdminAnalytics from './AdminAnalytics';

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
  const [activeTab, setActiveTab] = useState<'bookings' | 'analytics' | 'content'>('bookings');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  const { setIsEditorActive } = useContent();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      setIsLoggedIn(true);
      localStorage.setItem('adminToken', password);
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

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch('/api/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (response.ok) {
        // Actualizar UI localmente
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      } else {
        const data = await response.json();
        alert(`Error al guardar: ${data.error}`);
      }
    } catch (err) {
      alert('Error de red al actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nueva': return 'bg-amber-600/20 text-amber-500 border-amber-600/30';
      case 'Confirmada': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Completada': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Cancelada': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
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
            <h1 className="font-display text-3xl font-bold text-white">Administración</h1>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`text-sm pb-1 border-b-2 transition-all ${activeTab === 'bookings' ? 'border-amber-600 text-white' : 'border-transparent text-neutral-500'}`}
              >
                Pacientes
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`text-sm pb-1 border-b-2 transition-all ${activeTab === 'analytics' ? 'border-amber-600 text-white' : 'border-transparent text-neutral-500'}`}
              >
                Analíticas
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`text-sm pb-1 border-b-2 transition-all ${activeTab === 'content' ? 'border-amber-600 text-white' : 'border-transparent text-neutral-500'}`}
              >
                Contenido Web
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'bookings' && (
              <button 
                onClick={() => fetchBookings(password)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all flex items-center gap-2 border border-white/10 text-white"
              >
                 <span className="material-symbols-outlined text-sm">refresh</span>
                 Actualizar Lista
              </button>
            )}
            <button 
              onClick={() => {
                setIsEditorActive(true);
                window.location.href = '/';
              }}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20"
            >
               <span className="material-symbols-outlined text-sm">edit_document</span>
               Abrir Editor Visual
            </button>
          </div>
        </div>

        {activeTab === 'bookings' && (
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
                      <td className="px-6 py-4" colSpan={2}>
                         <div className="flex items-center gap-3">
                           {updatingId === b.id ? (
                             <span className="text-xs text-neutral-400 flex items-center gap-2">
                               <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span> 
                               Guardando
                             </span>
                           ) : (
                             <select
                               value={b.status}
                               onChange={(e) => handleStatusChange(b.id, e.target.value)}
                               className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-tighter cursor-pointer outline-none border transition-colors appearance-none text-center ${getStatusColor(b.status)}`}
                               style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                             >
                               <option value="Nueva" className="bg-neutral-900 text-amber-500">Nueva</option>
                               <option value="Confirmada" className="bg-neutral-900 text-blue-400">Confirmada</option>
                               <option value="Completada" className="bg-neutral-900 text-green-500">Completada</option>
                               <option value="Cancelada" className="bg-neutral-900 text-red-500">Cancelada</option>
                             </select>
                           )}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AdminAnalytics bookings={bookings} />
        )}

        {activeTab === 'content' && (
          <div className="bg-neutral-900 border border-white/5 p-12 rounded-3xl text-center space-y-6 w-full mx-auto max-w-2xl mt-12">
            <div className="w-20 h-20 bg-amber-600/20 rounded-full mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500 text-4xl">view_quilt</span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Editor Visual Activado</h2>
              <p className="text-neutral-400">
                Ahora puedes editar todos los textos e imágenes de la página web directamente sobre el diseño final. 
                Es mucho más intuitivo y visual que editar formularios aquí.
              </p>
            </div>
            <button 
              onClick={() => {
                setIsEditorActive(true);
                window.location.href = '/';
              }}
              className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg hover:-translate-y-1"
            >
              <span className="material-symbols-outlined">launch</span>
              Abrir Editor Visual
            </button>
          </div>
        )}
        
        <div className="text-center">
           <p className="text-xs text-neutral-600 uppercase tracking-widest">Base de Datos: Google Sheets Conectado</p>
        </div>
      </div>
    </div>
  );
}
