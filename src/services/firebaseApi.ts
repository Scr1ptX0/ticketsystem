import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp, 
  orderBy,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '@/contexts/AuthContext';

// Інтерфейси для роботи з даними
export interface Route {
  id?: string;
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
  createdAt?: Timestamp;
}

export interface Booking {
  id?: string;
  routeId: string;
  userId: string;
  route?: Route;
  seats: number[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  paymentMethod: string;
  passengerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt?: Timestamp;
}

// Функції для роботи з маршрутами
export const routesApi = {
  // Отримати всі маршрути
  getRoutes: async (): Promise<Route[]> => {
    try {
      const routesCol = collection(db, 'routes');
      const q = query(routesCol, orderBy('createdAt', 'desc'));
      const routeSnapshot = await getDocs(q);
      return routeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Route));
    } catch (error: any) {
      console.error('Error fetching routes:', error);
      throw new Error(error.message);
    }
  },

  // Отримати маршрут за ID
  getRouteById: async (id: string): Promise<Route | null> => {
    try {
      const routeRef = doc(db, 'routes', id);
      const routeSnapshot = await getDoc(routeRef);
      
      if (routeSnapshot.exists()) {
        return {
          id: routeSnapshot.id,
          ...routeSnapshot.data()
        } as Route;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error fetching route:', error);
      throw new Error(error.message);
    }
  },

  // Пошук маршрутів за параметрами
  searchRoutes: async (from: string, to: string, date: string): Promise<Route[]> => {
    try {
      const routesCol = collection(db, 'routes');
      const q = query(
        routesCol, 
        where('from', '==', from),
        where('to', '==', to),
        where('date', '==', date)
      );
      
      const routeSnapshot = await getDocs(q);
      return routeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Route));
    } catch (error: any) {
      console.error('Error searching routes:', error);
      throw new Error(error.message);
    }
  },

  // Отримати список усіх міст (для випадаючих списків)
  getCities: async (): Promise<string[]> => {
    try {
      const routesCol = collection(db, 'routes');
      const routeSnapshot = await getDocs(routesCol);
      
      const cities = new Set<string>();
      routeSnapshot.docs.forEach(doc => {
        const data = doc.data();
        cities.add(data.from);
        cities.add(data.to);
      });
      
      return Array.from(cities).sort();
    } catch (error: any) {
      console.error('Error fetching cities:', error);
      throw new Error(error.message);
    }
  },

  // Додати новий маршрут (для адміністраторів)
  addRoute: async (routeData: Omit<Route, 'id'>): Promise<string> => {
    try {
      const routesCol = collection(db, 'routes');
      const docRef = await addDoc(routesCol, {
        ...routeData,
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding route:', error);
      throw new Error(error.message);
    }
  },
  
  // Оновити існуючий маршрут (для адміністраторів)
  updateRoute: async (id: string, routeData: Omit<Route, 'id'>): Promise<void> => {
    try {
      const routeRef = doc(db, 'routes', id);
      await updateDoc(routeRef, routeData);
    } catch (error: any) {
      console.error('Error updating route:', error);
      throw new Error(error.message);
    }
  },
  
  // Видалити маршрут (для адміністраторів)
  deleteRoute: async (id: string): Promise<void> => {
    try {
      const routeRef = doc(db, 'routes', id);
      await deleteDoc(routeRef);
    } catch (error: any) {
      console.error('Error deleting route:', error);
      throw new Error(error.message);
    }
  }
};

// Функції для роботи з бронюваннями
export const bookingsApi = {
  // Отримати всі бронювання користувача
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(
        bookingsCol,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const bookingSnapshot = await getDocs(q);
      const bookings = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking));
      
      // Отримуємо дані маршрутів для кожного бронювання
      const bookingsWithRoutes = await Promise.all(
        bookings.map(async (booking) => {
          if (booking.routeId) {
            const route = await routesApi.getRouteById(booking.routeId);
            return {
              ...booking,
              route
            };
          }
          return booking;
        })
      );
      
      return bookingsWithRoutes;
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
      throw new Error(error.message);
    }
  },
  
  // Отримати всі бронювання (для адміністраторів)
  getAllBookings: async (): Promise<Booking[]> => {
    try {
      const bookingsCol = collection(db, 'bookings');
      const q = query(
        bookingsCol,
        orderBy('createdAt', 'desc')
      );
      
      const bookingSnapshot = await getDocs(q);
      const bookings = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking));
      
      // Отримуємо дані маршрутів для кожного бронювання
      const bookingsWithRoutes = await Promise.all(
        bookings.map(async (booking) => {
          if (booking.routeId) {
            const route = await routesApi.getRouteById(booking.routeId);
            return {
              ...booking,
              route
            };
          }
          return booking;
        })
      );
      
      return bookingsWithRoutes;
    } catch (error: any) {
      console.error('Error fetching all bookings:', error);
      throw new Error(error.message);
    }
  },

  // Отримати бронювання за ID
  getBookingById: async (id: string): Promise<Booking | null> => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      const bookingSnapshot = await getDoc(bookingRef);
      
      if (bookingSnapshot.exists()) {
        const booking = {
          id: bookingSnapshot.id,
          ...bookingSnapshot.data()
        } as Booking;
        
        // Отримуємо дані маршруту
        if (booking.routeId) {
          const route = await routesApi.getRouteById(booking.routeId);
          return {
            ...booking,
            route
          };
        }
        
        return booking;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      throw new Error(error.message);
    }
  },

  // Створити нове бронювання
  createBooking: async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'bookingDate'>): Promise<string> => {
    try {
      // Перевіряємо наявність маршруту
      const route = await routesApi.getRouteById(bookingData.routeId);
      if (!route) {
        throw new Error('Маршрут не знайдено');
      }
      
      // Перевіряємо наявність місць
      if (route.available < bookingData.seats.length) {
        throw new Error('Недостатньо доступних місць');
      }
      
      // Створюємо бронювання
      const bookingsCol = collection(db, 'bookings');
      const bookingDate = new Date().toISOString();
      
      const docRef = await addDoc(bookingsCol, {
        ...bookingData,
        bookingDate,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Оновлюємо кількість доступних місць у маршруті
      const routeRef = doc(db, 'routes', bookingData.routeId);
      await updateDoc(routeRef, {
        available: route.available - bookingData.seats.length
      });
      
      return docRef.id;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      throw new Error(error.message);
    }
  },

  // Оновити статус бронювання
  updateBookingStatus: async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<void> => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnapshot = await getDoc(bookingRef);
      
      if (!bookingSnapshot.exists()) {
        throw new Error('Бронювання не знайдено');
      }
      
      const booking = {
        id: bookingSnapshot.id,
        ...bookingSnapshot.data()
      } as Booking;
      
      // Якщо статус змінюється на "скасовано", повертаємо місця
      if (status === 'cancelled' && booking.status !== 'cancelled') {
        const route = await routesApi.getRouteById(booking.routeId);
        if (route) {
          const routeRef = doc(db, 'routes', booking.routeId);
          await updateDoc(routeRef, {
            available: route.available + booking.seats.length
          });
        }
      }
      
      // Оновлюємо статус бронювання
      await updateDoc(bookingRef, { status });
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      throw new Error(error.message);
    }
  },

  // Скасувати бронювання
  cancelBooking: async (bookingId: string): Promise<void> => {
    try {
      await bookingsApi.updateBookingStatus(bookingId, 'cancelled');
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      throw new Error(error.message);
    }
  }
};

