import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';

const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.description && <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>}
      <View style={styles.cardFooter}>
        <Text style={[styles.badge, getStatusColor(item.status)]}>{item.status}</Text>
        <Text style={[styles.badge, getPriorityColor(item.priority)]}>{item.priority}</Text>
      </View>
      {(item.shop_drawing_title || item.rfi_subject || item.meeting_title || item.engineer_name) && (
        <View style={styles.linkedItems}>
          {item.shop_drawing_title && <Text style={styles.linkedItem}>📐 {item.shop_drawing_title}</Text>}
          {item.rfi_subject && <Text style={styles.linkedItem}>❓ {item.rfi_subject}</Text>}
          {item.meeting_title && <Text style={styles.linkedItem}>📝 {item.meeting_title}</Text>}
          {item.engineer_name && <Text style={styles.linkedItem}>👷 {item.engineer_name}</Text>}
        </View>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { backgroundColor: '#10b981', color: '#ffffff' };
      case 'in_progress': return { backgroundColor: '#3b82f6', color: '#ffffff' };
      default: return { backgroundColor: '#f59e0b', color: '#ffffff' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { backgroundColor: '#ef4444', color: '#ffffff' };
      case 'medium': return { backgroundColor: '#f59e0b', color: '#ffffff' };
      default: return { backgroundColor: '#6b7280', color: '#ffffff' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <Text style={styles.headerSubtitle}>المهام المرتبطة</Text>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#ffffff', padding: 16, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  list: { padding: 16 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#ef4444' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12 },
  linkedItems: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  linkedItem: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 14, padding: 24 },
});

export default TasksScreen;
