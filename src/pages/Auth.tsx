import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Lock, User, LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, register, isAuthenticated } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
    // Якщо користувач вже автентифікований, перенаправляємо на профіль
    if (isAuthenticated) {
      navigate('/profile');
    }
    
    // Перевірка URL параметрів для реєстрації
    const params = new URLSearchParams(location.search);
    setIsRegisterMode(params.get('register') === 'true');
  }, [location, isAuthenticated, navigate]);
  
  // Обробка зміни полів форми
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Перемикання між режимами входу та реєстрації
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    
    // Оновлюємо URL без перезавантаження сторінки
    const url = new URL(window.location.href);
    if (!isRegisterMode) {
      url.searchParams.set('register', 'true');
    } else {
      url.searchParams.delete('register');
    }
    window.history.pushState({}, '', url.toString());
  };
  
  // Обробка входу через Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      navigate('/profile');
      toast({
        title: "Успішний вхід",
        description: "Ви увійшли за допомогою Google",
      });
    } catch (error: any) {
      toast({
        title: "Помилка входу",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обробка подання форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проста валідація
    if (!formData.email || !formData.password) {
      toast({
        title: "Помилка валідації",
        description: "Будь ласка, заповніть усі обов'язкові поля",
        variant: "destructive",
      });
      return;
    }
    
    if (isRegisterMode) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Помилка валідації",
          description: "Паролі не співпадають",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.firstName || !formData.lastName) {
        toast({
          title: "Помилка валідації",
          description: "Будь ласка, введіть ім'я та прізвище",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setIsLoading(true);
      
      if (isRegisterMode) {
        await register(formData.email, formData.password, formData.firstName, formData.lastName);
        toast({
          title: "Успішна реєстрація",
          description: "Ваш обліковий запис створено успішно",
        });
      } else {
        await loginWithEmail(formData.email, formData.password);
        toast({
          title: "Успішний вхід",
          description: "Ви успішно увійшли в систему",
        });
      }
      
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: isRegisterMode ? "Помилка реєстрації" : "Помилка входу",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20 bg-gradient-to-br from-white to-yellow-50">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8 hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>Назад на головну</span>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isRegisterMode ? 'Створити обліковий запис' : 'Ласкаво просимо назад'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isRegisterMode 
                  ? 'Приєднуйтесь до УкрТрансBus для швидшого бронювання та управління подорожами' 
                  : 'Увійдіть, щоб отримати доступ до свого облікового запису та керувати своїми поїздками'}
              </p>
            </div>
            
            {/* Кнопка входу через Google */}
            <Button 
              variant="outline" 
              className="w-full mb-6 flex items-center gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                <path d="M20 12H18C18 15.3137 15.3137 18 12 18V20C16.4183 20 20 16.4183 20 12Z" fill="currentColor" />
                <path d="M20 6L10 6L10 12H14C14 15.3137 11.3137 18 8 18V20C12.4183 20 16 16.4183 16 12H20V6Z" fill="currentColor" />
              </svg>
              <span>Увійти через Google</span>
            </Button>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  або {isRegisterMode ? 'зареєструйтесь' : 'увійдіть'} за допомогою електронної пошти
                </span>
              </div>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegisterMode && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">Ім'я</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="firstName"
                        name="firstName"
                        placeholder="Введіть ваше ім'я"
                        className="w-full pl-10 px-3 py-2 border rounded-md"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Прізвище</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="lastName"
                        name="lastName"
                        placeholder="Введіть ваше прізвище"
                        className="w-full pl-10 px-3 py-2 border rounded-md"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Електронна пошта</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Введіть вашу електронну пошту"
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Пароль</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Введіть ваш пароль"
                    className="w-full pl-10 px-3 py-2 border rounded-md"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {isRegisterMode && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">Підтвердження пароля</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Підтвердіть ваш пароль"
                      className="w-full pl-10 px-3 py-2 border rounded-md"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
              
              {!isRegisterMode && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4"
                    />
                    <label htmlFor="remember" className="text-sm font-normal">Запам'ятати мене</label>
                  </div>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Забули пароль?
                  </Link>
                </div>
              )}
              
              <Button 
                className="w-full" 
                size="lg" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    {isRegisterMode ? 'Зареєструватися' : 'Увійти'}
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                {isRegisterMode 
                  ? 'Вже маєте обліковий запис?' 
                  : "Не маєте облікового запису?"}
                {' '}
                <button 
                  onClick={toggleMode} 
                  className="text-primary font-medium hover:underline"
                  disabled={isLoading}
                >
                  {isRegisterMode ? 'Увійти' : 'Зареєструватися'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;