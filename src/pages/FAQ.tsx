import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const FAQ = () => {
  const [filter, setFilter] = useState('');
  
  // FAQ категорії та питання
  const categories = [
    {
      id: 'booking',
      name: 'Бронювання та квитки',
      faqs: [
        {
          question: 'Як забронювати квиток?',
          answer: 'Ви можете забронювати квитки через наш веб-сайт, мобільний додаток або зателефонувавши до служби підтримки клієнтів. На нашому веб-сайті просто скористайтеся інструментом пошуку, щоб знайти потрібний маршрут, виберіть бажаний час і дотримуйтесь інструкцій з оформлення замовлення.'
        },
        {
          question: 'Чи можу я скасувати або змінити бронювання?',
          answer: 'Так, ви можете скасувати або змінити бронювання не пізніше ніж за 24 години до відправлення. У разі скасування відшкодування буде здійснено відповідно до нашої політики відшкодування. Щоб внести зміни, увійдіть до свого облікового запису та перейдіть до розділу "Мої поїздки" або зверніться до служби підтримки клієнтів.'
        },
        {
          question: 'За скільки часу наперед можна бронювати квитки?',
          answer: 'Ви можете бронювати квитки за 90 днів наперед. Для популярних маршрутів у високий сезон ми рекомендуємо бронювати якомога раніше, щоб забезпечити бажаний час і місце.'
        },
        {
          question: 'Чи потрібно роздруковувати квиток?',
          answer: 'Ні, достатньо мати цифровий квиток на смартфоні. Ви можете показати електронний квиток з електронної пошти або отримати доступ до нього через свій обліковий запис у нашому мобільному додатку. Якщо ви віддаєте перевагу паперовому квитку, ви можете роздрукувати електронний квиток.'
        }
      ]
    },
    {
      id: 'payments',
      name: 'Оплата та повернення коштів',
      faqs: [
        {
          question: 'Які способи оплати приймаються?',
          answer: 'Ми приймаємо всі основні кредитні та дебетові картки (Visa, Mastercard, American Express), PayPal та Apple Pay. Для деяких маршрутів ви також можете оплатити готівкою у визначених касах.'
        },
        {
          question: 'Як працює система повернення коштів?',
          answer: 'Повернення коштів здійснюється відповідно до нашої політики скасування. При скасуванні більш ніж за 48 годин до відправлення ви отримуєте повне відшкодування за вирахуванням невеликої комісії за обробку. При скасуванні в період від 24 до 48 годин ви отримуєте відшкодування 75%. Скасування менш ніж за 24 години до відправлення не відшкодовуються.'
        },
        {
          question: 'Чи є комісія за бронювання?',
          answer: 'За всі транзакції стягується невелика комісія за бронювання для покриття витрат на обробку. Ця комісія чітко відображається перед завершенням покупки.'
        }
      ]
    },
    {
      id: 'travel',
      name: 'Інформація про подорож',
      faqs: [
        {
          question: 'Які зручності доступні на борту?',
          answer: 'Наші транспортні засоби обладнані зручними сидіннями, кондиціонером, Wi-Fi, USB-портами для зарядки та туалетами. На довших маршрутах ми також пропонуємо безкоштовні закуски та напої.'
        },
        {
          question: 'Скільки багажу я можу взяти?',
          answer: 'Кожному пасажиру дозволяється одна одиниця багажу (до 20 кг) для зберігання в багажному відділенні та один невеликий предмет ручної поклажі, який можна помістити під сидіння або на верхню полицю. За додатковий багаж може стягуватися додаткова плата.'
        },
        {
          question: 'Чи передбачені зупинки для відпочинку під час подорожі?',
          answer: 'Для подорожей тривалістю понад 2 години ми включаємо короткі перерви для відпочинку в зручних місцях із необхідними зручностями. Водій оголосить про ці зупинки під час подорожі.'
        },
        {
          question: 'Чи дозволяєте ви перевозити домашніх тварин?',
          answer: 'Дрібні домашні тварини у відповідних переносках дозволені на більшості маршрутів. Службові тварини завжди дозволені. Будь ласка, повідомте нас під час бронювання, якщо ви подорожуватимете з домашньою твариною.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Обліковий запис та програма лояльності',
      faqs: [
        {
          question: 'Як створити обліковий запис?',
          answer: 'Ви можете створити обліковий запис, натиснувши кнопку "Зареєструватися" на нашому веб-сайті або в додатку. Вам потрібно буде вказати свою електронну адресу, створити пароль і заповнити основну особисту інформацію.'
        },
        {
          question: 'Які переваги наявності облікового запису?',
          answer: 'З обліковим записом ви можете легко керувати своїми бронюваннями, зберігати улюблені маршрути, отримувати доступ до історії подорожей, отримувати персоналізовані пропозиції та накопичувати бали в нашій програмі лояльності.'
        },
        {
          question: 'Як працює програма лояльності?',
          answer: 'За кожну подорож ви отримуєте бали, які залежать від вартості квитка. Ці бали можна обміняти на знижки на майбутні поїздки, пріоритетну посадку, безкоштовне перевезення багажу та інші спеціальні привілеї.'
        }
      ]
    }
  ];
  
  // Фільтрування FAQ на основі пошукового запиту
  const filteredCategories = filter
    ? categories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(filter.toLowerCase()) ||
          faq.answer.toLowerCase().includes(filter.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : categories;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-white to-yellow-50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-12 animate-slide-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Часті запитання</h1>
            <p className="text-lg text-muted-foreground">
              Знайдіть відповіді на поширені запитання про наші послуги, процес бронювання та політики.
            </p>
          </div>
          
          {/* Пошуковий рядок */}
          <div className="max-w-2xl mx-auto animate-slide-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Шукати відповіді..."
                className="pl-10 py-6 text-base"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ контент */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Нічого не знайдено за запитом "{filter}"</p>
                <Button variant="outline" onClick={() => setFilter('')}>Очистити пошук</Button>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="animate-on-scroll">
                    <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                    <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`}>
                          <AccordionTrigger className="px-6 hover:no-underline hover:bg-secondary/50 text-left font-medium">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6 pt-2 text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Контактний CTA розділ */}
      <section className="py-16 px-4 bg-white border-t border-border">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-2xl font-bold mb-4">Не знайшли те, що шукали?</h2>
            <p className="text-muted-foreground mb-8">
              Наша команда підтримки готова допомогти з будь-якими запитаннями.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={() => window.location.href = '/contact'}>
                Звернутися до підтримки
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
                На головну
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FAQ;