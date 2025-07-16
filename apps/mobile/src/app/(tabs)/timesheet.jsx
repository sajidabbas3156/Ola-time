import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, User } from 'lucide-react-native';
import { useAuth } from '@/utils/auth/useAuth';
import useUser from '@/utils/auth/useUser';

export default function TimesheetScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { data: user } = useUser();
  
  const [timeEntries, setTimeEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, currentMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entriesResponse, employeesResponse] = await Promise.all([
        fetch(`/api/timesheet?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`),
        fetch('/api/employees')
      ]);

      if (entriesResponse.ok && employeesResponse.ok) {
        const entriesData = await entriesResponse.json();
        const employeesData = await employeesResponse.json();
        
        setTimeEntries(entriesData);
        setEmployees(employeesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '--';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const getEmployeeCode = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.member_code : 'N/A';
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
        <Calendar color="#2563EB" size={64} />
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#111827', 
          marginTop: 20,
          marginBottom: 10,
          textAlign: 'center'
        }}>
          Timesheet
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#6B7280', 
          marginBottom: 30,
          textAlign: 'center'
        }}>
          Please sign in to view timesheet data
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#F9FAFB', 
        paddingTop: insets.top,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Loading timesheet...</Text>
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
          Timesheet
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={{ 
          flexDirection: 'row', 
          paddingHorizontal: 20, 
          paddingTop: 20,
          gap: 12
        }}>
          <View style={{ 
            flex: 1,
            backgroundColor: 'white', 
            padding: 16, 
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Clock color="#2563EB" size={24} />
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#111827', 
              marginTop: 8 
            }}>
              {timeEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0).toFixed(1)}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              Total Hours
            </Text>
          </View>

          <View style={{ 
            flex: 1,
            backgroundColor: 'white', 
            padding: 16, 
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <User color="#10B981" size={24} />
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#111827', 
              marginTop: 8 
            }}>
              {employees.length}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              Employees
            </Text>
          </View>
        </View>

        {/* Time Entries List */}
        <View style={{ 
          backgroundColor: 'white', 
          marginHorizontal: 20, 
          marginTop: 20,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <View style={{ 
            paddingHorizontal: 20, 
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6'
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: '#111827' 
            }}>
              Recent Entries
            </Text>
          </View>

          {timeEntries.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Calendar color="#9CA3AF" size={48} />
              <Text style={{ 
                fontSize: 16, 
                color: '#6B7280', 
                marginTop: 12,
                textAlign: 'center'
              }}>
                No time entries found for this month
              </Text>
            </View>
          ) : (
            timeEntries.slice(0, 20).map((entry, index) => (
              <View 
                key={entry.id || index} 
                style={{ 
                  paddingHorizontal: 20, 
                  paddingVertical: 16,
                  borderBottomWidth: index < timeEntries.length - 1 ? 1 : 0,
                  borderBottomColor: '#F3F4F6'
                }}
              >
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '600', 
                      color: '#111827',
                      marginBottom: 4
                    }}>
                      {getEmployeeName(entry.employee_id)}
                    </Text>
                    <Text style={{ 
                      fontSize: 12, 
                      color: '#6B7280',
                      marginBottom: 8
                    }}>
                      {getEmployeeCode(entry.employee_id)} • {formatDate(entry.entry_date)}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <View>
                        <Text style={{ fontSize: 11, color: '#6B7280' }}>Clock In</Text>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827' }}>
                          {formatTime(entry.clock_in_time)}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 11, color: '#6B7280' }}>Clock Out</Text>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827' }}>
                          {formatTime(entry.clock_out_time)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ 
                      fontSize: 18, 
                      fontWeight: 'bold', 
                      color: '#111827' 
                    }}>
                      {(entry.total_hours || 0).toFixed(1)}h
                    </Text>
                    
                    {/* Hour type indicators */}
                    <View style={{ flexDirection: 'row', marginTop: 4, gap: 4 }}>
                      {entry.regular_hours > 0 && (
                        <View style={{ 
                          backgroundColor: '#10B981', 
                          paddingHorizontal: 6, 
                          paddingVertical: 2, 
                          borderRadius: 4 
                        }}>
                          <Text style={{ fontSize: 10, color: 'white', fontWeight: '500' }}>
                            REG
                          </Text>
                        </View>
                      )}
                      {entry.daily_ot_hours > 0 && (
                        <View style={{ 
                          backgroundColor: '#F59E0B', 
                          paddingHorizontal: 6, 
                          paddingVertical: 2, 
                          borderRadius: 4 
                        }}>
                          <Text style={{ fontSize: 10, color: 'white', fontWeight: '500' }}>
                            OT
                          </Text>
                        </View>
                      )}
                      {entry.rest_day_ot_hours > 0 && (
                        <View style={{ 
                          backgroundColor: '#8B5CF6', 
                          paddingHorizontal: 6, 
                          paddingVertical: 2, 
                          borderRadius: 4 
                        }}>
                          <Text style={{ fontSize: 10, color: 'white', fontWeight: '500' }}>
                            RD
                          </Text>
                        </View>
                      )}
                      {entry.public_holiday_ot_hours > 0 && (
                        <View style={{ 
                          backgroundColor: '#EF4444', 
                          paddingHorizontal: 6, 
                          paddingVertical: 2, 
                          borderRadius: 4 
                        }}>
                          <Text style={{ fontSize: 10, color: 'white', fontWeight: '500' }}>
                            HOL
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Employee Summary */}
        <View style={{ 
          backgroundColor: 'white', 
          marginHorizontal: 20, 
          marginTop: 20,
          marginBottom: 20,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <View style={{ 
            paddingHorizontal: 20, 
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6'
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: '#111827' 
            }}>
              Employee Summary
            </Text>
          </View>

          {employees.map((employee, index) => {
            const employeeEntries = timeEntries.filter(entry => entry.employee_id === employee.id);
            const totalHours = employeeEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
            
            return (
              <View 
                key={employee.id} 
                style={{ 
                  paddingHorizontal: 20, 
                  paddingVertical: 16,
                  borderBottomWidth: index < employees.length - 1 ? 1 : 0,
                  borderBottomColor: '#F3F4F6'
                }}
              >
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <View>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '600', 
                      color: '#111827' 
                    }}>
                      {employee.name}
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: '#6B7280',
                      marginTop: 2
                    }}>
                      {employee.member_code} • {employeeEntries.length} entries
                    </Text>
                  </View>
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: 'bold', 
                    color: '#111827' 
                  }}>
                    {totalHours.toFixed(1)}h
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}