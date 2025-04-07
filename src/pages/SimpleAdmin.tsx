import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { routesApi, bookingsApi, Route } from '../services/firebaseApi';
import { format } from 'date-fns';

const SimpleAdmin = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Форма для додавання маршруту
  const [newRoute, setNewRoute] = useState({
    from: '',
    to: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    departureTime: '08:00',
    arrivalTime: '14:30',
    price: 450,
    available: 35,
    duration: '6г 30хв',
    carrier: 'УкрТрансBus',
    busType: 'Комфорт'
  });
  
  // Завантаження маршрутів
  useEffect(() => {
    loadRoutes();
  }, []);
  
  const loadRoutes = async () => {
    try {
      setLoading(true);
      const routesData = await routesApi.getRoutes();
      setRoutes(routesData);
    } catch (error) {
      console.error('Помилка завантаження маршрутів:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити маршрути',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Обробка зміни полів форми
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Якщо поле числове, перетворюємо значення на число
    if (name === 'price' || name === 'available') {
      setNewRoute(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setNewRoute(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Додавання маршруту
  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await routesApi.addRoute(newRoute);
      
      toast({
        title: 'Успіх',
        description: 'Маршрут успішно додано',
      });
      
      // Очищаємо форму
      setNewRoute({
        from: '',
        to: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        departureTime: '08:00',
        arrivalTime: '14:30',
        price: 450,
        available: 35,
        duration: '6г 30хв',
        carrier: 'УкрТрансBus',
        busType: 'Комфорт'
      });
      
      // Оновлюємо список маршрутів
      loadRoutes();
      
    } catch (error: any) {
      console.error('Помилка додавання маршруту:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося додати маршрут',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Видалення маршруту
  const handleDeleteRoute = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей маршрут?')) return;
    
    try {
      setLoading(true);
      await routesApi.deleteRoute(id);
      
      toast({
        title: 'Успіх',
        description: 'Маршрут успішно видалено',
      });
      
      // Оновлюємо список маршрутів
      loadRoutes();
      
    } catch (error: any) {
      console.error('Помилка видалення маршруту:', error);
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося видалити маршрут',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 px-4 bg-gradient-to-br from-white to-yellow-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Проста адмін-панель</h1>
              <Link to="/" className="text-primary hover:underline">← На головну</Link>
            </div>
            
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
              <h2 className="text-xl font-bold mb-4">Додати новий маршрут</h2>
              
              <form onSubmit={handleAddRoute} className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Звідки</label>
                    <Input 
                      name="from"
                      value={newRoute.from}
                      onChange={handleInputChange}
                      placeholder="Місто відправлення"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Куди</label>
                    <Input 
                      name="to"
                      value={newRoute.to}
                      onChange={handleInputChange}
                      placeholder="Місто прибуття"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Дата</label>
                    <Input 
                      name="date"
                      type="date"
                      value={newRoute.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Час відправлення</label>
                    <Input 
                      name="departureTime"
                      value={newRoute.departureTime}
                      onChange={handleInputChange}
                      placeholder="08:00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Час прибуття</label>
                    <Input 
                      name="arrivalTime"
                      value={newRoute.arrivalTime}
                      onChange={handleInputChange}
                      placeholder="14:30"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ціна (₴)</label>
                    <Input 
                      name="price"
                      type="number"
                      value={newRoute.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Кількість місць</label>
                    <Input 
                      name="available"
                      type="number"
                      value={newRoute.available}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Тривалість</label>
                    <Input 
                      name="duration"
                      value={newRoute.duration}
                      onChange={handleInputChange}
                      placeholder="6г 30хв"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Перевізник</label>
                    <Input 
                      name="carrier"
                      value={newRoute.carrier}
                      onChange={handleInputChange}
                      placeholder="УкрТранс"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Тип автобуса</label>
                    <Input 
                      name="busType"
                      value={newRoute.busType}
                      onChange={handleInputChange}
                      placeholder="Комфорт"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Додавання...' : 'Додати маршрут'}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
              <h2 className="text-xl font-bold mb-4">Існуючі маршрути</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
                  <span>Завантаження...</span>
                </div>
              ) : routes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary text-left">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Маршрут</th>
                        <th className="p-2 border">Дата</th>
                        <th className="p-2 border">Ціна</th>
                        <th className="p-2 border">Місця</th>
                        <th className="p-2 border">Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map(route => (
                        <tr key={route.id} className="hover:bg-secondary/50">
                          <td className="p-2 border">{route.id?.substring(0, 8)}...</td>
                          <td className="p-2 border">{route.from} → {route.to}</td>
                          <td className="p-2 border">{route.date}</td>
                          <td className="p-2 border">{route.price} ₴</td>
                          <td className="p-2 border">{route.available}</td>
                          <td className="p-2 border">
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => route.id && handleDeleteRoute(route.id)}
                            >
                              Видалити
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Маршрути відсутні. Додайте перший маршрут.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SimpleAdmin;