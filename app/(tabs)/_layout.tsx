import { HeaderLinks, tintColor } from '@/constants/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useUserContext } from '@/context/userContext';

export default function TabsLayout() {
  const { user } = useUserContext();
  const hasNotifications =
    user?.notifications && Array.isArray(user.notifications) && user.notifications.length > 0;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#0F0D23',
          borderRadius: 50,
          marginHorizontal: 10,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#0F0D23',
        },
      }}
    >
      {HeaderLinks.map((link: { href: string; title: string; icon: any; iconFilled?: any }) => {
        const isNotificationsPage = link.href === 'notifications';

        const icon = isNotificationsPage && hasNotifications ? link.iconFilled : link.icon;

        return (
          <Tabs.Screen
            key={link.href}
            name={link.href}
            options={{
              title: link.title,
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <View
                  className={`flex flex-row min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden ${
                    focused ? 'bg-violetStart' : 'bg-transparent'
                  }`}
                >
                  <Image
                    source={icon}
                    className="size-5"
                    style={{ tintColor: focused ? '#151312' : tintColor }}
                  />
                  {focused && (
                    <Text className="text-secondary text-base font-semibold ml-2">
                      {link.title}
                    </Text>
                  )}
                </View>
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
