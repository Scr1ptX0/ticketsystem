import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  User, Settings, Ticket, CreditCard, Bell, LogOut, 
  ChevronRight, Save
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { bookingsApi } from '@/services/firebaseApi';
import { useEffect } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isLoading, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('trips');
  const [isUpdating, setIsUpdating] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);
  
  // Дані форми профілю
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || '',
  });
  
  // Оновлюємо форму, коли користувач завантажиться
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
      });
    }
  }, [currentUser]);
  
  // Завантаження бронювань користувача з Firestore
  useEffect(() => {
    if (currentUser && activeTab === 'trips') {
      const fetchBookings = async () => {
        setFetchingBookings(true);
        try {
          const bookingsRef = collection(db, 'bookings');
          const q = query(bookingsRef, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          
          const bookingsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setBookings(bookingsData);
        } catch (error) {
          console.error('Помилка завантаження бронювань:', error);
          toast({
            title: 'Помилка',
            description: 'Не вдалося завантажити ваші бронювання',
            variant: 'destructive'
          });
        } finally {
          setFetchingBookings(false);
        }
      };
      
      fetchBookings();
    }
  }, [currentUser, activeTab]);
  
  // Обробка виходу з системи
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: 'Успішний вихід',
        description: 'Ви вийшли з системи'
      });
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  // Обробка зміни полів форми
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обробка оновлення профілю
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setIsUpdating(true);
      
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      
      toast({
        title: 'Профіль оновлено',
        description: 'Ваші дані успішно збережено'
      });
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Обробка скасування бронювання
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsApi.cancelBooking(bookingId);
      // Оновлюємо список бронювань
      setBookings(prevBookings => prevBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
      
      toast({
        title: 'Бронювання скасовано',
        description: 'Ваше бронювання успішно скасовано.',
      });
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося скасувати бронювання: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  
  // Показуємо екран завантаження
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-yellow-50">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }
  
  // Перенаправляємо на сторінку входу, якщо користувач не автентифікований
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 px-4 bg-gradient-to-br from-white to-yellow-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-white/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {/* Sidebar */}
              <div className="bg-secondary/50 p-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || ''} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {currentUser?.firstName?.[0] || currentUser?.displayName?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-lg">
                    {currentUser?.displayName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                </div>
                
                <nav className="space-y-1">
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'trips' ? 'bg-primary text-black' : 'hover:bg-secondary/80 transition-colors'}`}
                    onClick={() => setActiveTab('trips')}
                  >
                    <Ticket size={18} />
                    <span>Мої подорожі</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                  
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'payment' ? 'bg-primary text-black' : 'hover:bg-secondary/80 transition-colors'}`}
                    onClick={() => setActiveTab('payment')}
                  >
                    <CreditCard size={18} />
                    <span>Способи оплати</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                  
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'notifications' ? 'bg-primary text-black' : 'hover:bg-secondary/80 transition-colors'}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell size={18} />
                    <span>Сповіщення</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                  
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'account' ? 'bg-primary text-black' : 'hover:bg-secondary/80 transition-colors'}`}
                    onClick={() => setActiveTab('account')}
                  >
                    <Settings size={18} />
                    <span>Налаштування</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                  
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-secondary/80 transition-colors mt-8"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span>Вийти</span>
                  </button>
                </nav>
              </div>
              
              {/* Content */}
              <div className="col-span-3 p-8">
                {activeTab === 'trips' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6">Мої подорожі</h2>
                    
                    {fetchingBookings ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="inline-block animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
                        <span>Завантаження подорожей...</span>
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg overflow-hidden bg-white">
                            <div className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center mb-2">
                                    <div className="text-lg font-semibold">{booking.route?.from} – {booking.route?.to}</div>
                                    <div className="ml-3 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                                      {booking.status === 'confirmed' ? 'Підтверджено' : 
                                       booking.status === 'pending' ? 'В очікуванні' : 
                                       booking.status === 'cancelled' ? 'Скасовано' : 
                                       'Завершено'}
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-3">
                                    {new Date(booking.route?.date).toLocaleDateString('uk-UA')} | {booking.route?.departureTime}
                                  </div>
                                  <div className="text-sm">
                                    {booking.seats?.length} {booking.seats?.length === 1 ? 'місце' : 
                                                            booking.seats?.length > 1 && booking.seats?.length < 5 ? 'місця' : 'місць'}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold">{booking.totalPrice} ₴</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Заброньовано: {new Date(booking.bookingDate).toLocaleDateString('uk-UA')}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <div className="bg-secondary/50 px-6 py-3 flex justify-end">
                                <Button variant="outline" size="sm" className="mr-2">Деталі</Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-500"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Скасувати
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white border rounded-lg p-6 text-center">
                        <p className="text-muted-foreground mb-4">У вас поки немає запланованих подорожей.</p>
                        <Button onClick={() => navigate('/')}>Забронювати подорож</Button>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'account' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6">Налаштування облікового запису</h2>
                    <div className="bg-white border rounded-lg p-6">
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium">Ім'я</label>
                            <input 
                              id="firstName" 
                              name="firstName"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                              value={formData.firstName} 
                              onChange={handleInputChange}
                              disabled={isUpdating}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium">Прізвище</label>
                            <input 
                              id="lastName" 
                              name="lastName"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                              value={formData.lastName} 
                              onChange={handleInputChange}
                              disabled={isUpdating}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Електронна пошта</label>
                            <input 
                              id="email" 
                              name="email"
                              type="email" 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" 
                              value={formData.email} 
                              disabled={true}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Електронну пошту не можна змінити</p>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">Телефон</label>
                            <input 
                              id="phone" 
                              name="phone"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                              value={formData.phone} 
                              onChange={handleInputChange}
                              disabled={isUpdating}
                            />
                          </div>
                        </div>
                        <Button type="submit" disabled={isUpdating} className="gap-2">
                          {isUpdating ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Оновлення...</span>
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              <span>Оновити профіль</span>
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
                
                {activeTab === 'payment' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6">Способи оплати</h2>
                    <div className="bg-white border rounded-lg p-6">
                      <p className="text-muted-foreground mb-6">Додайте спосіб оплати для швидкого оформлення бронювань.</p>
                      <Button>Додати спосіб оплати</Button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'notifications' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6">Сповіщення</h2>
                    <div className="bg-white border rounded-lg p-6">
                      <p className="text-muted-foreground">Наразі немає нових сповіщень.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;