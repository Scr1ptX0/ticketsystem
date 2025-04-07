// Базовий URL для API
const API_URL = 'https://api.ukrtrans.ua'; // В майбутньому замінити на реальний URL

// Типи даних для API
export interface Route {
  id: number;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  price: number;
  available: number;
  duration: string;
  carrier: string;
  busType: string;
}

export interface Booking {
  id: number;
  routeId: number;
  userId: number;
  seats: number[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  paymentMethod: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

// Функція для обробки запитів
const fetchAPI = async (endpoint: string, options = {}) => {
  // Тут в майбутньому буде код для взаємодії з реальним API
  // Наразі повертаємо mock дані для імітації роботи API
  
  // Імітація затримки запиту до сервера
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Розбір endpoint для визначення, які дані повернути
  if (endpoint.includes('/routes')) {
    if (endpoint.includes('/search')) {
      return mockSearchRoutes();
    }
    return mockRoutes;
  }
  
  if (endpoint.includes('/bookings')) {
    const id = endpoint.split('/').pop();
    if (id && !isNaN(Number(id))) {
      return mockBookings.find(booking => booking.id === Number(id));
    }
    return mockBookings;
  }
  
  if (endpoint.includes('/users')) {
    return mockUsers;
  }
  
  return { error: 'Endpoint not found' };
};

// Об'єкт з методами API
export const api = {
  // Маршрути
  getRoutes: () => fetchAPI('/routes'),
  getRouteById: (id: number) => fetchAPI(`/routes/${id}`),
  searchRoutes: (from: string, to: string, date: string) => 
    fetchAPI(`/routes/search?from=${from}&to=${to}&date=${date}`),
  
  // Бронювання
  getBookings: (userId: number) => fetchAPI(`/bookings?userId=${userId}`),
  getBookingById: (id: number) => fetchAPI(`/bookings/${id}`),
  createBooking: (bookingData: Partial<Booking>) => 
    fetchAPI('/bookings', { 
      method: 'POST', 
      body: JSON.stringify(bookingData) 
    }),
  
  // Користувачі
  getUserById: (id: number) => fetchAPI(`/users/${id}`),
  updateUser: (id: number, userData: Partial<User>) => 
    fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
  login: (email: string, password: string) => 
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  register: (userData: Partial<User>) => 
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  // Додаткові методи для адміністративної панелі
  getAnalytics: () => fetchAPI('/admin/analytics'),
  getPendingBookings: () => fetchAPI('/admin/bookings/pending'),
};

// Функції для генерації тестових даних
function mockSearchRoutes() {
  // Імітуємо результати пошуку маршрутів
  return [
    {
      id: 1,
      from: 'Київ',
      to: 'Львів',
      departureTime: '08:00',
      arrivalTime: '14:30',
      date: '2023-09-15',
      price: 450,
      available: 35,
      duration: '6г 30хв',
      carrier: 'УкрТранс',
      busType: 'Комфорт'
    },
    {
      id: 2,
      from: 'Київ',
      to: 'Львів',
      departureTime: '10:30',
      arrivalTime: '17:00',
      date: '2023-09-15',
      price: 400,
      available: 12,
      duration: '6г 30хв',
      carrier: 'УкрТранс',
      busType: 'Стандарт'
    },
    {
      id: 3,
      from: 'Київ',
      to: 'Львів',
      departureTime: '16:45',
      arrivalTime: '23:15',
      date: '2023-09-15',
      price: 380,
      available: 28,
      duration: '6г 30хв',
      carrier: 'УкрТранс',
      busType: 'Стандарт'
    }
  ];
}

// Мокові дані для тестування
const mockRoutes: Route[] = [
  {
    id: 1,
    from: 'Київ',
    to: 'Львів',
    departureTime: '08:00',
    arrivalTime: '14:30',
    date: '2023-09-15',
    price: 450,
    available: 35,
    duration: '6г 30хв',
    carrier: 'УкрТранс',
    busType: 'Комфорт'
  },
  {
    id: 2,
    from: 'Київ',
    to: 'Одеса',
    departureTime: '09:30',
    arrivalTime: '17:00',
    date: '2023-09-15',
    price: 500,
    available: 28,
    duration: '7г 30хв',
    carrier: 'УкрТранс',
    busType: 'Комфорт'
  }
];

const mockBookings: Booking[] = [
  {
    id: 1,
    routeId: 1,
    userId: 1,
    seats: [12, 13],
    totalPrice: 900,
    status: 'confirmed',
    bookingDate: '2023-09-01',
    paymentMethod: 'card'
  },
  {
    id: 2,
    routeId: 2,
    userId: 1,
    seats: [5],
    totalPrice: 500,
    status: 'pending',
    bookingDate: '2023-09-05',
    paymentMethod: 'googlePay'
  }
];

const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Олександр',
    lastName: 'Петренко',
    email: 'oleksandr@example.com',
    phone: '+380991234567',
    role: 'user'
  },
  {
    id: 2,
    firstName: 'Адміністратор',
    lastName: 'Системи',
    email: 'admin@ukrtrans.ua',
    phone: '+380501234567',
    role: 'admin'
  }
];