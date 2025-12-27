import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const StatCard: React.FC<{ title: string; count: number; subtitle: string; color: string }> = ({
    title,
    count,
    subtitle,
    color,
  }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsGrid}>
          <StatCard
            title="Shop Drawings"
            count={stats?.totals?.shopDrawings || 0}
            subtitle="الرسومات التنفيذية"
            color="#3b82f6"
          />
          <StatCard
            title="RFIs"
            count={stats?.totals?.rfis || 0}
            subtitle="الاستفسارات"
            color="#10b981"
          />
          <StatCard
            title="Meetings"
            count={stats?.totals?.meetings || 0}
            subtitle="محاضر الاجتماعات"
            color="#8b5cf6"
          />
          <StatCard
            title="Engineers"
            count={stats?.totals?.engineers || 0}
            subtitle="المهندسين"
            color="#f59e0b"
          />
          <StatCard
            title="Tasks"
            count={stats?.totals?.tasks || 0}
            subtitle="المهام"
            color="#ef4444"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          {stats?.recentTasks?.map((task: any) => (
            <View key={task.id} style={styles.card}>
              <Text style={styles.cardTitle}>{task.title}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.badge}>{task.status}</Text>
                <Text style={styles.badge}>{task.priority}</Text>
              </View>
            </View>
          ))}
          {(!stats?.recentTasks || stats.recentTasks.length === 0) && (
            <Text style={styles.emptyText}>No recent tasks</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  statCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statTitle: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 8,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    padding: 24,
  },
});

export default DashboardScreen;
