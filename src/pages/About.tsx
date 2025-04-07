import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Bus, Map, Users, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-white to-yellow-50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-12 animate-slide-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Про УкрТрансBus</h1>
            <p className="text-lg text-muted-foreground">
              Сучасні пасажирські перевезення з акцентом на комфорт, надійність і задоволеність клієнтів.
            </p>
          </div>
          
          <div className="h-64 md:h-96 max-w-4xl mx-auto bg-gray-200 rounded-2xl glass overflow-hidden animate-slide-in">
            {/* Зображення компанії */}
            <img 
              src="https://www.setra-bus.com/content/dam/sbo/markets/common/models/cc-hd-models/comfort/images/teaser/EB29602-CC-HD-teaser-comfort-01.jpg" 
              alt="Комфортабельний салон автобуса" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Mission section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-on-scroll">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span>Наша місія</span>
              </div>
              <h2 className="text-3xl font-bold">Переосмислення досвіду пасажирських перевезень</h2>
              <p className="text-muted-foreground">
                В УкрТрансBus ми прагнемо надавати винятковий сервіс перевезень, що ставить на перше місце безпеку, комфорт та ефективність. Наша місія — з'єднувати спільноти та надавати подорожуючим надійні, доступні та екологічні рішення для мобільності.
              </p>
              <p className="text-muted-foreground">
                Ми бачимо майбутнє, коли транспортування — це не просто переміщення з пункту А в пункт Б, а приємний досвід, що покращує загальну якість подорожі.
              </p>
              <Link to="/contact">
                <Button className="gap-2 group">
                  <span>Зв'язатися з нами</span>
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6 animate-on-scroll">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <Bus size={24} />
                </div>
                <h3 className="font-semibold mb-2">Сучасний автопарк</h3>
                <p className="text-sm text-muted-foreground">
                  Наші транспортні засоби оснащені новітніми зручностями для комфортної подорожі.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <Map size={24} />
                </div>
                <h3 className="font-semibold mb-2">Розгалужена мережа</h3>
                <p className="text-sm text-muted-foreground">
                  Ми з'єднуємо основні міста та населені пункти зручними маршрутами та розкладами.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <Users size={24} />
                </div>
                <h3 className="font-semibold mb-2">Досвідчена команда</h3>
                <p className="text-sm text-muted-foreground">
                  Наші професійні водії та персонал забезпечують безпечний і приємний досвід.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <Award size={24} />
                </div>
                <h3 className="font-semibold mb-2">Визнаний лідер</h3>
                <p className="text-sm text-muted-foreground">
                  Відзначений за високу якість обслуговування та задоволеність клієнтів.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* History section */}
      <section className="py-20 px-4 bg-white border-y border-border">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>Наша історія</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">Шлях зростання та інновацій</h2>
            <p className="text-muted-foreground">
              З моменту заснування нашої компанії ми присвятили себе вдосконаленню транспортних послуг та розширенню нашого охоплення, щоб обслуговувати більше громад.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto animate-on-scroll">
            {/* Timeline track */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              <TimelineItem 
                year="2022" 
                title="Заснування компанії" 
                description="УкрТрансBus було засновано з метою трансформації пасажирських перевезень." 
              />
              
          
              
              <TimelineItem 
                year="2023" 
                title="Запуск онлайн-бронювання" 
                description="Створено цифрову платформу для зручного бронювання квитків та управління поїздками." 
              />
              
              <TimelineItem 
                year="2024" 
                title="Модернізація автопарку" 
                description="Оновлено весь парк екологічно чистими транспортними засобами з покращеними зручностями." 
              />
              
              <TimelineItem 
                year="2025" 
                title="Запуск преміум-сервісу" 
                description="Представлено преміум-послуги з комфортабельними автобусами та ексклюзивними зручностями." 
                isLast={true}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Fleet section (замість Team section) */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>Наш автопарк</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">Зустрічайте наші комфортабельні автобуси</h2>
            <p className="text-muted-foreground">
              Наш сучасний автопарк забезпечить вам найкращий досвід подорожі з максимальним комфортом та безпекою.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
            {/* Bus images */}
            <BusCard 
              name="Mercedes-Benz Tourismo" 
              description="Преміум-клас з підвищеним комфортом" 
              image="https://www.mercedes-benz-bus.com/content/dam/mbo/markets/common/models/tourismo-rhd/safety/safe-driving/images/teaser/tourismo-rhd-teaser-safety-safe-driving-01-EB43720.jpg" 
            />
            
            <BusCard 
              name="Neoplan Cityliner" 
              description="Міжміський експрес з панорамними вікнами" 
              image="https://i.ytimg.com/vi/WG7x7uSIHGY/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGFYgZSgnMA8=&rs=AOn4CLCUw28x7MYOjUlV7gPfqtbxZguz1Q" 
            />
            
            <BusCard 
              name="Setra ComfortClass" 
              description="Підвищений комфорт для тривалих подорожей" 
              image="https://images.modhoster.de/system/files/0358/3326/huge/setra-517hdh-comfortclass.webp" 
            />
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center max-w-3xl animate-on-scroll">
          <h2 className="text-3xl font-bold mb-6 text-black">Готові відчути різницю з УкрТрансBus?</h2>
          <p className="text-black/80 mb-8 max-w-xl mx-auto">
            Приєднуйтесь до тисяч задоволених клієнтів, які довіряють нам свої транспортні потреби. Бронюйте подорож сьогодні.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="secondary" size="lg" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                Забронювати зараз
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="bg-transparent text-black border-black hover:bg-black/10">
                Зв'язатися з нами
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Компонент для елементів таймлайну
const TimelineItem = ({ 
  year, 
  title, 
  description, 
  isLast = false 
}: { 
  year: string; 
  title: string; 
  description: string; 
  isLast?: boolean;
}) => {
  return (
    <div className="relative">
      {/* Year marker */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center text-sm font-medium">
        {year}
      </div>
      
      {/* Content card */}
      <div className="grid grid-cols-5 gap-8 pt-8">
        <div className="col-span-2 text-right">
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div className="col-span-3">
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {!isLast && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-10 h-full w-0.5 bg-border"></div>
      )}
    </div>
  );
};

// Компонент для автобусів (замість компонента для команди)
const BusCard = ({ 
  name, 
  description, 
  image 
}: { 
  name: string; 
  description: string; 
  image: string;
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border transition-transform hover:-translate-y-2 duration-300">
      <div className="h-48 bg-gray-200">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default About;