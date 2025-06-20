import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video as LucideIcon, ChevronRight } from 'lucide-react-native';

interface SettingsItemProps {
  title: string;
  icon: LucideIcon;
  hasArrow?: boolean;
  isDestructive?: boolean;
}

export function SettingsItem({ title, icon: Icon, hasArrow = true, isDestructive = false }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftContainer}>
        <Icon 
          size={20} 
          color={isDestructive ? '#EF4444' : '#6B7280'} 
        />
        <Text style={[styles.title, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
      </View>
      {hasArrow && (
        <ChevronRight size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginLeft: 16,
  },
  destructiveText: {
    color: '#EF4444',
  },
});