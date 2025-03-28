import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native';
import { Link, useRouter } from 'expo-router';
import TopHeader from '@/components/TopHeader';
import FormField from '@/components/FormField';
import GoBackButton from '@/components/GoBaackButton';
import { validateEmail } from '@/utils';
import { useToast } from '@/context/toastContenxt';
import { getCurrentUser, signIn } from '@/lib/appwrite';
import { useUserContext } from '@/context/userContext';

interface FormState {
  email: string;
  password: string;
  errors: {
    email: string;
    password: string;
  };
}

export default function SignInScreen() {
  const { setIsLogged, refreshUser } = useUserContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
    },
  });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: '',
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setForm((prev) => ({
      ...prev,
      errors: newErrors,
    }));
    return isValid;
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await signIn(form.email, form.password);
        const response = await getCurrentUser();

        if (response) {
          setIsLogged(true);
          refreshUser();
          router.replace('/(tabs)');
          showToast('Success', 'Signed in successfully', 'success');
        }
      } catch (error: any) {
        showToast(
          'Error',
          error.message || 'Failed to sign in. Please try to create an account first.',
          'error',
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <TopHeader />

      <View className="flex-1 px-6 pt-10">
        <Text className="text-white text-4xl font-bold mb-8">Welcome Back</Text>

        <FormField
          title="Email"
          value={form.email}
          placeholder="Enter your email"
          handleChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={form.errors.email}
        />

        <FormField
          title="Password"
          value={form.password}
          placeholder="Enter your password"
          handleChangeText={(text) => handleChange('password', text)}
          otherStyles="mt-4"
          error={form.errors.password}
        />

        <TouchableOpacity
          className="bg-darkAccent px-8 py-4 rounded-lg mt-10 disabled:opacity-50"
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text className="text-white text-xl font-semibold text-center">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-secondaryText">Don't have an account? </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-darkAccent font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
        {!isKeyboardVisible && <GoBackButton />}
      </View>
    </SafeAreaView>
  );
}
