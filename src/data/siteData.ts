export const navLinks = [
  { label: 'Servicios', href: '#servicios', active: true },
  { label: 'Especialistas', href: '#especialistas', active: false },
  { label: 'Sedes', href: '#sedes', active: false },
  { label: 'Blog', href: '#blog', active: false },
];

export const stats = [
  { value: '20+', label: 'Años de experiencia' },
  { value: '15k+', label: 'Pacientes atendidos' },
  { value: '100%', label: 'Casos clínicos exitosos' },
];

export interface Service {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const services: Service[] = [
  {
    title: 'Diseño de sonrisa',
    description:
      'Perfeccionamos la armonía de tus dientes integrando estética y funcionalidad personalizada.',
    image:
      'https://as1.ftcdn.net/v2/jpg/02/30/67/74/1000_F_230677493_vtaLxyzaqopkAHruJZdgcuAbkJ35Gss1.jpg',
    imageAlt: 'Diseño de sonrisa',
  },
  {
    title: 'Endodoncia',
    description:
      'Tratamientos de conducto indoloros con tecnología rotatoria para salvar tus piezas naturales.',
    image:
      'https://as2.ftcdn.net/v2/jpg/18/27/36/55/1000_F_1827365516_iOp9rZBiSP8BcIEYMMprXKnVGrkfFD3F.jpg',
    imageAlt: 'Endodoncia',
  },
  {
    title: 'Periodoncia',
    description:
      'Cuidado integral de encías y tejidos de soporte para una base bucal saludable y firme.',
    image:
      'https://as2.ftcdn.net/v2/jpg/03/16/55/83/1000_F_316558318_UfmMElb061rcdPSUJSkEqMcH6uQad63y.jpg',
    imageAlt: 'Periodoncia',
  },
  {
    title: 'Cirugía oral',
    description:
      'Procedimientos quirúrgicos especializados con recuperación acelerada y mínima invasión.',
    image:
      'https://as1.ftcdn.net/v2/jpg/02/96/76/58/1000_F_296765862_5OWYuaf5LVMigppvqwQ1thQtCKo6qMQm.jpg',
    imageAlt: 'Cirugía oral',
  },
  {
    title: 'Consulta preventiva',
    description:
      'Mantenimiento preventivo periódico para detectar a tiempo cualquier afección dental.',
    image:
      'https://as2.ftcdn.net/v2/jpg/02/23/18/11/1000_F_223181186_Nybf9ZKPOZs1AcvMTQ81FTJusYrB7fFK.jpg',
    imageAlt: 'Consulta preventiva',
  },
];

export const resultImages = [
  'https://as2.ftcdn.net/v2/jpg/02/23/18/11/1000_F_223181186_Nybf9ZKPOZs1AcvMTQ81FTJusYrB7fFK.jpg',
  'https://as2.ftcdn.net/v2/jpg/02/40/98/21/1000_F_240982187_auR9cM9G0gGmXvh1RZJoBufjTKVIclC3.jpg',
  'https://as1.ftcdn.net/v2/jpg/02/55/76/94/1000_F_255769483_xXZ1VCR7c77wfenVXil2Acj12DyITH0G.jpg',
  'https://as1.ftcdn.net/v2/jpg/18/27/36/26/1000_F_1827362697_3MfbkEUJlog18xOz0XdelRGOdFZnjSbs.jpg',
];

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    text: '"La atención fue impecable desde el primer momento. Mi diseño de sonrisa cambió por completo mi confianza al hablar."',
    name: 'Carolina Méndez',
    role: 'Paciente de Estética',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6KZG4IfaCaGceWygO7sPODFLSIPPrebLqCp7X0o1BWdVvQyuk1h6Wq0ktVizCsEj6iPMChU5T6xFm-gnnOo_6w-rwX2RZOaFAvaUqnePVouDoN1WYk47rHjl2Edb5oFDC3ZsJLmK_vGAKFKZEtHhF5PEcImm6Hu2BnC6o15LOrCeLiKusQYiHQgimQKpPEJTukLvsOMOTe4R20l2fkVcPmoqBMCOScaWervqlvOxilUnWH5tYPL4zhJ3P62SkC0pKOWrVwnSeFws',
  },
  {
    text: '"Expertos reales. Me realizaron una cirugía oral sin nada de dolor y el seguimiento postoperatorio fue excelente."',
    name: 'Andrés Rivera',
    role: 'Paciente de Cirugía',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTKFRccDo28HZsm66Z_fY3FAcmPAVLQmaXVA-1qe9RvXYAss4RDGpiyzXr1CoMPEUTjb_HEcqtYq-1JRDyyQ7QoD0tszknzyvjFSmpPZSQtbZ3IpLrg5e96T84gjSxzhsuvNuZkAorvJOvASg5ZC5h2Tk6E6X74C-qbwMdagOvv9MaLg651PApOhAGvuA_xnIYEYAvAgxITWL1eFkb9HjRy-2DxOygdbroeNlnmlSGH0I5mOtjNr53RochUmMpXCxuj2SXOuDa4t4',
  },
  {
    text: '"Las instalaciones son modernas y el trato humano es lo que más destaco. ¡Totalmente recomendados!"',
    name: 'Elena Gómez',
    role: 'Paciente Preventiva',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC74OgEg1FQ7Qyn-6TpN7x4UsC9Fv7hWSN1NK-sOMvZwmI7VBmHW7cJaoAmow5I5uv6Q_A1Kz5gCujuLTwcECaGsBPUv-7wvdxXd5QlPkUm9Hg17rjkh5LAh8fm_LXMtYftPTPraJwjmsujCQ-MWId4CmDDDn49elH_pOMe77BNFRKSXS6CMJv9VmpJo85XHApLdBDXCyBVojmznuZWwyx3eUDK_cXgii5lHQRcboDeoxBW7rQqYiWq9BozA-xb6INyOGOtxg0MqhQ',
  },
];

export const locationInfo = {
  address: 'Calle 100 #15-32, Edificio Profesional, Bogotá DC',
  schedule: 'Lun - Vie: 8:00 AM - 7:00 PM\nSábados: 9:00 AM - 2:00 PM',
  mapImage:
    'https://as1.ftcdn.net/v2/jpg/08/06/60/98/1000_F_806609835_4NcPC8w0qRG0nQgfOc1cIwdgENLN2EP7.jpg',
  interiorImage:
    'https://as2.ftcdn.net/v2/jpg/06/37/42/51/1000_F_637425114_3lLwo1G8kLG53rYY3Mb9jRmmnBF2v7UY.jpg',
};

export const contactInfo = {
  email: 'info@sandiegoips.com',
  phone: '+57 601 234 5678',
  whatsappUrl: 'https://wa.me/yourphonenumber',
};
