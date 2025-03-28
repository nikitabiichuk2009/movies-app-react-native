import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import CustomAlert from '@/components/CustomAlert';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: 'error' | 'success' | 'warning') => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
    type: 'error',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  useEffect(() => {
    if (toast.show) {
      animateIn();
    }
  }, [toast.show]);

  const showToast = (
    title: string,
    message: string,
    type: 'error' | 'success' | 'warning' = 'error',
  ) => {
    setToast({ show: true, title, message, type });

    // Hide toast after 3 seconds
    setTimeout(() => {
      animateOut(() => {
        setToast((prev) => ({ ...prev, show: false }));
      });
    }, 3000);
  };

  const hideToast = () => {
    animateOut(() => {
      setToast((prev) => ({ ...prev, show: false }));
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.show && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
          }}
        >
          <CustomAlert
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
