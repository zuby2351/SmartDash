import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, LayoutAnimation, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SECTIONS = [
  { title: '📍 Weather', description: '22°C, Sunny' },
  { title: '📆 Calendar', description: 'No events today' },
  { title: '📰 News', description: 'Top headline: SmartDash!' },
  { title: '🚇 TfL Services', description: 'Central Line: Minor delays' },
  { title: '📈 Stock Market', description: 'FTSE 100: ↑ 0.7%' },
  { title: '💬 Daily Quote', description: 'Success is not final, failure is not fatal.' },
  { title: '✅ To-Do List', description: '• Finish SmartDash UI' },
];

export default function HomeScreen() {
  const [isGrid, setIsGrid] = useState(true);

  // Load saved layout mode on mount
  useEffect(() => {
    const loadLayout = async () => {
      const stored = await AsyncStorage.getItem('layout');
      if (stored !== null) setIsGrid(stored === 'grid');
    };
    loadLayout();
  }, []);

  // Save and animate toggle
  const toggleLayout = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newLayout = !isGrid;
    setIsGrid(newLayout);
    await AsyncStorage.setItem('layout', newLayout ? 'grid' : 'list');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with title and action icons */}
      <View style={styles.header}>
        <Text style={styles.title}>SmartDash</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={toggleLayout} style={styles.iconButton}>
            <Ionicons name={isGrid ? 'list-outline' : 'grid-outline'} size={26} color="#333" />
          </TouchableOpacity>
          <Link href="/settings" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={26} color="#333" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Layout toggle */}
      <View style={isGrid ? styles.grid : styles.list}>
        {SECTIONS.map((section, idx) => (
          <View key={idx} style={isGrid ? styles.tile : styles.listItem}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionText}>{section.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const TILE_SIZE = (width - 72) / 2;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  list: {
    flexDirection: 'column',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  listItem: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});
