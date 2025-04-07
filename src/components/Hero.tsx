import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-yellow-50 -z-10" />
      
      {/* Decorative shapes */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-40 -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div 
            className={`space-y-6 ${loaded ? 'animate-slide-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.1s' }}
          >
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-sm font-medium text-black ring-1 ring-inset ring-yellow-700/10">
                Нова функція
                <span className="ml-1 h-1 w-1 rounded-full bg-black"></span>
                <span className="ml-1">Оптимізація маршрутів</span>
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Подорожуйте 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                {" "}розумно
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Відкрийте для себе зручні подорожі з нашою сучасною системою бронювання. 
              Знаходьте маршрути, купуйте квитки та керуйте своєю подорожжю за кілька кліків.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="group">
                <span>Забронювати</span>
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link to="/about">
                <Button variant="outline" size="lg">Дізнатися більше</Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full ring-2 ring-white bg-slate-300"
                    style={{ 
                      backgroundImage: `url(https://randomuser.me/api/portraits/men/${i + 10}.jpg)`,
                      backgroundSize: 'cover' 
                    }}
                  />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">2,000+</span> задоволених пасажирів цього місяця
              </div>
            </div>
          </div>
          
          <div 
            className={`relative ${loaded ? 'animate-slide-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.3s' }}
          >
            {/* Main image with glass morphism effect */}
            <div className="relative mx-auto max-w-md">
              {/* Bus image with direct internet link */}
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 shadow-xl glass">
                <img 
                  src="https://ae04.alicdn.com/kf/S0346cfc66d12446e86db832a30c626ecA.jpg" 
                  alt="Сучасний комфортний автобус" 
                  className="w-full h-full object-cover"
                />
              </div>

              
              {/* Floating card elements */}
              <div className="absolute -top-6 -right-6 glass rounded-xl shadow-lg p-4 max-w-[180px] animate-hover">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="rgb(22 163 74)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-xs font-medium">Вчасне прибуття</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass rounded-xl shadow-lg p-4 animate-hover">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black">
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <div>
                    <div className="text-xs font-medium">Задоволеність</div>
                    <div className="text-xs font-medium">клієнтів</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;