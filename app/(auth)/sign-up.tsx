import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native';
import { Link, router } from 'expo-router';
import TopHeader from '@/components/TopHeader';
import FormField from '@/components/FormField';
import GoBackButton from '@/components/GoBaackButton';
import { useUserContext } from '@/context/userContext';
import { validateEmail, validatePassword } from '@/utils';
import { createUser } from '@/lib/appwrite';
import { useToast } from '@/context/toastContenxt';

interface FormState {
  username: string;
  email: string;
  password: string;
  fullName: string;
  errors: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  };
}

export default function SignUpScreen() {
  const { setIsLogged, refreshUser } = useUserContext();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    errors: {
      username: '',
      email: '',
      password: '',
      fullName: '',
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
      username: '',
      email: '',
      password: '',
      fullName: '',
    };
    let isValid = true;

    if (!form.username.trim() || form.username.length < 3 || form.username.length > 100) {
      newErrors.username = 'Username must be between 3 and 100 characters';
      isValid = false;
    }

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
    } else if (!validatePassword(form.password)) {
      newErrors.password =
        'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
      isValid = false;
    }

    if (!form.fullName.trim() || form.fullName.length < 3 || form.fullName.length > 200) {
      newErrors.fullName = 'Full name must be between 3 and 200 characters';
      isValid = false;
    }

    setForm((prev) => ({
      ...prev,
      errors: newErrors,
    }));
    return isValid;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await createUser(form.email, form.password, form.username, form.fullName);

        if (response) {
          setIsLogged(true);
          refreshUser();
          router.replace('/(tabs)');
          showToast('Success', 'Account created successfully', 'success');
        }
      } catch (error: any) {
        showToast('Error', error.message || 'Failed to create account.', 'error');
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
        <Text className="text-white text-4xl font-bold mb-8">Create Account</Text>

        <View className="flex flex-row gap-2 w-full">
          <FormField
            title="Username"
            value={form.username}
            placeholder="Enter your username"
            handleChangeText={(text) => handleChange('username', text)}
            autoCapitalize="none"
            error={form.errors.username}
            otherStyles="flex-1"
          />

          <FormField
            title="Full Name"
            value={form.fullName}
            placeholder="Enter your full name"
            handleChangeText={(text) => handleChange('fullName', text)}
            autoCapitalize="none"
            otherStyles="flex-1"
            error={form.errors.fullName}
          />
        </View>
        <FormField
          title="Email"
          value={form.email}
          placeholder="Enter your email"
          autoCapitalize="none"
          handleChangeText={(text) => handleChange('email', text)}
          otherStyles="mt-4"
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
          className="bg-darkAccent px-8 py-4 rounded-full mt-10 disabled:opacity-50"
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text className="text-white text-xl font-semibold text-center">
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-secondaryText">Already have an account? </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-darkAccent font-bold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
        {!isKeyboardVisible && <GoBackButton />}
      </View>
    </SafeAreaView>
  );
}
