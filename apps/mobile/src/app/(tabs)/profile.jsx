import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Settings, LogOut, Clock, Shield, Bell } from 'lucide-react-native';
import { useAuth } from '@/utils/auth/useAuth';
import useUser from '@/utils/auth/useUser';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, signIn, signOut } = useAuth();
  const { data: user } = useUser();

  const menuItems = [
    {
      icon: Clock,
      title: 'Time Tracking',
      subtitle: 'View your time entries and history',
      onPress: () => {
        // Navigate to timesheet or time tracking
      }
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => {
        // Navigate to notifications settings
      }
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onPress: () => {
        // Navigate to privacy settings
      }
    },
    {
      icon: Settings,
      title: 'App Settings',
      subtitle: 'Configure app preferences',
      onPress: () => {
        // Navigate to app settings
      }
    }
  ];

  if (!isAuthenticated) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#F9FAFB', 
        paddingTop: insets.top,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <User color="#2563EB" size={64} />
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#111827', 
          marginTop: 20,
          marginBottom: 10,
          textAlign: 'center'
        }}>
          Profile
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#6B7280', 
          marginBottom: 30,
          textAlign: 'center'
        }}>
          Please sign in to access your profile
        </Text>
        <TouchableOpacity
          onPress={signIn}
          style={{
            backgroundColor: '#2563EB',
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ 
        backgroundColor: 'white', 
        paddingHorizontal: 20, 
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
          Profile
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={{ 
          backgroundColor: 'white', 
          margin: 20, 
          padding: 24, 
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#2563EB',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <User color="white" size={40} />
          </View>
          
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: 4
          }}>
            {user?.name || 'User'}
          </Text>
          
          <Text style={{ 
            fontSize: 16, 
            color: '#6B7280',
            marginBottom: 16
          }}>
            {user?.email || 'user@example.com'}
          </Text>

          <View style={{
            backgroundColor: '#EFF6FF',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#2563EB',
              fontWeight: '500'
            }}>
              Administrator
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ 
          backgroundColor: 'white', 
          marginHorizontal: 20, 
          marginBottom: 20,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <Icon color="#6B7280" size={20} />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: 2
                  }}>
                    {item.title}
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#6B7280'
                  }}>
                    {item.subtitle}
                  </Text>
                </View>
                
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#D1D5DB',
                  marginLeft: 12
                }} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info */}
        <View style={{ 
          backgroundColor: 'white', 
          marginHorizontal: 20, 
          marginBottom: 20,
          padding: 20, 
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: 16
          }}>
            About OLA Time Clock
          </Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>
              Version
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
              1.0.0
            </Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>
              Build
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
              2025.01.01
            </Text>
          </View>
          
          <Text style={{ 
            fontSize: 12, 
            color: '#9CA3AF',
            textAlign: 'center',
            marginTop: 16
          }}>
            Made in Bangladesh 🇧🇩
          </Text>
        </View>

        {/* Sign Out Button */}
        <View style={{ 
          marginHorizontal: 20, 
          marginBottom: 20 
        }}>
          <TouchableOpacity
            onPress={signOut}
            style={{
              backgroundColor: '#EF4444',
              paddingVertical: 16,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut color="white" size={20} />
            <Text style={{ 
              color: 'white', 
              fontSize: 16, 
              fontWeight: '600', 
              marginLeft: 8 
            }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Support Links */}
        <View style={{ 
          marginHorizontal: 20, 
          marginBottom: 20,
          alignItems: 'center'
        }}>
          <Text style={{ 
            fontSize: 14, 
            color: '#6B7280',
            marginBottom: 12
          }}>
            Need help?
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity>
              <Text style={{ 
                fontSize: 14, 
                color: '#2563EB',
                fontWeight: '500'
              }}>
                Support
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Text style={{ 
                fontSize: 14, 
                color: '#2563EB',
                fontWeight: '500'
              }}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Text style={{ 
                fontSize: 14, 
                color: '#2563EB',
                fontWeight: '500'
              }}>
                Terms
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}