import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';

const MeetingsScreen: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const response = await axios.get('/meeting-minutes');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardNumber}>Meeting #{item.meeting_number}</Text>
      <Text style={styles.cardDate}>Date: {new Date(item.meeting_date).toLocaleDateString()}</Text>
      {item.location && <Text style={styles.cardLocation}>📍 {item.location}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meeting Minutes</Text>
        <Text style={styles.headerSubtitle}>محاضر الاجتماعات</Text>
      </View>
      <FlatList
        data={meetings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadMeetings} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No meetings found</Text>}
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
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#8b5cf6' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  cardNumber: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  cardDate: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  cardLocation: { fontSize: 14, color: '#6b7280' },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 14, padding: 24 },
});

export default MeetingsScreen;
