import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальній програмі тут буде код для відправки форми на сервер
    console.log('Form submitted:', formData);
    alert('Повідомлення надіслано! Ми зв\'яжемося з вами найближчим часом.');
    
    // Скидання форми
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-white to-yellow-50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto animate-slide-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Зв'язатися з нами</h1>
            <p className="text-lg text-muted-foreground">
              Маєте питання або відгуки? Наша команда готова допомогти. Зв'яжіться з нами.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto glass rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Contact info */}
              <div className="lg:col-span-2 space-y-8 animate-slide-in">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Контактна інформація</h2>
                  <p className="text-muted-foreground mb-8">
                    Зв'яжіться з нами зручним для вас способом або заповніть форму.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Адреса офісу</h3>
                      <p className="text-sm text-muted-foreground">
                        вул. Транспортна 123, Київ<br />
                        01001, Україна
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Телефони</h3>
                      <p className="text-sm text-muted-foreground">
                        Обслуговування клієнтів: +38 (044) 123-4567<br />
                        Бронювання: +38 (044) 765-4321
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Електронна пошта</h3>
                      <p className="text-sm text-muted-foreground">
                        Загальні запитання: info@ukrtrans.ua<br />
                        Підтримка: support@ukrtrans.ua
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact form */}
              <div className="lg:col-span-3 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше ім'я</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Введіть ваше повне ім'я" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Електронна пошта</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="Введіть вашу електронну пошту" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Тема</Label>
                    <Select 
                      id="subject" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Оберіть тему</option>
                      <option value="booking">Запитання щодо бронювання</option>
                      <option value="feedback">Відгук</option>
                      <option value="complaint">Скарга</option>
                      <option value="partnership">Партнерство</option>
                      <option value="other">Інше</option>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Повідомлення</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Напишіть ваше повідомлення тут..." 
                      rows={6} 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="gap-2">
                    <Send size={18} />
                    <span>Надіслати повідомлення</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Спрощені компоненти
const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
);

const Input = ({ id, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    id={id}
    className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    {...props}
  />
);

const Select = ({ id, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    id={id}
    className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    {...props}
  >
    {children}
  </select>
);

export default Contact;