// Статистичні функції для адмін-панелі
export const analyticsApi = {
  // Отримати загальну статистику
  getOverviewStats: async (): Promise<{
    totalRoutes: number;
    totalBookings: number;
    totalRevenue: number;
    activeBookings: number;
  }> => {
    try {
      // Кількість маршрутів
      const routesCol = collection(db, 'routes');
      const routeSnapshot = await getDocs(routesCol);
      const totalRoutes = routeSnapshot.docs.length;
      
      // Кількість бронювань і дохід
      const bookingsCol = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCol);
      const totalBookings = bookingSnapshot.docs.length;
      
      let totalRevenue = 0;
      let activeBookings = 0;
      
      bookingSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'cancelled') {
          totalRevenue += data.totalPrice || 0;
        }
        if (data.status === 'confirmed' || data.status === 'pending') {
          activeBookings++;
        }
      });
      
      return {
        totalRoutes,
        totalBookings,
        totalRevenue,
        activeBookings
      };
    } catch (error: any) {
      console.error('Error fetching overview stats:', error);
      throw new Error(error.message);
    }
  },
  
  // Отримати статистику за статусами бронювань
  getBookingStatusStats: async (): Promise<{
    [key: string]: number;
  }> => {
    try {
      const bookingsCol = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCol);
      
      const stats: {[key: string]: number} = {
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0
      };
      
      bookingSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const status = data.status as string;
        if (stats[status] !== undefined) {
          stats[status]++;
        }
      });
      
      return stats;
    } catch (error: any) {
      console.error('Error fetching booking status stats:', error);
      throw new Error(error.message);
    }
  },
  
  // Отримати найпопулярніші маршрути
  getPopularRoutes: async (limit = 5): Promise<Array<{
    routeId: string;
    from: string;
    to: string;
    bookingsCount: number;
  }>> => {
    try {
      // Спочатку отримаємо всі бронювання
      const bookingsCol = collection(db, 'bookings');
      const bookingSnapshot = await getDocs(bookingsCol);
      
      // Підрахуємо кількість бронювань для кожного маршруту
      const routeStats: {[key: string]: number} = {};
      bookingSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.routeId) {
          if (!routeStats[data.routeId]) {
            routeStats[data.routeId] = 0;
          }
          routeStats[data.routeId]++;
        }
      });
      
      // Отримаємо інформацію про кожен маршрут
      const popularRoutes = await Promise.all(
        Object.entries(routeStats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(async ([routeId, bookingsCount]) => {
            const route = await routesApi.getRouteById(routeId);
            return {
              routeId,
              from: route?.from || 'Невідомо',
              to: route?.to || 'Невідомо',
              bookingsCount
            };
          })
      );
      
      return popularRoutes;
    } catch (error: any) {
      console.error('Error fetching popular routes:', error);
      throw new Error(error.message);
    }
  }
};

