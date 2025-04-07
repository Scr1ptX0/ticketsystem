import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Users, ArrowRightLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { routesApi } from '@/services/firebaseApi';
import { addDays, format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';

interface SearchFormProps {
  onSearch?: (params: SearchParams) => void;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [activeTab, setActiveTab] = useState('oneway');
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SearchParams>({
    from: '',
    to: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    passengers: 1
  });

  // Завантаження списку міст з Firebase
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const citiesData = await routesApi.getCities();
        
        // Якщо немає даних в Firebase, використовуємо тестові міста
        if (citiesData.length === 0) {
          setCities([
            "Київ", 
            "Львів", 
            "Одеса", 
            "Харків", 
            "Дніпро", 
            "Запоріжжя", 
            "Вінниця", 
            "Івано-Франківськ", 
            "Тернопіль", 
            "Хмельницький", 
            "Житомир", 
            "Рівне", 
            "Луцьк", 
            "Ужгород",
            "Чернівці"
          ]);
        } else {
          setCities(citiesData);
        }
      } catch (error) {
        console.error('Помилка завантаження міст:', error);
        
        // У разі помилки використовуємо тестові міста
        setCities([
          "Київ", 
          "Львів", 
          "Одеса", 
          "Харків", 
          "Дніпро"
        ]);
        
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити список міст',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCities();
  }, []);

  // Функція для заміни міст місцями
  const swapCities = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  // Обробник для відправки форми
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація форми
    if (!formData.from || !formData.to) {
      toast({
        title: 'Помилка',
        description: 'Будь ласка, виберіть міста відправлення та прибуття',
        variant: 'destructive'
      });
      return;
    }
    
    if (formData.from === formData.to) {
      toast({
        title: 'Помилка',
        description: 'Міста відправлення та прибуття повинні відрізнятися',
        variant: 'destructive'
      });
      return;
    }
    
    // Виклик колбеку для пошуку
    if (onSearch) {
      onSearch(formData);
    }
    
    console.log('Пошук маршруту:', formData);
  };

  return (
    <Card className="mx-auto max-w-5xl shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Тип поїздки */}
            <div className="flex space-x-4">
              <button
                type="button"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === 'oneway' 
                    ? "bg-primary text-black" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
                onClick={() => setActiveTab('oneway')}
              >
                В один бік
              </button>
              <button
                type="button"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === 'roundtrip' 
                    ? "bg-primary text-black" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
                onClick={() => setActiveTab('roundtrip')}
              >
                Туди й назад
              </button>
            </div>
            
            {/* Поля для міст */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              {/* Поле "Звідки" */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium">Звідки</label>
                <Select 
                  value={formData.from} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, from: value }))}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Виберіть місто" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 size={18} className="animate-spin mr-2" />
                        <span>Завантаження...</span>
                      </div>
                    ) : (
                      cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Кнопка для заміни міст місцями */}
              <div className="flex justify-center md:col-span-1 py-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="h-10 w-10 rounded-full p-0"
                  onClick={swapCities}
                  disabled={loading}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="sr-only">Поміняти місцями</span>
                </Button>
              </div>

              {/* Поле "Куди" */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium">Куди</label>
                <Select 
                  value={formData.to} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, to: value }))}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Виберіть місто" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 size={18} className="animate-spin mr-2" />
                        <span>Завантаження...</span>
                      </div>
                    ) : (
                      cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Поля для дати та пасажирів */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Дата поїздки */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={loading}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(new Date(formData.date), 'PP', { locale: uk })
                      ) : (
                        <span>Виберіть дату</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(formData.date)}
                      onSelect={(date) => date && setFormData(prev => ({ 
                        ...prev, 
                        date: format(date, 'yyyy-MM-dd')
                      }))}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 90)}
                      initialFocus
                      locale={uk}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Return date field - only shown for round-trip */}
              {activeTab === 'roundtrip' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Дата повернення</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={loading}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Виберіть дату</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={new Date()}
                        onSelect={() => {}}
                        disabled={(date) => date < new Date() || date > addDays(new Date(), 90)}
                        initialFocus
                        locale={uk}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              {/* Пасажири */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Пасажири</label>
                <Select 
                  value={formData.passengers.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, passengers: parseInt(value) }))}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Users size={18} className="mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Кількість" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'пасажир' : num >= 2 && num <= 4 ? 'пасажири' : 'пасажирів'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Кнопка пошуку */}
            <Button type="submit" className="w-full md:w-auto md:px-8 gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Пошук...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Знайти рейси</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Допоміжні компоненти
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("mx-auto glass rounded-2xl", className)}>
    {children}
  </div>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("", className)}>
    {children}
  </div>
);

export default SearchForm;