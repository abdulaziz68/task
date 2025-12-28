import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';

const RFIsScreen: React.FC = () => {
  const [rfis, setRfis] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRfis();
  }, []);

  const loadRfis = async () => {
    try {
      const response = await axios.get('/rfis');
      setRfis(response.data);
    } catch (error) {
      console.error('Error loading RFIs:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.subject}</Text>
      <Text style={styles.cardNumber}>RFI #{item.rfi_number}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={[styles.badge, { backgroundColor: '#10b981', color: '#ffffff' }]}>{item.status}</Text>
        <Text style={styles.badge}>{item.priority}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RFIs</Text>
        <Text style={styles.headerSubtitle}>الاستفسارات</Text>
      </View>
      <FlatList
        data={rfis}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRfis} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No RFIs found</Text>}
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
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#10b981' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  cardNumber: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, backgroundColor: '#e5e7eb', color: '#6b7280' },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 14, padding: 24 },
});

export default RFIsScreen;
