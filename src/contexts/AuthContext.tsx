import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

// Інтерфейс користувача
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
}

// Інтерфейс контексту автентифікації
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

// Створення контексту з початковими значеннями
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  loginWithEmail: async () => { throw new Error('Not implemented'); },
  loginWithGoogle: async () => { throw new Error('Not implemented'); },
  register: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  updateUserProfile: async () => { throw new Error('Not implemented'); },
});

// Hook для використання контексту автентифікації
export const useAuth = () => useContext(AuthContext);

// Provider компонент для надання контексту додатку
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Функція для перетворення даних з Firestore в об'єкт User
  const createUserObject = (
    firebaseUser: FirebaseUser, 
    firestoreData?: DocumentData
  ): User => {
    // Гарантуємо, що роль має правильний тип
    const role = firestoreData?.role === 'admin' ? 'admin' : 'user';

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
      firstName: firestoreData?.firstName || '',
      lastName: firestoreData?.lastName || '',
      role
    };
  };

  // Перевірка наявності користувача при ініціалізації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // Дані користувача з Firestore
            const userData = userDoc.data();
            
            // Створюємо об'єкт User з правильною типізацією
            const user = createUserObject(firebaseUser, userData);
            setCurrentUser(user);
          } else {
            // Якщо немає документа, створюємо базовий профіль
            const userDisplayName = firebaseUser.displayName || '';
            const nameParts = userDisplayName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const userData = {
              role: 'user',
              firstName,
              lastName,
              createdAt: new Date().toISOString()
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            
            const user = createUserObject(firebaseUser, userData);
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          // У випадку помилки використовуємо базові дані
          const user = createUserObject(firebaseUser);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      
      setIsLoading(false);
    });

    // Відписуємося від слухача при розмонтуванні компонента
    return () => unsubscribe();
  }, []);

  // Функція входу з Email/Password
  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const user = createUserObject(result.user, userData);
        return user;
      }
      
      throw new Error('Користувач не знайдений в базі даних');
    } catch (error: any) {
      throw new Error(error.message || 'Помилка входу');
    }
  };

  // Функція входу з Google
  const loginWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Перевіряємо чи користувач вже існує
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Створюємо запис для нового користувача
        const userDisplayName = user.displayName || '';
        const nameParts = userDisplayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        await setDoc(doc(db, 'users', user.uid), {
          role: 'user',
          firstName,
          lastName,
          createdAt: new Date().toISOString()
        });
      }
      
      const userData = userDoc.exists() ? userDoc.data() : { role: 'user' };
      
      const authUser = createUserObject(user, userData);
      return authUser;
    } catch (error: any) {
      throw new Error(error.message || 'Помилка входу через Google');
    }
  };

  // Функція реєстрації
  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<User> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Оновлюємо профіль користувача у Firebase Auth
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Зберігаємо додаткові дані у Firestore
      const userData = {
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      const user = createUserObject(result.user, userData);
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Помилка реєстрації');
    }
  };

  // Функція виходу
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Помилка виходу');
    }
  };

  // Функція оновлення профілю
  const updateUserProfile = async (data: Partial<User>): Promise<void> => {
    if (!currentUser) throw new Error('Користувач не автентифікований');
    
    try {
      const { displayName, photoURL, role, ...dbData } = data;
      
      // Оновлюємо дані в Firebase Auth
      if (auth.currentUser) {
        if (displayName) {
          await updateProfile(auth.currentUser, { displayName });
        }
        
        if (photoURL) {
          await updateProfile(auth.currentUser, { photoURL });
        }
      }
      
      // Оновлюємо дані в Firestore
      if (Object.keys(dbData).length > 0 || role) {
        const updateData: Record<string, any> = { ...dbData };
        
        // Перевіряємо, що роль має допустимі значення
        if (role) {
          updateData.role = role === 'admin' ? 'admin' : 'user';
        }
        
        await setDoc(doc(db, 'users', currentUser.uid), updateData, { merge: true });
      }
      
      // Оновлюємо локальний стан
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error: any) {
      throw new Error(error.message || 'Помилка оновлення профілю');
    }
  };

  // Значення, які надаються контекстом
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isLoading,
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;