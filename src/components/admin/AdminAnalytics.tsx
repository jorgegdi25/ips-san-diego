import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

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

const COLORS = ['#d97706', '#ea580c', '#eab308', '#ca8a04', '#854d0e', '#f59e0b']; // Tonos ámbar y cálidos

export default function AdminAnalytics({ bookings }: { bookings: Booking[] }) {

  // 1. Procesar KPIs Rápidos
  const totalCitas = bookings.length;

  const topService = useMemo(() => {
    if (totalCitas === 0) return 'N/A';
    const counts: Record<string, number> = {};
    let maxService = '';
    let maxCount = 0;
    
    bookings.forEach(b => {
      counts[b.service] = (counts[b.service] || 0) + 1;
      if (counts[b.service] > maxCount) {
        maxCount = counts[b.service];
        maxService = b.service;
      }
    });
    return maxService;
  }, [bookings]);

  // 2. Procesar Datos para Gráfico Circular (Citas por Servicio)
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      counts[b.service] = (counts[b.service] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Ordenar de mayor a menor
  }, [bookings]);

  // 3. Procesar Datos para Gráfico de Barras (Citas en los últimos 7 días con citas agendadas)
  const barData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    bookings.forEach(b => {
      // Tomamos solo la parte de la fecha YYYY-MM-DD
      const dateOnly = b.appointment.split(' ')[0];
      counts[dateOnly] = (counts[dateOnly] || 0) + 1;
    });

    // Convertir a array y ordenar cronológicamente
    let data = Object.entries(counts)
      .map(([date, count]) => {
         // Formatear para mostrar solo "Día Mes" (Ej: "28 Mar")
         const [year, month, day] = date.split('-');
         const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
         const shortDate = dateObj.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
         
         return {
            dateStr: date, // para ordenar
            Fecha: shortDate,
            Citas: count
         };
      })
      .sort((a, b) => a.dateStr.localeCompare(b.dateStr))
      .slice(-7); // Mostrar los últimos 7 días con actividad
      
    return data;
  }, [bookings]);

  if (totalCitas === 0) {
    return (
      <div className="bg-neutral-900 border border-white/5 p-12 rounded-3xl text-center text-neutral-500">
        No hay suficientes datos para generar estadísticas.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400 font-headline uppercase tracking-widest">Total Citas</p>
            <p className="font-display text-4xl font-bold text-white mt-1">{totalCitas}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400 font-headline uppercase tracking-widest">Servicio Más Popular</p>
            <p className="font-display text-xl leading-tight font-bold text-white mt-1 capitalize">{topService}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">star_rate</span>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400 font-headline uppercase tracking-widest">Conversión Estimada</p>
            <p className="font-display text-4xl font-bold text-white mt-1">Alta</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">trending_up</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Barras - Citas por Día */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white font-headline mb-6">Actividad de Reservas (Últimos días)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="Fecha" 
                  stroke="#737373" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#737373" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="Citas" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Pastel - Citas por Servicio */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white font-headline mb-6">Distribución por Servicio</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a3a3a3' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
