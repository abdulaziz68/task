import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';

const EngineersScreen: React.FC = () => {
  const [engineers, setEngineers] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    try {
      const response = await axios.get('/engineers');
      setEngineers(response.data);
    } catch (error) {
      console.error('Error loading engineers:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.specialization || 'Engineer'}</Text>
        </View>
        <Text style={[styles.badge, item.status === 'active' ? styles.badgeActive : styles.badgeInactive]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.cardInfo}>📧 {item.email}</Text>
      {item.phone && <Text style={styles.cardInfo}>📱 {item.phone}</Text>}
      {item.company && <Text style={styles.cardInfo}>🏢 {item.company}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Engineers</Text>
        <Text style={styles.headerSubtitle}>المهندسين الخارجيين</Text>
      </View>
      <FlatList
        data={engineers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEngineers} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No engineers found</Text>}
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
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  cardSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  cardInfo: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12 },
  badgeActive: { backgroundColor: '#10b981', color: '#ffffff' },
  badgeInactive: { backgroundColor: '#6b7280', color: '#ffffff' },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 14, padding: 24 },
});

export default EngineersScreen;
