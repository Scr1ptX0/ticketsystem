import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, PhoneCall, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">У</span>
              </div>
              <span className="font-semibold text-xl">УкрТрансBus</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Сучасні рішення пасажирських перевезень з акцентом на комфорт, надійність та задоволеність клієнтів.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-black transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-black transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-black transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Швидкі посилання</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Головна</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Про нас</Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Контакти</Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Маршрути</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Контакти</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  вул. Транспортна 123, Київ, 01001, Україна
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall size={18} className="text-primary" />
                <span className="text-muted-foreground text-sm">+38 (073) 33-4308</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span className="text-muted-foreground text-sm">info@ukrtrans.ua</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Підписка</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Підпишіться на нашу розсилку для отримання останніх оновлень та спеціальних пропозицій.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Ваша електронна пошта" 
                className="px-4 py-2 bg-secondary rounded-l-lg flex-grow text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit" 
                className="bg-primary text-black rounded-r-lg px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
              >
                Підписатися
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} УкрТрансBus. Усі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;