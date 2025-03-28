import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import TopHeader from '@/components/TopHeader';
import FormField from '@/components/FormField';
import GoBackButton from '@/components/GoBaackButton';

interface FormState {
  email: string;
  password: string;
  errors: {
    email: string;
    password: string;
  };
}

export default function SignInScreen() {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
    },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: ''
      }
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

    setForm(prev => ({
      ...prev,
      errors: newErrors
    }));
    return isValid;
  };

  const handleSignIn = () => {
    if (validateForm()) {
     // TODO: Handle sign in
    }
  };

  return (
    <View className="flex-1 bg-primary">
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
        />
        {form.errors.email && (
          <Text className="text-red-500 text-sm mt-1">{form.errors.email}</Text>
        )}

        <FormField
          title="Password"
          value={form.password}
          placeholder="Enter your password"
          handleChangeText={(text) => handleChange('password', text)}
          otherStyles="mt-4"
        />
        {form.errors.password && (
          <Text className="text-red-500 text-sm mt-1">{form.errors.password}</Text>
        )}

        <TouchableOpacity
          className="bg-darkAccent px-8 py-4 rounded-full mt-10"
          onPress={handleSignIn}
        >
          <Text className="text-white text-xl font-semibold text-center">Sign In</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-secondaryText">Don't have an account? </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-darkAccent font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <GoBackButton href="/" />
      </View>
    </View>
  );
}
