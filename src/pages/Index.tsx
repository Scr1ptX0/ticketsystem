import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SearchForm, { SearchParams } from '@/components/SearchForm';
import BookingResults from '@/components/BookingResults';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import { Ticket, Star, Map, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routesApi, Route, initializeTestData } from '@/services/firebaseApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  
  // Ініціалізуємо тестові дані після автентифікації
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      initializeTestData(currentUser).catch(console.error);
    }
  }, [isAuthenticated, currentUser]);
  
  // Функція пошуку маршрутів
  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setIsSearching(true);
    setShowResults(false);
    
    try {
      const foundRoutes = await routesApi.searchRoutes(params.from, params.to, params.date);
      setRoutes(foundRoutes);
      setShowResults(true);
      
      if (foundRoutes.length === 0) {
        toast({
          title: 'Маршрути не знайдено',
          description: 'Спробуйте змінити параметри пошуку або вибрати іншу дату',
        });
      }
    } catch (error) {
      console.error('Помилка пошуку маршрутів:', error);
      toast({
        title: 'Помилка пошуку',
        description: 'Не вдалося завантажити маршрути. Будь ласка, спробуйте ще раз.',
        variant: 'destructive'
      });
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Search Section */}
      <section id="search-section" className="py-16 px-4 relative -mt-24 z-10">
        <SearchForm onSearch={handleSearch} />
      </section>
      
      {/* Loading Indicator */}
      {isSearching && (
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto text-center py-12">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Шукаємо маршрути...</p>
          </div>
        </section>
      )}
      
      {/* Booking Results Section */}
      {showResults && !isSearching && (
        <section className="py-8 px-4">
          <BookingResults routes={routes} searchParams={searchParams} />
        </section>
      )}
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white" ref={featuresRef}>
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Чому обирають УкрТрансBus</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Відчуйте переваги пасажирських перевезень з нашим сучасним автопарком та зручним процесом бронювання.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <FeatureCard 
                title="Зручне бронювання" 
                description="Бронюйте квитки за лічені хвилини з нашим інтуїтивним інтерфейсом."
                icon={Ticket}
              />
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <FeatureCard 
                title="Комфортна подорож" 
                description="Подорожуйте з комфортом у наших сучасних автобусах з професійним обслуговуванням."
                icon={Star}
              />
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <FeatureCard 
                title="Оптимізовані маршрути" 
                description="Ефективні маршрути, розроблені для швидкого та безпечного прибуття до пункту призначення."
                icon={Map}
              />
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.4s' }}>
              <FeatureCard 
                title="Вчасне відправлення" 
                description="Ми цінуємо ваш час. Наші послуги дотримуються суворих розкладів для вашої зручності."
                icon={Clock}
              />
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.5s' }}>
              <FeatureCard 
                title="Безпечна оплата" 
                description="Кілька варіантів оплати з надійним шифруванням для вашого спокою."
                icon={CreditCard}
              />
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.6s' }}>
              <FeatureCard 
                title="Безпечна подорож" 
                description="Ваша безпека - наш пріоритет. Регулярне технічне обслуговування та професійні водії."
                icon={ShieldCheck}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-on-scroll">
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <div className="text-sm text-muted-foreground">Маршрутів</div>
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-primary mb-2">100k+</div>
              <div className="text-sm text-muted-foreground">Задоволених клієнтів</div>
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Автобусів</div>
            </div>
            
            <div className="animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Задоволеність клієнтів</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-yellow-600 rounded-2xl p-12 text-center text-black shadow-xl animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Готові подорожувати?</h2>
            <p className="text-black/80 mb-8 max-w-xl mx-auto">
              Забронюйте свою наступну подорож з УкрТрансBus та відчуйте різницю в комфорті та надійності.
            </p>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Бронювати зараз
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;