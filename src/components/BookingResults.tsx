import { useState } from 'react';
import { Clock, Calendar, Users, CreditCard, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type Route, bookingsApi } from '@/services/firebaseApi';
import { SearchParams } from './SearchForm';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

interface BookingResultsProps {
  routes: Route[];
  searchParams: SearchParams | null;
}

const BookingResults = ({ routes, searchParams }: BookingResultsProps) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerDetails, setPassengerDetails] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // State для dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Обробник вибору маршруту
  const handleSelectRoute = (route: Route) => {
    if (!isAuthenticated) {
      toast({
        title: 'Необхідна авторизація',
        description: 'Будь ласка, увійдіть до системи, щоб продовжити бронювання',
      });
      navigate('/auth');
      return;
    }
    
    setSelectedRoute(route);
    setIsDialogOpen(true);
    setBookingStep(1);
    setSelectedSeats([]);
    setShowSuccessMessage(false);
    
    // Оновити дані пасажира з користувача, якщо доступно
    if (currentUser) {
      setPassengerDetails({
        firstName: currentUser.firstName || currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.lastName || currentUser.displayName?.split(' ')[1] || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || ''
      });
    }
  };

  // Функція оформлення бронювання
  const handlePayment = async () => {
    if (!currentUser || !selectedRoute || !selectedRoute.id || selectedSeats.length === 0) {
      toast({
        title: 'Помилка бронювання',
        description: 'Не вдалося завершити бронювання. Перевірте вибрані дані.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Створюємо бронювання
      const newBookingId = await bookingsApi.createBooking({
        routeId: selectedRoute.id,
        userId: currentUser.uid,
        seats: selectedSeats,
        totalPrice: selectedRoute.price * selectedSeats.length,
        status: 'pending',
        paymentMethod,
        passengerInfo: {
          firstName: passengerDetails.firstName,
          lastName: passengerDetails.lastName,
          email: passengerDetails.email,
          phone: passengerDetails.phone
        }
      });
      
      setBookingId(newBookingId);
      setShowSuccessMessage(true);
      
      toast({
        title: 'Успішне бронювання',
        description: 'Ваше бронювання успішно оформлено!',
      });
    } catch (error: any) {
      console.error('Помилка бронювання:', error);
      toast({
        title: 'Помилка бронювання',
        description: error.message || 'Не вдалося завершити бронювання',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Обробник вибору місця
  const handleSeatSelection = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < (searchParams?.passengers || 5)) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        toast({
          title: 'Ліміт місць',
          description: `Ви можете вибрати максимум ${searchParams?.passengers || 5} місць`,
        });
      }
    }
  };

  // Обробник зміни даних пасажира
  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassengerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Генерація схеми місць
  const renderSeats = () => {
    // Simple 4-column layout for 40 seats
    const seats = [];
    for (let i = 1; i <= 40; i++) {
      const isSelected = selectedSeats.includes(i);
      const isAisle = i % 4 === 0 || i % 4 === 1;
      
      seats.push(
        <button
          key={i}
          type="button"
          className={`h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-primary text-black'
              : 'bg-secondary hover:bg-secondary/80'
          } ${isAisle ? 'mr-4' : ''}`}
          onClick={() => handleSeatSelection(i)}
        >
          {i}
        </button>
      );
      
      if (i % 4 === 0 && i !== 40) {
        seats.push(<div key={`row-${i/4}`} className="w-full h-2" />);
      }
    }
    
    return <div className="grid grid-cols-4 gap-2">{seats}</div>;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {routes.length > 0 
          ? `Доступні маршрути: ${routes.length}` 
          : 'Доступні маршрути'}
      </h2>
      
      {routes.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg text-center">
          <p className="text-muted-foreground">Маршрути не знайдено. Спробуйте змінити параметри пошуку.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((route) => (
            <div 
              key={route.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 transition-all hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline" className="bg-primary/10">
                      {route.busType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{route.carrier}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Відправлення</p>
                      <p className="text-2xl font-bold">{route.departureTime}</p>
                      <p className="text-sm">{route.from}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-full h-0.5 bg-gray-200 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1">
                          <Clock size={16} className="text-primary" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{route.duration}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Прибуття</p>
                      <p className="text-2xl font-bold">{route.arrivalTime}</p>
                      <p className="text-sm">{route.to}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        {route.date ? format(parseISO(route.date), 'PP', { locale: uk }) : route.date}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users size={14} className="mr-1" />
                      <span>Вільно: {route.available} місць</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 text-right">
                  <p className="text-sm text-muted-foreground">Ціна від</p>
                  <p className="text-3xl font-bold">{route.price} ₴</p>
                  <Button 
                    className="mt-4 w-full md:w-auto gap-2 ml-4"
                    onClick={() => handleSelectRoute(route)}
                    disabled={route.available < 1}
                  >
                    <span>Обрати</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    {/* Booking Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Бронювання квитка</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setIsDialogOpen(false)}
              >
                <X size={16} />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {showSuccessMessage ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Оплата успішна!</h3>
                <p className="text-muted-foreground mb-6">
                  Ваш квиток успішно заброньовано. Деталі відправлено на вашу електронну пошту.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Закрити
                  </Button>
                  {bookingId && (
                    <Button variant="outline" onClick={() => navigate(`/profile`)}>
                      Мої поїздки
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <Progress value={bookingStep * 33.33} className="h-2" />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>Місця</span>
                    <span>Дані</span>
                    <span>Оплата</span>
                  </div>
                </div>
                
                {selectedRoute && (
                  <div className="mb-6 p-4 bg-secondary/50 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-2 md:mb-0">
                        <p className="text-sm text-muted-foreground">Маршрут</p>
                        <p className="font-medium">{selectedRoute.from} – {selectedRoute.to}</p>
                      </div>
                      <div className="mb-2 md:mb-0">
                        <p className="text-sm text-muted-foreground">Дата і час</p>
                        <p className="font-medium">
                          {selectedRoute.date ? format(parseISO(selectedRoute.date), 'PP', { locale: uk }) : selectedRoute.date}, {selectedRoute.departureTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Вартість</p>
                        <p className="font-medium">{selectedRoute.price * (selectedSeats.length || 1)} ₴</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Tabs value={`step-${bookingStep}`}>
                  <TabsContent value="step-1" className="space-y-4">
                    <h3 className="text-lg font-medium">Оберіть місця</h3>
                    <div className="p-4 border rounded-lg overflow-x-auto">
                      <div className="flex justify-center mb-6">
                        <div className="w-20 h-6 bg-secondary rounded flex items-center justify-center text-xs">
                          Водій
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-[40vh]">
                        {renderSeats()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        Обрано місць: <span className="font-medium">{selectedSeats.length}</span>
                      </div>
                      <Button 
                        onClick={() => setBookingStep(2)}
                        disabled={selectedSeats.length === 0}
                      >
                        Продовжити
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="step-2" className="space-y-4">
                    <h3 className="text-lg font-medium">Інформація про пасажира</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ім'я</Label>
                        <input
                          id="firstName"
                          name="firstName"
                          className="w-full px-3 py-2 border rounded-md"
                          value={passengerDetails.firstName}
                          onChange={handlePassengerChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Прізвище</Label>
                        <input
                          id="lastName"
                          name="lastName"
                          className="w-full px-3 py-2 border rounded-md"
                          value={passengerDetails.lastName}
                          onChange={handlePassengerChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="w-full px-3 py-2 border rounded-md"
                          value={passengerDetails.email}
                          onChange={handlePassengerChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <input
                          id="phone"
                          name="phone"
                          className="w-full px-3 py-2 border rounded-md"
                          value={passengerDetails.phone}
                          onChange={handlePassengerChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setBookingStep(1)}>
                        Назад
                      </Button>
                      <Button 
                        onClick={() => setBookingStep(3)}
                        disabled={!passengerDetails.firstName || !passengerDetails.lastName || !passengerDetails.email || !passengerDetails.phone}
                      >
                        Продовжити
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="step-3" className="space-y-4">
                    <h3 className="text-lg font-medium">Спосіб оплати</h3>
                    <div className="p-4 border rounded-lg">
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2">
                            <CreditCard size={18} />
                            <span>Банківська картка</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="googlePay" id="googlePay" />
                          <Label htmlFor="googlePay">Google Pay</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="applePay" id="applePay" />
                          <Label htmlFor="applePay">Apple Pay</Label>
                        </div>
                      </RadioGroup>
                      
                      {paymentMethod === 'card' && (
                        <div className="mt-4 p-4 border rounded-lg space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Номер картки</Label>
                            <input
                              id="cardNumber"
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Термін дії</Label>
                              <input
                                id="expiryDate"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <input
                                id="cvv"
                                type="password"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setBookingStep(2)}>
                        Назад
                      </Button>
                      <Button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Обробка...
                          </>
                        ) : (
                          <>Оплатити {selectedRoute?.price ? selectedRoute.price * selectedSeats.length : 0} ₴</>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingResults;