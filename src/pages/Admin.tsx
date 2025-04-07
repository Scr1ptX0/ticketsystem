import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, Plus, Edit, Trash2, Search, 
  Calendar, ArrowUpDown, RefreshCw, Eye
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { routesApi, bookingsApi, Route, Booking } from '../services/firebaseApi';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('routes');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Стан для пошуку/фільтрації
  const [searchQuery, setSearchQuery] = useState('');
  
  // Стан діалогів
  const [isAddRouteDialogOpen, setIsAddRouteDialogOpen] = useState(false);
  const [isEditRouteDialogOpen, setIsEditRouteDialogOpen] = useState(false);
  const [isDeleteRouteDialogOpen, setIsDeleteRouteDialogOpen] = useState(false);
  const [isViewBookingDialogOpen, setIsViewBookingDialogOpen] = useState(false);
  
  // Дані для редагування
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  
  // Завантаження даних при зміні вкладки
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'routes') {
          const routesData = await routesApi.getRoutes();
          setRoutes(routesData);
        } else if (activeTab === 'bookings') {
          const allBookingsData = await bookingsApi.getAllBookings();
          setBookings(allBookingsData);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        toast({
          title: 'Помилка завантаження даних',
          description: `Не вдалося завантажити ${activeTab === 'routes' ? 'маршрути' : 'бронювання'}`,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, refreshTrigger]);
  
  // Функція для оновлення даних
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Форма для маршруту
  const [routeForm, setRouteForm] = useState<Omit<Route, 'id'>>(getEmptyRouteForm());
  
  // Функція для створення пустої форми маршруту
  function getEmptyRouteForm(): Omit<Route, 'id'> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      from: '',
      to: '',
      departureTime: '08:00',
      arrivalTime: '14:30',
      date: format(tomorrow, 'yyyy-MM-dd'),
      price: 450,
      available: 35,
      duration: '6г 30хв',
      carrier: 'УльтраBus',
      busType: 'Комфорт'
    };
  }
  
  // Функція для відкриття діалогу додавання маршруту
  const openAddRouteDialog = () => {
    setRouteForm(getEmptyRouteForm());
    setIsAddRouteDialogOpen(true);
  };
  
  // Функція для відкриття діалогу редагування маршруту
  const openEditRouteDialog = (route: Route) => {
    setCurrentRoute(route);
    setRouteForm({
      from: route.from,
      to: route.to,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      date: route.date,
      price: route.price,
      available: route.available,
      duration: route.duration,
      carrier: route.carrier,
      busType: route.busType
    });
    setIsEditRouteDialogOpen(true);
  };
  
  // Функція для відкриття діалогу видалення маршруту
  const openDeleteRouteDialog = (route: Route) => {
    setCurrentRoute(route);
    setIsDeleteRouteDialogOpen(true);
  };
  
  // Функція для відкриття діалогу перегляду бронювання
  const openViewBookingDialog = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsViewBookingDialogOpen(true);
  };
  
  // Функція для зміни форми маршруту
  const handleRouteFormChange = (field: keyof Omit<Route, 'id'>, value: any) => {
    setRouteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Функція для додавання маршруту
  const handleAddRoute = async () => {
    try {
      setLoading(true);
      await routesApi.addRoute(routeForm);
      toast({
        title: 'Маршрут додано',
        description: `Маршрут ${routeForm.from} - ${routeForm.to} успішно додано`,
      });
      setIsAddRouteDialogOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error adding route:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати маршрут',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Функція для оновлення маршруту
  const handleUpdateRoute = async () => {
    if (!currentRoute || !currentRoute.id) return;
    
    try {
      setLoading(true);
      await routesApi.updateRoute(currentRoute.id, routeForm);
      toast({
        title: 'Маршрут оновлено',
        description: `Маршрут ${routeForm.from} - ${routeForm.to} успішно оновлено`,
      });
      setIsEditRouteDialogOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error updating route:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити маршрут',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Функція для видалення маршруту
  const handleDeleteRoute = async () => {
    if (!currentRoute || !currentRoute.id) return;
    
    try {
      setLoading(true);
      await routesApi.deleteRoute(currentRoute.id);
      toast({
        title: 'Маршрут видалено',
        description: `Маршрут ${currentRoute.from} - ${currentRoute.to} успішно видалено`,
      });
      setIsDeleteRouteDialogOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити маршрут',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Фільтрація маршрутів за пошуковим запитом
  const filteredRoutes = routes.filter(route => {
    const searchLower = searchQuery.toLowerCase();
    return (
      route.from.toLowerCase().includes(searchLower) ||
      route.to.toLowerCase().includes(searchLower) ||
      route.date.includes(searchLower) ||
      route.carrier.toLowerCase().includes(searchLower) ||
      route.busType.toLowerCase().includes(searchLower)
    );
  });
  
  // Фільтрація бронювань за пошуковим запитом
  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchQuery.toLowerCase();
    const fromTo = booking.route ? `${booking.route.from}-${booking.route.to}`.toLowerCase() : '';
    return (
      fromTo.includes(searchLower) ||
      booking.status.toLowerCase().includes(searchLower) ||
      booking.userId.toLowerCase().includes(searchLower) ||
      booking.paymentMethod.toLowerCase().includes(searchLower) ||
      (booking.passengerInfo?.email && booking.passengerInfo.email.toLowerCase().includes(searchLower)) ||
      (booking.passengerInfo?.firstName && booking.passengerInfo.firstName.toLowerCase().includes(searchLower)) ||
      (booking.passengerInfo?.lastName && booking.passengerInfo.lastName.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 px-4 bg-gradient-to-br from-white to-yellow-50">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/" className="text-primary hover:text-primary/80">
                <ChevronLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold">Панель адміністратора</h1>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
              {/* Вкладки */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="routes">Маршрути</TabsTrigger>
                    <TabsTrigger value="bookings">Бронювання</TabsTrigger>
                    <TabsTrigger value="stats">Статистика</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={refreshData}
                      disabled={loading}
                    >
                      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </Button>
                    <div className="relative w-64">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Пошук..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {activeTab === 'routes' && (
                      <Button onClick={openAddRouteDialog} disabled={loading}>
                        <Plus size={16} className="mr-2" />
                        Додати маршрут
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Вміст вкладки "Маршрути" */}
                <TabsContent value="routes" className="min-h-[50vh]">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="inline-block animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
                      <span>Завантаження маршрутів...</span>
                    </div>
                  ) : filteredRoutes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead className="w-auto">
                              <div className="flex items-center">
                                Звідки-Куди
                                <ArrowUpDown size={14} className="ml-1" />
                              </div>
                            </TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>
                              <div className="flex items-center">
                                Відправлення
                                <ArrowUpDown size={14} className="ml-1" />
                              </div>
                            </TableHead>
                            <TableHead>Прибуття</TableHead>
                            <TableHead>
                              <div className="flex items-center">
                                Ціна (₴)
                                <ArrowUpDown size={14} className="ml-1" />
                              </div>
                            </TableHead>
                            <TableHead>
                              <div className="flex items-center">
                                Місця
                                <ArrowUpDown size={14} className="ml-1" />
                              </div>
                            </TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Дії</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRoutes.map((route) => (
                            <TableRow key={route.id} className="hover:bg-secondary/50">
                              <TableCell className="font-mono text-xs">{route.id?.substring(0, 8)}...</TableCell>
                              <TableCell className="font-medium">{route.from} → {route.to}</TableCell>
                              <TableCell>
                                {route.date && format(parseISO(route.date), 'dd.MM.yyyy', { locale: uk })}
                              </TableCell>
                              <TableCell>{route.departureTime}</TableCell>
                              <TableCell>{route.arrivalTime}</TableCell>
                              <TableCell>{route.price}</TableCell>
                              <TableCell>{route.available}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-primary/10">
                                  {route.busType}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => openEditRouteDialog(route)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => openDeleteRouteDialog(route)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 'Маршрути за заданими критеріями не знайдено' : 'Маршрути відсутні. Додайте новий маршрут.'}
                      </p>
                      <Button onClick={openAddRouteDialog}>
                        <Plus size={16} className="mr-2" />
                        Додати маршрут
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Вміст вкладки "Бронювання" */}
                <TabsContent value="bookings" className="min-h-[50vh]">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="inline-block animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
                      <span>Завантаження бронювань...</span>
                    </div>
                  ) : filteredBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Маршрут</TableHead>
                            <TableHead>Пасажир</TableHead>
                            <TableHead>Дата бронювання</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Місця</TableHead>
                            <TableHead>Сума (₴)</TableHead>
                            <TableHead>Дії</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.map((booking) => (
                            <TableRow key={booking.id} className="hover:bg-secondary/50">
                              <TableCell className="font-mono text-xs">{booking.id?.substring(0, 8)}...</TableCell>
                              <TableCell>
                                {booking.route ? (
                                  <>
                                    <span className="font-medium">{booking.route.from} → {booking.route.to}</span>
                                    <div className="text-xs text-muted-foreground">
                                      {booking.route.date && format(parseISO(booking.route.date), 'dd.MM.yyyy', { locale: uk })}, {booking.route.departureTime}
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">Невідомий маршрут</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {booking.passengerInfo ? (
                                  <>
                                    <span className="font-medium">
                                      {booking.passengerInfo.firstName} {booking.passengerInfo.lastName}
                                    </span>
                                    <div className="text-xs text-muted-foreground">{booking.passengerInfo.email}</div>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">Немає даних</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {booking.bookingDate && format(new Date(booking.bookingDate), 'dd.MM.yyyy', { locale: uk })}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  booking.status === 'confirmed' ? 'default' : 
                                  booking.status === 'pending' ? 'outline' :
                                  booking.status === 'cancelled' ? 'destructive' : 
                                  'secondary'
                                }>
                                  {booking.status === 'confirmed' ? 'Підтверджено' : 
                                   booking.status === 'pending' ? 'В очікуванні' : 
                                   booking.status === 'cancelled' ? 'Скасовано' : 
                                   'Завершено'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {booking.seats.join(', ')} 
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({booking.seats.length})
                                </span>
                              </TableCell>
                              <TableCell>{booking.totalPrice}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => openViewBookingDialog(booking)}
                                  >
                                    <Eye size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchQuery ? 'Бронювання за заданими критеріями не знайдено' : 'Бронювання відсутні'}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Вміст вкладки "Статистика" */}
                <TabsContent value="stats" className="min-h-[50vh]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                      title="Маршрути" 
                      value={routes.length.toString()}
                      description="Загальна кількість маршрутів"
                    />
                    <StatCard 
                      title="Бронювання" 
                      value={bookings.length.toString()}
                      description="Загальна кількість бронювань"
                    />
                    <StatCard 
                      title="Дохід" 
                      value={`${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)} ₴`}
                      description="Загальний дохід від бронювань"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                      <h3 className="text-lg font-semibold mb-4">Статус бронювань</h3>
                      <div className="space-y-4">
                        {[
                          { status: 'confirmed', label: 'Підтверджено' },
                          { status: 'pending', label: 'В очікуванні' },
                          { status: 'cancelled', label: 'Скасовано' },
                          { status: 'completed', label: 'Завершено' }
                        ].map(item => {
                          const count = bookings.filter(b => b.status === item.status).length;
                          const percentage = bookings.length > 0 
                            ? Math.round((count / bookings.length) * 100) 
                            : 0;
                          
                          return (
                            <div key={item.status} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{item.label}</span>
                                <span className="font-medium">{count} ({percentage}%)</span>
                              </div>
                              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    item.status === 'confirmed' ? 'bg-primary' : 
                                    item.status === 'pending' ? 'bg-yellow-500' :
                                    item.status === 'cancelled' ? 'bg-red-500' : 
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                      <h3 className="text-lg font-semibold mb-4">Популярні маршрути</h3>
                      {loading ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="inline-block animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
                          <span>Завантаження...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {routes
                            .map(route => {
                              const bookingsCount = bookings.filter(
                                b => b.routeId === route.id
                              ).length;
                              return { route, bookingsCount };
                            })
                            .sort((a, b) => b.bookingsCount - a.bookingsCount)
                            .slice(0, 5)
                            .map(({ route, bookingsCount }) => (
                              <div key={route.id} className="flex justify-between items-center pb-2 border-b">
                                <div className="space-y-1">
                                  <div className="font-medium">{route.from} → {route.to}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {route.departureTime}, {route.busType}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold">{bookingsCount}</div>
                                  <div className="text-xs text-muted-foreground">бронювань</div>
                                </div>
                              </div>
                            ))}
                            
                            {routes.length === 0 && (
                              <p className="text-muted-foreground text-center">Немає даних для відображення</p>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Діалог додавання маршруту */}
      <Dialog open={isAddRouteDialogOpen} onOpenChange={setIsAddRouteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Додати новий маршрут</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Звідки</label>
                <Input 
                  value={routeForm.from} 
                  onChange={(e) => handleRouteFormChange('from', e.target.value)}
                  placeholder="Місто відправлення"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Куди</label>
                <Input 
                  value={routeForm.to} 
                  onChange={(e) => handleRouteFormChange('to', e.target.value)}
                  placeholder="Місто прибуття"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Дата</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {routeForm.date ? format(parseISO(routeForm.date), 'PP', { locale: uk }) : <span>Виберіть дату</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={routeForm.date ? parseISO(routeForm.date) : undefined}
                    onSelect={(date) => date && handleRouteFormChange('date', format(date, 'yyyy-MM-dd'))}
                    locale={uk}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Час відправлення</label>
                <Input 
                  value={routeForm.departureTime} 
                  onChange={(e) => handleRouteFormChange('departureTime', e.target.value)}
                  placeholder="00:00"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Час прибуття</label>
                <Input 
                  value={routeForm.arrivalTime} 
                  onChange={(e) => handleRouteFormChange('arrivalTime', e.target.value)}
                  placeholder="00:00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Тривалість</label>
              <Input 
                value={routeForm.duration} 
                onChange={(e) => handleRouteFormChange('duration', e.target.value)}
                placeholder="00г 00хв"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ціна (₴)</label>
                <Input 
                  type="number"
                  value={routeForm.price} 
                  onChange={(e) => handleRouteFormChange('price', parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Кількість місць</label>
                <Input 
                  type="number"
                  value={routeForm.available} 
                  onChange={(e) => handleRouteFormChange('available', parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Перевізник</label>
                <Input 
                  value={routeForm.carrier} 
                  onChange={(e) => handleRouteFormChange('carrier', e.target.value)}
                  placeholder="Назва перевізника"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип автобуса</label>
                <Select 
                  value={routeForm.busType} 
                  onValueChange={(value) => handleRouteFormChange('busType', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Виберіть тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Комфорт">Комфорт</SelectItem>
                    <SelectItem value="Стандарт">Стандарт</SelectItem>
                    <SelectItem value="Люкс">Люкс</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddRouteDialogOpen(false)}
              disabled={loading}
            >
              Скасувати
            </Button>
            <Button 
              onClick={handleAddRoute}
              disabled={
                loading || 
                !routeForm.from || 
                !routeForm.to || 
                !routeForm.date || 
                !routeForm.departureTime || 
                !routeForm.arrivalTime
              }
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Додавання...
                </>
              ) : (
                'Додати маршрут'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Діалог редагування маршруту */}
      <Dialog open={isEditRouteDialogOpen} onOpenChange={setIsEditRouteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редагувати маршрут</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Звідки</label>
                <Input 
                  value={routeForm.from} 
                  onChange={(e) => handleRouteFormChange('from', e.target.value)}
                  placeholder="Місто відправлення"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Куди</label>
                <Input 
                  value={routeForm.to} 
                  onChange={(e) => handleRouteFormChange('to', e.target.value)}
                  placeholder="Місто прибуття"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Дата</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {routeForm.date ? format(parseISO(routeForm.date), 'PP', { locale: uk }) : <span>Виберіть дату</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={routeForm.date ? parseISO(routeForm.date) : undefined}
                    onSelect={(date) => date && handleRouteFormChange('date', format(date, 'yyyy-MM-dd'))}
                    locale={uk}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Час відправлення</label>
                <Input 
                  value={routeForm.departureTime} 
                  onChange={(e) => handleRouteFormChange('departureTime', e.target.value)}
                  placeholder="00:00"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Час прибуття</label>
                <Input 
                  value={routeForm.arrivalTime} 
                  onChange={(e) => handleRouteFormChange('arrivalTime', e.target.value)}
                  placeholder="00:00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Тривалість</label>
              <Input 
                value={routeForm.duration} 
                onChange={(e) => handleRouteFormChange('duration', e.target.value)}
                placeholder="00г 00хв"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ціна (₴)</label>
                <Input 
                  type="number"
                  value={routeForm.price} 
                  onChange={(e) => handleRouteFormChange('price', parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Кількість місць</label>
                <Input 
                  type="number"
                  value={routeForm.available} 
                  onChange={(e) => handleRouteFormChange('available', parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Перевізник</label>
                <Input 
                  value={routeForm.carrier} 
                  onChange={(e) => handleRouteFormChange('carrier', e.target.value)}
                  placeholder="Назва перевізника"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип автобуса</label>
                <Select 
                  value={routeForm.busType} 
                  onValueChange={(value) => handleRouteFormChange('busType', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Виберіть тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Комфорт">Комфорт</SelectItem>
                    <SelectItem value="Стандарт">Стандарт</SelectItem>
                    <SelectItem value="Люкс">Люкс</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditRouteDialogOpen(false)}
              disabled={loading}
            >
              Скасувати
            </Button>
            <Button 
              onClick={handleUpdateRoute}
              disabled={
                loading || 
                !routeForm.from || 
                !routeForm.to || 
                !routeForm.date || 
                !routeForm.departureTime || 
                !routeForm.arrivalTime
              }
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Оновлення...
                </>
              ) : (
                'Зберегти зміни'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Діалог видалення маршруту */}
      <Dialog open={isDeleteRouteDialogOpen} onOpenChange={setIsDeleteRouteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Видалення маршруту</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">
              Ви впевнені, що хочете видалити маршрут <strong>{currentRoute?.from} - {currentRoute?.to}</strong>?
            </p>
            <p className="text-muted-foreground text-sm">
              Ця дія не може бути скасована. Всі пов'язані бронювання залишаться, але можуть стати недійсними.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteRouteDialogOpen(false)}
              disabled={loading}
            >
              Скасувати
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteRoute}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Видалення...
                </>
              ) : (
                'Видалити маршрут'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Діалог перегляду бронювання */}
      <Dialog open={isViewBookingDialogOpen} onOpenChange={setIsViewBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Деталі бронювання</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {currentBooking && (
              <div className="space-y-6">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Інформація про маршрут</h3>
                  {currentBooking.route ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Маршрут:</span>
                        <span className="font-medium">{currentBooking.route.from} - {currentBooking.route.to}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Дата:</span>
                        <span>
                          {currentBooking.route.date && format(parseISO(currentBooking.route.date), 'dd.MM.yyyy', { locale: uk })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Відправлення:</span>
                        <span>{currentBooking.route.departureTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Прибуття:</span>
                        <span>{currentBooking.route.arrivalTime}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Інформація про маршрут недоступна
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Деталі бронювання</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID бронювання:</span>
                      <span className="font-mono text-xs">{currentBooking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Статус:</span>
                      <Badge variant={
                        currentBooking.status === 'confirmed' ? 'default' : 
                        currentBooking.status === 'pending' ? 'outline' :
                        currentBooking.status === 'cancelled' ? 'destructive' : 
                        'secondary'
                      }>
                        {currentBooking.status === 'confirmed' ? 'Підтверджено' : 
                         currentBooking.status === 'pending' ? 'В очікуванні' : 
                         currentBooking.status === 'cancelled' ? 'Скасовано' : 
                         'Завершено'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Місця:</span>
                      <span>{currentBooking.seats.join(', ')} ({currentBooking.seats.length})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сума:</span>
                      <span className="font-medium">{currentBooking.totalPrice} ₴</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Спосіб оплати:</span>
                      <span>{currentBooking.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Дата бронювання:</span>
                      <span>
                        {currentBooking.bookingDate && format(new Date(currentBooking.bookingDate), 'dd.MM.yyyy HH:mm', { locale: uk })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {currentBooking.passengerInfo && (
                  <div>
                    <h3 className="font-medium mb-2">Інформація про пасажира</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ім'я:</span>
                        <span>{currentBooking.passengerInfo.firstName} {currentBooking.passengerInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{currentBooking.passengerInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Телефон:</span>
                        <span>{currentBooking.passengerInfo.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewBookingDialogOpen(false)}>
              Закрити
            </Button>
            {currentBooking && currentBooking.status === 'pending' && (
              <Button variant="outline">
                Підтвердити бронювання
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

// Компонент статистичної картки
const StatCard = ({ title, value, description }: { title: string; value: string; description: string }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Admin;