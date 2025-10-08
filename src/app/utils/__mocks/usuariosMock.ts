import { Usuario } from '../../shared/interfaces/usuarios';

export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    name: 'Jack Mota',
    username: 'jack.mota',
    email: 'jack@email.com',
    address: {
      street: 'Rua teste',
      suite: 'Apt 109',
      city: 'Goiânia',
      zipcode: '01000-000',
      geo: { lat: -23.5505, lng: -46.6333 },
    },
    phone: '62999999999',
    website: 'jack.com',
    company: {
      name: 'Empresa A',
      catchPhrase: 'Slogan A',
      bs: 'Business A',
    },
  },
  {
    id: 2,
    name: 'Matheus Porto',
    username: 'matheus.porto',
    email: 'matheus.porto@email.com',
    address: {
      street: 'Catetinho',
      suite: 'Chácara 30',
      city: 'Riacho Fundo',
      zipcode: '20000-000',
      geo: { lat: -22.9068, lng: -43.1729 },
    },
    phone: '61999999999',
    website: 'matheus.com',
    company: {
      name: 'Empresa B',
      catchPhrase: 'Slogan B',
      bs: 'Business B',
    },
  },
  {
    id: 3,
    name: 'Maria Eduarda',
    username: 'maria.eduarda',
    email: 'maria.eduarda@test.com',
    address: {
      street: 'Quadra 300',
      suite: 'Apt 123',
      city: 'Brasília',
      zipcode: '72600-567',
      geo: {
        lat: -15.7942,
        lng: -47.8822,
      },
    },
    phone: '61999999999',
    website: 'www.maria.eduarda.dev',
    company: {
      name: 'Tech Corp',
      catchPhrase: 'Innovation first',
      bs: 'technology solutions',
    },
  },
];