// Ініціалізаційна функція для додавання тестових даних
export const initializeTestData = async (currentUser: User): Promise<void> => {
  try {
    // Перевіряємо чи є маршрути
    const routes = await routesApi.getRoutes();
    
    if (routes.length === 0) {
      // Додаємо тестові маршрути
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];
      
      const testRoutes: Omit<Route, 'id'>[] = [
        {
          from: 'Київ',
          to: 'Львів',
          departureTime: '08:00',
          arrivalTime: '14:30',
          date: tomorrowStr,
          price: 450,
          available: 35,
          duration: '6г 30хв',
          carrier: 'УкрBus',
          busType: 'Комфорт'
        },
        {
          from: 'Київ',
          to: 'Одеса',
          departureTime: '09:30',
          arrivalTime: '17:00',
          date: tomorrowStr,
          price: 500,
          available: 28,
          duration: '7г 30хв',
          carrier: 'УкрBus',
          busType: 'Комфорт'
        },
        {
          from: 'Львів',
          to: 'Київ',
          departureTime: '07:15',
          arrivalTime: '13:45',
          date: tomorrowStr,
          price: 450,
          available: 40,
          duration: '6г 30хв',
          carrier: 'УкрBus',
          busType: 'Стандарт'
        },
        {
          from: 'Одеса',
          to: 'Київ',
          departureTime: '06:30',
          arrivalTime: '14:00',
          date: tomorrowStr,
          price: 500,
          available: 30,
          duration: '7г 30хв',
          carrier: 'УкрBus',
          busType: 'Комфорт'
        },
        {
          from: 'Харків',
          to: 'Київ',
          departureTime: '07:00',
          arrivalTime: '13:00',
          date: tomorrowStr,
          price: 420,
          available: 45,
          duration: '6г 00хв',
          carrier: 'УкрBus',
          busType: 'Стандарт'
        },
        {
          from: 'Київ',
          to: 'Харків',
          departureTime: '10:00',
          arrivalTime: '16:00',
          date: tomorrowStr,
          price: 420,
          available: 38,
          duration: '6г 00хв',
          carrier: 'УкрBus',
          busType: 'Стандарт'
        },
        {
          from: 'Дніпро',
          to: 'Київ',
          departureTime: '08:30',
          arrivalTime: '15:30',
          date: dayAfterTomorrowStr,
          price: 480,
          available: 42,
          duration: '7г 00хв',
          carrier: 'УкрBus',
          busType: 'Комфорт'
        },
        {
          from: 'Київ',
          to: 'Дніпро',
          departureTime: '11:30',
          arrivalTime: '18:30',
          date: dayAfterTomorrowStr,
          price: 480,
          available: 35,
          duration: '7г 00хв',
          carrier: 'УкрBus',
          busType: 'Комфорт'
        }
      ];
      
      // Додаємо маршрути послідовно
      for (const route of testRoutes) {
        await routesApi.addRoute(route);
      }
      
      console.log('Тестові маршрути додано');
    }
    
    // Перевіряємо чи є бронювання у користувача
    const bookings = await bookingsApi.getUserBookings(currentUser.uid);
    
    if (bookings.length === 0 && routes.length > 0) {
      // Додаємо тестове бронювання
      const routeId = routes[0].id!;
      
      await bookingsApi.createBooking({
        routeId,
        userId: currentUser.uid,
        seats: [12, 13],
        totalPrice: routes[0].price * 2,
        status: 'confirmed',
        paymentMethod: 'card',
        passengerInfo: {
          firstName: currentUser.firstName || currentUser.displayName?.split(' ')[0] || '',
          lastName: currentUser.lastName || currentUser.displayName?.split(' ')[1] || '',
          email: currentUser.email || '',
          phone: currentUser.phoneNumber || ''
        }
      });
      
      console.log('Тестове бронювання додано');
    }
  } catch (error) {
    console.error('Error initializing test data:', error);
  }
};