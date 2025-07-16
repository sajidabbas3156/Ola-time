import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, LogIn, LogOut, User, Calendar } from 'lucide-react-native';
import { useAuth } from '@/utils/auth/useAuth';
import useUser from '@/utils/auth/useUser';

export default function ClockScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, signIn } = useAuth();
  const { data: user, loading: userLoading } = useUser();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees();
      fetchTodayEntries();
    }
  }, [isAuthenticated]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTodayEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/time-entries?date=${today}`);
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const handleClockAction = async (action) => {
    if (!selectedEmployee) {
      Alert.alert('Error', 'Please select an employee first');
      return;
    }

    setLoading(true);
    try {
      const endpoint = action === 'in' ? '/api/time-entries' : '/api/time-entries/clock-out';
      const method = 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          member_code: selectedEmployee.member_code,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert(
          'Success', 
          `${selectedEmployee.name} clocked ${action} successfully at ${currentTime.toLocaleTimeString()}`
        );
        fetchTodayEntries();
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || `Failed to clock ${action}`);
      }
    } catch (error) {
      console.error(`Error clocking ${action}:`, error);
      Alert.alert('Error', `Failed to clock ${action}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeStatus = (employee) => {
    const todayEntry = timeEntries.find(entry => 
      entry.employee_id === employee.id && !entry.clock_out_time
    );
    return todayEntry ? 'clocked-in' : 'clocked-out';
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (time) => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        <Clock color="#2563EB" size={64} />
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#111827', 
          marginTop: 20,
          marginBottom: 10,
          textAlign: 'center'
        }}>
          OLA Time Clock
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#6B7280', 
          marginBottom: 30,
          textAlign: 'center'
        }}>
          Please sign in to access the time clock
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

  if (userLoading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#F9FAFB', 
        paddingTop: insets.top,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Loading...</Text>
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
          Time Clock
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          Welcome back, {user?.name}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Current Time Display */}
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
          <Clock color="#2563EB" size={48} />
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            color: '#111827', 
            marginTop: 16 
          }}>
            {formatTime(currentTime)}
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#6B7280', 
            marginTop: 8 
          }}>
            {formatDate(currentTime)}
          </Text>
        </View>

        {/* Employee Selection */}
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
            Select Employee
          </Text>
          
          {employees.map((employee) => {
            const status = getEmployeeStatus(employee);
            const isSelected = selectedEmployee?.id === employee.id;
            
            return (
              <TouchableOpacity
                key={employee.id}
                onPress={() => setSelectedEmployee(employee)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 8,
                  backgroundColor: isSelected ? '#EFF6FF' : '#F9FAFB',
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? '#2563EB' : '#E5E7EB',
                }}
              >
                <User color={isSelected ? '#2563EB' : '#6B7280'} size={24} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: isSelected ? '#2563EB' : '#111827' 
                  }}>
                    {employee.name}
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#6B7280', 
                    marginTop: 2 
                  }}>
                    {employee.member_code}
                  </Text>
                </View>
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor: status === 'clocked-in' ? '#10B981' : '#6B7280'
                }}>
                  <Text style={{ 
                    fontSize: 12, 
                    color: 'white', 
                    fontWeight: '500' 
                  }}>
                    {status === 'clocked-in' ? 'IN' : 'OUT'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clock In/Out Buttons */}
        {selectedEmployee && (
          <View style={{ 
            marginHorizontal: 20, 
            marginBottom: 20 
          }}>
            <View style={{ 
              flexDirection: 'row', 
              gap: 12 
            }}>
              <TouchableOpacity
                onPress={() => handleClockAction('in')}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: '#10B981',
                  paddingVertical: 16,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <LogIn color="white" size={20} />
                <Text style={{ 
                  color: 'white', 
                  fontSize: 16, 
                  fontWeight: '600', 
                  marginLeft: 8 
                }}>
                  Clock In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleClockAction('out')}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: '#EF4444',
                  paddingVertical: 16,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading ? 0.6 : 1
                }}
              >
                <LogOut color="white" size={20} />
                <Text style={{ 
                  color: 'white', 
                  fontSize: 16, 
                  fontWeight: '600', 
                  marginLeft: 8 
                }}>
                  Clock Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Today's Activity */}
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
            Today's Activity
          </Text>
          
          {timeEntries.length === 0 ? (
            <Text style={{ color: '#6B7280', textAlign: 'center', padding: 20 }}>
              No activity today
            </Text>
          ) : (
            timeEntries.slice(0, 5).map((entry, index) => {
              const employee = employees.find(emp => emp.id === entry.employee_id);
              return (
                <View key={index} style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  paddingVertical: 12,
                  borderBottomWidth: index < timeEntries.length - 1 ? 1 : 0,
                  borderBottomColor: '#F3F4F6'
                }}>
                  <Calendar color="#6B7280" size={16} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#111827' }}>
                      {employee?.name} clocked {entry.clock_out_time ? 'out' : 'in'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                      {new Date(entry.clock_in_time).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}