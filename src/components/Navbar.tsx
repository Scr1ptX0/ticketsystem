import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Успішний вихід',
        description: 'Ви вийшли з системи'
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Помилка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-xl">У</span>
          </div>
          <span className="font-semibold text-xl">УкрТрансBus</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Головна
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
            Про нас
          </Link>
          <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Контакти
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || ''} 
                      className="w-5 h-5 rounded-full" 
                    />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="max-w-[120px] truncate">
                    {currentUser?.displayName || 
                     (currentUser?.firstName && currentUser?.lastName) ? 
                       `${currentUser.firstName} ${currentUser.lastName}` : 
                       'Профіль'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Мій акаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Профіль
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile?tab=trips')}>
                  Мої поїздки
                </DropdownMenuItem>
                {currentUser?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Панель адміністратора
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut size={16} className="mr-2" />
                  <span>Вийти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <User size={16} />
                  <span>Увійти</span>
                </Button>
              </Link>
              <Link to="/auth?register=true">
                <Button size="sm">Реєстрація</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-lg shadow-lg animate-fade-in">
          <div className="flex flex-col gap-4 p-6">
            <Link 
              to="/" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Головна
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Про нас
            </Link>
            <Link 
              to="/faq" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Контакти
            </Link>
            <hr className="my-2" />
            
            {isLoading ? (
              <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
            ) : isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-sm font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Мій профіль
                </Link>
                <Link 
                  to="/profile?tab=trips" 
                  className="text-sm font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Мої поїздки
                </Link>
                {currentUser?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium py-2 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Адмін панель
                  </Link>
                )}
                <button 
                  className="flex items-center gap-2 text-sm font-medium py-2 text-red-500 hover:text-red-600 transition-colors"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Вийти</span>
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/auth" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Увійти</Button>
                </Link>
                <Link to="/auth?register=true" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Реєстрація</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;