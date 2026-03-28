export interface ServiceOption {
  id: string;
  name: string;
  duration: number; // minutes
  icon: string;
  description: string;
}

export interface DoctorOption {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export const bookingServices: ServiceOption[] = [
  {
    id: 'smile-design',
    name: 'Diseño de sonrisa',
    duration: 60,
    icon: 'auto_awesome',
    description: 'Evaluación estética completa y plan personalizado',
  },
  {
    id: 'endodontics',
    name: 'Endodoncia',
    duration: 90,
    icon: 'healing',
    description: 'Tratamiento de conducto con tecnología rotatoria',
  },
  {
    id: 'periodontics',
    name: 'Periodoncia',
    duration: 60,
    icon: 'health_and_safety',
    description: 'Cuidado integral de encías y tejidos',
  },
  {
    id: 'oral-surgery',
    name: 'Cirugía oral',
    duration: 90,
    icon: 'surgical',
    description: 'Procedimientos quirúrgicos especializados',
  },
  {
    id: 'preventive',
    name: 'Consulta preventiva',
    duration: 30,
    icon: 'stethoscope',
    description: 'Revisión general y limpieza dental',
  },
  {
    id: 'general',
    name: 'Valoración general',
    duration: 30,
    icon: 'assignment',
    description: 'Primera consulta y diagnóstico profesional',
  },
];

export const bookingDoctors: DoctorOption[] = [
  {
    id: 'dr-gustavo',
    name: 'Dr. Gustavo Sánchez',
    specialty: 'Rehabilitación Oral',
    avatar: '/doctor-gustavo.png',
  },
  {
    id: 'dra-martinez',
    name: 'Dra. Laura Martínez',
    specialty: 'Endodoncia',
    avatar: '',
  },
  {
    id: 'dr-ramirez',
    name: 'Dr. Carlos Ramírez',
    specialty: 'Periodoncia y Cirugía',
    avatar: '',
  },
];

// Availability data and types for booking system

export async function getAvailableSlots(
  date: Date,
  serviceId: string
): Promise<TimeSlot[]> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fetch(`/api/availability?date=${dateStr}&serviceId=${serviceId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener disponibilidad');
    }

    const data = await response.json();
    return data.slots || [];
  } catch (error) {
    console.error('Error fetching availability:', error);
    // Fallback simple por si la API falla
    return [];
  }
}

export function isDayAvailable(date: Date): boolean {
  const day = date.getDay();
  if (day === 0) return false; // Sunday
  // Past dates not available
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return false;
  return true;
}

export async function confirmBooking(data: {
  service: string;
  doctor: string;
  date: string;
  time: string;
  name: string;
  phone: string;
}) {
  try {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to book');
    
    return { success: true, message: result.message };
  } catch (error: any) {
    console.error('Booking confirmation failed:', error);
    return { success: false, error: error.message };
  }
}
